
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
    Member, Event, Contribution, AdiyaCampaign, BudgetRequest, CommissionFinancialReport, 
    Task, Vehicle, Driver, TransportSchedule, LibraryResource, SocialCase, SocialProject, 
    TicketItem, InventoryItem, KhassaideModule, Partner, SocialPost, StudyGroup, FundraisingEvent,
    InternalMeetingReport, UserProfile
} from '../types';
import * as db from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface DataContextType {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  adiyaCampaigns: AdiyaCampaign[];
  budgetRequests: BudgetRequest[];
  financialReports: CommissionFinancialReport[];
  tasks: Task[];
  fleet: Vehicle[];
  drivers: Driver[];
  schedules: TransportSchedule[];
  library: LibraryResource[];
  socialCases: SocialCase[];
  socialProjects: SocialProject[];
  tickets: TicketItem[];
  inventory: InventoryItem[];
  khassaideModules: KhassaideModule[];
  partners: Partner[];
  socialPosts: SocialPost[];
  studyGroups: StudyGroup[];
  fundraisingEvents: FundraisingEvent[];
  reports: InternalMeetingReport[];
  totalTreasury: number;
  activeMembersCount: number;
  isLoading: boolean;
  userProfile: UserProfile | null;
  addContribution: (c: any) => Promise<void>;
  updateContribution: (id: string, c: any) => Promise<void>;
  deleteContribution: (id: string) => Promise<void>;
  addTask: (t: any) => Promise<void>;
  updateTask: (id: string, t: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addMember: (m: any) => Promise<void>;
  updateMember: (id: string, m: any) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
  batchApproveMembers: (ids: string[]) => Promise<void>;
  importMembers: (data: any) => Promise<void>;
  addEvent: (e: any) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  addSocialCase: (c: any) => Promise<void>;
  addSocialProject: (p: any) =>