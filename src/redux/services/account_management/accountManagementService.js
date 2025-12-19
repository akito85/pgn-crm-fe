import axios from "axios";
import { configApp } from "../../../constants/configApp";
import { tokenHeader } from "../../../utils/tokenHeader";
import FileSaver from "file-saver";
import { errorCode, hasValue } from "../../../utils";

const getAll = async (url) => {
  try {
    const response = await axios.get(configApp.ACCOUNT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getPagination = async (url) => {
  try {
    const response = await axios.get(configApp.ACCOUNT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const getDetail = async (url) => {
  try {
    const response = await axios.get(configApp.ACCOUNT_SERVICE + url, {
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
      configApp.ACCOUNT_SERVICE + url,
      { id: id },
      { headers: tokenHeader() }
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};
const downloadData = async (url, options = {}) => {
  const { headers = {} } = options;
  try {
    const response = await axios.get(configApp.ACCOUNT_SERVICE + url, {
      headers: {
        ...headers,
        ...tokenHeader(),
      },
      responseType: "blob",
    });
    if(hasValue(response.headers?.get("content-disposition"))){
      const filename = response.headers
        .get("content-disposition")
        .split(";")
        .find((n) => n.includes("filename="))
        .replace("filename=", "")
        .trim();
    
      const blob = await response.data;
    
      // Download the file
      FileSaver.saveAs(blob, filename);
    }else if(errorCode(response) === 204){
      throw response
    }
      
    return response;
  } catch (error) {
    throw error;
  }
};

const createData = async (url, body) => {
  try {
    const response = await axios.post(configApp.ACCOUNT_SERVICE + url, body, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateData = async (url, data) => {
  try {
    const response = await axios.put(configApp.ACCOUNT_SERVICE + url, data, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const updateDataWithMethodPost = async (url, data, options = {}) => {
  const { headers = {} } = options;

  try {
    const response = await axios.post(configApp.ACCOUNT_SERVICE + url, data, {
      headers: {
        ...headers,
        ...tokenHeader(),
      }
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const deleteData = async (url) => {
  try {
    const response = await axios.delete(configApp.ACCOUNT_SERVICE + url, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithRemark = async (url, body, opt = {}) => {
  const headers = opt.headers;

  try {
    const response = await axios.post(configApp.ACCOUNT_SERVICE + url, body, {
      headers: {
        ...tokenHeader(),
        ...headers,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

const activationWithOutRemark = async (url, body) => {
  try {
    const response = await axios.post(configApp.ACCOUNT_SERVICE + url, body, {
      headers: tokenHeader(),
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

//upload attachment
const uploadAttachment = async (url, body) => {
  try {
    const response = await axios.post(configApp.ACCOUNT_SERVICE + url, body, {
      headers: { ...tokenHeader(), "Content-Type": "multipart/form-data" },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

//download advanced
const downloadDataAdvanced = async (url, body) => {
  try {
    const response = await axios.post(configApp.ACCOUNT_SERVICE + url, body, {
      headers: {
        ...tokenHeader(),
        'Content-Type': 'application/json',
      },
      responseType: "blob",
    });
    if(hasValue(response.headers?.get("content-disposition"))){
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
      return response
    }
  } catch (error) {
    throw error;
  }
};

const checkGrantedAccessAccount = async (body) => {
	try {
		const response = await axios.post(configApp.USER_MANAGEMENT_SERVICE + '/v1/dbs/api/auth/check-granted-access', { pathUrl: body }, { headers: tokenHeader() });
		return response.data;
	} catch (error) {
		throw error;
	}
}

const accountManagementService = {
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
  updateDataWithMethodPost,
  uploadAttachment,
  downloadDataAdvanced,
  checkGrantedAccessAccount
};

export default accountManagementService;
