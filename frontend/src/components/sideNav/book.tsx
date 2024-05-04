import { IconAdd, IconDelete, IconDropDown } from '../../icons';
import { UniqueIdentifier } from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable';
import { forwardRef } from 'react';

export interface book {
    bookId: string;
    title: string;
    color: string;
    pages: {
        pageId: string;
        title: string;
    }[];
    open: boolean;
}

export interface ContainerProps {
    children: React.ReactNode;
    id: string;
    Title: string;
    selected?: boolean;
    style?: React.CSSProperties;
    className?: string;
    handleProps?: React.HTMLAttributes<any>;
    sorting?: boolean;
    open: boolean;
    hover?: boolean;
    onClick?(): void;
    onOpen?(): void;
    onAdd?(): void;
    onRemove?(): void;
    bgColor?: string;
    textColor?: string;
}

export const BookContainer = forwardRef<HTMLDivElement, ContainerProps>(( {Title, id, sorting, children, hover, handleProps, selected, style, open, onClick, onOpen,  onAdd, onRemove, bgColor, textColor, }: ContainerProps, ref ) => {
    return (
        <div ref={ref} style={{...style, backgroundColor: bgColor, borderColor: hover ? '#38bdf8' : selected ? textColor : '#00000071'}}  className='flex flex-col m-2 border border-solid'>
            <div onClick={onClick} {...handleProps} className={`flex items-center group peer px-1 hover:cursor-pointer ${selected ? "bg-[#00000015]" : ""} ${!hover && onOpen && 'hover:bg-[#00000015] peer'}`}>
                <div onClick={(e) => { e.stopPropagation(); onOpen && onOpen();}} style={{color: textColor}} className={`flex text-center transition duration-200 ${onOpen && "hover:bg-[#00000028] rounded"} ${open && "rotate-90"}`}><IconDropDown></IconDropDown></div>
                <span style={{color: textColor}}  className={`w-full text-base py-1 ps-1 overflow-hidden whitespace-nowrap text-ellipsis`} dangerouslySetInnerHTML={{__html: Title.replaceAll("<br>", " ") || "Untitled book"}}></span>
                <div onClick={(e) => { e.stopPropagation(); onAdd && onAdd();}} style={{color: textColor}} className={`opacity-0 flex text-center ${!sorting && "group-hover:opacity-100"} ${onOpen && "hover:bg-[#00000028] rounded"}`}><IconAdd></IconAdd></div>
                <div onClick={(e) => { e.stopPropagation(); onRemove && onRemove();}} style={{color: textColor}} className={`opacity-0 flex text-center ${!sorting && "group-hover:opacity-100"} ${onOpen && "hover:bg-[#00000028] rounded"}`}><IconDelete></IconDelete></div>
            </div>
            {(open || hover) &&
                <div className={`flex flex-col ${selected ? "bg-[#00000046]" : "bg-[#00000023] peer-hover:bg-[#00000046]"}`}>
                    {children ? children : <span style={{color: textColor}} className='text-center mx-auto text-xs py-[0.05rem] opacity-70'>No pages</span>}
                </div> 
            }
        </div>
    );
});

export function DroppableBook({Title, children, id, open, onClick, onOpen, onAdd, onRemove, selected,  items, bgColor, textColor }: ContainerProps & { id: UniqueIdentifier; items: UniqueIdentifier[]; }) {
    const { active, attributes, isDragging, listeners, isSorting, over, setNodeRef, transition, transform, } = useSortable({
        id,
        data: {
            type: 'container',
            children: items,
        }
    });

    const isOverContainer = over ? (id === over.id && active?.data.current?.type !== "container") || items.includes(over.id) : false;
  
    return (
      <BookContainer
        ref={setNodeRef}
        Title={Title}
        open={open}
        style={{
            transition,
            transform: CSS.Translate.toString(transform),
            opacity: isDragging ? 0.5 : undefined,
        }}
        onClick={onClick}
        onOpen={onOpen}
        hover={isOverContainer}
        sorting={isSorting}
        onAdd={onAdd}
        id={id}
        onRemove={onRemove}
        bgColor={bgColor}
        textColor={textColor}
        selected={selected}
        handleProps={{
          ...attributes,
          ...listeners,
        }}
      >
        {children}
      </BookContainer>
    );
}