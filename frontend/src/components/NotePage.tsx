import { useState, useEffect} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useOutletContext, useNavigate } from 'react-router-dom';

import ContentBlock from "./contentBlock";
import TitleBlock from "./titleBlock";
import objectId from "../utils/objectId";
import { setCaretToEnd } from "../utils/caretControl";
import useAuth from '../hooks/useAuth';
import api from '../utils/api';

function NotePage({ pageId, blocks, setBlocks }: any) {
    const navigate = useNavigate();
    const { LogOut } : any = useAuth()
    const [pages, setPages]: any = useOutletContext();
    const [startingTitle, setStartingTitle] = useState(pages[pages.map((p) => p.pageId).indexOf(pageId)].title);
    const [title, setTitle] = useState(pages[pages.map((p) => p.pageId).indexOf(pageId)].title);

    const [selectIndex, setSelectedIndex] = useState(-1);

    // Handling the cursor and focus
    useEffect(() => {
        const block: HTMLElement | null = document.querySelector(`[data-position="${selectIndex}"]`);
        if (block) {
            setCaretToEnd(block);
        }
    }, [blocks.length]);

    // Handling title updates
    useEffect(() => {
        const pageIndex = pages.map((p) => p.pageId).indexOf(pageId);
        if (pageIndex === -1) {
            navigate('/');
        }
        setStartingTitle(pages[pageIndex].title);
        setTitle(pages[pageIndex].title);
        setSelectedIndex(-1);
    }, [pageId]);

    async function updateTitleOnServer(title) {
        api.put("/api/Note/UpdateTitle", JSON.stringify({pageId: pageId, title: title})).then(response => {
            if (response?.ok) {
                console.log("Page updated");
                setTitle(title);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    };

    async function addBlockOnServer(block, position) {
        api.post("/api/Note/AddBlock", JSON.stringify({blockId: block.blockId, type: block.type, properties: JSON.stringify(block.properties), position: position, pageId: pageId })).then(response => {
            if (response?.ok) {
                console.log("New block added to server");
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    };

    async function updateBlockOnServer(block, position) {
        api.put("/api/Note/UpdateBlock", JSON.stringify({blockId: block.blockId, type: block.type, properties: JSON.stringify(block.properties), position: position, pageId: pageId })).then(response => {
            if (response?.ok) {
                console.log("Block updated");
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    };

    async function deleteBlockServer(blockId) {
        api.delete(`/api/Note/RemoveBlock/${blockId}`).then(response => {
            if (response?.ok) {
                console.log("Block removed from server");
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

    return (
        pages.length === 0 ? <div></div> :
        <>
            <TitleBlock 
                startingTitle={startingTitle}
                title={title}
                pageId={pageId}
                addBlock={addBlockToStartHandler}
                updateTitle={updateTitleOnServer}
                pages={pages}
                setPages={setPages}
            />
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId={pageId}>
                    {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {blocks.map((block) => {
                            return (
                                <ContentBlock
                                    key={block.blockId}
                                    blockId={block.blockId}
                                    pageId={pageId}
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
            <button className="w-full h-[22px] bg-neutral-100 border-none rounded text-base/4 text-neutral-400 opacity-0 hover:cursor-pointer hover:opacity-100" onClick={addBlockToEndHandler}><i className="fa fa-plus"></i></button>
        </>
    );
};

export default NotePage;