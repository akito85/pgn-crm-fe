import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import {
  approveOrRejectPaymentInactive,
  approveOrRejectPaymentItem,
  getDetailDraftItem,
  getDetailItem,
  getGLInformation,
} from "../../../../../redux/slices/receipt_collection/paymentItem";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailPaymentItem from "./DetailPaymentItem";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../components/BaseContainer";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailPaymentItem = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  // const [form] = Form.useForm();
  const id = location?.state?.id;
  const [remark, setRemark] = useState("");
  const [dataGL, setDataGL] = useState([]);
  const [dataGLDraft, setDataGLDraft] = useState([]);
  const [dataHeader, setDataHeader] = useState({});
  const [dataDraft, setDataDraft] = useState({});
  const [totalElement, setTotalElement] = useState(0);
  const [totalElementDraft, setTotalElementDraft] = useState(0);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataAttachmentDraft, setListDataAttachmentDraft] = useState([]);

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    { value: "Payment Method" },
    { value: "Attachment" },
  ]);

  const { loading, data_detail, data_GL, data_detail_draft } = useSelector(
    (state) => state.item
  );
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  // const [disabled, setdisabled] = useState((disabled = true));

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  // Use Effect
  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getGLInformation({ search: tempSearch, page, pageSize, sort, id })
    );
    dispatch(getDetailItem(id));
    dispatch(getDetailDraftItem(id));
  }, [search, page, pageSize, sort, dispatch, id]);

  // useEffect(() => {
  //   let tempSearch = "";
  //   for (const dataIndex in search) {
  //     if (Object.hasOwnProperty.call(search, dataIndex)) {
  //       const tempSearchText = search[dataIndex];
  //       if (tempSearchText) {
  //         tempSearch += `${dataIndex}~${tempSearchText},`;
  //       }
  //     }
  //   }
  //   tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
  //   dispatch(
  //     getGLInformation({ search: tempSearch, page, pageSize, sort, id })
  //   );
  // }, [search, page, pageSize, sort, dispatch, id]);

  useEffect(() => {
    if (
      id &&
      data_detail?.paymentItem?.id &&
      data_detail &&
      data_detail?.paymentItem?.id === id
    ) {
      //tableGL
      const dataTable = data_GL?.result?.map((item, index) => {
        return {
          glInformationId: item?.id,
          paymentItemId: item?.paymentItemId,
          key: (index + 1).toString(),
          id: item?.id,
          bankAccount: item?.bankAccount,
          bankAccountId: item?.bankAccountId,
          glAccount: item?.glAccount,
          startDate:
            item?.startDate === null
              ? moment()
              : moment(item?.startDate).clone(),
          endDate:
            item?.endDate === null ? moment() : moment(item?.endDate).clone(),
        };
      });
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
      setDataGL(dataTable);
      setDataHeader(data_detail?.paymentItem);
      setTotalElement(data_GL?.page?.totalElements);
    }
    if (
      id &&
      data_detail_draft?.paymentItemDto?.id === id &&
      data_detail_draft?.paymentItemDto?.id === data_detail?.paymentItem?.id
    ) {
      const dataTable =
        data_detail_draft?.paymentItemDto?.glInformationList?.map(
          (item, index) => {
            return {
              glInformationId: item?.id,
              paymentItemId: item?.paymentItemId,
              key: (index + 1).toString(),
              id: item?.id,
              bankAccount: item?.bankAccount,
              bankAccountId: item?.bankAccountId,
              glAccount: item?.glAccount,
              startDate:
                item?.startDate === null
                  ? moment()
                  : moment(item?.startDate).clone(),
              endDate:
                item?.endDate === null
                  ? moment()
                  : moment(item?.endDate).clone(),
            };
          }
        );
      const dataAttachment = (data_detail_draft?.attachmentDtoList || []).map(
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
      setListDataAttachmentDraft(dataAttachment);
      setDataGLDraft(dataTable);
      setTotalElementDraft(dataTable.lenght);
      setDataDraft(data_detail_draft?.paymentItemDto);
      setTabData([
        { value: "Payment Method" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  // JSON.parse(data_detail?.paymentItem?.triggerJson)

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Payment Method":
        return (
          <DetailPaymentItem
            key={"active"}
            data_detail={dataHeader}
            data_GL={dataGL}
            totalData={totalElement}
            data_req={data_detail?.tApprovalDto}
          />
        );
      case "Draft":
        return (
          <DetailPaymentItem
            key={"draft"}
            data_detail={dataDraft}
            data_GL={dataGLDraft}
            totalData={totalElementDraft}
            data_req={data_detail_draft?.tApprovalDto}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="item"
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              // getAPIGuard={getConfigFileRBIData}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_ITEM,
      breadcrumbName: "Payment Method",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    if (data_detail?.tApprovalDto?.approvalType === "INACTIVE_PAYMENT_METHOD") {
      const data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectPaymentInactive({ body: data }));
      handleClear();
      setModalApprove(false);
    } else {
      const data = {
        paymentItemId: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectPaymentItem({ body: data }));
      handleClear();
      setModalApprove(false);
    }
  };

  const handleCancel = () => {
    setRemark("");
    setModalApprove(false);
  };

  console.log(dataDraft, "datadraft");

  return (
    <div>
      <BreadCrumb routes={routes} />
      <div>
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />

        {renderSection(segmentedPage)}
      </div>

      {/* Modal Approve/Reject*/}
      {/* <ModalApproveOrReject
        key={modalApprove ? true : false}
        isOpen={modalApprove}
        header={`${approveOrReject} information`}
        message={`Are you sure you want to ${approveOrReject} payment method?`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              form={"formApproveRejcet"}
              onClick={handleCancel}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form={"formApproveRejcet"}
              type={"submit"}
              htmlType={"submit"}
              border={false}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form name="formApproveRejcet" onFinish={handleConfirm}>
          <Form.Item
            name={"remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
          >
            <InputComponent
              rows={1}
              placeholder="Type your remark"
              type="textarea"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        </Form>
      </ModalApproveOrReject> */}

      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Payment Method"}
        named={
          data_detail_draft?.paymentItemDto?.id === id
            ? data_detail_draft?.paymentItemDto?.name
            : data_detail?.paymentItem?.name
        }
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

export default ListDetailPaymentItem;
