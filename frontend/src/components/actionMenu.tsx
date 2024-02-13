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
    actions: DeleteAction
}

function ActionMenu({ position, blockPosition, closeMenu, handleSelection, actions }: ActionProps) {
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

    const [selectedAction, setSelectedAction] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Checks if category name contains search string, if it does it shows all category items
        // if category name doesn't contain searched string then the app check all items in the categor
        if(search){
            var list : any = [];
            const searchResults = search.toLowerCase();

            for (const category of menu){
                if(category.title.toLowerCase().includes(searchResults)) {
                    list.push(category);
                } else {
                    var items : any = [];
                    
                    for (const itemInCategory of category.menuItems){
                        if(itemInCategory.id.toLowerCase().includes(searchResults) || itemInCategory.label.toLowerCase().includes(searchResults)){
                            items.push(itemInCategory);
                        }
                    }

                    if(items.length !== 0) {
                        list.push({title: category.title, menuItems: items})
                    }
                }
            }
            setMenuList(list);
        } else {
            setMenuList(menu);
        }
        menuItemList = menuList.flatMap((obj : any) => obj.menuItems);
    }, [search]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const menutime = (menuItemList[selectedAction] as any);

                if(menutime) {
                    closeMenu();
                    
                    if(menutime.action) {
                        menutime.action();
                    } else {
                        handleSelection(menutime.id);
                    }
                }
            } else if (e.key === "Backspace") {
                if (!search) {
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
                const newSelectedAction = selectedAction === menuItemList.length - 1 ? 0 : selectedAction + 1;
                setSelectedAction(newSelectedAction);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const newSelectedAction = selectedAction === 0 ? menuItemList.length - 1 : selectedAction - 1;
                setSelectedAction(newSelectedAction);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuList, selectedAction]);

    function handleChange(e) {
        setSearch(e.target.value);
    };

    function changeSelectedTag(index: number) {
        setSelectedAction(index);
    }

    return (
        <div id="ActionMenu" className="fixed select-none z-10 flex flex-col w-32 max-h-64 bg-white shadow-[rgba(0,0,0,0.16)_0px_10px_36px_0px,rgba(0,0,0,0.06)_0px_0px_0px_1px] rounded-lg overflow-x-hidden overflow-y-auto" style={{ top: position.y, left: position.x}}>
            <input className="block w-11/12 h-8 mx-auto mt-1 center px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border" data-position="Search" placeholder="Search..." onChange={handleChange}></input>
            {menuList.length !== 0 ? (
                menuList.map((object) => {
                    return (
                        <div key={object.title}>
                            <div className="px-2 py-[0.20rem] font-lg font-semibold">{object.title}</div>
                            {object.menuItems.map((tag, key) => {
                                return (
                                <div key={key} className={"px-4 py-2 hover:cursor-pointer" + (menuItemList.indexOf(tag) === selectedAction ? " bg-[rgb(228,228,228)]" : "")} role="button" tabIndex={0} onMouseOver={() => changeSelectedTag(menuItemList.indexOf(tag))} onClick={tag.action ? tag.action : () => handleSelection(tag.id)}>
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