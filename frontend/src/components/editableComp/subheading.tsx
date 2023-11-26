function Subheading(props: any){
    return (
        <h3 className={"w-[calc(100%-2rem)] my-1 outline-none select-text break-words focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa] group-hover:bg-neutral-100 focus:bg-neutral-100" + props.selectionStyling} data-position={props.position} onInput={props.onInput} onFocus={props.onFocus} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></h3>
    )
}

export default Subheading;