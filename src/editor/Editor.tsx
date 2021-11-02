import React from 'react';
import useCodeMirror from './useCodemirror';

interface Props {
    initialDoc: string;
    onChange: (doc: string) => void;
}

const Editor: React.FC<Props> = ({ initialDoc, onChange }) => {
    const handleChange = React.useCallback((state) => onChange(state.doc.toString()), [onChange]);

    const [refContainer] = useCodeMirror<HTMLDivElement>({
        initialDoc,
        onChange: handleChange
    });

    return <div ref={refContainer} />;
};

export default Editor;
