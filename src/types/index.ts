export type ProfileType = 'local' | 'ssh';

export interface BaseProfile {
    id: string;
    name: string;
    icon?: string;
    type: ProfileType;
}

export interface LocalProfile extends BaseProfile {
    type: 'local';
    command: string;
    args?: string[];
}

export interface SSHProfile extends BaseProfile {
    type: 'ssh';
    host: string;
    port: number;
    username: string;
    identityFile?: string;
}

export type Profile = LocalProfile | SSHProfile;
