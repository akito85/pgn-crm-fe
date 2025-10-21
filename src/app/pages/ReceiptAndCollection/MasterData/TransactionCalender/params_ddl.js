import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";

export const params = {
  services: receiptCollectionHttpService,
  getBudgetList: "/v1/dbs/api/bank/account-budget/get",
  getProvinceList: "/v1/dbs/api/bank/account-province/get",
  getIndustrialSectorList: "/v1/dbs/api/bank/account-industrial-sector/get",
  getAccountCategoryList: "/v1/dbs/api/bank/account-category/get",
  getServiceTypeList: "/v1/dbs/api/bank/account-class/get",
  getSorList: "/v1/dbs/api/bank/account-sor/get",
  getCostCenterList: "/v1/dbs/api/bank/account-area/get",
  getGsizesList: "/v1/dbs/api/bank/account-gsizes/get",
  getCustomerSegment: "/v1/dbs/api/bank/account-customer-segment/get",
  getCustomer: "/v1/dbs/api/bank/account-customer/get",
  getCityList: "/v1/dbs/api/bank/account-city-get/",
  getDistrictList: "/v1/dbs/api/bank/account-district-get/",
  getSubDistrictList: "/v1/dbs/api/bank/account-subdistrict-get/",
  getAccountGroupTypeList: "/v1/dbs/api/bank/account-group-get/",
};
