export interface User {
  avatar_url : string;
  events_url : string;
  followers_url : string;
  following_url : string;
  gists_url : string;
  gravatar_id : string;
  html_url : string;
  id : number;
  login : string;
  node_id : string;
  organizations_url : string;
  received_events_url : string;
  repos_url : string;
  type : string;
  url : string;
  user_view_type : string;
}

export interface GithubSearchResponse<T> {
  total_count: number;
  incomplete_results: boolean;
  items: T[];
}