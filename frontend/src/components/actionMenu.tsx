import { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";
import menuList from "../utils/MenuList"

import styles from "../stylesheets/actionMenu.module.css"

interface DeleteAction {
    deleteBlock: () => void;
}

interface ActionProps {
    position: {
        x?: number;
        y?: number;
    }
    closeMenu(): void
    handleSelection(id: string): void
    actions: DeleteAction
}

function ActionMenu({ position, closeMenu, handleSelection, actions }: ActionProps) {
    const [tagList, setTagList] = useState(menuList);
    const [selectedTag, setSelectedTag] = useState(0);
    const [command, setCommand] = useState("");

    // const isMenuOutsideOfTopViewport = position.y - MENU_HEIGHT < 0;
    // const y = !isMenuOutsideOfTopViewport ? position.y - MENU_HEIGHT : position.y + MENU_HEIGHT / 3;
    // const x = position.x;

    // Filter tagList based on given command
    useEffect(() => {
        setTagList(matchSorter(menuList, command, { keys: ["tag"] }));
    }, [command]);

    // Attach listener to allow tag selection via keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSelection(tagList[selectedTag].id);
            } else if (e.key === "Tab" || e.key === "ArrowDown") {
                e.preventDefault();
                const newSelectedTag =
                selectedTag === tagList.length - 1 ? 0 : selectedTag + 1;
                setSelectedTag(newSelectedTag);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const newSelectedTag =
                selectedTag === 0 ? tagList.length - 1 : selectedTag - 1;
                setSelectedTag(newSelectedTag);
            } else if (e.key === "Backspace") {
                if (command) {
                setCommand(command.slice(0, -1));
                } else {
                closeMenu();
                }
            } else {
                setCommand(command + e.key);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [tagList, selectedTag]);

    return (
        <div className={styles.menuWrapper} style={{ top: position.y, left: position.x}}>
            <div className={styles.menu}>
                {tagList.map((tag, key) => {
                    return (
                        <div 
                            key={key}
                            className={tagList.indexOf(tag) === selectedTag ? [styles.item, styles.selectedTag].join(" ") : styles.item}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleSelection(tag.id)}
                        >
                            {tag.label}
                        </div>
                    );
                })}
                <div className={styles.item} style={ Object.assign({color: "red"}, {paddingLeft: "6px"})} role="button" tabIndex={0} onClick={() => actions.deleteBlock()}>
                    <i className="fa fa-trash " /><span style={{marginLeft: "6px"}}>delete</span>
                </div>
            </div>
        </div>
    );
};

export default ActionMenu;