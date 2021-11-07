import { join } from 'path';
import { readFile } from 'fs';
import { BrowserWindow, app, Menu, MenuItemConstructorOptions, MenuItem, dialog } from 'electron';
import isDev from 'electron-is-dev';
import initiateListeners, { UpdateableProps } from './listeners';
import Channels from './listener.types';
import Helpers from './helpers';

const defaultTitle = `${app.getName()} - `;

const height = 600;
const width = 800;

const props: UpdateableProps = {
    edited: false
};

const openUnsavedChangesDialog = (window: BrowserWindow) => {
    const choice = dialog.showMessageBoxSync(window, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'There are unsaved changes!\nAre you sure you want to quit?'
    });
    return choice;
};

function createWindow() {
    // Create the browser window.
    const window = new BrowserWindow({
        width,
        height,
        frame: true,
        show: true,
        resizable: true,
        fullscreenable: true,
        webPreferences: {
            preload: join(__dirname, 'preload.js')
        },
        center: true,
        title: `${defaultTitle}Untitled`
    });

    const port = process.env.PORT || 3000;
    const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

    // and load the index.html of the app.
    if (isDev) {
        window?.loadURL(url);
    } else {
        window?.loadFile(url);
    }

    // Open the DevTools.
    if (isDev) {
        window.webContents.openDevTools();
    }

    const menuTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
        {
            label: '&File',
            submenu: [
                {
                    label: '&Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        if (props.edited) {
                            const choice = openUnsavedChangesDialog(window);
                            if (choice === 1) {
                                return;
                            }
                        }
                        dialog
                            .showOpenDialog({
                                properties: ['openFile'],
                                filters: Helpers.fileFilters
                            })
                            .then((result) => {
                                if (result.canceled) {
                                    return;
                                }
                                const filePath = result.filePaths[0];
                                readFile(filePath, (err, data) => {
                                    if (!err) {
                                        window.setTitle(`${defaultTitle}${filePath}`);
                                        window.setRepresentedFilename(filePath);
                                        Helpers.setEdited(window, props, false);
                                        window.webContents.send(Channels['load-file'], {
                                            path: filePath,
                                            value: data.toString()
                                        });
                                    }
                                });
                            });
                    }
                },
                {
                    label: '&Save',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        window.webContents.send(Channels['save-file']);
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    window.setMenu(menu);

    return window;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    const win = createWindow();

    initiateListeners(win, props);

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

    // On windows check if the windows document is edited
    // If yes show a 'Confirm' dialog
    // On MacOS setting window.setDocumentEdited(true) will trigger the 'Confirm' dialog
    win.on('close', (e) => {
        if (process.platform !== 'darwin' && props.edited) {
            const choice = openUnsavedChangesDialog(win);
            if (choice === 1) {
                e.preventDefault();
            }
        }
    });

    app.on('window-all-closed', () => {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});
