
import { Vehicle, TransportSchedule, Driver } from '../types';
import { SEED_FLEET, SEED_SCHEDULES, SEED_DRIVERS } from '../constants';

const KEY_FLEET = 'MAJMA_FLEET';
const KEY_SCHEDULES = 'MAJMA_TRIPS';
const KEY_DRIVERS = 'MAJMA_DRIVERS';

export const getFleet = () => Promise.resolve(JSON.parse(localStorage.getItem(KEY_FLEET) || JSON.stringify(SEED_FLEET)) as Vehicle[]);
export const getSchedules = () => Promise.resolve(JSON.parse(localStorage.getItem(KEY_SCHEDULES) || JSON.stringify(SEED_SCHEDULES)) as TransportSchedule[]);
export const getDrivers = () => Promise.resolve(JSON.parse(localStorage.getItem(KEY_DRIVERS) || JSON.stringify(SEED_DRIVERS)) as Driver[]);
