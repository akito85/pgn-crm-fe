import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import { dateFormatting } from "../../../../../../../utils";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { getGrantedAccessAccount } from "../../../../../../../redux/slices/account_management/accountManagement";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../../components/Modal/ModalPopUp";
import ProductDistributionDetail from "./ProductDistributionDetail";
import { deletePD, getAllPDHistoryPaginate, getDetailPDHistory } from "../../../../../../../redux/slices/account_management/detailAccount/ProductDistributionSlice";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import { useColumnActionPermission } from "../../../../../../../components/ColumnActionPermission";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { nxGetAccountActions } from "../../../../../../../components/Nx/NxGetAccountActions";

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
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "effectiveDate",
      title: "EFFECTIVE DATE",
      dataIndex: "effectiveDate",
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
        true,
      ),
    },
    {
      key: "value2",
      title: "EXPORT (%)",
      dataIndex: "value2",
      align: "right",
      sorter: true,
      filteredValue: [search?.value2] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "value2",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      sorter: true,
      filteredValue: [search?.description] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
    },
  ];
};

const ProductDistributionHistory = ({ id, idCustomer }) => {
  const navigate = useNavigate();
  // Selector
  const { access_account } = useSelector((state) => state.accountManagement);
  const {
    list_productDistributionHistory,
    pagination_productDistributionHistory,
    data_detail_history,
    loading
  } = useSelector(
    (state) => state.productDistribution
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    if (!Array.isArray(list_productDistributionHistory)) return [];

    return list_productDistributionHistory.map(item => ({
      ...item,
      statusApproval: item?.statusApproval ?? "DRAFT",
    }));
   }, [list_productDistributionHistory]);
  const currentPagination = pagination_productDistributionHistory;

  const hashMore = currentData.length < (currentPagination?.totalElements || 0);
  
  // Use Effect

  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/product-distribution'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/product-distribution'))
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(
      getAllPDHistoryPaginate({
        id: id,
        search: encodeURIComponent(JSON?.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      })
    );
  }, [dispatch, id, search, page, loadMoreSize, sort]);

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

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_productDistributionHistory?.totalPages || 0;
    const reqSearch = encodeURIComponent(JSON?.stringify(search));

    if (nextPage <= totalPages) {
      await dispatch(
        getAllPDHistoryPaginate({
          id: id,
          search: reqSearch,
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true
        })
      );
    }
    setPage(nextPage);
  };

  // Function Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemGrantAccess = nxGetAccountActions({
    handleView: (record, _) => handleDetail(record),
    handleUpdate: (record, _) => navigate(
      ACCOUNT_MANAGEMENT_ROUTES.UPDATE_PRODUCT_DISTRIBUTION,
      {
        state: {
          idPD: record,
          accountId: id,
          idCustomer: idCustomer,
        }
      }
    ),
    handleDelete: (record, _) => handleDelete(record),
  });

  // Handle Detail
  const handleDetail = (record) => {
    setModalDetail(true);
    dispatch(getDetailPDHistory(record));
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

    dispatch(deletePD(idData))
      .unwrap()
      .then(() => {
        setModalDetail(false);
        setIdData();
        setEffectiveData();
        dispatch(
          getAllPDHistoryPaginate({
            id: id,
            search: encodeURIComponent(JSON?.stringify(search)),
            page,
            pageSize,
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
    setEffectiveData();
  };

  const handleRetry = () => {
    handleDeleteOk();
    setModalError(false);
    setIdData();
    setEffectiveData();
  };

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(["View", "Update", "Delete"], itemGrantAccess, "View", "table").map(
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
      <NxBaseContainer border header={"PRODUCT DISTRIBUTION HISTORY LIST"}>
        <NxTable
          idTable="table-product-distribution-history"
          dataSource={currentData}
          totalData={currentPagination}
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
      <ProductDistributionDetail
        openModal={modalDetail}
        closeModal={() => setModalDetail(false)}
        data_detail={data_detail_history}
      />

      {/* Modal Delete */}
      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDeleteOk}
        width={550}
        useOk={true}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <SVGIcon name="IconAlertTriangle" width={48} />
          <p className={"text-[18px] font-bold"}>
            {`Are you sure you want to delete Raw Material Source with effective date ${moment(
              effectiveData
            ).format(dateFormatting.date)}?`}
          </p>
        </div>
      </ModalConfirm>

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

export default ProductDistributionHistory;
