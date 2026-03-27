import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import SVGIcon from "../../../../assets/Icon/index";
import { Spin } from "antd";
import PromoDiscountTable from "./PromoDiscountTable";
import {
  downloadPromo,
  getAllPromoPaginate,
  getAvailableApprovalPromo,
  getPromoApprovalHistory,
  getSelectedApprovalPromo,
  inactivePromo,
} from "../../../../redux/slices/product_promo/promoSlice";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import NxHistoryModal from "../../../../components/Nx/NxHistoryModal";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxInactivateModal from "../../../../components/Nx/NxInactivateModal";
import NxBreadCrumb from "../../../../components/Nx/NxBreadCrumb";

const PromoDiscountView = () => {
  // Selector
  const { list_promo, pagination_promo, data_ApprovalHistory, loading } = useSelector(
    (state) => state.promo
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(0);
  const [loadMoreSize] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalInactive, setModalInactive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [chooseId, setChooseId] = useState();
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  // Memoized data for infinite scroll
  const currentData = useMemo(() => list_promo, [list_promo]);
  const currentPagination = pagination_promo;
  const hasMore = currentData.length < (currentPagination?.totalElements || 0);

  const dataSourceWithKeys = useMemo(() => {
    if (!currentData || currentData.length === 0) return [];

    return currentData.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
    }));
  }, [currentData]);

  useEffect(() => {
    dispatch(
      getAllPromoPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
        isLoadMore: false,
      })
    );
    
    setPage(0);
  }, [dispatch, search, sort]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PROMO_DISCOUNT,
      breadcrumbName: "Promo Discount",
    },
  ];

  //useEffect
  useEffect(() => {
    if (data_ApprovalHistory && data_ApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: data_ApprovalHistory?.dataApprover?.PRODUCT_PROMO || [],
          inactive:
            data_ApprovalHistory?.dataApprover?.INACTIVE_PRODUCT_PROMO || [],
        },
        dataHistory: {
          create: data_ApprovalHistory?.dataHistory?.PRODUCT_PROMO || [],
          inactive:
            data_ApprovalHistory?.dataHistory?.INACTIVE_PRODUCT_PROMO || [],
        },
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_ApprovalHistory]);

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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleOptions = () => {
    const data = dataApprovalHistory?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      key: item,
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
      label: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = (id) => {
    dispatch(getPromoApprovalHistory(id));
    setModalApprovalHistory(true);
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadPromo({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize: loadMoreSize,
        sort,
      })
    );
  };

  // Handle Load More
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = pagination_promo?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getAllPromoPaginate({
          search: encodeURIComponent(JSON.stringify(search)),
          page: nextPage,
          pageSize: loadMoreSize,
          sort,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const handleInactivateModal = (show, newId) => {
    if (show) {
      setChooseId(newId);
      setModalInactive(true);
    } else {
      setChooseId();
      setModalInactive(false);
    }
  };

  const handleRetry = () => {
    handleOk(bodyError?.body, bodyError?.handleClear);
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      id: chooseId,
      appHierId: res.appHierId,
      remark: res.remark,
    };
    
    dispatch(inactivePromo(dataValue))
      .unwrap()
      .then(() => {
        // setModalInactive(true);
        handleClear();
        handleInactivateModal(false);
        dispatch(
          getAllPromoPaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page: 1,
            pageSize: loadMoreSize,
            sort,
            isLoadMore: false,
          })
        );
        setPage(1);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };
  // console.log(itemsActionView(), "item");
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <div className="flex flex-col gap-y-4">
          <NxBreadCrumb routes={routes} />
          <NxCardContainer header={"PROMO LIST"}>
            <NxBaseContainer border>
              <PromoDiscountTable
                data={dataSourceWithKeys}
                totalElement={pagination_promo?.totalElements || 0}
                page={page}
                onSort={onSort}
                handleInactive={handleInactivateModal}
                handleApprovalHistory={handleApprovalHistory}
                handleDownload={handleDownload}
                handleLoadMore={handleLoadMore}
                hasMore={hasMore}
                searchText={searchText}
                search={search}
                searchedColumn={searchedColumn}
                searchInput={searchInput}
                handleSearch={handleSearch}
                loading={loading}
              />
            </NxBaseContainer>
          </NxCardContainer>
        </div>
      </Spin>
      
      {/* Modal Inactive */}
      <NxInactivateModal
        isOpen={modalInactive}
        header={"INACTIVATE"}
        handleCloseModal={() => handleInactivateModal(false)}
        customMessage={`Are you sure you want to inactivate this promo "${
          chooseId || ""
        }"?`}
        onFinish={({ remark, appHierId }, handleClear) => handleOk({ remark, appHierId }, handleClear)}
        named={chooseId}
        menu="promo"
        sliceName="promo"
        approvalHierarchtDetailsStateName="dataListAppHierDetail"
        approvalOptionsStateName="dataListAppHierId"
        getApprovalOptions={getAvailableApprovalPromo}
        getApprovalHierarchyDetails={getSelectedApprovalPromo}
      />

      {/* Modal Approval History */}
      <NxHistoryModal
        isOpen={modalApprovalHistory}
        handleClose={() => setModalApprovalHistory(false)}
        header={"Approval History"}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistory?.dataApprover}
        dataHistory={dataApprovalHistory?.dataHistory}
      />

      {/* Modal Modal Error Inactive */}
      {modalError ? (
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
            <p className="pl-[70px]">{`Your data was not inactivate. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      ) : null}
    </LayoutMenu>
  );
};

export default memo(PromoDiscountView);
