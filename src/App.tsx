import React from 'react';
import Editor from './editor/Editor';
import Preview from './preview/Preview';
import IDocument from './IDocument';
import Channels from '../electron/listener.types';

const App: React.FC = () => {
    const [doc, setDoc] = React.useState<IDocument>({
        value: '# Hello World!'
    });
    const handleDocChange = React.useCallback(
        (value: string) => {
            setDoc({
                ...doc,
                value
            });
            if (window.Main) {
                window.Main.send(Channels['document-edited']);
            }
        },
        [doc]
    );

    React.useEffect(() => {
        if (window.Main) {
            window.Main.on(Channels['load-file'], (_, data: IDocument) => {
                setDoc(data);
            });

            window.Main.on(Channels['save-file'], (event) => {
                event.sender.send(Channels['save-file-return'], doc);
            });
        }

        return () => {
            if (window.Main) {
                window.Main.removeAll(Channels['save-file']);
            }
        };
    });

    const [collapsed, setCollapsed] = React.useState(false);
    const onChangeCollapsed = (event: React.MouseEvent) => {
        event.preventDefault();
        setCollapsed(!collapsed);
    };

    // css fuckery
    let editorDivClassName = 'w-full md:w-1/2 h-1/2 md:h-full overflow-auto';
    if (collapsed) {
        editorDivClassName += ' h-full md:w-full';
    }

    let svgClassName =
        'absolute left-1/2 z-10 h-6 w-6 md:mr-3 stroke-current text-secondary hover:text-primary cursor-pointer';
    if (collapsed) {
        svgClassName += ' rotate-180 md:rotate-90 bottom-0 md:left-auto md:right-0 md:top-1/2 mb-3 md:mb-0';
    } else {
        svgClassName += ' md:-rotate-90 top-1/2';
    }

    let previewDivClassName = 'w-full md:w-1/2 h-1/2 md:h-full overflow-auto border-primary';
    if (collapsed) {
        previewDivClassName += ' hidden';
    }

    return (
        <div className="w-screen h-screen md:flex bg-primary divide-y md:divide-y-0 md:divide-x">
            <div className={editorDivClassName}>
                <Editor doc={doc} onChange={handleDocChange} />
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={svgClassName}
                fill="none"
                viewBox="0 0 24 24"
                onClick={onChangeCollapsed}
                focusable={false}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
            <div className={previewDivClassName}>
                <Preview doc={doc.value} />
            </div>
        </div>
    );
};

export default App;
