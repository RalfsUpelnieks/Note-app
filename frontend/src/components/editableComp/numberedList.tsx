import { useState } from "react";

function NumberedList(props: any){
    const [inputValue, setInputValue] = useState(props.properties.number + ".");
    const [type, setType] = useState('');


    function onChange(e){
        setInputValue(e.target.value)
    }

    function onFocus(){
        setInputValue(inputValue.slice(0, -1))
        setType("number");
    }

    function onBlur(e){
        setType("");

        if(/^\d{1,3}$/.test(e.target.value)){
            console.log(true)
            setInputValue(e.target.value + ".");
            props.onPropertyChange("number" , e.target.value)
        }
        else {
            console.log(false)
            setInputValue("1.");
            props.onPropertyChange("number" , "1")
        }
    }

    return (
        <div className={'flex w-[calc(100%-2rem)] group-hover:bg-neutral-100 focus-within:bg-neutral-100' + props.selectionStyling}>
            <input type={type} min={1} step={1} max="999" value={inputValue} className="text-black bg-transparent border-none focus:border-solid focus:mr-1 focus:w-12 w-8 p-0 ml-1" onChange={onChange} onFocus={onFocus} onBlur={onBlur}></input>
            <p className='w-[calc(100%-1.25rem)] outline-none my-1 break-words focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa]' data-position={props.position} onInput={props.onInput} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></p>
        </div>
    )
}

export default NumberedList;