export interface User {
  id: number;
  fName: string;
  lName?: string;
  createdAt: String;
  userName: string;
  profilePicUrl?: string;
}

export interface Post {
  id: number;
  body: string;
  files: string[];
  likes: number;
  comments: string[];
  createdAt: string;
  user: User
  userId: string;
}

export interface PostState {
  posts: Post[];
  page: number;
  limit: number;
  loading: boolean;
  error: Record<string, any> | null;
  post: Post | null;
}

export type ActionType = 'GET_POSTS' |
'SET_LOADING' |
'SET_ERROR' |
'INCREMENT_PAGE' |
'SET_POST' |
'ADD_POSTS';

export interface Action {
  type: ActionType,
  payload: any,
}

export const GET_POSTS = 'GET_POSTS';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';
export const SET_POST = 'SET_POST';
export const ADD_POSTS = 'ADD_POSTS';
export const INCREMENT_PAGE = 'INCREMENT_PAGE';
