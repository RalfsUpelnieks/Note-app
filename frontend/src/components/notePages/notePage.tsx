import { useState, useEffect, useRef} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useNavigate, useParams, Link } from 'react-router-dom';

import NoteBlock from "./noteBlock";
import TitleBlock from "../titleBlock";
import objectId from "../../utils/objectId";
import { setCaretToEnd } from "../../utils/caretControl";
import useAuth from '../../hooks/useAuth';
import api from '../../utils/api';
import useBooks from "../../hooks/useBooks";
import { IconHorizontalAction, IconBookCollection, IconBook, IconPage, IconArrowLeft, IconArrowRight } from "../../icons";
import COLORS from "../../utils/colors";
import { GetTimeISO } from "../../utils/timeConverter";

function NotePage() {
    const navigate = useNavigate();
    const { LogOut } : any = useAuth()
    const { id } = useParams()

    const { books, setBooks, updatePage } : any = useBooks();
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
            navigate("/Book/view");
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
                    navigate("/");
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
            navigate("/Book/view");
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


        //update current block will be useful when moving text from one to another
        // updatedBlocks[index] = {
        //     ...updatedBlocks[index],
        //     type: type,
        //     properties: properties
        // };

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

    return (
        <>
            {!details.loading &&
            <div className="my-8 relative max-w-4xl w-full bg-white shadow group/page">
                <div style={{ backgroundColor: color.backgroundColor, color: color.textColor}} className="h-5 p-2 flex items-center justify-between">
                    <div className="flex">
                        <Link to="/Book/view" style={{ color: color.textColor}} className="flex mr-1 p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconBookCollection></IconBookCollection></Link>
                        <Link to={`/book/${details.bookId}`} style={{ color: color.textColor}} className="flex mr-1 p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconBook></IconBook></Link>
                        <div className="flex"><IconArrowLeft></IconArrowLeft></div>
                        <div className="flex"><IconArrowRight></IconArrowRight></div>
                    </div>
                    <div className="flex items-end mr-20">
                        <div className="flex"><IconPage></IconPage></div>
                        <span>Note</span>
                        <span className="text-xs ml-1">{details.pageIndex + 1} of {books[details.bookIndex].pages.length}</span>
                    </div>
                    <div className="flex">
                        <div className="flex p-[0.1rem] hover:bg-opacity-10 hover:bg-black hover:cursor-pointer rounded"><IconHorizontalAction></IconHorizontalAction></div>
                    </div>
                </div>
                <div className="px-3">
                    <TitleBlock
                        content={title}
                        placeholder="Page title"
                        className="mb-1 mt-3 mx-6"
                        pageId={details.pageId}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
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