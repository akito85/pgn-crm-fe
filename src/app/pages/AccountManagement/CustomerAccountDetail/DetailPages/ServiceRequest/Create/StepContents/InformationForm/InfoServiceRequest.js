import { useState, useEffect, useRef, useCallback, Fragment } from "react";

import { Form, Select, Button, Tooltip, Spin, Tag, Input } from "antd"; // Added Input import
import SVGIcon from "../../../../../../../../../assets/Icon/index";

import InputComponent from "../../../../../../../../../components/InputComponent";
import StatusComponent from "../../../../../../../../../components/StatusComponent";
import DateComponent from "../../../../../../../../../components/DateComponent";

import NxCardContainer from "../../../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../../components/Nx/NxTable";
import NxModal from "../../../../../../../../../components/Nx/NxModal";

import { requiredMessage, toTitleCase } from "../../../../../../../../../utils";
import accountManagementService from "../../../../../../../../../redux/services/account_management/accountManagementService";

import moment from "moment";

export default function InfoServiceRequest({
  account,
  customer,
  dropdowns,
  form,
  totalElement = 0,
  page = 1,
  pageSize = 10,
  searchText = "",
  searchedColumn = "",
  onSort = () => {},
  getColumnSearchProps = () => {},
  searchInput,
  handleSearch
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [serviceRequestRef, setServiceRequestRef] = useState("");

  // Infinite scroll state for service request reference modal
  const PAGE_SIZE_REF = 10;
  const [srRefData, setSrRefData] = useState([]);
  const [srRefPage, setSrRefPage] = useState(1);
  const [srRefHasMore, setSrRefHasMore] = useState(true);
  const [srRefLoading, setSrRefLoading] = useState(false);
  const srRefLoadingRef = useRef(false);
  // Debug: Log form values when they change
  useEffect(() => {
    const values = form?.getFieldsValue();
  }, [form]);

  // Create safe accessor functions that handle both array and { data: [] } formats
  const getDropdownItems = (dropdownKey) => {
    const dropdown = dropdowns?.[dropdownKey];
    if (!dropdown) return [];
    if (Array.isArray(dropdown)) return dropdown;
    if (Array.isArray(dropdown?.data)) return dropdown.data;
    return [];
  };

  const getDropdownOptions = (dropdownKey) => {
    return getDropdownItems(dropdownKey).map(item => ({
      value: item.glbTypeValId?.toString() || item.id?.toString(),
      label: item.name || item.glbTypeValName
    }));
  };

  const isDropdownLoaded = (dropdownKey) => {
    return getDropdownItems(dropdownKey).length > 0;
  };

  // Or use destructuring with defaults
  const {
    serviceRequestTypes = { data: [] },
    serviceRequestCategories = { data: [] },
    serviceRequestSubcategories = { data: [] },
    serviceRequestChannels = { data: [] },
    serviceRequestPriorities = { data: [] },
    serviceRequestSources = { data: [] }
  } = dropdowns || {};

  // Update handleOk to use the selected row
  const handleOk = () => {
    form.setFieldsValue({
      srr: selectedRow.requestNumber,
    });

    setIsOpen(false);
    // Reset selection when modal closes
    setSelectedRow(null);
    setSelectedRowKey(null);
  };

  const handleCancel = () => {
    setIsOpen(false);
    // Reset selection when modal closes
    setSelectedRow(null);
    setSelectedRowKey(null);
  }

  const handleClose = () => {
    setIsOpen(false);
    // Reset selection when modal closes
    setSelectedRow(null);
    setSelectedRowKey(null);
  }

  const handleDateChange = () => {

  }

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY HH:mm:ss");
    }
    return "";
  };

  const columnMain = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "SERVICE REQUEST NUMBER",
      dataIndex: "requestNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("requestNumber"),
      // render: (reference, record) => (
      //   <div
      //     className="flex items-center gap-2"
      //   >
      //     <span
      //       className="underline cursor-pointer text-blue-600"
      //       onClick={(e) => {
      //         e.stopPropagation();
      //         handleRowClick(record);
      //       }}
      //     >
      //       {reference || "-"}
      //     </span>
      //   </div>
      // ),
    },
    {
      title: "SERVICE REQUEST REFERENCE",
      dataIndex: "reference",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("reference"),
      // render: (reference, record) => (
      //   <span
      //     className="underline cursor-pointer text-blue-600"
      //     onClick={(e) => {
      //       e.stopPropagation();
      //       handleRowClick(record);
      //     }}
      //   >
      //     {reference || "-"}
      //   </span>
      // ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 160,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "SUB CATEGORY",
      dataIndex: "subCategory",
      width: 160,
      sorter: true,
      ...getColumnSearchProps("subCategory"),
    },
    {
      title: "CHANNEL",
      dataIndex: "channel",
      width: 140,
      sorter: true,
      ...getColumnSearchProps("channel"),
    },
    {
      title: "REQUEST SOURCE",
      dataIndex: "source",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("source"),
    },
    {
      title: "REQUEST DATE",
      dataIndex: "requestDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("requestDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "OPEN DATE",
      dataIndex: "openDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("openDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "RESOLVED DATE",
      dataIndex: "resolvedDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("resolvedDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "CLOSED DATE",
      dataIndex: "closedDate",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("closedDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "AGE (HOUR)",
      dataIndex: "age",
      width: 120,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("age"),
      render: (age) => age || "0",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 160,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("statusApproval"),
      render: (status) => {
        const colorMap = {
          "approved": "green",
          "waitingApproval": "orange",
          "pending": "orange",
          "rejected": "red"
        };
        const displayText = {
          "approved": "Approved",
          "waitingApproval": "Waiting Approval",
          "pending": "Pending",
          "rejected": "Rejected"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS PRE-REQUISITE",
      dataIndex: "statusPrerequisite",
      width: 180,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("statusPrerequisite"),
      render: (status) => {
        const colorMap = {
          "completed": "green",
          "pending": "red",
          "none": "blue"
        };
        const displayText = {
          "completed": "Completed",
          "pending": "Pending",
          "none": "None"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 140,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("status"),
      render: (status) => {
        const colorMap = {
          "inProgress": "blue",
          "onHold": "orange",
          "closed": "red",
          "canceled": "gray",
          "open": "green",
          "active": "green",
          "pending": "orange"
        };
        const displayText = {
          "inProgress": "In Progress",
          "onHold": "On Hold",
          "closed": "Closed",
          "canceled": "Canceled",
          "open": "Open"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={colorMap[status] || "gray"}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      key: "action",
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Select">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconActionCreate"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {
                    handleRowClick(r);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const accountId = account?.accountInformation?.accountId;

  const fetchServiceRequestRefs = useCallback(async (page) => {
    const url = `/v1/dbs/api/accounts/${accountId}/servicerequests/list?page=${page}&size=${PAGE_SIZE_REF}`;
    const response = await accountManagementService.getAll(url);
    // Response structure: { success, code, message, data: { result: [...], page: { totalElements } } }
    // Unwrap the nested data layer first, then handle both Spring Page and custom formats
    const responseData = response?.data ?? response;
    const items = (responseData?.content ?? responseData?.result ?? []).map((item, idx) => ({
      ...item,
      key: item.id ?? `${page}-${idx}`,
    }));
    const totalElements =
      responseData?.page?.totalElements ??
      responseData?.totalElements ??
      responseData?.totalElement ??
      0;
    const hasMore = page * PAGE_SIZE_REF < totalElements;
    return { items, hasMore };
  }, [accountId]);

  // Load first page when modal opens, reset on close
  useEffect(() => {
    if (isOpen) {
      setSrRefData([]);
      setSrRefPage(1);
      setSrRefHasMore(true);
      setSrRefLoading(true);
      srRefLoadingRef.current = false;
      fetchServiceRequestRefs(1).then(({ items, hasMore }) => {
        setSrRefData(items);
        setSrRefHasMore(hasMore);
        setSrRefLoading(false);
      });
    }
  }, [isOpen]);

  const handleLoadMoreSrRef = useCallback(() => {
    if (srRefLoadingRef.current || !srRefHasMore) return Promise.resolve();
    srRefLoadingRef.current = true;
    const nextPage = srRefPage + 1;
    return fetchServiceRequestRefs(nextPage).then(({ items, hasMore }) => {
      setSrRefData((prev) => [...prev, ...items]);
      setSrRefPage(nextPage);
      setSrRefHasMore(hasMore);
      srRefLoadingRef.current = false;
    });
  }, [srRefPage, srRefHasMore, fetchServiceRequestRefs]);

  // Handle row click — auto select & close modal (like PaymentRelation pattern)
  const handleRowClick = (record) => {
    form.setFieldsValue({ srr: record.requestNumber });
    setSelectedRow(record);
    setSelectedRowKey(record.key);
    setIsOpen(false);
  };

  const handleTableRowClick = (record, rowIndex, event) => {
    // Prevent click on action buttons
    const target = event.target;
    const shouldPrevent = ['button', 'a', 'svg', 'path', '.ant-btn', '.ant-btn-link', '.ant-btn-icon-only', '.action-button', '.ant-dropdown-trigger', '.anticon', '.ant-popconfirm', '.ant-popover', 'input', 'select', '.ant-select', '.ant-input', '.ant-checkbox', '.ant-radio', '.ant-switch']
      .some((selector) => {
        if (selector.startsWith('.')) {
          return target.closest(selector) !== null;
        } else {
          return target.tagName.toLowerCase() === selector.toLowerCase() ||
                 target.closest(selector) !== null;
        }
      });

    if (!shouldPrevent) {
      handleRowClick(record);
    }
  };

  return(
    <Fragment>
      <NxCardContainer header={"SERVICE REQUEST INFORMATION"}>
        <NxBaseContainer border>
        {/* Remove the wrapper Form component since form is passed as prop */}
        <div className="w-full grid grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="w-full gap-4 flex flex-row items-end">
              <Form.Item
                key="serviceRequestReference"
                name="srr"
                label="Service Request Reference"
                className="no-margin-form w-full"
              >
                  <InputComponent 
                    className="flex-1"
                  />
              </Form.Item>
              <Button
                type="primary"
                className="h-9 px-4 justify-center items-center"
                style={{
                  backgroundColor: "#0075bf",
                  borderColor: "#0075bf",
                  borderRadius: "5px",
                  minWidth: "112px",
                }}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                Select
              </Button>
            </div>

            <Form.Item
              key="category"
              name="category"
              label="Category"
              rules={[
                {
                  message: requiredMessage("Category"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Category"
                loading={!isDropdownLoaded('serviceRequestCategories')}
                options={getDropdownOptions('serviceRequestCategories')}
              />
            </Form.Item>

            <Form.Item
              key="priority"
              name="priority"
              label="Priority"
              rules={[
                {
                  message: requiredMessage("Priority"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Priorities"
                loading={!isDropdownLoaded('serviceRequestPriorities')}
                options={getDropdownOptions('serviceRequestPriorities')}
              />
            </Form.Item>
          </div>

          {/* Middle Column */}
          <div className="space-y-4">
            <Form.Item
              key="srFormAccountCostCenter"
              name="srFormAccountCostCenter"
              label="Cost Center"
              rules={[
                {
                  message: requiredMessage("Cost Center"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <InputComponent disabled={true} />
            </Form.Item>

            <Form.Item
              key="subCategory"
              name="subCategory"
              label="Sub Category"
              rules={[
                {
                  message: requiredMessage("Sub Category"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Sub Category"
                loading={!isDropdownLoaded('serviceRequestSubcategories')}
                options={getDropdownOptions('serviceRequestSubcategories')}
              />
            </Form.Item>

            <Form.Item
              key="requestSource"
              name="requestSource"
              label="Request Source"
              rules={[
                {
                  message: requiredMessage("Request Source"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Sources"
                loading={!isDropdownLoaded('serviceRequestSources')}
                options={getDropdownOptions('serviceRequestSources')}
              />
            </Form.Item>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <Form.Item
              key="type"
              name="type"
              label="Type"
              rules={[
                {
                  message: requiredMessage("Type"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Types"
                loading={!isDropdownLoaded('serviceRequestTypes')}
                options={getDropdownOptions('serviceRequestTypes')}
              />
            </Form.Item>

            <Form.Item
              key="channel"
              name="channel"
              label="Channel"
              rules={[
                {
                  message: requiredMessage("Channel"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <Select
                placeholder="Select Channels"
                loading={!isDropdownLoaded('serviceRequestChannels')}
                options={getDropdownOptions('serviceRequestChannels')}
              />
            </Form.Item>

            <Form.Item
              key="requestDate"
              name="requestDate"
              label="Request Date"
              rules={[
                {
                  message: requiredMessage("Request Date"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <DateComponent />
            </Form.Item>
          </div>
        </div>

        {/* Description - Full Width */}
        <div className="w-full my-5">
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
        </div>
        </NxBaseContainer>
      </NxCardContainer>

      <NxModal
        isOpen={isOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        title={"CHOOSE SERVICE REQUEST REFERENCE"}
        width={1100}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        <div className="p-4">
          <NxBaseContainer border>
            <NxTable
              idTable="sr-ref-table"
              usePagination={false}
              useInfiniteScroll={true}
              onLoadMore={handleLoadMoreSrRef}
              hasMore={srRefHasMore}
              useSelect={true}
              dataMain={srRefData}
              columnMain={columnMain}
              tablePadding="small"
              fontSize="small"
              loading={srRefLoading}
              tableScrolled={{ x: "max-content", y: 400 }}
              onRowClicked={handleTableRowClick}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </Fragment>
  )
}
