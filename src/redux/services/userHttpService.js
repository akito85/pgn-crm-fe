import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const getAll = async (url) => {
  try {
    const response = await axios.get(configApp.USER_MANAGEMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getPagination = async (url) => {
  try {
    const response = await axios.get(configApp.USER_MANAGEMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getDetail = async (url) => {
  try {
    const response = await axios.get(configApp.USER_MANAGEMENT_SERVICE + url, {
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
      { headers: tokenHeader() },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadData = async (url) => {
  try {
    const response = await axios.get(configApp.USER_MANAGEMENT_SERVICE + url, {
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
    const response = await axios.post(
      configApp.USER_MANAGEMENT_SERVICE + url,
      body,
      {
        headers: tokenHeader(),
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const updateData = async (url, data) => {
  try {
    const response = await axios.put(
      configApp.USER_MANAGEMENT_SERVICE + url,
      data,
      {
        headers: tokenHeader(),
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (url) => {
  try {
    const response = await axios.delete(
      configApp.USER_MANAGEMENT_SERVICE + url,
      {
        headers: tokenHeader(),
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithRemark = async (url, body) => {
  try {
    const response = await axios.post(
      configApp.USER_MANAGEMENT_SERVICE + url,
      body,
      {
        headers: tokenHeader(),
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const removePicture = async (url) => {
  try {
    const response = await axios.get(configApp.USER_MANAGEMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const activationWithOutRemark = async (url) => {
  try {
    const response = await axios.post(configApp.USER_MANAGEMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const activationWithMethodGet = async (url) => {
  try {
    const response = await axios.get(configApp.USER_MANAGEMENT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithDelete = async (url) => {
  try {
    const response = await axios.delete(
      configApp.USER_MANAGEMENT_SERVICE + url,
      {
        headers: tokenHeader(),
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const uploadImage = async (url, data, onProgress) => {
  try {
    const response = await axios.post(
      configApp.USER_MANAGEMENT_SERVICE + url,
      data,
      {
        headers: {
          ...tokenHeader(),
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted); // Callback to update progress
        },
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const terminateData = async (url, body) => {
  try {
    const response = await axios.put(
      configApp.USER_MANAGEMENT_SERVICE + url,
      body,
      {
        headers: tokenHeader(),
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const takeOver = async (url, body) => {
  try {
    const response = await axios.post(
      configApp.USER_MANAGEMENT_SERVICE + url,
      body,
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
  takeOver,
};

export default userHttpService;
