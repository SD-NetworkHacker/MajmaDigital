
import { 
  CommissionFinancialReport, 
  BudgetRequest, 
  CommissionType,
} from '../types';
import * as db from './dbService';

export const getCommissionReports = async (commission: CommissionType) => {
  const reports = await db.dbFetchFinancialReports();
  return reports.filter(r => r.commission === commission);
};

export const getAllFinancialReports = async () => {
  return await db.dbFetchFinancialReports();
};

export const createReport = async (report: Partial<CommissionFinancialReport>) => {
  const newReport = {
    ...report,
    status: 'brouillon' as const,
    submittedAt: new Date().toISOString(),
    expenses: report.expenses || [],
    totalExpenses: (report.expenses || []).reduce((sum, item) => sum + item.amount, 0),
    balance: (report.totalBudgetAllocated || 0) - ((report.expenses || []).reduce((sum, item) => sum + item.amount, 0))
  };

  return await db.dbAddFinancialReport(newReport);
};

export const getCommissionRequests = async (commission: CommissionType) => {
  const requests = await db.dbFetchBudgetRequests();
  return requests.filter(r => r.commission === commission);
};

export const getAllBudgetRequests = async () => {
  return await db.dbFetchBudgetRequests();
};

export const createBudgetRequest = async (request: Partial<BudgetRequest>) => {
  const totalAmount = (request.breakdown || []).reduce((sum, item) => sum + item.total, 0);
  
  const newRequest = {
    ...request,
    amountRequested: totalAmount,
    status: 'soumis_finance' as const,
    submittedAt: new Date().toISOString()
  };

  return await db.dbAddBudgetRequest(newRequest);
};

export const processRequestDecision = async (requestId: string, decision: 'approve' | 'reject', reviewerRole: 'finance' | 'bureau', amountApproved?: number, reason?: string) => {
  const updates: any = {};
  const THRESHOLD_BUREAU = 50000;

  const requests = await db.dbFetchBudgetRequests();
  const currentReq = requests.find(r => r.id === requestId);
  
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

  return await db.dbUpdateBudgetRequest(requestId, updates);
};

export const processReportDecision = async (reportId: string, decision: 'validate' | 'reject', feedback?: string) => {
  const updates: any = {};
  if (decision === 'validate') {
    updates.status = 'cloture';
  } else {
    updates.status = 'rejete';
  }
  
  return await db.dbUpdateFinancialReport(reportId, updates);
};
