import { IconArrowRight } from '../../icons';

interface LinkButtonProps {
    Text: string;
    Link: string;
}

function LinkButton({Text, Link}: LinkButtonProps) {
    return(
        <a href={Link} className='flex items-center text-neutral-500 no-underline'>
            <span className='text-[15px]'>{Text}</span>
            <IconArrowRight/>
        </a>
    )
}

export default LinkButton;