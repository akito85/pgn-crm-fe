import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Form, Spin } from "antd";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import {
  getListServiceAgreement,
  getApprovalList,
  getDetailApprovalInactive,
  inactiveSa,
  deleteDraftSa,
  getApprovalHistory,
  downloadServiceAgreement,
} from "../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import ModalDeleteDraft from "./Modal/ModalDeleteDraft";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import ServiceAgreementTable from "./ServiceAgreementTable";
import ServiceAgreementApprovalModal from "./ServiceAgreementApprovalModal";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";

const ServiceAgreement = ({ idAccount, idCustomer, type }) => {
  const id = idAccount;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data,
    dataApprovalHistory = {},
    loading,
  } = useSelector((state) => state.accountServiceAgreement);

  const { access_account } = useSelector((state) => state.accountManagement);

  // Filtered access for actions
  const filteredArray = useMemo(() => {
    return {
      actionList: access_account?.actionList?.filter(
        (action) =>
          action.path.includes(
            "/account-management/account-standard/service-agreement/"
          ) &&
          !action.path.includes(
            "/account-management/account-standard/service-agreement/tos/"
          )
      ),
    };
  }, [access_account?.actionList]);

  const [tempFilters, setTempFilters] = useState([]);

  // State Table - Use infinite scroll pattern
  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Modal Inactivate
  const [formInactivate] = Form.useForm();
  const [modalActivate, setModalActivate] = useState(false);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [saId, setSaId] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [named, setNamed] = useState("");

  // Modal Delete Draft
  const [modalDeleteDraft, setModalDeleteDraft] = useState(false);

  // Modal Approval History
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});

  // modal approval
  const [showApprovalModal, setShowApprovalModal] = useState(false);


  // Data source with keys for table
  const dataSourceWithKeys = useMemo(() => {
    if (!data?.result || data.result.length === 0) return [];

    return data.result.map((item, index) => ({
      ...item,
      key: `${item.id}-${index}`,
      saServiceType: item?.serviceType,
      termsOfPaymentName: item?.termOfPayment,
    }));
  }, [data?.result]);

  // Calculate hasMore for infinite scroll
  const currentTotal = dataSourceWithKeys.length;
  const totalElements = data?.page?.totalElements || 0;
  const hasMore = currentTotal < totalElements;

  // Toolbar actions for header (custom Create action with required state)
  const toolbarActions = useMemo(
    () => [
      {
        action: "Download",
        render: (
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={20} color="#FFF" />}
            type="submit"
          >
            Download
          </ButtonComponent>
        )
      },
      {
        action: "Approve",
        render: (
          <ButtonComponent
            icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
            type="submit"
            onClick={() => setShowApprovalModal(true)}
          >
            Approval
          </ButtonComponent>
        )
      },
      {
        action: "Create",
        render: (
          <NavLink
            to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_MAIN}
            state={{
              idAccount: id,
              idCustomer: idCustomer,
              type: type,
              isMain: true,
              typeSa: "main",
              productTypeId: 245,
            }}
          >
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={20} />}
              type="submit"
              border={false}
            >
              Create
            </ButtonComponent>
          </NavLink>
        ),
      }

    ],
    [id, idCustomer, type]
  );

  // Handle download
  const handleDownload = () => {
    const body = {
      page,
      size: loadMoreSize,
      sort,
      inputFields: tempFilters,
      searchs: search,
      idAccount: id,
      idCustomer: idCustomer,
      type: type,
    }

    dispatch(downloadServiceAgreement({ body }))

  }

  // Handle refresh after approval
  const handleRefresh = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListServiceAgreement({
        id,
        search: reqSearch,
        sort,
        page: 1,
        pageSize: loadMoreSize,
      })
    );
    setPage(1);
  };

  // const toolbarActions = nxGetAccountActions({
  //   idAccount: id,
  //   idCustomer: idCustomer,
  //   createRoute: ACCOUNT_MANAGEMENT_ROUTES.CREATE_SERVICE_AGREEMENT_MAIN,
  //   updateRoute: ACCOUNT_MANAGEMENT_ROUTES.UPDATE_SERVICE_AGREEMENT,
  //   detailRoute: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_SERVICE_AGREEMENT,
  //   navigate,
  //   setShowApprovalModal,
  //   handleDownload

  // }) 

  // Effects
  useEffect(() => {
    dispatch(
      getGrantedAccessAccount(
        "/account-management/account-standard/service-agreement"
      )
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getApprovalList());
  }, [dispatch]);

  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getListServiceAgreement({ id, search: reqSearch, sort, page, pageSize: loadMoreSize })
    );
  }, [dispatch, id, page, loadMoreSize, search, sort]);

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.SERVICE_AGREEMENT || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_SERVICE_AGREEMENT || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.SERVICE_AGREEMENT || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_SERVICE_AGREEMENT || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  // Handlers
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
    const totalPages = data?.page?.totalPages || 0;
    const nextPage = page + 1;

    if (nextPage <= totalPages) {
      setPage(nextPage);
    }
  };

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Approval History
  const handleApprovalHistory = (recordId) => {
    dispatch(getApprovalHistory(recordId));
    setOpenModalHistory(true);
  };

  const handleOptions = () => {
    const historyData = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(historyData);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  // Inactivate handlers
  const handleOpenInactivate = (recordId, saNumber) => {
    setSaId(recordId);
    setNamed(saNumber);
    setActiveOrInactive("Inactivate");
    setModalActivate(true);
  };

  const handleCancelModalInactivate = () => {
    setModalActivate(false);
  };

  const handleSaveActivate = (e, handleClear) => {
    const body = {
      appHierId: e.approvalHierarchy,
      remark: e.remark,
      saId,
    };
    dispatch(inactiveSa({ body: body, activeOrInactive: activeOrInactive }))
      .unwrap()
      .then(() => {
        handleClear();
        setAppHierDataDetail([]);
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getListServiceAgreement({
            id,
            search: reqSearch,
            sort,
            page: 1,
            pageSize: loadMoreSize,
          })
        );
        setPage(1);
        setModalActivate(false);
      })
      .catch(() => {
        handleClear();
        setAppHierDataDetail([]);
        setModalActivate(false);
      });
  };

  // Delete Draft handlers
  const handleOpenDeleteDraft = (recordId) => {
    setSaId(recordId);
    setModalDeleteDraft(true);
  };

  const handleSubmitDeleteDraft = () => {
    dispatch(deleteDraftSa(saId))
      .unwrap()
      .then(() => {
        setModalDeleteDraft(false);
        setSaId("");
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getListServiceAgreement({
            id,
            search: reqSearch,
            sort,
            page: 1,
            pageSize: loadMoreSize,
          })
        );
        setPage(1);
      })
      .catch((err) => {
        setModalDeleteDraft(false);
        console.log(err);
      });
  };

  const handleClearDeleteDraft = () => {
    setModalDeleteDraft(false);
    setSaId("");
  };

  return (
    <>
      <Spin spinning={loading}>
        <NxCardContainer
          header="SERVICE AGREEMENT LIST"
          actionElement={
            <div className="flex gap-[20px]">
              <ToolbarAccount items={toolbarActions} advancedAccess={filteredArray} />
            </div>
          }
        >
          <ServiceAgreementTable
            data={dataSourceWithKeys}
            idAccount={id}
            idCustomer={idCustomer}
            type={type}
            totalElement={totalElements}
            page={page}
            onSort={onSort}
            handleOpenDeleteDraft={handleOpenDeleteDraft}
            handleOpenInactivate={handleOpenInactivate}
            handleApprovalHistory={handleApprovalHistory}
            handleLoadMore={handleLoadMore}
            hasMore={hasMore}
            searchText={searchText}
            search={search}
            searchedColumn={searchedColumn}
            searchInput={searchInput}
            handleSearch={handleSearch}
            loading={loading}
            filteredArray={filteredArray}
          />
        </NxCardContainer>
      </Spin>

      {/* Modal Delete Draft */}
      <ModalDeleteDraft
        setModalDeleteDraft={setModalDeleteDraft}
        modalDeleteDraft={modalDeleteDraft}
        handleClearDeleteDraft={handleClearDeleteDraft}
        handleOk={handleSubmitDeleteDraft}
      />

      {/* Modal Inactivate */}
      <ModalInactivateWithHierarchy
        dispatch={dispatch}
        getAPIOption={getApprovalList}
        getAPIDetail={getDetailApprovalInactive}
        selector="accountServiceAgreement"
        alertMessage={`Are you sure you want to inactivate Service Agreement with named ${named}?`}
        openModalInactivate={modalActivate}
        handleCloseModalInactivate={handleCancelModalInactivate}
        onFinish={handleSaveActivate}
      />

      {/* Modal Approval History */}
      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header="Approval History"
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      {/* Modal Approval */}
      <ServiceAgreementApprovalModal
        id={id}
        isOpen={showApprovalModal}
        handleCancel={() => setShowApprovalModal(false)}
        handleOpenModal={() => setShowApprovalModal(true)}
        afterFinish={handleRefresh}
      />
    </>
  );
};

export default ServiceAgreement;
