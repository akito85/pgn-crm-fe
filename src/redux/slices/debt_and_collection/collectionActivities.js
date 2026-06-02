import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import debtAndCollectionHttpService from "../../services/debtAndCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
  setBodyError,
} from "../general_slice";

const initialState = {
  loading: false,
  loadingApproval: false,
  data: null,
  dataDetail: null,
  data_media: [],
  data_category: [],
  data_criteria: [],
  data_customer_segment: [],
  data_account_group: [],
  data_account_category: [],
  data_service_type: [],
  data_industrial_sector: [],
  data_budget: [],
  data_sor: [],
  data_cost_center: [],
  data_gsizes: [],
  data_province: [],
  data_city: [],
  data_district: [],
  data_sub_district: [],
  data_customer_ca: [],
  data_approval_history: null,
  data_approval_list: [],
  dataListAppHierId: [],
  dataListAppHierDetail: [],
  dataListCategory: [],
};

// ─── ATTACHMENT CATEGORY ─────────────────────────────────────────────────────

export const getListCategoryCA = createAsyncThunk(
  "GET_LIST_CATEGORY_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-attachment-category`;
      const response = await debtAndCollectionHttpService.get(url);
      return (response.data || []).map((item) => ({
        Id: item?.Id ?? item?.id ?? item?.glbTypeValId ?? item?.value,
        text: item?.text ?? item?.name ?? item?.label ?? item?.code,
      }));
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── DROPDOWN OPTIONS ─────────────────────────────────────────────────────────

export const getMedia = createAsyncThunk(
  "GET_MEDIA_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-media`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCategory = createAsyncThunk(
  "GET_CATEGORY_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-category`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCriteria = createAsyncThunk(
  "GET_CRITERIA_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-criteria`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCustomerSegment = createAsyncThunk(
  "GET_CUSTOMER_SEGMENT_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-customer-segment`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getAccountGroup = createAsyncThunk(
  "GET_ACCOUNT_GROUP_COLLECTION_ACTIVITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-account-group-type/${id}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getAccountCategory = createAsyncThunk(
  "GET_ACCOUNT_CATEGORY_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-account-category`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getServiceType = createAsyncThunk(
  "GET_SERVICE_TYPE_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-service-type`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getIndustrialSector = createAsyncThunk(
  "GET_INDUSTRIAL_SECTOR_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-industrial-sector`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getBudget = createAsyncThunk(
  "GET_BUDGET_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-budget`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getSor = createAsyncThunk(
  "GET_SOR_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-sor`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCostCenter = createAsyncThunk(
  "GET_COST_CENTER_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-cost-center`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getGsizes = createAsyncThunk(
  "GET_GSIZES_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-g-size`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getProvince = createAsyncThunk(
  "GET_PROVINCE_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-province`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCity = createAsyncThunk(
  "GET_CITY_COLLECTION_ACTIVITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-city/${id}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getDistrict = createAsyncThunk(
  "GET_DISTRICT_COLLECTION_ACTIVITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-district/${id}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getSubDistrict = createAsyncThunk(
  "GET_SUB_DISTRICT_COLLECTION_ACTIVITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-sub-district/${id}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getCustomerCA = createAsyncThunk(
  "GET_CUSTOMER_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-customer`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── GET LIST (Paginate + Infinite Scroll) ────────────────────────────────────

export const getAllCollectionActivitiesPaginate = createAsyncThunk(
  "GET_ALL_COLLECTION_ACTIVITIES_PAGINATE",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    const searchParams = search === undefined ? "" : search;
    const sortParams =
      sort === undefined || sort === "" ? "createdDate~desc" : sort;
    try {
      const url = `/v1/dbs/api/collection-activities/get-list?page=${page}&size=${pageSize}&sort=${sortParams}&searchs=${searchParams}`;
      const response = await debtAndCollectionHttpService.getPagination(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── GET DETAIL ───────────────────────────────────────────────────────────────

export const getDetailCollectionActivity = createAsyncThunk(
  "GET_DETAIL_COLLECTION_ACTIVITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/${id}`;
      const response = await debtAndCollectionHttpService.getPagination(url);
      const detail = response.data || {};
      // Flatten nested structure: { activity, criteria, attachments, ... } → flat object for the form
      const activity = detail.activity || {};
      return {
        ...activity,
        criteriaData: detail.criteria || [],
        mattachmentLists: detail.attachments || [],
        approvalInfo: detail.approvalInfo || null,
        criteriaApprovalInfo: detail.criteriaApprovalInfo || null,
        isCriteriaApproval: Boolean(detail.isCriteriaApproval),
        canApproveCriteria: Boolean(detail.canApproveCriteria),
        criteriaApprovalItemIds: detail.criteriaApprovalItemIds || [],
        actions: detail.actions || [],
      };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── CREATE ───────────────────────────────────────────────────────────────────

export const createCollectionActivity = createAsyncThunk(
  "CREATE_COLLECTION_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/save`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Your data has been submitted.",
          return: false,
        })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          thunkAPI.dispatch(
            showModalError({
              title: "Failed",
              description: `Your data was not submitted. ${message}.`,
            })
          );
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── UPDATE ───────────────────────────────────────────────────────────────────

export const updateCollectionActivity = createAsyncThunk(
  "UPDATE_COLLECTION_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/save`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Your data has been updated.",
          return: false,
        })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          thunkAPI.dispatch(
            showModalError({
              title: "Failed",
              description: `Your data was not updated. ${message}.`,
            })
          );
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── DOWNLOAD LIST ────────────────────────────────────────────────────────────

export const downloadCollectionActivities = createAsyncThunk(
  "DOWNLOAD_COLLECTION_ACTIVITIES",
  async ({ page, pageSize, sort, search }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/download?page=${page}&size=${pageSize}&sort=${sort || "createdDate~desc"}&searchs=${search || ""}`;
      await debtAndCollectionHttpService.downloadData(url);
      return { success: true };
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── BULK APPROVAL ───────────────────────────────────────────────────────────

export const getAllCollectionActivitiesApprovalList = createAsyncThunk(
  "GET_ALL_COLLECTION_ACTIVITIES_APPROVAL_LIST",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-approval`;
      const response = await debtAndCollectionHttpService.getAll(url);
      return response.data || [];
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      if (
        error?.response?.data?.code === 500 ||
        error?.response?.data?.code === 419
      ) {
        thunkAPI.dispatch(setBodyError(error));
      } else {
        thunkAPI.dispatch(
          showModalError({ title: "Failed", description: `${message}` })
        );
      }
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const bulkApproveCollectionActivities = createAsyncThunk(
  "BULK_APPROVE_COLLECTION_ACTIVITIES",
  async ({ body, action }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/approve/bulk`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Successful",
          description: `Your data has been ${action}.`,
          return: false,
        })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          thunkAPI.dispatch(
            showModalError({
              title: "Failed",
              description: `Your data was not ${action}. ${message}.`,
            })
          );
        }
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── APPROVAL: Get List Approval Hierarchy ────────────────────────────────────

export const getListApprovalHierarchyCA = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-available-hierarchy`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getListApprovalHierarchyCriteriaCA = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_CRITERIA_COLLECTION_ACTIVITY",
  async (_, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/list-available-hierarchy-criteria`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── APPROVAL: Get Hierarchy Detail ──────────────────────────────────────────

export const getListApprovalHierarchyDetailCA = createAsyncThunk(
  "GET_LIST_APPROVAL_HIERARCHY_DETAIL_COLLECTION_ACTIVITY",
  async ({ id }, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/apphier//get-approval-hierarchies/${id}`;
      const response = await debtAndCollectionHttpService.get(url);
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

// ─── APPROVAL HISTORY ─────────────────────────────────────────────────────────

export const getApprovalHistoryCA = createAsyncThunk(
  "GET_APPROVAL_HISTORY_COLLECTION_ACTIVITY",
  async (id, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/approval-history/${id}`;
      const response = await debtAndCollectionHttpService.get(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const getApprovalHistoryCriteriaCA = createAsyncThunk(
  "GET_APPROVAL_HISTORY_COLLECTION_ACTIVITY_CRITERIA",
  async (criteriaId, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/approval-history/criteria/${criteriaId}`;
      const response = await debtAndCollectionHttpService.get(url);
      return Array.isArray(response.data) ? null : response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || error?.toString();
      thunkAPI.dispatch(
        showModalError({ title: "Failed", description: `${message}` })
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);

export const submitApprovalCriteriaCA = createAsyncThunk(
  "SUBMIT_APPROVAL_CRITERIA_COLLECTION_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/submit-approval-criteria`;
      const response = await debtAndCollectionHttpService.createData(url, body);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          thunkAPI.dispatch(
            showModalError({
              title: "Failed",
              description: `Your data was not submitted. ${message}.`,
            })
          );
        }
      } else {
        thunkAPI.dispatch(
          showModalError({
            title: "Failed",
            description: `Your data was not submitted. ${message}.`,
          })
        );
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ─── INACTIVATE / ACTIVATE ────────────────────────────────────────────────────

export const inactiveCollectionActivity = createAsyncThunk(
  "INACTIVE_COLLECTION_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/active-inactive`;
      const response = await debtAndCollectionHttpService.updateData(url, {
        ...body,
        status: "INACTIVE",
      });
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Your data has been submitted.",
          return: false,
        })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          thunkAPI.dispatch(
            showModalError({
              title: "Failed",
              description: `Your data was not submitted. ${message}.`,
            })
          );
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

export const requestActivateCollectionActivity = createAsyncThunk(
  "REQUEST_ACTIVATE_COLLECTION_ACTIVITY",
  async (body, thunkAPI) => {
    try {
      const url = `/v1/dbs/api/collection-activities/active-inactive`;
      const response = await debtAndCollectionHttpService.updateData(url, {
        ...body,
        status: "ACTIVE",
      });
      thunkAPI.dispatch(
        showModalSuccess({
          title: "Successful",
          description: "Your data has been submitted.",
          return: false,
        })
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      if (Math.floor((error?.response?.data?.code || 0) / 100) === 4) {
        if (error?.response?.data?.code === 419) {
          thunkAPI.dispatch(setBodyError(error));
        } else {
          thunkAPI.dispatch(
            showModalError({
              title: "Failed",
              description: `Your data was not submitted. ${message}.`,
            })
          );
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  }
);

// ─── SLICE ────────────────────────────────────────────────────────────────────

const collectionActivitiesSlice = createSlice({
  name: "collectionActivities",
  initialState,
  extraReducers: (builder) => {
    // GET LIST PAGINATE
    builder
      .addCase(getAllCollectionActivitiesPaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCollectionActivitiesPaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllCollectionActivitiesPaginate.rejected, (state) => {
        state.loading = false;
      });

    // GET DETAIL
    builder
      .addCase(getDetailCollectionActivity.pending, (state) => {
        state.loading = true;
        state.dataDetail = null;
      })
      .addCase(getDetailCollectionActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.dataDetail = action.payload;
      })
      .addCase(getDetailCollectionActivity.rejected, (state) => {
        state.loading = false;
      });

    // CREATE
    builder
      .addCase(createCollectionActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCollectionActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCollectionActivity.rejected, (state) => {
        state.loading = false;
      });

    // UPDATE
    builder
      .addCase(updateCollectionActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCollectionActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCollectionActivity.rejected, (state) => {
        state.loading = false;
      });

    // DOWNLOAD
    builder
      .addCase(downloadCollectionActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadCollectionActivities.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(downloadCollectionActivities.rejected, (state) => {
        state.loading = false;
      });

    // BULK APPROVAL LIST
    builder
      .addCase(getAllCollectionActivitiesApprovalList.pending, (state) => {
        state.loadingApproval = true;
      })
      .addCase(
        getAllCollectionActivitiesApprovalList.fulfilled,
        (state, action) => {
          state.loadingApproval = false;
          state.data_approval_list = action.payload;
        }
      )
      .addCase(getAllCollectionActivitiesApprovalList.rejected, (state) => {
        state.loadingApproval = false;
        state.data_approval_list = [];
      });

    // BULK APPROVE
    builder
      .addCase(bulkApproveCollectionActivities.pending, (state) => {
        state.loadingApproval = true;
      })
      .addCase(bulkApproveCollectionActivities.fulfilled, (state) => {
        state.loadingApproval = false;
      })
      .addCase(bulkApproveCollectionActivities.rejected, (state) => {
        state.loadingApproval = false;
      });

    // APPROVAL HIERARCHY LIST
    builder
      .addCase(getListApprovalHierarchyCA.fulfilled, (state, action) => {
        state.dataListAppHierId = action.payload || [];
      })
      .addCase(getListApprovalHierarchyCA.rejected, (state) => {
        state.dataListAppHierId = [];
      });

    // APPROVAL HIERARCHY DETAIL
    builder
      .addCase(getListApprovalHierarchyDetailCA.fulfilled, (state, action) => {
        state.dataListAppHierDetail = action.payload || [];
      })
      .addCase(getListApprovalHierarchyDetailCA.rejected, (state) => {
        state.dataListAppHierDetail = [];
      });

    // APPROVAL HISTORY
    builder
      .addCase(getApprovalHistoryCA.pending, (state) => {
        state.loading = true;
        state.data_approval_history = null;
      })
      .addCase(getApprovalHistoryCA.fulfilled, (state, action) => {
        state.loading = false;
        state.data_approval_history = action.payload;
      })
      .addCase(getApprovalHistoryCA.rejected, (state) => {
        state.loading = false;
      });

    // INACTIVE
    builder
      .addCase(inactiveCollectionActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(inactiveCollectionActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(inactiveCollectionActivity.rejected, (state) => {
        state.loading = false;
      });

    // REQUEST ACTIVATE
    builder
      .addCase(requestActivateCollectionActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(requestActivateCollectionActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(requestActivateCollectionActivity.rejected, (state) => {
        state.loading = false;
      });

    // ATTACHMENT CATEGORY
    builder
      .addCase(getListCategoryCA.fulfilled, (state, action) => {
        state.dataListCategory = action.payload;
      })
      .addCase(getListCategoryCA.rejected, (state) => {
        state.dataListCategory = [];
      });

    // DROPDOWN OPTIONS
    builder
      .addCase(getMedia.fulfilled, (state, action) => {
        state.data_media = action.payload;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.data_category = action.payload;
      })
      .addCase(getCriteria.fulfilled, (state, action) => {
        state.data_criteria = action.payload;
      })
      .addCase(getCustomerSegment.fulfilled, (state, action) => {
        state.data_customer_segment = action.payload;
      })
      .addCase(getAccountGroup.fulfilled, (state, action) => {
        state.data_account_group = action.payload;
      })
      .addCase(getAccountCategory.fulfilled, (state, action) => {
        state.data_account_category = action.payload;
      })
      .addCase(getServiceType.fulfilled, (state, action) => {
        state.data_service_type = action.payload;
      })
      .addCase(getIndustrialSector.fulfilled, (state, action) => {
        state.data_industrial_sector = action.payload;
      })
      .addCase(getBudget.fulfilled, (state, action) => {
        state.data_budget = action.payload;
      })
      .addCase(getSor.fulfilled, (state, action) => {
        state.data_sor = action.payload;
      })
      .addCase(getCostCenter.fulfilled, (state, action) => {
        state.data_cost_center = action.payload;
      })
      .addCase(getGsizes.fulfilled, (state, action) => {
        state.data_gsizes = action.payload;
      })
      .addCase(getProvince.fulfilled, (state, action) => {
        state.data_province = action.payload;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.data_city = action.payload;
      })
      .addCase(getDistrict.fulfilled, (state, action) => {
        state.data_district = action.payload;
      })
      .addCase(getSubDistrict.fulfilled, (state, action) => {
        state.data_sub_district = action.payload;
      })
      .addCase(getCustomerCA.fulfilled, (state, action) => {
        state.data_customer_ca = action.payload;
      });
  },
});

const { reducer } = collectionActivitiesSlice;
export default reducer;
