import React from 'react';
import { Controlled as CodeMirrorEditor } from 'react-codemirror2';
import IDocument from '../IDocument';
import './Editor.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';

interface Props {
    doc: IDocument;
    onChange: (doc: string) => void;
}

const Editor: React.FC<Props> = ({ doc, onChange }) => {
    return (
        <CodeMirrorEditor
            value={doc.value}
            onBeforeChange={(editor, data, value) => {
                onChange(value);
            }}
            options={{
                mode: {
                    name: 'gfm',
                    gitHubSpice: true,
                    taskLists: true,
                    strikethrough: true,
                    emoji: true,
                    typescript: true
                },
                lineWrapping: true,
                autofocus: true
            }}
        />
    );
};

export default Editor;
