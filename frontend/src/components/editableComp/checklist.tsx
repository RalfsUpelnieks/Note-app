function Checklist(props: any){

    function handleClick(e){
        props.onPropertyChange("checkbox" , e.target.checked)
    }

    return (
        <div className={'flex w-full group-hover:bg-neutral-100 focus-within:bg-neutral-100' + props.selectionStyling}>
            <input className='w-4 peer/checkbox' type="checkbox" onChange={handleClick} onBlur={props.onBlur} checked={props.properties.checkbox}/>
            <p className='w-full outline-none my-1 peer-checked/checkbox:line-through peer-checked/checkbox:text-gray-600 focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa]' data-position={props.position} onInput={props.onInput} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></p>
        </div>
    )
}

export default Checklist;