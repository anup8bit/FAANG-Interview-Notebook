import FileItem from "./FileItem";
import { FileProps, files, sortFilesByFolderAndFilename } from "./utils"

const FileExplorer = ({ files }: {files: FileProps[]}) => {
    const filesData = sortFilesByFolderAndFilename(files);
    return (
        <div>
            <ul>
                {files.map((file, index) => (
                    <FileItem data={file} />
                ))}
            </ul>
        </div>
    )
}

export default FileExplorer;