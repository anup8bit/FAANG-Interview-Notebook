import {
  Action,
  ADD_POSTS,
  GET_POSTS,
  INCREMENT_PAGE,
  PostState,
  SET_ERROR,
  SET_LOADING,
  SET_POST,
} from "../type";

export const initialState: PostState = {
  posts: [],
  post: null,
  page: 0,
  limit: 10,
  loading: false,
  error: null,
}

const postReducer = (state: PostState, action: Action) => {
  switch(action.type) {
    case GET_POSTS:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case SET_POST:
      return {
        ...state,
        loading: false,
        error: null,
        post: action.payload.post
      }
    case ADD_POSTS:
      return {
        ...state,
        loading: false,
        error: null,
        posts: [...state.posts, ...action.payload.posts]
      }
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      }
    case SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
      }
    case INCREMENT_PAGE:
      return {
        ...state,
        page: state.page+1,
      }
    default:
      return state;
  }
}

export default postReducer;
