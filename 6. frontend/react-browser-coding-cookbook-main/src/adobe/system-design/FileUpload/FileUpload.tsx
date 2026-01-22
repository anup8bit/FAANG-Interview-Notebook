import { ChangeEvent, useState } from "react"
import FileInput from "./FileInput";
import "./index.css";
import { useChunkFileUpload } from "./hooks/useUploadFileChunkc";


const allowedFileTypes = ["png", "jpg", "jpeg", "pdf", "doc", "docs", "csv"]

const FileUplaod = () => {
  const [fileData, setFileData] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;

    const fileType = file.type;

    if(!allowedFileTypes.includes(fileType.split("/")[1] ?? "")){
      setErrorMsg(`File of type .${fileType} not supported`);
      return;
    }

    if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    setFileData(file);
  }

  const handleFileUpload = () => {
    if (fileData === null) return;
    useChunkFileUpload(fileData);
  }

  return (
    <div className="file-upload-container">
      <div className="preview-selected-file">
        <picture>
          <source srcSet={previewUrl} src={previewUrl} />
          <img className="preview-image" src={previewUrl} alt="Preview" />
        </picture>
      </div>
      <div className="file-input">
        <FileInput
          label="Select files to upload"
          id="file-upload"
          placeholder="Click it to upload file"
          onChange={onChange}
          name="fileUpload"
        />
      </div>
      {errorMsg && <span className="error-msg">{errorMsg}</span>}
      <button
        onClick={handleFileUpload}
        className="file-upload-btn"
        disabled={fileData===null}
      >
        Upload file
      </button>
    </div>
  )
}

export default FileUplaod;
