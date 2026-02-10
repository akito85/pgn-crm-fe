import React, { useRef, useState } from "react";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../../components/DetailText";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";

const columns = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  onFilter = () => {},
  sorter = () => {}
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
        handleSearch
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
        handleSearch
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
      <div className="flex flex-col gap-4">

        <NxBaseContainer border header={"RAW MATERIAL SOURCE INFORMATION"}>
          <div className="w-full grid grid-cols-3 gap-4">
            <NxDetailText label={"Effective Date"}>
              {data_detail?.effectiveDate
                ? moment(data_detail.effectiveDate).format(dateFormatting.date)
                : ""}
            </NxDetailText>
            <NxDetailText label={"Local (%)"}>{data_detail?.value1}</NxDetailText>
            <NxDetailText label={"Import (%)"}>{data_detail?.value2}</NxDetailText>
            <NxDetailText label={"Description"}>
              {data_detail?.description}
            </NxDetailText>

          </div>
        </NxBaseContainer>

        <NxBaseContainer border header={"HISTORY LOG INFORMATION"}>
          <div className="w-full grid grid-cols-5 gap-4">
            <NxDetailText label="Record ID">{data_detail?.id}</NxDetailText>
            <NxDetailText label="Created Date">
              {data_detail?.createdDate
                ? moment(data_detail.createdDate).format(dateFormatting.dateTime)
                : ""}
            </NxDetailText>
            <NxDetailText label="Created By">{data_detail?.createdBy}</NxDetailText>
            <NxDetailText label="Updated Date">
              {data_detail?.updatedDate
                ? moment(data_detail.updatedDate).format(dateFormatting.dateTime)
                : ""}
            </NxDetailText>
            <NxDetailText label="Updated By">{data_detail?.updatedBy}</NxDetailText>
          </div>
        </NxBaseContainer>

        <NxBaseContainer border header={"RAW MATERIAL SOURCE IMPORT DETAIL"}>
          <NxTable
            idTable="raw-material-source-detail-table"
            dataSource={data_detail?.srcDistDtl}
            totalData={data_detail?.srcDistDtl?.length}
            usePagination={false}
            useInfiniteScroll={true}
            hasMore={false}
            current={page}
            tableScrolled={{ y: 400, x: data_detail?.srcDistDtl?.length ? "max-content" : "100%" }}
            onSort={sorter}
            columns={columns(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
          />
        </NxBaseContainer>
      </div>
    </ModalCustom>
  );
};

export default RawMaterialSourceDetail;
