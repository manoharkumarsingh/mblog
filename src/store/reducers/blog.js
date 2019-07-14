import {
  BLOG_SELECTED,
  BLOG_LIST,
  ADD_BLOG,
  UPDATE_BLOG,
  ADD_BLOG_LIKE
} from "../actionTypes";

const initialState = {
  blogs: {},
  selectedBlogs: [
    {
      _id: "",
      title: "",
      content: ""
    }
  ],
  addedBlogs: {},
  addedBlogLikes: 0
};
export default function(state = initialState, action) {
  switch (action.type) {
    case BLOG_SELECTED:
      return {
        ...state,
        selectedBlogs: action.payload
      };
    case BLOG_LIST:
      return {
        ...state,
        blogs: action.payload
      };
    case ADD_BLOG:
      return {
        ...state,
        addedBlogs: action.payload
      };
    case UPDATE_BLOG:
      return {
        ...state,
        addedBlogs: action.payload
      };
    case ADD_BLOG_LIKE:
      return { ...state, addedBlogLikes: action.payload };

    default:
      return state;
  }
}
