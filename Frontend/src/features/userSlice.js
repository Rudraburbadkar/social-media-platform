import { createSlice } from '@reduxjs/toolkit';


const intialState = {
    user: undefined,
    posts: [],
    bookmarks: [],
    isLoggedIn: false
};

const userSlice = createSlice({
    name: "user",
    initialState: intialState,
    reducers:{ // here we write thelogic
       setCredentials: (state,action) =>{
          state.user = action.payload.user;
          state.isLoggedIn = true;
          state.posts = action.payload.posts || [];
          state.bookmarks = action.payload.bookmarks || [];
       },
       clearCredentials: (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.posts = [];
        state.bookmarks = [];
       }
    }
});

export const {setCredentials,clearCredentials} = userSlice.actions;
export default userSlice.reducer;

//name: Sets the slice name (used internally in Redux DevTools and the Redux store as state.user).

// initialState: Sets the default values.

// reducers: Contains functions that define how state should change.

