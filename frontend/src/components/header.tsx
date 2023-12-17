import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";


function Header({isAdmin, pages}: any) {
    const emptyTextPlaceholder = "untitled";
    const navigate = useNavigate();
    const [pageList, setPageList] : any = useState(pages);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState(0);

    useEffect(() => {
        updatePageList();
    }, [search]);

    function handleChange(e) {
        setSearch(e.target.value);
    };

    function blur(e) {
        e.currentTarget.blur()
    }

    function updatePageList() {
        if(search){
            var list : any = [];
            const searchLowercase = search.toLowerCase();

            for (const item of pages){
                if(item.title.toLowerCase().includes(searchLowercase)) {
                    list.push(item);
                } else if (item.title === "" && emptyTextPlaceholder.includes(searchLowercase)) {
                    list.push(item);
                }
            }
            setPageList(list);
        } else {
            setPageList([]);
        }
    }

    function logOutUser(){
        localStorage.removeItem('token');
        navigate("/login")
    }
    
    return (
        <header className='flex fixed left-0 right-0 top-0 bottom-auto px-4 justify-between z-10 items-center bg-[rgb(233,233,233)] shadow-[0px_3px_5px_-1px_rgba(0,0,0,0.2),_0px_1px_14px_0px_rgba(0,0,0,0.12)]'>
            <h1 className='text-3xl my-3'>SwiftNotes</h1>
            {isAdmin ? (
                <h4 className='self-end ml-2 mr-auto mb-4 opacity-70'>admin page</h4>
            ) : (
                <div className='group relative w-2/6 mx-3 lg:ml-[12%]'>
                    <input type="text" placeholder="Search..." onChange={handleChange} onFocus={updatePageList}/>
                    {search && 
                        <div className='hidden group-focus-within:flex peer-focus-within:flex flex-col w-[calc(100%-2px)] top-8 absolute bg-white rounded-b-[4px] border border-solid border-t-neutral-200 border-[#ced4da]'>
                            {pageList.length !== 0 ? (
                                pageList.map((object) => {
                                    return (
                                        <Link to={`/page/${object.pageId}`} onClick={blur} className="no-underline text-black px-2 hover:bg-neutral-200 overflow-hidden text-ellipsis">
                                                <span>{object.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || "Untitled"}</span>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="px-2 py-1 text-gray-500">No results</div>
                            )}
                        </div>
                    }
                </div>
            )}
            <button onClick={logOutUser} className='w-24 h-9 font-semibold text-sm bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded'>Log out</button>
        </header>
    )
}

export default Header;