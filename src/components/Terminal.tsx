import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import '@xterm/xterm/css/xterm.css';

const theme = {
  background: '#1e1e2e',
  foreground: '#cdd6f4',
  cursor: '#f5e0dc',
  selectionBackground: 'rgba(88, 91, 112, 0.3)',
};

// Add 'visible' prop and optional command/args
export const TerminalPane = ({ id, visible, command, args, onExit }: { id: string, visible: boolean, command?: string, args?: string[], onExit?: () => void }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const fitAddonRef = useRef<FitAddon | null>(null); // Store addon ref to call fit() later

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: theme,
      fontFamily: '"TermFont", "JetBrains Mono", monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      allowProposedApi: true,
      allowTransparency: false,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddonRef.current = fitAddon; // Save it

    term.open(terminalRef.current);
    term.clear();

    // Initial fit
    setTimeout(() => fitAddon.fit(), 50);

    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    // Backend Logic
    invoke('create_pty_session', { id, command, args });

    const unlistenData = listen(`pty-data-${id}`, (event: any) => {
      term.write(event.payload);
    });

    const unlistenExit = listen(`pty-exit-${id}`, () => {
      if (onExit) onExit();
    });

    const onDataDisposable = term.onData((data) => {
      invoke('write_to_pty', { id, data });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      onDataDisposable.dispose();
      term.dispose();
      unlistenData.then(f => f());
      unlistenExit.then(f => f());
    };
  }, [id]);

  // NEW: Refit whenever the tab becomes visible
  useEffect(() => {
    if (visible && fitAddonRef.current) {
      // Small timeout to allow CSS 'display: block' to render first
      setTimeout(() => {
        fitAddonRef.current?.fit();
      }, 10);
    }
  }, [visible]);

  return (
    <div
      ref={terminalRef}
      style={{ width: '100%', height: '100%', backgroundColor: '#1e1e2e' }}
    />
  );
};