import React, { useEffect, useState } from "react";
import LayoutMenu from "../../../../../../../components/SidebarMenu/LayoutMenu";
import { Form, Spin } from "antd";
import SVGIcon from "../../../../../../../assets/Icon/index";
import BreadCrumbAdvanced from "../../../../../../../components/BreadCrumbAdvanced";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../../../components/BaseContainer";
import HeaderDetail from "../../../HeaderDetail";
import { useDispatch, useSelector } from "react-redux";
import DateComponent from "../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import FunctionalPDDetail from "./FunctionalPDDetail";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { LeftOutlined } from "@ant-design/icons";
import ModalBack from "../../../../../../../components/Modal/ModalBack";
import {
  showModalError,
  validateCreateUpdate,
} from "../../../../../../../redux/slices/general_slice";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import ModalConfirmationPD from "./ModalConfirmationPD";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";
import {
  createPD,
  getDetailPDHistory,
  updatePD,
} from "../../../../../../../redux/slices/account_management/detailAccount/ProductDistributionSlice";
import NxCardContainer from "../../../../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";

const ProductDistributionForm = ({ type }) => {
  // Selector
  const { loading, data_detail_history } = useSelector(
    (state) => state.productDistribution
  );

  // Declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();

  const id = location.state?.accountId;
  const idCustomer = location?.state?.idCustomer;
  const idPD = location?.state?.idPD;

  // State
  const [description, setDescription] = useState("");
  const [localVal, setLocalVal] = useState(0);
  const [exportVal, setExportVal] = useState(0);
  const [storedDataInline, setStoredDataInline] = useState(false);
  const [listDataDetail, setListDataDetail] = useState([]);
  const [startDate, setStartDate] = useState();
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [bodyData, setBodyData] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  // Use Effect
  useEffect(() => {
    if (idPD && type === "update") {
      dispatch(getDetailPDHistory(idPD));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (idPD && data_detail_history?.id === idPD) {
      const dataDetail = (data_detail_history?.srcDistDtl || [])
      .filter((item) => item.country !== "INDONESIA")
      .map(
        (item, index) => {
          return {
            key: index + 1,
            id: item.id,
            srcDistId: item.srcDistId,
            country: {
              label: item.country,
              value: item.countryId,
            },
            percentage: item.percentage,
          };
        }
      );

      form.setFieldsValue({
        effectiveDate: moment(data_detail_history?.effectiveDate),
        value1: data_detail_history?.value1,
        value2: data_detail_history?.value2,
        description: data_detail_history?.description,
      });

      setStartDate(moment(data_detail_history?.effectiveDate));
      setListDataDetail(dataDetail);
      setDescription(data_detail_history?.description);
      setExportVal(data_detail_history?.value2);
    }
  }, [dispatch, id, type, data_detail_history]);

  // Breadcrumbs
  const routes = (id) => {
    return [
      {
        path: "",
        breadcrumbName: "Account",
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
        breadcrumbName: "Account - Standard",
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
        breadcrumbName: "Detail Account",
        state: {
          idAccount: id,
        },
      },
      {
        path: "",
        breadcrumbName: "Product Distribution",
      },
      {
        path: ACCOUNT_MANAGEMENT_ROUTES.CREATE_PRODUCT_DISTRIBUTION,
        breadcrumbName: "Create Product Distribution",
      },
    ];
  };

  const handleStartDate = (value) => {
    setStartDate(value);
    return value;
  };

  const disabledDate = (current) => {
    return false;
  };

  const processData = (data) => {
    const mapListDataDetail = listDataDetail.map((item) => {
      return {
        id: item.id || null,
        country: item.country?.value,
        percentage: item.percentage,
      };
    });

    const body = {
      id: type !== "create" ? idPD : undefined,
      typeDist: "PRODUCT_DISTRIBUTION",
      accountId: id,
      effectiveDate: data.effectiveDate
        ? moment(data.effectiveDate).format(dateFormatting.date)
        : null,
      value1: data.value1,
      value2: data.value2,
      description: data.description,
      srcDistDtl: mapListDataDetail,
    };

    return body;
  };

  // Validate Data before Modal
  const checkDataValidity = async (formValue) => {
    const url =
      "/v1/dbs/api/account-detail/source-distribution/validate-create-update";

    try {
      await dispatch(
        validateCreateUpdate({
          body: processData(formValue),
          services: accountManagementService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (formValue) => {
    let errorBody = {};
    if (listDataDetail.length === 0) {
      errorBody = {
        title: "Failed",
        description:
          "Raw Material Source Import Detail Mandatory. Please insert data.",
      };
      dispatch(showModalError(errorBody));
    } else if (storedDataInline) {
      errorBody = {
        title: "Failed",
        description: `Please save data table inline before submit. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    } else if (
      parseInt(form.getFieldValue().value1) +
        parseInt(parseInt(form.getFieldValue().value2)) <
        100 ||
      parseInt(form.getFieldValue().value1) +
        parseInt(parseInt(form.getFieldValue().value2)) >
        100
    ) {
      errorBody = {
        title: "Failed",
        description: `Total percentage of Local and Export must be in total of 100%.`,
      };
      dispatch(showModalError(errorBody));
    } else {
      const isDataValid = await checkDataValidity(formValue);
      if (isDataValid) {
        setBodyData({
          ...formValue,
        });
        setModalConfirm(true);
      } else {
        setModalConfirm(false);
      }
    }
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setBodyData({});
      setDescription("");
      setStoredDataInline(false);
      setListDataDetail([]);
      setStartDate();
    } else {
      dispatch(getDetailPDHistory(idPD));
    }
  };

  const handleConfirm = () => {
    setModalConfirm(false);

    const body = processData(bodyData);

    if (type === "create") {
      dispatch(createPD(body))
        .unwrap()
        .then(() => {
          setModalConfirm(false);
          handleClear();
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
    } else {
      dispatch(updatePD(body))
        .unwrap()
        .then(() => {
          setModalConfirm(false);
          handleClear();
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
    }
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

  const validatePercentage = (_, value) => {
    const local = Number(form.getFieldValue("value1") || 0);
    const exportVal = Number(form.getFieldValue("value2") || 0);
    const total = local + exportVal;

    if (total !== 100) {
      return Promise.reject(
        new Error("Total Local + Export must be exactly 100%")
      );
    }

    return Promise.resolve();
  };

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumbAdvanced routes={routes(id)} />

        <HeaderDetail
          data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          dispatch={dispatch}
          idAccount={id}
          idCustomer={idCustomer}
          type="standard"
        />

        <Form id="form" form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="flex flex-col gap-y-4 mt-4">
            <NxCardContainer header={"RAW MATERIAL SOURCE INFORMATION"}>
              <div className="w-full grid grid-cols-3 gap-3">
                <Form.Item
                  label={"Effective Date"}
                  name={"effectiveDate"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Effective Date!",
                    },
                  ]}
                >
                  <DateComponent
                    disabled={type !== "create" ? true : false}
                    onChange={(e) => handleStartDate(e)}
                    dateDisable={disabledDate}
                  />
                </Form.Item>

                <Form.Item
                  label={"Local (%)"}
                  name={"value1"}
                  dependencies={["value2"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Local (%)!",
                    },
                    { validator: validatePercentage },
                  ]}
                >
                  <InputComponent
                    type={"number"}
                    onChange={(e) => {
                      const val = Number(e.target.value || 0);
                      setLocalVal(val);
                      form.setFieldValue("value1", val);
                    }}
                  />
                </Form.Item>

                <Form.Item
                  label={"Export (%)"}
                  name={"value2"}
                  dependencies={["value1"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Export (%)!",
                    },
                    { validator: validatePercentage },
                  ]}
                >
                  <InputComponent
                    type={"number"}
                    onChange={(e) => {
                      const val = Number(e.target.value || 0);
                      setExportVal(val);
                      form.setFieldValue("value2", val);
                    }}
                  />
                </Form.Item>

                <div className="col-span-3">
                  <Form.Item
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

            <NxCardContainer header={"RAW MATERIAL SOURCE IMPORT DETAIL"}>
              <NxBaseContainer border>
                <FunctionalPDDetail
                  type={type}
                  data={listDataDetail}
                  updateData={setListDataDetail}
                  setStoredData={setStoredDataInline}
                  storedData={storedDataInline}
                  required={{ required: true, message: "Please input your" }}
                  localVal={localVal}
                  exportVal={exportVal}
                />
              </NxBaseContainer>
            </NxCardContainer>

            <NxBaseContainer border>
              <div className="flex justify-between">
                <ButtonComponent
                  type={"menu"}
                  onClick={()=>{navigate(-1)}}
                >
                  Cancel
                </ButtonComponent>
                <div className="flex w-full justify-end gap-x-4">
                  <ButtonComponent
                    disabled={storedDataInline ? true : false}
                    icon={
                      <SVGIcon
                        name={
                          type === "update"
                            ? `IconButtonReset`
                            : `IconButtonClear`
                        }
                        width={20}
                      />
                    }
                    type="reject"
                    onClick={() => {
                      handleClear();
                    }}
                  >
                    {type === "update" ? "Reset" : "Clear"}
                  </ButtonComponent>
                  <ButtonComponent type="submit" htmlType={"submit"} form={"form"}>
                    Save
                  </ButtonComponent>
                </div>
              </div>
            </NxBaseContainer>
          </div>
        </Form>

        {/* Modal Confirmation */}
        <ModalConfirmationPD
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          data={processData(bodyData)}
          dataDetail={listDataDetail}
        />

        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />

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
            <p className="pl-[70px]">{`Your data was not created.
            ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default ProductDistributionForm;
