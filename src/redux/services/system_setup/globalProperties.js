import axios from "axios";
import { configApp } from "../../../constants/configApp";
import { tokenHeader } from "../../../utils/tokenHeader";
import FileSaver from "file-saver";

const getAllGlobalPropertiesPaginate = async (
  searchParams,
  page,
  pageSize,
  sortParams
) => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/globalproperties/paging?searchs=${searchParams}&page=${page}&size=${pageSize}&sort=${sortParams}`,
    { headers: tokenHeader() }
  );
  return response?.data;
};

const getGlobalPropertiesDetail = async (id) => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/globalproperties/getDetail/${id}`,
    { headers: tokenHeader() }
  );
  return response?.data;
};

const getGlobalPropertiesDetailValue = async (body) => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/globalproperties/getDetailValue/${body.id}`,
    { headers: tokenHeader() }
  );
  return response?.data;
};

const inactiveGlobalProperties = async (id) => {
  const response = await axios.delete(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/globalproperties/inactive/detail/${id}`,
    { headers: tokenHeader() }
  );
  return response.data;
};

const deleteGlobalProperties = async (id) => {
  const response = await axios.delete(
    `${configApp.USER_MANAGEMENT_SERVICE}/v1/dbs/api/globalproperties/${id}/delete`,
    { headers: tokenHeader() }
  );
  console.log(id, " ini idnya");
  return response;
};

const createGlobalProperties = async (body) => {
  const response = await axios.post(
    configApp.USER_MANAGEMENT_SERVICE + `/v1/dbs/api/globalproperties/create`,
    body,
    { headers: tokenHeader() }
  );
  return response.data;
};

const updateGlobalProperties = async (body) => {
  const response = await axios.put(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/globalproperties/update",
    body,
    { headers: tokenHeader() }
  );
  return response.data;
};

const getAllTypeGlobalProperties = async () => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE + `/v1/dbs/api/globalproperties/type`,
    { headers: tokenHeader() }
  );
  return response?.data;
};

const getDataType = async () => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE +
      `/v1/dbs/api/globalproperties/data/type`,
    { headers: tokenHeader() }
  );
  return response?.data;
};

const downloadExcelGlobalProperties = async () => {
  const response = await axios.get(
    configApp.USER_MANAGEMENT_SERVICE + "/v1/dbs/api/globalproperties/download",
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

const gpService = {
  getAllGlobalPropertiesPaginate,
  getGlobalPropertiesDetail,
  getGlobalPropertiesDetailValue,
  inactiveGlobalProperties,
  deleteGlobalProperties,
  createGlobalProperties,
  updateGlobalProperties,
  getAllTypeGlobalProperties,
  getDataType,
  downloadExcelGlobalProperties,
};

export default gpService;
