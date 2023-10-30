import { useState, useEffect } from "react";
import blockList from "../utils/BlockList";
import { setCaretToEnd } from "../utils/caretControl";

interface DeleteAction {
    deleteBlock: () => void;
}

interface ActionProps {
    position: {
        x?: number;
        y?: number;
    }
    blockPosition: number
    closeMenu(): void
    handleSelection(id: string): void
    handlePropertyChange(property: string, value: string): void
    actions: DeleteAction
}

function ActionMenu({ position, blockPosition, closeMenu, handleSelection, handlePropertyChange, actions }: ActionProps) {
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
    const [command, setCommand] = useState("");

    // Filter tagList based on given command
    useEffect(() => {
        // Checks if category name contains search string(command) if it does it shows all category items
        // if category name doesn't contain searched string then the app check all items in the categor
        if(command){
            var list : any = [];
            const search = command.toLowerCase();

            for (const category of menu){
                if(category.title.toLowerCase().includes(search)){
                    list.push(category);
                } else {
                    var items : any = [];
                    
                    for (const itemInCategory of category.menuItems){
                        if(itemInCategory.id.toLowerCase().includes(search) || itemInCategory.label.toLowerCase().includes(search)){
                            items.push(itemInCategory);
                        }
                    }

                    if(items.length !== 0){
                        list.push({title: category.title, menuItems: items})
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
            if (e.key === "Enter") {
                e.preventDefault();
                const menutime = (menuItemList[selectedTag] as any);
                if(menutime.action){
                    menutime.action();
                } else {
                    handleSelection(menutime.id);
                }
            } else if (e.key === "Backspace") {
                if (!command) {
                    e.preventDefault();
                    const block = (document.querySelector(`[data-position="${blockPosition}"]`) as HTMLElement);
                    if (block) {
                        setCaretToEnd(block);
                    }
                    
                    closeMenu();
                }
            } else if (e.key === "Escape") {
                const block = (document.querySelector(`[data-position="${blockPosition}"]`) as HTMLElement);
                if (block) {
                    setCaretToEnd(block);
                }

                closeMenu();
            } else if (e.key === "Tab" || e.key === "ArrowDown") {
                e.preventDefault();
                const newSelectedTag = selectedTag === menuItemList.length - 1 ? 0 : selectedTag + 1;
                setSelectedTag(newSelectedTag);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const newSelectedTag = selectedTag === 0 ? menuItemList.length - 1 : selectedTag - 1;
                setSelectedTag(newSelectedTag);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuList, selectedTag]);

    function handleChange(e) {
        setCommand(e.target.value);
    };

    function changeSelectedTag(index: number){
        setSelectedTag(index);
    }

    return (
        <div className="absolute flex flex-col w-32 max-h-64 bg-white shadow-[rgba(0,0,0,0.16)_0px_10px_36px_0px,rgba(0,0,0,0.06)_0px_0px_0px_1px] rounded-lg overflow-x-hidden overflow-y-auto" style={{ top: position.y, left: position.x}}>
            <input className="w-11/12 h-8 mx-auto mt-1 center" data-position="Search" placeholder="Search..." onChange={handleChange}></input>
            {menuList.length !== 0 ? (
                menuList.map((object) => {
                    return (
                        <div key={object.title}>
                            <div className="px-2 py-[0.20rem] font-lg font-semibold">{object.title}</div>
                            {object.menuItems.map((tag, key) => {
                                return (
                                <div key={key} className={"px-4 py-2 hover:cursor-pointer" + (menuItemList.indexOf(tag) === selectedTag ? " bg-[rgb(228,228,228)]" : "")} role="button" tabIndex={0} onMouseOver={() => changeSelectedTag(menuItemList.indexOf(tag))} onClick={tag.action ? tag.action : () => handleSelection(tag.id)}>
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
    );
};

export default ActionMenu;