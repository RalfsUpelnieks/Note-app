function Heading(props: any){
    return (
        <h2 className={"w-[calc(100%-2rem)] focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa] group-hover:bg-neutral-100 focus:bg-neutral-100" + props.textInputStyling + props.selectionStyling} data-position={props.position} onInput={props.onInput} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} onPaste={props.onPaste} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></h2>
    )
}

export default Heading;