
import { 
  CommissionFinancialReport, 
  BudgetRequest, 
  CommissionType,
} from '@/types';
import { supabase } from '@/lib/supabase';

// Helper pour gérer les erreurs
const handleError = (error: any) => {
    if (error) {
        console.error("Supabase Finance Error:", error);
        throw new Error(error.message);
    }
};

export const getCommissionReports = async (commission: CommissionType) => {
  const { data, error } = await supabase
    .from('financial_reports')
    .select('*')
    .eq('commission', commission);
  
  if (error) return [];
  return data;
};

export const getAllFinancialReports = async () => {
  const { data, error } = await supabase.from('financial_reports').select('*');
  if (error) return [];
  return data;
};

export const createReport = async (report: Partial<CommissionFinancialReport>) => {
  const newReport = {
    ...report,
    status: 'brouillon',
    submittedAt: new Date().toISOString(),
    expenses: report.expenses || [],
    totalExpenses: (report.expenses || []).reduce((sum, item) => sum + item.amount, 0),
    balance: (report.totalBudgetAllocated || 0) - ((report.expenses || []).reduce((sum, item) => sum + item.amount, 0))
  };

  const { data, error } = await supabase.from('financial_reports').insert([newReport]).select().single();
  handleError(error);
  return data;
};

export const getCommissionRequests = async (commission: CommissionType) => {
  const { data, error } = await supabase
    .from('budget_requests')
    .select('*')
    .eq('commission', commission);
  if (error) return [];
  return data;
};

export const getAllBudgetRequests = async () => {
  const { data, error } = await supabase.from('budget_requests').select('*');
  if (error) return [];
  return data;
};

export const createBudgetRequest = async (request: Partial<BudgetRequest>) => {
  const totalAmount = (request.breakdown || []).reduce((sum, item) => sum + item.total, 0);
  
  const newRequest = {
    ...request,
    amountRequested: totalAmount,
    status: 'soumis_finance',
    submittedAt: new Date().toISOString()
  };

  const { data, error } = await supabase.from('budget_requests').insert([newRequest]).select().single();
  handleError(error);
  return data;
};

export const processRequestDecision = async (requestId: string, decision: 'approve' | 'reject', reviewerRole: 'finance' | 'bureau', amountApproved?: number, reason?: string) => {
  const updates: any = {};
  const THRESHOLD_BUREAU = 50000;

  const { data: currentReq } = await supabase.from('budget_requests').select('amountRequested').eq('id', requestId).single();
  
  if (!currentReq) return null;

  if (reviewerRole === 'finance') {
    if (decision === 'reject') {
      updates.status = 'rejete';
      updates.rejectionReason = reason;
    } else {
      updates.amountApproved = amountApproved;
      if (currentReq.amountRequested > THRESHOLD_BUREAU) {
        updates.status = 'soumis_bureau';
      } else {
        updates.status = 'approuve';
      }
    }
  } else if (reviewerRole === 'bureau') {
    if (decision === 'reject') {
      updates.status = 'rejete';
      updates.rejectionReason = reason;
    } else {
      updates.status = currentReq.amountRequested === amountApproved ? 'approuve' : 'finance_partiel';
      updates.amountApproved = amountApproved;
    }
  }

  const { data, error } = await supabase.from('budget_requests').update(updates).eq('id', requestId).select().single();
  handleError(error);
  return data;
};

export const processReportDecision = async (reportId: string, decision: 'validate' | 'reject', feedback?: string) => {
  const updates: any = {};
  if (decision === 'validate') {
    updates.status = 'cloture';
  } else {
    updates.status = 'rejete';
  }
  
  const { data, error } = await supabase.from('financial_reports').update(updates).eq('id', reportId).select().single();
  handleError(error);
  return data;
};
