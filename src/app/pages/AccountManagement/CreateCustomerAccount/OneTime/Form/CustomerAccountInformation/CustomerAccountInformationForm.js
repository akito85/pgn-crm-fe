import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Checkbox, Form, Select } from "antd";
import InputComponent from "../../../../../../../components/InputComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import {
  getAccountCategory,
  getAccountGroupType,
  getAccountSegment,
  getAccountType,
  getBudget,
  getBudgetYear,
  getClassificationType,
  getIndustrialSector,
  getMaritalStatus,
  getMeterReadingCode,
  getPriority,
  getSex,
  getTeritory,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";
import UtilsTreeSelect from "../../../../CustomerAccountDetail/DetailPages/AccountInformation/UtilsTreeSelect";
import { onInputUpperCase } from "../../../../Utils";
import DateComponent from "../../../../../../../components/DateComponent";
import moment from "moment";

const CustomerAccountInformation = ({
  dataCustomer,
  dataCheck,
  dispatch = () => {},
  CAIObj = {},
  handleCAIObj,
  form
}) => {
  // Selector
  const {
    data_sex,
    data_maritalStatus,
    data_MRC,
    data_accountCategory,
    data_accountSegment,
    data_accountGroupType,
    data_accountType,
    data_classificationType,
    data_priority,
    data_industrialSector,
    data_budgetYear,
    data_budget,
    data_teritory,
  } = useSelector((state) => state.account);

  // State
  const [description, setDescription] = useState("");
  const [descriptionAI, setDescriptionAI] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(getSex());
    dispatch(getMaritalStatus());
    dispatch(getMeterReadingCode());
    dispatch(getAccountCategory());
    dispatch(getAccountSegment());
    dispatch(getAccountType());
    dispatch(getClassificationType());
    dispatch(getPriority());
    dispatch(getIndustrialSector());
    dispatch(getBudgetYear());
    dispatch(getBudget());
    dispatch(getTeritory());
  }, []);

  useEffect(() => {
    if (CAIObj?.accountSegment) {
      dispatch(getAccountGroupType(CAIObj?.accountSegment));
    }
  }, [CAIObj?.accountSegment]);

  const filterData = (data) => {
    return (data || []).map(item => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterData(item.children),
          disabled: true, // Disable parent nodes with children
        };
      } else {
        return item;
      }
    });
  }

  useEffect(() => {
    if(CAIObj.accountRegistrationNumber){
      if(CAIObj.accountRegistrationNumber.length > 0 && CAIObj.accountRegistrationNumber.length < 11){
        form.validateFields([
          "accountRegistrationNumber"
        ])
      }
    }
  }, [CAIObj, form])
  

  const validateInputNumber = (rule, value, callback) => {
    if (value && value.toString().length < 11) {
      callback("Registration number must be at least 11 digit");
    } else {
      callback();
    }
  };

  const handleDisableEndDate = (current) => {
    return moment().endOf("day") < current;
  };

  const filterTreeNode = (input, treeNode) => {
    return treeNode.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  
  return (
    <div>
      {dataCheck !== "choose" ? (
        <>
          <span className="text-primary uppercase font-bold pt-[30px]">
            CUSTOMER INFORMATION
          </span>
          <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
            <Form.Item
              label={"First Name"}
              name={"firstName"}
              getValueFromEvent={(e) => handleCAIObj(e, "firstName")}
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                },
              ]}
            >
              <InputComponent onInput={onInputUpperCase}/>
            </Form.Item>
            <Form.Item
              label={"Middle Name"}
              name={"middleName"}
              getValueFromEvent={(e) => handleCAIObj(e, "middleName")}
            >
              <InputComponent onInput={onInputUpperCase}/>
            </Form.Item>
            <Form.Item
              label={"Last Name"}
              name={"lastName"}
              getValueFromEvent={(e) => handleCAIObj(e, "lastName")}
            >
              <InputComponent onInput={onInputUpperCase}/>
            </Form.Item>
            <Form.Item
              label={"Customer Name"}
              name={"customerName"}
              valuePropName={
                CAIObj?.firstName || CAIObj?.middleName || CAIObj?.lastName
                  ? `${CAIObj.firstName}${
                    CAIObj.middleName === undefined || CAIObj.middleName === null || CAIObj.middleName === "" ? "" : ` ${CAIObj.middleName}`
                  }${CAIObj.lastName === undefined ? "" : ` ${CAIObj.lastName}`}`
                  : ""
              }
            >
              <InputComponent
                onInput={onInputUpperCase}
                disabled={true}
                value={
                  CAIObj?.firstName || CAIObj?.middleName || CAIObj?.lastName
                    ? `${CAIObj.firstName}${
                      CAIObj.middleName === undefined || CAIObj.middleName === null || CAIObj.middleName === "" ? "" : ` ${CAIObj.middleName}`
                    }${CAIObj.lastName === undefined ? "" : ` ${CAIObj.lastName}`}`
                    : ""
                }
              />
            </Form.Item>
            <Form.Item
              label={"Birth/Founded Date"}
              name={"birthDate"}
              getValueFromEvent={(e) => handleCAIObj(e, "birthDate")}
            >
              {/* <DatePicker
                allowClear
                format={"DD MMM YYYY"}
                style={{ width: "100%" }}
              /> */}
              <DateComponent dateDisable={handleDisableEndDate} />
            </Form.Item>
            <Form.Item
              label={"Birth/Founded Place"}
              name={"birthPlace"}
              getValueFromEvent={(e) => handleCAIObj(e, "birthPlace")}
            >
              <InputComponent />
            </Form.Item>
            <Form.Item
              label={"Sex"}
              name={"sex"}
              getValueFromEvent={(e) => handleCAIObj(e, "sex")}
            >
              <SelectComponent>
                {data_sex &&
                  data_sex?.map((ta, index) => (
                    <Select.Option value={ta.id} key={index}>
                      {ta.name}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              label={"Marital Status"}
              name={"maritalStatus"}
              getValueFromEvent={(e) => handleCAIObj(e, "maritalStatus")}
            >
              <SelectComponent>
                {data_maritalStatus &&
                  data_maritalStatus?.map((ta, index) => (
                    <Select.Option value={ta.id} key={index}>
                      {ta.name}
                    </Select.Option>
                  ))}
              </SelectComponent>
            </Form.Item>
            <Form.Item
              label={"Search Key"}
              name={"search_Key"}
              getValueFromEvent={(e) => handleCAIObj(e, "search_Key")}
            >
              <InputComponent />
            </Form.Item>

            <div className="col-span-3">
              <Form.Item
                label={"Description"}
                name={"description"}
                className={"w-full"}
                getValueFromEvent={(e) => handleCAIObj(e, "description")}
              >
                <InputComponent
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>
        </>
      ) : null}

      <span className="text-primary uppercase font-bold pt-[30px]">
        ACCOUNT INFORMATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Account Group"}
          name={"accountGroup"}
          valuePropName={dataCustomer?.accountGroup?.name}
        >
          <InputComponent
            disabled={true}
            value={dataCustomer?.accountGroup?.name}
          />
        </Form.Item>
        <Form.Item
          label={"Customer Management"}
          name={"customerManagement"}
          valuePropName={dataCustomer?.customerManagement?.name}
        >
          <InputComponent
            disabled={true}
            value={dataCustomer?.customerManagement?.name}
          />
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold pt-[30px]">
        ACCOUNT LOCATION INFORMATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"SOR"}
          name={"sor"}
          valuePropName={dataCustomer?.sor?.name}
        >
          <InputComponent disabled={true} value={dataCustomer?.sor?.name} />
        </Form.Item>
        <Form.Item
          label={"Cost Center"}
          name={"costCenter"}
          valuePropName={dataCustomer?.cc?.name}
        >
          <InputComponent disabled={true} value={dataCustomer?.cc?.name} />
        </Form.Item>
        <Form.Item
          label={"Meter Reading Code"}
          name={"meterReadingCode"}
          rules={[
            {
              required: true,
              message: "Please input your Meter Reading Code!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "meterReadingCode")}
        >
          <SelectComponent>
            {data_MRC &&
              data_MRC?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold pt-[30px]">
        ACCOUNT IDENTIFICATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Account Name"}
          name={"accountName"}
          rules={[
            {
              required: true,
              message: "Please input your Account Name!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "accountName")}
        >
          <InputComponent onInput={onInputUpperCase}/>
        </Form.Item>
        <Form.Item
          label={"Account Registration Number"}
          name={"accountRegistrationNumber"}
          getValueFromEvent={(e) =>
            handleCAIObj(e, "accountRegistrationNumber")
          }
          rules={[
            // {
            //   required: accountRegistrationNumber.length > 0 ? true : false,
            //   message: "Registration number must be at least 11 digit!",
            // },
            { validator: validateInputNumber },
          ]}
        >
          <InputComponent
            maxLength={25}
            // onChange={(e) => setAccountRegistrationNumber(e.target.value)}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
        </Form.Item>
        <Form.Item
          label={"Category"}
          name={"category"}
          rules={[
            {
              required: true,
              message: "Please input your Category!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "category")}
        >
          <SelectComponent>
            {data_accountCategory &&
              data_accountCategory?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"descriptionAI"}
            className={"w-full"}
            getValueFromEvent={(e) => handleCAIObj(e, "descriptionAI")}
          >
            <InputComponent
              type="textarea"
              value={descriptionAI}
              onChange={(e) => setDescriptionAI(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      <span className="text-primary uppercase font-bold pt-[30px]">
        ACCOUNT SEGMENT INFORMATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Account Segment"}
          name={"accountSegment"}
          rules={[
            {
              required: true,
              message: "Please input your Account Segment!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "accountSegment")}
        >
          <SelectComponent>
            {data_accountSegment &&
              data_accountSegment?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Account Group Type"}
          name={"accountGroupType"}
          rules={[
            {
              required: true,
              message: "Please input your Account Group Type!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "accountGroupType")}
        >
          <SelectComponent>
            {data_accountGroupType &&
              data_accountGroupType?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Account Type"}
          name={"accountType"}
          rules={[
            {
              required: true,
              message: "Please input your Account Type!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "accountType")}
        >
          <SelectComponent>
            {data_accountType &&
              data_accountType?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Classification Type"}
          name={"classificationType"}
          rules={[
            {
              required: true,
              message: "Please input your Classification Type!",
            },
          ]}
          getValueFromEvent={(e) => handleCAIObj(e, "classificationType")}
        >
          <SelectComponent>
            {data_classificationType &&
              data_classificationType?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Priority"}
          name={"priority"}
          getValueFromEvent={(e) => handleCAIObj(e, "priority")}
        >
          <SelectComponent>
            {data_priority &&
              data_priority?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Corporate Customer"}
          name={"corporateCustomer"}
          getValueFromEvent={(e) => handleCAIObj(e, "corporateCustomer")}
        >
          <Checkbox>Check if corporate customer</Checkbox>
        </Form.Item>
        <Form.Item
          label={"Rating & Billing Exception"}
          name={"rb"}
          getValueFromEvent={(e) => handleCAIObj(e, "rb")}
        >
          <Checkbox>Check if this account have calculation exception</Checkbox>
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold pt-[30px]">
        ACCOUNT INDUSTRIAL SECTOR
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Industrial Sector"}
          name={"industrialSector"}
          getValueFromEvent={(e) => handleCAIObj(e, "industrialSector")}
        >
          {/* <SelectComponent>
            {data_industrialSector &&
              data_industrialSector?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent> */}
          <UtilsTreeSelect
            treeData={filterData(data_industrialSector)}
            filterTreeNode={filterTreeNode}
            // treeCheckable={true} // Enable checkboxes for tree nodes
            // treeCheckStrictly={true} // Make checkboxes work independently, so you can check items with children
            // onChange={handleTreeSelect}
          />
        </Form.Item>
      </div>

      <span className="text-primary uppercase font-bold pt-[30px]">
        ACCOUNT BUDGET
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Budget Year"}
          name={"budgetYear"}
          getValueFromEvent={(e) => handleCAIObj(e, "budgetYear")}
        >
          <SelectComponent>
            {data_budgetYear &&
              data_budgetYear?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Budget"}
          name={"budget"}
          getValueFromEvent={(e) => handleCAIObj(e, "budget")}
        >
          <SelectComponent>
            {data_budget &&
              data_budget?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Teritory"}
          name={"teritory"}
          getValueFromEvent={(e) => handleCAIObj(e, "teritory")}
        >
          <SelectComponent>
            {data_teritory &&
              data_teritory?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.name}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
      </div>
    </div>
  );
};

export default CustomerAccountInformation;
