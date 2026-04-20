import React, { useState, useEffect } from 'react'
import { Checkbox, Form, Select } from 'antd'
import SelectComponent from '../../../../../../../../components/SelectComponent'
import DateComponent from '../../../../../../../../components/DateComponent'
import InputComponent from '../../../../../../../../components/InputComponent'
import moment from "moment";
import { getTaxImplication } from '../../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice'
import NxCardContainer from '../../../../../../../../components/Nx/NxCardContainer'
import NxBaseContainer from '../../../../../../../../components/Nx/NxBaseContainer'
import {
  isSelectedOptionSemantic,
  SERVICE_AGREEMENT_TYPE_VALUE,
  SERVICE_TYPE_VALUE,
} from '../../idResolver';

const SaInformation = ({
  saType,
  handleSaInformationObj = () => { },
  setStartDate,
  setServiceAgreementDate,
  setEndDate,
  setGasInPlanDate,
  setCommitmentDate,
  segment,
  dataServiceType,
  dataSaType,
  dataPjbg,
  dataTermOfPayment,
  dataBillingCycle,
  dataInvoiceTemplate,
  saInfoObj,
  saReferenceNumber,
  form,
  saRecordData,
  dispatch,
  idAccount,
  setDataTaxImplication,
  dataDetail,
  setSaInfoObj
}) => {
  const [isGas, setIsGas] = useState('')
  const isGasServiceType = isSelectedOptionSemantic(
    dataServiceType,
    saInfoObj?.serviceType,
    SERVICE_TYPE_VALUE.GAS
  );
  const isPjbgServiceAgreementType = isSelectedOptionSemantic(
    dataSaType,
    saInfoObj?.serviceAgreementType,
    SERVICE_AGREEMENT_TYPE_VALUE.PJBG
  );

  // useEffect(() => {
  //   if(saInfoObj.gasInPlanDate){
  //     setSaInfoObj({
  //       ...saInfoObj,
  //       alreadyGasIn: true,
  //       gasInPlanDate: null
  //     })
  //   }
  // }, [])


  useEffect(() => {
    if (saInfoObj.serviceType) {
      const body = {
        accountId: idAccount,
        serviceType: saInfoObj.serviceType
      }
      dispatch(getTaxImplication({ body }))
        .unwrap()
        .then((data) => {
          const dataArray = Object.keys(data).map(key => data[key]);
          if (data) {
            setDataTaxImplication(dataArray)
          }
        })
        .catch(() => {
          console.log("error");
        });
    }
  }, [saInfoObj.serviceType])

  // For validation all date
  const handleDateValidation = (value, type) => {
    const shouldKeepGasInPlanDate =
      saRecordData?.status === "ACTIVE" &&
      saRecordData?.approvalStatus === "APPROVED";

    if (type === "serviceAgreementDate") {
      form.resetFields(["startDate", "endDate", "gasInPlanDate", "commitmentDate"])
      setServiceAgreementDate(value);
      return value;
    } else if (type === "startDate") {
      form.resetFields(["endDate", "gasInPlanDate", "commitmentDate"])
      setStartDate(value);
      return value;
    } else if (type === "endDate") {
      if (!shouldKeepGasInPlanDate) {
        form.resetFields(["gasInPlanDate"])
      }
      setEndDate(value);
      return value;
    } else if (type === "gasInPlanDate") {
      setGasInPlanDate(value);
      return value;
    } else {
      setCommitmentDate(value);
      return value;
    }
  };
  const handlePjbgTypeValidate = (value) => {
    form.resetFields(["pjbgType"])
  }
  const handleSaTypeValidate = (value) => {
    form.resetFields(["serviceAgreementType"])
    handlePjbgTypeValidate(value);
  }
  const handleMandatory = (e) => {
    setIsGas(e)
    // get SA Type here...
  }

  const handleGetTaxImplication = (id) => {
    const body = {
      accountId: idAccount,
      serviceType: id
    }
    dispatch(getTaxImplication({ body }))
      .unwrap()
      .then((data) => {
        const dataArray = Object.keys(data).map(key => data[key]);
        if (data) {
          setDataTaxImplication(dataArray)
        }
      })
      .catch(() => {
        console.log("error");
      });
  }

  const handleDisableSaDate = (current) => {
    if (saRecordData.saType === 'Addon' || saRecordData.saType === 'Amendment') {
      return current &&
        (current.isBefore(moment(dataDetail.saInfo.saDate), 'day') ||
          current.isAfter(moment(dataDetail.saInfo.saMainEndDate), 'day'))
    }
    else {
      return moment().endOf("day") < current;
    }
  };
  const handleValidateMoreSaDate = (current) => {
    if (saRecordData.saType === 'Addon' || saRecordData.saType === 'Amendment') {
      return current &&
        (current.isBefore(moment(saInfoObj?.serviceAgreementDate), 'day') ||
          current.isAfter(moment(dataDetail.saInfo.saMainEndDate), 'day'))
    } else {
      if (saInfoObj.serviceAgreementDate !== null) {
        // return moment(saInfoObj.serviceAgreementDate).add(1, "days") >= current;
        return current && (current < moment(saInfoObj.serviceAgreementDate));
      }
    }
  };
  const handleValidateMore = (current) => {
    if (saRecordData.saType === 'Addon' || saRecordData.saType === 'Amendment') {
      return current && (current < moment(saInfoObj.startDate) || current > moment(dataDetail.saInfo.saMainEndDate).add(1, "days"));
    } else {
      if (saInfoObj.startDate !== null) {
        return moment(saInfoObj.startDate).add(0, "days") >= current;
      }
    }
  };

  const handleRangeStartEnd = (current) => {
    if (saRecordData.saType === 'Addon' || saRecordData.saType === 'Amendment') {
      return current &&
        (current.isBefore(moment(saInfoObj?.startDate), 'day') ||
          current.isAfter(moment(saInfoObj?.endDate), 'day'))
    } else {
      if (saInfoObj.startDate !== null && saInfoObj.endDate !== null) {
        return current && (current <= moment(saInfoObj.startDate) || current >= moment(saInfoObj.endDate));
      }
    }
  };

  const onChangeChecked = (e) => {
    const checked = e.target.checked;
    setSaInfoObj((prev) => ({
      ...prev,
      alreadyGasIn: checked,
      gasInPlanDate: null
    }))
    handleSaInformationObj(e, "alreadyGasIn");
    form.setFieldsValue({ gasInPlanDate: undefined })
    form.setFields([{ name: 'gasInPlanDate', errors: [] }])
  };

  return (
    <NxCardContainer header={"SERVICE AGREEMENT INFORMATION"}>
      <div className="flex flex-col gap-y-4">
        <NxBaseContainer border header={"SERVICE AGREEMENT INFORMATION"}>
          <div className={"grid grid-cols-3 w-full gap-x-6"}>
            <Form.Item
              name={"serviceType"}
              label={"Service Type"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "serviceType")}
              rules={[
                {
                  message: "Please input your Service Type",
                  required: true,
                },
              ]}
            >
              <SelectComponent
                disabled={saRecordData.status === "ACTIVE" || saRecordData.isMain !== "Y" ? true : false}
                onChange={(e) => {
                  handleMandatory(e)
                  handleGetTaxImplication(e)
                  handleSaTypeValidate(e)
                }}
              >
                {dataServiceType &&
                  dataServiceType?.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.value}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            {/* Check If Not SA Main  */}
            {saRecordData.isMain !== "Y" && (
              <div>
                <Form.Item
                  name={"serviceAgreementReferenceNumber"}
                  label={"Service Agreement Reference Number"}
                  getValueFromEvent={(e) => handleSaInformationObj(e, "serviceAgreementReferenceNumber")}
                  rules={[
                    {
                      message: "Please input your Service Agreement Reference Number",
                      required: true,
                    },
                  ]}
                >
                  <InputComponent disabled={true} />
                </Form.Item>
              </div>
            )
            }

          </div>
          <div className={"grid grid-cols-3 w-full gap-x-6"}>
            <Form.Item
              name={"serviceAgreementNumber"}
              label={"Service Agreement Number"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "serviceAgreementNumber")}
              rules={[
                {
                  message: "Please input your Service Agreement Number",
                  required: true,
                },
                {
                  pattern: /^[a-zA-Z0-9\-/\.]+$/,
                  message: "Invalid input. Only numbers, letters, (-), (/), and (.)",
                },
              ]}
            >
              <InputComponent maxLength={50} disabled={saRecordData.status === "ACTIVE" || saRecordData.isMain !== "Y" ? true : false} />
            </Form.Item>
            <Form.Item
              name={"serviceAgreementType"}
              label={"Service Agreement Type"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "serviceAgreementType")}
              rules={[
                {
                  message: "Please input your Service Agreement Type",
                  required: true,
                },
              ]}
            >
              <SelectComponent
                disabled={saRecordData.status === "ACTIVE" || saRecordData.isMain !== "Y" ? true : false}
                onChange={(e) => {
                  handlePjbgTypeValidate(e)
                }}
              >
                {dataSaType &&
                  dataSaType?.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.value}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"pjbgType"}
              label={"PJBG Type"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "pjbgType")}
              rules={[
                {
                  message: "Please input your PJBG Type",
                  required: isPjbgServiceAgreementType ? true : false,
                },
              ]}
            >
              <SelectComponent disabled={!isPjbgServiceAgreementType || saRecordData.isMain !== "Y" || saRecordData.status === "ACTIVE"}>
                {dataPjbg &&
                  dataPjbg?.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.text}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"serviceAgreementDate"}
              label={"Service Agreement Date"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "serviceAgreementDate")}
              rules={[
                {
                  message: "Please input your Service Agreement Date",
                  required: true,
                },
              ]}
            >
              <DateComponent dateDisable={handleDisableSaDate} disabled={saRecordData.status === "ACTIVE" ? true : false} onChange={(e) => handleDateValidation(e, "serviceAgreementDate")} />
            </Form.Item>
            <Form.Item
              name={"startDate"}
              label={"Start Date"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "startDate")}
              rules={[
                {
                  message: "Please input your Start Date",
                  required: true,
                },
              ]}
            >
              <DateComponent dateDisable={handleValidateMoreSaDate} disabled={saRecordData.status === "ACTIVE" ? true : false} onChange={(e) => handleDateValidation(e, "startDate")} />
            </Form.Item>
            <Form.Item
              name={"endDate"}
              label={"End Date"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "endDate")}
              rules={[
                {
                  message: "Please input your End Date",
                  required: true,
                },
              ]}
            >
              <DateComponent dateDisable={handleValidateMore} onChange={(e) => handleDateValidation(e, "endDate")} />
            </Form.Item>
            {saRecordData.isMain === "Y" && (
              <>
                <Form.Item
                  name="alreadyGasIn"
                  label={"Already Gas In"}
                  valuePropName="checked"
                  noStyle
                  getValueFromEvent={(e) => handleSaInformationObj(e, "alreadyGasIn")}
                >
                  <div className='flex flex-col'>
                    <Checkbox checked={saInfoObj?.alreadyGasIn} onChange={onChangeChecked} disabled={(saRecordData.status === "ACTIVE" || saRecordData.isMain !== "Y" ? true : false)}>Already Gas In</Checkbox>
                    <span className='pl-[26px] text-[10px]'>Check if the service agreement is gas in or not</span>
                  </div>
                </Form.Item>
                <Form.Item
                  name={"gasInPlanDate"}
                  label={"Gas In Plan Date"}
                  dependencies={["alreadyGasIn", "serviceType"]}
                  getValueFromEvent={(e) => handleSaInformationObj(e, "gasInPlanDate")}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator: (_, value) => {
                        const isRequired = isSelectedOptionSemantic(
                          dataServiceType,
                          getFieldValue("serviceType"),
                          SERVICE_TYPE_VALUE.GAS
                        )
                          ? !getFieldValue("alreadyGasIn")
                          : true;

                        if (isRequired && !value) {
                          return Promise.reject(new Error("Please input Gas In Plan Date"));
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DateComponent
                    dateDisable={handleRangeStartEnd}
                    onChange={(e) => handleDateValidation(e, "gasInPlanDate")}
                    disabled={(!isGasServiceType || saInfoObj?.alreadyGasIn === true) || (saRecordData.status === "ACTIVE" && saRecordData.isMain === "Y" ? true : false)}
                  />
                </Form.Item>
                <Form.Item
                  name={"commitmentDate"}
                  label={"Commitment Date"}
                  getValueFromEvent={(e) => handleSaInformationObj(e, "commitmentDate")}
                  rules={[
                    {
                      message: "Please input your Commitment Date",
                      // required: (segment === "KI" || saRecordData.saType !== "PJBG") ? saRecordData?.isMain == "Y" : true,
                      required: (segment === "KI" && saRecordData?.isMain == "Y") ? true : false,
                    },
                  ]}
                >
                  <DateComponent dateDisable={handleValidateMoreSaDate} onChange={(e) => handleDateValidation(e, "commitmentDate")} disabled={saRecordData.status === "ACTIVE" || saRecordData?.isMain == "N" ? true : false} />
                </Form.Item>
              </>
            )}
          </div>
          <div className={"grid grid-cols-1 w-full gap-x-6"}>
            <Form.Item
              label={"Description"}
              name={"description"}
              className={"w-full"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "description")}
            >
              <InputComponent
                type="textarea"
              />
            </Form.Item>
          </div>
        </NxBaseContainer>

        {/* BILLING & PAYMENT INFORMATION SECTION */}
        <NxBaseContainer border header={"BILLING & PAYMENT INFORMATION"}>
          <div className={"grid grid-cols-3 w-full gap-x-6"}>
            <Form.Item
              name={"billingCycle"}
              label={"Billing Cycle"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "billingCycle")}
              rules={[
                {
                  message: "Please input your Billing Cycle",
                  required: true,
                },
              ]}
            >
              <SelectComponent disabled={saRecordData.status === "ACTIVE"? true : false}>
                {dataBillingCycle &&
                  dataBillingCycle?.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.value}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"termOfPayment"}
              label={"Term Of Payment"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "termOfPayment")}
              rules={[
                {
                  message: "Please input your Term Of Payment",
                  required: true,
                },
              ]}
            >
              <SelectComponent disabled={saRecordData.status === "ACTIVE" ? true : false}>
                {dataTermOfPayment &&
                  dataTermOfPayment?.map((item, index) => (
                    <Select.Option value={item.termsOfPaymentId} key={index}>
                      {item.termsOfPaymentName}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"invoiceTemplate"}
              label={"Invoice Template"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "invoiceTemplate")}
              rules={[
                {
                  message: "Please input your Invoice Template",
                  required: true,
                },
              ]}
            >
              <SelectComponent disabled={saRecordData.status === "ACTIVE"? true : false}>
                {dataInvoiceTemplate &&
                  dataInvoiceTemplate?.map((item, index) => (
                    <Select.Option value={item.id} key={index}>
                      {item.invoiceName}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
          </div>
        </NxBaseContainer>


      </div>
    </NxCardContainer>
  )
}

export default SaInformation
