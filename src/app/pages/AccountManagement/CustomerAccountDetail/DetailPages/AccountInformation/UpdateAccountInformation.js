import { useState } from "react";
import MiniBaseContainer from "../../../../../../components/MiniBaseContainer";
import { Form, Spin } from "antd";
import AccountUpdateInformation from "./AccountUpdateInformation";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import BreadCrumbAdvanced from "../../../../../../components/BreadCrumbAdvanced";
import HeaderUpdateAccount from "./HeaderUpdateAccount";
import { useDispatch, useSelector } from "react-redux";
import {
  getAccountCategory,
  getAccountGroupType,
  getAccountSegment,
  getAccountType,
  getBudget,
  getBudgetYear,
  getClassificationType,
  getIndustrialSector,
  getPriority,
  getTeritory,
} from "../../../../../../redux/slices/account_management/Account/accountSlice";
import { useEffect } from "react";
import {
  getAccountOneTimeDetail,
  getAccountStandardDetail,
  updateAccount,
} from "../../../../../../redux/slices/account_management/accountManagement";
import AccountConfirm from "./AccountConfirm";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../../components/Modal/ModalPopUp";

const UpdateAccountInformation = () => {
  //declare
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data_accountDetail, loading } = useSelector(
    (state) => state.accountManagement
  );

  const {
    data_budgetYear,
    data_budget,
    data_teritory,
    data_accountCategory,
    data_accountSegment,
    data_accountGroupType,
    data_accountType,
    data_classificationType,
    data_priority,
    data_industrialSector,
  } = useSelector((state) => state.account);

  const navigate = useNavigate();
  const location = useLocation();
  const idAccount = location?.state?.idAccount;
  const idCustomer = location?.state?.idCustomer;
  const type = location?.state?.type;

  //state
  const [checkedRating, setCheckedRating] = useState(false);
  const [checkedCorporate, setCheckedCorporate] = useState(false);
  const [segment, setSegment] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataConfirm, setDataConfirm] = useState({});
  const [data, setData] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalBack, setModalBack] = useState(false);
  const [listGroupType, setListGroupType] = useState([]);
  //handle
  const onChangeRating = (e) => {
    setCheckedRating(e.target.checked);
  };
  const onChangeCorporate = (e) => {
    setCheckedCorporate(e.target.checked);
  };

  const onChangeSegment = (e) => {
    setSegment(e);
  };

  useEffect(() => {
    if (idAccount && idCustomer && type) {
      if (type === "standard") {
        dispatch(getAccountStandardDetail({ idCustomer, idAccount }));
      } else {
        dispatch(getAccountOneTimeDetail({ idCustomer, idAccount }));
      }
    }
  }, [dispatch, idAccount, idCustomer, type]);

  useEffect(() => {
    dispatch(getAccountCategory());
    dispatch(getAccountSegment());
    dispatch(getAccountType());
    dispatch(getBudget());
    dispatch(getBudgetYear());
    dispatch(getClassificationType());
    dispatch(getIndustrialSector());
    dispatch(getPriority());
    dispatch(getTeritory());
  }, [dispatch]);

  //handle first open page
  useEffect(() => {
    if (
      data_accountSegment &&
      data_accountDetail &&
      data_accountDetail.accountInformation
    ) {
      dispatch(
        getAccountGroupType(data_accountDetail?.accountInformation?.segmentId)
      ); //dependen based by value segment
    }
  }, [data_accountSegment, data_accountDetail]);

  //handle dependent
  useEffect(() => {
    if(segment){
      dispatch(getAccountGroupType(segment));
    } else {
      setListGroupType([]);
    }
    form.resetFields(["accountGroupType"]);
  }, [segment]);

  useEffect(() => {
    if(data_accountGroupType){
      setListGroupType(data_accountGroupType);
    }
  },[data_accountGroupType])

  useEffect(() => {
    if (data_accountDetail && data_accountDetail.accountInformation) {
      setCheckedRating(
        data_accountDetail?.accountInformation?.ratingAndBillingException
      );
      setCheckedCorporate(
        data_accountDetail?.accountInformation?.corporateCustomer
      );
      form.setFieldsValue({
        ...data_accountDetail?.accountInformation,
        accountRegistrationNumber:
          data_accountDetail?.accountInformation?.registrationNumber,
        category: data_accountDetail?.accountInformation?.categoryId,
        segment: data_accountDetail?.accountInformation?.segmentId,
        accountGroupType:
          data_accountDetail?.accountInformation?.accountGroupTypeId,
        accountType: data_accountDetail?.accountInformation?.accountTypeId,
        classificationType:
          data_accountDetail?.accountInformation?.classificationTypeId,
        priority: data_accountDetail?.accountInformation?.priorityId,
        industrialSector:
          data_accountDetail?.accountInformation?.industrialSectorId,
        budgetYear: data_accountDetail?.accountInformation?.budgetYearId,
        budget: data_accountDetail?.accountInformation?.budgetId,
        teritory: data_accountDetail?.accountInformation?.teritoryId,
      });
    }
  }, [data_accountDetail]);

  const onFinish = (e) => {
    setData(e);
    setDataConfirm({
      ...e,
      category: data_accountCategory?.find((item) => item?.id === e?.category)
        ?.name,
      accountSegment: data_accountSegment?.find(
        (item) => item?.id === e?.segment
      )?.name,
      accountGroupType: data_accountGroupType?.find(
        (item) => item?.id === e?.accountGroupType
      )?.name,
      accountType: data_accountType?.find((item) => item?.id === e?.accountType)
        ?.name,
      classificationType: data_classificationType?.find(
        (item) => item?.id === e?.classificationType
      )?.name,
      priority: data_priority?.find((item) => item?.id === e?.priority)?.name,
      industrialSector: data_industrialSector?.reduce((result, item) => {
        if (
          item.children &&
          item.children.find((child) => child.value === e?.industrialSector)
        ) {
          result = item.children.find(
            (child) => child.value === e?.industrialSector
          ).title;
        }
        return result;
      }, ""),
      budgetYear: data_budgetYear?.find((item) => item?.id === e?.budgetYear)
        ?.name,
      budget: data_budget?.find((item) => item?.id === e?.budget)?.name,
      teritory: data_teritory?.find((item) => item?.id === e?.teritory)?.name,
      corporateCustomer: checkedCorporate,
      ratingBilling: checkedRating,
    });
    setModalConfirm(true);
  };

  const handleSendData = (e) => {
    const data = {
      ...e,
      accountNumber: data_accountDetail?.accountInformation?.accountNumber,
      accountGroup: data_accountDetail?.accountInformation?.accountGroupId,
      costCenter: data_accountDetail?.accountInformation?.costCenterId,
      sor: data_accountDetail?.accountInformation?.sorId,
    };

    delete data.customerManagement;
    delete data.accountRegistrationNumber;
    setModalConfirm(false);

    dispatch(updateAccount({ ...data }))
      .unwrap()
      .then(() => {
        form.resetFields();
        setData({});
        setDataConfirm({});
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  const handleRetry = () => {
    //code
    handleSendData(bodyError.value);
    setModalError(false);
    setBodyError({});
  };

  const handleReset = () => {
    form.setFieldsValue({
      ...data_accountDetail?.accountInformation,
      accountRegistrationNumber:
        data_accountDetail?.accountInformation?.registrationNumber,
      category: data_accountDetail?.accountInformation?.categoryId,
      segment: data_accountDetail?.accountInformation?.segmentId,
      accountGroupType:
        data_accountDetail?.accountInformation?.accountGroupTypeId,
      accountType: data_accountDetail?.accountInformation?.accountTypeId,
      classificationType:
        data_accountDetail?.accountInformation?.classificationTypeId,
      priority: data_accountDetail?.accountInformation?.priorityId,
      industrialSector:
        data_accountDetail?.accountInformation?.industrialSectorId,
      budgetYear: data_accountDetail?.accountInformation?.budgetYearId,
      budget: data_accountDetail?.accountInformation?.budgetId,
      teritory: data_accountDetail?.accountInformation?.teritoryId,
    });
  };

  const routes = (id) => {
    return [
      {
        path: "",
        breadcrumbName: "Account",
      },
      {
        path:
          type == "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
        breadcrumbName:
          type == "standard" ? "Account Standard" : "Account One Time",
      },
      {
        path:
          type == "standard"
            ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
            : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME,
        breadcrumbName: "Detail Account",
        state: {
					idAccount: id,
				}
      },
      {
        path: "",
        breadcrumbName: "Update Account",
      },
    ];
  }

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumbAdvanced routes={routes(idAccount)} />
        <div className="w-full mb-5">
          <HeaderUpdateAccount
            data_accountDetail={data_accountDetail}
            data_header={["CUSTOMER INFORMATION"]}
          />
        </div>
        <MiniBaseContainer>
          <Form
            id="formUpdateAccount"
            layout={"vertical"}
            form={form}
            onFinish={onFinish}
          >
            <div className={"w-full"}>
              <AccountUpdateInformation
                data_header={[
                  "ACCOUNT INFORMATION",
                  "ACCOUNT LOCATION INFORMATION",
                  "ACCOUNT IDENTIFICATION",
                  "ACCOUNT SEGMENT",
                  "ACCOUNT INDUSTRIAL SECTOR",
                  "ACCOUNT BUDGET",
                ]}
                optionsCategory={data_accountCategory}
                optionsAccountSegment={data_accountSegment}
                optionsAccountGroupType={listGroupType}
                optionsAccountType={data_accountType}
                optionsClassificationType={data_classificationType}
                optionsPriority={data_priority}
                optionsIndustrialSector={data_industrialSector}
                optionsBudgetYear={data_budgetYear}
                optionsBudget={data_budget}
                optionsTeritory={data_teritory}
                checkedCorporate={checkedCorporate}
                onChangeCorporate={onChangeCorporate}
                checkedRating={checkedRating}
                onChangeRating={onChangeRating}
                onChangeSegment={onChangeSegment}
              />
            </div>
          </Form>
        </MiniBaseContainer>

        <div className={"w-full flex justify-between mt-10"}>
          <div className=" flex">
            <Link
              to={
                type === "standard"
                  ? ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD
                  : ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME
              }
              state={{
                section: "Account Information",
                idAccount: idAccount,
                idCustomer: idCustomer,
              }}
            >
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
            </Link>
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
                  handleReset();
                }}
              >
                Reset
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent
                type="submit"
                htmlType={"submit"}
                form={"formUpdateAccount"}
              >
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        </div>
      </Spin>

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
                handleSendData(data);
              }}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <AccountConfirm
          data_detail={dataConfirm}
          data_header={[
            "ACCOUNT INFORMATION",
            "ACCOUNT LOCATION INFORMATION",
            "ACCOUNT IDENTIFICATION",
            "ACCOUNT SEGMENT",
            "ACCOUNT INDUSTRIAL SECTOR",
            "ACCOUNT BUDGET",
          ]}
        />
      </ModalCustom>

      {/* Modal Retry*/}
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
          <p className="pl-[70px]">{`Your data was not Updated`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

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
    </>
  );
};

export default UpdateAccountInformation;
