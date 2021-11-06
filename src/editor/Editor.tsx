import React from 'react';
import CodeMirror from 'react-codemirror';
import './Editor.css';

import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';

interface Props {
    initialDoc: string;
    onChange: (doc: string) => void;
}

const Editor: React.FC<Props> = ({ initialDoc, onChange }) => {
    return (
        <CodeMirror
            value={initialDoc}
            onChange={(value) => {
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
                theme: 'one-dark'
            }}
        />
    );
};

export default Editor;
