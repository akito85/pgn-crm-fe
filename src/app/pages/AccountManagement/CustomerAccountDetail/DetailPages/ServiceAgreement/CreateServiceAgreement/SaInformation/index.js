import React, {useState, useEffect} from 'react'
import BaseContainer from '../../../../../../../../components/BaseContainer'
import { Checkbox, Form, Select } from 'antd'
import SelectComponent from '../../../../../../../../components/SelectComponent'
import DateComponent from '../../../../../../../../components/DateComponent'
import InputComponent from '../../../../../../../../components/InputComponent'
import moment from "moment";
import { dateFormatting, hasValue } from '../../../../../../../../utils'
import { getTaxImplication } from '../../../../../../../../redux/slices/account_management/detailAccount/serviceAgreementSlice'

const SaInformation = ({
  saType, 
  handleSaInformationObj = ()=>{},
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
  setSaInfoObj
}) => {
  const [isGas, setIsGas] = useState('')
  const [inputValue, setInputValue] = useState('');


  useEffect(() => {
    if(saInfoObj.serviceType){
      const body = {
        accountId: idAccount,
        serviceType: saInfoObj.serviceType
      }
      dispatch(getTaxImplication({body}))
      .unwrap()
      .then((data) => {
        const dataArray = Object.keys(data).map(key => data[key]);
        if(data){
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
    if(type === "serviceAgreementDate"){
      form.resetFields(["startDate", "endDate", "gasInPlanDate", "commitmentDate"])
      setServiceAgreementDate(value);
      return value;
    }else if(type === "startDate"){
      form.resetFields(["endDate", "gasInPlanDate", "commitmentDate"])
      setStartDate(value);
      return value;
    }else if(type === "endDate"){
      form.resetFields(["gasInPlanDate", "commitmentDate"])
      setEndDate(value);
      return value;
    }else if(type === "gasInPlanDate"){
      setGasInPlanDate(value);
      return value;
    }else{
      setCommitmentDate(value);
      return value;
    }
  };
  const handleSaTypeValidate = (value) => { 
    form.resetFields(["serviceAgreementType"])
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
    dispatch(getTaxImplication({body}))
    .unwrap()
    .then((data) => {
      const dataArray = Object.keys(data).map(key => data[key]);
      if(data){
        setDataTaxImplication(dataArray)
      }
    })
    .catch(() => {
      console.log("error");
    });
  }

  const validateEndDate = (rule, value, callback) => {
  }

  const handleDisableSaDate = (current) => {
    if(saRecordData.typeSa === 'addon' || saRecordData.typeSa === 'amandemen'){
      return current &&
      (current.isBefore(moment(saRecordData.saDate), 'day') || 
      current.isAfter(moment(saRecordData.endDate), 'day'))
    }
    else{
      return moment().endOf("day") < current;
    }
  };
  const handleValidateMoreSaDate = (current) => {
    if(saRecordData.typeSa === 'addon' || saRecordData.typeSa === 'amandemen') {
      // if(moment(saRecordData.startDate).diff(moment(), 'days') < 30){
        
      //   return current && (current < moment(saRecordData.startDate) || current > moment(saRecordData.endDate));
      // }else{
      //   return current && (current <= moment().subtract(1, "months") || current > moment(saRecordData.endDate))    
      // }
      return current &&
        (current.isBefore(moment(saInfoObj?.serviceAgreementDate), 'day') || 
        current.isAfter(moment(saRecordData.endDate), 'day'))

    }else{
      if (saInfoObj.serviceAgreementDate !== null) {
        // return moment(saInfoObj.serviceAgreementDate).add(1, "days") >= current;
        return current && (current < moment(saInfoObj.serviceAgreementDate));
      }
    }
  };
  const handleValidateMore = (current) => {
    if(saRecordData.typeSa === 'addon' || saRecordData.typeSa === 'amandemen') {
      return current && (current < moment(saInfoObj.startDate) || current > moment(saRecordData.endDate).add(1, "days"));
    }else {
      if (saInfoObj.startDate !== null) {
        return moment(saInfoObj.startDate).add(0, "days") >= current;
      }
    }
  };

  const handleRangeStartEnd = (current) => {
    if(saRecordData.typeSa === 'addon' || saRecordData.typeSa === 'amandemen'){
      return current &&
      (current.isBefore(moment(saInfoObj?.startDate), 'day') || 
      current.isAfter(moment(saRecordData.endDate), 'day'))
    }else{
      if (saInfoObj.startDate !== null && saInfoObj.endDate !== null) {
        return current && (current <= moment(saInfoObj.startDate) || current >= moment(saInfoObj.endDate));
      }
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // Regex pattern: ^[a-zA-Z0-9\-/\.]+$
    const regexPattern = /^[a-zA-Z0-9\-/\.]+$/;

    // Validasi input menggunakan regex
    if (regexPattern.test(inputValue)) {
      setInputValue(inputValue);
    }
  };

  const onChangeChecked = (e) => {
    setSaInfoObj({
      ...saInfoObj,
      alreadyGasIn: e.target.checked,
      gasInPlanDate: null
    })
    form.resetFields(["gasInPlanDate"])
  };
  
  return (
    <div>

      <div>
        <div className="pt-8 pb-4">
          <h3 className="text-primary text-xs font-bold uppercase">
            SERVICE TYPE         
          </h3>
        </div>
        <div className={"grid grid-cols-3 w-full gap-x-6"}>
          <Form.Item
            name={"serviceType"}
            label={"Service Type"}
            getValueFromEvent={(e) =>handleSaInformationObj(e, "serviceType")}
            rules={[
              {
                message: "Please input your Service Type",
                required: true,
              },
            ]}
          >
              <SelectComponent 
                disabled={saRecordData?.typeSa !== "main" ? true : false}
                onChange={(e)=>{
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
        </div>
      </div>

      {/* SECTION SERVICE AGREEMENT INFORMATION   */}
      <div>
        <div className="pt-8 pb-4">
          <h3 className="text-primary text-xs font-bold uppercase">
            SERVICE AGREEMENT INFORMATION          
          </h3>
        </div>
        {/* Check If Not SA Main  */}
        {saType !== "main" && (
          <div className={"grid grid-cols-3 w-full gap-x-6"}>
            <Form.Item
              name={"serviceAgreementReferenceNumber"}
              label={"Service Agreement Reference Number"}
              getValueFromEvent={(e) => handleSaInformationObj(e, "serviceAgreementReferenceNumber")}
              rules={[
                {
                  message: " Please input your Service Agreement Reference Number",
                  required: true,
                },
              ]}
            >
              <InputComponent disabled={true} />
            </Form.Item>
          </div>
        )
        }
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
            <InputComponent maxLength={50} />
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
            <SelectComponent disabled={saRecordData?.typeSa !== "main" || !hasValue(saInfoObj?.serviceType) ? true : false}>
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
                required: saInfoObj?.serviceType === 608 ? true : false,
              },
            ]}
          >
            <SelectComponent disabled={(saInfoObj?.serviceType !== 608 || saRecordData?.typeSa !== "main") ? true : false}>
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
            <DateComponent dateDisable={handleDisableSaDate} onChange={(e)=>handleDateValidation(e, "serviceAgreementDate")}/>
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
            <DateComponent dateDisable={handleValidateMoreSaDate} onChange={(e)=>handleDateValidation(e, "startDate")}/>
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
            <DateComponent dateDisable={handleValidateMore} onChange={(e)=>handleDateValidation(e, "endDate")}/>
          </Form.Item>
        </div>
      </div>

      {/* SECTION SERVICE AGREEMENT INFORMATION   */}
      <div>
        <div className="pt-8 pb-4">
          <h3 className="text-primary text-xs font-bold uppercase">
            BILLING & PAYMENT INFORMATION          
          </h3>
        </div>
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
            <SelectComponent disabled={saRecordData?.typeSa !== "main" ? true : false}>
              {dataBillingCycle &&
                dataBillingCycle?.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.value}
                  </Select.Option>
              ))}
            </SelectComponent>
          {/* {saRecordData?.typeSa !== "main" && <span className='text-[11px]'>*Refer to referenced service agreement main</span>} */}
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
            <SelectComponent disabled={saRecordData?.typeSa !== "main" ? true : false}>
              {dataTermOfPayment &&
                dataTermOfPayment?.map((item, index) => (
                  <Select.Option value={item.termsOfPaymentId} key={index}>
                    {item.termsOfPaymentName}
                  </Select.Option>
              ))}
            </SelectComponent>
          </Form.Item>
          {/* {saRecordData?.typeSa !== "main" && <span className='text-[11px]'>*Refer to referenced service agreement main</span>} */}
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
              <SelectComponent disabled={saRecordData?.typeSa !== "main" ? true : false}>
              {dataInvoiceTemplate &&
                dataInvoiceTemplate?.map((item, index) => (
                  <Select.Option value={item.id} key={index}>
                    {item.invoiceName}
                  </Select.Option>
              ))}
              </SelectComponent>
            {/* {saRecordData?.typeSa !== "main" && <span className='text-[11px]'>*Refer to referenced service agreement main</span>} */}
          </Form.Item>
        </div>    
      </div>

      {/* SECTION ADDITIONAL INFORMATION   */}
      <div>
        <div className="pt-8 pb-4">
          <h3 className="text-primary text-xs font-bold uppercase">
            ADDITIONAL INFORMATION          
          </h3>
        </div>
        <div className={"grid grid-cols-3 w-full gap-x-6"}>
          <Form.Item 
            name="alreadyGasIn" 
            label={"Already Gas In"} 
            valuePropName="checked" 
            noStyle
            getValueFromEvent={(e)=>handleSaInformationObj(e, "alreadyGasIn")}
          >
            <div className='flex flex-col'>
              <Checkbox checked={saInfoObj?.alreadyGasIn} onChange={onChangeChecked}>Already Gas In</Checkbox>
              <span className='pl-[26px] text-[10px]'>Check if the service agreement is gas in or not</span>
            </div>
          </Form.Item>
          <Form.Item
            name={"gasInPlanDate"}
            label={"Gas In Plan Date"}
            getValueFromEvent={(e)=>handleSaInformationObj(e, "gasInPlanDate")}
            rules={[
              {
                message: "Please input your ",
                // required: (saInfoObj?.serviceType === 608 && saRecordData?.typeSa === "main") ? !saInfoObj?.alreadyGasIn: true,
                required: (saInfoObj?.serviceType === 608 ) ? !saInfoObj?.alreadyGasIn: true,
              },
            ]}
          >
            <DateComponent 
              dateDisable={handleRangeStartEnd} 
              onChange={(e)=>handleDateValidation(e, "gasInPlanDate")} 
              // disabled={(saInfoObj?.serviceType !== 608 || saRecordData?.typeSa !== "main" || saInfoObj?.alreadyGasIn === true) && true} 
              disabled={(saInfoObj?.serviceType !== 608 || saInfoObj?.alreadyGasIn === true) && true} 
            />
            </Form.Item>
          <Form.Item
            name={"commitmentDate"}
            label={"Commitment Date"}
            getValueFromEvent={(e)=>handleSaInformationObj(e, "commitmentDate")}
            rules={[
              {
                message: "Please input your Commitment Date",
                required: (segment === "KI" && saRecordData?.typeSa === "main") ? true : false,
              },
            ]}
          >
            <DateComponent dateDisable={handleValidateMoreSaDate} onChange={(e)=>handleDateValidation(e, "commitmentDate")} disabled={saRecordData?.typeSa !== "main" ? true : false}/>
            </Form.Item>
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
      </div>
    </div>
  )
}

export default SaInformation