import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const isNgrokUrl = (baseUrl) => {
  return baseUrl && baseUrl.includes('ngrok');
};

const buildHeaders = (baseUrl, additionalHeaders = {}) => {
  const headers = {
    ...tokenHeader(),
    ...additionalHeaders,
  };
  
  if (isNgrokUrl(baseUrl)) {
    headers['ngrok-skip-browser-warning'] = 'true';
  }
  
  return headers;
};

const getAll = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getPagination = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getDetail = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getDetailByIdBody = async (url, id, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.get(
      baseUrl + url,
      {
        params: { id: id },
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadData = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;

    const response = await axios.post(baseUrl + url, body, {
      headers: buildHeaders(baseUrl),
      responseType: "blob",
    });
    const contentDisposition = response.headers?.["content-disposition"];
    if (hasValue(contentDisposition)) {
      const filename = contentDisposition
        .split(";")
        .find((n) => n.includes("filename="))
        ?.replace("filename=", "")
        .trim();

      const blob = await response?.data;
      if (filename) {
        FileSaver.saveAs(blob, filename);
      }
    } else if (errorCode(response) === 204) {
      throw response;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const createData = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.post(
      baseUrl + url,
      body,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateData = async (url, data, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.put(
      baseUrl + url,
      data,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.delete(
      baseUrl + url,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithRemark = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.post(
      baseUrl + url,
      body,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const removePicture = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithOutRemark = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.post(baseUrl + url, {}, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithMethodGet = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithDelete = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.delete(
      baseUrl + url,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const uploadImage = async (url, data, onProgress, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.post(
      baseUrl + url,
      data,
      {
        headers: buildHeaders(baseUrl, { "Content-Type": "multipart/form-data" }),
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        },
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const terminateData = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.put(
      baseUrl + url,
      body,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const takeOver = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.USER_MANAGEMENT_SERVICE;
    
    const response = await axios.post(
      baseUrl + url,
      body,
      {
        headers: buildHeaders(baseUrl),
      }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const userHttpService = {
  getAll,
  getPagination,
  getDetail,
  downloadData,
  createData,
  updateData,
  deleteData,
  getDetailByIdBody,
  activationWithRemark,
  activationWithOutRemark,
  activationWithDelete,
  activationWithMethodGet,
  removePicture,
  uploadImage,
  terminateData,
  takeOver
};

export default userHttpService;