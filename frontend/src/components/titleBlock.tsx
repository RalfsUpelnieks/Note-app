import { useEffect, useRef } from "react";

interface TitleBlockProps {
    startingTitle: string
    title: string
    pageId: string
    addBlock(): void
    updateTitle(title: string): void
    pages: any
    setPages: any
}

function TitleBlock({startingTitle, title, pageId, addBlock, updateTitle, pages, setPages} : TitleBlockProps) {
    const inputTitle = useRef(startingTitle);
    const timer : any = useRef(null)

    useEffect(() => {
        inputTitle.current = title;
    }, [title]);

    function onChange(e) {
        if(e.target.innerHTML == "<br>") {
            e.target.innerHTML = "";
        }
        
        inputTitle.current = e.target.innerHTML;

        const index = pages.map((p) => p.pageId).indexOf(pageId);
        const updatedPages = [...pages];
        updatedPages[index] = {...updatedPages[index], title: e.target.innerHTML};
        setPages(updatedPages);

        clearTimeout(timer.current);
        if(title != e.target.innerHTML) {
            timer.current = setTimeout(() => {
                updateTitle(e.target.innerHTML);
            }, 1200);
        }
    }

    function onBlur() {
        if (title !== inputTitle.current) {
            clearTimeout(timer.current);
            updateTitle(inputTitle.current);
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addBlock();
        }
    }

    return (
        <h1 dangerouslySetInnerHTML={{__html: startingTitle}}
            key={pageId}
            data-position={0}
            onInput={onChange}
            onBlur={onBlur} 
            onKeyDown={onKeyDown}
            placeholder="Untitled"
            contentEditable="true" 
            className="w-[calc(100%-2rem)] my-1 break-words cursor-text empty:before:content-[attr(placeholder)] empty:before:text-neutral-400 focus:outline-none"
        ></h1>
    );
}

export default TitleBlock;