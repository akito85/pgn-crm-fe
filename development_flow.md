# Development Flow: Membuat Halaman Baru

> **Contoh Kasus:** `DebtAndCollection/Activities`

Panduan ini menjelaskan langkah-langkah lengkap untuk membuat halaman baru di project PGN Billing Frontend berdasarkan pola yang sudah ada.

---

## 📋 Struktur File yang Dibutuhkan

Untuk membuat satu modul halaman lengkap, Anda perlu membuat file-file berikut:

```
src/
├── app/pages/[Module]/[Feature]/
│   ├── View[Feature].js          # Halaman list/table
│   ├── Form[Feature].js          # Halaman create/update
│   ├── Detail[Feature].js        # Halaman detail
│   ├── Column[Feature].js        # Definisi kolom table
│   └── Column[SubFeature].js     # (opsional) Kolom untuk nested table
│
├── routes/[Module]/
│   ├── index.js                  # Export semua routes
│   ├── rc_routes.js              # Konstanta path URL
│   └── rc_elements.js            # Mapping component ke route
│
└── redux/slices/[module]/
    └── [feature].js              # Redux slice & API calls
```

---

## 🚀 Step-by-Step Development Flow

### **Step 1: Definisikan Routes**

#### 1.1 Buat Route Constants (`rc_routes.js`)

**Path:** `src/routes/DebtAndCollection/rc_routes.js`

```javascript
export const DEBT_AND_COLLECTION_ROUTES = {
  // Activities
  VIEW_ACTIVITIES: "/debt-and-collection/activities",
  CREATE_ACTIVITIES: "/debt-and-collection/activities/create",
  DETAIL_ACTIVITIES: "/debt-and-collection/activities/view",
  UPDATE_ACTIVITIES: "/debt-and-collection/activities/update",
};
```

**Pattern:**
- `VIEW_[FEATURE]` - List/table page
- `CREATE_[FEATURE]` - Create form
- `DETAIL_[FEATURE]` - Detail view
- `UPDATE_[FEATURE]` - Update form

---

#### 1.2 Buat Route Elements (`rc_elements.js`)

**Path:** `src/routes/DebtAndCollection/rc_elements.js`

```javascript
import ViewActivities from "../../app/pages/DebtAndCollection/Activities/ViewActivies";
import DetailActivities from "../../app/pages/DebtAndCollection/Activities/DetailActivies";
import FormActivities from "../../app/pages/DebtAndCollection/Activities/FormActivies";

export const DEBT_AND_COLLECTION_ELEMENTS = {
  // Activities
  VIEW_ACTIVITIES_PAGE: <ViewActivities />,
  DETAIL_ACTIVITIES_PAGE: <DetailActivities />,
  CREATE_ACTIVITIES_PAGE: <FormActivities type="create" />,
  UPDATE_ACTIVITIES_PAGE: <FormActivities type="update" />,
};
```

**Key Points:**
- Import komponen page
- Gunakan JSX element (bukan komponen langsung)
- Form component menggunakan prop `type` untuk membedakan create/update

---

#### 1.3 Register Routes (`index.js`)

**Path:** `src/routes/DebtAndCollection/index.js`

```javascript
import { DEBT_AND_COLLECTION_ROUTES } from "./rc_routes";
import { DEBT_AND_COLLECTION_ELEMENTS } from "./rc_elements";

export const debt_and_collection = [
  // Activities
  {
    path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES,
    element: DEBT_AND_COLLECTION_ELEMENTS.VIEW_ACTIVITIES_PAGE,
  },
  {
    path: DEBT_AND_COLLECTION_ROUTES.DETAIL_ACTIVITIES,
    element: DEBT_AND_COLLECTION_ELEMENTS.DETAIL_ACTIVITIES_PAGE,
  },
  {
    path: DEBT_AND_COLLECTION_ROUTES.CREATE_ACTIVITIES,
    element: DEBT_AND_COLLECTION_ELEMENTS.CREATE_ACTIVITIES_PAGE,
  },
  {
    path: DEBT_AND_COLLECTION_ROUTES.UPDATE_ACTIVITIES,
    element: DEBT_AND_COLLECTION_ELEMENTS.UPDATE_ACTIVITIES_PAGE,
  },
];
```

---

### **Step 2: Buat Redux Slice**

**Path:** `src/redux/slices/debt_and_collection/activities.js`

Redux slice berisi:
- State management
- Async thunks untuk API calls
- Reducers untuk update state

**Struktur Umum:**

```javascript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Endpoints
const API_BASE = "/api/debt-collection/activities";

// Async Thunks
export const getAllActivityByAccountNumePaginate = createAsyncThunk(
  "activities/getAllByAccount",
  async ({ accountNum, page, pageSize, search, sort }) => {
    const response = await axios.get(`${API_BASE}/account/${accountNum}`, {
      params: { page, pageSize, search, sort },
    });
    return response.data;
  }
);

export const getDetailActivity = createAsyncThunk(
  "activities/getDetail",
  async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  }
);

export const createUpdateActivity = createAsyncThunk(
  "activities/createUpdate",
  async (formData) => {
    const response = await axios.post(`${API_BASE}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
);

export const deleteActivity = createAsyncThunk(
  "activities/delete",
  async ({ id }) => {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  }
);

// Slice
const activitiesSlice = createSlice({
  name: "activities",
  initialState: {
    dataActivities: null,
    dataDetailActivities: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllActivityByAccountNumePaginate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllActivityByAccountNumePaginate.fulfilled, (state, action) => {
        state.loading = false;
        state.dataActivities = action.payload;
      })
      .addCase(getDetailActivity.fulfilled, (state, action) => {
        state.dataDetailActivities = action.payload;
      });
  },
});

export default activitiesSlice.reducer;
```

**Key Points:**
- Gunakan `createAsyncThunk` untuk API calls
- Handle loading states di `extraReducers`
- Gunakan `FormData` untuk file uploads

---

### **Step 3: Buat View Page (List/Table)**

**Path:** `src/app/pages/DebtAndCollection/Activities/ViewActivies.js`

**Komponen Utama:**

```javascript
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { getAllActivityByAccountNumePaginate } from "../../../../redux/slices/debt_and_collection/activities";

const ViewActivities = () => {
  const dispatch = useDispatch();
  const { dataActivities, loading } = useSelector((state) => state.activities);
  
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);

  useEffect(() => {
    dispatch(getAllActivityByAccountNumePaginate({
      accountNum: selectedAccountNum,
      page,
      pageSize,
      search: encodeURIComponent(JSON.stringify(search)),
      sort,
    }));
  }, [dispatch, page, pageSize]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <BaseContainer header={"Activities"}>
        <Toolbar items={itemsActionView()} />
        <TablePaginationNew
          dataSource={dataTable}
          totalData={totalElements}
          current={page}
          pageSize={pageSize}
          onChange={handleChangeSize}
          columns={columnsActivities()}
        />
      </BaseContainer>
    </LayoutMenu>
  );
};
```

**Fitur Penting:**
- Pagination
- Search & filter
- Sorting
- Action buttons (Create, Edit, Delete, Detail)

---

### **Step 4: Buat Form Page (Create/Update)**

**Path:** `src/app/pages/DebtAndCollection/Activities/FormActivies.js`

**Pattern:**

```javascript
const FormActivities = ({ type }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { dataDetailActivities, loading } = useSelector((state) => state.activities);
  
  // Load data untuk update
  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getDetailActivity(id));
    }
  }, [id]);

  // Set form values untuk update
  useEffect(() => {
    if (type === "update" && dataDetailActivities) {
      form.setFieldsValue({
        accountNum: dataDetailActivities?.accountNum,
        date: dayjs(dataDetailActivities?.date),
        // ... field lainnya
      });
    }
  }, [dataDetailActivities]);

  const onFinish = async (formValue) => {
    // Validasi dulu
    await dispatch(validateCreateUpdateActivity(formData)).unwrap();
    setOpenModal(true); // Show confirmation modal
  };

  const saveAction = async () => {
    // Submit setelah konfirmasi
    await dispatch(createUpdateActivity(formData)).unwrap();
    navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES);
  };

  return (
    <LayoutMenu>
      <Form form={form} onFinish={onFinish}>
        {/* Form fields */}
        <Form.Item name="accountNum" rules={formMessageRequired("accountNum")}>
          <Input />
        </Form.Item>
        
        {/* File upload */}
        <Form.Item 
          name="evidence" 
          valuePropName="fileList"
          getValueFromEvent={(e) => e?.fileList ?? []}
        >
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload Evidence</Button>
          </Upload>
        </Form.Item>

        <ButtonComponent htmlType="submit">Save</ButtonComponent>
      </Form>

      {/* Confirmation Modal */}
      <ModalCustom isOpen={openModal} handleCancel={handleCancel}>
        {/* Show summary */}
        <ButtonComponent onClick={saveAction}>Confirm</ButtonComponent>
      </ModalCustom>
    </LayoutMenu>
  );
};
```

**Key Points:**
- Satu komponen untuk create & update (gunakan prop `type`)
- Validasi sebelum submit (`validateCreateUpdateActivity`)
- Confirmation modal sebelum save
- File upload menggunakan `FormData`

---

### **Step 5: Buat Detail Page**

**Path:** `src/app/pages/DebtAndCollection/Activities/DetailActivies.js`

```javascript
const DetailActivities = () => {
  const dispatch = useDispatch();
  const { dataDetailActivities } = useSelector((state) => state.activities);
  const location = useLocation();
  const id = location?.state?.id;

  useEffect(() => {
    if (id) {
      dispatch(getDetailActivity(id));
    }
  }, [id]);

  return (
    <LayoutMenu>
      <BaseContainer header="Activity Detail">
        <DetailText label="Account Number">
          {dataDetailActivities?.accountNum}
        </DetailText>
        <DetailText label="Date">
          {dataDetailActivities?.date}
        </DetailText>
        {/* ... field lainnya */}
      </BaseContainer>
    </LayoutMenu>
  );
};
```

---

### **Step 6: Buat Column Definitions**

**Path:** `src/app/pages/DebtAndCollection/Activities/ColumnActivities.js`

```javascript
export const columnsActivities = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  dataUser
) => [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    width: 70,
    render: (text, record, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "Account Number",
    dataIndex: "accountNum",
    key: "accountNum",
    sorter: true,
    // Search filter config
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    sorter: true,
  },
  // ... kolom lainnya
];
```

---

## 🔄 Flow Diagram

```
User Action → View Page → Redux Thunk → API Call → Update State → Re-render
                ↓
          Click Create/Edit
                ↓
          Form Page → Fill Form → Validate → Confirmation Modal → Save → Back to View
```

---

## ✅ Checklist Development

- [ ] **Routes**
  - [ ] Tambahkan path di `rc_routes.js`
  - [ ] Tambahkan elements di `rc_elements.js`
  - [ ] Register di `index.js`

- [ ] **Redux Slice**
  - [ ] Buat async thunks (getAll, getDetail, create, update, delete)
  - [ ] Setup initial state
  - [ ] Handle loading & error states

- [ ] **Pages**
  - [ ] View page dengan table & pagination
  - [ ] Form page (create/update)
  - [ ] Detail page
  - [ ] Column definitions

- [ ] **Components**
  - [ ] Breadcrumb
  - [ ] Toolbar dengan action buttons
  - [ ] Confirmation modals
  - [ ] File upload (jika perlu)

---

## 🎯 Best Practices

### 1. **State Management**
- Gunakan Redux untuk data yang shared
- Local state untuk UI state (modal open/close, form values)

### 2. **API Calls**
- Selalu handle loading state
- Gunakan `unwrap()` untuk error handling
- Encode search params dengan `encodeURIComponent(JSON.stringify(search))`

### 3. **Form Handling**
- Validasi di frontend sebelum submit
- Gunakan confirmation modal
- Reset form setelah sukses submit

### 4. **File Upload**
- Gunakan `FormData` untuk multipart
- Set `beforeUpload={() => false}` untuk prevent auto upload
- Handle file di `getValueFromEvent`

### 5. **Navigation**
- Pass state via `navigate(path, { state: { id, accountNum } })`
- Access via `location.state`

### 6. **Permissions**
- Gunakan `useColumnActionPermission` untuk action buttons
- Check user permissions dari Redux state

---

## 📝 Contoh Lengkap: Activities Module

### File Structure
```
src/
├── app/pages/DebtAndCollection/Activities/
│   ├── ViewActivies.js          (764 lines)
│   ├── FormActivies.js          (664 lines)
│   ├── DetailActivies.js        (5779 bytes)
│   ├── ColumnActivities.js      (4505 bytes)
│   └── ColumnAccount.js         (2849 bytes)
│
├── routes/DebtAndCollection/
│   ├── index.js                 (141 lines)
│   ├── rc_routes.js             (50 lines)
│   └── rc_elements.js           (76 lines)
│
└── redux/slices/debt_and_collection/
    └── activities.js            (21812 bytes)
```

### Features Implemented
- ✅ Master-detail table (Account → Activities)
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ File upload (evidence)
- ✅ Bulk upload via Excel template
- ✅ Download evidence
- ✅ Pagination, search, sort
- ✅ Confirmation modals
- ✅ Tab navigation (Activity Information / Upload Activities)

---

## 🚨 Common Pitfalls

1. **Lupa encode search params** → API error
2. **Tidak handle loading state** → Bad UX
3. **File upload tanpa FormData** → Upload gagal
4. **Lupa dispatch action di useEffect** → Data tidak load
5. **Tidak validasi sebelum submit** → Data invalid masuk DB

---

## 📚 Referensi Component

- `LayoutMenu` - Main layout wrapper
- `BreadCrumb` - Navigation breadcrumb
- `BaseContainer` - Content container
- `TablePaginationNew` - Table dengan pagination
- `Toolbar` - Action buttons toolbar
- `ButtonComponent` - Custom button
- `SelectComponent` - Custom select
- `InputComponent` - Custom input
- `ModalCustom` - Custom modal
- `DetailText` - Label-value display

---

Dengan mengikuti flow ini, Anda dapat membuat halaman baru yang konsisten dengan pola yang sudah ada di project.
