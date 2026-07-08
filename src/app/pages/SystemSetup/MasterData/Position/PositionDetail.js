import React, { useCallback, useRef, useState } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { hasValue, renderColumn, renderDateColumn, toTitleCase } from "../../../../../utils";
import moment from "moment";
import CardComponent from "../../../../../components/Card/CardComponent";
import DetailText from "../../../../../components/DetailText";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { sorterFunction } from "../../../../../utils/sorterFunction";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import NxTable from "../../../../../components/Nx/NxTable";

export default function PositionDetail(props) {
  const { data, onClick = () => { }, isOpen } = props;

  const searchInput = useRef(null);
  const { loading } = useSelector((state) => state.master_position);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [dataTable, setDataTable] = useState([]);

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  const handleResetState = useCallback(() => {
    setPage(1)
    setPageSize(10)
    setSearchText("")
    setSearchedColumn('')
    setSearch({})
  }, [])

  useEffect(() => {
    if (data !== null) {
      setDataTable(data?.activeInactiveLog);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen === false) {
      handleResetState()
    }
  }, [isOpen, handleResetState]);

  // Function Search Column
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

  // handle filter data

  // Function Change Pagination
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columns = [
    {
      title: "NO",
      align: "center",
      width: 90,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTOR",
      dataIndex: "createdBy",
      width: 130,
      sorter: (a, b) => sorterFunction('createdBy', a, b),
      filteredValue: search.createdBy ? [search.createdBy] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'createdBy',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('createdBy', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACTION",
      dataIndex: "operation",
      width: 150,
      sorter: (a, b) => sorterFunction('operation', a, b),
      filteredValue: search.operation ? [search.operation] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'operation',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'status'
      ),
      render: (text) => renderColumn('operation', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ACTION DATE",
      dataIndex: "createdDate",
      width: 250,
      align: 'center',
      sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
      filteredValue: search.createdDate ? [search.createdDate] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'createdDate',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'datetime'
      ),
      render: (value) => renderDateColumn('createdDate', searchedColumn, searchText, value, 'datetime', search)
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      width: 350,
      sorter: (a, b) => a.remark?.localeCompare(b.remark),
      filteredValue: search.remark ? [search.remark] : null,
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        'remark',
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('remark', searchedColumn, searchText, text, true, 'input', search)
    },
  ];

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={onClick}
      type="detail"
      header="Detail Position"
      width={1000}
      footer={
        <ButtonComponent border={true} onClick={onClick}>
          Back
        </ButtonComponent>
      }
    >
      <Spin spinning={loading}>
        <div className={"flex w-full flex-col gap-5"}>
          <CardComponent cols={2} header={"POSITION INFORMATION"}>
            <DetailText label={"Position"}>{data?.name}</DetailText>
            <DetailText label={"Cost Center"}>{data?.costCenter}</DetailText>
            <DetailText label={"Status"}>{toTitleCase(data?.status)}</DetailText>
            <DetailText label={"Description"}>{data?.description}</DetailText>
          </CardComponent>

          <CardComponent cols={5} header={"HISTORY LOG INFORMATION"}>
            <DetailText label={"Record Id"}>
              {data?.id}
            </DetailText>
            <DetailText label={"Created Date"}>
              {hasValue(data?.createdDate) &&
                moment(data?.createdDate).format("DD MMM YYYY HH:mm:ss")}
            </DetailText>
            <DetailText label={"Created By"}>{data?.createdBy}</DetailText>
            <DetailText label={"Updated Date"}>
              {hasValue(data?.updatedDate) &&
                moment(data?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
            </DetailText>
            <DetailText label={"Updated By"}>{data?.updatedBy}</DetailText>
          </CardComponent>
        </div>
        <div className="mb-[30px]">
          <div>
            <p className="text-primary text-xs font-semibold uppercase">
              ACTIVATE/INACTIVATE LOG INFORMATION
            </p>
          </div>
          <div className="w-full">
            <NxTable
              idTable="position-detail-table-modal"
              userId={dataUser?.data?.username}
              showAdvanceSearch={false}
              showSearchBar={false}
              usePagination={false}
              type="FE"
              dataSource={dataTable}
              columns={columns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              // totalData={updatePagination(dataTable, 'length', searchedColumn, searchText, page, pageSize, typeColumn)}
              tableScrolled={{
                x: 1300,
                y: 300,
              }}
            />
          </div>
        </div>

      </Spin>
    </ModalCustom>
  );
}
