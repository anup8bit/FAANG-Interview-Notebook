import FileExplorer from "../components/FileExplorer";
import { files } from "../components/FileExplorer/utils";
import ThrottledInfiniteScroll from "../components/ThrottledInfiniteScroll";
import "./grid.css";

const GridLayout = () => {
    return (
            <div className="grid-container">
                <div className="grid-header"></div>
                <div className="grid-sidebar">
                    <FileExplorer files={files} />
                </div>
                <div className="grid-content">
                    <ThrottledInfiniteScroll />
                </div>
                {/* <div className="grid-footer"></div> */}
            </div>
    )
}

export default GridLayout;
