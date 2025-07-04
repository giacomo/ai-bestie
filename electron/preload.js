const { contextBridge, ipcRenderer } = require('electron');


// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'api', {
        send: (channel, data) => ipcRenderer.send(channel, data),
        invoke: (channel, data) => ipcRenderer.invoke(channel, data),

        // Settings functions
        getApiKey: () => ipcRenderer.invoke('get-api-key'),
        getModelKey: () => ipcRenderer.invoke('get-model-key'),
        // selectDownloadDirectory: () => ipcRenderer.invoke('select-download-directory'),

        // Events
        // onDownloadProgress: (callback) =>
        //     ipcRenderer.on('download-progress', (_, downloadId, progress) => callback(downloadId, progress)),
        // onDownloadComplete: (callback) =>
        //     ipcRenderer.on('download-complete', (_, downloadId) => callback(downloadId)),
        // onDownloadError: (callback) =>
        //     ipcRenderer.on('download-error', (_, downloadId, error) => callback(downloadId, error)),
        // onSearchResults: (callback) =>
        //     ipcRenderer.on('search-results', (_, results) => callback(results)),

        // Remove all listeners for a specific event
        removeAllListeners: (channel) => {
            ipcRenderer.removeAllListeners(channel);
        }
    }
);