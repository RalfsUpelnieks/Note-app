import { IconCircle } from "../../../icons";

function BulletPoint(props: any){
    return (
        <div className={'flex w-[calc(100%-2rem)] group-hover:bg-neutral-100 focus-within:bg-neutral-100' + props.selectionStyling}>
            <div className="mt-[0.35rem] ml-1 mr-1">
                <IconCircle/>
            </div>
            <p className='w-[calc(100%-1.25rem)] outline-none my-1 break-words focus:empty:before:content-[attr(placeholder)] focus:empty:before:text-[#aaa]' data-position={props.position} {...props.contentEditableProps} onBlur={props.onBlur} dangerouslySetInnerHTML={{__html: props.startingProperties.text}}></p>
        </div>
    )
}

export default BulletPoint;