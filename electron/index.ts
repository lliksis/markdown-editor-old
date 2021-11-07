// Native
import { join } from 'path';
import { readFile, writeFile } from 'fs';

// Packages
import {
    BrowserWindow,
    app,
    ipcMain,
    IpcMainEvent,
    Menu,
    MenuItemConstructorOptions,
    MenuItem,
    dialog
} from 'electron';
import isDev from 'electron-is-dev';

const height = 600;
const width = 800;

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
        center: true
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

    ipcMain.on('save-file-return', (_: IpcMainEvent, { path, value }) => {
        if (!path) {
            dialog.showSaveDialog({}).then((result) => {
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
    });

    const menuTemplate: Array<MenuItemConstructorOptions | MenuItem> = [
        {
            label: '&File',
            submenu: [
                {
                    label: '&Open',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        dialog
                            .showOpenDialog({
                                properties: ['openFile'],
                                filters: [{ name: 'Markdown Files', extensions: ['md', 'mdx'] }]
                            })
                            .then((result) => {
                                if (result.canceled) {
                                    return;
                                }
                                const filePath = result.filePaths[0];
                                readFile(filePath, (err, data) => {
                                    if (!err) {
                                        window.webContents.send('load-file', {
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
                        window.webContents.send('save-file');
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    window.setMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
