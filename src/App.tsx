import React, { useState, useRef, useEffect } from 'react';
import { TerminalPane } from "./components/Terminal";
import { Settings as SettingsComponent } from "./components/Settings";
import { WelcomePage } from "./components/WelcomePage";
import { ChevronDown, Settings, Minus, Square, X, Plus, TerminalSquare, Settings as SettingsIcon } from "lucide-react";
import { getCurrentWindow } from '@tauri-apps/api/window';
import "./App.css";
import { DEFAULT_PROFILES } from './config/profiles';
import { PRESET_THEMES, Theme } from './config/themes';
import { Profile, SSHProfile } from './types';
import { loadSSHProfiles, loadThemeId } from './lib/store';
import { listen } from '@tauri-apps/api/event';

// Helper: Apply theme to CSS variables
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty('--background', theme.background);
  root.style.setProperty('--foreground', theme.foreground);
  root.style.setProperty('--cursor', theme.cursor);
  root.style.setProperty('--selection-background', theme.selectionBackground);
  root.style.setProperty('--color-black', theme.black);
  root.style.setProperty('--color-red', theme.red);
  root.style.setProperty('--color-green', theme.green);
  root.style.setProperty('--color-yellow', theme.yellow);
  root.style.setProperty('--color-blue', theme.blue);
  root.style.setProperty('--color-magenta', theme.magenta);
  root.style.setProperty('--color-cyan', theme.cyan);
  root.style.setProperty('--color-white', theme.white);
};

const DEFAULT_THEME = PRESET_THEMES[0];

const generateId = () => `term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface Tab {
  id: string;
  type: 'terminal' | 'settings';
  title: string;
  command?: string;
  args?: string[];
}

function App() {
  const appWindow = getCurrentWindow();
  const [tabs, setTabs] = useState<Tab[]>([{ id: 'init-1', type: 'terminal', title: 'Terminal' }]);
  const [activeId, setActiveId] = useState('init-1');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sshProfiles, setSshProfiles] = useState<SSHProfile[]>([]);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSSHProfiles().then(setSshProfiles);
    loadThemeId().then(id => {
      const theme = PRESET_THEMES.find(t => t.id === id) || DEFAULT_THEME;
      applyTheme(theme);
    });

    const unlistenProfiles = listen('profiles-changed', () => {
      loadSSHProfiles().then(setSshProfiles);
    });

    const unlistenTheme = listen('theme-changed', (event: any) => {
      const themeId = event.payload;
      const theme = PRESET_THEMES.find(t => t.id === themeId) || DEFAULT_THEME;
      applyTheme(theme);
    });

    return () => {
      unlistenProfiles.then(f => f());
      unlistenTheme.then(f => f());
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTab = (options?: Partial<Tab> & { profile?: Profile }) => {
    const newId = generateId();
    let newTab: Tab;

    if (options?.type === 'settings') {
      newTab = { id: newId, type: 'settings', title: 'Settings' };
    } else {
      let command = options?.profile?.type === 'local' ? options.profile.command : undefined;
      let args = options?.profile?.type === 'local' ? options.profile.args : undefined;

      if (options?.profile?.type === 'ssh') {
        command = 'ssh';
        args = [];
        if (options.profile.port !== 22) args.push('-p', options.profile.port.toString());
        if (options.profile.identityFile) args.push('-i', options.profile.identityFile);
        args.push(`${options.profile.username}@${options.profile.host}`);
      }

      newTab = {
        id: newId,
        type: 'terminal',
        title: options?.profile ? options.profile.name : 'Terminal',
        command,
        args
      };
    }

    setTabs([...tabs, newTab]);
    setActiveId(newId);
    setShowProfileMenu(false);
  };

  const closeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (id === activeId && newTabs.length > 0) {
      setActiveId(newTabs[newTabs.length - 1].id);
    }
  };

  const handleTabExit = (id: string) => {
    if (tabs.length === 1) {
      setTabs([]);
    } else {
      const newTabs = tabs.filter(t => t.id !== id);
      setTabs(newTabs);
      if (id === activeId) setActiveId(newTabs[newTabs.length - 1].id);
    }
  };

  const allProfiles: Profile[] = [...DEFAULT_PROFILES, ...sshProfiles];

  return (
    <div className="app-container">
      <div className="title-bar">
        <div className="title-section-tabs">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${activeId === tab.id ? 'active' : ''}`}
              onClick={() => setActiveId(tab.id)}
            >
              {tab.type === 'settings' ? (
                <SettingsIcon size={14} className={activeId === tab.id ? "text-blue-400" : "text-gray-500"} />
              ) : (
                <TerminalSquare size={14} className={activeId === tab.id ? "text-blue-400" : "text-gray-500"} />
              )}
              <span className="tab-title">{tab.title}</span>
              <div className="tab-close-btn" onClick={(e) => closeTab(e, tab.id)}>
                <X size={12} />
              </div>
            </div>
          ))}
          <div className="new-tab-group">
            <div className="new-tab-btn left" onClick={() => addTab()} title="New Tab">
              <Plus size={16} />
            </div>
            <div className="new-tab-btn right" onClick={() => setShowProfileMenu(!showProfileMenu)} title="Select Profile">
              <ChevronDown size={24} />
            </div>

            {showProfileMenu && (
              <div className="profile-menu" ref={profileMenuRef}>
                <div className="profile-menu-header">Profiles</div>
                {allProfiles.map((profile) => (
                  <div key={profile.id} className="profile-item" onClick={() => addTab({ profile })}>
                    <span>{profile.name}</span>
                  </div>
                ))}
                <div className="profile-menu-divider" />
                <div className="profile-item add-profile" onClick={() => {
                  addTab({ type: 'settings' });
                  setShowProfileMenu(false);
                }}>
                  <Plus size={14} />
                  <span>Add Profile</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div data-tauri-drag-region className="title-section-drag" />

        <div className="title-section-controls">
          <button onClick={() => addTab({ type: 'settings' })} className="control-btn settings" title="Settings">
            <Settings size={14} />
          </button>
          <button onClick={() => appWindow.minimize()} className="control-btn"><Minus size={16} /></button>
          <button onClick={() => appWindow.toggleMaximize()} className="control-btn"><Square size={14} /></button>
          <button onClick={() => appWindow.close()} className="control-btn close"><X size={16} /></button>
        </div>
      </div>

      <div className="terminal-wrapper">
        {tabs.length === 0 ? (
          <WelcomePage
            onNewTerminal={() => addTab()}
            onNewSSH={() => setShowProfileMenu(true)}
            onOpenSettings={() => addTab({ type: 'settings' })}
          />
        ) : (
          tabs.map((tab) => (
            <div key={tab.id} style={{ display: activeId === tab.id ? 'block' : 'none', height: '100%', width: '100%' }}>
              {tab.type === 'terminal' ? (
                <TerminalPane
                  id={tab.id}
                  visible={activeId === tab.id}
                  command={tab.command}
                  args={tab.args}
                  onExit={() => handleTabExit(tab.id)}
                />
              ) : (
                <SettingsComponent />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;