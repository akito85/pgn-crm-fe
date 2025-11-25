import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const get = async (url) => {
  try {
    const response = await axios.get(configApp.PAYMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

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

    const disposition = response.headers["content-disposition"];

    if (disposition) {
      const filename = disposition
        .split(";")
        .find((n) => n.includes("filename="))
        .replace("filename=", "")
        .replace(/"/g, "")
        .trim();

      const blob = response.data;
      FileSaver.saveAs(blob, filename);
    }

    return true; // 👉 return boleh serializable
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
const upload = async (url, data) => {
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

const getPaginationPost = async (url,body) => {
  try {
    const response = await axios.post(configApp.PAYMENT_SERVICE + url,body, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const debtAndCollectionHttpService = {
  get,
  getAll,
  inactiveWithApproval,
  getDetail,
  getPagination,
  createData,
  downloadData,
  activationWithRemark,
  upload,
  activationWithRemarkPost,
  updateData,
  updateDataTransaction,
  updateDataPost,
  uploadBulk,
  deleteData,
  getPaginationPost
};

export default debtAndCollectionHttpService;
