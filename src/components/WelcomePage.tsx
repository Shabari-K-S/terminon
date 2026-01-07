import React from 'react';
import { Plus, Terminal, Server, Settings, Globe, Code } from 'lucide-react';

interface WelcomePageProps {
    onNewTerminal: () => void;
    onNewSSH: () => void;
    onOpenSettings: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
    onNewTerminal,
    onNewSSH,
    onOpenSettings
}) => {
    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <div className="welcome-header">
                    <div className="welcome-logo">
                        <Terminal size={48} />
                    </div>
                    <h1>Terminon</h1>
                    <p>The modern, versatile terminal for your workflow.</p>
                </div>

                <div className="welcome-actions">
                    <button className="welcome-btn primary" onClick={onNewTerminal}>
                        <div className="btn-icon"><Plus size={20} /></div>
                        <div className="btn-text">
                            <strong>New Tab</strong>
                            <span>Start a default local shell session</span>
                        </div>
                    </button>

                    <button className="welcome-btn" onClick={onNewSSH}>
                        <div className="btn-icon"><Server size={20} /></div>
                        <div className="btn-text">
                            <strong>SSH Connection</strong>
                            <span>Connect to a remote server</span>
                        </div>
                    </button>

                    <button className="welcome-btn" onClick={onOpenSettings}>
                        <div className="btn-icon"><Settings size={20} /></div>
                        <div className="btn-text">
                            <strong>Settings</strong>
                            <span>Configure your theme and profiles</span>
                        </div>
                    </button>
                </div>

                <div className="welcome-footer">
                    <div className="footer-item">
                        <Globe size={14} />
                        <span>Multi-Platform Support</span>
                    </div>
                    <div className="footer-item">
                        <Code size={14} />
                        <span>Open Source</span>
                    </div>
                </div>
            </div>

            <style>{`
        .welcome-container {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--background);
          color: var(--foreground);
          animation: fadeIn 0.4s ease-out;
        }

        .welcome-card {
          max-width: 600px;
          width: 90%;
          padding: 40px;
          background: color-mix(in srgb, var(--background), var(--foreground) 3%);
          border: 1px solid color-mix(in srgb, var(--background), var(--foreground) 10%);
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .welcome-header {
          margin-bottom: 40px;
        }

        .welcome-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--color-blue), transparent 85%);
          color: var(--color-blue);
          border-radius: 20px;
        }

        .welcome-header h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .welcome-header p {
          font-size: 16px;
          opacity: 0.6;
        }

        .welcome-actions {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .welcome-btn {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
          background: color-mix(in srgb, var(--background), var(--foreground) 5%);
          border: 1px solid color-mix(in srgb, var(--background), var(--foreground) 10%);
          border-radius: 12px;
          color: var(--foreground);
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .welcome-btn:hover {
          background: color-mix(in srgb, var(--background), var(--foreground) 8%);
          border-color: color-mix(in srgb, var(--background), var(--foreground) 20%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .welcome-btn.primary {
          background: color-mix(in srgb, var(--color-blue), transparent 90%);
          border-color: color-mix(in srgb, var(--color-blue), transparent 70%);
        }

        .welcome-btn.primary:hover {
          background: color-mix(in srgb, var(--color-blue), transparent 85%);
          border-color: var(--color-blue);
        }

        .btn-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: color-mix(in srgb, var(--background), var(--foreground) 10%);
          border-radius: 10px;
          flex-shrink: 0;
        }

        .welcome-btn.primary .btn-icon {
          background: color-mix(in srgb, var(--color-blue), transparent 85%);
          color: var(--color-blue);
        }

        .btn-text {
          display: flex;
          flex-direction: column;
        }

        .btn-text strong {
          font-size: 16px;
          font-weight: 600;
        }

        .btn-text span {
          font-size: 13px;
          opacity: 0.6;
        }

        .welcome-footer {
          display: flex;
          justify-content: center;
          gap: 24px;
          opacity: 0.4;
          font-size: 12px;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};
