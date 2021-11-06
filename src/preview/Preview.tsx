import React from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkReact from 'remark-react';
import remarkEmoji from 'remark-emoji';
import remarkToc from 'remark-toc';
import { defaultSchema } from 'hast-util-sanitize';
import './Preview.css';
import 'github-markdown-css/github-markdown-dark.css';

interface Props {
    doc: string;
}

const schema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        code: [...(defaultSchema.attributes?.code || []), 'className']
    }
};

const Preview: React.FC<Props> = ({ doc }) => {
    const md = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkEmoji)
        .use(remarkToc)
        .use(remarkReact, {
            createElement: React.createElement,
            sanitize: schema
        })
        .processSync(doc).result;

    return <div className="bg-backgroundColor preview markdown-body">{md}</div>;
};

export default Preview;
