import BoldTool from "./bold";
import ItalicTool from "./italic";
import UnderlineTool from "./underline";
import StrikeThroughTool from "./strikeThrough";

interface ActionProps {
    position: {
        x?: number;
        y?: number;
    }
    closeMenu(): void
}

function FormatMenu({ position, closeMenu }: ActionProps) {
    return (
        <div id="FormatMenu" className="fixed select-none z-10 flex shadow-[rgba(0,0,0,0.35)_0px_5px_15px] bg-white border border-solid border-gray-300" style={{ top: position.y, left: position.x}}>
            <BoldTool/>
            <ItalicTool/>
            <UnderlineTool/>
            <StrikeThroughTool/>
        </div>
    );
};

export default FormatMenu;