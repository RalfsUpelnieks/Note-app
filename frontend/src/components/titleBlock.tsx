import { useMemo } from "react";

interface TitleBlockProps {
    content: string
    placeholder: string
    pageId: string
    className?: string
    onChange?(e): void
    onBlur?(e): void
    onKeyDown?(e): void 
}

function TitleBlock({content, placeholder, pageId, className, onChange, onBlur, onKeyDown} : TitleBlockProps) {

    const title = useMemo(() => content, [pageId]);

    return (
        <h1 key={pageId}
            dangerouslySetInnerHTML={{__html: title}}
            placeholder={placeholder}
            data-position={0}
            onInput={onChange}
            onBlur={onBlur} 
            onKeyDown={onKeyDown}
            contentEditable="true" 
            className={`break-all cursor-text empty:before:content-[attr(placeholder)] empty:before:text-neutral-400 focus:outline-none ${className}`}
        ></h1>
    );
}

export default TitleBlock;