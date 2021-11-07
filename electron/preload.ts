/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron';

declare global {
    interface Window {
        Main: typeof api;
        ipcRenderer: typeof ipcRenderer;
    }
}

// eslint-disable-next-line import/prefer-default-export
export const api = {
    remove: (channel: string, callback: (event: IpcRendererEvent, ...args: any[]) => void): void => {
        ipcRenderer.removeListener(channel, callback);
    },
    removeAll: (channel: string): void => {
        ipcRenderer.removeAllListeners(channel);
    },
    /**
     * Here you can expose functions to the renderer process
     * so they can interact with the main (electron) side
     * without security problems.
     *
     * The function below can accessed using `window.Main.sayHello`
     */
    sendMessage: (message: string): void => {
        ipcRenderer.send('message', message);
    },
    /**
     * Provide an easy way to send events
     */
    send: (channel: string, ...args: any[]): void => {
        ipcRenderer.send(channel, ...args);
    },
    /**
     * Provide an easier way to listen to events
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    on: (channel: string, callback: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(channel, (event, data) => callback(event, data));
    }
};
contextBridge.exposeInMainWorld('Main', api);
/**
 * Using the ipcRenderer directly in the browser through the contextBridge ist not really secure.
 * I advise using the Main/api way !!
 */
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
