import { useState } from "react";
import FileExplorer from ".";
import { FileProps } from "./utils";

const FileItem = ({data}: {data: FileProps}) => {
    const [open, setOpen] = useState(false);
    const handleFolderClick = () => {
        setOpen(!open);
    }

    const isFolder = data.files && Array.isArray(data.files);
    
    return (
        <div>
            {isFolder ?
                <button onClick={handleFolderClick}>{data.name}</button> :
                <h4 onClick={handleFolderClick}>{data.name}</h4>
            }
            {data.files && data.files?.length > 0 && open && (
                <FileExplorer files={data.files} />
            )}
        </div>
    )
}

export default FileItem;