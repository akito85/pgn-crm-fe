import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    level : ""
}

const userLevelSlice = createSlice({
    name: 'user_level',
    initialState,
    reducers: {
        setUserLevel: (state, action) => {
            state.level = action.payload;
        }
    }
    
})

export const { setUserLevel } = userLevelSlice.actions;
export default userLevelSlice.reducer;