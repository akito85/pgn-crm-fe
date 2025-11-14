import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const getAll = async (url) => {
  try {
    const response = await axios.get(configApp.PAYMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getPagination = async (url) => {
  try {
    const response = await axios.get(configApp.PAYMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getDetail = async (url) => {
  try {
    const response = await axios.get(configApp.PAYMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadData = async (url) => {
  try {
    const response = await axios.get(configApp.PAYMENT_SERVICE + url, {
      headers: tokenHeader(),
      responseType: "blob",
    });
    if (hasValue(response.headers?.get("content-disposition"))) {
      const filename = response.headers
        .get("content-disposition")
        .split(";")
        .find((n) => n.includes("filename="))
        .replace("filename=", "")
        .trim();

      const blob = await response?.data;
      FileSaver.saveAs(blob, filename);
    } else if (errorCode(response) === 204) {
      throw response;
    }
    return response;
  } catch (error) {
    throw error;
  }
};

const createData = async (url, body) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, body, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithRemark = async (url, body) => {
  try {
    const response = await axios.put(configApp.PAYMENT_SERVICE + url, body, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithRemarkPost = async (url, body) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, body, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const uploadImage = async (url, data) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, data, {
      headers: {
        ...tokenHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const uploadBulk = async (url, data, onProgress) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, data, {
      headers: {
        ...tokenHeader(),
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted); // Callback to update progress
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const inactiveWithApproval = async (url, data) => {
  try {
    const response = await axios.put(configApp.PAYMENT_SERVICE + url, data, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const updateData = async (url, data) => {
  try {
    const response = await axios.put(configApp.PAYMENT_SERVICE + url, data, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateDataPost = async (url, data) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, data, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateDataTransaction = async (url, data) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, data, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (url) => {
  try {
    const baseUrl = configApp.PAYMENT_SERVICE;

    const response = await axios.delete(baseUrl + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const debtAndCollectionHttpService = {
  getAll,
  inactiveWithApproval,
  getDetail,
  getPagination,
  createData,
  downloadData,
  activationWithRemark,
  uploadImage,
  activationWithRemarkPost,
  updateData,
  updateDataTransaction,
  updateDataPost,
  uploadBulk,
  deleteData,
};

export default debtAndCollectionHttpService;
