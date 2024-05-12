function Paragraph(props: any){
    return (
        <p className={"w-[calc(100%-2rem)] focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa] group-hover:bg-zinc-100 focus:bg-zinc-100" + props.textInputStyling + props.selectionStyling} data-position={props.position} {...props.contentEditableProps} onBlur={props.onBlur} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></p>
    )
}

export default Paragraph;