
import { Vehicle, TransportSchedule, Driver } from '@/types';
import { supabase } from '@/lib/supabase';

export const getFleet = async (): Promise<Vehicle[]> => {
  const { data, error } = await supabase.from('vehicles').select('*');
  if (error) return [];
  return data;
};

export const getSchedules = async (): Promise<TransportSchedule[]> => {
  const { data, error } = await supabase.from('trips').select('*');
  if (error) return [];
  return data;
};

export const getDrivers = async (): Promise<Driver[]> => {
  const { data, error } = await supabase.from('drivers').select('*');
  if (error) return [];
  return data;
};
