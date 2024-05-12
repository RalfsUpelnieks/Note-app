import { useState, useEffect } from "react";
import COLORS from "../../utils/colors";

interface ActionProps {
    position: {
        x?: number;
        y?: number;
    }
    closeMenu(): void
    handleSelection(id: string): void
}

function ColorMenu({ position, closeMenu, handleSelection }: ActionProps) {
    const [selectedAction, setSelectedAction] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const menutime = (COLORS[selectedAction] as any);

                if(menutime) {
                    closeMenu();
                    
                    if(menutime.action) {
                        menutime.action();
                    } else {
                        handleSelection(menutime.id);
                    }
                }
            } else if (e.key === "Escape") {
                closeMenu();
            } else if (e.key === "Tab" || e.key === "ArrowDown") {
                e.preventDefault();
                const newSelectedAction = selectedAction === COLORS.length - 1 ? 0 : selectedAction + 1;
                setSelectedAction(newSelectedAction);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                const newSelectedAction = selectedAction === 0 ? COLORS.length - 1 : selectedAction - 1;
                setSelectedAction(newSelectedAction);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedAction]);

    return (
        <div id="ActionMenu" className="fixed select-none z-10 flex flex-col w-32 max-h-64 bg-white border border-solid border-gray-200 overflow-x-hidden overflow-y-auto" style={{ top: position.y, left: position.x}}>
            <div className="px-2 py-[0.20rem] font-lg font-semibold border-0 border-b border-solid bg-zinc-100 border-gray-200">Colors</div>
            {COLORS.map((Colors: {id: string, name: string, backgroundColor: string,  textColor: string}, key) => {
                return (
                <div key={Colors.id} className={`px-2 py-2 items-center flex hover:cursor-pointer hover:bg-neutral-100`} role="button" tabIndex={0} onClick={() => handleSelection(Colors.id)}>
                    <div className="h-4 w-4 mr-2 border border-solid" style={{ backgroundColor: Colors.backgroundColor, borderColor: Colors.textColor}}></div>
                {Colors.name}

                </div>
                );
            })}
        </div>
    );
};

export default ColorMenu;