import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { dateFormatting } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";
import TableRBI from "../../../../../components/TableRBI";
import { columnMutation } from "./ColumnConfig/MutationColumns";
import { configApp } from "../../../../../constants/configApp";
import { getCurrencyDDL } from "../../../../../redux/slices/receipt_collection/receipt";
import SearchBar from "../../../../../components/SearchBar";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import SectionCard from "../../../../../components/SectionCard";
import StatusComponent from "../../../../../components/StatusComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { showModalError } from "../../../../../redux/slices/general_slice";
import { WARRANTY_APPROVAL_STATUS } from "../../../../../constants/warranty";
import { 
    getDetailWarrantyMutation,
    deleteMutation,
    getMutationApprovalHistory,
    getPaymentWarrantyPartnerBranchList,
    submitApproval,
    getServiceAgreementByAccountId
} from "../../../../../redux/slices/receipt_collection/warranty";
import ModalMutation from "./Modal/ModalMutation";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const DetailWarranty = ({ data_detail }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { dataMutation, loadingMutation, dataApprovalHistory, dataPaymentWarrantyPartnerBranch, dataServiceAgreement } = useSelector((state) => state.warranty);
  const { currencyDDL } = useSelector((state) => state.receipt);
  const [selectedSA, setSelectedSA] = useState({});
  const [selectedBranchName, setSelectedBranchName] = useState(null);
  const [isModalMutationOpen, setIsModalMutationOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedRecordDelete, setSelectedRecordDelete] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [isModalApprovalOpen, setIsModalApprovalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [selectedMutationRecord, setSelectedMutationRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});

  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      const nextState = { ...prevState };
      if (selectedKeys[0]) {
        nextState[dataIndex] = selectedKeys[0];
      } else {
        delete nextState[dataIndex];
      }
      if (prevState[dataIndex] !== selectedKeys[0]) setPage(1);
      return nextState;
    });
  }, []);

  const handleGlobalSearch = useMemo(() => 
    debounce((value) => {
      setSearchText(value);
      setSearchedColumn(value ? "all" : "");
      setSearch((prevState) => {
        const nextState = { ...prevState };
        if (value) {
          nextState.all = value;
        } else {
          delete nextState.all;
        }
        setPage(1);
        return nextState;
      });
    }, 500),
    []
  );

  const handleAdvanceSearch = (searchData) => {
    setSearch((prevState) => ({
        ...prevState,
        advanceSearch: searchData,
    }));
    setPage(1);
  };

  useEffect(() => {
    if (data_detail?.accountId) {
      dispatch(getServiceAgreementByAccountId({ id: data_detail.accountId }));
    }
    dispatch(getCurrencyDDL());
  }, [dispatch, data_detail?.accountId]);

  useEffect(() => {
    const saList = Array.isArray(dataServiceAgreement?.result) ? dataServiceAgreement.result : [];
    if (saList.length > 0 && (data_detail?.serviceAgreementNumber || data_detail?.saNumber)) {
      const saNumberValue = data_detail?.serviceAgreementNumber || data_detail?.saNumber;
      const foundSA = saList.find(sa => sa.saNumber === saNumberValue);
      if (foundSA) {
        setSelectedSA(foundSA);
      } else {
        setSelectedSA({});
      }
    }
  }, [dataServiceAgreement, data_detail]);

  useEffect(() => {
    if (data_detail?.issuerBankId) {
      dispatch(getPaymentWarrantyPartnerBranchList(data_detail.issuerBankId));
    }
  }, [dispatch, data_detail?.issuerBankId]);

  useEffect(() => {
    if (dataPaymentWarrantyPartnerBranch?.data || Array.isArray(dataPaymentWarrantyPartnerBranch)) {
      const branchArray = dataPaymentWarrantyPartnerBranch?.data || dataPaymentWarrantyPartnerBranch || [];
      const saBranchId = data_detail?.issuerBranchId || data_detail?.issuerBranch;
      const foundBranch = branchArray.find(item => item.id == saBranchId);
      if (foundBranch) {
        setSelectedBranchName(foundBranch.branchName);
      } else {
        setSelectedBranchName(null);
      }
    }
  }, [dataPaymentWarrantyPartnerBranch, data_detail]);

  useEffect(() => {
    if (data_detail?.id) {
      dispatch(getDetailWarrantyMutation({ 
        id: data_detail.id, 
        page, 
        pageSize,
        search: encodeURIComponent(JSON.stringify(search))
      }));
    }
  }, [dispatch, data_detail?.id, page, pageSize, search]);

  const fetchMutation = () => {
    if (data_detail?.id) {
      dispatch(getDetailWarrantyMutation({ 
        id: data_detail.id, 
        page, 
        pageSize,
        search: encodeURIComponent(JSON.stringify(search))
      }));
    }
  };

  const handleEdit = (record) => {
    const normalizedRecord = { ...record, id: record.id };
    setSelectedRecord(normalizedRecord);
    setModalType("update");
    setIsModalMutationOpen(true);
  };

  const handleDelete = (record) => {
    const normalizedRecord = { ...record, id: record.id };
    setSelectedRecordDelete(normalizedRecord);
    setModalDelete(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteMutation({ id: selectedRecordDelete.id  }))
      .unwrap()
      .then(() => {
        setModalDelete(false);
        fetchMutation();
      });
  };

  const handleCreate = () => {
    setSelectedRecord(null);
    setModalType("create");
    setIsModalMutationOpen(true);
  };

  useEffect(() => {
    if (dataApprovalHistory && (dataApprovalHistory?.dataApprover || dataApprovalHistory?.dataHistory)) {
      setDataApprovalHistoryFix({
        dataApprover: {
          mutation: dataApprovalHistory?.dataApprover?.WARRANTY_MUTATION?.length ? dataApprovalHistory.dataApprover.WARRANTY_MUTATION :
                   (dataApprovalHistory?.dataApprover?.WARRANTY_HOLD?.length ? dataApprovalHistory.dataApprover.WARRANTY_HOLD :
                   (dataApprovalHistory?.dataApprover?.WARRANTY_RELEASE?.length ? dataApprovalHistory.dataApprover.WARRANTY_RELEASE :
                   (dataApprovalHistory?.dataApprover?.WARRANTY_REFUND?.length ? dataApprovalHistory.dataApprover.WARRANTY_REFUND : [])))
        },
        dataHistory: {
          mutation: dataApprovalHistory?.dataHistory?.WARRANTY_MUTATION?.length ? dataApprovalHistory.dataHistory.WARRANTY_MUTATION :
                   (dataApprovalHistory?.dataHistory?.WARRANTY_HOLD?.length ? dataApprovalHistory.dataHistory.WARRANTY_HOLD :
                   (dataApprovalHistory?.dataHistory?.WARRANTY_RELEASE?.length ? dataApprovalHistory.dataHistory.WARRANTY_RELEASE :
                   (dataApprovalHistory?.dataHistory?.WARRANTY_REFUND?.length ? dataApprovalHistory.dataHistory.WARRANTY_REFUND : [])))
        },
      });
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data).filter(key => data[key].length > 0);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };


  const handleHistory = async (record) => {
    try {
      await dispatch(getMutationApprovalHistory({ id: record.id })).unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
      dispatch(showModalError({
        title: "Failed to Load History",
        description: error?.message || "Unable to load approval history. Please try again."
      }));
      console.error('Failed to load mutation approval history:', error);
    }
  };

  const handleApproveMutation = (record) => {
    setSelectedMutationRecord(record);
    setApprovalAction("APPROVE");
    setIsModalApprovalOpen(true);
  };

  const handleRejectMutation = (record) => {
    setSelectedMutationRecord(record);
    setApprovalAction("REJECT");
    setIsModalApprovalOpen(true);
  };

  const onFinishMutationApproval = async (values, clearForm) => {
    const body = {
      approvalId: data_detail?.approvalId ,
      id: selectedMutationRecord?.id  || 0,
      action: approvalAction,
      remark: values.remark,
    };

    dispatch(submitApproval({ body }))
      .unwrap()
      .then(() => {
        setIsModalApprovalOpen(false);
        clearForm();
        fetchMutation();
      })
      .catch(() => {
        // Error is handled in thunk
      });
  };

  return (
    <div className="flex flex-col gap-4 pb-5 px-5 pt-5">
      <SectionCard title="ACCOUNT INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
            <DetailText label="Account Number">{data_detail?.accountNumber || "-"}</DetailText>
            <DetailText label="Account Name">{data_detail?.accountName || "-"}</DetailText>
            <DetailText label="Customer Number">{data_detail?.customerNumber || "-"}</DetailText>
            <DetailText label="Customer Name">{data_detail?.customerName || "-"}</DetailText>
            <DetailText label="Cost Center">{data_detail?.costCenterName || data_detail?.costCenter || "-"}</DetailText>
            <DetailText label="Customer Segment">{data_detail?.customerSegment || data_detail?.accountSegment || "-"}</DetailText>
            <DetailText label="Customer Group">{data_detail?.customerGroup || "-"}</DetailText>
            <DetailText label="Account Type">{data_detail?.accountType || "-"}</DetailText>
            <DetailText label="Clasification Type">{data_detail?.classificationType || "-"}</DetailText>
        </div>
      </SectionCard>

      <SectionCard title="SERVICE AGREEMENT DETAIL">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
            <DetailText label="Service Agreement Number">{data_detail?.serviceAgreementNumber || data_detail?.saNumber || "-"}</DetailText>
            <DetailText label="Service Agreement Reference">{data_detail?.serviceAgreementReference || data_detail?.saReference || selectedSA?.saReference || "-"}</DetailText>
            <DetailText label="Service Type">{data_detail?.serviceType || selectedSA?.serviceType?.value || "-"}</DetailText>
            <DetailText label="Type">{data_detail?.saType || data_detail?.type || selectedSA?.saType?.value || "-"}</DetailText>
            <DetailText label="PBG Type">{data_detail?.pbgType || selectedSA?.pjbgType?.value || "-"}</DetailText>
            <DetailText label="Service Agreement Date">{data_detail?.saDate ? moment(data_detail?.saDate).format("DD/MM/YYYY") : selectedSA?.saDate ? moment(selectedSA.saDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="Start Date">{data_detail?.saStartDate ? moment(data_detail?.saStartDate).format("DD/MM/YYYY") : selectedSA?.startDate ? moment(selectedSA.startDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="End Date">{data_detail?.saEndDate ? moment(data_detail?.saEndDate).format("DD/MM/YYYY") : selectedSA?.endDate ? moment(selectedSA.endDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="Commitment Date">{data_detail?.commitmentDate ? moment(data_detail?.commitmentDate).format("DD/MM/YYYY") : selectedSA?.commitmentDate ? moment(selectedSA.commitmentDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="Status Approval">
                {data_detail?.saStatusApproval || selectedSA?.approvalStatus ? <StatusComponent status={data_detail?.saStatusApproval || selectedSA?.approvalStatus} /> : "-"}
            </DetailText>
            <DetailText label="Status">
                {data_detail?.saStatus || selectedSA?.status ? <StatusComponent status={data_detail?.saStatus || selectedSA?.status} /> : "-"}
            </DetailText>
            <DetailText label="Description">{data_detail?.saDescription || selectedSA?.description || "-"}</DetailText>
        </div>
      </SectionCard>

      <SectionCard title="PAYMENT GUARANTEE INFORMATION">
        <div className="w-full grid grid-cols-5 gap-y-4 gap-x-4">
            <DetailText label="Type">{data_detail?.warrantyType || "-"}</DetailText>
            <DetailText label="Document Number">{data_detail?.documentNumber || "-"}</DetailText>
            <DetailText label="Document Date">{data_detail?.documentDate ? moment(data_detail?.documentDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="Issuer">{data_detail?.issuerBankName || data_detail?.issuerBank || data_detail?.partnerName || "-"}</DetailText>
            <DetailText label="Issuer Branch">{data_detail?.issuerBranchName || selectedBranchName || data_detail?.issuerBranch || "-"}</DetailText>
            <DetailText label="Currency">{data_detail?.currency || "-"}</DetailText>
            {data_detail?.warrantyType === "CASH" && (
              <>
                <DetailText label="Rate Type">{data_detail?.rateType || "-"}</DetailText>
                <DetailText label="Rate Date">{data_detail?.rateDate ? moment(data_detail?.rateDate).format("DD/MM/YYYY") : "-"}</DetailText>
                <DetailText label="Rate">{data_detail?.rateAmount?.toLocaleString() || data_detail?.rate?.toLocaleString() || "-"}</DetailText>
              </>
            )}
            <DetailText label="EFF Start Date">{data_detail?.effectiveStartDate ? moment(data_detail?.effectiveStartDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="EFF End Date">{data_detail?.effectiveEndDate ? moment(data_detail?.effectiveEndDate).format("DD/MM/YYYY") : "-"}</DetailText>
            <DetailText label="Term Of Claim Period">{data_detail?.claimPeriodTermValue ? `${data_detail?.claimPeriodTermValue} ${data_detail?.claimPeriodTermType || ''}` : "-"}</DetailText>
            <div className="col-span-3">
              <DetailText label="Description">{data_detail?.description || "-"}</DetailText>
            </div>
        </div>
      </SectionCard>

      <SectionCard title="MUTATION DATA INFORMATION">
        <div className="flex justify-end mb-4">
                {!data_detail?.isApprover && data_detail?.approvalStatus !== WARRANTY_APPROVAL_STATUS.WAITING_APPROVAL && (
                  <ButtonComponent type="submit" icon={<PlusOutlined />} onClick={() => setIsModalMutationOpen(true)}>
                    Create
                  </ButtonComponent>
                )}
        </div>
        <Spin spinning={loadingMutation}>
          <TableRBI
              dataSource={dataMutation?.content || []}
              columns={columnMutation(
                page, pageSize, null, searchedColumn, searchText, handleSearch, search, 
                handleEdit, handleDelete, handleHistory, 
                handleApproveMutation, handleRejectMutation,
                false, false, data_detail?.isApprover,
                dataMutation?.content || [],
                data_detail?.id
              )}
              fixedColumns={{ left: ["no"], right: ["action"] }}
              current={page}
              pageSize={pageSize}
              totalData={dataMutation?.page?.totalElements || 0}
              onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
              showExport={false}
              showAdvanceSearch={true}
              showSearchBar={true}
              onAdvanceSearch={handleAdvanceSearch}
              onSearch={(e) => handleGlobalSearch(e.target.value)}
              tableScrolled={{ x: 1200, y: 525 }}
          />
        </Spin>
      </SectionCard>

      <ModalMutation
        isOpen={isModalMutationOpen}
        handleCancel={() => setIsModalMutationOpen(false)}
        modalType={modalType}
        selectedRecord={selectedRecord}
        warrantyId={data_detail?.id}
        warrantyType={data_detail?.warrantyType}
        currencyDDL={currencyDDL}
        headerCurrency={data_detail?.currency}
        fetchMutation={fetchMutation}
      />

      <ModalHistory
        isOpen={openModalHistory && dataApprovalHistoryFix}
        handleClose={() => setOpenModalHistory(false)}
        header={"Approval History"}
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleConfirmDelete}
        width={500}
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <span className="text-lg font-bold">Confirmation</span>
          <span className="text-center">
            Are you sure want to delete this mutation ? <br />
            <b>{selectedRecordDelete?.mutationNumber || selectedRecordDelete?.id}</b>
          </span>
        </div>
      </ModalConfirm>

      <ModalApproveOrReject
        isOpen={isModalApprovalOpen}
        handleCloseModal={() => setIsModalApprovalOpen(false)}
        onFinish={onFinishMutationApproval}
        header={approvalAction === "APPROVE" ? "Approve" : "Reject"}
        approveOrReject={approvalAction === "APPROVE" ? "approve" : "reject"}
        menu="Payment Guarantee Mutation"
        named={selectedMutationRecord?.noDocumentMutation || "-"}
      />
    </div>
  );
};

DetailWarranty.propTypes = {
  data_detail: PropTypes.object
};

export default DetailWarranty;
