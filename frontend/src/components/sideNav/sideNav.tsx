import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, DragOverlay, MeasuringStrategy, closestCenter, CollisionDetection, pointerWithin, rectIntersection, getFirstCollision } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSensor, useSensors, PointerSensor, UniqueIdentifier } from '@dnd-kit/core';
import useBooks from '../../hooks/useBooks';
import { book, DroppableBook, BookContainer  } from './book';
import { IconAdd } from '../../icons';
import { Item, SortableItem } from './page';
import COLORS from '../../utils/colors';

function SideNav() {
    const { id } = useParams()
    const { books, setBooks, OpenViewBooks, ChangeOpen, OpenBook, OpenPage, AddBook, AddPage, updateBook, updatePage, RemoveBook, RemovePage } : any = useBooks();

    const [clonedBooks, setClonedBooks] = useState<any>(null);
    const [activeDetails, setActiveDetails] = useState<any>({
        active: false,
        Id: "",
        startingContainerId: "",
        startingPosition: -1
    });

    const recentlyMovedToNewContainer = useRef(false);
    const lastOverId = useRef<UniqueIdentifier | null>(null);

    const BOOK_CONTEXT_NAME = "Books"

    async function updateBookPositionServer(currentIndex, newIndex) {
        return updateBook(books[currentIndex].bookId, books[currentIndex].title, books[currentIndex].description, books[currentIndex].color, newIndex + 1);
    };

    async function updatePagePositionServer(bookId, pageId, title, position) {
        return updatePage(pageId, bookId, title, position);
    };

    function isDraggingBook() {
        return activeDetails.active && activeDetails.startingContainerId == BOOK_CONTEXT_NAME
    }

    function findBook(id: UniqueIdentifier) {
        return books.find(b => b.bookId == id);
    }

    function findPageBookIndex(id: UniqueIdentifier){
        return books.findIndex(b => b.bookId == id || b.pages.map(p => p.pageId).includes(id));
    }

    function movePagePosition(bookIndex, pageIndex, pageNewIndex){
        if(!books[bookIndex]){
            return
        }

        const pageCount = books[bookIndex].pages.length;
        
        if (pageIndex !== pageNewIndex && pageIndex >= 0 && pageNewIndex >= 0 && pageIndex < pageCount && pageNewIndex < pageCount) {
            const updatedBooks = [...books];
            updatedBooks[bookIndex].pages = arrayMove(updatedBooks[bookIndex].pages, pageIndex, pageNewIndex);
            setBooks(updatedBooks);
        }
    }
        /**
     * Custom collision detection strategy optimized for multiple containers
     *
     * - First, find any droppable containers intersecting with the pointer.
     * - If there are none, find intersecting containers with the active draggable.
     * - If there are no intersecting containers, return the last matched intersection
     *
     */
    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args) => {
            if (isDraggingBook()) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter((container) => books.map(b => b.bookId).includes(container.id)),
                });
            }

        // Start by finding any intersecting droppable
        const pointerIntersections = pointerWithin(args);
        const intersections = pointerIntersections.length > 0
            ? // If there are droppables intersecting with the pointer, return those
                pointerIntersections
            : rectIntersection(args);
        let overId = getFirstCollision(intersections, "id") as any;
        
        if (overId != null) {
            var overBook = findBook(overId!);

            if (overBook != undefined) {
                const containerItems = overBook.pages;

                // If a container is matched and it contains items (columns 'A', 'B', 'C')
                if (containerItems.length > 0) {
                    // Return the closest droppable within that container
                    var closesOverId = closestCenter({ ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) =>
                        container.id !== overId &&
                        containerItems.some(p => p.pageId == container.id)
                    ), })[0]?.id;

                    if(closesOverId !== undefined) {
                        overId = closesOverId;
                    }
                }
            }

            lastOverId.current = overId;

            return [{ id: overId }];
        }

        // When a draggable item moves to a new container, the layout may shift
        // and the `overId` may become `null`. We manually set the cached `lastOverId`
        // to the id of the draggable item that was moved to the new container, otherwise
        // the previous `overId` will be returned which can cause items to incorrectly shift positions
        if (recentlyMovedToNewContainer.current) {
            lastOverId.current = activeDetails.Id;
        }

        // If no droppable is matched, return the last match
        return lastOverId.current ? [{ id: lastOverId.current }] : [];
    }, [activeDetails, books]);

    useEffect(() => {
        requestAnimationFrame(() => {
          recentlyMovedToNewContainer.current = false;
        });
      }, [books]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            }
        })
    );

    function handleDragStart({ active }) {
        setActiveDetails({
            active: true,
            Id: active.id,
            startingContainerId: active.data.current.sortable.containerId,
            startingIndex: findPageBookIndex(active.id)
        })

        setClonedBooks(structuredClone(books));
    }

    function onDragOver({ active, over }) {
        const overId = over?.id as string
        const activeId = active?.id;

        // If starting container is books, the item that is draged is a book and it doesn't need to be moved to a different sortable
        if (overId == null || isDraggingBook()) {
          return;
        }

        const activeBookIndex = findPageBookIndex(activeId);
        var overBookIndex = findPageBookIndex(overId);
        if (overBookIndex == -1 || activeBookIndex == -1) {
          return;
        }

        if (overBookIndex !== activeBookIndex) {
            const activePages = books[activeBookIndex].pages;
            const overPages = books[overBookIndex].pages;
            const overPageIndex = overPages.findIndex(p => p.pageId == overId);
            const activePageIndex = activePages.findIndex(p => p.pageId == activeId);

            let newIndex: number;

            if (findBook(overId)) {
              newIndex = 0;
            } else {
                const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;

                newIndex = overPageIndex >= 0 ? overPageIndex + modifier : overPages.length + 1;
            }

            recentlyMovedToNewContainer.current = true;

            const updatedBooks = [...books];
            updatedBooks[overBookIndex].pages = [
                ...updatedBooks[overBookIndex].pages.slice(0, newIndex),
                updatedBooks[activeBookIndex].pages[activePageIndex],
                ...updatedBooks[overBookIndex].pages.slice(newIndex, overPages.length),
            ];
            updatedBooks[activeBookIndex].pages = updatedBooks[activeBookIndex].pages.filter(p => p.pageId !== activeId);
            setBooks(updatedBooks);
        }
    }

    function handleDragEnd({ active, over }) {
        const overId = over?.id;
        const activeId = active.id

        if (isDraggingBook() && overId) {
            setBooks((books) => {
                const activeIndex = books.findIndex(b => b.bookId == activeId);
                const overIndex = books.findIndex(b => b.bookId == overId);

                updateBookPositionServer(activeIndex, overIndex)
                return arrayMove(books, activeIndex, overIndex);
            });
            return
        }

        var overBookIndex = findPageBookIndex(overId);

        if (overBookIndex != -1) {
            const overPageIndex =  books[overBookIndex].pages.findIndex(p => p.pageId == overId);
            const activePageIndex = books[overBookIndex].pages.findIndex(p => p.pageId == activeId);

            const book = books[overBookIndex];
            const page = book.pages[activePageIndex];

            if(book.bookId != active.startingContainerId || overPageIndex != active.startingPosition){
                updatePagePositionServer(book.bookId, page.pageId, page.title, overPageIndex + 1)
            }

            movePagePosition(overBookIndex, activePageIndex, overPageIndex)
        }

        setActiveDetails({...activeDetails, active: false});
    }
    
    const onDragCancel = () => {
        if (clonedBooks) {
            // Reset books to their original state in case pages have been dragged across books
            setBooks(clonedBooks);
        }

        setActiveDetails({...activeDetails, active: false });
        setClonedBooks(null);
    };

    function Overlay() {
        if(isDraggingBook()){
            var book = findBook(activeDetails.Id);

            if(book != undefined){
                var colors = COLORS.find(c => c.id == book.color)
    
                return (
                    <BookContainer open={book.open} id={book.bookId} Title={book.title} textColor={colors?.textColor} bgColor={colors?.backgroundColor}>
                    {book.pages.length != 0 &&
                        book.pages.map((page: {title: string, pageId: string}, index) => (
                            <div key={page.pageId} className='ps-4 text-sm' dangerouslySetInnerHTML={{__html: page.title.replaceAll("<br>", " ") || "Untitled page"}}></div>
                        ))
                    }
                    </BookContainer>
                );
            }
        }

        var bookIndex = findPageBookIndex(activeDetails.Id);
        var page = books[bookIndex].pages.find(p => p.pageId == activeDetails.Id);

        if(page){
            return <Item title={page.title} selected={false} dragOverlay />;
        }
    }

    return (
        <nav className='max-w-[15rem] w-full select-none bg-SideMenuBackground border-0 border-r border-solid border-gray-200'>
            <div className='flex flex-col h-full text-neutral-300'>
                <div onClick={OpenViewBooks} className='bg-[#b3b3b32a] border-0 border-b border-solid border-zinc-800 px-1 flex items-center justify-between hover:cursor-pointer hover:bg-[#b3b3b33f]'>
                    <span className='font-sans text-[18px] text-neutral-300 py-1'>Book view</span>
                    <div onClick={(e) => { e.stopPropagation(); AddBook && AddBook()}} className='text-neutral-300 flex hover:bg-zinc-600 rounded'><IconAdd></IconAdd></div>
                </div>
                <div className='contents'>
                    <div className='overflow-y-auto h-full'>
                        {books.length != 0 ? 
                            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={onDragOver} onDragEnd={handleDragEnd} onDragCancel={onDragCancel} measuring={{droppable: { strategy: MeasuringStrategy.Always }}} collisionDetection={collisionDetectionStrategy}>
                                <SortableContext id={BOOK_CONTEXT_NAME} items={books.map(book => book.bookId)} strategy={verticalListSortingStrategy} >
                                    {books.map((Book: book, index) => {
                                        var colors = COLORS.find(c => c.id == Book.color)
                                        const allPageIds = Book.pages.map(pages => pages.pageId);

                                        return (
                                            <div key={Book.bookId}>
                                                <DroppableBook key={Book.bookId} open={Book.open} selected={id === Book.bookId} onClick={() => OpenBook(Book.bookId)} onOpen={() => ChangeOpen(Book.bookId)} onAdd={() => AddPage(Book.bookId)} onRemove={() => RemoveBook(Book)} Title={Book.title} id={Book.bookId} items={allPageIds} bgColor={colors?.backgroundColor} textColor={colors?.textColor}>
                                                { Book.pages.length != 0 &&
                                                    <SortableContext id={Book.bookId} items={allPageIds} strategy={verticalListSortingStrategy} >
                                                        {Book.pages.map((page: {pageId: string, title: string}, index) => {
                                                            return <SortableItem key={page.pageId} selected={id === page.pageId} onClick={() => {OpenPage(page.pageId)}} onRemove={() => RemovePage(page, Book.bookId)} id={page.pageId} index={index} title={page.title} textColor={colors?.textColor}></SortableItem>;
                                                        })}
                                                    </SortableContext>
                                                }
                                                </DroppableBook>
                                            </div>
                                        );
                                    })}
                                </SortableContext>
                                <DragOverlay adjustScale={false} dropAnimation={null}>
                                    {activeDetails.active ? 
                                        Overlay()
                                    : null}
                                </DragOverlay>
                            </DndContext>
                        :
                            <div className='text-center text-sm bg-zinc-600 py-'>No books found</div>
                        }
                    </div> 
                </div>
                <div onClick={AddBook} className='flex items-center mt-auto py-2 text-neutral-300 hover:bg-SideMenuHover hover:cursor-pointer'>
                    <i className="text-center w-10 text-[20px] fa fa-plus"></i>
                    <span className='text-[16px]'>Add a book</span>
                </div>
            </div>
        </nav>
    );
}

export default SideNav;