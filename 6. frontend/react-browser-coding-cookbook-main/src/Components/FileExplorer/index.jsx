import File from "./File"
import Folder from "./Folder"
import { debounce, fileData, sortFolderData } from "./utils";
import "./index.css";
import { useCallback, useEffect, useMemo, useState } from "react";

const FileExplorer = () => {
  const sortedData = useMemo(() => sortFolderData(fileData), []);
  const [searchText, setSearchText] = useState("");
  const [filteredFolderData, setFilteredFolderData] = useState(sortedData);

  const filterData = useCallback((data, text) => {
    if(!text) return data;
    let filteredData = [];
    data.forEach(item => {
      if(!item.items) {
        if (item.name.toLowerCase().includes(text.toLowerCase())) {
          filteredData.push(item);
        }
      } else {
        const newData = filterData(item.items, text);
        console.log("new data : ", item.name, newData);
        if (newData.length > 0) {
          filteredData.push({...item, items: newData})
        }
      }
    });

    console.log("data : ", data)
    console.log("filteredData : ", filteredData)

    return filteredData;
  }, []);

  // Debounced filter function (only triggers after user stops typing)
  const debouncedSearch = useMemo(() => debounce((text) => {
    setFilteredFolderData(filterData(sortedData, text))
  }, 1000), [filterData, searchText]);

  useEffect(() => {
    debouncedSearch(searchText);
    
    return debouncedSearch.cancel;
  }, [debouncedSearch, searchText]);

  const fileExplorerData = searchText.length > 0 ? filteredFolderData : sortedData

  // console.log(" filteredFolderData : ", fileExplorerData)

  return (
    <section className="file-explorer-container" aria-label="File Explorer">
      <nav>
        <input
          type="text"
          name="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="text-input"
        />
        <ul className="file-explorer-list">
          {
            fileExplorerData?.map((file) => {
              if (file?.items?.length  > 0) {
                return <Folder folderData={file} />
              }
              return <File name={file.name} />
            })
          }
      </ul>
      </nav>
    </section>
  )
}

export default FileExplorer;