### Drag operations

Central to the Drag and Drop API are the various drag events that fire in a specific order and are expected to be handled in a specific way. This document describes the steps that occur during a drag and drop operation, and what the application is supposed to do within each handler.

At a high level, here are the possible steps in a drag and drop operation:

1. The user starts the drag on a source node; the **dragstart event** is fired on the source node. Within this event, the source node prepares the context for the drag operation, including the drag data, feedback image, and allowed drop effects.

2. The user drags the item around: every time a new element is entered, the ***dragenter event** is fired on that element, and the dragleave event is fired on the previous element. Every few hundred milliseconds, a **dragover event** is fired on the element the drag is currently inside, and the drag event is fired on the source node.

3. The drag enters a valid drop target: the **drop target** cancels its dragover event to indicate that it is a valid drop target. Some form of drop feedback indicates the expected drop effect to the user.

4. The user performs the drop: the **drop event** is fired on the drop target. Within this event, the target node reads the drag data.

5. The drag operation ends: the dragend event is fired on the source node. This event is fired regardless of whether the drop was successful or not.




### Interfaces of Drag ans Drop API

## 1. DragEvent

  The DragEvent interface is a DOM event that represents a drag and drop interaction. The user initiates a drag by placing a pointer device (such as a mouse) on the touch surface and then dragging the pointer to a new location (such as another DOM element). 

  # Event types
  1. drag
    This event is fired when an element or text selection is being dragged.

  2. dragend
    This event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key).

  3. dragenter
    This event is fired when a dragged element or text selection enters a valid drop target.

  4. dragleave
    This event is fired when a dragged element or text selection leaves a valid drop target.

  5. dragover
    This event is fired continuously when an element or text selection is being dragged and the mouse pointer is over a valid drop target (every 50 ms WHEN mouse is not moving ELSE much faster between 5 ms (slow movement) and 1ms (fast movement) approximately. This firing pattern is different than mouseover ).

  6. dragstart
    This event is fired when the user starts dragging an element or text selection.

  7. drop
    This event is fired when an element or text selection is dropped on a valid drop target.

```tsx

//Constructor
  //DataTransfer(); Creates and returns a new DataTransfer object.

const handleDragStart = (e: DragEvent) => {
  console.log(e);
  e.dataTransfer.addElement();
  ev.dataTransfer.setData()
  ev.dataTransfer.getData()
  ev.dataTransfer.clearData()
  ev.dataTransfer.setDragImage()
}
```





### HTML Drag and Drop API ##

1. The **DataTransfer object** is used to hold any data transferred between contexts, such as a drag and drop operation, or clipboard read/write. It may hold one or more data items, each of one or more data types.


# Where to Drop - onDragOver (Container)
- container (dropable container / section) must have onDragOver event handler attached with it.

# Do the Drop - onDrop (Container)
- When the dragged data is dropped, a drop event occurs.





Events:

## onDragOver -
    specifies where the dragged data can be dropped.

    By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element.
    This is done by calling the preventDefault() method for the ondragover event:

    ```tsx
    function dragoverHandler(ev) {
      ev.preventDefault();
    }
    ```

## onDrop

  When the dragged data is dropped, a drop event occurs.

  In the example above, the ondrop attribute of the <div> element calls a function, dropHandler(event):

  ```tsx
  function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
  ```

  - Call preventDefault() to prevent the browser default handling of the data (default is open as link on drop)
  - Get the dragged data with the dataTransfer.getData() method. This method will return any data that was set to the same type in the setData() method
  - The dragged data is the id of the dragged element ("img1")
  - Append the dragged element into the drop element


  ```js
  function dragstartHandler(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function dragoverHandler(ev) {
    ev.preventDefault();
  }

  function dropHandler(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
```