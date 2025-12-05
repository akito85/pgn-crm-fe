import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  data_detail: {},
  data_approval_hierarchy: [],
  data_approval_hierarchy_detail: [],
  data_approval_history: [],
  data_category_list: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  isFailed: false,
  isSuccess: false,
  message: "",
  loading: false,
};

export const getAllDigitalSignaturePaginate = createAsyncThunk(
  "GET_ALL_DIGITAL_SIGNATURE_PAGINATE",
  async ({ page, pageSize, sort, search }, { rejectWithValue }) => {
    try {
    } catch (err) {
      rejectWithValue(err);
    }
  }
);

const digitalSignatureSlice = {
  name: "digitalSignature",
  initialState,
  reducers: {
    resetDigitalSignature: (state) => {
      state.data_detail = {};
      state.data_approval_hierarchy_detail = [];
      state.isFailed = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllDigitalSignaturePaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDigitalSignaturePaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getAllDigitalSignaturePaginate.rejected, (state, action) => {
        state.loading = false;
        state.isFailed = true;
        state.message = action.payload;
      });
  },
};

export const { resetDigitalSignature } = digitalSignatureSlice.actions;
const { reducer } = digitalSignatureSlice;
export default reducer;
