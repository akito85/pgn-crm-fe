import { useLocation, useNavigate } from "react-router-dom";

import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";

import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import WarrantyTermDetailContent from "./WarrantyTermDetailContent";

const breadcrumbRoutes = (item) => [
  { path: "", breadcrumbName: "Account Management" },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
    breadcrumbName: "Account - Standard",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
    breadcrumbName: "Detail Account",
    state: { idAccount: item.idAccount },
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
    breadcrumbName: "Detail Service Agreement",
    state: {
      idSA: item.idSA,
      idAccount: item.idAccount,
      idCustomer: item.idCustomer,
      type: item.type,
    },
  },
  { path: "", breadcrumbName: "Detail Warranty Term" },
];

const DetailWarrantyTerm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { id, idSA, idAccount, idCustomer, type } = location?.state || {};

  return (
    <>
      <BreadCrumbAdvanced
        routes={breadcrumbRoutes({ idAccount, idCustomer, type, idSA })}
      />
      <WarrantyTermDetailContent
        id={id}
        idSA={idSA}
        idAccount={idAccount}
        idCustomer={idCustomer}
        type={type}
        false
        showBackButton
        onBack={() => navigate(-1)}
      />
    </>
  );
};

export default DetailWarrantyTerm;
