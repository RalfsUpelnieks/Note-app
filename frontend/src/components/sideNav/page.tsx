import React, { useEffect } from "react";
import { IconDelete } from '../../icons';
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PLACEHOLDERS from "../../utils/placeholders";

interface SortableItemProps {
  id: UniqueIdentifier;
  index: number;
  title: string;
  textColor?: string;
  selected: boolean;
  onClick?(): void;
  onRemove?(): void;
}

export function SortableItem({ id, index, title, textColor, selected, onRemove, onClick }: SortableItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id,
  });

  return (
    <Item
      ref={setNodeRef}
      title={title}
      dragging={isDragging}
      sorting={isSorting}
      index={index}
      onClick={onClick}
      onRemove={onRemove}
      color={textColor}
      selected={selected}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : undefined,
      }}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
    />
  );
}

export interface Props {
  dragOverlay?: boolean;
  color?: string;
  dragging?: boolean;
  handleProps?: any;
  height?: number;
  index?: number;
  sorting?: boolean;
  title: string;
  selected: boolean;
  style?: React.CSSProperties;
  onClick?(): void;
  onRemove?(): void;
}

export const Item = React.memo(
  React.forwardRef<HTMLLIElement, Props>(
    (
      {
        color,
        dragOverlay,
        dragging,
        handleProps,
        index,
        onClick,
        onRemove,
        selected,
        sorting,
        title,
        style,
      },
      ref
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }

        document.body.style.cursor = "grabbing";

        return () => {
          document.body.style.cursor = "";
        };
      }, [dragOverlay]);

      return (
          <div 
            ref={ref} 
            {...handleProps} 
            onClick={onClick} 
            style={ { ...style, "--index": index, color: color, } as React.CSSProperties }
            className={`ps-4 pe-1 p-0 flex justify-between text-left text-sm hover:cursor-pointer ${dragOverlay ? "bg-[#00000025] text-white" : "group"} ${selected ? "bg-[#0000002a] border border-solid border-white" : ""}  ${!selected && !dragOverlay ? "hover:bg-[#0000001a] border-none" : ""}`}
          >
            <span className="overflow-hidden whitespace-nowrap text-ellipsis" dangerouslySetInnerHTML={{__html: title.replaceAll("<br>", " ") || PLACEHOLDERS.page}}></span>
            <div onClick={(e) => { e.stopPropagation(); onRemove && onRemove();}} style={{color: color}}  className={`p-0 flex text-center opacity-0 hover:bg-[#00000028] rounded ${!sorting && "group-hover:opacity-100"}`}><IconDelete/></div>
          </div>
      );
    }
  )
);