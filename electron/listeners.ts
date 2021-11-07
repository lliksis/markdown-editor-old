/* eslint-disable no-param-reassign */
import { ipcMain, IpcMainEvent, dialog, BrowserWindow } from 'electron';
import { writeFile } from 'fs';
import Helpers from './helpers';
import Channels from './listener.types';

export interface UpdateableProps {
    edited: boolean;
}

const initiateListeners = (window: BrowserWindow, props: UpdateableProps): void => {
    ipcMain.on(Channels['save-file-return'], (_: IpcMainEvent, { path, value }) => {
        if (!path) {
            dialog.showSaveDialog({ filters: Helpers.fileFilters }).then((result) => {
                if (result.canceled && !result.filePath) return;
                writeFile(result.filePath!, value, (err) => {
                    console.error(err);
                });
            });
        } else {
            writeFile(path, value, (err) => {
                console.error(err);
            });
        }
        Helpers.setEdited(window, props, false);
    });

    ipcMain.on(Channels['document-edited'], () => {
        if (!props.edited) {
            const prevTitle = window.getTitle();
            window.setTitle(`${prevTitle} *`);
            Helpers.setEdited(window, props, true);
        }
    });
};

export default initiateListeners;
