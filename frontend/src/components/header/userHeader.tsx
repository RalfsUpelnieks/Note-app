import { useState, useEffect, useRef } from "react";
import Header from './header';
import useBooks from '../../hooks/useBooks';
import PLACEHOLDERS from '../../utils/placeholders';
import { IconBook, IconPage, IconBlock, IconArrowRight } from '../../icons';
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

function UserHeader() {
    const [searchOpen, setSearchOpen] : any = useState(false);
    const [bookList, setbookList] : any = useState([]);
    const [pageList, setPageList] : any = useState([]);
    const [blockList, setBlockList] : any = useState([]);
    const [search, setSearch] = useState("");

    const { LogOut } : any = useAuth()
    const { books, OpenBook, OpenPage } : any = useBooks();

    const [message, setMessage] = useState("No results");

    const timer : any = useRef(null)

    useEffect(() => {
        if(search){
            const foundBooks : any = [];
            const foundPages : any = [];
            const searchLowercase = search.toLowerCase();
            
            books.forEach(book => {
                if(book.title.toLowerCase().includes(searchLowercase)) {
                    foundBooks.push(book);
                } else if (book.title === "" && PLACEHOLDERS.book.toLowerCase().includes(searchLowercase)) {
                    foundBooks.push(book);
                }

                book.pages.forEach(page => {
                    if(page.title.toLowerCase().includes(searchLowercase)) {
                        foundPages.push({
                            bookId: book.bookId,
                            bookTitle: book.title,
                            pageId: page.pageId,
                            title: page.title,
                        });
                    } else if (page.title === "" && PLACEHOLDERS.page.toLowerCase().includes(searchLowercase)) {
                        foundPages.push({
                            bookId: book.bookId,
                            bookTitle: book.title,
                            pageId: page.pageId,
                            title: page.title,
                        });
                    }
                });

                // Block data request is only called after the user has finished typing the search quarry
                setMessage("Please wait...")
                clearTimeout(timer.current);
                timer.current = setTimeout(() => {
                    updateBlockList()
                    setMessage("No results")
                }, 1000);
            });

            setbookList(foundBooks);
            setPageList(foundPages);
        } else {
            clearTimeout(timer.current);
            setbookList([]);
            setPageList([]);
            setBlockList([]);
        }
    }, [search]);

    function updateBlockList() {
        api.get(`/api/Note/SearchBlocks/${encodeURI(search)}`).then(response => {
            if (response?.ok) {
                response?.json().then(data => { 
                    data.forEach(element => element.content = JSON.parse(element.content));
                    setBlockList(data)
                });
            } else if (response?.status === 401) {
                LogOut();
            }
        })
    }

    function handleChange(e) {
        setSearch(e.target.value);
    };

    function openSearchPanel() {
        setSearchOpen(true);

        setTimeout(() => {
            document.addEventListener("click", SearchMenuHandle, true);
        }, 100);
    }

    function closeSearchPanel() {
        clearTimeout(timer.current);
        setMessage("No results")

        setSearchOpen(false);

        document.removeEventListener("click", SearchMenuHandle, true);
    }

    function SearchMenuHandle(e) {
        if(e.target.closest("#Search") === null) {
            closeSearchPanel();
        }
    };

    function OnBookSelection(bookId) {
        closeSearchPanel();
        OpenBook(bookId)
    }

    function OnPageSelection(pageId) {
        closeSearchPanel();
        OpenPage(pageId)
    }
    
    return (
        <Header>
            <div id='Search' className='group relative w-2/6 mx-3 lg:ml-[12%]'>
                    <input className='block w-full px-3 py-[0.3rem] text-base text-[#495057] border border-solid border-gray-200 rounded leading-normal focus:outline-none box-border' type="text" placeholder="Search..." onChange={handleChange} onFocus={openSearchPanel}/>
                    {searchOpen && 
                        <div className='flex overflow-y-scroll max-h-96 flex-col w-[calc(100%-2px)] top-8 absolute bg-white rounded-b-[4px] border border-solid border-t-neutral-200 border-[#ced4da]'>
                            {bookList.length !== 0 || pageList.length !== 0 || blockList.length !== 0 ? (
                                <>
                                    {bookList.map(book => {
                                        return (
                                            <div key={book.bookId} onClick={() => OnBookSelection(book.bookId)} className="flex no-underline py-1 px-2 text-zinc-500 hover:bg-neutral-200 hover:cursor-pointer">
                                                <IconBook/><span className='text-black w-11/12 overflow-x-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{__html: book.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.book}} ></span>
                                            </div>
                                        );
                                    })}
                                    {pageList.map(page => {
                                        return (
                                            <div key={page.pageId} onClick={() => OnPageSelection(page.pageId)} className="flex flex-col no-underline py-1 px-2 text-zinc-500 hover:bg-neutral-200 hover:cursor-pointer">
                                                <div className='flex text-xs text-gray-400 overflow-x-hidden whitespace-nowrap text-ellipsis'>
                                                    <IconBook width={14} height={14}/><span className='w-2/3 overflow-x-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{__html: page.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.book}}></span>
                                                </div>
                                                <div className='flex'>
                                                    <IconPage/><span className='text-black w-11/12 ml-[0.15rem] overflow-x-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{__html: page.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.page}}></span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {blockList.map(block => {
                                        if(block.content && block.content.text){
                                            return (
                                                <div key={block.pageId + block.position} onClick={() => OnPageSelection(block.pageId)} className="flex flex-col no-underline py-1 px-2 text-zinc-500 hover:bg-neutral-200 hover:cursor-pointer">
                                                    <div className='flex text-xs items-end text-gray-400 overflow-x-hidden whitespace-nowrap text-ellipsis'>
                                                        <IconBook width={14} height={14}/><span className='max-w-[16rem] overflow-x-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{__html: block.bookTitle.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.book}}></span>
                                                        <IconArrowRight width={14} height={14}/>
                                                        <IconPage width={14} height={14}/><span className='max-w-[16rem] overflow-x-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{__html: block.pageTitle.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.page}}></span>
                                                    </div>
                                                    <div className='flex'>
                                                        <IconBlock/><span className='text-black w-11/12 ml-[0.15rem] overflow-x-hidden whitespace-nowrap text-ellipsis' dangerouslySetInnerHTML={{__html: block.content.text.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || PLACEHOLDERS.page}}></span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })}
                                </>
                            ) : (
                                <div className="px-2 py-1 mx-auto text-gray-500">{message}</div>
                            )}
                        </div>
                    }
                </div>
        </Header>
    )
}

export default UserHeader;