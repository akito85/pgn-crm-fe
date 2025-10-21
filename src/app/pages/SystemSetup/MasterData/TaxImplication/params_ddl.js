import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";

export const params = {
  services: accountManagementService,
  getCountry: "/v1/dbs/api/tax-implication/list-premise-country",
  getAccountCategory: "/v1/dbs/api/tax-implication/getAccountCategory",
  getSor: "/v1/dbs/api/tax-implication/list-sor",
  getCostCenterList: "/v1/dbs/api/tax-implication/list-cost-center",
  getAccountNumberList: "/v1/dbs/api/tax-implication/list-account-number",
  getClassificationTypeList:
    "/v1/dbs/api/tax-implication/list-classification-type",
  getAccountSegment: "/v1/dbs/api/tax-implication/list-account-segment",
  getSATypeList: "/v1/dbs/api/tax-implication/list-sa-type",
  getAccountTypeList: "/v1/dbs/api/tax-implication/list-account-type",
  getProvinceList: "/v1/dbs/api/tax-implication/list-premise-province/",
  getCityList: "/v1/dbs/api/tax-implication/list-premise-city/",
  getDistrictList: "/v1/dbs/api/tax-implication/list-premise-district/",
  getSubDistrictList: "/v1/dbs/api/tax-implication/list-premise-sub-district/",
  getAccountGroupList: "/v1/dbs/api/tax-implication/list-account-group-type/",
};
