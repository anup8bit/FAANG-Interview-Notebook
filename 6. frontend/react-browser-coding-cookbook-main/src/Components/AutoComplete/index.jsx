import { useEffect, useMemo, useRef, useState } from "react";
import Input from "./Input";
import { debounce, formatedData } from "./utils";
import { useFetchData } from "./useFetchData";
import AutoSuggestionsList from "./AutoSuggestionList";
import "./index.css";

const AutoComplete = ({ url = "https://api.github.com/search/users?q=" }) => {
    const [searchText, setSearchText] = useState("");
    const [searchUrl, setSearchUrl] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    const inputRef = useRef();
    const listRefs = useRef([]);
    const listContainerRef = useRef(null);

    const {data, error, loading} = useFetchData(searchUrl);


    useEffect(() => {
        handleListAutoScroll();
    }, [activeIndex]);

    useEffect(() => {
        listRefs.current = listRefs.current.slice(0, suggestions.length-1);

        return () => {
            // listRefs.cancel();
            // listContainerRef.cancel();
            // inputRef.cancel();  
        }
    }, [data])

    const suggestions = useMemo(() => formatedData(data), [data]);

    const debouncedSearch = useMemo(
        () => 
            debounce((val) => {
                if (val.length > 3) {
                    setSearchUrl(`${url}${val}`)
                } else {
                    setSearchUrl("")
                }
            }, 1000),
        [url]
    );

    const handleOnChange = (e) => {
        setSearchText(e.target.value);
        debouncedSearch(e.target.value);
    }

    const handleOnKeyDown = (e) => {
        console.log(e);
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(activeIndex === 0 ? 0 : activeIndex-1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(activeIndex === suggestions.length - 1 ? activeIndex : activeIndex+1);
                break;
            case 'Enter':
                if (activeIndex >= 0) {
                    console.log("selected : ", suggestions[activeIndex]);
                    inputRef.current.value = suggestions[activeIndex].label;
                    inputRef.current.focus();
                    setActiveIndex(-1);
                    break;
                }
        }
    }

    const handleListAutoScroll = () => {
        if (
            activeIndex >= 0
            && listRefs.current[activeIndex]
            && listContainerRef.current
        ) {
            const itemEl = listRefs.current[activeIndex];
            const containerElem = listContainerRef.current;

            const itemRect = itemEl.getBoundingClientRect();
            const containerRect = containerElem.getBoundingClientRect();

            // item below visible area
            if (itemRect.bottom > containerRect.bottom) {
                itemEl.scrollIntoView({ block: "end" })
            }

            // item above visible area
            if(itemRect.top < containerRect.top) {
                itemEl.scrollIntoView({ block: "start" })
            }
        }
    }

    console.log(listRefs)


    return (
        <div className="auto-complete-container">
            <h3>Auto Complete Demo</h3>
            <Input
                label="Search Github user:"
                name="autoComplete"
                value={searchText}
                onChange={handleOnChange}
                id="auto-complete"
                className="auto-complete-input"
                ref={inputRef}
                onKeyDown={handleOnKeyDown}
            />
            <AutoSuggestionsList
                activeIndex={activeIndex}
                listRefs={listRefs}
                listContainerRef={listContainerRef}
                loading={loading}
                data={suggestions}
            />
        </div>
    )
}

export default AutoComplete;
