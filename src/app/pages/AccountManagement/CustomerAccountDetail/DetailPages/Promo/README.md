# Promo Module

Module ini menggunakan arsitektur micro-frontend dengan struktur yang terorganisir untuk menghindari konflik dan memudahkan maintenance.

## Struktur Folder

```
Promo/
├── components/          # Komponen UI yang reusable
│   ├── ColoredPanel.js
│   ├── ContainerWithTab.js
│   ├── ExportButton.js
│   ├── FilterButton.js
│   ├── HeadersTabs.js
│   ├── HeaderText.js
│   ├── ModalCustomPromo.js
│   ├── ModalQueryCustom.js
│   └── TagStatus.js
│
├── repository/          # Data access layer - komunikasi dengan backend
│   ├── promoConditionRepository.js
│   ├── promoCriteriaRepository.js
│   ├── promoHistoryRepository.js
│   └── promoRepository.js
│
├── services/           # Business logic layer
│   ├── promoService.js    # Service untuk operasi promo
│   └── index.js           # Export semua services
│
├── store/              # State management dengan Redux
│   ├── slices/
│   │   └── promoSlice.js  # Redux slice untuk promo
│   └── index.js           # Combine reducers lokal
│
├── hooks/              # Custom React hooks
│   ├── usePromo.js        # Hook untuk operasi promo
│   └── index.js           # Export semua hooks
│
├── utils/              # Helper functions dan utilities
│   ├── promoHelpers.js    # Helper functions untuk promo
│   └── index.js           # Export semua utils
│
├── constants/          # Constants dan enums
│   ├── promoConstants.js  # Constants untuk promo
│   └── index.js           # Export semua constants
│
├── AccountPromo.js         # Main component
├── CriteriaAndCondition.js
├── HistoryLogInformation.js
└── README.md              # Dokumentasi module
```

## Cara Penggunaan

### 1. Repository Layer
Repository bertanggung jawab untuk komunikasi dengan backend API.

```javascript
import promoRepository from './repository/promoRepository';

// Contoh penggunaan
const data = await promoRepository.getPromoList(params);
```

### 2. Service Layer
Service berisi business logic dan menggunakan repository untuk fetch data.

```javascript
import { promoService } from './services';

// Contoh penggunaan
const promoList = await promoService.getPromoList(params);
const promoDetail = await promoService.getPromoDetail(promoId);
```

### 3. Redux Store
Store untuk state management menggunakan Redux Toolkit.

#### Integrasi dengan Main Store

Di file `src/redux/stores/store.js`, tambahkan:

```javascript
import { promoReducers } from '../app/pages/AccountManagement/CustomerAccountDetail/DetailPages/Promo/store';

const store = configureStore({
  reducer: {
    // ... reducers lain
    accountPromo: promoReducers,
  },
});
```

#### Dispatch Actions

```javascript
import { useDispatch } from 'react-redux';
import { fetchPromoList, setPromoFilters } from './store/slices/promoSlice';

const dispatch = useDispatch();

// Fetch data
dispatch(fetchPromoList({ page: 1, pageSize: 10 }));

// Update filters
dispatch(setPromoFilters({ status: 'ACTIVE' }));
```

#### Selectors

```javascript
import { useSelector } from 'react-redux';
import { selectPromoList } from './store/slices/promoSlice';

const promoList = useSelector(selectPromoList);
```

### 4. Custom Hooks
Hooks untuk simplify interaksi dengan Redux store.

```javascript
import { usePromo } from './hooks';

function PromoComponent() {
  const {
    promoList,
    promoDetail,
    loadPromoList,
    loadPromoDetail,
    updateFilters,
  } = usePromo();

  useEffect(() => {
    loadPromoList();
  }, []);

  return (
    // JSX
  );
}
```

### 5. Utils & Helpers

```javascript
import { formatPromoStatus, isPromoActive, formatDate } from './utils';

const statusInfo = formatPromoStatus('ACTIVE');
const isActive = isPromoActive(promoData);
const displayDate = formatDate(promo.startDate);
```

### 6. Constants

```javascript
import { PROMO_STATUS, PROMO_TYPE, DATE_FORMAT } from './constants';

if (promo.status === PROMO_STATUS.ACTIVE) {
  // Do something
}
```

## Best Practices

1. **Separation of Concerns**
   - Repository: Data access only
   - Service: Business logic
   - Store: State management
   - Components: UI rendering

2. **Naming Conventions**
   - Files: camelCase (promoService.js)
   - Components: PascalCase (PromoComponent.js)
   - Constants: UPPER_SNAKE_CASE (PROMO_STATUS)

3. **Import Order**
   ```javascript
   // 1. External libraries
   import React from 'react';
   import { useDispatch } from 'react-redux';
   
   // 2. Internal modules (absolute imports)
   import { Button } from 'components';
   
   // 3. Local modules (relative imports)
   import { usePromo } from './hooks';
   import { promoService } from './services';
   ```

4. **Error Handling**
   - Selalu gunakan try-catch di service layer
   - Handle error di Redux slice menggunakan rejected case
   - Show error message ke user menggunakan notification

5. **Testing**
   - Unit test untuk utils dan helpers
   - Integration test untuk services
   - Component test untuk UI components

## Migrasi dari Struktur Lama

Jika Anda memiliki kode lama yang perlu di-migrate:

1. Pindahkan repository functions ke folder `repository/`
2. Extract business logic dari components ke `services/`
3. Buat Redux slices di `store/slices/`
4. Pindahkan helper functions ke `utils/`
5. Extract constants dari components ke `constants/`
6. Buat custom hooks untuk common logic di `hooks/`

## Keuntungan Struktur Ini

1. **Minimal Conflict**: Setiap module memiliki store dan service sendiri
2. **Easy to Test**: Setiap layer dapat di-test secara terpisah
3. **Reusability**: Components, hooks, dan utils dapat di-reuse
4. **Maintainability**: Kode lebih organized dan mudah di-maintain
5. **Scalability**: Mudah untuk menambah fitur baru tanpa mengubah struktur yang ada

## Contoh Implementasi Lengkap

Lihat file `AccountPromo.js` untuk contoh implementasi lengkap yang menggunakan semua layer dalam struktur ini.
