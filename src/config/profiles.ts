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
        { id: 'cmd', name: 'Command Prompt', command: 'cmd.exe', icon: 'Console' },
        { id: 'powershell', name: 'PowerShell', command: 'powershell.exe', icon: 'Terminal' },
        { id: 'wsl', name: 'WSL', command: 'wsl', icon: 'linux' }
    );
} else if (platform === 'mac') {
    DEFAULT_PROFILES.push(
        { id: 'default', name: 'Default Shell', command: undefined as any, icon: 'Terminal' },
        { id: 'bash', name: 'Bash', command: 'bash', icon: 'Console' },
        { id: 'zsh', name: 'Zsh', command: 'zsh', icon: 'Terminal' }
    );
} else {
    // Linux and others
    DEFAULT_PROFILES.push(
        { id: 'default', name: 'Default Shell', command: undefined as any, icon: 'Terminal' },
        { id: 'bash', name: 'Bash', command: 'bash', icon: 'Console' }
    );
}
