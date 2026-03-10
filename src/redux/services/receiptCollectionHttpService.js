import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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
const getDetailByIdBody = async (url, id) => {
  try {
    const response = await axios.get(
      configApp.USER_MANAGEMENT_SERVICE + url,
      { id: id },
      { headers: tokenHeader() }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

// const downloadData = async (url) => {
//   try {
//     const response = await axios.get(configApp.PAYMENT_SERVICE + url, {
//       headers: tokenHeader(),
//       responseType: "blob",
//     });
//     const filename = response.headers
//       .get("content-disposition")
//       .split(";")
//       .find((n) => n.includes("filename="))
//       .replace("filename=", "")
//       .trim();

//     const blob = await response.data;
//     // Download the file
//     FileSaver.saveAs(blob, filename);
//   } catch (error) {
//     throw error;
//   }
// };

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
    const csrfToken = localStorage.getItem('csrfToken') || getCookie('XSRF-TOKEN');
    const response = await axios.post(configApp.PAYMENT_SERVICE + url, data, {
      headers: {
        ...tokenHeader(),
        "Content-Type": "multipart/form-data",
        "X-CSRF-Token": csrfToken,
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
    const response = await axios.delete(configApp.PAYMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const receiptCollectionHttpService = {
  getAll,
  inactiveWithApproval,
  getDetail,
  getPagination,
  createData,
  downloadData,
  getDetailByIdBody,
  activationWithRemark,
  uploadImage,
  activationWithRemarkPost,
  updateData,
  updateDataTransaction,
  updateDataPost,
  uploadBulk,
  deleteData
};

export default receiptCollectionHttpService;
