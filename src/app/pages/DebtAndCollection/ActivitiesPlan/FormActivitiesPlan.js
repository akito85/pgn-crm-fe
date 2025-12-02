import { LeftOutlined, WarningOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Spin,InputNumber, DatePicker,Select, Upload, Button } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SelectComponent from "../../../../components/SelectComponent";
import {
  getDetailActivity,
  createUpdateActivity,
  validateCreateUpdateActivity,
  getActivityNameList,
  getActivityActionList,
  getUserList
} from "../../../../redux/slices/debt_and_collection/activities.js";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired, hasValue } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import dayjs from "dayjs";
const { Option } = Select;

const FormActivities = (props) => {
  const { type } = props;
  const { dataDetailActivities,dataCustomer, dataPic, dataActivity, dataActivityAction,  loading } = useSelector((state) => state.activities);


  const location = useLocation();

  // console.log("location", location);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const navigate = useNavigate();
  const id = location?.state?.id;
  const accountNum = location?.state?.accountNum;
  const [payload, setPayload] = useState({});

  const [oldFileName, setOldFileName] = useState(null);

  useEffect(() => {
    if (type === "update" && dataDetailActivities) {
      setOldFileName(dataDetailActivities?.evidenceName || dataDetailActivities?.s3FileName);
    }
  }, [type, dataDetailActivities]);

  const assert = () => {
    form.setFieldsValue({
      accountNum: dataDetailActivities?.accountNum || "",
      date: dataDetailActivities?.date ? dayjs(dataDetailActivities.date) : null,
      picCustomer: dataDetailActivities?.picCustomer,
      internalPicId: dataDetailActivities?.internalPicId, 
      activityId: dataDetailActivities?.activityId,
      activityActionId: dataDetailActivities?.activityActionId,
      period: dataDetailActivities?.period ? dayjs(dataDetailActivities.period) : null,
      actionDate: dataDetailActivities?.actionDate ? dayjs(dataDetailActivities.actionDate) : null,
      resultDate: dataDetailActivities?.resultDate ? dayjs(dataDetailActivities.resultDate) : null,
      result: dataDetailActivities?.result,

      // === FILE UPLOAD ===
      evidence: dataDetailActivities?.evidence
        ? [
            {
              uid: "-1",
              name: dataDetailActivities.evidenceName,
              status: "done",
              url: dataDetailActivities.evidence, 
            },
          ]
        : [],
    });
  };

  // call id 
  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailActivity(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // jika type update maka set form dengan data detail
    if (type === 'update') {
      assert();
    }
  }, [dataDetailActivities, form, type]);

  useEffect(() => {
    if (accountNum) {
      form.setFieldsValue({ accountNum });
    }
  }, [accountNum]);

  useEffect(() => {
    dispatch(getUserList());
    dispatch(getActivityNameList());
  }, [dispatch])

  // useEffect(() => {
  //   dataCustomer
  //   dataPic
  //   dataActivity
  // }, [dispatch])



  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES_PLAN,
      breadcrumbName: "Activity",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Activity" : "Create Activity"}`,
    },
  ];


  const saveAction = async () => {
    try {
      setOpenModal(false);

      const formValue = form.getFieldsValue();  

      const dataValue = {
        accountNum: formValue.accountNum,
        activityId: formValue.activityId,
        actionDate: formValue.actionDate?.format("YYYY-MM-DD"),
        internalPicId: formValue.internalPicId,
        date: formValue.date?.format("YYYY-MM-DD"),
        picCustomer: formValue.picCustomer,
        period: formValue.period?.format("YYYYMM"),
        result: formValue.result,
        resultDate: formValue.resultDate?.format("YYYY-MM-DD"),
        activityActionId: formValue.activityActionId
      };

      const formData = new FormData();

      const body = type === "update"
        ? { ...dataValue, id: dataDetailActivities?.id }
        : dataValue;

      const fileObj = form.getFieldValue("evidence")?.[0]?.originFileObj;

      formData.append("data", JSON.stringify(body));

      if (fileObj) {
        formData.append("evidence", fileObj); 
      }

      await dispatch(createUpdateActivity(formData)).unwrap();

    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinish = async (formValue) => {
    try {
      const dataValue = {
        accountNum: formValue.accountNum,
        date: formValue.date?.format("YYYY-MM-DD"),
        picCustomer: formValue.picCustomer,
        internalPicId: formValue.pic,
        activityId: formValue.activityId,
        period: formValue.period,
        result: formValue.result,
        evidance: formValue.evidance,
        actionDate: formValue.actionDate?.format("YYYY-MM-DD"),
        resultDate: formValue.resultDate?.format("YYYY-MM-DD"),
      };

      const bodyValidasiUpdate = {
        ...dataValue,
        id: dataDetailActivities?.id,
      };

      const fileObj = formValue.evidence?.[0]?.originFileObj;

      const body = {
        accountNum: formValue.accountNum,
        date: formValue.date?.format("YYYY-MM-DD"),
        internalPicId:formValue.internalPicId,
        activityId:formValue.activityId,
        activityActionId:formValue.activityActionId,
        picCustomer: formValue.picCustomer,
        internalPicName: dataPic?.data?.find((i) => i.id === formValue.internalPicId)?.name,
        activityName: dataActivity?.data?.find((i) => i.id === formValue.activityId)?.name,
        activityAction: dataActivityAction?.data?.find((i) => i.mpMActivityResultOptId === formValue.activityActionId)?.resultCode,
        period: formValue.period?.format("YYYYMM"),
        actionDate: formValue.actionDate?.format("YYYY-MM-DD"),
        resultDate: formValue.resultDate?.format("YYYY-MM-DD"),
        result: formValue.result,
        evidenceName: fileObj?.name || "-",
      };

      // tetap
      setPayload({ body });

      // === ⬇⬇ TAMBAHAN DI SINI: BIKIN FORM DATA UNTUK KIRIM KE BE  ⬇⬇ ===
      const formData = new FormData();
      if (type === "update") {
        formData.append("data", JSON.stringify(bodyValidasiUpdate));
      } else {
        formData.append("data", JSON.stringify(dataValue));
      }

      if (fileObj) {
        formData.append("evidence", fileObj);
      }


      if (type !== "update") {
        dispatch(validateCreateUpdateActivity(formData))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setOpenModal(false);
            }
            setOpenModal(true);
          });
      } else {
        dispatch(validateCreateUpdateActivity(formData))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setOpenModal(false);
            }
            setOpenModal(true);
          });
      }
      
    } catch (error) {
      setOpenModal(false);
    }
  };


  const onFinishFailed = () => {
    setOpenModal(false);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
    } else {
      assert();
    }
  };


  const handleRetry = () => {
    handleCancelTryAgain()
    dispatch(createUpdateActivity(payload?.body));
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  const handleChangeActivityName = (value) => {
    dispatch(getActivityActionList(value));
    console.log("activity Name "+value)
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={"flex w-full gap-12 mt-5"}>
            <BaseContainer
              header={type === "update" ? "UPDATE ACTIVITY" : "CREATE ACTIVITY"}
            >
              <div className="flex flex-col w-full gap-3">
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Account Number"}
                      name={"accountNum"}
                      rules={formMessageRequired("accountNum")}
                      className={"w-full no-margin-form"}
                      
                    >
                      <Input
                        disabled
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Date"}
                      name={"date"}
                      rules={formMessageRequired("date")}
                      className={"w-full no-margin-form"}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
                        placeholder="Select date"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Customer Name"}
                      name={"picCustomer"}
                      rules={formMessageRequired("picCustomer")}
                      className={"w-full no-margin-form"}
                    >
                      <Input
                          onInput={(e) =>
                            (e.target.value = e.target.value.trimStart())
                          }
                        />
                      {/* <SelectComponent
                      >
                        {dataCustomer?.data?.map((index, key) => (
                          <Option key={key} value={index.id}>
                            {index.name}
                          </Option>
                        ))}
                      </SelectComponent> */}
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Internal PIC"}
                      name={"internalPicId"}
                      rules={formMessageRequired("internalPicId")}
                      className={"w-full no-margin-form"}
                    >
                      <SelectComponent
                      >
                        {dataPic?.data?.map((index, key) => (
                          <Option key={key} value={index.id}>
                            {index.name}
                          </Option>
                        ))}
                      </SelectComponent>
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Activity Name"}
                      name={"activityId"}
                      rules={formMessageRequired("activityId")}
                      className={"w-full no-margin-form"}
                    >
                      <SelectComponent onChange={handleChangeActivityName}
                      >
                        {dataActivity?.data?.map((index, key) => (
                          <Option key={key} value={index.id}>
                            {index.name}
                          </Option>
                        ))}
                      </SelectComponent>
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Activity Action"}
                      name={"activityActionId"}
                      rules={formMessageRequired("activityActionId")}
                      className={"w-full no-margin-form"}
                    >
                      <SelectComponent
                      >
                        {dataActivityAction?.data?.map((index, key) => (
                          <Option key={key} value={index.mpMActivityResultOptId}>
                            {index.resultCode}
                          </Option>
                        ))}
                      </SelectComponent>
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Period"}
                      name={"period"}
                      rules={formMessageRequired("period")}
                      className={"w-full no-margin-form"}
                    >
                      <DatePicker
                        picker="month"
                        style={{ width: "100%" }}
                        format="YYYYMM"
                        placeholder="Select month"
                      />
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Action Date"}
                      name={"actionDate"}
                      rules={formMessageRequired("actionDate")}
                      className={"w-full no-margin-form"}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
                        placeholder="Select date"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Result Date"}
                      name={"resultDate"}
                      rules={formMessageRequired("resultDate")}
                      className={"w-full no-margin-form"}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        format={"YYYY-MM-DD"}
                        placeholder="Select date"
                      />
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Result"}
                      name={"result"}
                      rules={formMessageRequired("result")}
                      className={"w-full no-margin-form"}
                    >
                      <InputComponent rows={5} type="textarea" />
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    {type === "update" && oldFileName && (
                      <div className="mt-1 text-blue-600 text-sm">
                        File sebelumnya: <b>{oldFileName}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </BaseContainer>
          </div>
          <div className={"w-full flex my-5"}>
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    justifyItems: "left",
                  }}
                ></LeftOutlined>
              }
            >
              Back
            </ButtonComponent>
            <div className={"w-full justify-end flex gap-5"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type={"submit"}
                border={false}
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent type={"submit"} htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
      </Spin>

      <ModalCustom
        isOpen={openModal}
        header={"CONFIRMATION"}
        width={600}
        type={"confirmation"}
        handleCancel={handleCancel}
      >
        <div className="w-full flex flex-col flex-wrap gap-y-3">
          <div className="w-full">
            <span className="text-primary uppercase">Activity Summary</span>
          </div>

          {/* Row 1 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Account Number">
                {payload?.body?.accountNum}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Date">
                {payload?.body?.date}
              </DetailText>
            </div>
          </div>

          {/* Row 2 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Customer Name">
                {payload?.body?.picCustomer}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Internal PIC">
                {payload?.body?.internalPicName}
              </DetailText>
            </div>
          </div>

          {/* Row 3 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Activity Name">
                {payload?.body?.activityName}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Activity Action">
                {payload?.body?.activityAction}
              </DetailText>
            </div>
          </div>

          {/* Row 4 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Period">
                {payload?.body?.period}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Action Date">
                {payload?.body?.actionDate}
              </DetailText>
            </div>
          </div>

          {/* Row 5 */}
          <div className="w-full flex gap-5">
            <div className="w-full flex-col">
              <DetailText label="Result Date">
                {payload?.body?.resultDate}
              </DetailText>
            </div>
            <div className="w-full flex-col">
              <DetailText label="Result">
                {payload?.body?.result}
              </DetailText>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-5 mt-4">
          <ButtonComponent onClick={handleCancel} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent onClick={saveAction} type="submit">
            Confirm
          </ButtonComponent>
        </div>
      </ModalCustom>


      {/* modal Back */}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITIES_PLAN, { state: { accountNum: accountNum } })}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>

      {/* render modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default FormActivities;
