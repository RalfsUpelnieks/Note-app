import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import Header from './header';

function UserHeader() {
    const emptyTextPlaceholder = "untitled";
    const [pageList, setPageList] : any = useState();
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

            // for (const item of pages){
            //     if(item.title.toLowerCase().includes(searchLowercase)) {
            //         list.push(item);
            //     } else if (item.title === "" && emptyTextPlaceholder.includes(searchLowercase)) {
            //         list.push(item);
            //     }
            // }
            setPageList(list);
        } else {
            setPageList([]);
        }
    }
    
    return (
        <Header>
            <div className='group relative w-2/6 mx-3 lg:ml-[12%]'>
                    <input className='block w-full px-3 py-[0.3rem] text-base text-[#495057] border border-solid border-gray-200 rounded leading-normal focus:outline-none box-border' type="text" placeholder="Search..." onChange={handleChange} onFocus={updatePageList}/>
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
        </Header>
    )
}

export default UserHeader;