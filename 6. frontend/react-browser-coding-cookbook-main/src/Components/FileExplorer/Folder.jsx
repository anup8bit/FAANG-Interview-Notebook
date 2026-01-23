import { useState } from "react";
import File from "./File";

const Folder = ({folderData}) => {
  const [open, setOpen] = useState(false);

  let folderCtaClassNames = "folder-cta";
  folderCtaClassNames += open ? " list-open" : " list-close";

  return (
    <div className="folder-container">
      <button className={folderCtaClassNames} onClick={() => setOpen(!open)}>
         <span>{folderData.name}</span>
      </button>
      <ul className="file-explorer-list">
        {folderData?.items?.map(item => {
          if (item?.items?.length > 0) {
            return open ? <Folder folderData={item} /> : null
          } else {
            return open ? <File name={item.name} /> : null
          }
        })}
      </ul>
    </div>
  )
}

export default Folder;