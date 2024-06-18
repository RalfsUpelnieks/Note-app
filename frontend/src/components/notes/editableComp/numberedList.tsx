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
            setInputValue(e.target.value + ".");
            props.onPropertyChange("number" , e.target.value)
        }
        else {
            setInputValue("1.");
            props.onPropertyChange("number" , "1")
        }
    }

    function getInputWidth() {
        let inputWidth = ''
        switch (inputValue.length) {
          case 2:
            inputWidth = 'w-3'
            break
          case 3:
            inputWidth = 'w-5'
            break
          case 4:
            inputWidth = 'w-7'
            break
        }
        return inputWidth
      }

    return (
        <div className={'flex w-[calc(100%-2rem)] group-hover:bg-neutral-100 focus-within:bg-neutral-100' + props.selectionStyling}>
            <input type={type} min={1} step={1} max="999" value={inputValue} className={`text-black focus mt-[0.15rem] bg-transparent border-none focus:mt-0 focus:border-solid focus:mr-1 focus:w-11 p-0 ml-1 ${getInputWidth()}`} onChange={onChange} onFocus={onFocus} onBlur={onBlur}></input>
            <p className={"w-[calc(100%-1.25rem)] focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa]" + props.textInputStyling} data-position={props.position} {...props.contentEditableProps} onBlur={props.onBlur} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></p>
        </div>
    )
}

export default NumberedList;