import React,{ useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

import DetailGasUtilHistory from './DetailGasUtilHistory'
import { getColumnSearchPropsUseFilteredValue } from '../../../../../../utils/getColumnSearchProps'
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../../routes/account_management/customer_account_routes'
import { deleteGasUtilization, getDetailGasUtilization, getListGasUtilizationHistory, getListGasUtilizationHistoryNew } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import NxTable from '../../../../../../components/Nx/NxTable'
import { useColumnActionPermission } from '../../../../../../components/ColumnActionPermission'
import { nxApplyFixedColumns } from '../../../../../../utils/Nx/nxApplyFixedColumns'
import { WarningOutlined } from '@ant-design/icons'
import ModalCustom from '../../../../../../components/Modal/ModalCustom'
import NxBaseContainer from '../../../../../../components/Nx/NxBaseContainer'
import { nxGetAccountActions } from '../../../../../../components/Nx/NxGetAccountActions'
import moment from 'moment'

const columns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
) => {
  return [
    {
      key: "no",
      title: "NO",
      align: "center",  
      dataIndex: "no",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      key: "effectiveDate",
      title: "EFFECTIVE DATE",
      dataIndex: "effectiveDate",
      width: 220,
      sorter: true,
      filteredValue: [search?.effectiveDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "effectiveDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      )
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 150,
      sorter: true,
      filteredValue: [search?.description] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    }
  ]
}

const TableGasUtilHistory = ({idAccount, idCustomer, access}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list_gasUtilizationHistory,
    pagination_gasUtilizationHistory,
    data_detail,
    loading,
  } = useSelector(
    (state) => state.accountGasUtilization
  );

  const itemActions = nxGetAccountActions({
    handleView: ({ id: recordId }) => handleDetail(recordId),
    handleUpdate: ({ id: recordId }) => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.UPDATE_GAS_UTILIZATION,
      {
        state: {
          id: recordId,
          accountId: idAccount,
          customerId: idCustomer,
        }
      }
    ),
    handleDelete: (record) => handleOpenDelete(record),
  });

  const [page, setPage] = useState(1);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [idSelected, setIdSelected] = useState('');
  const [deleteItemData, setDeleteItemData] = useState(null);
  const [loadMoreSize] = useState(20);

  const currentData = useMemo(() => {
    if (!Array.isArray(list_gasUtilizationHistory)) return [];

    return list_gasUtilizationHistory.map(item => ({
      ...item,
      statusApproval: item?.statusApproval ?? "DRAFT",
    }));
  }, [list_gasUtilizationHistory]);


  // const currentData = useMemo(() => list_gasUtilizationHistory, [list_gasUtilizationHistory]);
  const currentPagination = pagination_gasUtilizationHistory;

  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListGasUtilizationHistoryNew({
        id:idAccount, search: reqSearch, sort, page, pageSize: loadMoreSize, isLoadMore: false
      })
    );
  }, [search, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    let value = selectedKeys[0];

    // convert date field sebelum dikirim ke backend
    if (dataIndex === "effectiveDate" && value) {
      value = moment(value, "DD MMM YYYY", true).format("YYYY-MM-DD");
    }

    setSearchText(value);
    setSearchedColumn(value ? dataIndex : "");

    setSearch((prevState) => {
      if (prevState[dataIndex] !== value) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: value,
      };
    });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_gasUtilizationHistory?.totalPages || 0;
    const reqSearch = encodeURIComponent(JSON.stringify(search));

    if (nextPage <= totalPages) {
      await dispatch(
        getListGasUtilizationHistoryNew({
          id:idAccount,
          search: reqSearch,
          sort,
          page: nextPage,
          pageSize: loadMoreSize,
          isLoadMore: true
        })
      );
    }
    setPage(nextPage);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDetail = async (r) => {
    dispatch(getDetailGasUtilization({id:r}));
    setModalDetail(true)
    setDataDetail(r)
    // dispatch()
  }

  const handleOpenDelete = (record) => {
    setOpenModalDelete(true)
    setIdSelected(record.id)
    setDeleteItemData(record)
  }

  const handleConfirmModalDelete = () => {
    setOpenModalDelete(false);
    dispatch(deleteGasUtilization({ id: idSelected }))
    .unwrap()
    .then((data) => {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getListGasUtilizationHistoryNew({
          id:idAccount, search: reqSearch, sort, page: 1, pageSize: loadMoreSize, isLoadMore: false
        })
      );
      setPage(1);
    })
    .catch((err) => {
      console.log(err)
      return;
    });
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(["Inactivate", "View", "Update", "History", "Delete"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  const baseColumns = useMemo(() =>
    columns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchText, searchedColumn]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <>
      <NxBaseContainer border header={"GAS UTILIZATION HISTORY LIST"}>
        <NxTable
          idTable="gas-utilization-history-table"
          dataSource={currentData}
          totalData={currentPagination?.totalElements}
          current={page}
          tableScrolled={{ y: 400, x: currentData.length ? "max-content" : "100%" }}
          onSort={onSort}
          columns={processedColumns}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columnDefinitions}
          loading={loading}
        />
      </NxBaseContainer>

      {/* Modal Detail */}
      <DetailGasUtilHistory isOpen={modalDetail} setIsOpen={setModalDetail} dataDetail={data_detail} />

      {/* Modal Delete */}
      <ModalCustom
        isOpen={openModalDelete}
        handleCancel={()=>{
          setIdSelected('')
          setDeleteItemData(null)
          setOpenModalDelete(false)
        }}
        handleOk={handleConfirmModalDelete}
        header={"DELETE GAS UTILIZATION"}
        width={500}
        type={"confirmation"}
        footer={
          <div className='flex justify-between'>
            <Button key="cancel" onClick={()=>{
              setIdSelected('')
              setDeleteItemData(null)
              setOpenModalDelete(false)
            }}>
              Cancel
            </Button>,
            <Button key="ok" type="primary" danger onClick={handleConfirmModalDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <div className="text-[18px] font-bold">
            <p>Are you sure want to delete gas utilization, with Effective Date: {deleteItemData?.effectiveDate || "-"} ?</p>
          </div>
        </div>
      </ModalCustom>
    </>
  )
}

export default TableGasUtilHistory