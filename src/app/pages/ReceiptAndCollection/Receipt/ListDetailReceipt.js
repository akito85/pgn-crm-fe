/* eslint-disable default-case */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import DetailReceipt from "./DetailReceipt";
import {
  approveOrRejectHoldReceipt,
  approveOrRejectReceipt,
  approveOrRejectReleaseReceipt,
  approveOrRejectReverseReceipt,
  createAllocation,
  getReceiptDetail,
} from "../../../../redux/slices/receipt_collection/receipt";
import RadioTabs from "../../../../components/RadioTabs";
import BreadCrumb from "../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../routes/Receipt&Collection/rc_routes";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined, SyncOutlined } from "@ant-design/icons";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { hasValue } from "../../../../utils";
import { configApp } from "../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import moment from "moment";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../redux/slices/general_slice";
import SVGIcon from "../../../../assets/Icon/index.js";
import DetailAttachment from "./DetailAttachment.js";

const ListDetailReceipt = () => {
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;

  // use state
  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [isInsert, setIsInsert] = useState(false);
  const [balance, setBalance] = useState(0);
  const [dataAllocation, setDataAllocation] = useState([]);

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    { value: "Receipt" },
    { value: "Attachment" },
  ]);

  const { loading, data_detail } = useSelector((state) => state.receipt);
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  // const [disabled, setdisabled] = useState((disabled = true));
  const [modalError, setModalError] = useState(false);

  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  useEffect(() => {
    dispatch(getReceiptDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.id) {
      const dataAttachment = (data_detail?.attachmentDtoList || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.type,
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
    }
  }, [data_detail, dispatch, id]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

  const handleCancel = () => {
    setModalConfirm(false);
  };

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    const data = {
      id: id,
      remark: res.remark,
      approvalId: data_detail?.approvalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    const category = data_detail?.approvalDto?.category;

    if (category === "RECEIPT_HOLD") {
      dispatch(approveOrRejectHoldReceipt({ body: data }));
    } else if (category === "RECEIPT_RELEASE") {
      dispatch(approveOrRejectReleaseReceipt({ body: data }));
    } else if (category === "RECEIPT_REVERSE") {
      dispatch(approveOrRejectReverseReceipt({ body: data }));
    } else {
      dispatch(approveOrRejectReceipt({ body: data }));
    }

    setModalConfirm(false);
    handleClear();
  };
  const showButtonApproval = data_detail?.approvalDto?.isApprover;

  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Receipt":
        return (
          <DetailReceipt
            data_detail={data_detail}
            id={id}
            setIsInsert={setIsInsert}
            setBalance={setBalance}
            setAllocationTable={setDataAllocation}
          />
        );
      // case "Draft":
      //   return (
      //     <DetailBank
      //       data_detail={dataTextDraft}
      //       id={id}
      //       key={"draft"}
      //       data_req={data_detail_draft?.tApprovalDto}
      //       // dataAccountInfoPaging={dataAccountInfoPaging}
      //       dataSource={dataSourceDraft}
      //       data_job={data_job}
      //       data_position={data_position}
      //       totalData={totalElementDraft}
      //     />
      //   );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <DetailAttachment
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="receipt"
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_RECEIPT,
      breadcrumbName: "Receipt",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle confirm retry
  const handleConfirmRetry = () => {
    if (bodyError?.action === "GET_RECEIPT_DETAIL") {
      dispatch(getReceiptDetail(id));
    } else {
    }
  };

  // handle retry
  const handleRetry = () => {
    handleConfirmRetry();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
    // setBodyError({});
  };

  const createAllocationDetail = () => {
    const body = {
      receiptId: id,
      allocationDtoList: dataAllocation
        ?.filter((item) => hasValue(item?.allocationNumber) === false)
        ?.map((item) => ({
          id: item?.id,
          allocationAmount: item?.allocationAmount,
        })),
    };
    dispatch(createAllocation(body));
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <div className="w-full gap-5">
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />

        {renderSection(segmentedPage)}
      </div>

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

        {showButtonApproval ? (
          <div className="flex align-middle gap-5">
            <ButtonComponent
              type="reject"
              onClick={() => {
                setModalConfirm(true);
                setApproveOrReject("reject");
              }}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type="approve"
              onClick={() => {
                setModalConfirm(true);
                setApproveOrReject("approved");
              }}
            >
              Approve
            </ButtonComponent>
          </div>
        ) : (
          <div className="w-full flex justify-end gap-3">
            <div className="flex align-middle gap-5">
              <ButtonComponent
                type={"submit"}
                onClick={() => ""}
                icon={
                  <SyncOutlined
                    style={{
                      color: "#fff",
                      fontSize: 22,
                      justifyItems: "center",
                    }}
                  />
                }
                disabled={isInsert || balance < 0}
              >
                Reverse
              </ButtonComponent>
            </div>
            {dataAllocation?.filter(
              (item) => hasValue(item?.allocationNumber) === false
            )?.length > 0 && (
                <div className="flex align-middle gap-5">
                  <ButtonComponent
                    type={"submit"}
                    onClick={createAllocationDetail}
                    disabled={isInsert || balance < 0}
                  >
                    Submit
                  </ButtonComponent>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Modal Approve/Reject*/}

      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Receipt"}
        named={data_detail?.receiptNumber}
      // named={
      //   data_detail_draft?.calendarDetailDto?.id === id
      //     ? data_detail_draft?.calendarDetailDto?.beginCycle
      //     : data_detail?.calendarDetailDto?.beginCycle
      // }
      />
      {/* <ModalApproveOrReject
        key={modalConfirm ? true : false}
        isOpen={modalConfirm}
        header={`${approveOrReject} information`}
        message={`Are you sure you want to ${approveOrReject} Receipt?`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent type={"default"} onClick={handleCancel}>
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
      {/** Modal Retry */}
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
          <p className="pl-[70px]">
            {bodyError?.response?.data?.message?.toString()}
          </p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </LayoutMenu>
  );
};

export default ListDetailReceipt;
