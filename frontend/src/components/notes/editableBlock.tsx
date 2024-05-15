import { useRef, useState, useMemo} from "react";
import { getCaretCoordinates, getSelection } from "../../utils/caretControl";
import FormatMenu from "../menus/toolbar/formatMenu";

interface EditableBlockProps {
    content: string
    placeholder: string
    pageId: string
    className?: string
    onChange?(e): void
    onBlur?(e): void
    onKeyDown?(e): void
}

function EditableBlock({content, placeholder, pageId, className, onChange, onBlur, onKeyDown} : EditableBlockProps) {
    const title = useMemo(() => content, [pageId]);

    const [formatMenuDetails, setFormatMenuDetails] = useState({
        open: false,
        position: { x: 0, y: 0}
    });

    function onPaste(e) {
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text);
    }

    function onDrop(e) {
        e.preventDefault();
    }

    function FormatMenuhandler(e) {
        if(e.target.closest("#FormatMenu") === null) {
            closeFormatMenu();
        }
    };

    function openFormatMenu(cord) {
        setFormatMenuDetails({
            open: true,
            position: cord
        })

        // Add listener asynchronously to avoid conflicts with
        // the double click of the text selection
        setTimeout(() => {
            document.addEventListener("click", FormatMenuhandler, true);
        }, 100);
    }

    function closeFormatMenu() {
        setFormatMenuDetails({
            ...formatMenuDetails,
            open: false
        })

        document.removeEventListener("click", FormatMenuhandler, true);
    }

    function handleSelect(e) {
        const block = e.target;
        const { selectionStart, selectionEnd } = getSelection(block);

        if (selectionStart !== selectionEnd) {
            setTimeout(() => {
                const { x: startX, y: startY } = getCaretCoordinates(true);
                const { x: endX, y: endY } = getCaretCoordinates(false);
                
                const middleX = startX + (endX - startX) / 2;
                openFormatMenu({ x: middleX, y: startY - 38 });
            }, 100);
            
        }
        else {
            closeFormatMenu();
        }
    };

    return (
        <>
            {formatMenuDetails.open && (
                <FormatMenu
                    position={formatMenuDetails.position}
                />
            )}
            <h1 key={pageId}
                dangerouslySetInnerHTML={{__html: title}}
                placeholder={placeholder}
                data-position={0}
                onInput={onChange}
                onBlur={onBlur} 
                onPaste={onPaste}
                onDrop={onDrop}
                onKeyDown={onKeyDown}
                onSelect={handleSelect}
                contentEditable="true" 
                className={`break-all cursor-text empty:before:content-[attr(placeholder)] empty:before:text-neutral-400 focus:outline-none ${className}`}
            ></h1>
        </>
        
    );
}

export default EditableBlock;