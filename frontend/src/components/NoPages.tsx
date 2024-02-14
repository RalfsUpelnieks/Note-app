function NoPages() {
    return (
        <div>
            <h1 className="text-neutral-800 mb-2">You currently have no note books.</h1>
            <div className="text-neutral-500 flex items-center">
                <i className="fa fa-arrow-left mr-1"></i> 
                <h3 className="m-0">You can add books on the left side menu.</h3>
            </div>
            
        </div>
    );
}

export default NoPages