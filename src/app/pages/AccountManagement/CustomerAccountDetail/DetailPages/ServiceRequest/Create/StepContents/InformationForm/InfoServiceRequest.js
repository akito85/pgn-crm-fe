import { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form, Select, Button } from "antd";

import InputComponent from "../../../../../../../../../components/InputComponent";
import DateComponent from "../../../../../../../../../components/DateComponent";

import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../components/Nx/NxModal";
import NxDetailText from "../../../../../../../../../components/Nx/NxDetailText";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";

import { requiredMessage } from "../../../../../../../../../utils";
import { getServiceRequests } from "../../../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import { getSrRefColumns } from "./getSrRefColumns";

export default function InfoServiceRequest({
  account,
  dropdowns,
  form,
  isUpdate,
  isDraft,
  formView = true
}) {
  const dispatch = useDispatch();
  const {
    list_serviceRequest: srRefs,
    pagination_listSr: pagination,
    loading_listSr: loading
  } = useSelector((state) => state.serviceRequest);

  const accountId = account?.accountInformation?.accountId;

  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(10);
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const serviceRequestReference = Form.useWatch(
    "serviceRequestReference",
    form
  );
  const type = Form.useWatch("type", form);
  const category = Form.useWatch("category", form);
  const subCategory = Form.useWatch("subCategory", form);
  const channel = Form.useWatch("channel", form);
  const priority = Form.useWatch("priority", form);
  const requestSource = Form.useWatch("requestSource", form);
  const requestDate = Form.useWatch("requestDate", form);
  const description = Form.useWatch("description", form);

  const onSort = (_, __, sortInfo) => {
    const dataSort = sortInfo.order
      ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return { ...prevState, [dataIndex]: selectedKeys[0] };
    });
  };

  // Initial load when modal opens; reset state on close
  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setSearch({});
      setSort("");
      const body = { page: 1, size: loadMoreSize, sort: "", searchs: {}, filters: [], filterRules: [] };
      dispatch(
        getServiceRequests({ idAccount: accountId, body, isLoadMore: false })
      );
    }
  }, [isOpen]);

  // Re-fetch on search/sort change (only when modal is open)
  useEffect(() => {
    if (!isOpen) return;
    const body = { page: 1, size: loadMoreSize, sort, searchs: search, filters: [], filterRules: [] };
    dispatch(
      getServiceRequests({ idAccount: accountId, body, isLoadMore: false })
    );
    setPage(1);
  }, [sort, search]);

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPage = pagination?.totalPage || 0;
    if (nextPage <= totalPage) {
      const body = {
        searchs: search,
        page: nextPage,
        size: loadMoreSize,
        sort,
        filters: [],
        filterRules: [],
      };
      await dispatch(
        getServiceRequests({ idAccount: accountId, body, isLoadMore: true })
      ).unwrap();
      setPage(nextPage);
    }
  };

  const setServiceRequestRef = (requestNumber) => {
    form.setFieldsValue({ serviceRequestReference: requestNumber });
  };

  const columnDefinitions = useMemo(
    () =>
      getSrRefColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        setServiceRequestRef,
        setIsOpen
      ),
    [search, searchInput, searchedColumn, searchText]
  );
  const columns = useMemo(() => [...columnDefinitions], [columnDefinitions]);

  const totalElement = pagination?.totalElement || 0;
  const hasMore = srRefs.length < totalElement;

  // Create safe accessor functions that handle both array and { data: [] } formats
  const getDropdownItems = (dropdownKey) => {
    const dropdown = dropdowns?.[dropdownKey];
    if (!dropdown) return [];
    if (Array.isArray(dropdown)) return dropdown;
    if (Array.isArray(dropdown?.data)) return dropdown.data;
    return [];
  };

  const getDropdownOptions = (dropdownKey) => {
    return getDropdownItems(dropdownKey).map((item) => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName
    }));
  };

  const isDropdownLoaded = (dropdownKey) => {
    return getDropdownItems(dropdownKey).length > 0;
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!formView) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full grid grid-cols-3 gap-4">
          <NxDetailText label="Service Request Reference">
            {serviceRequestReference}
          </NxDetailText>
          <NxDetailText label="Type">{type}</NxDetailText>
          <NxDetailText label="Category">{category}</NxDetailText>
          <NxDetailText label="Sub Category">{subCategory}</NxDetailText>
          <NxDetailText label="Channel">{channel}</NxDetailText>
          <NxDetailText label="Priority">{priority}</NxDetailText>
          <NxDetailText label="Request Source">{requestSource}</NxDetailText>
          <NxDetailText label="Request Date">
            {NxDate.formatDate(requestDate, "DD MMM YYYY")}
          </NxDetailText>
        </div>
        <div className="w-full">
          <NxDetailText label="Description">{description}</NxDetailText>
        </div>
      </div>
    );
  }

  return (
    <>
      <NxCardContainer header={"SERVICE REQUEST INFORMATION"}>
        <NxBaseContainer border>
          <div className="w-full grid grid-cols-3 gap-4">
            <Form.Item
              label={"Service Request Reference"}
              className="no-margin-form w-full"
            >
              <div className="flex gap-x-1">
                <Form.Item
                  key="serviceRequestReference"
                  name={"serviceRequestReference"}
                  rules={[
                    {
                      message: requiredMessage("Service Request Reference"),
                      required: true
                    }
                  ]}
                  noStyle
                >
                  <InputComponent disabled />
                </Form.Item>
                <Button
                  type="submit"
                  className="min-w-[120px]"
                  onClick={() => setIsOpen(true)}
                  disabled={!isDraft && isUpdate}
                >
                  Select
                </Button>
              </div>
            </Form.Item>
            <Form.Item
              key="type"
              name="type"
              label="Type"
              rules={[
                {
                  message: requiredMessage("Type"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Types"
                loading={!isDropdownLoaded("serviceRequestTypes")}
                options={getDropdownOptions("serviceRequestTypes")}
              />
            </Form.Item>
            <Form.Item
              key="category"
              name="category"
              label="Category"
              rules={[
                {
                  message: requiredMessage("Category"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Category"
                loading={!isDropdownLoaded("serviceRequestCategories")}
                options={getDropdownOptions("serviceRequestCategories")}
              />
            </Form.Item>
            <Form.Item
              key="subCategory"
              name="subCategory"
              label="Sub Category"
              rules={[
                {
                  message: requiredMessage("Sub Category"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Sub Category"
                loading={!isDropdownLoaded("serviceRequestSubcategories")}
                options={getDropdownOptions("serviceRequestSubcategories")}
              />
            </Form.Item>
            <Form.Item
              key="channel"
              name="channel"
              label="Channel"
              rules={[
                {
                  message: requiredMessage("Channel"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Channels"
                loading={!isDropdownLoaded("serviceRequestChannels")}
                options={getDropdownOptions("serviceRequestChannels")}
              />
            </Form.Item>
            <Form.Item
              key="priority"
              name="priority"
              label="Priority"
              rules={[
                {
                  message: requiredMessage("Priority"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Priorities"
                loading={!isDropdownLoaded("serviceRequestPriorities")}
                options={getDropdownOptions("serviceRequestPriorities")}
              />
            </Form.Item>
            <Form.Item
              key="requestSource"
              name="requestSource"
              label="Request Source"
              rules={[
                {
                  message: requiredMessage("Request Source"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Sources"
                loading={!isDropdownLoaded("serviceRequestSources")}
                options={getDropdownOptions("serviceRequestSources")}
              />
            </Form.Item>
            <Form.Item
              key="requestDate"
              name="requestDate"
              label="Request Date"
              rules={[
                {
                  message: requiredMessage("Request Date"),
                  required: true
                }
              ]}
              className="no-margin-form"
            >
              <DateComponent />
            </Form.Item>
          </div>
          <Form.Item
            key="description"
            name="description"
            label="Description"
            className="no-margin-form"
          >
            <InputComponent
              type="textarea"
              rows={4}
              placeholder="Asset meter baru PGN"
              maxLength={255}
            />
          </Form.Item>
        </NxBaseContainer>
      </NxCardContainer>

      <NxModal
        isOpen={isOpen}
        handleCancel={handleCancel}
        title={"CHOOSE SERVICE REQUEST REFERENCE"}
        width={1100}
        footer={[
          <div className="flex justify-end">
            <Button type="menu" key="close" onClick={handleClose}>
              Back
            </Button>
          </div>
        ]}
      >
        <div className="p-4">
          <NxBaseContainer border>
            <NxTable
              idTable="sr-ref-table"
              dataSource={srRefs}
              columns={columns}
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              tablePadding="small"
              fontSize="small"
              loading={loading}
              tableScrolled={{ x: "max-content", y: 400 }}
              onSort={onSort}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  );
}
