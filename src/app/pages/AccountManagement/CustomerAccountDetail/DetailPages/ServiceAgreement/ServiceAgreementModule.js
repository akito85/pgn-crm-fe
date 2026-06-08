import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin } from "antd";
import { useNavigate } from "react-router-dom";
import {
  deleteDraftSa,
  getApprovalHistory,
  getApprovalList,
  getDetailApprovalInactive,
  inactiveSa,
} from "../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice";
import { getGrantedAccessAccount } from "../../../../../../redux/slices/account_management/accountManagement";
import NxHistoryModal from "../../../../../../components/Nx/NxHistoryModal";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import NxCardContainer from "../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../components/Nx/NxBaseContainer";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import ModalDeleteDraft from "./Modal/ModalDeleteDraft";
import ServiceAgreementApprovalModal from "./ServiceAgreementApprovalModal";
import ServiceAgreementTable from "./ServiceAgreementTable";
import {
  buildServiceAgreementTableActions,
  buildServiceAgreementToolbarActions,
} from "./serviceAgreementActionBuilders";
import { useServiceAgreementAccess } from "./hooks/useServiceAgreementAccess";
import { useServiceAgreementListController } from "./hooks/useServiceAgreementListController";
import { resolveVariantValue } from "./serviceAgreementVariants";

const ServiceAgreementModule = ({ idAccount, idCustomer, type, variant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const scope = useMemo(
    () => ({ idAccount, idCustomer, type }),
    [idAccount, idCustomer, type]
  );

  const grantedPath = resolveVariantValue(variant.access?.grantedPath, { scope });
  const actionBasePath = resolveVariantValue(variant.access?.actionBasePath, {
    scope,
  });
  const excludedActionPaths = resolveVariantValue(
    variant.access?.excludedActionPaths,
    { scope }
  ) || [];

  const { filteredAccess } = useServiceAgreementAccess({
    actionBasePath,
    excludedActionPaths,
  });

  const {
    dataSourceWithKeys,
    handleDownload,
    handleLoadMore,
    handleSearch,
    hasMore,
    loading,
    onSort,
    page,
    refresh,
    search,
    searchedColumn,
    searchInput,
    searchText,
    totalElements,
    isExistMain,
  } = useServiceAgreementListController({
    scope,
    listConfig: variant.list,
  });

  const { dataApprovalHistory = {} } = useSelector(
    (state) => state.accountServiceAgreement
  );

  const [modalActivate, setModalActivate] = useState(false);
  const [saId, setSaId] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [named, setNamed] = useState("");
  const [modalDeleteDraft, setModalDeleteDraft] = useState(false);
  const [showApprovalHistoryModal, setShowApprovalHistoryModal] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    if (!grantedPath) return;

    dispatch(getGrantedAccessAccount(grantedPath));
  }, [dispatch, grantedPath]);

  useEffect(() => {
    dispatch(getApprovalList());
  }, [dispatch]);

  useEffect(() => {
    if (dataApprovalHistory?.dataApprover) {
      setDataApprovalHistoryFix({
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.SERVICE_AGREEMENT || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_SERVICE_AGREEMENT || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.SERVICE_AGREEMENT || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_SERVICE_AGREEMENT || [],
        },
      });
      return;
    }

    setDataApprovalHistoryFix({});
  }, [dataApprovalHistory]);

  const handleApprovalHistoryModal = useCallback(
    (show, recordId = 0) => {
      if (show) {
        dispatch(getApprovalHistory(recordId));
        setShowApprovalHistoryModal(true);
        return;
      }

      setShowApprovalHistoryModal(false);
    },
    [dispatch]
  );

  const handleOpenInactivate = useCallback((recordId, saNumber) => {
    setSaId(recordId);
    setNamed(saNumber);
    setActiveOrInactive("Inactivate");
    setModalActivate(true);
  }, []);

  const handleCancelModalInactivate = () => {
    setModalActivate(false);
  };

  const handleSaveActivate = (values, handleClear) => {
    const body = {
      appHierId: values.approvalHierarchy,
      remark: values.remark,
      saId,
    };

    dispatch(inactiveSa({ body, activeOrInactive }))
      .unwrap()
      .then(() => {
        handleClear();
        setModalActivate(false);
        refresh();
      })
      .catch(() => {
        handleClear();
        setModalActivate(false);
      });
  };

  const handleOpenDeleteDraft = useCallback((recordId) => {
    setSaId(recordId);
    setModalDeleteDraft(true);
  }, []);

  const handleSubmitDeleteDraft = () => {
    dispatch(deleteDraftSa(saId))
      .unwrap()
      .then(() => {
        setModalDeleteDraft(false);
        setSaId("");
        refresh();
      })
      .catch(() => {
        setModalDeleteDraft(false);
        setSaId("");
      });
  };

  const handleClearDeleteDraft = () => {
    setModalDeleteDraft(false);
    setSaId("");
  };

  const toolbarActions = useMemo(
    () =>
      buildServiceAgreementToolbarActions({
        variant,
        scope,
        isExistMain,
        onDownload: handleDownload,
        onOpenApproval: () => setShowApprovalModal(true),
      }),
    [handleDownload, isExistMain, scope, variant]
  );

  const itemActions = useMemo(
    () =>
      buildServiceAgreementTableActions({
        handleApprovalHistory: (recordId) =>
          handleApprovalHistoryModal(true, recordId),
        handleOpenDeleteDraft,
        handleOpenInactivate,
        navigate,
        scope,
        variant,
      }),
    [handleOpenDeleteDraft, handleOpenInactivate, handleApprovalHistoryModal, navigate, scope, variant]
  );

  return (
    <>
      <Spin spinning={loading}>
        <NxCardContainer header="SERVICE AGREEMENT LIST">
          <NxBaseContainer border>
            <div className="flex gap-4">
              <ToolbarAccount items={toolbarActions} advancedAccess={filteredAccess} />
            </div>
            <ServiceAgreementTable
              data={dataSourceWithKeys}
              filteredArray={filteredAccess}
              handleLoadMore={handleLoadMore}
              hasMore={hasMore}
              itemActions={itemActions}
              loading={loading}
              onSort={onSort}
              page={page}
              search={search}
              searchedColumn={searchedColumn}
              searchInput={searchInput}
              searchText={searchText}
              handleSearch={handleSearch}
              totalElement={totalElements}
            />
          </NxBaseContainer>
        </NxCardContainer>
      </Spin>

      <ModalDeleteDraft
        setModalDeleteDraft={setModalDeleteDraft}
        modalDeleteDraft={modalDeleteDraft}
        handleClearDeleteDraft={handleClearDeleteDraft}
        handleOk={handleSubmitDeleteDraft}
      />

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

      <NxHistoryModal
        isOpen={showApprovalHistoryModal}
        handleClose={() => handleApprovalHistoryModal(false)}
        header="Approval History"
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      <ServiceAgreementApprovalModal
        id={idAccount}
        isOpen={showApprovalModal}
        handleCancel={() => setShowApprovalModal(false)}
        handleOpenModal={() => setShowApprovalModal(true)}
        afterFinish={refresh}
      />
    </>
  );
};

export default ServiceAgreementModule;
