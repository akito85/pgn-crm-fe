import axios from "axios";
import { configApp } from "../../constants/configApp";
import { tokenHeader } from "../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../utils";

const isNgrokUrl = (baseUrl) => {
  return baseUrl && baseUrl.includes("ngrok");
};

const buildHeaders = (baseUrl, additionalHeaders = {}) => {
  const headers = {
    ...tokenHeader(),
    ...additionalHeaders,
  };

  if (isNgrokUrl(baseUrl)) {
    headers["ngrok-skip-browser-warning"] = "true";
  }

  return headers;
};

const getAll = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

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
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getListPagination = async (url, params, customBaseUrl) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      params: params,
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getDetail = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getDetailByIdBody = async (url, id) => {
  try {
    const baseUrl = configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(
      baseUrl + url,
      { id: id },
      { headers: buildHeaders(baseUrl) }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const getWithBody = async (url, body) => {
  try {
    const baseUrl = configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      data: body,
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadData = async (url, customBaseUrl) => {
  try {
    const response = await axios.get(configApp.RATING_BILLING_SERVICE + url, {
      headers: tokenHeader(),
      responseType: "blob",
    });
    if (hasValue(response.headers?.get("content-disposition"))) {
      const rawFilename = response.headers
        .get("content-disposition")
        .split(";")
        .find((n) => n.includes("filename="))
        .replace("filename=", "")
        .trim();

      // Remove quotes and trailing underscore
      const filename = rawFilename.replace(/['"]/g, "").replace(/_+$/, "");

      console.log("📥 [downloadData] Raw filename:", rawFilename);
      console.log("📥 [downloadData] Cleaned filename:", filename);

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

const downloadDataPrabill = async (url, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
      responseType: "arraybuffer",
    });

    const urlParams = new URLSearchParams(url.split("?")[1]);
    const searchParam = urlParams.get("search") || "download";

    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const filename = `prabill_data_${searchParam}_${timestamp}.xlsx`;

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (blob.size === 0) {
      throw new Error("Downloaded file is empty");
    }

    // Download file
    FileSaver.saveAs(blob, filename);

    return response;
  } catch (error) {
    console.error("Download error:", error);

    if (error.response) {
      console.error("Error response:", {
        status: error.response.status,
        statusText: error.response.statusText,
      });

      if (error.response.status === 204) {
        throw new Error("No data available for download");
      }
      if (error.response.status === 404) {
        throw new Error("File not found");
      }
    }

    throw error;
  }
};

const createData = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.post(baseUrl + url, body, {
      headers: buildHeaders(baseUrl),
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateData = async (url, data) => {
  try {
    const baseUrl = configApp.RATING_BILLING_SERVICE;

    const response = await axios.put(baseUrl + url, data, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (url) => {
  try {
    const baseUrl = configApp.RATING_BILLING_SERVICE;

    const response = await axios.delete(baseUrl + url, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithRemark = async (url, body, customBaseUrl = null) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.post(baseUrl + url, body, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationRemarkWithPut = async (url, body) => {
  try {
    const baseUrl = configApp.RATING_BILLING_SERVICE;

    const response = await axios.put(baseUrl + url, body, {
      headers: buildHeaders(baseUrl),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

//upload attachment
const uploadAttachment = async (url, body, onProgress, customBaseUrl) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.post(baseUrl + url, body, {
      headers: buildHeaders(baseUrl, { "Content-Type": "multipart/form-data" }),
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const downloadRtfFile = async (url, extension, nameFile, params) => {
  try {
    const baseUrl = configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      params: params,
      headers: buildHeaders(baseUrl),
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

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

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

const previewOrDownloadData = async (url, params, customBaseUrl) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      params: params,
      headers: buildHeaders(baseUrl),
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
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } else {
      FileSaver.saveAs(blob, filename);
    }
  } catch (error) {
    throw error;
  }
};

const downloadXlsx = async (
  url,
  fallbackFilename = "download",
  customBaseUrl
) => {
  try {
    const baseUrl = customBaseUrl || configApp.RATING_BILLING_SERVICE;

    const response = await axios.get(baseUrl + url, {
      headers: buildHeaders(baseUrl),
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    let filename = null;

    if (contentDisposition) {
      const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/i);
      if (utf8Match) {
        filename = decodeURIComponent(utf8Match[1]);
      } else {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
    }

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (blob.size === 0) {
      throw new Error("Downloaded file is empty");
    }

    FileSaver.saveAs(blob, filename);

    return response;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 204) {
        throw new Error("No data available for download");
      }
      if (error.response.status === 404) {
        throw new Error("File not found");
      }
    }

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
  downloadDataPrabill,
  uploadAttachment,
  activationRemarkWithPut,
  downloadRtfFile,
  previewOrDownloadData,
  downloadXlsx,
};

export default ratingBillingHttpService;
