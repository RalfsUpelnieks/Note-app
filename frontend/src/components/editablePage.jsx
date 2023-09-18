import { useState, useEffect} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {Navigate, useOutletContext, useNavigate } from 'react-router-dom';

import EditableBlock from "./editableBlock";
import RenameBlock from "./renameBlock";
import objectId from "../utils/objectId";
import { setCaretToEnd } from "../utils/caretControl";
import styles from "../stylesheets/Block.module.css";
import configData from '../config.json';

const EditablePage = ({ pageId, blocks, setBlocks, err }) => {
    const navigate = useNavigate();
    const [pages, setPages] = useOutletContext();
    const [title, setTitle] = useState(pages[pages.map((p) => p.pageId).indexOf(pageId)].title);

    const [selectIndex, setSelectedIndex] = useState(-1);

    // Handling the cursor and focus
    useEffect(() => {
        const block = document.querySelector(`[data-position="${selectIndex}"]`);
        if (block) {
            setCaretToEnd(block);
        }
    }, [blocks.length]);

    // Handling title updates
    useEffect(() => {
        const pageIndex = pages.map((p) => p.pageId).indexOf(pageId);
        if (pageIndex === -1) {
            return <Navigate to="/"/>;
        }
        setTitle(pages[pageIndex].title);
        setSelectedIndex(-1);
    }, [pageId]);

    const updateTitleOnServer = async () => {
        try {
            const pageIndex = pages.map((p) => p.pageId).indexOf(pageId);
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/Note/UpdateTitle', {
                method: 'PUT',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({pageId: pageId, title: pages[pageIndex].title})
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

    const addBlockOnServer = async (block, position) => {
        try {
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/Note/AddBlock', {
                method: 'POST',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({blockId: block.blockId, type: block.type, properties: JSON.stringify(block.properties), position: position, pageId: pageId })
            }).then(response => {
                if (response.ok) {
                    console.log("New block added to server");
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

    const updateBlockOnServer = async (block, position) => {
        try {
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/Note/UpdateBlock', {
                method: 'PUT',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({blockId: block.blockId, type: block.type, properties: JSON.stringify(block.properties), position: position, pageId: pageId })
            }).then(response => {
                if (response.ok) {
                    console.log("Block updated");
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

    const deleteBlockServer = async (blockId) => {
        try {
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + `/api/Note/RemoveBlock/${blockId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                if (response.ok) {
                    console.log("Block removed from server");
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

    if (err) {
        return (
            <div status="ERROR">
                <h3>Something went wrong!</h3>
                <p>Have you tried to restart the app at '/' ?</p>
            </div>
        );
    }

    const updateBlockHandler = (currentBlock) => {
        const index = blocks.map((b) => b.blockId).indexOf(currentBlock.id);
        const updatedBlocks = [...blocks];
        updatedBlocks[index] = {
            ...updatedBlocks[index],
            type: currentBlock.type,
            properties: currentBlock.properties
        };
        updateBlockOnServer(updatedBlocks[index], index + 1);
        setBlocks(updatedBlocks);
    };

    const addBlockHandler = (currentBlock) => {
        const index = blocks.map((b) => b.blockId).indexOf(currentBlock.id);
        const updatedBlocks = [...blocks];
        const newBlock = { blockId: objectId(), type: "p", properties: {"text": ""}};
        addBlockOnServer(newBlock, index + 1);
        updatedBlocks.splice(index + 1, 0, newBlock);
        updatedBlocks[index] = {
            ...updatedBlocks[index],
            type: currentBlock.type,
            properties: currentBlock.properties
        };
        setBlocks(updatedBlocks);
        setSelectedIndex(index + 2);
    };

    const addBlockToStartHandler = () => {
        const newBlock = { blockId: objectId(), type: "p", properties: {"text": ""} };
        setBlocks([newBlock, ...blocks]);
        addBlockOnServer(newBlock, 1);
        setSelectedIndex(1)
    };

    const addBlockToEndHandler = () => {
        const newBlock = { blockId: objectId(), type: "p", properties: {"text": ""} };
        addBlockOnServer(newBlock, blocks.length + 1);
        setBlocks([...blocks, newBlock]);
        setSelectedIndex(blocks.length + 1);
    };

    const deleteBlockHandler = (currentBlock) => {
        const index = blocks.map((b) => b.blockId).indexOf(currentBlock.id);
        const updatedBlocks = [...blocks];
        updatedBlocks.splice(index, 1);
        deleteBlockServer(currentBlock.id);
        setBlocks(updatedBlocks);
        setSelectedIndex(index);
    };

    const onDragEndHandler = (result) => {
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
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <>
            <RenameBlock 
                html={title}
                pageId={pageId}
                addBlock={addBlockToStartHandler}
                updateTitle={updateTitleOnServer}
                pages={pages}
                setPages={setPages}
            />
            <DragDropContext onDragEnd={onDragEndHandler}>
                <Droppable droppableId={pageId}>
                    {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {blocks.map((block) => {
                        const position = blocks.map((b) => b.blockId).indexOf(block.blockId) + 1;
                        return (
                            <EditableBlock
                            key={block.blockId}
                            position={position}
                            id={block.blockId}
                            type={block.type}
                            properties={block.properties}
                            pageId={pageId}
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
            <button className={styles.addButton} onClick={addBlockToEndHandler}><i className="fa fa-plus"></i></button>
        </>
    );
};

export default EditablePage;