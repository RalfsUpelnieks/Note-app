import React from 'react';

function Checklist(props: any){
    const [checked, setChecked] = React.useState(false);

    function onChange(){
        setChecked(!checked);
    }

    return (
        <div className='flex w-full hover:bg-gray-100'> 
            <input className='w-4 peer/checkbox' type="checkbox" onChange={onChange} checked={checked}/>
            <p className='w-full outline-none my-1 peer-checked/checkbox:line-through peer-checked/checkbox:text-gray-600' data-position={props.position} onInput={props.onInput} onFocus={props.onFocus} onBlur={props.onBlur} onKeyDown={props.onKeyDown} onKeyUp={props.onKeyUp} contentEditable={true} placeholder={props.placeholder} dangerouslySetInnerHTML={{__html: props.properties.text}}></p>
        </div>
    )
}

export default Checklist;