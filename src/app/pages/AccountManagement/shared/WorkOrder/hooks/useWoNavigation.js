import { useNavigate } from "react-router-dom";

// Static WO paths (RBAC-configured, no dynamic segments)
const WO_PATHS = {
  LIST:      "/account-management/work-orders",
  VIEW:      "/account-management/work-orders/view",
  CREATE:    "/account-management/work-orders/create",
  UPDATE:    "/account-management/work-orders/update",
  SR_VIEW:   "/account-management/account-standard/service-requests/work-orders/view",
  SR_CREATE: "/account-management/account-standard/service-requests/work-orders/create",
  SR_UPDATE: "/account-management/account-standard/service-requests/work-orders/update",
  SR_DETAIL: "/account-management/account-standard/service-requests/details",
};

/**
 * Context-aware navigation helpers for Work Order components.
 * Navigates to static paths (RBAC-safe) with woContext in navigation state.
 *
 * entryPoint → goBack target:
 *   standalone      → WO list
 *   account-detail  → WO list (accountId preserved in state)
 *   sr-under-account / sr-standalone → SR detail page (explicit, not navigate(-1))
 *   bad-debt        → navigate(-1) back to originating page
 */
const useWoNavigation = (woContext) => {
  const navigate = useNavigate();

  const isSr = woContext.entryPoint === "sr-under-account" ||
               woContext.entryPoint === "sr-standalone";

  const goToSrDetail = () => {
    navigate(WO_PATHS.SR_DETAIL, {
      state: {
        id: woContext.srId,
        idAccount: woContext.accountId,
        idCustomer: woContext.idCustomer,
        type: woContext.accountType || "standard",
      },
    });
  };

  const goBack = () => {
    switch (woContext.entryPoint) {
      case "bad-debt":
        return navigate(-1);
      case "sr-under-account":
      case "sr-standalone":
        return goToSrDetail();
      case "account-detail":
        return navigate(WO_PATHS.LIST, { state: { woContext } });
      default: // standalone
        return navigate(WO_PATHS.LIST, { state: { woContext } });
    }
  };

  const goToCreate = (overrides = {}) => {
    const path = isSr ? WO_PATHS.SR_CREATE : WO_PATHS.CREATE;
    navigate(path, {
      state: { woContext: { ...woContext, ...overrides } },
    });
  };

  const goToView = (woId) => {
    const path = isSr ? WO_PATHS.SR_VIEW : WO_PATHS.VIEW;
    navigate(path, {
      state: { woContext: { ...woContext, woId } },
    });
  };

  const goToUpdate = (woId) => {
    const path = isSr ? WO_PATHS.SR_UPDATE : WO_PATHS.UPDATE;
    navigate(path, {
      state: { woContext: { ...woContext, woId } },
    });
  };

  // goToList: for SR contexts goes back to SR detail (the embedded WO tab);
  // for WO-only contexts goes to the WO list.
  const goToList = () => {
    if (isSr) return goToSrDetail();
    navigate(WO_PATHS.LIST, { state: { woContext } });
  };

  return { goBack, goToCreate, goToView, goToUpdate, goToList };
};

export default useWoNavigation;
