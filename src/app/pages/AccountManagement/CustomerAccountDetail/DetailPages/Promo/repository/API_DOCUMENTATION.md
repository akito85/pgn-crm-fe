# Promo Repository - API Integration Summary

## Overview
Repository untuk mengelola semua API calls terkait Promo di Account Management.

## Base Configuration
- **Base URL**: `configApp.MASTER_MANAGEMENT` 
- **API Path**: `/v1/dbs/api/product-promo`
- **Headers**: `tokenHeader()` - Auto inject Authorization token

## API Endpoints (41 Total)

### 1. Main CRUD Operations (5 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list-product-promo` | Get paginated promo list with filters |
| GET | `/detail/{id}` | Get promo detail by ID |
| POST | `/create-product-promo` | Create new promo |
| POST | `/update-product-promo` | Update existing promo |
| GET | `/download-filter` | Download filtered promo data (Excel) |

**Usage Example:**
```javascript
// Get promo list
const promos = await promoRepository.getPromoList({
  page: 1,
  size: 10,
  searchs: JSON.stringify({ name: "Summer" }),
  sort: "createdDate~desc"
});

// Get detail
const detail = await promoRepository.getPromoDetail(123);

// Create
const newPromo = await promoRepository.createPromo({
  name: "Summer Sale",
  type: 2356,
  category: 2359,
  startDate: "01 Jun 2025",
  endDate: "30 Jun 2025",
  // ... more fields
});

// Download
await promoRepository.downloadFilter(params); // Auto download file
```

### 2. Dropdown/Lookup Endpoints (27 endpoints)

#### General Dropdowns
- `getListCriteria()` - Get available criteria
- `getConditionOperator()` - Get condition operators
- `getConditionType()` - Get condition types
- `getConditionName()` - Get condition names
- `getPromoType()` - Get promo types
- `getPromoCategory()` - Get promo categories
- `getAdjustmentType()` - Get adjustment types
- `getListUom()` - Get unit of measurement
- `getFromItem()` - Get from-item options

#### Location Dropdowns (Cascading)
- `getProvince()` - Get all provinces
- `getCity(provinceId)` - Get cities by province
- `getDistrict(cityId)` - Get districts by city
- `getSubDistrict(districtId)` - Get sub-districts by district
- `getArea()` - Get cost center areas

#### Customer/Account Related
- `getCustomer()` - Get customer list
- `getCustomerSegment()` - Get customer segments
- `getGsizes()` - Get G-size options
- `getIndustrialSector()` - Get industrial sectors
- `getAccountClass()` - Get account classes
- `getAccountGroup(classId)` - Get account groups by class
- `getAccountCategory()` - Get account categories

#### Product/Service Related
- `getProduct()` - Get product list
- `getServiceType()` - Get service types
- `getSor()` - Get SOR (Source of Record)
- `getBudget()` - Get budget options

#### Tiering
- `getTiering(tieringId)` - Get tiering by ID
- `getTieringBulk(data)` - Get bulk tiering based on criteria

**Usage Example:**
```javascript
// Get all dropdowns at once for form
const dropdowns = await promoService.getFormDropdownData();

// Cascading location
const provinces = await promoRepository.getProvince();
const cities = await promoRepository.getCity(14); // Jakarta
const districts = await promoRepository.getDistrict(43);
const subDistricts = await promoRepository.getSubDistrict(46);

// Tiering bulk
const tiering = await promoRepository.getTieringBulk({
  customerSegment: 601,
  accountGroup: 89,
  isAllCriteria: false
});
```

### 3. Attachment Management (3 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/list-category` | Get attachment categories |
| POST | `/upload-attachment` | Upload attachment (multipart) |
| GET | `/list-attachment/{id}` | Get attachments for promo |

**Usage Example:**
```javascript
// Get categories
const categories = await promoRepository.getAttachmentCategory();

// Upload file
const formData = new FormData();
formData.append('files', file);
formData.append('refId', promoId);
formData.append('category', categoryId);
await promoRepository.uploadAttachment(formData);

// Get list
const attachments = await promoRepository.getAttachmentList(promoId);
```

### 4. Approval & Workflow (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/getApprovalHierList` | Get approval hierarchy list |
| GET | `/getApprovalHierHeaderById/{id}` | Get approval hierarchy detail |
| GET | `/approval-history/{id}` | Get approval history for promo |
| POST | `/approve-product-promo` | Approve/reject promo |
| POST | `/inactive-product-promo` | Submit promo for inactivation |
| POST | `/approve-inactive` | Approve/reject inactivation |

**Usage Example:**
```javascript
// Get approval hierarchy
const hierarchies = await promoRepository.getApprovalHierarchyList();
const detail = await promoRepository.getApprovalHierarchyDetail(64);

// Get history
const history = await promoRepository.getApprovalHistory(promoId);

// Approve promo
await promoRepository.approvePromo({
  id: 306,
  description: "Approved",
  approvalId: 9554,
  action: "APPROVE" // or "REJECT"
});

// Inactive promo
await promoRepository.inactivePromo({
  id: 66,
  remark: "No longer needed",
  appHierId: 534
});

// Approve inactive
await promoRepository.approveInactive({
  id: 66,
  description: "Approved for inactivation",
  approvalId: 6172,
  action: "APPROVE"
});
```

## Service Layer Integration

Service layer (`promoService.js`) menyediakan method yang lebih high-level:

```javascript
import { promoService } from './services';

// Get all dropdown data at once
const dropdowns = await promoService.getFormDropdownData();

// CRUD operations
const list = await promoService.getPromoList(params);
const detail = await promoService.getPromoDetail(id);
const created = await promoService.createPromo(data);
const updated = await promoService.updatePromo(data);

// Download
await promoService.downloadPromoData(params);

// Cascading dropdowns
const cities = await promoService.getCityByProvince(provinceId);
const districts = await promoService.getDistrictByCity(cityId);
const subDistricts = await promoService.getSubDistrictByDistrict(districtId);

// Approval
await promoService.approvePromo(data);
await promoService.inactivePromo(data);
await promoService.approveInactive(data);
```

## Request/Response Examples

### Create Promo Request
```json
{
  "id": null,
  "name": "Summer Sale 2025",
  "description": "Summer discount for all customers",
  "type": 2356,
  "category": 2359,
  "startDate": "01 Jun 2025",
  "endDate": "30 Jun 2025",
  "apphierId": 43,
  "action": "SUBMIT",
  "productPromoConditionDtos": [{
    "id": null,
    "name": "Discount Condition",
    "operator": "Less Than",
    "dataType": "Number",
    "adjustmentValue": 10000,
    "startDate": "01 Jun 2025",
    "endDate": "30 Jun 2025"
  }],
  "productPromoCriteriaDtos": [{
    "id": null,
    "idCriteria": "12",
    "idPromo": null
  }],
  "productPromoCriteriaDataDtos": [{
    "id": null,
    "customer": 122,
    "adjustmentType": 1,
    "adjustmentValue": 10,
    "unit": 1,
    "maxValue": 100000,
    "maxValueUnit": 1,
    "fromItem": null,
    "startDate": "01 Jun 2025",
    "endDate": "30 Jun 2025",
    "idPromo": null
  }]
}
```

### Approval Request
```json
{
  "id": 306,
  "description": "Approved by manager",
  "approvalId": 9554,
  "action": "APPROVE"
}
```

## Error Handling

Semua method menggunakan try-catch dan throw error ke caller:

```javascript
try {
  const data = await promoRepository.getPromoList(params);
  // Handle success
} catch (error) {
  // Error sudah di-log di repository
  // Handle error di component
  console.error('Failed to load promo:', error);
  notification.error({
    message: 'Error',
    description: error.message || 'Failed to load promo data'
  });
}
```

## Notes

1. **Authorization**: Semua request otomatis include Authorization header via `tokenHeader()`
2. **File Download**: Method download otomatis trigger browser download
3. **Base URL**: Menggunakan `configApp.MASTER_MANAGEMENT` dari constants
4. **Dummy Data**: Ada dummy data di comment untuk development tanpa backend
5. **Cascading Dropdowns**: Location dan Account Group menggunakan cascading (parent-child relationship)

## Next Steps

1. Integrate dengan Redux store via `promoSlice.js`
2. Create custom hooks di `usePromo.js` untuk component usage
3. Update constants dengan response data structure
4. Add utils untuk data transformation jika needed
5. Test dengan real API endpoints

## Related Files

- `repository/promoRepository.js` - All API calls
- `services/promoService.js` - Business logic layer
- `store/slices/promoSlice.js` - Redux state management
- `hooks/usePromo.js` - Custom React hooks
- `constants/promoConstants.js` - Constants & enums
- `utils/promoHelpers.js` - Helper functions
