import  React from "react";
import { useState, useRef} from "react";
import { Draggable } from "react-beautiful-dnd";
import ActionMenu from "./actionMenu";
import { getCaretCoordinates, setCaretToEnd } from "../utils/caretControl";
import menuList from "../utils/BlockList"

const PLACEHOLDER = `Press 'Control' + 'Space bar' for commands`;

interface ContentBlockProps {
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

function ContentBlock(props : ContentBlockProps) {
    const [properties, setProperties] = useState(props.properties);
    const [startingProperties, setStartingProperties] = useState(props.properties);
    const [type, setType] = useState(props.type);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuPostion, setMenuPostion] = useState({ x: 0, y: 0});
    const timer : any = useRef(null);

    function changeProperty(property, value){
        if(properties[property] !== undefined ){
            const updatedProperties = {...properties, [property]: value};

            setProperties(updatedProperties);
            
            clearTimeout(timer.current);
            if(JSON.stringify(props.properties) != JSON.stringify(updatedProperties)) {
                timer.current = setTimeout(() => { 
                    props.updateBlock(props.blockId, updatedProperties, type);
                }, 1200);
            }
        }
    }

    function changeType(type) {
        const newBlock = menuList.find((element) => element.id == type)

        if(newBlock !== undefined){
            // Assigning default element properties
            var newProperties = { ...newBlock.properties };

            // Assigns all properties that the old and the new have in common
            for(let p in newProperties){
                if(properties[p]){
                    newProperties[p] = properties[p];
                }
            }
            
            setType(type);
            setProperties(newProperties);
            setStartingProperties(newProperties);

            clearTimeout(timer.current);
            props.updateBlock(props.blockId, newProperties, type);

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
        var text = e.clipboardData.getData('text/plain')
        document.execCommand('insertText', false, text)
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
        } else if (e.key === "Enter" && !e.shiftKey && !isMenuOpen) {
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
        }
    }

    function onKeyUp(e) {
        if (e.key === "Backspace" && properties.text === "<br>"){
            setStartingProperties({...startingProperties, ["text"]: ""})
            setProperties({...startingProperties, ["text"]: ""});
        }
    }

    function onHandleClick(e) {
        if(!isMenuOpen) {
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
        setMenuPostion(cord)
        setIsMenuOpen(true)

        // Add listener asynchronously to avoid conflicts with
        // the double click of the text selection
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
        setIsMenuOpen(false);

        document.removeEventListener("click", ActionMenuhandler, true);
        document.body.style.overflowY = 'auto';
    }

    function ActionMenuhandler(e) {
        if(e.target.closest("#ActionMenu") === null) {
            closeActionMenu();
        }
    };

    return (
        <>
            {isMenuOpen && (
                <ActionMenu
                    position={menuPostion}
                    blockPosition={props.position}
                    closeMenu={closeActionMenu}
                    handleSelection={changeType}
                    actions={{ deleteBlock: () => props.deleteBlock(props.blockId) }}
                />
            )}
            <Draggable key={props.blockId} draggableId={props.blockId} index={props.position}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} className={"flex" + (props.isDraggingOver ? "" : " group")} {...provided.draggableProps} style={!snapshot.isDropAnimating ? provided.draggableProps.style : { ...provided.draggableProps.style, transitionDuration: '0.01s' }}> 
                        <span role="button" tabIndex="0" className="self-center p-1 w-4 opacity-0 group-hover:opacity-100" onClick={onHandleClick} {...provided.dragHandleProps}>
                            <i className="fa fa-bars opacity-40 block"/>
                        </span>
                        {
                            React.createElement(menuList.find((element) => element.id == type)!.tag, {
                                blockId: props.blockId,
                                startingProperties: startingProperties,
                                properties: properties,
                                position: props.position,
                                placeholder: PLACEHOLDER,
                                onInput: onInputChange,
                                onPropertyChange: changeProperty,
                                onBlur: onBlur,
                                onKeyDown: onKeyDown,
                                onKeyUp: onKeyUp,
                                onPaste: onPaste,
                                textInputStyling: " px-[2px] py-[2px] my-[1px] break-words outline-none",
                                selectionStyling: (snapshot.isDragging || isMenuOpen ? " bg-neutral-100" : "") + (snapshot.isDragging ? " opacity-80" : "")
                            })
                        }
                    </div>
                )}
            </Draggable>
        </>
    );
}

export default ContentBlock;