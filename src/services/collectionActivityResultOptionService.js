// Use the existing configured HTTP service instead of raw axios
import debtAndCollectionHttpService from "../redux/services/debtAndCollectionHttpService";

const API_URL = '/v1/dbs/api/collection-activity/result-option';

// Based on the backend controller, getList uses @GetMapping but with @RequestBody.
// This is non-standard. We'll use a POST request as implemented in the http service.
const getList = (pagingRequest) => {
  // The httpService methods already prepend the base URL from config.
  // The original implementation of getList was incorrect because it used axios.post for a GET endpoint.
  // The correct implementation should match how other paginated lists are fetched.
  // We will assume a GET request with query parameters is the standard.
  // However, the backend is `getList(@Valid @RequestBody...)`, which is a POST.
  // We will use `createData` which maps to a POST request.
  return debtAndCollectionHttpService.createData(`${API_URL}/get-list`, pagingRequest);
};

const getById = (id) => {
  return debtAndCollectionHttpService.getDetail(`${API_URL}/${id}`);
};

const create = (data) => {
  return debtAndCollectionHttpService.createData(API_URL, data);
};

const update = (id, data) => {
  return debtAndCollectionHttpService.updateData(`${API_URL}/${id}`, data);
};

const remove = (id) => {
  return debtAndCollectionHttpService.deleteData(`${API_URL}/${id}`);
};

const CollectionActivityResultOptionService = {
  getList,
  getById,
  create,
  update,
  remove,
};

export default CollectionActivityResultOptionService;
