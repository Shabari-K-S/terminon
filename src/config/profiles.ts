import { Profile } from '../types';

const getPlatform = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'windows';
    if (ua.includes('Mac')) return 'mac';
    if (ua.includes('Linux')) return 'linux';
    return 'unknown';
};

const platform = getPlatform();

export const DEFAULT_PROFILES: Profile[] = [];

if (platform === 'windows') {
    DEFAULT_PROFILES.push(
        { id: 'cmd', name: 'Command Prompt', command: 'cmd.exe', icon: 'Console', type: 'local' },
        { id: 'powershell', name: 'PowerShell', command: 'powershell.exe', icon: 'Terminal', type: 'local' },
        { id: 'wsl', name: 'WSL', command: 'wsl', icon: 'linux', type: 'local' }
    );
} else if (platform === 'mac') {
    DEFAULT_PROFILES.push(
        { id: 'default', name: 'Default Shell', command: undefined as any, icon: 'Terminal', type: 'local' },
        { id: 'bash', name: 'Bash', command: 'bash', icon: 'Console', type: 'local' },
        { id: 'zsh', name: 'Zsh', command: 'zsh', icon: 'Terminal', type: 'local' }
    );
} else {
    // Linux and others
    DEFAULT_PROFILES.push(
        { id: 'default', name: 'Default Shell', command: undefined as any, icon: 'Terminal', type: 'local' },
        { id: 'bash', name: 'Bash', command: 'bash', icon: 'Console', type: 'local' }
    );
}
