/* eslint-disable no-param-reassign */
import { BrowserWindow } from 'electron';
import { UpdateableProps } from './listeners';

const Helpers = {
    /**
     * Update the document edited state
     */
    setEdited: (window: BrowserWindow, props: UpdateableProps, edited: boolean): void => {
        window.setDocumentEdited(edited);
        props.edited = edited;
    },
    fileFilters: [{ name: 'Markdown Files', extensions: ['md', 'mdx'] }]
};

export default Helpers;
