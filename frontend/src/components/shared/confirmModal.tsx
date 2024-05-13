import { useEffect} from 'react';
import PopUp from './popup';

function ConfirmModal({closePanel, action, actionName, title, description}) {
    useEffect(() => {
        document.addEventListener('click', ClickOnBlurhandler);
        return () => {
            document.removeEventListener('click', ClickOnBlurhandler);
        };
    }, []);

    function ClickOnBlurhandler(e) {
        if(e.target.id === "blur") {
            closePanel();
        }
    };

    return(
        <div id='blur' className='fixed top-0 bottom-0 left-0 right-0 z-10 bg-[rgba(0,0,0,0.7)]'>
            <PopUp title='Delete'>
                <form className='px-3 py-3 rounded bg-white' onSubmit={closePanel}>
                    <h4 className='mx-1 mt-0 mb-2 break-words'>{title}</h4>
                    <p className='text-xs m-0 mx-1 mb-1'>{description}</p>
                    <div className='flex justify-end'>
                        <button className='w-16 h-7 mt-3 mr-2 font-Roboto font-semibold text-xs bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer border-none rounded'>Cancel</button>
                        <button className='w-16 h-7 mt-3 font-Roboto font-semibold text-xs bg-neutral-100 hover:bg-neutral-200 hover:cursor-pointer border border-solid border-gray-300 rounded' onClick={action}>{actionName}</button>
                    </div>
                </form>
            </PopUp>
        </div>
    )
}

export default ConfirmModal;