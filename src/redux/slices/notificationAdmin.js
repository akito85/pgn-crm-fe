import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationApi from "../../services/notificationApi";

/**
 * Notification admin console slice (Phase 6).
 *
 * Drives the template builder, field-catalog admin, and global-settings editor.
 * Every list (events, fields, templates, channels) is loaded from the Phase 1
 * builder API — nothing is hardcoded here, so a server-side catalogue change
 * appears in the builder without an FE deploy.
 *
 * NOTE: the builder endpoints (TemplateBuilderController / NotificationEventController)
 * return their payload DIRECTLY — e.g. `List<TemplateSummaryDto>` — with no
 * `{ data }` envelope, unlike the user-notification endpoints. The thunks below
 * therefore use the response as-is.
 */

const initialState = {
  // Category picker
  events: [],
  eventsLoading: false,

  // Field discovery (grouped by module/submodule, direct vs joined)
  categoryFields: [], // FieldGroupDto[] for the selected event
  categoryFieldsLoading: false,

  // Field catalogue admin
  catalogFields: [], // FieldGroupDto[]
  catalogLoading: false,
  catalogSaving: false,

  // Templates list
  templates: [], // TemplateSummaryDto[]
  templatesLoading: false,
  filter: {
    module: null,
    submodule: null,
    category: null,
    channel: null,
    language: null,
  },

  // Single template (builder edit)
  currentTemplate: null, // { template, contentVariables, layout }
  currentTemplateLoading: false,

  // Builder validate / preview / save
  validation: null, // ValidationResult
  validating: false,
  preview: null,
  previewing: false,
  saving: false,
  saveError: null,

  error: null,
};

/* ------------------------------------------------------------------ events */

export const fetchEvents = createAsyncThunk(
  "notificationAdmin/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationApi.listEvents();
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load events");
    }
  }
);

/* ----------------------------------------------------------- field catalog */

export const fetchCategoryFields = createAsyncThunk(
  "notificationAdmin/fetchCategoryFields",
  async (eventCode, { rejectWithValue }) => {
    try {
      return await notificationApi.getCategoryFields(eventCode);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load category fields");
    }
  }
);

export const fetchCatalogFields = createAsyncThunk(
  "notificationAdmin/fetchCatalogFields",
  async (module = null, { rejectWithValue }) => {
    try {
      return await notificationApi.listCatalogFields(module);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load catalogue fields");
    }
  }
);

export const saveCatalogField = createAsyncThunk(
  "notificationAdmin/saveCatalogField",
  async (field, { dispatch, rejectWithValue }) => {
    try {
      const saved = await notificationApi.saveCatalogField(field);
      // refresh the grouped catalogue after a successful register
      dispatch(fetchCatalogFields());
      return saved;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error?.message || "Failed to save field");
    }
  }
);

/* -------------------------------------------------------------- templates */

export const fetchTemplates = createAsyncThunk(
  "notificationAdmin/fetchTemplates",
  async (filter = {}, { rejectWithValue }) => {
    try {
      // strip null/empty filter keys so the BE @RequestParam stays optional
      const params = Object.fromEntries(
        Object.entries(filter).filter(([, v]) => v !== null && v !== undefined && v !== "")
      );
      return await notificationApi.listTemplates(params);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load templates");
    }
  }
);

export const fetchTemplate = createAsyncThunk(
  "notificationAdmin/fetchTemplate",
  async (id, { rejectWithValue }) => {
    try {
      return await notificationApi.getTemplate(id);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to load template");
    }
  }
);

export const saveTemplate = createAsyncThunk(
  "notificationAdmin/saveTemplate",
  async (request, { rejectWithValue }) => {
    try {
      // 200/201 -> { templateId }; a 400 carries a ValidationResult body
      return await notificationApi.saveTemplate(request);
    } catch (error) {
      // validation failures come back as 400 with a ValidationResult body
      return rejectWithValue(error?.response?.data || { message: error?.message || "Failed to save template" });
    }
  }
);

export const validateTemplate = createAsyncThunk(
  "notificationAdmin/validateTemplate",
  async (request, { rejectWithValue }) => {
    try {
      // api.validateTemplate resolves on both 200 and 400 (validateStatus)
      return await notificationApi.validateTemplate(request);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to validate template");
    }
  }
);

export const previewTemplate = createAsyncThunk(
  "notificationAdmin/previewTemplate",
  async ({ id, entityId = null }, { rejectWithValue }) => {
    try {
      return await notificationApi.previewTemplate(id, entityId);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to preview template");
    }
  }
);

export const setTemplateActive = createAsyncThunk(
  "notificationAdmin/setTemplateActive",
  async ({ id, active }, { rejectWithValue }) => {
    try {
      return await notificationApi.setTemplateActive(id, active);
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to change template state");
    }
  }
);

/* ------------------------------------------------------------------ slice */

const notificationAdminSlice = createSlice({
  name: "notificationAdmin",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
    clearValidation: (state) => {
      state.validation = null;
      state.saveError = null;
    },
    clearPreview: (state) => {
      state.preview = null;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
      state.validation = null;
      state.preview = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.eventsLoading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.eventsLoading = false;
        state.events = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.eventsLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchCategoryFields.pending, (state) => { state.categoryFieldsLoading = true; })
      .addCase(fetchCategoryFields.fulfilled, (state, action) => {
        state.categoryFieldsLoading = false;
        state.categoryFields = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategoryFields.rejected, (state, action) => {
        state.categoryFieldsLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchCatalogFields.pending, (state) => { state.catalogLoading = true; })
      .addCase(fetchCatalogFields.fulfilled, (state, action) => {
        state.catalogLoading = false;
        state.catalogFields = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCatalogFields.rejected, (state, action) => {
        state.catalogLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(saveCatalogField.pending, (state) => { state.catalogSaving = true; })
      .addCase(saveCatalogField.fulfilled, (state) => { state.catalogSaving = false; })
      .addCase(saveCatalogField.rejected, (state, action) => {
        state.catalogSaving = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchTemplates.pending, (state) => { state.templatesLoading = true; })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templatesLoading = false;
        state.templates = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.templatesLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchTemplate.pending, (state) => {
        state.currentTemplateLoading = true;
        state.currentTemplate = null;
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.currentTemplateLoading = false;
        state.currentTemplate = action.payload || null;
      })
      .addCase(fetchTemplate.rejected, (state, action) => {
        state.currentTemplateLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(saveTemplate.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveTemplate.fulfilled, (state) => {
        state.saving = false;
        state.saveError = null;
        state.validation = null;
      })
      .addCase(saveTemplate.rejected, (state, action) => {
        state.saving = false;
        // ValidationResult body when the BE rejected on validation
        state.saveError = action.payload;
        if (action.payload?.errorCode) {
          state.validation = action.payload;
        }
      });

    builder
      .addCase(validateTemplate.pending, (state) => {
        state.validating = true;
        state.validation = null;
      })
      .addCase(validateTemplate.fulfilled, (state, action) => {
        state.validating = false;
        state.validation = action.payload || null;
      })
      .addCase(validateTemplate.rejected, (state, action) => {
        state.validating = false;
        state.error = action.payload;
      });

    builder
      .addCase(previewTemplate.pending, (state) => {
        state.previewing = true;
        state.preview = null;
      })
      .addCase(previewTemplate.fulfilled, (state, action) => {
        state.previewing = false;
        state.preview = action.payload || null;
      })
      .addCase(previewTemplate.rejected, (state, action) => {
        state.previewing = false;
        state.error = action.payload;
      });

    builder
      .addCase(setTemplateActive.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated?.templateId != null) {
          const idx = state.templates.findIndex((t) => t.templateId === updated.templateId);
          if (idx !== -1) state.templates[idx] = { ...state.templates[idx], ...updated };
        }
      })
      .addCase(setTemplateActive.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setFilter,
  resetFilter,
  clearValidation,
  clearPreview,
  clearCurrentTemplate,
} = notificationAdminSlice.actions;

/* -------------------------------------------------------------- selectors */

export const selectEvents = (state) => state.notificationAdmin.events;
export const selectEventsLoading = (state) => state.notificationAdmin.eventsLoading;
export const selectCategoryFields = (state) => state.notificationAdmin.categoryFields;
export const selectCategoryFieldsLoading = (state) => state.notificationAdmin.categoryFieldsLoading;
export const selectCatalogFields = (state) => state.notificationAdmin.catalogFields;
export const selectCatalogLoading = (state) => state.notificationAdmin.catalogLoading;
export const selectCatalogSaving = (state) => state.notificationAdmin.catalogSaving;
export const selectTemplates = (state) => state.notificationAdmin.templates;
export const selectTemplatesLoading = (state) => state.notificationAdmin.templatesLoading;
export const selectTemplateFilter = (state) => state.notificationAdmin.filter;
export const selectCurrentTemplate = (state) => state.notificationAdmin.currentTemplate;
export const selectCurrentTemplateLoading = (state) => state.notificationAdmin.currentTemplateLoading;
export const selectValidation = (state) => state.notificationAdmin.validation;
export const selectValidating = (state) => state.notificationAdmin.validating;
export const selectPreview = (state) => state.notificationAdmin.preview;
export const selectPreviewing = (state) => state.notificationAdmin.previewing;
export const selectSaving = (state) => state.notificationAdmin.saving;
export const selectSaveError = (state) => state.notificationAdmin.saveError;
export const selectAdminError = (state) => state.notificationAdmin.error;

export default notificationAdminSlice.reducer;
