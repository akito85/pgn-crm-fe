import React, { useEffect } from "react";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Form } from "antd";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UpdateCustomerInformation from "./UpdateCustomerInformation";
import SVGIcon from "../../../../../assets/Icon/index";
import BaseContainer from "../../../../../components/BaseContainer";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import {
  getCustomerAttachment,
  getCustomerDetail,
  getGlobalCustomerType,
  getGlobalIdentificationType,
  getGlobalMartialStatus,
  getGlobalSex,
  getListCategoryFile,
  updateCustomer,
} from "../../../../../redux/slices/account_management/Customer/customerAccount";
import moment from "moment";
import {
  ModalConfirm,
  ModalError,
  ModalSuccess,
} from "../../../../../components/Modal/ModalPopUp";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import UpdateCustomerConfirmation from "./UpdateCustomerConfirmation";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { urlLink } from "../constant";
import { IconModal } from "../../../../../utils/Icon";

const UpdateCustomer = () => {
  const dispatch = useDispatch();
  const {
    data_customerDetailAttachment,
    data_customerDetail,
    data_globalCustomerType,
    data_globalIdentificationType,
    data_globalSex,
    data_globalMartialStatus,
    loading,
  } = useSelector((state) => state.customerAccount);

  //declare
  const navigate = useNavigate();
  const location = useLocation();
  const [formUpdate] = Form.useForm();
  const id = location?.state?.id;
  // const id = 7;
  

  //state
  const [dataAttachment, setDataAttachment] = useState([]);
  const [data, setData] = useState({});
  const [dataSend, setDataSend] = useState({});
  const [modalSuccess, setModalSuccess] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const [btnConfirm, setBtnConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, updateSearch] = useState("");

  const [customerType, setCustomerType] = useState(0);
  const [identificationDdlValue, setIdentificationDdlValue] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const isLoading = loading || loadingForm;

  useEffect(() => {
    if (id) {
      dispatch(getCustomerDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getCustomerAttachment({ id, page, pageSize, sort, search }));
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    if (data_customerDetailAttachment) {
      setDataAttachment(
        (data_customerDetailAttachment || []).map((item) => ({
          ...item,
          createdDate: moment(item.createdDate).format("DD MMM YYYY"),
          fileSize: bytesConverter(item.fileSize || 0),
          urlFile1: `${urlLink(item?.id)}`,
          dataType: "exist",
        }))
      );
    }
  }, [data_customerDetailAttachment]);

  useEffect(() => {
    dispatch(getGlobalCustomerType());
    dispatch(getGlobalIdentificationType());
    dispatch(getGlobalSex());
    dispatch(getGlobalMartialStatus());
  }, [dispatch]);

  const handleSetData = (e) => {
    const temp = (e?.customerName || "").split(" ");
    setData({
      foundedBirthDate: e.foundedBirthDate ? moment(e.foundedBirthDate) : null,
      foundedBirthPlace: e?.foundedBirthPlace,
      customerType: e?.customerTypeId,
      identificationType: e?.identificationTypeId,
      customerIdentificationNumber: e?.customerIdentificationNumber,
      sex: e?.sexId,
      maritalStatus: e?.maritalStatusId,
      searchKey: e?.searchKey,
      firstName: (temp[0] || "").toUpperCase(),
      middleName: (temp[1] || "").toUpperCase(),
      lastName: (temp[2] || "").toUpperCase(),
      customerName: (e?.customerName || "").toUpperCase(),
      description: e?.description,
    });
    setFirstName((temp[0] || "").toUpperCase());
    setMiddleName((temp[1] || "").toUpperCase());
    setLastName((temp[2] || "").toUpperCase());
  };

  useEffect(() => {
    if (data_customerDetail) {
      setCustomerType(data_customerDetail?.customerTypeId);
      handleSetData(data_customerDetail);
    }
  }, [data_customerDetail]);

  useEffect(() => {
    if(customerType === 58){

      setIdentificationDdlValue(data_globalIdentificationType?.filter(item => item?.id !== 1123))
    } else {
      setIdentificationDdlValue(data_globalIdentificationType)
    }
  },[customerType, data_globalIdentificationType])

  useEffect(() => {
    formUpdate.setFieldsValue({
      customerName: `${firstName}${middleName ? ` ${middleName}` : ""}${lastName ? ` ${lastName}` : ""}`,
    });
  },[firstName, middleName, lastName])

  useEffect(() => {
    formUpdate.setFieldsValue({
      ...data,
    });
  }, [data, formUpdate]);

  const handleChangeName = (e, type) => {
    switch (type) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "middleName":
        setMiddleName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      default:
        break;
    }
  }

  //handle
  const handleSendData = (e) => {
    const data = {
      ...e,
      customerId: id,
      foundedBirthDate: moment(e?.foundedBirthDate).format("DD MMM YYYY"),
      firstName: (e?.firstName || "").toUpperCase(),
      middleName: (e?.middleName || "").toUpperCase(),
      lastName: (e?.lastName || "").toUpperCase(),
    };

    dispatch(updateCustomer({ ...data }))
      .unwrap()
      .then(async (data) => {
        const customerId = data.customerId;
        setLoadingForm(true);
        const filterDataAttach = dataAttachment.filter(
          (item) => item.dataType !== "exist"
        );
        for (let icon = 0; icon < filterDataAttach.length; icon++) {
          const element = filterDataAttach[icon];
          const body = {
            file: element.file,
            category: element.fileCategoryId,
          };

          const response = await accountManagementService.uploadAttachment(
            `/v1/dbs/api/customer/create-customer-attachment/${customerId}`,
            body
          );
        }
        setLoadingForm(false);
        formUpdate.resetFields();
        setData({});
        setBtnConfirm(false);
        setModalSuccess(true);
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();

          setBodyError({ message, value: e });
          setModalError(true);
          setBtnConfirm(false);
        }
      });
  };

  const onFinish = (e) => {
    //code
    setDataSend(e);
    setDataConfirm({
      ...e,
      customerType: data_globalCustomerType?.find(
        (item) => item?.id === e?.customerType
      )?.value,
      identificationType: data_globalIdentificationType?.find(
        (item) => item?.id === e?.identificationType
      )?.value,
      ...( customerType !== 58 ? {
        sex: data_globalSex?.find((item) => item?.id === e?.sex)?.value,
        maritalStatus: data_globalMartialStatus?.find(
          (item) => item?.id === e?.maritalStatus
        )?.value,
      } : {}),
    });
    setModalConfirm(true);
  };

  const handleRetry = () => {
    handleSendData(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Account",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_CUSTOMER,
      breadcrumbName: "Customers",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.DETAIL_CUSTOMER,
      breadcrumbName: "Detail Customer",
    },
    {
      path: "",
      breadcrumbName: "Update Customer",
    },
  ];

  return (
    <div>
      <Spin spinning={isLoading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <div className="w-full">
          <BaseContainer header={"CUSTOMER IDENTIFICATION"}>
            <Form
              id={"formUpdate"}
              layout={"vertical"}
              form={formUpdate}
              onFinish={onFinish}
            >
              <UpdateCustomerInformation
                optionsCustomerType={data_globalCustomerType}
                optionsIdentificationType={identificationDdlValue}
                optionsMartialStatus={data_globalMartialStatus}
                optionsSex={data_globalSex}
                customerType={customerType}
                handleChangeName={handleChangeName}
              />
            </Form>
          </BaseContainer>
        </div>
        <div className="my-5">
          <BaseContainer header={"ATTACHMENT"}>
            <AttachmentSectionForm
              type={"create"}
              data={dataAttachment}
              updateData={setDataAttachment}
              dispatch={dispatch}
              typeSelector="customerAccount"
              getAPICategory={getListCategoryFile}
              service={accountManagementService}
            />
          </BaseContainer>
        </div>

        <div className={"w-full flex justify-between mt-10"}>
          <div className=" flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
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
          </div>

          <div className={"flex gap-5"}>
            <Form.Item>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name="IconButtonReset"
                    width={24}
                    color={"#FFFFFF"}
                  />
                }
                type="submit"
                onClick={() => {
                  formUpdate.setFieldsValue({
                    ...data,
                  });
                }}
              >
                Reset
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent
                type="submit"
                htmlType={"submit"}
                form={"formUpdate"}
              >
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        </div>

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

        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not updated`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>

        {/** Modal Success */}
        <ModalSuccess
          isOpen={modalSuccess}
          handleOk={() => {
            setModalSuccess(false);
            navigate(-1);
          }}
          handleCancel={() => {
            setModalSuccess(false);
            navigate(-1);
          }}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              {IconModal["icon_success_default"]}
              <p className="text-[18px] font-bold">Successful</p>
            </div>
            <p className="pl-[70px]">Your data has been updated</p>
          </div>
        </ModalSuccess>

        {/** Modal Confirm */}
        <ModalCustom
          isOpen={modalConfirm}
          type={"confirmation"}
          header={"CONFIRMATION"}
          width={1200}
          handleCancel={() => {
            setModalConfirm(false);
          }}
          footer={
            <div className={"w-full flex justify-end gap-2"}>
              <ButtonComponent
                type={"default"}
                onClick={() => {
                  setModalConfirm(false);
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  handleSendData(dataSend);
                  setBtnConfirm(true);
                }}
                disabled={btnConfirm}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <UpdateCustomerConfirmation
            data={dataConfirm}
            dataTable={dataAttachment}
            customerType={customerType}
          />
        </ModalCustom>
      </Spin>
    </div>
  );
};

export default UpdateCustomer;
