import { createContext, useState } from "react";
import Menu from "../components/menus/menu";
import { setCaretToEnd } from "../utils/caretControl";

const MenuContext = createContext({});

export const MenuProvider = ({ children }) => {
    const [menuDetails, setMenuDetails] = useState<any>({
        id: "",
        isOpen: false,
        position: { x: 0, y: 0},
        menuItems: null,
        onMenuClose: null
    });

    function OpenMenu(id, menuItems, position, onMenuClose = null) {
        setMenuDetails({
            id: id,
            isOpen: true,
            position: position,
            menuItems: menuItems,
            onMenuClose: onMenuClose
        })

        setTimeout(() => {
            document.addEventListener("click", MenuHandler, true);
            document.getElementById("MainContent")!.style.overflowY = 'hidden';

            const block: HTMLElement | null = document.querySelector(`[data-position="MenuSearch"]`);
            if (block) {
                setCaretToEnd(block);
            }
        }, 100);
    }

    function ExitMenu() {
        if(menuDetails.onMenuClose) {
            menuDetails.onMenuClose();
        }

        CloseMenu();
    }

    function CloseMenu() {
        setMenuDetails({
            ...menuDetails,
            isOpen: false
        })

        document.removeEventListener("click", MenuHandler, true);
        document.getElementById("MainContent")!.style.overflowY = 'auto';
    }

    function MenuHandler(e) {
        if(e.target.closest("#Menu") === null) {
            CloseMenu();
        }
    };

    return (
        <MenuContext.Provider value={{ OpenMenu, CloseMenu, menuDetails }}>
            { children }
            { menuDetails.isOpen && 
                <Menu position={menuDetails.position} menuItems={menuDetails.menuItems} exitMenu={ExitMenu} closeMenu={CloseMenu}/> 
            }
        </MenuContext.Provider>
    )
}

export default MenuContext;