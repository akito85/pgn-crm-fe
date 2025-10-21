import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import { errorCode, hasValue } from "../../utils";
import FileSaver from "file-saver";

const getPagination = async (url) => {
  try {
    const response = await axios.get(configApp.REPORT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateDataWithMethodPost = async (url, data) => {
  try {
    const response = await axios.post(configApp.REPORT_SERVICE + url, data, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadDataAdvanced = async (url, body) => {
  try {
    const response = await axios.post(configApp.REPORT_SERVICE + url, body, {
      headers: {
        ...tokenHeader(),
        "Content-Type": "application/json",
      },
      responseType: "blob",
    });
    if (hasValue(response.headers?.get("content-disposition"))) {
      const filename = response.headers
        .get("content-disposition")
        .split(";")
        .find((n) => n.includes("filename="))
        .replace("filename=", "")
        .trim();

      const blob = await response.data;

      // Download the file
      FileSaver.saveAs(blob, filename);
    } else {
      return response;
    }
  } catch (error) {
    throw error;
  }
};

const downloadDataPostMethod = async (url) => {
  try {
    const response = await axios.post(
      configApp.REPORT_SERVICE + url,
      {},
      {
        headers: tokenHeader(),
        responseType: "blob",
      },
    );
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

const reportHttpService = {
  getPagination,
  updateDataWithMethodPost,
  downloadDataAdvanced,
  downloadDataPostMethod,
};

export default reportHttpService;
