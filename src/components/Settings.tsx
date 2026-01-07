import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Monitor, Palette, Server, Trash2, Plus } from 'lucide-react';
import { loadSSHProfiles, addSSHProfile, deleteSSHProfile, loadThemeId, saveThemeId } from '../lib/store';
import { SSHProfile } from '../types';
import { PRESET_THEMES } from '../config/themes';

export const Settings = () => {
  const [sshProfiles, setSshProfiles] = useState<SSHProfile[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState<string>('catppuccin-mocha');

  // Form State
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('22');
  const [username, setUsername] = useState('');
  const [identityFile, setIdentityFile] = useState('');

  const refreshProfiles = () => {
    loadSSHProfiles().then(setSshProfiles);
  };

  useEffect(() => {
    refreshProfiles();
    loadThemeId().then(id => {
      if (id) setCurrentThemeId(id);
    });
  }, []);

  const handleAddProfile = async () => {
    if (!name || !host || !username) return;

    const newProfile: SSHProfile = {
      id: `ssh-${Date.now()}`,
      type: 'ssh',
      name,
      host,
      port: parseInt(port) || 22,
      username,
      identityFile: identityFile || undefined,
      icon: 'Server'
    };

    await addSSHProfile(newProfile);
    refreshProfiles();
    setIsAdding(false);
    resetForm();
  };

  const handleDeleteProfile = async (id: string) => {
    await deleteSSHProfile(id);
    refreshProfiles();
  };

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newId = e.target.value;
    setCurrentThemeId(newId);
    await saveThemeId(newId);
  };

  const resetForm = () => {
    setName('');
    setHost('');
    setPort('22');
    setUsername('');
    setIdentityFile('');
  };

  return (
    <div style={{
      padding: '40px',
      color: 'var(--foreground)',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', marginBottom: '20px' }}>
        <SettingsIcon /> Settings
      </h1>

      <div className="settings-section">
        <h2><Monitor size={18} /> General</h2>
        <div className="setting-item">
          <label>Startup Profile</label>
          <select className="settings-select">
            <option>Default Shell</option>
            <option>Bash</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h2><Server size={18} /> SSH Profiles</h2>

        <div className="ssh-list">
          {sshProfiles.length === 0 && !isAdding && (
            <p style={{ opacity: 0.6, fontSize: '14px' }}>No SSH profiles configured.</p>
          )}

          {sshProfiles.map(p => (
            <div key={p.id} className="ssh-item">
              <div className="ssh-info">
                <strong>{p.name}</strong>
                <span>{p.username}@{p.host}:{p.port}</span>
              </div>
              <button className="icon-btn delete" onClick={() => handleDeleteProfile(p.id)} title="Delete Profile">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {!isAdding ? (
          <button className="btn-primary" onClick={() => setIsAdding(true)}>
            <Plus size={16} /> Add New Profile
          </button>
        ) : (
          <div className="add-ssh-form">
            <h3>New SSH Profile</h3>
            <div className="form-group">
              <label>Profile Name</label>
              <input type="text" placeholder="e.g. Production Server" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>Host</label>
                <input type="text" placeholder="192.168.1.1 or example.com" value={host} onChange={e => setHost(e.target.value)} />
              </div>
              <div className="form-group" style={{ width: '80px' }}>
                <label>Port</label>
                <input type="number" value={port} onChange={e => setPort(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="root" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Identity File (Optional)</label>
              <input type="text" placeholder="/path/to/key.pem" value={identityFile} onChange={e => setIdentityFile(e.target.value)} />
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddProfile}>Save Profile</button>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h2><Palette size={18} /> Appearance</h2>
        <div className="setting-item">
          <label>Color Scheme</label>
          <select className="settings-select" value={currentThemeId} onChange={handleThemeChange}>
            {PRESET_THEMES.map(theme => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.6 }}>
          Selected theme will be applied to all open terminals.
        </div>
      </div>

      <style>{`
        .settings-section {
          background: color-mix(in srgb, var(--background), var(--foreground) 5%);
          padding: 24px;
          border-radius: 12px;
          border: 1px solid color-mix(in srgb, var(--background), var(--foreground) 10%);
          margin-bottom: 20px;
        }
        .settings-section h2 {
          font-size: 18px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-blue);
        }
        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .settings-select, input[type="text"], input[type="number"] {
          background-color: color-mix(in srgb, var(--background), var(--foreground) 10%);
          color: var(--foreground);
          border: 1px solid color-mix(in srgb, var(--background), var(--foreground) 10%);
          padding: 10px 12px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          width: 100%;
          transition: border-color 0.2s;
        }
        
        .settings-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23cdd6f4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px;
          padding-right: 40px;
          cursor: pointer;
        }
        /* Note: SVG arrow color is hardcoded #cdd6f4 in data URI. 
           To support fully dynamic arrow, we'd need an SVG component or mask.
           For now, it's acceptable (bright text). */
           
        .settings-select:focus, input:focus {
          border-color: var(--color-blue);
        }
        
        /* SSH List */
        .ssh-list {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 20px;
        }
        .ssh-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: color-mix(in srgb, var(--background), var(--foreground) 5%);
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid color-mix(in srgb, var(--background), var(--foreground) 5%);
        }
        .ssh-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .ssh-info span {
            font-size: 12px;
            opacity: 0.6;
        }
        
        /* Buttons */
        .icon-btn {
            background: transparent;
            border: none;
            color: color-mix(in srgb, var(--foreground), transparent 40%);
            cursor: pointer;
            padding: 6px;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .icon-btn:hover {
            color: var(--foreground);
            background: color-mix(in srgb, var(--background), var(--foreground) 10%);
        }
        .icon-btn.delete:hover {
            color: var(--color-red);
            background: color-mix(in srgb, var(--color-red), transparent 90%);
        }

        .btn-primary, .btn-secondary {
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            border: none;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: opacity 0.2s;
        }
        .btn-primary {
            background: var(--color-blue);
            color: var(--background);
        }
        .btn-secondary {
            background: color-mix(in srgb, var(--background), var(--foreground) 10%);
            color: var(--foreground);
        }
        .btn-primary:hover, .btn-secondary:hover {
            opacity: 0.9;
        }

        /* Form */
        .add-ssh-form {
            background: color-mix(in srgb, var(--background), var(--foreground) 5%);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid color-mix(in srgb, var(--background), var(--foreground) 5%);
        }
        .add-ssh-form h3 {
            font-size: 16px;
            margin-bottom: 15px;
        }
        .form-group {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .form-group label {
            font-size: 12px;
            font-weight: 500;
            opacity: 0.8;
            margin-left: 2px;
        }
        .form-row {
            display: flex;
            gap: 12px;
        }
        .flex-1 { flex: 1; }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
      `}</style>
    </div>


  );
};
