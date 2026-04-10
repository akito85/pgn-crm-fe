import {
  downloadServiceAgreement,
  getListServiceAgreement,
} from "../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";

export const resolveVariantValue = (value, params) =>
  typeof value === "function" ? value(params) : value;

const mapServiceAgreementRows = (items = []) =>
  items.map((item, index) => ({
    ...item,
    key: `${item.id}-${index}`,
    saServiceType: item?.serviceType,
    termsOfPaymentName: item?.termOfPayment,
  }));

export const createServiceAgreementVariant = (config) => config;

export const accountServiceAgreementVariant = createServiceAgreementVariant({
  key: "account-standard",
  access: {
    grantedPath: "/account-management/account-standard/service-agreement",
    actionBasePath: "/account-management/account-standard/service-agreement/",
    excludedActionPaths: [
      "/account-management/account-standard/service-agreement/tos/",
      "/account-management/account-standard/service-agreement/warranty/",
    ],
  },
  routes: {
    createMain: ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_MAIN,
    detail: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
    update: ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT,
    createAddon: ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_ADDON,
    createAmendment:
      ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_AMANDEMEN,
  },
  stateBuilders: {
    createMain: ({ scope }) => ({
      idAccount: scope.idAccount,
      idCustomer: scope.idCustomer,
      type: scope.type,
      isMain: true,
      typeSa: "main",
      productTypeId: 245,
    }),
    detail: ({ record, scope }) => ({
      idSA: record.id,
      idAccount: scope.idAccount,
      idCustomer: scope.idCustomer,
      type: scope.type,
    }),
    update: ({ record, scope }) => ({
      idSa: record.id,
      idAccount: record.accountId,
      approvalStatus: record.approvalStatus,
      status: record.status,
      saType: record.saType?.value,
      isMain: record.isMain,
      saReferenceNumber: record.saReference,
      idCustomer: scope.idCustomer,
      type: scope.type,
    }),
    createAddon: ({ record, scope }) => ({
      saReferenceNumber: record.saNumber,
      serviceType: record.serviceType?.id,
      saType: record.saType?.id,
      pjbgType: record.pjbgType?.id,
      saDate: record.saDate,
      billingCycle: record.billingCycle?.id,
      startDate: record.startDate,
      endDate: record.endDate,
      termOfPayment: record.termOfPayment?.id,
      invoiceTemplate: record.invoiceTemplate?.id,
      typeSa: "addon",
      idAccount: scope.idAccount,
      idCustomer: scope.idCustomer,
      type: scope.type,
      isMain: false,
      productTypeId: 287,
      idSa: record.id,
    }),
    createAmendment: ({ record, scope }) => ({
      saReferenceNumber: record.saNumber,
      serviceType: record.serviceType?.id,
      saType: record.saType?.id,
      pjbgType: record.pjbgType?.id,
      saDate: record.saDate,
      billingCycle: record.billingCycle?.id,
      startDate: record.startDate,
      endDate: record.endDate,
      termOfPayment: record.termOfPayment?.id,
      invoiceTemplate: record.invoiceTemplate?.id,
      typeSa: "Amendment",
      idAccount: scope.idAccount,
      idCustomer: scope.idCustomer,
      type: scope.type,
      isMain: false,
      idSa: record.id,
    }),
  },
  list: {
    enabled: ({ scope }) => Boolean(scope.idAccount),
    fetchListActionCreator: getListServiceAgreement,
    buildListActionPayload: ({
      scope,
      encodedSearch,
      sort,
      page,
      pageSize,
      isLoadMore,
    }) => ({
      id: scope.idAccount,
      search: encodedSearch,
      sort,
      page,
      pageSize,
      isLoadMore,
    }),
    downloadActionCreator: downloadServiceAgreement,
    buildDownloadActionPayload: ({
      scope,
      page,
      pageSize,
      sort,
      search,
      inputFields,
    }) => ({
      body: {
        page,
        size: pageSize,
        sort,
        inputFields,
        searchs: search,
        idAccount: scope.idAccount,
        idCustomer: scope.idCustomer,
        type: scope.type,
      },
    }),
    mapRows: mapServiceAgreementRows,
  },
});
