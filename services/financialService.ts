
import { 
  CommissionFinancialReport, 
  BudgetRequest, 
  CommissionType,
  BudgetBreakdownItem,
  ExpenseItem
} from '../types';
import { SEED_FINANCIAL_REPORTS, SEED_BUDGET_REQUESTS } from '../constants';

const KEY_REPORTS = 'MAJMA_FIN_REPORTS';
const KEY_REQUESTS = 'MAJMA_BUDGET_REQS';

const loadData = () => ({
  reports: JSON.parse(localStorage.getItem(KEY_REPORTS) || JSON.stringify(SEED_FINANCIAL_REPORTS)) as CommissionFinancialReport[],
  requests: JSON.parse(localStorage.getItem(KEY_REQUESTS) || JSON.stringify(SEED_BUDGET_REQUESTS)) as BudgetRequest[]
});

const saveReports = (data: CommissionFinancialReport[]) => {
  localStorage.setItem(KEY_REPORTS, JSON.stringify(data));
  window.dispatchEvent(new Event('storage'));
};

const saveRequests = (data: BudgetRequest[]) => {
  localStorage.setItem(KEY_REQUESTS, JSON.stringify(data));
  window.dispatchEvent(new Event('storage'));
};

export const getCommissionReports = (commission: CommissionType) => {
  return loadData().reports.filter(r => r.commission === commission);
};

export const getAllFinancialReports = () => {
  return loadData().reports;
};

export const getPendingReports = () => {
  return loadData().reports.filter(r => r.status === 'soumis' || r.status === 'revu_finance');
};

export const createReport = (report: Partial<CommissionFinancialReport>) => {
  const { reports } = loadData();
  const newReport: CommissionFinancialReport = {
    ...report,
    id: `RPT-${Date.now()}`,
    status: 'brouillon',
    submittedAt: new Date().toISOString(),
    expenses: report.expenses || [],
    totalExpenses: (report.expenses || []).reduce((sum, item) => sum + item.amount, 0),
    balance: (report.totalBudgetAllocated || 0) - ((report.expenses || []).reduce((sum, item) => sum + item.amount, 0))
  } as CommissionFinancialReport;
  
  reports.push(newReport);
  saveReports(reports);
  return newReport;
};

export const getCommissionRequests = (commission: CommissionType) => {
  return loadData().requests.filter(r => r.commission === commission);
};

export const getAllBudgetRequests = () => {
  return loadData().requests;
};

export const getAllPendingRequests = () => {
  return loadData().requests.filter(r => ['soumis_finance', 'revu_finance', 'soumis_bureau'].includes(r.status));
};

export const createBudgetRequest = (request: Partial<BudgetRequest>) => {
  const { requests } = loadData();
  const totalAmount = (request.breakdown || []).reduce((sum, item) => sum + item.total, 0);
  
  const newRequest: BudgetRequest = {
    ...request,
    id: `REQ-${Date.now()}`,
    amountRequested: totalAmount,
    status: 'soumis_finance', // Direct submit for demo flow
    submittedAt: new Date().toISOString()
  } as BudgetRequest;

  requests.push(newRequest);
  saveRequests(requests);
  return newRequest;
};

export const processRequestDecision = (requestId: string, decision: 'approve' | 'reject', reviewerRole: 'finance' | 'bureau', amountApproved?: number, reason?: string) => {
  const { requests } = loadData();
  const index = requests.findIndex(r => r.id === requestId);
  
  if (index === -1) return null;
  const req = requests[index];

  const THRESHOLD_BUREAU = 50000;

  if (reviewerRole === 'finance') {
    if (decision === 'reject') {
      req.status = 'rejete';
      req.rejectionReason = reason;
    } else {
      req.amountApproved = amountApproved || req.amountRequested;
      if (req.amountRequested > THRESHOLD_BUREAU) {
        req.status = 'soumis_bureau';
      } else {
        req.status = 'approuve';
      }
    }
  } else if (reviewerRole === 'bureau') {
    if (decision === 'reject') {
      req.status = 'rejete';
      req.rejectionReason = reason;
    } else {
      req.status = req.amountRequested === amountApproved ? 'approuve' : 'finance_partiel';
      req.amountApproved = amountApproved;
    }
  }

  requests[index] = req; // Update in array
  saveRequests(requests);
  return req;
};

export const processReportDecision = (reportId: string, decision: 'validate' | 'reject', feedback?: string) => {
  const { reports } = loadData();
  const index = reports.findIndex(r => r.id === reportId);
  
  if (index === -1) return null;
  const report = reports[index];

  if (decision === 'validate') {
    report.status = 'cloture';
  } else {
    report.status = 'rejete';
  }
  
  // Note: In a real app we would add feedback comments structure here
  
  reports[index] = report;
  saveReports(reports);
  return report;
};
