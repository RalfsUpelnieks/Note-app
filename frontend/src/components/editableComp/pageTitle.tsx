function PageTitle(props: any){
    return (
        <h1 className="w-[calc(100%-2rem)] my-1 outline-none select-text break-words focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa]" data-position={props.position} onInput={props.onInput} onFocus={props.onFocus} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.properties.text}}></h1>
    )
}

export default PageTitle;