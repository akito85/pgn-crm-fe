// useWoContext.js
import { useLocation } from "react-router-dom";

/**
 * Derives WO context from navigation state + pathname.
 *
 * All IDs (accountId, srId, woId) come from location.state.woContext — NOT URL params.
 * entryPoint is derived from state override first, then pathname pattern, then accountId presence.
 *
 * Pathname patterns for entryPoint fallback:
 *   /account-management/account-standard/service-requests/* → sr-under-account
 *   (other paths) + accountId in state                     → account-detail
 *   (other paths) no accountId in state                    → standalone
 *
 * Bad Debt override:
 *   navigate("/account-management/work-orders/create", {
 *     state: { woContext: { source: "BAD_DEBT", entryPoint: "bad-debt", sourceId: 123, ... } }
 *   })
 */
const useWoContext = () => {
  const location = useLocation();
  const stateCtx = location.state?.woContext || {};
  const pathname = location.pathname;

  const accountId = stateCtx.accountId || null;
  const srId = stateCtx.srId || null;
  const woId = stateCtx.woId || null;

  let entryPoint = stateCtx.entryPoint;
  if (!entryPoint) {
    if (pathname.includes("/service-requests/")) {
      entryPoint = "sr-under-account";
    } else if (accountId) {
      entryPoint = "account-detail";
    } else {
      entryPoint = "standalone";
    }
  }

  return {
    ...stateCtx,
    accountId,
    srId,
    woId,
    entryPoint,
    source: stateCtx.source || "MANUAL",
    sourceId: stateCtx.sourceId || null,
    sourceNumber: stateCtx.sourceNumber || null,
    isUpdate: pathname.includes("/update"),
  };
};

export default useWoContext;
