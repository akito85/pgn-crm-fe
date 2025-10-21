import React, { useRef, useState } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../../../components/TablePaginationNew";
import ButtonComponent from "../../../../../../../components/ButtonComponent";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  onFilter = () => {},
  sorter = () => {},
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      sorter: true,
      width: 150,
      onFilter: (value, record) => onFilter("country", value, record),
      sorter: (a, b) => sorter("country", a, b),
      ...getColumnSearchPropsPaging(
        "country",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      title: "PERCENTAGE (%)",
      dataIndex: "percentage",
      align: "right",
      sorter: true,
      width: 150,
      onFilter: (value, record) => onFilter("percentage", value, record),
      sorter: (a, b) => sorter("percentage", a, b),
      ...getColumnSearchPropsPaging(
        "percentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
  ];
};

const RawMaterialSourceDetail = ({ data_detail, openModal, closeModal }) => {
  // Declaration
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  // Function Change Pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onFilter = (dataIndex, value, record) => {
    const fixSearchText = value.toLowerCase();
    const recordValue = record[dataIndex];

    if (recordValue != null) {
      return recordValue.toString().toLowerCase().includes(fixSearchText);
    }

    return false;
  };

  const sorter = (fieldSort, a, b) => {
    const handleDataSort = (obj) => {
      const value = obj[fieldSort];
      return value != null ? value.toString().toLowerCase() : "";
    };

    let fa = handleDataSort(a);
    let fb = handleDataSort(b);

    return fa.localeCompare(fb);
  };

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={closeModal}
      type="detail"
      header="Detail Raw Material Source"
      width={800}
      footer={
        <ButtonComponent type={"default"} onClick={closeModal}>
          Back
        </ButtonComponent>
      }
    >
      <CardComponent header={"Raw Material Source Information"} cols={3}>
        <DetailText label={"Effective Date"}>
          {data_detail?.effectiveDate
            ? moment(data_detail.effectiveDate).format(dateFormatting.date)
            : ""}
        </DetailText>
        <DetailText label={"Local (%)"}>{data_detail?.value1}</DetailText>
        <DetailText label={"Import (%)"}>{data_detail?.value2}</DetailText>
        <DetailText label={"Description"}>
          {data_detail?.description}
        </DetailText>
      </CardComponent>

      <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
        <DetailText label="Record ID">{data_detail?.id}</DetailText>
        <DetailText label="Created Date">
          {data_detail?.createdDate
            ? moment(data_detail.createdDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
        <DetailText label="Updated Date">
          {data_detail?.updatedDate
            ? moment(data_detail.updatedDate).format(dateFormatting.dateTime)
            : ""}
        </DetailText>
        <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
      </CardComponent>

      <div className="text-primary text-xs font-bold uppercase pt-4">
        Raw Material Source Import Detail
      </div>

      <TablePaginationNew
        type="FE"
        dataSource={data_detail?.srcDistDtl}
        totalData={data_detail?.srcDistDtl?.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: "auto" }}
        onChange={handleChange}
        columns={columns(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          onFilter,
          sorter,
        )}
      />
    </ModalCustom>
  );
};

export default RawMaterialSourceDetail;
