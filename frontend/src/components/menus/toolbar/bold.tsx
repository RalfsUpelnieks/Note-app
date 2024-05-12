import { IconBold } from "../../../icons";
import ToolButton from "./toolButton";

export default function BoldTool(){
    function surround(): void {
        document.execCommand('bold');
    }

    function checkState(): boolean {
        return document.queryCommandState('bold');
    }

    return(
        <ToolButton action={surround} active={checkState()} icon={<IconBold/>}></ToolButton>
    )
}