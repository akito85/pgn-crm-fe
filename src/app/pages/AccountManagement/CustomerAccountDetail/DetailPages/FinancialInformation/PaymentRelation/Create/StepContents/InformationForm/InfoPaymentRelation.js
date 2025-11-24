import { useState } from "react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { Form, Select, Button, Tooltip } from "antd";
import SVGIcon from "../../../../../../../../../../assets/Icon/index";

import InputComponent from "../../../../../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../../../../../components/Modal/ModalCustom";
import NxPanel from "../../../../../../../../../../components/Nx/NxPanel";
import NxTable from "../../../../../../../../../../components/Nx/NxTable";
import StatusComponent from "../../../../../../../../../../components/StatusComponent";
import { requiredMessage, toTitleCase } from "../../../../../../../../../../utils";

import moment from "moment";

export default function InfoPaymentRelation({
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
  const [paymentRelation, setPaymentRelation] = useState([])
  
  const navigate = useNavigate();

  const handleOk = () => {
    console.log("ok")
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY HH:mm:ss");
    }
    return "";
  };

  // Sanitize pagination values to prevent NaN
  // Modify
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : paymentRelation.length;
  const renderSimpleDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    }
    return "";
  };

  const columnMain = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => (sanitizedPage - 1) * sanitizedPageSize + index + 1,
    },
    {
      title: "SERVICE REQUEST NUMBER",
      dataIndex: "serviceRequestNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("serviceRequestNumber"),
    },
    {
      title: "SERVICE REQUEST REFERENCE",
      dataIndex: "serviceRequestReference",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("serviceRequestReference"),
      render: (reference) => (
        <span className="underline cursor-pointer text-blue-600">
          {reference || "-"}
        </span>
      ),
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
      dataIndex: "requestSource",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("requestSource"),
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
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Detail">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {
                    navigate("/account-management/account-standard/service-requests/details");
                    // handleDetail(r);
                    // setModalDetail(true);
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Update">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconEdit"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {
                    // Handle update action
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },

  ]

  return(
  <Fragment>
    <NxPanel title={"SERVICE INFORMATION"}>
      <div className="w-full grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <Form.Item
            key="serviceRequestReference"
            name={"serviceRequestReference"}
            label={"Service Request Reference"}
            className="no-margin-form"
          >
            <div className="flex gap-2 items-center">
              <InputComponent disabled className="flex-1" />
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
                  // Add your select logic here
                  setIsOpen(true)
                  console.log("Select button clicked");
                }}
              >
                Select
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            key="category"
            name={"category"}
            label={"Category"}
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
              options={[
                { value: 'technical', label: 'Technical' },
                { value: 'billing', label: 'Billing' },
                { value: 'customer_service', label: 'Customer Service' },
                { value: 'maintenance', label: 'Maintenance' },
                // Add more options as needed
              ]}
            />
          </Form.Item>

          <Form.Item
            key="priority"
            name={"priority"}
            label={"Priority"}
            rules={[
              {
                message: requiredMessage("Priority"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <Select
              placeholder="Select Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
          </Form.Item>

          <Form.Item
            key="costCenter"
            name={"costCenter"}
            label={"Cost Center"}
            rules={[
              {
                message: requiredMessage("Cost Center"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <InputComponent />
          </Form.Item>

          <Form.Item
            key="subCategory"
            name={"subCategory"}
            label={"Sub Category"}
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
              options={[
                { value: 'installation', label: 'Installation' },
                { value: 'repair', label: 'Repair' },
                { value: 'inspection', label: 'Inspection' },
                { value: 'replacement', label: 'Replacement' },
                // Add more options as needed
              ]}
            />
          </Form.Item>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <Form.Item
            key="requestSource"
            name={"requestSource"}
            label={"Request Source"}
            rules={[
              {
                message: requiredMessage("Request Source"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <Select
              placeholder="Select Request Source"
              options={[
                { value: 'phone', label: 'Phone' },
                { value: 'email', label: 'Email' },
                { value: 'web_portal', label: 'Web Portal' },
                { value: 'mobile_app', label: 'Mobile App' },
                { value: 'walk_in', label: 'Walk-in' },
              ]}
            />
          </Form.Item>

          <Form.Item
            key="type"
            name={"type"}
            label={"Type"}
            rules={[
              {
                message: requiredMessage("Type"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <Select
              placeholder="Select Type"
              options={[
                { value: 'service_request', label: 'Service Request' },
                { value: 'complaint', label: 'Complaint' },
                { value: 'inquiry', label: 'Inquiry' },
                { value: 'emergency', label: 'Emergency' },
              ]}
            />
          </Form.Item>

          <Form.Item
            key="channel"
            name={"channel"}
            label={"Channel"}
            rules={[
              {
                message: requiredMessage("Channel"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <Select
              placeholder="Select Channel"
              options={[
                { value: 'direct', label: 'Direct' },
                { value: 'partner', label: 'Partner' },
                { value: 'agent', label: 'Agent' },
                { value: 'online', label: 'Online' },
              ]}
            />
          </Form.Item>

          <Form.Item
            key="requestDate"
            name={"requestDate"}
            label={"Request Date"}
            rules={[
              {
                message: requiredMessage("Request Date"),
                required: true,
              },
            ]}
            className="no-margin-form"
          >
            <InputComponent />
          </Form.Item>
        </div>
      </div>

      {/* Description - Full Width */}
      <div className="w-full my-5">
        <Form.Item
          key="description"
          name={"description"}
          label={"Description"}
          className="no-margin-form"
        >
          <InputComponent
            type={"textarea"}
            rows={4}
            placeholder="Asset meter baru PGN"
            maxLength={255}
          />
        </Form.Item>
      </div>
    </NxPanel>

    <ModalCustom
      isOpen={isOpen}
      handleCancel={handleCancel}
      handleOk={handleOk}
      header={"CHOOSE SERVICE REQUEST REFERENCE"}
      width={1100}
      type={"custom"}
      footer={[
        <Button key="close" onClick={handleClose}>
          Close
        </Button>,
      ]}
    >
      <NxTable
        className="border-[0.5px] border-[#c8cdd4] border-solid "
        usePagination={true}
        useSelect={true}
        dataMain={ServiceRequest}
        columnMain={columnMain}
        tablePadding={"small"}
        fontSize={"small"}
      />

    </ModalCustom>
  </Fragment>
  )
}
