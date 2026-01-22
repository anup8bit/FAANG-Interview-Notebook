import { useEffect, useState } from "react";
import { useFetchData } from "../../../hooks/useFetchData";
import useDebounce from "../../hooks/useDebounce";
import Table from "./Table";

export interface GitHubUser {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
}

export const GITHUB_USER_KEYS = [
  "login",
  "id",
  "node_id",
  "avatar_url",
  "gravatar_id",
  "url",
  "html_url",
  "followers_url",
  "following_url",
  "gists_url",
  "starred_url",
  "subscriptions_url",
  "organizations_url",
  "repos_url",
  "events_url",
  "received_events_url",
  "type",
  "user_view_type",
  "site_admin",
];

const TableSearch = () => {
    const [searchedData, setSearchedData] = useState([]);
    const [page, setPage] = useState(0);
    const [query, setQuery] = useState("");

    const debouncedQuery = useDebounce(query);

    const {data = [], loading, error} = useFetchData(
        `https://api.github.com/users?page=${page}&per_page=50`
    );

    const columns = [
        {name: "id", label: "Id"},
        {name: "login", label: "Username"},
        {name: "node_id", label: "Node Id"},
        {name: "html_url", label: "Github Url"},
        {name: "repos_url", label: "Repo Url"},
        {name: "user_view_type", label: "View type"},
    ];

    return (
        <div>
            <h3>Github users data in table</h3>

            <input
            />

            <Table columns={columns} data={data as unknown as Record<string, any>[] ?? []}/>
        </div>
    )
}

export default TableSearch;
