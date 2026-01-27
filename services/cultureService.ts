
import { CulturalActivity, LibraryResource, KhassaideModule } from '../types';
import { SEED_CULTURAL_ACTIVITIES, SEED_LIBRARY, SEED_KHASSAIDE_MODULES } from '../constants';

const KEY_ACTIVITIES = 'MAJMA_CULT_ACTIVITIES';
const KEY_LIBRARY = 'MAJMA_CULT_LIB';
const KEY_MODULES = 'MAJMA_CULT_MODULES';

export const getCulturalActivities = () => Promise.resolve(JSON.parse(localStorage.getItem(KEY_ACTIVITIES) || JSON.stringify(SEED_CULTURAL_ACTIVITIES)) as CulturalActivity[]);
export const getLibraryResources = () => Promise.resolve(JSON.parse(localStorage.getItem(KEY_LIBRARY) || JSON.stringify(SEED_LIBRARY)) as LibraryResource[]);
export const getKhassaideModules = () => Promise.resolve(JSON.parse(localStorage.getItem(KEY_MODULES) || JSON.stringify(SEED_KHASSAIDE_MODULES)) as KhassaideModule[]);
