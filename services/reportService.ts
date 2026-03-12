
import { InternalMeetingReport, CommissionType, MeetingReportStatus } from '../types';
import * as db from './dbService';

export const getAllReports = async (): Promise<InternalMeetingReport[]> => {
  return await db.dbFetchReports();
};

export const getReportsByCommission = async (commission: CommissionType) => {
  const reports = await db.dbFetchReports();
  return reports.filter(r => r.commission === commission);
};

export const getReportsByStatus = async (status: MeetingReportStatus | MeetingReportStatus[]) => {
  const reports = await db.dbFetchReports();
  if (Array.isArray(status)) {
    return reports.filter(r => status.includes(r.status));
  }
  return reports.filter(r => r.status === status);
};

export const createReport = async (report: Partial<InternalMeetingReport>) => {
  const newReport = {
    ...report,
    status: 'brouillon' as MeetingReportStatus,
    createdAt: new Date().toISOString(),
    attendees: report.attendees || [],
    agenda: report.agenda || [],
    decisions: report.decisions || [],
    actionItems: report.actionItems || []
  };

  return await db.dbAddReport(newReport);
};

export const updateReport = async (id: string, updates: Partial<InternalMeetingReport>) => {
  return await db.dbUpdateReport(id, updates);
};

export const submitReportToAdmin = async (reportId: string) => {
  return await updateReport(reportId, { status: 'soumis_admin' });
};

export const validateReportByAdmin = async (reportId: string, feedback?: string) => {
  return await updateReport(reportId, { status: 'valide_admin', adminFeedback: feedback });
};

export const rejectReport = async (reportId: string, feedback: string) => {
  return await updateReport(reportId, { status: 'brouillon', adminFeedback: feedback });
};

export const acknowledgeReportByBureau = async (reportId: string, feedback?: string) => {
  return await updateReport(reportId, { status: 'approuve_bureau', bureauFeedback: feedback });
};

export const deleteReport = async (reportId: string) => {
  return await db.dbDeleteReport(reportId);
};
