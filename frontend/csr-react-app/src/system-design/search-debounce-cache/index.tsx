import { useState, type ChangeEvent } from "react";
import SearchInput from "./components/SearchInput";
import useDebounce from "./hooks/useDebounce";
import useFetch from "./hooks/useFetch";

const SearchDebouncedCache = () => {
    const [searchText, setSearchText] = useState("");

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    }

    const debouncedSearchText = useDebounce(searchText, 300);

    const url = debouncedSearchText === "" ? "" : `https://api.github.com/search/users?q=${debouncedSearchText}`;

    const {data, error, loading} = useFetch(url);

    console.log(data, error, loading);

    return (
        <div className="search-debounce-cache">
            <h3>Search with debounce and cache feature</h3>
            <SearchInput
                onChange={onChange}
                value={searchText}
                id="search-debounced-cache"
                label="Search User"
                placeholder="enter here to search user..."
            />
        </div>
    )
}

export default SearchDebouncedCache;
