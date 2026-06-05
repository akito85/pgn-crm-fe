import { useNavigate } from "react-router-dom";

/**
 * Builds context-aware navigation URLs based on entryPoint.
 * Each entry point has its own URL prefix for WO operations.
 */
const useWoNavigation = (woContext) => {
  const navigate = useNavigate();

  const getBaseUrl = () => {
    const { entryPoint, accountId, srId } = woContext;
    switch (entryPoint) {
      case "account-detail":
        return `/account-management/accounts/${accountId}/work-orders`;
      case "sr-under-account":
        return `/account-management/accounts/${accountId}/service-requests/${srId}/work-orders`;
      case "sr-standalone":
        return `/service-requests/${srId}/work-orders`;
      case "standalone":
      case "bad-debt":
      default:
        return "/work-orders";
    }
  };

  const goBack = () => {
    switch (woContext.entryPoint) {
      case "account-detail":
        return navigate(
          `/account-management/accounts/${woContext.accountId}/work-orders`
        );
      case "sr-under-account":
        return navigate(
          `/account-management/accounts/${woContext.accountId}/service-requests/${woContext.srId}`
        );
      case "sr-standalone":
        return navigate(`/service-requests/${woContext.srId}`);
      case "bad-debt":
        return navigate(-1);
      default:
        return navigate("/work-orders");
    }
  };

  const goToCreate = (overrides = {}) => {
    const base = getBaseUrl();
    navigate(`${base}/create`, {
      state: { woContext: { ...woContext, ...overrides } },
    });
  };

  const goToView = (woId) => {
    const base = getBaseUrl();
    navigate(`${base}/view/${woId}`, {
      state: { woContext },
    });
  };

  const goToUpdate = (woId) => {
    const base = getBaseUrl();
    navigate(`${base}/update/${woId}`, {
      state: { woContext },
    });
  };

  const goToList = () => {
    const base = getBaseUrl();
    navigate(base, { state: { woContext } });
  };

  return { goBack, goToCreate, goToView, goToUpdate, goToList };
};

export default useWoNavigation;
