import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import useAuth from '../hooks/useAuth';
import Profile from './profile';

function Header({user, pages}: any) {
    const { LogOut } : any = useAuth()
    const emptyTextPlaceholder = "untitled";
    const [pageList, setPageList] : any = useState(pages);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState(0);

    const [profilePanelOpen, setProfilePanelOpen] = useState(false);

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
        LogOut();
    }
    
    return (
        <header className='flex select-none fixed left-0 right-0 top-0 bottom-auto px-4 justify-between z-10 items-center bg-[rgb(233,233,233)] shadow-[0px_3px_5px_-1px_rgba(0,0,0,0.2),_0px_1px_14px_0px_rgba(0,0,0,0.12)]'>
            {profilePanelOpen &&
                <Profile closePanel={() => setProfilePanelOpen(false)}/>
            }
            <h1 className='text-3xl my-3'>NoteBooks</h1>
            {user?.role == "1" ? (
                <h4 className='self-end ml-2 mr-auto mb-4 opacity-70'>admin page</h4>
            ) : (
                <div className='group relative w-2/6 mx-3 lg:ml-[12%]'>
                    <input className='block w-full px-3 py-[0.375rem] text-[1rem] text-[#495057] border border-solid border-[#ced4da] rounded leading-normal focus:outline-none box-border' type="text" placeholder="Search..." onChange={handleChange} onFocus={updatePageList}/>
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
            
            <div className='flex items-center'>
                <button onClick={() => setProfilePanelOpen(!profilePanelOpen)} className={'border border-solid rounded py-[2px] mr-2 px-1 no-underline text-gray-900 border-neutral-400 ' + (profilePanelOpen ? "bg-zinc-700 border-neutral-600 text-white" : "bg-white hover:bg-neutral-200")}>
                    <h4 className='m-0 text-xs mt-[0.10rem]'>{user?.username}</h4>
                    <p className='m-0 text-xs'>{user?.name} {user?.surname}</p>
                </button>
                <button onClick={logOutUser} className='w-24 h-9 font-Roboto font-bold bg-zinc-800 text-white hover:bg-black hover:cursor-pointer border-none rounded'>Log out</button>
            </div>
        </header>
    )
}

export default Header;