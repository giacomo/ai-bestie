const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
// const { default: Store } = require('electron-store');

// const { setupIrcClient } = require('./irc');
// const { setupSearchHandlers } = require('./search');

// const store = new Store();

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

// Load settings from file
function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
  return {};
}

// Save settings to file
function saveSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

// Initialize settings
let settings = loadSettings();


let mainWindow;
let isDev = process.argv.includes('--dev');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    }
  });

  // Load the Angular app
  if (isDev) {
    // Development mode - connect to Angular dev server
    mainWindow.loadURL('http://localhost:4235');
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode - load built Angular app
    const indexPath = path.join(__dirname, '../angular-app/dist/ai-bestie/browser/index.html');

    // Check if the index.html file exists
    if (!fs.existsSync(indexPath)) {
      console.error('Angular build files not found at:', indexPath);
        mainWindow.loadURL('data:text/html,<h1>Error: Could not load application</h1>');
        return;
    }

    mainWindow.loadFile(indexPath).then(() => {
      windowTitle = 'AI Bestie';
      mainWindow.setTitle(windowTitle);
      mainWindow.removeMenu();
    });
  }

  // Set up IRC client handlers
  // setupIrcClient(mainWindow, store);
  
  // Set up search handlers
  // setupSearchHandlers(mainWindow);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Get current apikey
ipcMain.handle('get-api-key', () => {
  return settings['apiKey'];
});

// Get active model
ipcMain.handle('get-api-model', () => {
  return settings['apiModel'];
});

// Set API key
ipcMain.on('set-api-key', (event, apiKey) => {
  settings['apiKey'] = apiKey;
  saveSettings(settings);
});

// Set model
ipcMain.on('set-model', (event, model) => {
  settings['apiModel'] = model;
  saveSettings(settings);
});