import { IconUnderline } from "../../../icons";
import ToolButton from "./toolButton";

export default function UnderlineTool(){
    function surround(): void {
        document.execCommand('underline');
    }

    function checkState(): boolean {
        return document.queryCommandState('underline');
    }

    return(
        <ToolButton action={surround} active={checkState()} icon={<IconUnderline/>}></ToolButton>
    )
}