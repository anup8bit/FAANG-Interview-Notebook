import { DragEvent, DragEventHandler, ReactNode } from "react"

interface DragableElementProps<
T = any,
E extends HTMLElement = HTMLDivElement
> {
  children: ReactNode;
  onDragStart: (e: DragEvent<E>, data: T) => void;
  onDragEnd: (e: DragEvent<E>) => void;
  data:T;
  className?: string;
}

const DragableElement = <
  T = any,
  E extends HTMLElement = HTMLDivElement
>({
  children,
  data,
  onDragEnd,
  onDragStart,
  className,
}: DragableElementProps) => {

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    console.log("e : ", e);
    onDragStart(e, data);
  }

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    console.log("drag end called : ");
    e.dataTransfer.clearData();
    onDragEnd(e);
  }

  return (
    <div
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={className}
      draggable
    >
      {children}
    </div>
  )
}

export default DragableElement;
