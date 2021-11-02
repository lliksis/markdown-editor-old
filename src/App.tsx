import React from 'react';
import Editor from './editor/Editor';

const App: React.FC = () => {
    const [doc, setDoc] = React.useState('# Hello, World!\n');
    const handleDocChange = React.useCallback((newDoc) => {
        setDoc(newDoc);
    }, []);

    return (
        <div className=" flex flex-col h-screen">
            <Editor initialDoc={doc} onChange={handleDocChange} />
        </div>
    );
};

export default App;
