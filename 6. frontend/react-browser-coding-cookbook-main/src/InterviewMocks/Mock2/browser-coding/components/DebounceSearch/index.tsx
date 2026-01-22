import { useCallback, useState } from "react";
import { debounce } from "../../utils/debounce";

const DebounceSearch = ({
  delay = 500,
  url = "https://api.github.com/search/users",
}) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState(null);

  const handleSearch = async (text: string) => {
    if (!text) return;
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${url}?q=${text}`);
      const res = await resp.json();
      setData(res);
    } catch (err) {
      setError(err as unknown as Error);
    } finally {
      setLoading(false);
    }
  }

  const debounceSearch = useCallback(debounce(handleSearch, 2000), []);

  const handleOnChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    debounceSearch(text)
  }

  return (
    <div>
      <header>
        <h3>Debounce Search Box</h3>
      </header>
      <div className="debounce-search-field">
        <label htmlFor="search-input-field">
          Debounce Search
        </label>
        <input
          name="search"
          value={searchText}
          onChange={handleOnChange}
        />
      </div>
      <div className="search-result">
        {loading ? <p>Loading......</p> : <p>Data will be shown here</p>}
      </div>
    </div>
  )
}

export default DebounceSearch;
