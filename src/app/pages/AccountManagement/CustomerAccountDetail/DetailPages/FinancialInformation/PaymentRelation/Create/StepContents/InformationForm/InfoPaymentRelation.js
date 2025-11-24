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
import DateComponent from "../../../../../../../../../../components/DateComponent";

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
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "identificationType",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("identificationType"),
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("customerIdentificationNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      width: 160,
      sorter: true,
      ...getColumnSearchProps("customerType"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "BIRTH/FOUNDED DATE",
      dataIndex: "birthFoundedDate",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("birthFoundedDate"),
      render: (date) => renderDate(date) || "-",
    },
    {
      title: "BIRTH/FOUNDED PLACE",
      dataIndex: "birthFoundedPlace",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("birthFoundedPlace"),
    },
    {
      title: "SEX",
      dataIndex: "sex",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("sex"),
    },
    {
      title: "MARITAL STATUS",
      dataIndex: "maritalStatus",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("maritalStatus"),
    },
    {
      title: "SEARCH KEY",
      dataIndex: "searchKey",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("searchKey"),
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
                  name="IconActionCreate"
                  color={"#0075bf"}
                  width={20}
                  onClick={() => {}}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ]

  const paymentRelationDummy = [
    {
      customerNumber: "CST009425",
      identificationType: "NPWP",
      customerIdentificationNumber: "9809149088941",
      customerName: "KERAMIK INTI",
      customerType: "Organization",
      description: "-",
      birthFoundedDate: "22-08-2022",
      birthFoundedPlace: "Jakarta",
      sex: "Male",
      maritalStatus: "Married",
      searchKey: "Keramik Inti Pusat",
    }
  ]

  return(
  <Fragment>
    <NxPanel title={"PAYMENT RELATION INFORMATION"} removeBottomMargin>
      <div className="w-full grid grid-cols-3 gap-4">
        <Form.Item
          key="accountNumber"
          name={"accountNumber"}
          label={"Account Number"}
          className="no-margin-form"
          rules={[
            {
              required: true,
            }
          ]}
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
          key="accountName"
          name={"accountName"}
          label={"Account Name"}
          className="no-margin-form"
        >
          <InputComponent disabled />
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
          <InputComponent />
        </Form.Item>

        <Form.Item
          key="startDate"
          name={"startDate"}
          label={"Start Date"}
          rules={[
            {
              message: requiredMessage("Start Date"),
              required: true,
            },
          ]}
          className="no-margin-form"
        >
          <DateComponent />
        </Form.Item>

        <Form.Item
          key="endDate"
          name={"endDate"}
          label={"End Date"}
          rules={[
            {
              message: requiredMessage("End Date"),
            },
          ]}
          className="no-margin-form"
        >
          <DateComponent />
        </Form.Item>
      </div>

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
        dataMain={paymentRelationDummy}
        columnMain={columnMain}
        tablePadding={"small"}
        fontSize={"small"}
      />

    </ModalCustom>
  </Fragment>
  )
}
