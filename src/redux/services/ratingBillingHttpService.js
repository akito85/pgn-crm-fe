import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const getAll = async (url) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getPagination = async (url) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getListPagination = async (url, params) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      params: params,
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getDetail = async (url) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
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
      configApp.RATING_BILLING_SERVICE + url,
      { id: id },
      { headers: tokenHeader() },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getWithBody = async (url, body) => {
  try {
    console.log(body, " getWith body");
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      data: body, // Use the data option to send a request body in a GET request
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const downloadData = async (url) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
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
      configApp.RATING_BILLING_SERVICE + url,
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
      configApp.RATING_BILLING_SERVICE + url,
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
      configApp.RATING_BILLING_SERVICE + url,
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
      configApp.RATING_BILLING_SERVICE + url,
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

const activationRemarkWithPut = async (url, body) => {
  try {
    const response = await axios.put(
      configApp.RATING_BILLING_SERVICE + url,
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

//upload attachment
const uploadAttachment = async (url, body, onProgress) => {
  try {
    const response = await axios.post(
      configApp.RATING_BILLING_SERVICE + url,
      body,
      {
        headers: { ...tokenHeader(), "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onProgress(percentCompleted);
        },
      },
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadRtfFile = async (url, extension, nameFile, params) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      params: params,
      headers: tokenHeader(),
      responseType: extension === "pdf" ? "blob" : "arraybuffer",
    });

    const getFilenameFromResponse = (response, filename) => {
      const contentDisposition = response.headers["content-disposition"];
      const match =
        contentDisposition && contentDisposition.match(/filename="(.+)"/);
      return match ? match[1] : filename;
    };

    const downloadBlobAsFile = (blob, filename) => {
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const openBlobInNewTab = (blob) => {
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    };

    const filename = getFilenameFromResponse(response, nameFile);

    // Create a Blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    // Conditional logic based on file extension
    if (extension === "pdf") {
      openBlobInNewTab(blob);
    } else if (extension === "rtf") {
      downloadBlobAsFile(blob, filename);
    } else {
      throw new Error("Unsupported file extension");
    }
  } catch (error) {
    throw error;
  }
};

const previewOrDownloadData = async (url, params) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      params: params,
      headers: tokenHeader(),
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition
          .split(";")
          .find((n) => n.includes("filename="))
          .replace("filename=", "")
          .trim()
      : "downloaded_file";

    const fileType = response.headers["content-type"];
    const blob = response.data;

    if (fileType === "application/pdf") {
      // Preview the PDF file in a new tab
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } else {
      // Download the file
      FileSaver.saveAs(blob, filename);
    }
  } catch (error) {
    throw error;
  }
};

const ratingBillingHttpService = {
  getAll,
  getDetail,
  getDetailByIdBody,
  getPagination,
  createData,
  updateData,
  activationWithRemark,
  deleteData,
  getWithBody,
  getListPagination,
  downloadData,
  uploadAttachment,
  activationRemarkWithPut,
  downloadRtfFile,
  previewOrDownloadData,
};

export default ratingBillingHttpService;
