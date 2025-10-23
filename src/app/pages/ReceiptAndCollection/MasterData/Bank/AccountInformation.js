import { LeftOutlined, SyncOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumbAdvanced from "../../../../../components/BreadCrumbAdvanced";
import ButtonComponent from "../../../../../components/ButtonComponent";
import InputComponent from "../../../../../components/InputComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  approveOrRejectInactiveBank,
  createAccountInformation,
  createValidasiBankAccount,
  getAllApprovalList,
  getBankDetail,
  getDetailAccountInformation,
  getGLAccount,
  getListApprovalById,
  getListCategory,
  getListCriteria,
  getListCurrency,
  getListEntity,
  getTypeList,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import ApprovalSectionForm from "../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import AccountForm from "./AccountForm";
import ContentModalConfirmBank from "./ContentModalConfirmBank";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ConfirmModalBankAccount from "./ConfirmModalBankAccount";
import { columnsTableCriteria } from "./Table/TableCriteriaPayment";
import moment from "moment";
import { dateFormatting } from "../../../../../utils";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { bytesConverter } from "../../../../../utils/bytesConverter";
const AccountInformation = ({ type, bankId }) => {
  const {
    dataEntity,
    dataCurrency,
    data_type_detail,
    data_select_criteria,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    data_modal,
    message,
    data_list_gl
  } = useSelector((state) => state.bank);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();

  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalBack, setModalBack] = useState(false);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [isVA, setIsVA] = useState(false);
  console.log("🚀 ~ AccountInformation ~ isVA:", isVA);
  const [kirimBody, setKirimBody] = useState();
  const [loadingForm, setLoadingForm] = useState(loading);
  const [Id, setId] = useState();
  const [storedData, setStoredData] = useState(false);
console.log(data_list_gl, ' data list gl');

  //use effect
  useEffect(() => {
    dispatch(getListEntity());
    dispatch(getAllApprovalList());
    dispatch(getListCurrency());
    dispatch(getTypeList());
    dispatch(getListCriteria());
    dispatch(getGLAccount());
  }, [dispatch]);
  // approval

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
    if (selectedHierarchy && selectedHierarchy !== 0) {
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

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    {
      value: "Account",
      paramValue: [
        "accountNumber",
        "accountName",
        "paymentCriteria",
        "bankCode",
        " phoneNumber",
        "email",
        "address",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [data, setData] = useState([]);
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [listDataCriteria, setListDataCriteria] = useState([]);

  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  // const [disabled, setdisabled] = useState((disabled = true));

  useEffect(() => {
    if (type === "update" && data_modal && data_modal?.id) {
      setIsVA(data_modal?.accountBankDto?.isVa);
    }
  }, [type, data_modal]);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailAccountInformation(id));
    }
  }, [dispatch, id, type]);

  const [valuePage, setValuePage] = useState(tabData[0].value);

  useEffect(() => {
    if (
      formValue.approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(formValue.approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  useEffect(() => {
    if (id && type === "update") {
      // Data Criteria Select
      const criteriaSelect = data_modal?.accountBankDto?.criteriaDtoList?.map(
        (item) => {
          return {
            id: item?.criteria,
            transactionCalendarId: item?.transactionCalendarId,
          };
        }
      );
      const mappingCriteria = criteriaSelect?.map((a) => a.id);
      const dataCriteriaList = (
        data_modal?.accountBankDto?.criteriaDataDtoList || []
      )
        .filter((crit) => crit.allCriteria !== true)
        .map((item, index) => {
          return {
            id: item.id,
            startDate:
              item?.startDate === null
                ? ""
                : moment(item?.startDate).format(dateFormatting.dateCapital),
            endDate:
              item?.endDate === undefined || item?.endDate === null
                ? ""
                : moment(item?.endDate).format(dateFormatting.dateCapital),
            referenceId: item.referenceId,
            budget: item.budget,
            subDistrict: item.subDistrict,
            district: item.district,
            city: item.city,
            province: item.province,
            area: item.area,
            sor: item.sor,
            industrialSector: item.industrialSector,
            product: item.product,
            gsizes: item.gsizes,
            customerSegment: item.customerSegment,
            accountGroup: item.accountGroup,
            accountClass: item.accountClass,
            accountCategory: item.accountCategory,
            customer: item.customer,
            key: index + 1,
            type: "exist",
          };
        });

      // Data Attachment Information
      const dataAttachment = (data_modal?.attachmentDtoList || []).map(
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
            uploadBy: item.createdBy,
            uploadDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }
      );

      setSelectedHierarchy(data_modal?.accountBankDto?.appHierId);
      form.setFieldsValue({
        accountNumber: data_modal?.accountBankDto?.accountNumber,
        accountName: data_modal?.accountBankDto?.accountName,
        branch: data_modal?.accountBankDto?.branchName,
        startDate: data_modal?.accountBankDto?.startDate
          ? moment(data_modal?.accountBankDto?.startDate).clone()
          : "",
        endDate: data_modal?.accountBankDto?.endDate
          ? moment(data_modal?.accountBankDto?.endDate).clone()
          : "",
        currency: data_modal?.accountBankDto?.currency?.id,
        description: data_modal?.accountBankDto?.description,
        entity: data_modal?.accountBankDto?.entity?.id,
        type: data_modal?.accountBankDto?.type?.id,
        isVA: data_modal?.accountBankDto?.isVa,
        totalDigit: data_modal?.accountBankDto?.totalDigit,
        fsCode: data_modal?.accountBankDto?.staticCode,
        transCriteria: mappingCriteria,
        apphierId: data_modal?.accountBankDto?.appHierId,
        criteria: mappingCriteria,
      });
      setIsVA(data_modal?.accountBankDto?.isVa);
      setListDataAttachment(dataAttachment);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
    }
  }, [id, data_modal, form, isVA, type]);

  // Breadcrumbs
  const routes = (id) => {
    return [
      {
        path: "",
        breadcrumbName: "Receipt & Collection",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK,
        breadcrumbName: "Bank",
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK,
        breadcrumbName: `Detail Bank`,
        state: {
          id: id,
        },
      },
      {
        path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_ACCOUNT_INFORMATION,
        breadcrumbName: ` ${type === "update" ? "Update" : "Create"}
        Bank Account`,
      },
    ];
  };

  // const onChange = (e) => {
  //   if (storedData) {
  //     const errorBody = {
  //       title: "Failed",
  //       description: `Please save data table inline before submit. Please try again.`,
  //     };
  //     dispatch(showModalError(errorBody));
  //   } else {
  //   }
  // };

  const handleClear = () => {
    form.resetFields();
    setSelectedHierarchy("");
    setListDataAttachment([]);
    setAppHierDataDetail([]);
    setListDataCriteria([]);
    setCriteriaValues([]);
    setIsVA(false);
  };
  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  const handleSubmitForm = (formValue) => {
    let errorBody = {};
    if (listDataCriteria.length === 0 && !formValue.criteria.includes(24)) {
      errorBody = {
        title: "Failed",
        description: "Criteria Mandatory. Please insert data.",
      };
      dispatch(showModalError(errorBody));
    } else if (storedData) {
      errorBody = {
        title: "Failed",
        description:
          "Please save data table inline before submit. Please try again.",
      };
      dispatch(showModalError(errorBody));
    } else {
      let dataCriteriaObject = listDataCriteria.map((item) => {
        return {
          startDate: moment(item.startDate).format(dateFormatting.date),
          endDate: item?.endDate
            ? moment(item.endDate).format(dateFormatting.date)
            : null,
          id: null,
          referenceId: null,
          customer: item.customer?.value || null,
          budget: item.budget?.value || null,
          subDistrict: item.subDistrict?.value || null,
          district: item.district?.value || null,
          city: item.city?.value || null,
          province: item.province?.value || null,
          area: item.area?.value || null,
          sor: item.sor?.value || null,
          industrialSector: item.industrialSector?.value || null,
          gsizes: item.gsizes?.value || null,
          customerSegment: item.customerSegment?.value || null,
          accountGroup: item.accountGroup?.value || null,
          serviceType: item.serviceType?.value || null,
          accountCategory: item.accountCategory?.value || null,
          allCriteria: item.all?.value || null,
        };
      });

      const startDate = moment(formValue?.startDate).format("DD MMM YYYY");
      const endDate = formValue?.endDate
        ? moment(formValue?.endDate).format("DD MMM YYYY")
        : null;
      // const filterNameentity = dataEntity?.filter((a) => a?.name === formValue?.entity)?.find((b) => b?.id)?.id
      const dataValue = {
        accountNumber: formValue?.accountNumber,
        accountName: formValue?.accountName,
        bankId: id,
        currencyId: formValue?.currency,
        entityId: formValue?.entity,
        branchName: formValue?.branch,
        totalDigit: formValue?.totalDigit || null,
        typeId: formValue?.type,
        startDate: startDate,
        endDate: endDate,
        description: formValue?.description,
        isVa: isVA,
        staticCode: formValue?.staticCode || null,
        appHierId: selectedHierarchy,
        criteriaIdList: formValue?.criteria,
        criteriaDataDtoList: dataCriteriaObject,
      };
      setKirimBody(dataValue);
      setTabData([
        {
          value: "Account",
          paramValue: [
            "accountNumber",
            "accountName",
            "paymentCriteria",
            "branch",
            "type",
            "currency",
            "startDate",
            "entity",
          ],
        },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
      if (type === "create") {
        dispatch(createValidasiBankAccount(dataValue))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setModalConfirm(false);
            }
            setModalConfirm(true);
          });
      }
    }
  };
  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabData((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  const handleProcessModalConfirm = () => {
    setModalConfirm(false);
    const successMessageCreate = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: true,
    };
    let temp = { ...kirimBody };
    if ((temp.criteriaIdList || []).includes(24)) {
      temp = {
        ...temp,
        criteriaDataDtoList: [{ allCriteria: true }],
      };
    }
    dispatch(createAccountInformation(temp))
      .unwrap()
      .then(async (data) => {
        let id = data.id;
        setLoadingForm(loadingForm);
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            files: element.file,
            fileCategoryId: element.fileCategoryId,
            referensiId: id,
            category: "BANK ACCOUNT",
          };
          const response = await receiptCollectionHttpService.uploadImage(
            `/v1/dbs/api/attachment/upload/v1`,
            body
          );
        }
        setLoadingForm(loadingForm);
        setId(id);
        handleCancelModalConfirm();
        handleClear();
        dispatch(showModalSuccess(successMessageCreate));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch(showModalError(message));
        }
      });
  };

  return (
    <LayoutMenu>
      <BreadCrumbAdvanced routes={routes(id)} />
      <Spin spinning={loading}>
        <RadioTabs
          data={tabData}
          onChange={(e) => setValuePage(e.target.value)}
          currentPosition={valuePage}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div className={`${valuePage !== "Account" ? "hidden" : ""}`}>
            <AccountForm
              data_select_criteria={data_select_criteria}
              setIsVA={setIsVA}
              isVA={isVA}
              dataEntity={dataEntity}
              typeData={data_type_detail}
              dataCurrency={dataCurrency}
              form={form}
              criteriaValues={criteriaValues}
              setCriteriaValues={setCriteriaValues}
              type={"create"}
              setData={setData}
              data={data}
              setValueOrUnlimited={setValueOrUnlimited}
              valueOrUnlimited={valueOrUnlimited}
              listDataCriteria={listDataCriteria}
              setListDataCriteria={setListDataCriteria}
              formValue={formValue}
              storedData={storedData}
              setStoredData={setStoredData}
            />
            {/* <ContactListCreate
            /> */}
          </div>
          <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentSectionForm
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="bank"
                dispatch={dispatch}
                getAPICategory={getListCategory}
              />
            </BaseContainer>
          </div>
          <div className="flex w-full justify-between align-middle my-3 gap-5">
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
              disabled={storedData === true ? true : false}
            >
              Back
            </ButtonComponent>
            <div className="flex align-middle gap-3">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleClear}
                disabled={storedData === true ? true : false}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
                // onClick={() => setModalConfirm(true)}
                // disabled={disableSubmit}
                disabled={storedData === true ? true : false}
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>

        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={handleCancelModalConfirm}
          header={"Confirmation"}
          width={1000}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5 p-4">
              <ButtonComponent
                onClick={handleCancelModalConfirm}
                type="default"
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type="submit"
                onClick={handleProcessModalConfirm}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <ConfirmModalBankAccount
            data={formValue}
            tabData={tabData}
            // dataTable={filterDataByPage()}
            // handleChange={setDataSource}
            listDataCriteria={listDataCriteria}
            isVA={isVA}
            criteriaValues={criteriaValues}
            apiCriteria={data_select_criteria}
            listDataAttachment={listDataAttachment}
            dataType={data_type_detail}
            data_entity={dataEntity}
            dataOption={appHierOptions}
            data_currency={dataCurrency}
            selectedHierarchy={selectedHierarchy}
            listDataAppHierDetail={appHierDataDetail}
          />
        </ModalCustom>

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
      </Spin>
    </LayoutMenu>
  );
};

export default AccountInformation;
