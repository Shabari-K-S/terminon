import React from 'react';
import { Settings as SettingsIcon, Monitor, Palette } from 'lucide-react';

export const Settings = () => {
    return (
        <div style={{
            padding: '40px',
            color: '#cdd6f4',
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
                <h2><Palette size={18} /> Appearance</h2>
                <p style={{ opacity: 0.6 }}>Theme selection coming soon...</p>
            </div>

            <style>{`
        .settings-section {
          background: rgba(255, 255, 255, 0.05);
          padding: 20px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .settings-section h2 {
          font-size: 18px;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .setting-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .settings-select {
          background-color: #313244;
          color: #cdd6f4;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 32px 8px 12px;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          user-select: auto;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cdd6f4%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 8px center;
          background-size: 16px;
        }
        .settings-select:focus {
          border-color: #89b4fa;
        }
        /* Style options for better visibility on some OS/browsers */
        .settings-select option {
          background-color: #1e1e2e;
          color: #cdd6f4;
        }
      `}</style>
        </div>
    );
};
