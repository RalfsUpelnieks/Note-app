import { IconStrikeThrough } from "../../../icons";
import ToolButton from "./toolButton";

export default function StrikeThroughTool(){
    function surround(): void {
        document.execCommand('strikethrough');
    }

    function checkState(): boolean {
        return document.queryCommandState('strikethrough');
    }

    return(
        <ToolButton action={surround} active={checkState()} icon={<IconStrikeThrough/>}></ToolButton>
    )
}