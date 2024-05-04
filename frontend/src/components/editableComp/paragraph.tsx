function Paragraph(props: any){
    return (
        <p className={"w-[calc(100%-2rem)] focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa] group-hover:bg-zinc-100 focus:bg-zinc-100" + props.textInputStyling + props.selectionStyling} data-position={props.position} onInput={props.onInput} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} onPaste={props.onPaste} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></p>
    )
}

export default Paragraph;