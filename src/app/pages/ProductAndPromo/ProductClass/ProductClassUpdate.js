import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Form } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import { PRODUCT_PROMO_ROUTES } from "../../../../routes/product_promo/pp_routes";
import {
  getDetailProductClass,
  updateProductClass,
} from "../../../../redux/slices/product_promo/ProductClass/ProductClassSlice";
import BaseContainer from "../../../../components/BaseContainer";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import DetailText from "../../../../components/DetailText";
import InputComponent from "../../../../components/InputComponent";
import productPromoHttpService from "../../../../redux/services/productPromoHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";

const ProductClassUpdate = () => {
  // Selector
  const { data_detail, loading } = useSelector((state) => state.productClass);

  // Declaration
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;

  // State
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [data, setData] = useState({});
  const [description, setDescription] = useState("");
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getDetailProductClass(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail) {
      form.setFieldsValue({
        name: data_detail.name,
        description: data_detail.description,
      });
    }
  }, [id, form, data_detail]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Product & Promo",
    },
    {
      path: PRODUCT_PROMO_ROUTES.VIEW_PRODUCT_CLASS,
      breadcrumbName: "Product Class",
    },
    {
      path: PRODUCT_PROMO_ROUTES.UPDATE_PRODUCT_CLASS,
      breadcrumbName: "Update Product Class",
    },
  ];

  // Handle Confirmation
  const handleSave = useCallback(
    async (formValue) => {
      try {
        const dataValue = { ...formValue, productClassId: id };
        setData(dataValue);
        const validateValueObj = {
          body: dataValue,
          services: productPromoHttpService,
          endPoint: "/v1/dbs/api/productClass/validate-update",
          type: "update",
        };
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
        setModalConfirm(true);
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, id]
  );

  // Validation Button Back
  const handleBack = () => {
    setModalBack(true);
  };

  // handle Confirm
  const handleConfirm = () => {
    const successBody = {
      title: `Successful`,
      description: "Your data has been updated.",
    };
    dispatch(updateProductClass({ body: data, responseSuccess: successBody }))
      .unwrap()
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setModalConfirm(false);
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  // Handle Reset
  const handleReset = () => {
    dispatch(getDetailProductClass(id));
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    setBodyError({});
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Form layout="vertical" form={form} onFinish={handleSave}>
          <NxCardContainer header={"product class information"}>
            <div className="w-full grid grid-cols-2 gap-2">
              <Form.Item label={"Name"} name={"name"}>
                <InputComponent disabled />
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input your Description!",
                    },
                  ]}
                  label={"Description"}
                  name={"description"}
                  className={"w-full"}
                >
                  <InputComponent
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </NxCardContainer>

          <NxBaseContainer border className="mt-4">
            <div className="flex items-center">
              <ButtonComponent
                type={"submit"}
                onClick={handleBack}
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

              <div className={"w-full flex justify-end items-center gap-5"}>
                <Form.Item style={{ marginBottom: 0 }}>
                  <ButtonComponent
                    icon={<SVGIcon name="IconButtonReset" width={24} />}
                    type="submit"
                    onClick={handleReset}
                  >
                    Reset
                  </ButtonComponent>
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <ButtonComponent type="submit" htmlType={"submit"}>
                    Save
                  </ButtonComponent>
                </Form.Item>
              </div>
            </div>
          </NxBaseContainer>
        </Form>

        {/* Modal Back*/}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>

        {/* Modal Confirmation*/}
        <ModalCustom
          isOpen={modalConfirm}
          type={"confirmation"}
          header={"CONFIRMATION"}
          width={1000}
          handleCancel={() => setModalConfirm(false)}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                disabled={loading}
                onClick={() => setModalConfirm(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                loading={loading}
                onClick={() => handleConfirm()}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <div className="w-full p-5">
            <span className="text-primary uppercase font-bold">
              product class information
            </span>

            <div className="grid grid-cols-2 gap-5 pt-[30px]">
              <DetailText label="Name">{data.name}</DetailText>
              <div className="w-full col-span-2">
                <DetailText label="Description">{data.description}</DetailText>
              </div>
            </div>
          </div>
        </ModalCustom>

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
            <p className="pl-[70px]">{`Your data was not updated. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </>
  );
};

export default ProductClassUpdate;
