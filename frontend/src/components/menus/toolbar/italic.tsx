import { IconItalic } from "../../../icons";
import ToolButton from "./toolButton";

export default function ItalicTool(){
    function surround(): void {
        document.execCommand('italic');
    }

    function checkState(): boolean {
        return document.queryCommandState('italic');
    }

    return(
        <ToolButton action={surround} active={checkState()} icon={<IconItalic/>}></ToolButton>
    )
}