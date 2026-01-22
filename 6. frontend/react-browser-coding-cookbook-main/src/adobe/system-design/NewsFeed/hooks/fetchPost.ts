import { Dispatch } from "react";
import { Action, ADD_POSTS, GET_POSTS, SET_ERROR } from "../type";

export const fetchPosts = async (url: string, dispatch: Dispatch<Action>) => {
  try {
    dispatch({type: GET_POSTS, payload: null});
    const resp = await fetch(url);
    const res = await resp.json();

    if (!res.OK) {
      dispatch({type: SET_ERROR, payload: {error: res.error}});
    }
    
    dispatch({type: ADD_POSTS, payload: {posts: res}});
  } catch(error) {
    dispatch({type: SET_ERROR, payload: {error}});
  } finally {
    console.log("-----finally----");
  }
}