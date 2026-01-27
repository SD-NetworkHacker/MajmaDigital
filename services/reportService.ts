
import { InternalMeetingReport, CommissionType, MeetingReportStatus } from '../types';
import { SEED_REPORTS } from '../constants';

const STORAGE_KEY = 'MAJMA_REPORTS';

// Helper pour charger/sauvegarder
const loadDB = (): InternalMeetingReport[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : SEED_REPORTS;
};

const saveDB = (data: InternalMeetingReport[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch event pour que le contexte puisse se mettre à jour si besoin
  window.dispatchEvent(new Event('storage'));
};

export const getAllReports = (): InternalMeetingReport[] => {
  return loadDB();
};

export const getReportsByCommission = (commission: CommissionType) => {
  return loadDB().filter(r => r.commission === commission);
};

export const getReportsByStatus = (status: MeetingReportStatus | MeetingReportStatus[]) => {
  const db = loadDB();
  if (Array.isArray(status)) {
    return db.filter(r => status.includes(r.status));
  }
  return db.filter(r => r.status === status);
};

export const createReport = (report: Partial<InternalMeetingReport>) => {
  const db = loadDB();
  const newReport: InternalMeetingReport = {
    ...report,
    id: `RPT-${Date.now()}`,
    status: 'brouillon',
    createdAt: new Date().toISOString(),
    attendees: report.attendees || [],
    agenda: report.agenda || [],
    decisions: report.decisions || [],
    actionItems: report.actionItems || []
  } as InternalMeetingReport;
  
  db.push(newReport);
  saveDB(db);
  return newReport;
};

export const updateReport = (id: string, updates: Partial<InternalMeetingReport>) => {
  const db = loadDB();
  const index = db.findIndex(r => r.id === id);
  if (index !== -1) {
    db[index] = { ...db[index], ...updates };
    saveDB(db);
    return db[index];
  }
  return null;
};

export const submitReportToAdmin = (reportId: string) => {
  const db = loadDB();
  const report = db.find(r => r.id === reportId);
  if (report) {
    report.status = 'soumis_admin';
    saveDB(db);
    return true;
  }
  return false;
};

export const validateReportByAdmin = (reportId: string, feedback?: string) => {
  const db = loadDB();
  const report = db.find(r => r.id === reportId);
  if (report) {
    report.status = 'valide_admin'; 
    report.adminFeedback = feedback;
    saveDB(db);
    return true;
  }
  return false;
};

export const rejectReport = (reportId: string, feedback: string) => {
  const db = loadDB();
  const report = db.find(r => r.id === reportId);
  if (report) {
    report.status = 'brouillon';
    report.adminFeedback = feedback;
    saveDB(db);
    return true;
  }
  return false;
};

export const acknowledgeReportByBureau = (reportId: string, feedback?: string) => {
  const db = loadDB();
  const report = db.find(r => r.id === reportId);
  if (report) {
    report.status = 'approuve_bureau';
    report.bureauFeedback = feedback;
    saveDB(db);
    return true;
  }
  return false;
};

export const deleteReport = (reportId: string) => {
  let db = loadDB();
  const initialLength = db.length;
  db = db.filter(r => r.id !== reportId);
  if (db.length !== initialLength) {
    saveDB(db);
    return true;
  }
  return false;
};
