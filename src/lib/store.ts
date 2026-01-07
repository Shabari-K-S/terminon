import { Store } from '@tauri-apps/plugin-store';
import { SSHProfile } from '../types';

const STORE_PATH = 'store.bin';
const SSH_PROFILES_KEY = 'ssh_profiles';

let store: Store | null = null;

const getStore = async (): Promise<Store> => {
    if (store) return store;
    store = await Store.load(STORE_PATH);
    return store;
};

export const loadSSHProfiles = async (): Promise<SSHProfile[]> => {
    const s = await getStore();
    const val = await s.get<SSHProfile[]>(SSH_PROFILES_KEY);
    return val || [];
};

import { emit } from '@tauri-apps/api/event';

export const saveSSHProfiles = async (profiles: SSHProfile[]) => {
    const s = await getStore();
    await s.set(SSH_PROFILES_KEY, profiles);
    await s.save();
    // Notify listeners that profiles have updated
    await emit('profiles-changed');
};

export const addSSHProfile = async (profile: SSHProfile) => {
    const profiles = await loadSSHProfiles();
    profiles.push(profile);
    await saveSSHProfiles(profiles);
};

export const deleteSSHProfile = async (id: string) => {
    const profiles = await loadSSHProfiles();
    const newProfiles = profiles.filter(p => p.id !== id);
    await saveSSHProfiles(newProfiles);
};
