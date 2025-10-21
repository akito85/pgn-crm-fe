import React, { useRef, useState, useCallback } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import {
  getColumnSearchProps,
  getColumnSearchPropsUseFilteredValueFE,
} from "../../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../../utils/sorterFunction";
import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => {
  return [
    {
      title: "NO",
      width: 20,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "UTIIZATION NAME",
      dataIndex: "name",
      width: 150,
      sorter: true,
      // ...getColumnSearchPropsUseFilteredValueFE(
      //   search,
      //   'utilizationName',
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      sorter: (a, b) => sorterFunction("name", a, b),
      ...getColumnSearchProps(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percentage",
      width: 150,
      sorter: true,
      align: "right",
      // ...getColumnSearchPropsUseFilteredValueFE(
      //   search,
      //   'percentage',
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      sorter: (a, b) => sorterFunction("percentage", a, b),
      ...getColumnSearchProps(
        "percentage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
    },
  ];
};

const dataSource = [
  {
    id: 1,
    utilizationName: "CNG",
    percentage: 20,
  },
  {
    id: 2,
    utilizationName: "Fuel",
    percentage: 50,
  },
  {
    id: 3,
    utilizationName: "Other",
    percentage: 30,
  },
];

const DetailGasUtilHistory = ({ isOpen, setIsOpen, dataDetail }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = useCallback(
    (pageChange, pageSizeChange) => {
      setPage(pageSize !== pageSizeChange ? 1 : pageChange);
      setPageSize(pageSizeChange);
    },
    [pageSize],
  );

  return (
    <>
      <ModalCustom
        header={"DETAIL GAS UTILIZATION HISTORY"}
        isOpen={isOpen}
        handleCancel={() => {
          setIsOpen(false);
        }}
        type={"detail"}
        width={800}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        {/* GAS UTILIZATION INFORMATION */}
        <CardComponent header={"GAS UTILIZATION INFORMATION"} cols={2}>
          <DetailText label="Effective Date">
            {dataDetail?.effectiveDate}
          </DetailText>
          <DetailText label="Description">{dataDetail?.description}</DetailText>
        </CardComponent>

        {/* HISTORY LOG INFORMATION */}
        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">{dataDetail?.id}</DetailText>
          <DetailText label="Created Date">
            {dataDetail?.createdDate
              ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{dataDetail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {dataDetail?.updatedDate
              ? moment(dataDetail?.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{dataDetail?.updatedBy}</DetailText>
        </CardComponent>

        {/* Table */}
        <div className="mb-6">
          <div className="text-primary text-xs font-semibold uppercase py-[30px]">
            CONTACT DETAIL INFORMATION
          </div>
          <TablePaginationNew
            type="FE"
            useSelect
            pageSize={pageSize}
            current={page}
            dataSource={dataDetail?.gasUtilsDtl}
            tableScrolled={{ y: 625 }}
            onChange={handleChange}
            columns={columns(
              search,
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
          />
        </div>
      </ModalCustom>
    </>
  );
};

export default DetailGasUtilHistory;
