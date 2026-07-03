import React, { useEffect, useState } from "react";
import { Form, Spin } from "antd";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ProductInformationDetail from "./ProductDetail/ProductInformationDetail";
import ProductInformationLockHistory from "./ProductDetail/ProductInformationLockHistory";
import RequestInformation from "./ProductDetail/RequestInformation";
import ProductVersionInformation from "./ProductDetail/ProductVersionInformation";
import PricingLogInformationDetail from "../Pricing/Detail/PricingLogInformationDetail";
import AttachmentSectionForm from "../Pricing/Form/AttachmentSectionForm";
import ProductExtendTerminate from "./ProductDetail/ProductExtendTerminate";
import ProductDetailInformation from "./ProductDetail/ProductDetailInformation";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { listSectionInfoProductDetail } from "./utils";
import { dateFormatting } from "../../../../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  approvalExtendProductVersion,
  approvalInactiveProduct,
  approvalProductVersion,
  approvalTerminateProductVersion,
  getDetailProduct,
  getDetailProductVersion,
  getExtendTerminateHistory,
  getGrantedAccessProduct,
  getLockHistory,
  getProductVersionList,
} from "../../../../redux/slices/product_promo/product";
import moment from "moment";
import { bytesConverter } from "../../../../utils/bytesConverter";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import SVGIcon from "../../../../assets/Icon/index";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTabs from "../../../../components/Nx/NxTabs";

const routes = [
  {
    path: "",
    breadcrumbName: "Product & Promo",
  },
  {
    path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT,
    breadcrumbName: "Product",
  },
  {
    path: PRODUCT_PROMO_ROUTES.DETAIL_PRODUCT,
    breadcrumbName: "Detail Product",
  },
];
const type = "detail";
const listSectionInfo = [{ value: "Product" }, { value: "Lock History" }];
const listSectionInfoDetail = [{ value: "Product" }, { value: "Attachment" }];
const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { id } = location?.state || {};
  const {
    dataDetailProduct = {},
    dataDetailProductVersion = {},
    dataListLockHistory = [],
    dataListExtendTerminateHistory = [],
    dataListProductVersion = [],
    loadingProduct = false,
  } = useSelector((state) => state.product);
  const [idProductActive, setIdProductActive] = useState(0);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [typeProductInfo, setTypeProductInfo] = useState(
    listSectionInfo[0].value
  );
  const [typeProductDetail, setTypeProductDetail] = useState(245);
  const [typeProductDetailInfo, setTypeProductDetailInfo] = useState(
    listSectionInfoDetail[0].value
  );
  const [typeProductInfoDetailSection, setTypeProductInfoDetailSection] =
    useState(listSectionInfoProductDetail(typeProductDetail)[0].value);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [remark, setRemark] = useState("");
  const [dataProductInfo, setDataProductInfo] = useState({});
  const [dataProductDetail, setDataProductDetail] = useState({});
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [editableProduct, setEditableProduct] = useState(true);
  const [bodyApproval, setBodyApproval] = useState({
    type: null,
    isApprover: false,
    tappId: null,
    approvalDetail: null,
    approvalType: "",
  });
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [loadingApproval, setLoadingApproval] = useState(false);
  const showButtonApproval =
    bodyApproval.isApprover !== null && bodyApproval.isApprover;
  const stateActive =
    bodyApproval.type === "product" || bodyApproval.type === null;

  useEffect(() => {
    if (id) {
      dispatch(getDetailProduct({ id }));
      dispatch(getLockHistory({ id }));
      dispatch(getProductVersionList({ id }));
      dispatch(getGrantedAccessProduct("/product-promo/detail-product"))
    }
    // dispatch(getExtendTerminateHistory({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (dataDetailProduct?.id) {
      const status = dataDetailProduct.status;
      const statusApproval = dataDetailProduct.approvalStatus;
      setDataProductInfo({
        productName: dataDetailProduct.productName,
        productType: dataDetailProduct.productTypeName,
        productClass: dataDetailProduct.productClassName,
        serviceType: dataDetailProduct.serviceTypeName,
        pricing: dataDetailProduct.pricing,
        startDate: dataDetailProduct.startDate,
        endDate: dataDetailProduct.endDate,
        productDescription: dataDetailProduct.productDescription,
        lockedBy: dataDetailProduct.lockedBy,
        status: status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : status,
        statusApproval: statusApproval
          ? statusApproval.charAt(0).toUpperCase() +
            statusApproval.slice(1).toLowerCase()
          : statusApproval,
      });
      setIdProductActive(dataDetailProduct.lastVersion);
      setDataProductDetail(dataDetailProduct.currentProductVersion);
      setDataLogInformation({
        recordId: dataDetailProduct?.currentProductVersion?.id,
        createdDate: dataDetailProduct?.currentProductVersion?.createdDate,
        createdBy: dataDetailProduct?.currentProductVersion?.createdBy,
        updatedDate: dataDetailProduct?.currentProductVersion?.updatedDate,
        updatedBy: dataDetailProduct?.currentProductVersion?.updatedBy,
      });
      setEditableProduct(dataDetailProduct.isEditable);
      setTypeProductDetail(dataDetailProduct.productType);
      setBodyApproval({
        id: dataDetailProduct.id || null,
        type: "product",
        isApprover: dataDetailProduct.isApprover || null,
        tappId: dataDetailProduct.tappId || null,
        approvalDetail: dataDetailProduct.approvalDetail || null,
        approvalType: dataDetailProduct.approvalType || null,
      });
      dispatch(
        getExtendTerminateHistory({
          id: dataDetailProduct?.currentProductVersion?.id,
        })
      );
    }
  }, [dataDetailProduct, dispatch]);

  useEffect(() => {
    if (dataDetailProductVersion?.id) {
      dispatch(getExtendTerminateHistory({ id: dataDetailProductVersion?.id }));
      setDataProductDetail(dataDetailProductVersion);
      setDataLogInformation({
        recordId: dataDetailProductVersion.id,
        createdDate: dataDetailProductVersion.createdDate,
        createdBy: dataDetailProductVersion.createdBy,
        updatedDate: dataDetailProductVersion.updatedDate,
        updatedBy: dataDetailProductVersion.updatedBy,
      });
      if (dataDetailProductVersion.isApprover) {
        setBodyApproval({
          id: dataDetailProductVersion.id || null,
          type: "product-version",
          isApprover: dataDetailProductVersion.isApprover || null,
          tappId: dataDetailProductVersion.tappId || null,
          approvalDetail: dataDetailProductVersion.approvalDetail || null,
          approvalType: dataDetailProductVersion.approvalType || null,
        });
      }
    }
  }, [dataDetailProductVersion, dispatch]);

  useEffect(() => {
    if (dataProductDetail?.id) {
      setListDataAttachment(
        (dataProductDetail?.mAttachments || []).map((attachData) => ({
          ...attachData,
          createdDate: attachData.createdDate
            ? moment(attachData.createdDate).format(dateFormatting.dateTime)
            : "",
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [dataProductDetail]);

  const handleProductInfoDetailSection = (e) => {
    setTypeProductInfoDetailSection(e.target.value);
  };
  const handleModalConfirmation = (type) => {
    setModalConfirm(true);
    setApproveOrReject(type);
  };
  const handleCloseModalApproveReject = () => {
    // Guard against closing while the approve/reject request is still in flight.
    if (loadingApproval) return;
    setRemark("");
    setModalConfirm(false);
    form.resetFields();
  };
  const handleConfirm = (formValue, handleClear) => {
    const body = {
      id: bodyApproval.id,
      description: formValue?.remark,
      approvalId: bodyApproval.tappId,
      action: approveOrReject === "Approve" ? "APPROVE" : "REJECT",
    };
    // console.log(body);
    setLoadingApproval(true);
    switch (bodyApproval.approvalType) {
      case "INACTIVE_PRODUCT":
        return dispatch(approvalInactiveProduct({ body }))
          .unwrap()
          .then((res) => {
            handleClear();
            setRemark("");
            setModalConfirm(false);
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              // console.log(error);
              setBodyError({ message, body: { ...formValue }, handleClear });
              setModalError(true);
            }
          })
          .finally(() => {
            setLoadingApproval(false);
          });
      case "PRODUCT_VERSION":
        return dispatch(approvalProductVersion({ body }))
          .unwrap()
          .then((res) => {
            handleClear();
            setRemark("");
            setModalConfirm(false);
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              // console.log(error);
              setBodyError({ message, body: { ...formValue }, handleClear });
              setModalError(true);
            }
          })
          .finally(() => {
            setLoadingApproval(false);
          });
      case "EXTEND_PRODUCT_VERSION":
        return dispatch(approvalExtendProductVersion({ body }))
          .unwrap()
          .then((res) => {
            handleClear();
            setRemark("");
            setModalConfirm(false);
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              // console.log(error);
              setBodyError({ message, body: { ...formValue }, handleClear });
              setModalError(true);
            }
          })
          .finally(() => {
            setLoadingApproval(false);
          });
      case "TERMINATE_PRODUCT_VERSION":
        return dispatch(approvalTerminateProductVersion({ body }))
          .unwrap()
          .then((res) => {
            handleClear();
            setRemark("");
            setModalConfirm(false);
          })
          .catch((error) => {
            if (Math.floor((error.response.data.code || 0) / 100) === 5) {
              const message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              // console.log(error);
              setBodyError({ message, body: { ...formValue }, handleClear });
              setModalError(true);
            }
          })
          .finally(() => {
            setLoadingApproval(false);
          });
      default:
        setLoadingApproval(false);
        return;
    }
  };
  const handleActiveProduct = (record) => {
    dispatch(getDetailProductVersion({ id: record.id }));
    setIdProductActive(record.version);
  };
  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleConfirm(bodyError?.body, bodyError?.handleClear);
    setModalError(false);
    setBodyError({});
  };
  return (
    <>
      <Spin
        spinning={loadingProduct}
        className={"w-full top-20"}
        tip={"Loading..."}
      >
        <div className="flex flex-col gap-y-4">
          <BreadCrumb routes={routes} />
          {bodyApproval.isApprover &&
          bodyApproval.approvalType &&
          bodyApproval.approvalType !== "PRODUCT_VERSION" ? (
            <BaseContainer
              header={`${
                bodyApproval.approvalType
                  ? bodyApproval.approvalType.split("_")[0]
                  : "CREATE"
              } REQUEST INFORMATION`}
            >
              <RequestInformation
                data={
                  bodyApproval.approvalDetail !== null
                    ? bodyApproval.approvalDetail
                    : {}
                }
                status={bodyApproval.approvalType}
              />
            </BaseContainer>
          ) : null}
          <NxCardContainer
            header={"PRODUCT INFORMATION"}
            type={stateActive ? "tabs" : undefined}
            element={
              stateActive ? (
                <NxTabs
                  items={[
                    {
                      key: listSectionInfo[0].value,
                      label: listSectionInfo[0].value,
                      children: <ProductInformationDetail data={dataProductInfo} />,
                    },
                    {
                      key: listSectionInfo[1].value,
                      label: listSectionInfo[1].value,
                      children: (
                        <ProductInformationLockHistory
                          data={dataListLockHistory || []}
                          idProduct={id}
                        />
                      ),
                    },
                  ]}
                  activeKey={typeProductInfo}
                  onChange={setTypeProductInfo}
                />
              ) : undefined
            }
            withoutPadding={stateActive}
            hideChildren={stateActive}
          >
            {!stateActive ? <ProductInformationDetail data={dataProductInfo} /> : null}
          </NxCardContainer>
          {stateActive ? (
            <ProductVersionInformation
              idProduct={id}
              dataProductInfo={dataProductInfo}
              editableProduct={editableProduct}
              dataProductVersion={dataListProductVersion}
              updateActiveProduct={handleActiveProduct}
            />
          ) : null}
          <NxCardContainer
            header={"PRODUCT DETAIL INFORMATION"}
            type={"tabs"}
            element={
              <NxTabs
                items={[
                  {
                    key: listSectionInfoDetail[0].value,
                    label: listSectionInfoDetail[0].value,
                  },
                  {
                    key: listSectionInfoDetail[1].value,
                    label: listSectionInfoDetail[1].value,
                  },
                ]}
                activeKey={typeProductDetailInfo}
                onChange={setTypeProductDetailInfo}
              />
            }
            withoutPadding
          >
            <div className="flex flex-col gap-3 p-4">
              <div className="flex align-middle gap-2">
                <p className="text-[15px] font-semibold text-text-color-semibold">
                  Version:
                </p>
                <p className="text-[15px] font-semibold text-primary">
                  {idProductActive}
                </p>
              </div>
              <div
                style={{
                  display:
                    typeProductDetailInfo !== listSectionInfoDetail[0].value
                      ? "none"
                      : undefined,
                }}
              >
                <ProductDetailInformation
                  dataProductInfo={{
                    ...dataProductInfo,
                    startDate: dataProductInfo.startDate
                      ? moment(dataProductInfo.startDate, "DD MMM YYYY").format(
                          "YYYY-MM-DD"
                        )
                      : "",
                    endDate: dataProductInfo.endDate
                      ? moment(dataProductInfo.endDate, "DD MMM YYYY").format(
                          "YYYY-MM-DD"
                        )
                      : "",
                  }}
                  dataProductDetail={dataProductDetail}
                  section={typeProductInfoDetailSection}
                  options={listSectionInfoProductDetail(typeProductDetail)}
                  handleChangeOption={handleProductInfoDetailSection}
                />
              </div>
              <div
                style={{
                  display:
                    typeProductDetailInfo !== listSectionInfoDetail[1].value
                      ? "none"
                      : undefined,
                }}
              >
                <AttachmentSectionForm
                  type={type}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                />
              </div>
            </div>
          </NxCardContainer>
          <NxCardContainer header={"HISTORY LOG INFORMATION"}>
            <PricingLogInformationDetail data={dataLogInformation} />
          </NxCardContainer>
          {stateActive ? (
            <ProductExtendTerminate data={dataListExtendTerminateHistory || []} />
          ) : null}
          <div
            className={`flex w-full${
              showButtonApproval ? " justify-between" : ""
            } align-middle my-3`}
          >
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
              <div className="flex align-middle gap-3">
                <ButtonComponent
                  type="reject"
                  onClick={() => handleModalConfirmation("Reject")}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type="approve"
                  onClick={() => handleModalConfirmation("Approve")}
                >
                  Approve
                </ButtonComponent>
              </div>
            ) : null}
          </div>

          {/* Modal Approve/Reject*/}
          <ModalApproveOrReject
            isOpen={modalConfirm}
            handleCloseModal={handleCloseModalApproveReject}
            onFinish={handleConfirm}
            header={`${approveOrReject}`}
            approveOrReject={approveOrReject}
            menu={bodyApproval.approvalType === "INACTIVE_PRODUCT"
            ? "Product"
            : "Product Version"}
            named={`${dataDetailProduct.productName}`}
            loading={loadingApproval}
            // isOpen={modalConfirm}
            // header={`${approveOrReject} information`}
            // message={`Are you sure you want to ${approveOrReject} ${
            //   bodyApproval.approvalType === "INACTIVE_PRODUCT"
            //     ? "Product"
            //     : "Product Version"
            // }?`}
            // width={1000}
            // handleCancel={handleCloseModalApproveReject}
            // footer={
            //   <div className={"w-full flex justify-end gap-5"}>
            //     <ButtonComponent
            //       type={"default"}
            //       onClick={handleCloseModalApproveReject}
            //     >
            //       Cancel
            //     </ButtonComponent>
            //     <ButtonComponent
            //       form={"formApproveReject"}
            //       htmlType={"submit"}
            //       type={"submit"}
            //       border={false}
            //     >
            //       Confirm
            //     </ButtonComponent>
            //   </div>
            // }
          />
            {/* <Form name="formApproveReject" form={form} onFinish={handleConfirm}>
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
            </Form> */}
          {/* </ModalApproveOrReject> */}

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
              <p className="pl-[70px]">{`Your data was not ${
                approveOrReject === "Approve" ? "approved" : "rejected"
              }. ${bodyError.message}.`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        </div>
      </Spin>
    </>
  );
};

export default ProductDetail;
