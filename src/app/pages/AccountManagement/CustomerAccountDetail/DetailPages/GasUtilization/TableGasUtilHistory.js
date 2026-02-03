import React,{ useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tooltip } from 'antd'

import DetailGasUtilHistory from './DetailGasUtilHistory'
import { getColumnSearchPropsUseFilteredValue } from '../../../../../../utils/getColumnSearchProps'
import SVGIcon from "../../../../../../assets/Icon/index";
import { ACCOUNT_MANAGEMENT_ROUTES } from '../../../../../../routes/account_management/customer_account_routes'
import { deleteGasUtilization, getDetailGasUtilization, getListGasUtilizationHistory, getListGasUtilizationHistoryNew } from '../../../../../../redux/slices/account_management/detailAccount/gasUtilizationSlice'
import { ModalConfirm } from '../../../../../../components/Modal/ModalPopUp'
import NxTable from '../../../../../../components/Nx/NxTable'
import { useColumnActionPermission } from '../../../../../../components/ColumnActionPermission'
import { nxApplyFixedColumns } from '../../../../../../utils/Nx/nxApplyFixedColumns'
import { WarningOutlined } from '@ant-design/icons'
import { hasValue, renderDateColumn } from '../../../../../../utils'

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
        true
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

  const {
    list_gasUtilizationHistory,
    pagination_gasUtilizationHistory,
    data_detail,
    loading,
  } = useSelector(
    (state) => state.accountGasUtilization
  );

  const itemActions = [
    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  handleDetail(record);
                }}
              />
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_GAS_UTILIZATION}
              state={{
                id: record?.id,
                accountId: idAccount,
                customerId: idCustomer
              }}
              >
              <div
                className={`flex justify-center pt-1`}
              > 
                <SVGIcon
                  name="IconEdit"
                  width={24}
                />
              </div>
            </Link>
          </Tooltip>
        )
      }
    },
    {
      action: "Hapus",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Delete">
            <div className="pt-1">
              <SVGIcon
                name="IconDelete"
                width={24}
                onClick={() => handleOpenDelete(record?.id)}
              />
            </div>
          </Tooltip>
        )
      }
    },
  ];

  // const itemActions = nxGetAccountActions({
  //   idAccount,
  //   idCustomer,
  //   updateRoute: ACCOUNT_MANAGEMENT_ROUTES.UPDATE_GAS_UTILIZATION,
  //   handleDetail: {
  //     action: "View",
  //     type: "table",
  //     render: (record) => {
  //       return (
  //         <ButtonComponent
  //           icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
  //           type="submit"
  //           onClick={() => handleDetail(record)}
  //         >
  //           Approval
  //         </ButtonComponent>
  //       )
  //     }
  //   },
  // })

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
  const [loadMoreSize] = useState(20);

  const currentData = useMemo(() => list_gasUtilizationHistory, [list_gasUtilizationHistory]);
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
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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
    dispatch(getDetailGasUtilization({id:r?.id}));
    setModalDetail(true)
    setDataDetail(r)
    // dispatch()
  }

  const handleOpenDelete = (r) => {
    setOpenModalDelete(true)
    setIdSelected(r)
  }

  const handleConfirmModalDelete = () => {
    setOpenModalDelete(false);
    dispatch(deleteGasUtilization({ id: idSelected }))
    .unwrap()
    .then((data) => {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getListGasUtilizationHistory({
          id:idAccount, search: reqSearch, sort, page, pageSize: loadMoreSize
        })
      );
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

  const actionCols = useColumnActionPermission(["Inactivate", "View", "Update", "History", "Hapus"], itemActions, "View", "table").map(
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
      <div className="text-primary text-xs font-bold uppercase py-4">GAS UTILIZATION HISTORY LIST</div>
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

      {/* Modal Detail */}
      <DetailGasUtilHistory isOpen={modalDetail} setIsOpen={setModalDetail} dataDetail={data_detail} />

      {/* Modal Delete */}
      <ModalConfirm
        isOpen={openModalDelete}
        handleCancel={()=>{
          setIdSelected('')
          setOpenModalDelete(false)
        }}
        handleOk={handleConfirmModalDelete}
        width={500}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            Are you sure want to delete gas utilization ?
          </p>
        </div>
        {/* <Alert
          message="Warning! your data will deleted permanently"
          type={"error"}
        /> */}
      </ModalConfirm>
    </>
  )
}

export default TableGasUtilHistory