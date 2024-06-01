import { useState, useEffect } from "react";

interface MenuProps {
    position: {
        x?: number;
        y?: number;
    }
    menuItems: any
    exitMenu(): void
    closeMenu(): void
}

function Menu({ position, menuItems, exitMenu, closeMenu }: MenuProps) {
    const [menuList, setMenuList] = useState(menuItems);
    var menuItemList = menuList.flatMap((obj : any) => obj.menuItems);

    const [selectedAction, setSelectedAction] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Checks if category name contains search string, if it does it shows all category items
        // if category name doesn't contain searched string then the app check all items in the categor
        if(search){
            var list : any = [];
            const searchResults = search.toLowerCase();

            for (const category of menuItems){
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
            setMenuList(menuItems);
        }
        menuItemList = menuList.flatMap((obj : any) => obj.menuItems);
    }, [search]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const menuItem = (menuItemList[selectedAction] as any);

                if(menuItem) {
                    handleSelection(menuItem.action)
                }
            } else if (e.key === "Backspace") {
                if (!search) {
                    e.preventDefault();
                    exitMenu();
                }
            } else if (e.key === "Escape") {
                exitMenu();
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


    function handleSelection(action) {           
        if(action) {
            action();
        }

        closeMenu();
    }

    function handleChange(e) {
        setSearch(e.target.value);
    };

    function changeSelectedTag(index: number) {
        setSelectedAction(index);
    }
    
    return (
        <div id="Menu" className="fixed select-none z-10 flex flex-col w-32 max-h-64 bg-white shadow-2xl border border-solid border-gray-200 overflow-x-hidden overflow-y-auto" style={{ top: position.y, left: position.x}}>
            <input data-position="MenuSearch" className="block w-11/12 h-8 mx-auto my-1 center px-3 py-[0.37rem] text-[0.95rem] text-[#495057] border border-solid border-[#ced4da] rounded-sm leading-normal focus:outline-none box-border" placeholder="Search..." onChange={handleChange}></input>
            {menuList.length !== 0 ? (
                menuList.map((object) => {
                    return (
                        <div key={object.title}>
                            <div className="px-2 py-[0.20rem] text-neutral-700 bg-zinc-100 border-0 border-solid border-y border-gray-200 font-lg font-semibold">{object.title}</div>
                            {object.menuItems.map((tag, key) => {
                                return (
                                <div key={key} className={`flex px-1 py-[0.4rem] items-center hover:cursor-pointer ${menuItemList.indexOf(tag) === selectedAction ? "bg-[rgb(221,221,221)]" : ""}`} role="button" tabIndex={0} onMouseOver={() => changeSelectedTag(menuItemList.indexOf(tag))} onClick={() => handleSelection(tag.action)}>
                                    {tag.icon}
                                    <span className="text-[0.9rem]">{tag.label}</span>
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

export default Menu;