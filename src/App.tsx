import React from 'react';
import Editor from './editor/Editor';
import Preview from './preview/Preview';

const App: React.FC = () => {
    const [doc, setDoc] = React.useState('# Hello World!');
    const handleDocChange = React.useCallback((newDoc) => {
        setDoc(newDoc);
    }, []);

    React.useEffect(() => {
        if (window.Main) {
            window.Main.on('open-file', (data) => {
                setDoc(data);
            });
        }
    }, [handleDocChange]);

    return (
        <div className="w-screen h-screen md:flex bg-backgroundColor">
            <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-auto">
                <Editor initialDoc={doc} onChange={handleDocChange} />
            </div>
            <div className="w-full md:w-1/2 h-1/2 md:h-full overflow-auto">
                <Preview doc={doc} />
            </div>
        </div>
    );
};

export default App;
