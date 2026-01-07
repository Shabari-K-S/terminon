export interface Theme {
    id: string;
    name: string;
    background: string;
    foreground: string;
    cursor: string;
    selectionBackground: string;
    black: string;
    blue: string;
    cyan: string;
    green: string;
    magenta: string;
    red: string;
    white: string;
    yellow: string;
    brightBlack: string;
    brightBlue: string;
    brightCyan: string;
    brightGreen: string;
    brightMagenta: string;
    brightRed: string;
    brightWhite: string;
    brightYellow: string;
}

export const PRESET_THEMES: Theme[] = [
    {
        id: 'catppuccin-mocha',
        name: 'Catppuccin Mocha (Default)',
        background: '#1e1e2e',
        foreground: '#cdd6f4',
        cursor: '#f5e0dc',
        selectionBackground: 'rgba(88, 91, 112, 0.3)',
        black: '#45475a',
        blue: '#89b4fa',
        cyan: '#89dceb',
        green: '#a6e3a1',
        magenta: '#f5c2e7',
        red: '#f38ba8',
        white: '#bac2de',
        yellow: '#f9e2af',
        brightBlack: '#585b70',
        brightBlue: '#89b4fa',
        brightCyan: '#89dceb',
        brightGreen: '#a6e3a1',
        brightMagenta: '#f5c2e7',
        brightRed: '#f38ba8',
        brightWhite: '#a6adc8',
        brightYellow: '#f9e2af'
    },
    {
        id: 'campbell',
        name: 'Campbell',
        background: '#0C0C0C',
        foreground: '#CCCCCC',
        cursor: '#FFFFFF',
        selectionBackground: '#FFFFFF',
        black: '#0C0C0C',
        blue: '#0037DA',
        cyan: '#3A96DD',
        green: '#13A10E',
        magenta: '#881798',
        red: '#C50F1F',
        white: '#CCCCCC',
        yellow: '#C19C00',
        brightBlack: '#767676',
        brightBlue: '#3B78FF',
        brightCyan: '#61D6D6',
        brightGreen: '#16C60C',
        brightMagenta: '#B4009E',
        brightRed: '#E74856',
        brightWhite: '#F2F2F2',
        brightYellow: '#F9F1A5'
    },
    {
        id: 'one-half-dark',
        name: 'One Half Dark',
        background: '#282C34',
        foreground: '#DCDFE4',
        cursor: '#A3B3CC',
        selectionBackground: '#474E5D',
        black: '#282C34',
        blue: '#61AFEF',
        cyan: '#56B6C2',
        green: '#98C379',
        magenta: '#C678DD',
        red: '#E06C75',
        white: '#DCDFE4',
        yellow: '#E5C07B',
        brightBlack: '#5A6374',
        brightBlue: '#61AFEF',
        brightCyan: '#56B6C2',
        brightGreen: '#98C379',
        brightMagenta: '#C678DD',
        brightRed: '#E06C75',
        brightWhite: '#DCDFE4',
        brightYellow: '#E5C07B'
    },
    {
        id: 'solarized-light',
        name: 'Solarized Light',
        background: '#FDF6E3',
        foreground: '#657B83',
        cursor: '#657B83',
        selectionBackground: '#EEE8D5',
        black: '#002B36',
        blue: '#268BD2',
        cyan: '#2AA198',
        green: '#859900',
        magenta: '#D33682',
        red: '#DC322F',
        white: '#EEE8D5',
        yellow: '#B58900',
        brightBlack: '#073642',
        brightBlue: '#839496',
        brightCyan: '#93A1A1',
        brightGreen: '#586E75',
        brightMagenta: '#6C71C4',
        brightRed: '#CB4B16',
        brightWhite: '#FDF6E3',
        brightYellow: '#657B83'
    },
    {
        id: 'dracula',
        name: 'Dracula',
        background: '#282a36',
        foreground: '#f8f8f2',
        cursor: '#f8f8f2',
        selectionBackground: '#44475a',
        black: '#21222c',
        blue: '#bd93f9',
        cyan: '#8be9fd',
        green: '#50fa7b',
        magenta: '#ff79c6',
        red: '#ff5555',
        white: '#f8f8f2',
        yellow: '#f1fa8c',
        brightBlack: '#6272a4',
        brightBlue: '#d6acff',
        brightCyan: '#a4ffff',
        brightGreen: '#69ff94',
        brightMagenta: '#ff92df',
        brightRed: '#ff6e6e',
        brightWhite: '#ffffff',
        brightYellow: '#ffffa5'
    }
];
