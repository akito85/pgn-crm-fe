import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import ToolbarAccount from "../../../../ComponentAccount/ToolbarAccount";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import { dateFormatting, hasValue, renderColumn, renderDateColumn } from "../../../../../../../utils";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { getGrantedAccessAccount } from "../../../../../../../redux/slices/account_management/accountManagement";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RawMaterialSourceDetail from "./RawMaterialSourceDetail";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../../components/Modal/ModalPopUp";
import {
  deleteRMS,
  getAllRMSHistoryPaginate,
  getDetailRMSHistory,
} from "../../../../../../../redux/slices/account_management/detailAccount/RawMaterialDistributionSlice";
import { useColumnActionPermissionAccount } from "../../../../ComponentAccount/ColumnActionPermissionAccount";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import { WarningOutlined } from "@ant-design/icons";

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
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      key: "effectiveDate",
      title: "EFFECTIVE DATE",
      dataIndex: "effectiveDate",
      width: 150,
      sorter: true,
      align: "center",
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
      ),
    },
    {
      key: "value1",
      title: "LOCAL (%)",
      dataIndex: "value1",
      width: 150,
      sorter: true,
      align: "right",
      filteredValue: [search?.value1] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "value1",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "value2",
      title: "IMPORT (%)",
      dataIndex: "value2",
      align: "right",
      width: 150,
      sorter: true,
      filteredValue: [search?.value2] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "value2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      width: 220,
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
    },
  ];
};

const RawMaterialSourceHistory = ({ id, idCustomer }) => {
  // Selector
  const {
    list_rawMaterialSourceHistory,
    pagination_rawMaterialSourceHistory,
    data_detail_history,
    loading,
  } = useSelector(
    (state) => state.rawMaterialSource
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const navigate = useNavigate();

  // State
  const [page, setPage] = useState(1);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [effectiveData, setEffectiveData] = useState();
  const [modalDetail, setModalDetail] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [idData, setIdData] = useState();
  const location = useLocation();
  const [loadMoreSize] = useState(20);

  const currentData = useMemo(() => {
    if (!Array.isArray(list_rawMaterialSourceHistory)) return [];

    return list_rawMaterialSourceHistory.map(item => ({
      ...item,
      statusApproval: item?.statusApproval ?? "DRAFT",
    }));
  }, [list_rawMaterialSourceHistory]);
  const currentPagination = pagination_rawMaterialSourceHistory;

  const hashMore = currentData.length < (currentPagination?.totalElements || 0);

  // Use Effect
  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/raw-material-source'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/raw-material-source'))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(
      getAllRMSHistoryPaginate({
        id: id,
        search: encodeURIComponent(JSON?.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      })
    );
  }, [dispatch, id, search, page, loadMoreSize, sort]);

  // Function Search Column
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
    const totalPages = pagination_rawMaterialSourceHistory?.totalPages || 0;
    const reqSearch = encodeURIComponent(JSON?.stringify(search));

    if (nextPage <= totalPages) {
      await dispatch(
        getAllRMSHistoryPaginate({
          id: id,
          search: reqSearch,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  }

  // Function Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemGrantAccess = nxGetAccountActions({
    handleView: ({ id: recordId }) => handleDetail(recordId),
    handleUpdate: ({ id: recordId }) => navigate(ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RAW_MATERIAL_SOURCE, {
      state: { idRMS: recordId, accountId: id, idCustomer: idCustomer },
    }),
    handleDelete: ({ id: recordId }) => handleDelete(recordId),
  })

  // Handle Detail
  const handleDetail = (record) => {
    setModalDetail(true);
    dispatch(getDetailRMSHistory(record));
  };

  // Handle Delete
  const handleDelete = (record) => {
    const data = currentData.find((item) => item.id === record);
    setModalDelete(true);
    setIdData(data?.id);
    setEffectiveData(data?.effectiveDate);
  };

  const handleDeleteOk = () => {
    setModalDelete(false);

    dispatch(deleteRMS(idData))
      .unwrap()
      .then(() => {
        setModalDetail(false);
        setIdData();
        setEffectiveData();
        dispatch(
          getAllRMSHistoryPaginate({
            id: id,
            search: encodeURIComponent(JSON?.stringify(search)),
            page,
            pageSize: loadMoreSize,
            sort,
          })
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setIdData();
    setEffectiveData()
  };

  const handleRetry = () => {
    handleDeleteOk();
    setModalError(false);
    setIdData();
    setEffectiveData()
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(["View", "Update", "Delete"], itemGrantAccess , "View", "table").map(
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
    <Fragment>
      <NxBaseContainer border header={"RAW MATERIAL SOURCE HISTORY LIST"}>
        <NxTable
          idTable="table-raw-material-source-history"
          dataSource={currentData}
          totalData={currentPagination?.totalElements}
          current={page}
          tableScrolled={{ y: 525, x: currentData?.length ? "max-content" : "100%" }}
          onSort={onSort}
          columns={processedColumns}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hashMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columnDefinitions}
          loading={loading}
        />
      </NxBaseContainer>

      {/* Modal Detail */}
      <RawMaterialSourceDetail
        openModal={modalDetail}
        closeModal={() => setModalDetail(false)}
        data_detail={data_detail_history}
      />

      {/* Modal Delete */}
      <ModalCustom
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDeleteOk}
        header={"DELETE RAW MATERIAL SOURCE"}
        width={500}
        type={"confirmation"}
        footer={
          <div className='flex justify-between'>
            <Button key="cancel" onClick={()=>{
              // setIdSelected('')
              // setDeleteItemData(null)
              setModalDelete(false)
            }}>
              Cancel
            </Button>,
            <Button key="ok" type="primary" danger onClick={handleDeleteOk}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <div className="text-[18px] font-bold">
            <p>Are you sure want to delete raw material source, with Effective Date: {moment(effectiveData).format(dateFormatting.date)}?</p>
          </div>
        </div>
      </ModalCustom>

      {/* Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not deleted.
            ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default RawMaterialSourceHistory;
