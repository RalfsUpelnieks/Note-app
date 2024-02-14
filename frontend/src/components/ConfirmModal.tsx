import { useEffect} from 'react';

function ConfirmModal({closePanel, action, itemName}) {
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
            <form className='relative max-w-xs px-2 py-2 mx-auto mt-56 rounded-xl bg-white' onSubmit={closePanel}>
                <h4 className='mx-1 mt-0 mb-1'>Are you sure you want to delete {itemName}?</h4>
                <p className='text-xs m-0 mx-1'>This item will be permanently deleted. This action is not reversible.  </p>
                <div className='flex justify-end'>
                    <button className='w-16 h-7 mt-3 mr-2 font-Roboto font-semibold text-xs bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded'>Cancel</button>
                    <button className='w-16 h-7 mt-3 font-Roboto font-semibold text-xs bg-neutral-100 hover:bg-neutral-200 hover:cursor-pointer border border-solid border-gray-300 rounded' onClick={action}>Delete</button>
                </div>
            </form>
        </div>
    )
}

export default ConfirmModal;