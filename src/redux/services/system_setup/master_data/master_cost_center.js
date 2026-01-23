import axios from "axios";
import { configApp } from "../../../../constants/configApp";
import { tokenHeader } from "../../../../utils/tokenHeader";
import FileSaver from "file-saver";

const getAllCostCenter = async (page, pageSize) => {
  try {
    const response = await axios.get(
      configApp.USER_MANAGEMENT_SERVICE +
        `/v1/dbs/api/costcenter/paging?page=${page}&size=${pageSize}`,
      { headers: tokenHeader() }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const createCostCenter = async (body) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + `/v1/dbs/api/costcenter/`,
    body,
    { headers: tokenHeader() }
  );
  return response.data;
};

const updateCostCenter = async (body) => {
  const response = await axios.put(
    configApp.USER_MANAGEMENT_SERVICE + `/v1/dbs/api/costcenter/`,
    body,
    { headers: tokenHeader() }
  );
  return response.data;
};
const getParent = async () => {
  try {
    const response = await axios.get(
      configApp.USER_MANAGEMENT_SERVICE +
        `/v1/dbs/api/costcenter/getParentCostCenter`,
      { headers: tokenHeader() }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
const getType = async () => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/costcenter/getTypeCostCenter`,
    { headers: tokenHeader() }
  );
  return response.data;
};
const getSiblingByParent = async (id) => {
  try {
    const response = await axios.get(
      configApp.USER_MANAGEMENT_SERVICE +
        `/v1/dbs/api/costcenter/create/${id}/getSiblings`,
      { headers: tokenHeader() }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getHierarchy = async () => {
  try {
    const response = await axios.get(
      configApp.USER_MANAGEMENT_SERVICE + `/v1/dbs/api/costcenter/getHierarchy`,
      { headers: tokenHeader() }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const activateCostCenter = async (body) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/costcenter/inactive/active`,
    body,
    { headers: tokenHeader() }
  );
  return response?.data;
};

const getCostCenterDetail = async (id) => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/costcenter/${id}/getDetail`,
    { headers: tokenHeader() }
  );
  return response.data;
};

const getSiblingDetail = async (obj) => {
  try {
    const response = await axios.get(
      configApp.USER_MANAGEMENT_SERVICE +
        `/v1/dbs/api/costcenter/${obj.id}/getDetailSibling?search=&page=${obj.page}&size=${obj.pageSize}&sort=createdDate~asc`,
      { headers: tokenHeader() }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};
const deleteCostCenter = async (id) => {
  try {
    const response = await axios.delete(
      configApp.USER_MANAGEMENT_SERVICE + `/v1/dbs/api/costcenter/${id}/delete`,
      { headers: tokenHeader() }
    );
    return response?.data;
  } catch (error) {
    return error;
  }
};

const downloadMasterCostCenter = async () => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/costcenter/download",
    { headers: tokenHeader(), responseType: "blob" }
  );
  const filename = response.headers
    .get("content-disposition")
    .split(";")
    .find((n) => n.includes("filename="))
    .replace("filename=", "")
    .trim();
  const blob = await response.data;

  // Download the file
  FileSaver.saveAs(blob, filename);
};

const masterCostCenterService = {
  getAllCostCenter,
  activateCostCenter,
  getCostCenterDetail,
  getSiblingDetail,
  deleteCostCenter,
  getHierarchy,
  getParent,
  getType,
  getSiblingByParent,
  createCostCenter,
  updateCostCenter,
  downloadMasterCostCenter,
};

export default masterCostCenterService;
