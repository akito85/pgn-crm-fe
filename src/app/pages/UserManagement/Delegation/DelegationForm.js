import { LeftOutlined } from "@ant-design/icons";
import { Form, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { configApp } from "../../../../constants/configApp";
import {
  countBadgeFieldsErrorMandatory,
  formMessageRequired,
  hasValue,
  renderDateConverter,
  requiredMessage,
} from "../../../../utils";
import {
  createDelegation,
  getDelegateTo,
  getPositionDelegation,
} from "../../../../redux/slices/user_management/delegation";
import moment from "moment";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import RadioTabs from "../../../../components/RadioTabs";
import DateComponent from "../../../../components/DateComponent";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import ModalBack from "../../../../components/Modal/ModalBack";
import AttachmentComponent from "../../../../components/Attachment/AttachmentComponent";
import ModalConfirmationDelegation from "./Modal/ModalConfirmationDelegation";
import userHttpService from "../../../../redux/services/userHttpService";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import receiptCollectionHttpService from "../../../../redux/services/receiptCollectionHttpService";
import { getListCategory } from "../../../../redux/slices/rating_billing_invoice/MasterData/taxCode";

const DelegationForm = ({ type }) => {
  // Selector
  const { loading, position_Delegation, delegate_To } = useSelector(
    (state) => state.delegation
  );
  const { isLoading } = useSelector(state => state?.general);

  // Declaration
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use State
  const [startDate, setStartDate] = useState();
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [flag, setFlag] = useState(0);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [tabData, setTabData] = useState([
    {
      value: "Delegation",
      paramValue: [
        "position",
        "positionDelegateTo",
        "startDate",
        "endDate",
        "remark",
      ],
    },
    { value: "Attachment", paramValue: ['attachment'] }
  ]);
  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [loadingForm, setLoadingForm] = useState(false)
  const loadings = loading || loadingForm || isLoading
  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: USER_ROUTES.VIEW_DELEGATION,
      breadcrumbName: "Delegation",
    },
    {
      path: "",
      breadcrumbName: "Request Delegation",
    },
  ];

  useEffect(() => {
    dispatch(getPositionDelegation());
  }, [dispatch]);

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setListDataAttachment([]);
    setTabData(
      tabData?.map((item) => {
        const { errorBadge, ...keys } = item;
        return keys;
      })
    );
  };

  const handleDelegation = (value) => {
    dispatch(getDelegateTo(value));
    form.resetFields(['delegateTo'])
  };

  const handleStartDate = (e) => {
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleConfirm = () => {
    if (type === "create") {
      dispatch(createDelegation(bodyData?.body))
        .unwrap()
        .then(async (dataForm) => {
          const billingBucketCode = dataForm?.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referenceId: billingBucketCode,
            };
            await userHttpService.uploadImage(
              `/vi/dbs/api/user-delegation/upload`,
              body
            );
          }
          setLoadingForm(false);
          handleClear();
          setModalConfirm(false);
        })
        .catch((error) => {
          setModalConfirm(false);
        });
    }
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    countBadgeFieldsErrorMandatory(setTabData, listDataAttachment, errorFields);
  };

  const onFinish = async (formValue) => {
    try {
      setTabData([
        {
          value: "Delegation",
          paramValue: [
            "positionDelegateTo",
            "delegateTo",
            "startDate",
            "endDate",
            "remark",
          ],
        },
        { value: "Attachment", paramValue: ['attachment'] }
      ])
      let validateValueOBj;
      validateValueOBj = {
        body: {
          ...formValue,
          startDate: hasValue(formValue?.startDate) ? renderDateConverter(formValue?.startDate, 'date') : null,
          endDate: hasValue(formValue?.endDate) ? renderDateConverter(formValue?.endDate, 'date') : null
        },
        services: userHttpService,
        endPoint: '/vi/dbs/api/user-delegation/validate-create',
        type
      }
      await dispatch(validateCreateUpdate(validateValueOBj))?.unwrap();
      setModalConfirm(true);
      setBodyData(
        {
          body: validateValueOBj?.body,
          validateValue: validateValueOBj
        });
    } catch (error) {
      setModalConfirm(false);
    }
  };

  return (
    <div>
      <Spin spinning={loadings}>
        <BreadCrumb routes={routes} />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={handleError}
        // scrollToFirstError={true}
        >
          <BaseContainer header={"REQUEST DELEGATION"}>
            <div className="w-full mb-4">
              <RadioTabs
                data={tabData}
                onChange={onChange}
                currentPosition={valuePage}
              />
            </div>
            <div className={`${valuePage !== "Delegation" ? "hidden" : ""}`}>
              <div className="w-full grid grid-cols-2 gap-2">
                <Form.Item
                  label={"Position"}
                  name={"positionDelegateTo"}
                  rules={formMessageRequired("Position")}
                >
                  <SelectComponent onChange={handleDelegation}>
                    {position_Delegation?.map((data, index) => (
                      <Select.Option value={data.id} key={index}>
                        {data.name}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
                <Form.Item
                  label={"Delegate To"}
                  name={"delegateTo"}
                  rules={formMessageRequired("Delegate To")}
                >
                  <SelectComponent>
                    {delegate_To?.map((data, index) => (
                      <Select.Option value={data.id} key={index}>
                        {data.name}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </div>
              <div className="w-full grid grid-cols-2 gap-2">
                <Form.Item
                  label={"Start Date"}
                  rules={formMessageRequired("Start Date")}
                  name={"startDate"}
                >
                  <DateComponent onChange={(e) => handleStartDate(e)} />
                </Form.Item>
                <Form.Item
                  label={"End Date"}
                  name={"endDate"}
                  rules={[
                    {
                      validator: (v, value, re) =>
                        (value && moment(startDate) <= moment(value)) || !value
                          ? Promise.resolve()
                          : Promise.reject(
                            new Error(
                              "The end date must be greater than or equal to the start date!"
                            )
                          ),
                    },
                    {
                      message: requiredMessage("End Date"),
                      required: true,
                    },
                  ]}
                >
                  <DateComponent
                    disabled={startDate === null}
                    dateDisable={handleDisableEndDate}
                  />
                </Form.Item>
              </div>
              <div className="w-full">
                <Form.Item
                  label={"Remark"}
                  rules={formMessageRequired("Remark")}
                  name={"remark"}
                >
                  <InputComponent type="textarea" />
                </Form.Item>
              </div>
            </div>
            <div className={`${valuePage !== "Attachment" ? "hidden" : ""}`}>
              <Form.Item
                name={'attachment'}
                rules={[
                  {
                    validator: (_, __) => listDataAttachment?.length === 0 ?
                      Promise.reject(new Error('Please upload your attachment!')) :
                      Promise.resolve()
                  }
                ]}
              >
                <AttachmentComponent
                  type={type}
                  data={listDataAttachment}
                  updateData={setListDataAttachment}
                  dispatch={dispatch}
                  getAPICategory={getListCategory}
                  typeSelector="tax_code"
                  service={receiptCollectionHttpService}
                  configApplication={configApp.PAYMENT_SERVICE}
                  //  getAPIGuard={getConfigFileR}
                  typeRBI={"data"}
                  mandatory={true}
                />
              </Form.Item>
            </div>
          </BaseContainer>
          <div className="flex w-full justify-between align-middle my-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => handleBack()}
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
            <div className="flex align-middle gap-3">
              <ButtonComponent
                icon={<SVGIcon name={`IconButtonClear`} width={24} />}
                type="submit"
                onClick={() => {
                  handleClear();
                }}
              >
                {"Clear"}
              </ButtonComponent>
              <ButtonComponent
                onClick={() => setFlag(1)}
                type="submit" htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        <ModalConfirmationDelegation
          isOpen={modalConfirm}
          data={bodyData?.body}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          listDataAttachment={listDataAttachment}
          apiDelegateTo={delegate_To}
          apiPosition={position_Delegation}
        />
      </Spin>
    </div>
  );
};

export default DelegationForm;
