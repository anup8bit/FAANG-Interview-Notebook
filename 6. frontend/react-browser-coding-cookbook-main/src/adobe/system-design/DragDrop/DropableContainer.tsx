import { DragEvent, ReactNode } from "react"

interface DropableContainerProps {
  children: ReactNode;
  id: string;
  className?: string;
  key?: string;
  testId?: string;
  onDrop: (e: DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  label?: string; // for ARIA
}

const DropableContainer = ({
  children,
  id,
  className,
  key,
  testId,
  label,
  onDragOver,
  onDrop,
} : DropableContainerProps) => {
  const classNames = "dragable-container " + className || "";

  const handleOnDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log("drag on over");
    onDragOver(e);
  }

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    console.log("drag on drop");
    onDrop(e, id);
  }

  return (
    <div
      className={classNames}
      id={id}
      key={key}
      test-id={testId}
      aria-label={label}
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
    >
      {children}
    </div>
  )
}

export default DropableContainer;
