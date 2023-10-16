import { useState, useEffect } from "react";
import blockList from "../utils/BlockList"
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
    handlePropertyChange(property: string, value: string): void
    actions: DeleteAction
}

function ActionMenu({ position, closeMenu, handleSelection, handlePropertyChange, actions }: ActionProps) {
    const actionMenu = [
        {
            id: "delete",
            action: () => actions.deleteBlock(),
            label: "Delete",
        }
    ];

    const menu = [{title: "Blocks", menuItems: blockList}, {title: "Actions", menuItems: actionMenu}];

    const [menuList, setMenuList] = useState(menu);
    var menuItemList = menuList.flatMap((obj : any) => obj.menuItems);

    const [selectedTag, setSelectedTag] = useState(0);
    const [commandPosition, setCommandPosition] = useState(0);
    const [command, setCommand] = useState("");

    // Filter tagList based on given command
    useEffect(() => {
        // Checks if category name contains search string(command) if it does it shows all category items
        // if category name doesn't contain searched string then the app check all items in the categor
        if(command){
            var list : any = [];
            const search = command.toLowerCase();

            for (const category in menu){
                if(menu[category].title.toLowerCase().includes(search)){
                    list.push(menu[category]);
                } else {
                    var items : any = [];
                    
                    for (const itemInCategory in menu[category].menuItems){
                        if(menu[category].menuItems[itemInCategory].id.toLowerCase().includes(search) || menu[category].menuItems[itemInCategory].label.toLowerCase().includes(search)){
                            items.push(menu[category].menuItems[itemInCategory]);
                        }
                    }

                    if(items.length !== 0){
                        list.push({title: menu[category].title, menuItems: items})
                    }
                }
            }
            setMenuList(list);
        } else {
            setMenuList(menu);
        }
        menuItemList = menuList.flatMap((obj : any) => obj.menuItems);
    }, [command]);

    // Attach listener to allow tag selection via keyboard
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "/") {
                setCommand("");
                setCommandPosition(0);
            } else if (e.key === "Enter") {
                e.preventDefault();
                const menutime = (menuItemList[selectedTag] as any);
                if(menutime.action){
                    menutime.action();
                } else {
                    handleSelection(menutime.id);
                }
            } else if (e.key === "Backspace") {
                if (command) {
                    setCommand(command.slice(0, -1));
                    setCommandPosition(commandPosition - 1);
                } else {
                    closeMenu();
                }
            } else if (e.key === "Tab" || e.key === "ArrowDown") {
                e.preventDefault();
                const newSelectedTag = selectedTag === menuItemList.length - 1 ? 0 : selectedTag + 1;
                setSelectedTag(newSelectedTag);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const newSelectedTag = selectedTag === 0 ? menuItemList.length - 1 : selectedTag - 1;
                setSelectedTag(newSelectedTag);
            } else if (e.key === "ArrowLeft") {
                setCommandPosition(commandPosition - 1);
                if(commandPosition === 0){
                    closeMenu();
                } else {
                    setCommandPosition(commandPosition - 1);
                }
            } else if (e.key === "ArrowRight") {
                var sel = document.getSelection();

                if(sel){
                    var range = sel.getRangeAt(0);
                    var textLength = range.commonAncestorContainer.textContent?.length;

                    //if caret is not at the end
                    if(textLength !== range.endOffset) {
                        // if caret is going pass the command close the menu
                        if (commandPosition >= command.length){
                            closeMenu();
                        }

                        setCommandPosition(commandPosition + 1);
                    }
                }
            } else if(e.key.length == 1) {
                setCommand(command + e.key);
                setCommandPosition(commandPosition + 1);
            }
            console.log(commandPosition)
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuList, selectedTag, commandPosition]);

    return (
        <div className={styles.menuWrapper} style={{ top: position.y, left: position.x}}>
            <div className={styles.menu}>
                {menuList.length !== 0 ? (
                    menuList.map((object) => {
                        return (
                            <div key={object.title}>
                                <div className="px-2 py-1">{object.title}</div>
                                {object.menuItems.map((tag, key) => {
                                    return (
                                    <div key={key} className={menuItemList.indexOf(tag) === selectedTag ? [styles.item, styles.selectedTag].join(" ") : styles.item} role="button" tabIndex={0} onClick={tag.action ? tag.action : () => handleSelection(tag.id)}>
                                    {tag.label}
                                    </div>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <div className="px-2 py-1 text-gray-500">No results</div>
                )}
            </div>
        </div>
    );
};

export default ActionMenu;