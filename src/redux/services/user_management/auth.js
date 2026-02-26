import axios from "axios";
import { configApp } from "../../../constants/configApp";
import { tokenHeader } from "../../../utils/tokenHeader";

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
  localStorage.clear();
  window.sessionStorage.clear();
  return response.data;
};
const choosePosition = async (id) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/auth/choose-pos",
    { positionId: id },
    { headers: tokenHeader() }
  );
  // Preserve notification-related localStorage items before clearing
  const notificationUserId = localStorage.getItem("notification_userId");
  const notificationPositionId = localStorage.getItem("notification_positionId");
  localStorage.clear();
  window.sessionStorage.clear();
  // Restore notification-related items
  if (notificationUserId) localStorage.setItem("notification_userId", notificationUserId);
  if (notificationPositionId) localStorage.setItem("notification_positionId", notificationPositionId);
  return response.data;
};
const chooseEntity = async (id) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/auth/choose-entity",
    { entityId: id },
    { headers: tokenHeader() }
  );
  // Preserve notification-related localStorage items before clearing
  const notificationUserId = localStorage.getItem("notification_userId");
  const notificationPositionId = localStorage.getItem("notification_positionId");
  localStorage.clear();
  window.sessionStorage.clear();
  // Restore notification-related items
  if (notificationUserId) localStorage.setItem("notification_userId", notificationUserId);
  if (notificationPositionId) localStorage.setItem("notification_positionId", notificationPositionId);
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
  // const response = localStorage.clear() && window.sessionStorage.clear();
  // return response;
  localStorage.clear();
  window.sessionStorage.clear();
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
