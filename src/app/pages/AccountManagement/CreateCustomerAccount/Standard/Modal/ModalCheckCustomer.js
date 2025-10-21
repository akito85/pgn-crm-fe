import React, { useRef, useState, useEffect } from "react";
import { Alert, DatePicker, Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";
import TablePagination from "../../../../../../components/TablePagination";
import StatusComponent from "../../../../../../components/StatusComponent";

const ModalCheckCustomer = ({
  data,
  dataTable = [],
  isOpen,
  handleCancel = () => {},
  handleConfirm = () => {},
  message = "Customer Identification Number has registered, please check customer information below! Are you sure want to continue create account for this customer?",
}) => {
  // Selector

  // Declaration
  const searchInput = useRef(null);
  const dataSource = dataTable || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");

  // Use Effect
  useEffect(() => {
    if (dataSource.length > 0) {
      setTotalElement(dataSource.length);
    }
  }, [dataSource]);

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      width: 50,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      sorter: true,
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      ...getColumnSearchProps("accountNumber"),
    },
    {
      sorter: true,
      title: "ACCOUNT REGISTRATION NUMBER",
      dataIndex: "registrationNumber",
      ...getColumnSearchProps("registrationNumber"),
    },
    {
      sorter: true,
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      ...getColumnSearchProps("accountName"),
    },
    {
      sorter: true,
      title: "SOR",
      dataIndex: "sor",
      ...getColumnSearchProps("sor"),
    },
    {
      sorter: true,
      title: "COST CENTER",
      dataIndex: "costCenter",
      ...getColumnSearchProps("costCenter"),
    },
    {
      sorter: true,
      title: "METER READING CODE",
      dataIndex: "meterReadingCode",
      ...getColumnSearchProps("meterReadingCode"),
    },
    {
      sorter: true,
      title: "SEGMENT",
      dataIndex: "accountSegment",
      ...getColumnSearchProps("accountSegment"),
    },
    {
      sorter: true,
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      ...getColumnSearchProps("accountGroupType"),
    },
    {
      sorter: true,
      title: "CATEGORY",
      dataIndex: "accountCategory",
      ...getColumnSearchProps("accountCategory"),
    },
    {
      sorter: true,
      title: "CLASSIFICATION TYPE",
      dataIndex: "accountRuleId",
      ...getColumnSearchProps("accountRuleId"),
    },
    {
      sorter: true,
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      ...getColumnSearchProps("accountType"),
    },
    {
      sorter: true,
      title: "INDUSTRIAL SECTOR",
      dataIndex: "industrialSector",
      ...getColumnSearchProps("industrialSector"),
    },
    {
      sorter: true,
      title: "BUDGET YEAR",
      dataIndex: "budgetYear",
      ...getColumnSearchProps("budgetYear"),
    },
    {
      sorter: true,
      title: "TERITORY",
      dataIndex: "teritory",
      ...getColumnSearchProps("teritory"),
    },
    {
      sorter: true,
      title: "TERITORY",
      dataIndex: "teritory",
      ...getColumnSearchProps("teritory"),
    },
    {
      sorter: true,
      title: "ACCOUNT GROUP",
      dataIndex: "accountGroup",
      ...getColumnSearchProps("accountGroup"),
    },
    {
      sorter: true,
      title: "PRIORITY",
      dataIndex: "priority",
      ...getColumnSearchProps("priority"),
    },
    {
      sorter: true,
      title: "CORPORATE",
      dataIndex: "isCorporate",
      ...getColumnSearchProps("isCorporate"),
    },
    {
      sorter: true,
      title: "RATING & BILLING EXCEPTION",
      dataIndex: "isException",
      ...getColumnSearchProps("isException"),
    },
    {
      sorter: true,
      title: "STATUS",
      dataIndex: "status",
      ...getColumnSearchProps("status"),
      render: (status) => (
        <div className={"flex justify-center"}>
          <StatusComponent colour={status}>{status}</StatusComponent>
        </div>
      ),
    },
    {
      sorter: true,
      title: "DESCRIPTION",
      dataIndex: "description",
      ...getColumnSearchProps("description"),
    },
  ];

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const filterDataByPage = () => {
    let result = [...dataSource];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header={"customer confirmation"}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <div className={"w-full flex justify-end gap-5"}>
          <ButtonComponent type={"default"} onClick={handleCancel}>
            Cancel
          </ButtonComponent>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={handleConfirm}
          >
            Confirm
          </ButtonComponent>
        </div>
      }
    >
      <div className="w-full p-5">
        <div className="flex flex-col justify-center">
          <Alert
            message={message}
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            type={"warning"}
            showIcon
            className="p-0 m-0"
          />
        </div>
      </div>

      <div className="w-full p-5">
        <span className="text-primary uppercase font-bold">
          customer information
        </span>

        <div className="w-full grid grid-cols-4 gap-5 pt-[30px]">
          <DetailText label={"Customer Number"}>
            {data?.customerNumber}
          </DetailText>
          <DetailText label={"Identification Type"}>
            {data?.identificationType}
          </DetailText>
          <DetailText label={"Customer Identification Number"}>
            {data?.personalIdentificationNumber}
          </DetailText>
          <DetailText label={"Customer Name"}>{data?.customerName}</DetailText>
          <DetailText label={"Customer Type"}>{data?.customerType}</DetailText>
          <DetailText label={"Status"}>{data?.status}</DetailText>
          <DetailText label={"Birth/Founded Place"}>
            {data?.placeOfBirth}
          </DetailText>
          <DetailText label={"Birth/Founded Date"}>
            {data?.dateOfBirth
              ? moment(data?.dateOfBirth).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label={"Sex"}>{data?.sex}</DetailText>
          <DetailText label={"Search Key"}>{data?.searchKey}</DetailText>
        </div>
        <div className="w-full gap-5">
          <DetailText label={"Description"}>{data?.description}</DetailText>
        </div>
      </div>

      <div className="w-full p-5">
        <span className="text-primary uppercase font-bold">
          Account List Information
        </span>

        <div className="w-full pt-[30px]">
          <TablePagination
            dataSource={filterDataByPage()}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columns}
            onSort={onSort}
            tableScrolled={{
              x: 6400,
              y: 300,
            }}
          />
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalCheckCustomer;
