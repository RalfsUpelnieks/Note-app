import { useState, useEffect, useRef} from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import EditableBlock from "./editableBlock";
import { IconHorizontalAction, IconBookCollection, IconBook, IconArrowLeft, IconArrowRight, IconDelete } from "../../icons";
import useBooks from "../../hooks/useBooks";
import COLORS from "../../utils/colors";
import ROUTES from "../../utils/routePaths";
import PLACEHOLDERS from "../../utils/placeholders";
import INPUT_LIMITS from "../../utils/inputLimits";
import useMenu from "../../hooks/useMenu";
import MenuIcon from "../menus/menuIcon";

function NoteBook() {
    const navigate = useNavigate();
    const { id } = useParams()

    const { books, setBooks, OpenBook, OpenPage, AddPage, updateBook, RemoveBook } : any = useBooks();
    const { OpenMenu, menuDetails } : any = useMenu();

    const [title, setTitle] = useState("");
    const [descrtiption, setDescrtiption] = useState("");
    const [color, setColor] = useState<any>({ 
        id: "white", 
        name: "White",
        backgroundColor: "#e6e8eb",
        textColor: "#000000" 
    });

    const [details, setDetails] =  useState({
        loading: true,
        bookId: "",
        bookIndex: 0,
    });


    useEffect(() => {
        var indexOfBook = books.map(b => b.bookId).indexOf(id);

        if(id === undefined || indexOfBook === -1){
            navigate(ROUTES.Home);
        }
        else{
            setTitle(books[indexOfBook].title);
            setDescrtiption(books[indexOfBook].description);
            
            var colors = COLORS.find(c => c.id == books[indexOfBook].color);
            if(colors != undefined){
                setColor(colors);
            }

            setDetails({
                loading: false,
                bookId: id,
                bookIndex: indexOfBook,
            })
        }
    }, [id, books]);

    async function updateTitleOnServer(newTitle) {
        const result = await updateBook(details.bookId, newTitle, books[details.bookIndex].description, books[details.bookIndex].color);

        if(result){
            setTitle(newTitle);
        }
    };

    async function updateDescriptionOnServer(newDescrtiption) {
        const result = await updateBook(details.bookId, books[details.bookIndex].title, newDescrtiption, books[details.bookIndex].color);
        if(result){
            setDescrtiption(newDescrtiption);
        }
    };

    const timer : any = useRef(null)

    function onTitleChange(e) {
        if(e.target.innerHTML == "<br>") {
            e.target.innerHTML = "";
        }

        const updatedBooks = [...books];
        updatedBooks[details.bookIndex].title = e.target.innerHTML;
        setBooks(updatedBooks);

        clearTimeout(timer.current);
        if(title != e.target.innerHTML) {
            timer.current = setTimeout(() => {
                updateTitleOnServer(e.target.innerHTML);
            }, 1200);
        }
    }

    function onDescriptionChange(e) {
        if(e.target.innerHTML == "<br>") {
            e.target.innerHTML = "";
        }

        const updatedBooks = [...books];
        updatedBooks[details.bookIndex].description = e.target.innerHTML;

        setBooks(updatedBooks);

        clearTimeout(timer.current);
        if(descrtiption != e.target.innerHTML) {
            timer.current = setTimeout(() => {
                updateDescriptionOnServer(e.target.innerHTML);
            }, 1200);
        }
    }

    function onTitleBlur(e) {
        var currentText = e.target.innerHTML;
        if (title !== currentText) {
            clearTimeout(timer.current);
            updateTitleOnServer(currentText)
        }
    }

    function onDescriptionBlur(e) {
        var currentText = e.target.innerHTML;
        if (descrtiption !== currentText) {
            clearTimeout(timer.current);
            updateDescriptionOnServer(currentText)
        }
    }

    function onHandleClick(e) {
        if(!menuDetails.isOpen) {
            const react = e.target.getBoundingClientRect();
            let {x, y} = { x: react.left - 135, y: 0 };

            if (react.top < 80){
                y = 80;
            } else if (react.top + 258 > window.innerHeight) {
                y = window.innerHeight - 268;
            } else {
                y = react.top - 11;
            }

            openActionMenu({x, y});
        }
    }

    const actionMenu = [
        {
            id: "deleteBook",
            action: () => RemoveBook(books[details.bookIndex]),
            label: "Delete book",
            icon: <MenuIcon><IconDelete width={20} height={20}/></MenuIcon>
        }
    ];

    function openActionMenu(position){
        const menu = [
            {
                title: "Book colors", 
                menuItems: COLORS.map(b => ({id: b.id, action: () => changeColor(b.id), label: b.name, icon: <div className="h-4 w-4 mr-2 border border-solid" style={{ backgroundColor: b.backgroundColor, borderColor: b.textColor}}></div> }))
            }, {
                title: "Actions",
                menuItems: actionMenu
            }
        ];
        
        OpenMenu(id, menu, position)
    }

    async function changeColor(color) {
        const result = await updateBook(details.bookId, books[details.bookIndex].title, books[details.bookIndex].description, color);
        if(result){
            const updatedBooks = [...books];
            updatedBooks[details.bookIndex].color = color;
            setBooks(updatedBooks);

            setColor(COLORS.find(c => c.id == color))
        }
    }

    function NextBook() {
        var indexOfBook = books.map(b => b.bookId).indexOf(id);
        var bookLenght = books.length;

        var openBook = indexOfBook + 1;
        if(openBook === bookLenght) {
            openBook = 0;
        }

        if(indexOfBook !== openBook) {
            OpenBook(books[openBook].bookId)
        }
    };

    function PreviousBook() {
        var indexOfBook = books.map(b => b.bookId).indexOf(id);
        var bookLenght = books.length;

        var openBook = indexOfBook - 1;
        if(openBook === -1){
            openBook = bookLenght - 1;
        }

        if(indexOfBook !== openBook) {
            OpenBook(books[openBook].bookId)
        }
    };

    return (
        <>
        {!details.loading &&
            <div className="my-8 relative max-w-4xl w-full bg-white shadow group/page">
                <div style={{ backgroundColor: color.backgroundColor, color: color.textColor}} className="h-5 p-2 flex items-center justify-between">
                    <div className="flex">
                        <Link to={ROUTES.AllBooks} style={{ color: color.textColor}} className="flex mr-1 p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconBookCollection></IconBookCollection></Link>
                        <div onClick={PreviousBook} className="flex hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconArrowLeft/></div>
                        <div onClick={NextBook} className="flex hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconArrowRight/></div>
                    </div>
                    <div className="flex items-end select-none mr-10">
                        <div className="flex"><IconBook/></div>
                        <span>Book</span>
                        <span className="text-xs ml-1">{details.bookIndex + 1} of {books.length}</span>
                    </div>
                    <div onClick={onHandleClick} className="flex p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconHorizontalAction/></div>
                </div>
                <div className="px-3">
                    <div className="flex justify-center">
                        <EditableBlock
                            content={title}
                            className="text-center min-w-[18rem] mb-0"
                            placeholder={PLACEHOLDERS.bookInput}
                            pageId={details.bookId}
                            onChange={onTitleChange}
                            onBlur={onTitleBlur}
                            maxChar={INPUT_LIMITS.BookTitle}
                        />
                    </div>
                    
                    <EditableBlock
                        content={descrtiption}
                        className="font-normal text-lg mx-5"
                        placeholder={PLACEHOLDERS.bookDescriptionInput}
                        pageId={details.bookId}
                        onChange={onDescriptionChange}
                        onBlur={onDescriptionBlur}
                        maxChar={INPUT_LIMITS.BookDescription}
                    />
                    <h2 className="text-center text-neutral-800 select-none">Content</h2>
                    <div className="flex flex-col text-left">
                        {books[details.bookIndex] != undefined && books[details.bookIndex].pages.length !== 0 ?
                            <div className="flex flex-col">
                                {books[details.bookIndex].pages.map((Page: { pageId: string; title: string; }, index) => {
                                    return (
                                        <button key={Page.pageId} onClick={() => OpenPage(Page.pageId)}  className="border-0 pb-0 group flex justify-between bg-transparent border-solid border-b border-gray-300 hover:bg-zinc-100 hover:cursor-pointer">
                                            <span className="px-2 pt-2 text-left w-11/12 text-base break-all text-neutral-600 group-hover:underline" dangerouslySetInnerHTML={{__html: Page.title.replaceAll("<br>", " ") || PLACEHOLDERS.book}}></span>
                                            <span className="text-base flex items-center">{index + 1}</span>
                                        </button>
                                    );
                                })}

                            </div>
                            :
                            <h3 className="text-neutral-400 mt-0 mb-2 text-center text-sm font-normal select-none">No pages have been added.</h3>
                        }
                        <button onClick={() => AddPage(details.bookId)} className={`w-full py-1 items-center tracking-wide bg-transparent border-none text-sm text-neutral-400 opacity-0 hover:cursor-pointer hover:bg-neutral-100 hover:text-neutral-500 group-hover/page:opacity-100`}>
                            Add a page
                        </button>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default NoteBook;