import React,{useRef, useState, useCallback} from 'react'
import ModalCustom from '../../../../../../components/Modal/ModalCustom'
import ButtonComponent from '../../../../../../components/ButtonComponent'
import CardComponent from '../../../../../../components/Card/CardComponent'
import DetailText from '../../../../../../components/DetailText'
import TablePaginationNew from '../../../../../../components/TablePaginationNew'
import { getColumnSearchProps } from '../../../../../../utils/getColumnSearchProps'
import { sorterFunction } from '../../../../../../utils/sorterFunction'
import moment from 'moment'
import { dateFormatting } from '../../../../../../utils'
import NxTable from '../../../../../../components/Nx/NxTable'
import NxCardContainer from '../../../../../../components/Nx/NxCardContainer'
import BaseContainer from '../../../../../../components/BaseContainer'
import NxBaseContainer from '../../../../../../components/Nx/NxBaseContainer'
import NxModal from '../../../../../../components/Nx/NxModal'
import NxDetailText from '../../../../../../components/Nx/NxDetailText'

const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
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
      sorter: (a, b) => sorterFunction('name', a, b),
      ...getColumnSearchProps(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
      ),
    },
    {
      title: "PERCENTAGE",
      dataIndex: "percentage",
      width: 150,
      sorter: true,
      align: 'right',
      // ...getColumnSearchPropsUseFilteredValueFE(
      //   search,
      //   'percentage',
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      sorter: (a, b) => sorterFunction('percentage', a, b),
      ...getColumnSearchProps(
          "percentage",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
      ),
    },
  ];
}   

const dataSource = [
  {
    id: 1,
    utilizationName: "CNG",
    percentage: 20
  },
  {
    id: 2,
    utilizationName: "Fuel",
    percentage: 50
  },
  {
    id: 3,
    utilizationName: "Other",
    percentage: 30
  },
]

const DetailGasUtilHistory = ({isOpen, setIsOpen, dataDetail}) => {
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const hasMore = dataDetail?.gasUtilsDtl ? page * pageSize < dataDetail?.gasUtilsDtl.length : false;

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
  
  const handleChange = useCallback((pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  }, [pageSize]);

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  return (
    <>
      <NxModal
        header={"DETAIL GAS UTILIZATION HISTORY"}
        isOpen={isOpen}
        handleCancel={() => {
          setIsOpen(false)
        }}
        type={"detail"}
        width={800}
        footer={
          <ButtonComponent
            type={"default"}
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Back
          </ButtonComponent>
        }
      >
        <div className="flex flex-col p-4 gap-y-4">

          {/* GAS UTILIZATION INFORMATION */}
          <NxBaseContainer border header={"GAS UTILIZATION INFORMATION"}>
            <div className="w-full grid grid-cols-2 gap-4">
              <NxDetailText label="Effective Date">{dataDetail?.effectiveDate}</NxDetailText>
              <NxDetailText label="Description">{dataDetail?.description}</NxDetailText>
            </div>
          </NxBaseContainer>

          {/* HISTORY LOG INFORMATION */}
          <NxBaseContainer border header={"HISTORY LOG INFORMATION"}>
            <div className="w-full grid grid-cols-5 gap-4">
              <NxDetailText label="Record ID">{dataDetail?.id}</NxDetailText>
              <NxDetailText label="Created Date">{dataDetail?.createdDate ? moment(dataDetail?.createdDate).format(dateFormatting.dateTime) : ''}</NxDetailText>
              <NxDetailText label="Created By">{dataDetail?.createdBy}</NxDetailText>
              <NxDetailText label="Updated Date">{dataDetail?.updatedDate ? moment(dataDetail?.updatedDate).format(dateFormatting.dateTime) : ''}</NxDetailText>
              <NxDetailText label="Updated By">{dataDetail?.updatedBy}</NxDetailText>
            </div>
          </NxBaseContainer>

          {/* Table */}
          <NxBaseContainer border header={"GAS UTILIZATION DETAIL LIST"}>
            <NxTable
              idTable="table-detail-gas-util-history"
              dataSource={dataDetail?.gasUtilsDtl}
              totalData={dataDetail?.gasUtilsDtl?.length || 0}
              current={page}
              tableScrolled={{ y: 400 }}
              onSort={onSort}
              usePagination={false}
              useInfiniteScroll={true}
              columns={
                columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch
                )
              }
              pagination={false}
              scroll={{ y: 400 }}
            />
          </NxBaseContainer>
        </div>
      </NxModal>
    </>
  )
}

export default DetailGasUtilHistory