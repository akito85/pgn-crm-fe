import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form } from "antd"; // Import Form
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import {
  getDetailTransferToReceipt,
  approveOrRejectTransferToReceipt,
  getListCategory,
  getAllApprovalList,
  getListApprovalById
} from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailTransferToReceipt from "./DetailTransferToReceipt";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import TableRBI from "../../../../../components/TableRBI";
import { getReceiptListColumns } from "./ReceiptListColumns";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";

const ListDetailTransferToReceipt = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm(); // Initialize Form
  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const id = location?.state?.id;
  const [dataHeader, setDataHeader] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);

  // Tabs
  const [tabData] = useState([
    { value: "Transfer to Receipt" },
    { value: "Approval" },
    { value: "Attachment" },
  ]);

  const {
    loading,
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail
  } = useSelector((state) => state.transferToReceipt);

  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  // Table state (for receipt list)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  useEffect(() => {
    if (id) {
      dispatch(getDetailTransferToReceipt(id));
      dispatch(getAllApprovalList());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (data_detail && data_detail.transferToReceipt?.appHierId) {
      setSelectedHierarchy(data_detail.transferToReceipt.appHierId);
      form.setFieldsValue({ apphierId: data_detail.transferToReceipt.appHierId }); // Set Form Value
    }

    if (data_detail) {
      // Map attachment data if available
      const dataAttachment = (data_detail?.attachmentDtoList || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }
      );
      setListDataAttachment(dataAttachment);
      // Assuming dataHeader comes from data_detail directly or a property
      // Adjust this based on actual API response structure for Transfer To Receipt
      setDataHeader(data_detail.transferToReceipt);
    }
  }, [data_detail, form]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const columnsReceipt = useMemo(() => {
    return getReceiptListColumns({
      page,
      pageSize,
      actionType: "none",
    });
  }, [page, pageSize]);

  const onChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Transfer to Receipt":
        return (
          <>
            <DetailTransferToReceipt data_detail={dataHeader} />
            <BaseContainer header={"RECEIPT INFORMATION"}>
              <TableRBI
                columns={columnsReceipt}
                dataSource={IndexReceipt(dataHeader?.receiptList || [], page, pageSize).slice((page - 1) * pageSize, page * pageSize)}
                pagination={false}
                tableScrolled={{ x: 1000 }}
                // Providing required props for TableRBI if it handles pagination internally or display
                current={page}
                pageSize={pageSize}
                totalData={dataHeader?.receiptList?.length || 0}
                onChange={onChangePage}
                onSizeChanger={onChangePage}
              />
            </BaseContainer>
          </>
        );
      case "Approval":
        return (
          <div className="mt-5">
            <BaseContainer header={"TRANSFER TO RECEIPT APPROVAL"}>
              <Form form={form}>
                <ApprovalComponentGeneral
                  dataTable={appHierDataDetail}
                  dataOption={appHierOptions}
                  selectedHierarchy={selectedHierarchy}
                  updateSelectedHierarchy={setSelectedHierarchy}
                  disableSelect={true}
                />
              </Form>
            </BaseContainer>
          </div>
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="transferToReceipt"
              dispatch={dispatch}
              getAPICategory={getListCategory}
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment Warranty",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_RECEIPT,
      breadcrumbName: "Transfer to Receipt",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSFER_TO_RECEIPT,
      breadcrumbName: "Detail Transfer to Receipt",
    },
  ];

  const handleConfirm = (res, handleClear) => {
    // Reuse existing logic from setting.js if applicable, or migrate to transferToReceipt.js
    // For now assuming we still use setting slice for approval actions or need to migrate them
    const data = {
      id: id,
      remark: res.remark,
      approvalId: data_detail?.tApprovalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    // Check if we need to use a different action for Transfer to Receipt
    dispatch(approveOrRejectTransferToReceipt({ body: data }));
    handleClear();
    setModalApprove(false);
  };

  const handleCancel = () => {
    setModalApprove(false);
  };

  return (
    <div>
      <BreadCrumb routes={routes} />
      <div>
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />
        {renderSection(segmentedPage)}
      </div>

      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Transfer To Receipt"}
        named={dataHeader?.id}
      />

      <div className="flex mt-[30px] justify-between py-5">
        <ButtonComponent
          type={"submit"}
          onClick={() => navigate(-1)}
          icon={
            <LeftOutlined
              style={{
                color: "#fff",
                fontSize: 24,
                justifyItems: "center",
              }}
            />
          }
        >
          Back
        </ButtonComponent>

        {isShowButton === true ? (
          <div className="flex align-middle gap-5">
            <ButtonComponent
              type="reject"
              onClick={() => {
                setModalApprove(true);
                setApproveOrReject("reject");
              }}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type="approve"
              onClick={() => {
                setModalApprove(true);
                setApproveOrReject("approve");
              }}
            >
              Approve
            </ButtonComponent>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const IndexReceipt = (data, page, pageSize) => {
  return data.map((item, index) => {
    return {
      ...item,
      key: index,
      no: (page - 1) * pageSize + index + 1
    }
  })
}

export default ListDetailTransferToReceipt;
