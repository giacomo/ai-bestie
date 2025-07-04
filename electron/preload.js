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

        // Remove all listeners for a specific event
        removeAllListeners: (channel) => {
            ipcRenderer.removeAllListeners(channel);
        }
    }
);