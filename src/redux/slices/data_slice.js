import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setData: (state, action) => {
      const { key, data, storageType } = action.payload;
      if (storageType === "local") {
        localStorage.setItem(key, JSON.stringify(data));
        state.data = data;
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(data));
        state.data = data;
      }
    },
    removeData: (state, action) => {
      const { key, data, storageType } = action.payload;
      if (storageType === "local") {
        localStorage.removeItem(key, JSON.stringify(data));
        state.data = data;
      } else {
        window.sessionStorage.removeItem(key, JSON.stringify(data));
        state.data = data;
      }
    },
  },
});

export const { setData, removeData } = dataSlice.actions;
export default dataSlice.reducer;
