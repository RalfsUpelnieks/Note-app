import { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";

import styles from "../stylesheets/Menu.module.css"

const tags = [
    {
        id: "page-title",
        tag: "h1",
        label: "Page Title",
    },{
        id: "heading",
        tag: "h2",
        label: "Heading",
    },{
        id: "subheading",
        tag: "h3",
        label: "Subheading",
    },{
        id: "paragraph",
        tag: "p",
        label: "Paragraph",
    },{
        id: "image",
        tag: "img",
        label: "Image",
    },
];

const ActionMenu = ({ position, closeMenu, handleSelection, actions }) => {
    const [tagList, setTagList] = useState(tags);
    const [selectedTag, setSelectedTag] = useState(0);
    const [command, setCommand] = useState("");

    // const isMenuOutsideOfTopViewport = position.y - MENU_HEIGHT < 0;
    // const y = !isMenuOutsideOfTopViewport ? position.y - MENU_HEIGHT : position.y + MENU_HEIGHT / 3;
    // const x = position.x;

    // Filter tagList based on given command
    useEffect(() => {
        setTagList(matchSorter(tags, command, { keys: ["tag"] }));
    }, [command]);

    // Attach listener to allow tag selection via keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSelection(tagList[selectedTag].tag);
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
        <div className={styles.menuWrapper}
        style={{ top: position.y, left: position.x}}>
            <div className={styles.menu}>
                {tagList.map((tag, key) => {
                    return (
                        <div key={key}
                        data-tag={tag.tag}
                        className={tagList.indexOf(tag) === selectedTag ? [styles.item, styles.selectedTag].join(" ") : styles.item
                        }
                        role="button"
                        tabIndex="0"
                        onClick={() => handleSelection(tag.tag)}>
                            {tag.label}
                        </div>
                    );
                })}
                <span id="delete" className={styles.item} role="button" tabIndex="0" onClick={() => actions.deleteBlock()}>
                    <i alt="Trash Icon" /> delete
                </span>
            </div>
        </div>
    );
};

export default ActionMenu;