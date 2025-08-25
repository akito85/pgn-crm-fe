import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    loading : false
}

export const createGeneratePassword = () => { };

const generatePasswordSlice = createSlice({
    name : 'GENERATE_PASSWORD',
});

const { reducer } = generatePasswordSlice;
export default reducer