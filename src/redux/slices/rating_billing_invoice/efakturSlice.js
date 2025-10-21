import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  showModalSuccess,
  setBodyError,
  showModalError,
} from "../general_slice";

const DUMMY_EFAKTUR_DATA = [
  {
    id: 1,
    key: 1,
    noFaktur: "010.000-25.12345678",
    namaPelanggan: "PT Industri Maju",
    npwp: "12.345.678.9-012.000",
    alamat: "Jl. Industri Raya No. 123, Jakarta Barat 11220",
    tanggalFaktur: "28 Sep 2025",
    tanggalJatuhTempo: "28 Oct 2025",
    totalTagihan: 5500000,
    status: "SUCCESS",
    billingCode: "BC250800009001",
    ratingCode: "RC250800009001",
    calculationCode: "CLC250800000001",
    saNumber: "SA/BULOG/218939812",
    accountNumber: "ACC001",
    items: [
      {
        key: 1,
        productName: "Pemakaian Gas Industri",
        quantity: 500,
        unitPrice: 10000,
        total: 5000000,
      },
      {
        key: 2,
        productName: "Biaya Maintenance",
        quantity: 1,
        unitPrice: 500000,
        total: 500000,
      },
    ],
    dpp: 5500000,
    ppn: 605000,
    catatan: "",
    createdBy: "admin01",
    createdDate: "2025-09-28 10:00:00",
  },
  {
    id: 2,
    key: 2,
    noFaktur: "INV/DRAFT/102",
    namaPelanggan: "CV Rumah Tangga Sejahtera",
    npwp: "98.765.432.1-098.000",
    alamat: "Jl. Sejahtera No. 45, Jakarta Selatan 12345",
    tanggalFaktur: "28 Sep 2025",
    tanggalJatuhTempo: "28 Oct 2025",
    totalTagihan: 750000,
    status: "AWAITING APPROVAL",
    billingCode: "BC250800009003",
    ratingCode: "RC250800009001",
    calculationCode: "CLC250800000004",
    saNumber: "SA/BULOG/218939812",
    accountNumber: "ACC002",
    items: [
      {
        key: 1,
        productName: "Pemakaian Gas LPG",
        quantity: 50,
        unitPrice: 12000,
        total: 600000,
      },
      {
        key: 2,
        productName: "Biaya Admin",
        quantity: 1,
        unitPrice: 150000,
        total: 150000,
      },
    ],
    dpp: 750000,
    ppn: 82500,
    catatan: "",
    createdBy: "staff01",
    createdDate: "2025-09-28 10:05:00",
  },
  {
    id: 3,
    key: 3,
    noFaktur: "INV/DRAFT/101",
    namaPelanggan: "Pelanggan Gas Retail",
    npwp: "11.222.333.4-444.000",
    alamat: "Jl. Retail No. 1, Jakarta Timur 13450",
    tanggalFaktur: "27 Sep 2025",
    tanggalJatuhTempo: "27 Oct 2025",
    totalTagihan: 450000,
    status: "DRAFT",
    billingCode: "BC250800009005",
    ratingCode: "RC250800009003",
    calculationCode: "CLC250800000006",
    saNumber: "SA/RETAIL/000001",
    accountNumber: "ACC003",
    items: [
      {
        key: 1,
        productName: "Pemakaian Gas Retail",
        quantity: 30,
        unitPrice: 15000,
        total: 450000,
      },
    ],
    dpp: 450000,
    ppn: 49500,
    catatan: "",
    createdBy: "staff01",
    createdDate: "2025-09-27 09:00:00",
  },
  {
    id: 4,
    key: 4,
    noFaktur: "010.000-25.12345670",
    namaPelanggan: "PT Gas Sejati",
    npwp: "55.666.777.8-888.000",
    alamat: "Jl. Gas Sejati No. 88, Jakarta Utara 14250",
    tanggalFaktur: "26 Sep 2025",
    tanggalJatuhTempo: "26 Oct 2025",
    totalTagihan: 12300000,
    status: "FAILED",
    billingCode: "BC250800009007",
    ratingCode: "RC250800009004",
    calculationCode: "CLC250800000007",
    saNumber: "SA/N2N/000003",
    accountNumber: "ACC004",
    errorMessage: "Gagal mengirim ke DJP CoreTax: Connection timeout. Silakan gunakan proses manual.",
    errorCode: "DJP_CONNECTION_ERROR",
    items: [
      {
        key: 1,
        productName: "Pemakaian Gas Industri Besar",
        quantity: 1000,
        unitPrice: 12300,
        total: 12300000,
      },
    ],
    dpp: 12300000,
    ppn: 1353000,
    catatan: "",
    createdBy: "staff02",
    createdDate: "2025-09-26 08:00:00",
  },
];

const DUMMY_BILLING_DATA = [
  {
    id: 1,
    billingCode: "BILL-XYZ-123",
    customerName: "PT Industri Maju",
    npwp: "12.345.678.9-012.000",
    billingDate: "2025-09-30",
    totalAmount: 5000000,
    status: "Approved",
    items: [
      {
        productName: "Pemakaian Gas Industri",
        quantity: 500,
        unitPrice: 10000,
        total: 5000000,
      },
    ],
  },
  {
    id: 2,
    billingCode: "BILL-ABC-456",
    customerName: "PT Sejahtera Jaya",
    npwp: "98.765.432.1-098.000",
    billingDate: "2025-09-28",
    totalAmount: 3500000,
    status: "Approved",
    items: [
      {
        productName: "Pemakaian Gas Komersial",
        quantity: 300,
        unitPrice: 11000,
        total: 3300000,
      },
      {
        productName: "Biaya Admin",
        quantity: 1,
        unitPrice: 200000,
        total: 200000,
      },
    ],
  },
  {
    id: 3,
    billingCode: "BILL-DEF-789",
    customerName: "CV Maju Bersama",
    npwp: "11.222.333.4-444.000",
    billingDate: "2025-09-25",
    totalAmount: 2800000,
    status: "Approved",
    items: [
      {
        productName: "Pemakaian Gas LPG",
        quantity: 200,
        unitPrice: 12500,
        total: 2500000,
      },
      {
        productName: "Biaya Pengiriman",
        quantity: 1,
        unitPrice: 300000,
        total: 300000,
      },
    ],
  },
];

const initialState = {
  // List E-Faktur
  list_efaktur: DUMMY_EFAKTUR_DATA,
  list_billing: DUMMY_BILLING_DATA,
  
  // Detail E-Faktur
  detail_efaktur: null,
  
  // Loading states
  loading: false,
  loading_modal: false,
  loading_detail: false,
  
  // Pagination
  pagination: {
    totalElements: DUMMY_EFAKTUR_DATA.length,
    totalPages: 1,
    size: 10,
    number: 0,
  },
  
  // Log Aktivitas
  list_log_aktivitas: [],
  loading_log: false,
  
  // Approval History
  approval_history: null,
  loading_approval: false,
};

// Get List E-Faktur dengan Filter
export const getListEFaktur = createAsyncThunk(
  "GET_LIST_EFAKTUR",
  async ({ search, page, pageSize, sort, filters }, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...DUMMY_EFAKTUR_DATA];
      if (filters?.search) {
        filteredData = filteredData.filter(item =>
          item.noFaktur.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.namaPelanggan.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
    
      if (filters?.status) {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      
      if (filters?.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.tanggalFaktur);
          return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
        });
      }
      
      return {
        result: filteredData,
        page: {
          totalElements: filteredData.length,
          totalPages: Math.ceil(filteredData.length / pageSize),
          size: pageSize,
          number: page - 1,
        },
      };
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to fetch E-Faktur list: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get List Billing untuk Create E-Faktur
export const getListBilling = createAsyncThunk(
  "GET_LIST_BILLING",
  async (_, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return DUMMY_BILLING_DATA;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to fetch billing list: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Detail E-Faktur
export const getDetailEFaktur = createAsyncThunk(
  "GET_DETAIL_EFAKTUR",
  async (noFaktur, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const efaktur = DUMMY_EFAKTUR_DATA.find(item => item.noFaktur === noFaktur);
      
      if (!efaktur) {
        throw new Error("E-Faktur tidak ditemukan");
      }
      
      return efaktur;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to fetch E-Faktur detail: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Create E-Faktur
export const createEFaktur = createAsyncThunk(
  "CREATE_EFAKTUR",
  async ({ body }, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate nomor faktur
      const newId = DUMMY_EFAKTUR_DATA.length + 1;
      const noFaktur = `INV/DRAFT/${100 + newId}`;
      
      const newEFaktur = {
        id: newId,
        key: newId,
        noFaktur: noFaktur,
        namaPelanggan: body.pelanggan,
        npwp: "12.345.678.9-012.000",
        alamat: "Alamat Pelanggan",
        tanggalFaktur: body.tanggalFaktur,
        tanggalJatuhTempo: body.tanggalJatuhTempo,
        totalTagihan: body.totalTagihan,
        status: body.status === "draft" ? "DRAFT" : "AWAITING APPROVAL",
        billingCode: body.idBilling,
        ratingCode: "RC250800009999",
        calculationCode: "CLC250800000999",
        saNumber: "SA/NEW/000999",
        accountNumber: "ACC999",
        items: body.items,
        dpp: body.dpp,
        ppn: body.ppn,
        catatan: body.catatan || "",
        createdBy: "current_user",
        createdDate: new Date().toISOString(),
      };
      
      const successBody = {
        title: "Success",
        description: "E-Faktur berhasil dibuat!",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return newEFaktur;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to create E-Faktur: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Update E-Faktur Status
export const updateEFakturStatus = createAsyncThunk(
  "UPDATE_EFAKTUR_STATUS",
  async ({ noFaktur, status }, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const successBody = {
        title: "Success",
        description: `E-Faktur ${noFaktur} status berhasil diupdate menjadi ${status}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return { noFaktur, status };
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to update status: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Delete E-Faktur
export const deleteEFaktur = createAsyncThunk(
  "DELETE_EFAKTUR",
  async (noFaktur, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const successBody = {
        title: "Success",
        description: `E-Faktur ${noFaktur} berhasil dihapus`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return noFaktur;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to delete E-Faktur: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Approval E-Faktur (Approve/Reject)
export const approvalEFaktur = createAsyncThunk(
  "APPROVAL_EFAKTUR",
  async ({ body }, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const action = body.action === "APPROVE" ? "disetujui" : "ditolak";
      const newStatus = body.action === "APPROVE" ? "SUCCESS" : "REJECTED";
      
      const successBody = {
        title: "Success",
        description: `${body.eFakturCodes.length} E-Faktur berhasil ${action}`,
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return {
        eFakturCodes: body.eFakturCodes,
        action: body.action,
        status: newStatus,
        remark: body.remark,
        alasanDitolak: body.alasanDitolak,
      };
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to process approval: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Generate XML E-Faktur
export const generateXMLEFaktur = createAsyncThunk(
  "GENERATE_XML_EFAKTUR",
  async ({ noFaktur, xmlContent }, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const successBody = {
        title: "Success",
        description: "XML E-Faktur berhasil di-generate",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return { noFaktur, xmlContent };
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to generate XML: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Upload E-Faktur dari DJP
export const uploadEFakturDJP = createAsyncThunk(
  "UPLOAD_EFAKTUR_DJP",
  async (formData, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulasi response upload
      const uploadResult = {
        noFaktur: formData.get('noFaktur'),
        files: [
          {
            fileName: "efaktur_010.000-25.12345678.pdf",
            fileSize: "2.3 MB",
            fileType: "PDF",
            url: "https://storage.minio.example.com/efaktur/...",
            uploadedAt: new Date().toLocaleString("id-ID"),
          },
        ],
      };
      
      const successBody = {
        title: "Success",
        description: "File E-Faktur berhasil diupload ke Min.io storage",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return uploadResult;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to upload E-Faktur: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Get Log Aktivitas E-Faktur
export const getLogAktivitasEFaktur = createAsyncThunk(
  "GET_LOG_AKTIVITAS_EFAKTUR",
  async (noFaktur, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const logData = [
        {
          key: 1,
          waktu: "2025-09-28 11:00:00",
          pengguna: "supervisor01",
          aktivitas: "Menyetujui E-Faktur",
          catatan: "Data sudah sesuai.",
        },
        {
          key: 2,
          waktu: "2025-09-28 10:05:00",
          pengguna: "staff01",
          aktivitas: "Mengajukan Persetujuan",
          catatan: "-",
        },
        {
          key: 3,
          waktu: "2025-09-28 10:00:00",
          pengguna: "staff01",
          aktivitas: "Membuat E-Faktur",
          catatan: `Dibuat dari billing ID`,
        },
      ];
      
      return logData;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to fetch log aktivitas: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Buat Faktur Pengganti
export const buatFakturPengganti = createAsyncThunk(
  "BUAT_FAKTUR_PENGGANTI",
  async (body, thunkAPI) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const successBody = {
        title: "Success",
        description: "Faktur Pengganti berhasil dibuat",
        return: false,
      };
      thunkAPI.dispatch(showModalSuccess(successBody));
      
      return body;
    } catch (error) {
      const message = error?.message || error?.toString();
      const errorBody = {
        title: "Failed",
        description: `Failed to create Faktur Pengganti: ${message}`,
      };
      thunkAPI.dispatch(showModalError(errorBody));
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// ==================== SLICE ====================
const efakturSlice = createSlice({
  name: "efaktur",
  initialState,
  reducers: {
    // Reset state
    resetEFakturState: (state) => {
      state.detail_efaktur = null;
      state.list_log_aktivitas = [];
      state.approval_history = null;
    },
    // Clear detail
    clearDetailEFaktur: (state) => {
      state.detail_efaktur = null;
    },
  },
  extraReducers: {
    // Get List E-Faktur
    [getListEFaktur.pending]: (state) => {
      state.loading = true;
    },
    [getListEFaktur.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_efaktur = action.payload.result;
      state.pagination = action.payload.page;
    },
    [getListEFaktur.rejected]: (state) => {
      state.loading = false;
    },

    // Get List Billing
    [getListBilling.pending]: (state) => {
      state.loading = true;
    },
    [getListBilling.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_billing = action.payload;
    },
    [getListBilling.rejected]: (state) => {
      state.loading = false;
    },

    // Get Detail E-Faktur
    [getDetailEFaktur.pending]: (state) => {
      state.loading_detail = true;
    },
    [getDetailEFaktur.fulfilled]: (state, action) => {
      state.loading_detail = false;
      state.detail_efaktur = action.payload;
    },
    [getDetailEFaktur.rejected]: (state) => {
      state.loading_detail = false;
    },

    // Create E-Faktur
    [createEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [createEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;
      state.list_efaktur = [action.payload, ...state.list_efaktur];
      state.pagination.totalElements += 1;
    },
    [createEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // Update E-Faktur Status
    [updateEFakturStatus.pending]: (state) => {
      state.loading = true;
    },
    [updateEFakturStatus.fulfilled]: (state, action) => {
      state.loading = false;
      const { noFaktur, status } = action.payload;
      state.list_efaktur = state.list_efaktur.map(item =>
        item.noFaktur === noFaktur ? { ...item, status } : item
      );
      if (state.detail_efaktur?.noFaktur === noFaktur) {
        state.detail_efaktur.status = status;
      }
    },
    [updateEFakturStatus.rejected]: (state) => {
      state.loading = false;
    },

    // Delete E-Faktur
    [deleteEFaktur.pending]: (state) => {
      state.loading = true;
    },
    [deleteEFaktur.fulfilled]: (state, action) => {
      state.loading = false;
      state.list_efaktur = state.list_efaktur.filter(
        item => item.noFaktur !== action.payload
      );
      state.pagination.totalElements -= 1;
    },
    [deleteEFaktur.rejected]: (state) => {
      state.loading = false;
    },

    // Approval E-Faktur
    [approvalEFaktur.pending]: (state) => {
      state.loading_approval = true;
    },
    [approvalEFaktur.fulfilled]: (state, action) => {
      state.loading_approval = false;
      const { eFakturCodes, status } = action.payload;
      
      state.list_efaktur = state.list_efaktur.map(item => {
        const found = eFakturCodes.find(code => code.noFaktur === item.noFaktur);
        return found ? { ...item, status } : item;
      });
    },
    [approvalEFaktur.rejected]: (state) => {
      state.loading_approval = false;
    },

    // Generate XML
    [generateXMLEFaktur.pending]: (state) => {
      state.loading_modal = true;
    },
    [generateXMLEFaktur.fulfilled]: (state, action) => {
      state.loading_modal = false;
    },
    [generateXMLEFaktur.rejected]: (state) => {
      state.loading_modal = false;
    },

    // Upload E-Faktur DJP
    [uploadEFakturDJP.pending]: (state) => {
      state.loading_modal = true;
    },
    [uploadEFakturDJP.fulfilled]: (state, action) => {
      state.loading_modal = false;
      // Update status menjadi SUCCESS setelah upload
      const { noFaktur } = action.payload;
      state.list_efaktur = state.list_efaktur.map(item =>
        item.noFaktur === noFaktur ? { ...item, status: "SUCCESS" } : item
      );
    },
    [uploadEFakturDJP.rejected]: (state) => {
      state.loading_modal = false;
    },

    // Get Log Aktivitas
    [getLogAktivitasEFaktur.pending]: (state) => {
      state.loading_log = true;
    },
    [getLogAktivitasEFaktur.fulfilled]: (state, action) => {
      state.loading_log = false;
      state.list_log_aktivitas = action.payload;
    },
    [getLogAktivitasEFaktur.rejected]: (state) => {
      state.loading_log = false;
    },

    // Buat Faktur Pengganti
    [buatFakturPengganti.pending]: (state) => {
      state.loading_modal = true;
    },
    [buatFakturPengganti.fulfilled]: (state, action) => {
      state.loading_modal = false;
    },
    [buatFakturPengganti.rejected]: (state) => {
      state.loading_modal = false;
    },
  },
});

export const { resetEFakturState, clearDetailEFaktur } = efakturSlice.actions;

const { reducer } = efakturSlice;
export default reducer;