import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bus, Map, Users, Ticket, Wrench, LayoutDashboard, Wallet, FileText,
  Navigation, Calendar, BadgeCheck, Mail, ShieldCheck, User, ArrowLeft,
  ListTodo, MapPin, Clock, Search, QrCode, Download, Trash2, Printer,
  Activity, Fuel, AlertTriangle, Radar, Plus, ClipboardCheck, Lock
} from 'lucide-react';
import FleetManager from './FleetManager';
import TripScheduler from './TripScheduler';
import ReservationConsole from './ReservationConsole';
import TicketingManager from './TicketingManager';
import DriverRoster from './DriverRoster';
import LiveConvoys from './LiveConvoys';
import TransportStats from './TransportStats';
import TripPlannerWizard from './TripPlannerWizard';
import VehicleInspectionModal from './VehicleInspectionModal';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType, TransportSchedule } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getSchedules } from '../../services/transportService';

interface BookedTicket extends TransportSchedule {
  seatId: number;
  bookingId: string;
  bookingDate: string;
}

