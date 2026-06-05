// useWoContext.js
import { useParams, useLocation } from "react-router-dom";

/**
 * Derives WO context from URL params + optional navigation state overrides.
 *
 * URL pattern → entryPoint + source:
 *   /account-management/accounts/:accountId/service-requests/:srId/work-orders/* → sr-under-account, SERVICE_REQUEST
 *   /account-management/accounts/:accountId/work-orders/*                        → account-detail, MANUAL
 *   /service-requests/:srId/work-orders/*                                        → sr-standalone, SERVICE_REQUEST
 *   /work-orders/*                                                               → standalone, MANUAL
 *
 * Navigation state overrides (e.g. from Bad Debt):
 *   navigate("/work-orders/create", { state: { woContext: { source: "BAD_DEBT", sourceId: 123, ... } } })
 */
const useWoContext = () => {
  const { accountId, srId, woId } = useParams();
  const location = useLocation();
  const stateOverrides = location.state?.woContext || {};

  const pathname = location.pathname;
  let entryPoint, source;

  if (
    pathname.startsWith("/account-management") &&
    pathname.includes("/service-requests/")
  ) {
    entryPoint = "sr-under-account";
    source = "SERVICE_REQUEST";
  } else if (pathname.startsWith("/account-management")) {
    entryPoint = "account-detail";
    source = "MANUAL";
  } else if (pathname.startsWith("/service-requests/")) {
    entryPoint = "sr-standalone";
    source = "SERVICE_REQUEST";
  } else {
    entryPoint = "standalone";
    source = "MANUAL";
  }

  return {
    accountId: accountId ? Number(accountId) : null,
    srId: srId ? Number(srId) : null,
    woId: woId ? Number(woId) : null,
    entryPoint,
    source,
    sourceId: null,
    sourceNumber: null,
    isUpdate: pathname.includes("/update"),
    ...stateOverrides,
  };
};

export default useWoContext;
