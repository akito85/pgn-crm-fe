import axios from "axios";
import { configApp } from "../../../constants/configApp";
import { tokenHeader } from "../../../utils/tokenHeader";

// Clears localStorage + sessionStorage while preserving keys that should
// survive a logout or position-switch.  Preserves:
//   - nxnested__* table column preferences (per-user keys, safe to keep)
//   - notification_userId / notification_positionId (existing behaviour)
const PRESERVE_PREFIXES = ["nxnested__", "nxtable__"];
const PRESERVE_EXACT    = ["notification_userId", "notification_positionId"];

const clearStoragePreserving = () => {
  const saved = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k) continue;
    if (
      PRESERVE_EXACT.includes(k) ||
      PRESERVE_PREFIXES.some(p => k.startsWith(p))
    ) {
      saved.push([k, localStorage.getItem(k)]);
    }
  }
  localStorage.clear();
  window.sessionStorage.clear();
  saved.forEach(([k, v]) => localStorage.setItem(k, v));
};

const login = async (user, level) => {
  let url;
  if (level === "superuser") {
    url = "/v1/dbs/api/auth/login-su";
  } else {
    url = "/v1/dbs/api/auth/login";
  }
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + url,
    user
  );
  return response.data;
};

const logout = async () => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/auth/logout",
    null,
    { headers: tokenHeader() }
  );
  clearStoragePreserving();
  return response.data;
};
const choosePosition = async (id) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/auth/choose-pos",
    { positionId: id },
    { headers: tokenHeader() }
  );
  clearStoragePreserving();
  return response.data;
};
const chooseEntity = async (id) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/auth/choose-entity",
    { entityId: id },
    { headers: tokenHeader() }
  );
  clearStoragePreserving();
  return response.data;
};
const checkGrantedAccess = async (body) => {
  try {
    const response = await axios.post(
      configApp.USER_MANAGEMENT_SERVICE +
        "/v1/dbs/api/auth/check-granted-access",
      { pathUrl: body },
      { headers: tokenHeader() }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
const getAll = async () => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/auth/get-list-entity",
    { headers: tokenHeader() }
  );
  return response.data;
};

const injectLogout = async () => {
  clearStoragePreserving();
};
const authService = {
  getAll,
  login,
  logout,
  choosePosition,
  chooseEntity,
  injectLogout,
  checkGrantedAccess,
};

export default authService;
