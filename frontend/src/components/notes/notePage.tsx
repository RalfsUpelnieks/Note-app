import { useState, useEffect, useRef} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useNavigate, useParams, Link } from 'react-router-dom';

import NoteBlock from "./noteBlock";
import EditableBlock from "./editableBlock";
import objectId from "../../utils/objectId";
import { setCaretToEnd } from "../../utils/caretControl";
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useBooks from "../../hooks/useBooks";
import { IconHorizontalAction, IconBookCollection, IconBook, IconPage, IconArrowLeft, IconArrowRight, IconDelete } from "../../icons";
import COLORS from "../../utils/colors";
import { GetTimeISO } from "../../utils/timeConverter";
import ROUTES from "../../utils/routePaths";
import INPUT_LIMITS from "../../utils/inputLimits";
import useMenu from "../../hooks/useMenu";
import MenuIcon from "../menus/menuIcon";

function NotePage() {
    const navigate = useNavigate();
    const { LogOut } : any = useAuth()
    const { id } = useParams()

    const { books, setBooks, updateBook, RemoveBook, OpenPage, updatePage, RemovePage } : any = useBooks();
    const { OpenMenu, menuDetails } : any = useMenu();

    const [title, setTitle] = useState("");
    const [color, setColor] = useState<any>();
    const [details, setDetails] =  useState({
        loading: true,
        pageId: "",
        bookIndex: 0,
        bookId: "",
        pageIndex: 0
    });

    const [blocks, setBlocks] = useState<any>([]);
    const [selectIndex, setSelectedIndex] = useState(-1);

    const timer : any = useRef(null)

    useEffect(() => {
        var bookIndex;
        var bookId;
        var pageIndex;

        if(id !== undefined){
            for (let i = 0; i < books.length; i++) {
                const book = books[i];
                const page = book.pages.find(p => p.pageId === id);
                if (page) {
                    bookIndex = i;
                    bookId = book.bookId;
                    pageIndex = book.pages.indexOf(page)
                    break;
                }
            }
        }

        if(bookId === undefined){
            navigate(ROUTES.AllBooks);
        }
        else {
            api.get(`/api/Note/GetPageData/${id}`).then(response => {
                if (response?.ok) {
                    response.json().then(data => { 
                        console.log("Get block data from server");

                        data.forEach(element => element.properties = JSON.parse(element.properties));
                        setBlocks(data);

                        setTitle(books[bookIndex].pages[pageIndex].title)
                        setColor(COLORS.find(c => c.id == books[bookIndex].color));

                        setDetails({
                            loading: false,
                            pageId: id!,
                            bookIndex: bookIndex,
                            bookId: bookId,
                            pageIndex: pageIndex
                        })

                        setSelectedIndex(-1);
                    });
                } else if (response?.status === 401) {
                    LogOut();
                } else {
                    navigate(ROUTES.Home);
                }
            })
        }
    }, [id]);

    useEffect(() => {
        var bookIndex;
        var bookId;
        var pageIndex;

        if(id !== undefined){
            for (let i = 0; i < books.length; i++) {
                const book = books[i];
                const page = book.pages.find(p => p.pageId === id);
                if (page) {
                    bookIndex = i;
                    bookId = book.bookId;
                    pageIndex = book.pages.indexOf(page)
                    break;
                }
            }
        }

        if(bookId === undefined){
            navigate(ROUTES.AllBooks);
        }
        else {
            setColor(COLORS.find(c => c.id == books[bookIndex].color));

            setDetails({
                ...details,
                bookIndex: bookIndex,
                bookId: bookId,
                pageIndex: pageIndex
            })
        }
    }, [books]);

    // Handling the cursor and focus
    useEffect(() => {
        const block: HTMLElement | null = document.querySelector(`[data-position="${selectIndex}"]`);
        if (block) {
            setCaretToEnd(block);
        }
    }, [blocks.length]);

    async function updateTitleOnServer(newTitle) {
        const result = await updatePage(details.pageId, details.bookId, newTitle);

        if(result) {
            setTitle(newTitle);
        }
    };

    async function addBlockOnServer(block, position) {
        api.post("/api/Note/AddBlock", JSON.stringify({blockId: block.blockId, type: block.type, properties: JSON.stringify(block.properties), position: position, pageId: details.pageId })).then(response => {
            if (response?.ok) {
                console.log("New block added to server");

                const updatedBooks = [...books];
                updatedBooks[details.bookIndex].lastUpdatedAt = GetTimeISO();
                updatedBooks[details.bookIndex].pages[details.pageIndex].lastUpdatedAt = GetTimeISO();
                setBooks(updatedBooks);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    };

    async function updateBlockOnServer(block, position) {
        api.put("/api/Note/UpdateBlock", JSON.stringify({blockId: block.blockId, type: block.type, properties: JSON.stringify(block.properties), position: position, pageId: details.pageId })).then(response => {
            if (response?.ok) {
                console.log("Block updated");

                const updatedBooks = [...books];
                updatedBooks[details.bookIndex].lastUpdatedAt = GetTimeISO();
                updatedBooks[details.bookIndex].pages[details.pageIndex].lastUpdatedAt = GetTimeISO();
                setBooks(updatedBooks);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    };

    async function deleteBlockServer(blockId) {
        api.delete(`/api/Note/RemoveBlock/${blockId}`).then(response => {
            if (response?.ok) {
                console.log("Block removed from server");

                const updatedBooks = [...books];
                updatedBooks[details.bookIndex].lastUpdatedAt = GetTimeISO();
                updatedBooks[details.bookIndex].pages[details.pageIndex].lastUpdatedAt = GetTimeISO();
                setBooks(updatedBooks);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    };

    function NextPage() {
        var indexOfPage = details.pageIndex;
        var pageLenght = books[details.bookIndex].pages.length;
        

        var openPage = indexOfPage + 1;
        if(openPage === pageLenght) {
            openPage = 0;
        }

        if(indexOfPage !== openPage) {
            OpenPage(books[details.bookIndex].pages[openPage].pageId)
        }
    };

    function PreviousPage() {
        var indexOfPage = details.pageIndex;
        var pageLenght = books[details.bookIndex].pages.length;

        var openPage = indexOfPage - 1;
        if(openPage === -1){
            openPage = pageLenght - 1;
        }

        if(indexOfPage !== openPage) {
            OpenPage(books[details.bookIndex].pages[openPage].pageId)
        }
    };

    function updateBlockHandler(blockId, properties, type) {
        const index = blocks.map((b) => b.blockId).indexOf(blockId);
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = {
            ...updatedBlocks[index],
            type: type,
            properties: properties
        };
        updateBlockOnServer(updatedBlocks[index], index + 1);
        setBlocks(updatedBlocks);
    };

    function addBlockHandler(blockId, properties, type) {
        const index = blocks.map((b) => b.blockId).indexOf(blockId);
        const updatedBlocks = [...blocks];
        const newBlock = { blockId: objectId(), type: "p", properties: {"text": ""}};
        addBlockOnServer(newBlock, index + 2);
        updatedBlocks.splice(index + 1, 0, newBlock);

        setBlocks(updatedBlocks);
        setSelectedIndex(index + 2);
    };

    function addBlockToStartHandler() {
        const newBlock = { blockId: objectId(), type: "p", properties: {"text": ""} };
        setBlocks([newBlock, ...blocks]);
        addBlockOnServer(newBlock, 1);
        setSelectedIndex(1)
    };

    function addBlockToEndHandler() {
        const newBlock = { blockId: objectId(), type: "p", properties: {"text": ""} };
        addBlockOnServer(newBlock, blocks.length + 1);
        setBlocks([...blocks, newBlock]);
        setSelectedIndex(blocks.length + 1);
    };

    function deleteBlockHandler(blockId) {
        const index = blocks.map((b) => b.blockId).indexOf(blockId);
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index, 1);
        deleteBlockServer(blockId);
        setBlocks(updatedBlocks);
        setSelectedIndex(index);
    };

    function onDragEndHandler(result) {
        const { destination, source } = result;

        // If we don't have a destination (due to dropping outside the droppable)
        // or the destination hasn't changed, we change nothing
        if (!destination || destination.index === source.index) {
            return;
        }

        updateBlockOnServer(blocks[source.index - 1], destination.index);

        const updatedBlocks = [...blocks];
        const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
        updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
        setBlocks(updatedBlocks);
    };

    function onChange(e) {
        if(e.target.innerHTML == "<br>") {
            e.target.innerHTML = "";
        }

        const updatedBooks = [...books];
        updatedBooks[details.bookIndex].pages[details.pageIndex].title = e.target.innerHTML;

        setBooks(updatedBooks);

        clearTimeout(timer.current);
        if(title != e.target.innerHTML) {
            timer.current = setTimeout(() => {
                updateTitleOnServer(e.target.innerHTML);
            }, 1200);
        }
    }

    function onBlur(e) {
        var currentText = e.target.innerHTML;
        if (title !== currentText) {
            clearTimeout(timer.current);
            updateTitleOnServer(currentText)
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            addBlockToStartHandler();
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
            id: "deletePage",
            action: () => RemovePage(books[details.bookIndex].pages[details.pageIndex], details.bookId),
            label: "Delete page",
            icon: <MenuIcon><IconDelete width={20} height={20}/></MenuIcon>
        },
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

    return (
        <>
            {!details.loading &&
            <div className="my-8 relative max-w-4xl w-full bg-white shadow group/page">
                <div style={{ backgroundColor: color.backgroundColor, color: color.textColor}} className="h-5 p-2 flex items-center justify-between">
                    <div className="flex">
                        <Link to={ROUTES.AllBooks} style={{ color: color.textColor}} className="flex mr-1 p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconBookCollection></IconBookCollection></Link>
                        <Link to={`${ROUTES.Book}/${details.bookId}`} style={{ color: color.textColor}} className="flex mr-1 p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconBook></IconBook></Link>
                        <div onClick={PreviousPage} className="flex hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconArrowLeft/></div>
                        <div onClick={NextPage} className="flex hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconArrowRight/></div>
                    </div>
                    <div className="flex items-end mr-20">
                        <div className="flex"><IconPage/></div>
                        <span>Note</span>
                        <span className="text-xs ml-1">{details.pageIndex + 1} of {books[details.bookIndex].pages.length}</span>
                    </div>
                    
                    <div className="flex">
                        <div onClick={onHandleClick} className="flex p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconHorizontalAction/></div>
                    </div>
                </div>
                <div className="px-3">
                    <EditableBlock
                        content={title}
                        placeholder="Page title"
                        className="mb-1 mt-3 mx-6"
                        pageId={details.pageId}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        maxChar={INPUT_LIMITS.PageTitle}
                    />
                    <DragDropContext onDragEnd={onDragEndHandler}>
                        <Droppable droppableId={id!}>
                            {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {blocks.map((block) => {
                                    return (
                                        <NoteBlock
                                            key={block.blockId}
                                            blockId={block.blockId}
                                            pageId={details.pageId}
                                            position={blocks.map((b) => b.blockId).indexOf(block.blockId) + 1}
                                            type={block.type}
                                            properties={block.properties}
                                            isDraggingOver={snapshot.isDraggingOver}
                                            addBlock={addBlockHandler}
                                            deleteBlock={deleteBlockHandler}
                                            updateBlock={updateBlockHandler}
                                        />
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <button onClick={addBlockToEndHandler} className="w-full py-1 tracking-wide items-center bg-transparent border-none text-sm opacity-0 text-neutral-400 hover:cursor-pointer hover:bg-neutral-100 hover:text-neutral-500 group-hover/page:opacity-100">
                        Add a block
                    </button>
                </div>
            </div>
            }
        </>
    );
};

export default NotePage;