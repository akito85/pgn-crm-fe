import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import { DatePicker, Input } from "antd";
import Highlighter from "react-highlight-words";
import { FilterOutlined } from "@ant-design/icons";
import TablePagination from "../../../../../../components/TablePagination";
import { dateFormatting } from "../../../../../../utils";
import DetailText from "../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import StatusComponent from "../../../../../../components/StatusComponent";

const ModalDetailAccountOnetime = ({
  data,
  dataTable = [],
  isOpen,
  handleCancel = () => {},
}) => {
  // Declaration
  const searchInput = useRef(null);
  const dataSource = data?.accountList || [];

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
      align: "center",
      ...getColumnSearchProps("meterReadingCode"),
    },
    {
      sorter: true,
      title: "SEGMENT",
      align: "center",
      dataIndex: "accountSegment",
      ...getColumnSearchProps("accountSegment"),
    },
    {
      sorter: true,
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      align: "center",
      ...getColumnSearchProps("accountGroupType"),
    },
    {
      sorter: true,
      title: "CATEGORY",
      dataIndex: "accountCategory",
      align: "center",
      ...getColumnSearchProps("accountCategory"),
    },
    {
      sorter: true,
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      align: "center",
      ...getColumnSearchProps("classificationType"),
    },
    {
      sorter: true,
      title: "ACCOUNT TYPE",
      dataIndex: "accountType",
      align: "center",
      ...getColumnSearchProps("accountType"),
    },
    {
      sorter: true,
      title: "INDUSTRIAL SECTOR",
      dataIndex: "industrialSector",
      align: "center",
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
      align: "center",
      ...getColumnSearchProps("teritory"),
    },
    {
      sorter: true,
      title: "ACCOUNT GROUP",
      dataIndex: "accountGroup",
      align: "center",
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
          <StatusComponent colour={status}>
            {status}
          </StatusComponent>
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
      type="detail"
      header={"Detail Customer Information"}
      width={1000}
      handleCancel={handleCancel}
      footer={
        <ButtonComponent type={"default"} onClick={handleCancel}>
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"customer information"} cols={4}>
        <DetailText label={"Customer Number"}>
          {data?.customerNumber}
        </DetailText>
        <DetailText label={"Identification Type"}>
          {data?.identificationTypeName}
        </DetailText>
        <DetailText label={"Customer Identification Number"}>
          {data?.customerIdentificationNumber}
        </DetailText>
        <DetailText label={"Customer Name"}>{data?.customerName}</DetailText>
        <DetailText label={"Customer Type"}>{data?.customerType}</DetailText>
        <DetailText label={"Description"}>{data?.description}</DetailText>
        <DetailText label={"Status"}>{data?.status}</DetailText>
        <DetailText label={"Birth/Founded Place"}>
          {data?.foundedBirthPlace}
        </DetailText>
        <DetailText label={"Birth/Founded Date"}>
          {moment(data?.foundedBirthDate).format(dateFormatting.date)
            ? moment(data?.foundedBirthDate).format(dateFormatting.date)
            : "-"}
        </DetailText>
        <DetailText label={"Sex"}>{data?.sex}</DetailText>
        <DetailText label={"Search Key"}>{data?.searchKey}</DetailText>
      </CardComponent>

      <p className="text-primary uppercase font-bold">
        customer list information
      </p>

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
    </ModalCustom>
  );
};

export default ModalDetailAccountOnetime;
