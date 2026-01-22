import { ChangeEvent, Suspense, use, useEffect, useMemo, useState } from "react";
import { useFetchData } from "./hooks/useFetchData";
import Table from "./components/Table";
import { columns } from "./utils";
import SearchInput from "./components/SearchInput";
import { useDebounce } from "./hooks/useDebounce";
import { useFilterData } from "./hooks/useFilterData";

const AnalyticsDashboardPage = () => {
  const [page, setPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const limit = 100;
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${limit*page}`;
  const {loading, paginatedData, error} =  useFetchData(url);

  const handleOnChange = (e: ChangeEvent) => {
    setSearchText(e.target.value);
  }

  const debounceSearch = useDebounce(searchText, 500);

  const filteredData = useMemo(() => useFilterData(paginatedData?.products ?? [], debounceSearch), [debounceSearch]);
  console.log("filtered data : ", filteredData);

  return (
    <Suspense fallback={<span>Loading....</span>}>
      <div className="analytics-dashboard-container">
      <header>
        <h3>Analytics Dashboard</h3>
      </header>
      <SearchInput
        placeholder="Search here in the table"
        label="Search : "
        name="searchText"
        value={searchText}
        onChange={handleOnChange}
        id="dearch-text"
      />
      <Table
        columns={columns}
        data={filteredData}
      />
    </div>
    </Suspense>
  )
}

export default AnalyticsDashboardPage;
