import React, { useState, useRef, useEffect } from 'react';
import { TerminalPane } from "./components/Terminal";
import { Settings as SettingsComponent } from "./components/Settings";
import { ChevronDown, Settings, Minus, Square, X, Plus, TerminalSquare, Settings as SettingsIcon } from "lucide-react";
import { getCurrentWindow } from '@tauri-apps/api/window';
import "./App.css";
import { DEFAULT_PROFILES } from './config/profiles';
import { Profile, SSHProfile } from './types';
import { loadSSHProfiles } from './lib/store';
import { listen } from '@tauri-apps/api/event';

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

    // Listen for updates from other components
    const unlisten = listen('profiles-changed', () => {
      loadSSHProfiles().then(setSshProfiles);
    });

    return () => {
      unlisten.then(f => f());
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
      newTab = {
        id: newId,
        type: 'settings',
        title: 'Settings',
      };
    } else {
      // Default to terminal
      let command = options?.profile?.type === 'local' ? options.profile.command : undefined;
      let args = options?.profile?.type === 'local' ? options.profile.args : undefined;

      if (options?.profile?.type === 'ssh') {
        command = 'ssh';
        args = [];
        if (options.profile.port !== 22) {
          args.push('-p', options.profile.port.toString());
        }
        if (options.profile.identityFile) {
          args.push('-i', options.profile.identityFile);
        }
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
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (id === activeId) setActiveId(newTabs[newTabs.length - 1].id);
  };

  const handleTabExit = (id: string) => {
    if (tabs.length === 1) {
      appWindow.close();
    } else {
      const newTabs = tabs.filter(t => t.id !== id);
      setTabs(newTabs);
      if (id === activeId) setActiveId(newTabs[newTabs.length - 1].id);
    }
  };

  const allProfiles: Profile[] = [...DEFAULT_PROFILES, ...sshProfiles];

  return (
    <div className="app-container">

      {/* HEADER: Distinct Sections */}
      <div className="title-bar">

        {/* 1. LEFT: TABS (Clickable) */}
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

        {/* 2. MIDDLE: DRAG HANDLE (Draggable) */}
        {/* This empty space is ONLY for dragging */}
        <div data-tauri-drag-region className="title-section-drag" />

        {/* 3. RIGHT: WINDOW CONTROLS (Clickable) */}
        <div className="title-section-controls">
          <button onClick={() => addTab({ type: 'settings' })} className="control-btn settings" title="Settings">
            <Settings size={14} />
          </button>
          <button onClick={() => appWindow.minimize()} className="control-btn"><Minus size={16} /></button>
          <button onClick={() => appWindow.toggleMaximize()} className="control-btn"><Square size={14} /></button>
          <button onClick={() => appWindow.close()} className="control-btn close"><X size={16} /></button>
        </div>

      </div>

      {/* BODY */}
      <div className="terminal-wrapper">
        {tabs.map((tab) => (
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
        ))}
      </div>

    </div>
  );
}

export default App;