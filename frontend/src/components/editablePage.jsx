import { useState, useEffect, useRef} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {Navigate, useOutletContext, useNavigate } from 'react-router-dom';

import EditableBlock from "./editableBlock";
import RenameBlock from "./renameBlock";
import objectId from "../utils/objectId";
import { setCaretToEnd } from "../utils/caretControl";
import configData from '../config.json';

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const EditablePage = ({ id, fetchedBlocks, err }) => {
    const navigate = useNavigate();
    const [pages, setPages] = useOutletContext();

    const [title, setTitle] = useState(pages[pages.map((p) => p.pageId).indexOf(id)].title);
    const [blocks, setBlocks] = useState(fetchedBlocks);
    const prevBlocks = usePrevious(blocks);
    const [currentBlockId, setCurrentBlockId] = useState(null);

    // Handling the cursor and focus on adding and deleting blocks
    useEffect(() => {
        // If a new block was added, move the caret to it
        if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
            const nextBlockPosition = blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
            const nextBlock = document.querySelector(`[data-position="${nextBlockPosition}"]`);
        if (nextBlock) {
            nextBlock.focus();
        }
        }
        // If a block was deleted, move the caret to the end of the last block
        if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
            const lastBlockPosition = prevBlocks.map((b) => b._id).indexOf(currentBlockId);
            const lastBlock = document.querySelector(`[data-position="${lastBlockPosition}"]`);
            if (lastBlock) {
                setCaretToEnd(lastBlock);
            }
        }
    }, [blocks, prevBlocks, currentBlockId]);

    
    useEffect(() => {
        console.log("Id changed");
        const pageIndex = pages.map((p) => p.pageId).indexOf(id);
        if (pageIndex === -1) {
            return <Navigate to="/"/>;
        }
        setTitle(pages[pageIndex].title);
    }, [id]);


    // Update the database whenever blocks change
    useEffect(() => {
        const updatePageOnServer = async (blocks) => {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${id}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        blocks: blocks,
                    }),
                });
            } catch (err) {
                console.log(err);
            }
        };
        if (prevBlocks && prevBlocks !== blocks) {
            updatePageOnServer(blocks);
        }
    }, [blocks, prevBlocks]);

    if (err) {
        return (
            <div status="ERROR">
                <h3>Something went wrong!</h3>
                <p>Have you tried to restart the app at '/' ?</p>
            </div>
        );
    }

    const updateTitleOnServer = async () => {
        try {
            const pageIndex = pages.map((p) => p.pageId).indexOf(id);
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/Note/UpdatePage', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({pageId: id, title: pages[pageIndex].title})
            }).then(response => {
                if (response.ok) {
                    console.log("Page updated");
                    return true;
                } else if (response.status === 401) {
                    localStorage.removeItem('token');
                    console.log("Unauthorized");
                    navigate('/login');
                }
            });
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const deleteImageOnServer = async (imageUrl) => {
        // The imageUrl contains images/name.jpg, hence we do not need
        // to explicitly add the /images endpoint in the API url
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/pages/${imageUrl}`,
                {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                }
            );
            await response.json();
        } catch (err) {
            console.log(err);
        }
    };

    const updateBlockHandler = (currentBlock) => {
        const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
        const oldBlock = blocks[index];
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = {
            ...updatedBlocks[index],
            tag: currentBlock.tag,
            html: currentBlock.html,
            imageUrl: currentBlock.imageUrl,
        };
        setBlocks(updatedBlocks);
        // If the image has been changed, we have to delete the
        // old image file on the server
        if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
            deleteImageOnServer(oldBlock.imageUrl);
        }
    };

    const addBlockHandler = (currentBlock) => {
        setCurrentBlockId(currentBlock.id);
        const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
        const updatedBlocks = [...blocks];
        const newBlock = { _id: objectId(), tag: "p", html: "", imageUrl: "" };
        updatedBlocks.splice(index + 1, 0, newBlock);
        updatedBlocks[index] = {
            ...updatedBlocks[index],
            tag: currentBlock.tag,
            html: currentBlock.html,
            imageUrl: currentBlock.imageUrl,
        };
        setBlocks(updatedBlocks);
        console.log(blocks);
    };

    const deleteBlockHandler = (currentBlock) => {
        if (blocks.length > 1) {
            setCurrentBlockId(currentBlock.id);
            const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
            const deletedBlock = blocks[index];
            const updatedBlocks = [...blocks];
            updatedBlocks.splice(index, 1);
            setBlocks(updatedBlocks);
            // If the deleted block was an image block, we have to delete
            // the image file on the server
            if (deletedBlock.tag === "img" && deletedBlock.imageUrl) {
                deleteImageOnServer(deletedBlock.imageUrl);
            }
        }
    };

    const onDragEndHandler = (result) => {
        const { destination, source } = result;

        // If we don't have a destination (due to dropping outside the droppable)
        // or the destination hasn't changed, we change nothing
        if (!destination || destination.index === source.index) {
            return;
        }

        const updatedBlocks = [...blocks];
        const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
        updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
        setBlocks(updatedBlocks);
    };
    // if (pageIndex === -1 || !localStorage.getItem('token')) {
    //     return <Navigate to="/"/>;
    // } else {
    
    return (
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <>
            <RenameBlock 
                html={title}
                pageId={id}
                addBlock={addBlockHandler}
                updateTitle={updateTitleOnServer}
                pages={pages}
                setPages={setPages}
            />
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId={id}>
                    {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {blocks.map((block) => {
                        const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
                        console.log(position);
                        return (
                            <EditableBlock
                            key={block._id}
                            position={position}
                            id={block._id}
                            tag={block.tag}
                            html={block.html}
                            imageUrl={block.imageUrl}
                            pageId={id}
                            addBlock={addBlockHandler}
                            deleteBlock={deleteBlockHandler}
                            updateBlock={updateBlockHandler}/>
                        );
                        })}
                        {provided.placeholder}
                    </div>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default EditablePage;