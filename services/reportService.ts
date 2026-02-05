
import { InternalMeetingReport, CommissionType, MeetingReportStatus } from '@/types';
import { supabase } from '@/lib/supabase';

const handleError = (error: any) => {
    if (error) {
        console.error("Supabase Report Error:", error);
        throw new Error(error.message);
    }
};

export const getAllReports = async (): Promise<InternalMeetingReport[]> => {
  const { data, error } = await supabase.from('meeting_reports').select('*');
  if (error) return [];
  return data;
};

export const getReportsByCommission = async (commission: CommissionType) => {
  const { data, error } = await supabase.from('meeting_reports').select('*').eq('commission', commission);
  if (error) return [];
  return data;
};

export const getReportsByStatus = async (status: MeetingReportStatus | MeetingReportStatus[]) => {
  let query = supabase.from('meeting_reports').select('*');
  
  if (Array.isArray(status)) {
    query = query.in('status', status);
  } else {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return [];
  return data;
};

export const createReport = async (report: Partial<InternalMeetingReport>) => {
  const newReport = {
    ...report,
    status: 'brouillon',
    createdAt: new Date().toISOString(),
    attendees: report.attendees || [],
    agenda: report.agenda || [],
    decisions: report.decisions || [],
    actionItems: report.actionItems || []
  };

  const { data, error } = await supabase.from('meeting_reports').insert([newReport]).select().single();
  handleError(error);
  return data;
};

export const updateReport = async (id: string, updates: Partial<InternalMeetingReport>) => {
  const { data, error } = await supabase.from('meeting_reports').update(updates).eq('id', id).select().single();
  handleError(error);
  return data;
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
  const { error } = await supabase.from('meeting_reports').delete().eq('id', reportId);
  handleError(error);
  return true;
};
