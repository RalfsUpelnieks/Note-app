import  React from "react";
import { useState, useRef} from "react";
import { Draggable } from "react-beautiful-dnd";
import ActionMenu from "../menus/actionMenu";
import FormatMenu from "../menus/toolbar/formatMenu";
import { getCaretCoordinates, setCaretToEnd, getSelection } from "../../utils/caretControl";
import menuList from "../../utils/blockList"
import { IconDrag } from "../../icons";
import PLACEHOLDERS from "../../utils/placeholders";
import INPUT_LIMITS from "../../utils/inputLimits";

interface NoteBlockProps {
    blockId: string
    pageId: string
    position: number
    type: string
    properties: any
    isDraggingOver: true
    addBlock(blockId: string, properties: string, type: string): void
    deleteBlock(BlockId: string): void
    updateBlock(blockId: string, properties: {}, type: string): void
}

function NoteBlock(props : NoteBlockProps) {
    const [properties, setProperties] = useState(props.properties);
    const [startingProperties, setStartingProperties] = useState(props.properties);
    const [type, setType] = useState(props.type);
    const timer : any = useRef(null);

    const [actionMenuDetails, setActionMenuDetails] = useState({
        open: false,
        position: { x: 0, y: 0}
    });

    const [formatMenuDetails, setFormatMenuDetails] = useState({
        open: false,
        position: { x: 0, y: 0}
    });

    function changeProperty(property, value, updateOnServer = true){
        if(properties[property] !== undefined ){
            const updatedProperties = {...properties, [property]: value};

            setProperties(updatedProperties);
            
            if(updateOnServer){
                clearTimeout(timer.current);
                if(JSON.stringify(props.properties) != JSON.stringify(updatedProperties)) {
                    timer.current = setTimeout(() => { 
                        props.updateBlock(props.blockId, updatedProperties, type);
                    }, 1200);
                }
            }
        }
    }

    function changeType(newType) {
        const newBlock = menuList.find((element) => element.id == newType)

        if(newBlock !== undefined){
            // Assigning default element properties
            var newProperties = { ...newBlock.properties };

            // Assigns all properties that the old and the new have in common
            for(let p in newProperties){
                if(properties[p]){
                    newProperties[p] = properties[p];
                }
            }
            
            setType(newType);
            setProperties(newProperties);
            setStartingProperties(newProperties);

            clearTimeout(timer.current);
            props.updateBlock(props.blockId, newProperties, newType);

            setTimeout(() => {
                const block: HTMLElement | null = document.querySelector(`[data-position="${props.position}"]`);
                if (block) {
                    setCaretToEnd(block);
                }
            }, 100);

            closeActionMenu();
        }
    }

    function onInputChange(e) {
        changeProperty("text", e.target.innerHTML);
    }

    function onPaste(e) {
        e.preventDefault();

        const block = e.target;
        const { selectionStart, selectionEnd } = getSelection(block);

        var text = e.clipboardData.getData('text/plain')

        var selectedCharCount = selectionEnd - selectionStart
        var textLength =  e.target.innerText.length + text.length - selectedCharCount

        if(textLength <= INPUT_LIMITS.BlockContent){
            document.execCommand('insertText', false, text);
        }
    }

    function onDrop(e) {
        e.preventDefault();
    }

    function onBlur() {
        if (JSON.stringify(props.properties) !== JSON.stringify(properties)) {
            clearTimeout(timer.current);
            props.updateBlock(props.blockId, properties, type);
        }
    }

    function onKeyDown(e) {
        if (e.key === "Backspace" && !properties.text) {
            e.preventDefault();
            clearTimeout(timer.current);
            props.deleteBlock(props.blockId);
        } else if (e.key === "Enter" && !e.shiftKey && !actionMenuDetails.open) {
            e.preventDefault();

            props.addBlock(props.blockId, properties, type);
        } else if (e.key == " " && e.ctrlKey) {
            e.preventDefault();

            e.target.blur();
            e.target.focus();

            let {x, y} = getCaretCoordinates(true);

            if (y < 80){
                y = 80;
            } else if (y + 280 > window.innerHeight) {
                y -= 256;
            } else {
                y += 22
            }

            openActionMenu({x, y});
        } else if(e.keyCode > 46 && !e.ctrlKey && e.target.innerText.length >= INPUT_LIMITS.BlockContent) {
            e.preventDefault();
        }
    }

    function onKeyUp(e) {
        if (e.key === "Backspace" && properties.text === "<br>"){
            setStartingProperties({...startingProperties, ["text"]: ""})
            setProperties({...startingProperties, ["text"]: ""});
        }
    }

    function onHandleClick(e) {
        if(!actionMenuDetails.open) {
            const react = e.target.getBoundingClientRect();
            let {x, y} = { x: react.left - 135, y: 0 };

            if (react.top < 80){
                y = 80;
            } else if (react.top + 258 > window.innerHeight) {
                y = window.innerHeight - 268;
            } else {
                y = react.top - 11;
            }

            openActionMenu({x, y});
        }
    }

    function openActionMenu(cord) {
        setActionMenuDetails({
            open: true,
            position: cord
        })

        setTimeout(() => {
            document.addEventListener("click", ActionMenuhandler, true);
            document.body.style.overflowY = 'hidden';

            const block: HTMLElement | null = document.querySelector(`[data-position="Search"]`);
            if (block) {
                setCaretToEnd(block);
            }
        }, 100);
    }

    function closeActionMenu() {
        setActionMenuDetails({
            ...actionMenuDetails,
            open: false
        })

        document.removeEventListener("click", ActionMenuhandler, true);
        document.body.style.overflowY = 'auto';
    }

    function openFormatMenu(cord) {
        setFormatMenuDetails({
            open: true,
            position: cord
        })

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

    function ActionMenuhandler(e) {
        if(e.target.closest("#ActionMenu") === null) {
            closeActionMenu();
        }
    };

    function FormatMenuhandler(e) {
        if(e.target.closest("#FormatMenu") === null) {
            closeFormatMenu();
        }
    };

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
            {actionMenuDetails.open && (
                <ActionMenu
                    position={actionMenuDetails.position}
                    blockPosition={props.position}
                    closeMenu={closeActionMenu}
                    handleSelection={changeType}
                    actions={{ deleteBlock: () => props.deleteBlock(props.blockId) }}
                />
            )}
            {formatMenuDetails.open && (
                <FormatMenu
                    position={formatMenuDetails.position}
                />
            )}
            <Draggable key={props.blockId} draggableId={props.blockId} index={props.position}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className={`flex ${props.isDraggingOver ? "" : "group"}`} style={!snapshot.isDropAnimating ? provided.draggableProps.style : { ...provided.draggableProps.style, transitionDuration: '0.01s' }}> 
                        <div onClick={onHandleClick} tabIndex="0" className="flex text-neutral-400 self-center opacity-0 group-hover:opacity-100"  {...provided.dragHandleProps}>
                            <IconDrag/>
                        </div>
                        {
                            React.createElement(menuList.find((element) => element.id == type)!.tag, {
                                blockId: props.blockId,
                                startingProperties: startingProperties,
                                properties: properties,
                                position: props.position,
                                contentEditableProps: { onSelect: handleSelect, onInput: onInputChange, onPaste: onPaste, onDrop: onDrop, onKeyDown: onKeyDown, onKeyUp: onKeyUp, placeholder: PLACEHOLDERS.blockInput, contentEditable: true },
                                onPropertyChange: changeProperty,
                                onBlur: onBlur,
                                textInputStyling: " px-[2px] py-[2px] my-[1px] break-words outline-none",
                                selectionStyling: (snapshot.isDragging || actionMenuDetails.open ? " bg-neutral-100" : "") + (snapshot.isDragging ? " opacity-80" : "")
                            })
                        }
                    </div>
                )}
            </Draggable>
        </>
    );
}

export default NoteBlock;