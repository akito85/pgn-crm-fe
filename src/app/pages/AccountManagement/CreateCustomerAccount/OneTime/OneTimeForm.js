import React, { useState, useRef, useEffect } from "react";
import { Spin, Steps, Form, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  LeftOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { dateFormatting, hasValue } from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import CustomerIdentificationForm from "./Form/CustomerIdentification/CustomerIdentificationForm";
import SectionFormCAI from "./Form/CustomerAccountInformation/SectionFormCAI";
import AddressForm from "./Form/Address/AddressForm";
import AddressOverview from "./Form/Address/AddressOverview";
import ContactOverview from "./Form/Contact/ContactOverview";
import ContactForm from "./Form/Contact/ContactForm";
import {
  checkCustomer,
  getCategoryAttachment,
  getDetailCustomerOneTime,
  getFinancialInfo,
  createAccount,
  checkRegistrationNumber,
  checkIsPremiseAlready,
} from "../../../../../redux/slices/account_management/Account/accountSlice";
import DistributionMediaForm from "./Form/DistributionMedia/DistributionMediaForm";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import FinancialInformationForm from "./Form/FinancialInformation/FinancialInformationForm";
import ModalConfirmationLayout from "./Modal/ModalConfirmationLayout";
import { IconModal } from "../../../../../utils/Icon";

const OneTimeForm = () => {
  // Selector
  const { data, loading, data_detailCustomerOnetime, data_financialInfo, isPremiseAlready } =
  useSelector((state) => state.account);

  // Declaration
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // State
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dataConfirm, setDataConfirm] = useState({});
  const [createOrChoose, setCreateOrChoose] = useState("");
  const [idOneTime, setIdOneTime] = useState(0);
  // Customer Account Information
  const [caiObj, setCAIObj] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  // Address Information
  const [addressObj, setAddressObj] = useState({});
  const [addressTable, setAddressTable] = useState([]);
  // Contact Information
  const [contactObj, setContactObj] = useState({});
  const [contactTable, setContactTable] = useState([]);
  const [prefix1, setPrefix1] = useState({});
  const [prefix2, setPrefix2] = useState({});
  const [suffix, setSuffix] = useState({});
  const [value, setValue] = useState({});
  const [keyModal, setKeyModal] = useState();
  // Financial Information
  const [fiObj, setFiObj] = useState({});
  // Tax Identifier Information
  const [tiObj, setTiObj] = useState({});
  // Distribution Media Information
  const [dmArray, setDmArray] = useState([]);
  // Withholding Tax Information
  const [wtObj, setWtObj] = useState({});

  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalValidate, setModalValidate] = useState(false);
  const isLoading = loading || loadingForm;

  const [modalPrevLostData, setModalPrevLostData] = useState(false)
  const [modalAlreadyPremise, setModalAlreadyPremise] = useState(false)

  // Use Effect
  useEffect(() => {
    if (idOneTime !== 0) {
      dispatch(getDetailCustomerOneTime(idOneTime));
    }
    dispatch(getCategoryAttachment());
  }, [idOneTime]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Account Management",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName: "Account - One Time",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ONETIME,
      breadcrumbName: "Create Account One Time",
    },
  ];

  const [tabPagesSectionCAI, setTabPagesSectionCAI] = useState([
    {
      value: "Customer/Account Information",
      paramValue: [
        "customerName",
        "meterReadingCode",
        "accountName",
        "category",
        "accountSegment",
        "accountGroupType",
        "accountType",
        "classificationType",
        "accountRegistrationNumber",
        "firstName"
      ],
    },
    { value: "Attachment" },
  ])
  
  const [valuePageSectionCAI, setValuePageSectionCAI] = useState(tabPagesSectionCAI[0].value);

  useEffect(() => {
    form.setFieldsValue({
      [`businessPurpose1`]: addressObj[`businessPurpose1`],
      [`businessPurpose2`]: addressObj[`businessPurpose2`],
      [`businessPurpose3`]: addressObj[`businessPurpose3`],
      [`businessPurpose4`]: addressObj[`businessPurpose4`],
    });
  }, [addressObj]);

  // Handler Info Obj Customer Account Informatiion
  const handleCAIObj = (e, type) => {
    let result;
    switch (type) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "customerName":
      case "search_Key":
      case "description":
      case "accountName":
      case "accountRegistrationNumber":
      case "descriptionAI":
      case "birthPlace":
        result = e.target.value;
        break;
      case "corporateCustomer":
      case "rb":
        result = e.target.checked;
        break;
      default:
        result = e;
        break;
    }
    if (type === "accountSegment") {
      setCAIObj((prevState) => ({
        ...prevState,
        [type]: result,
        accountGroupType: null,
      }));
      form.resetFields(["accountGroupType"]);
    } else if (type === "firstName" || type === "middleName" || type === "lastName" || type === "customerName") {
      const newValue = form.getFieldsValue();
      const temp = {
        ...newValue,
        [type]: result.toUpperCase()
      }
      form.setFieldsValue({
        accountName: temp?.customerName
          ? (temp?.customerName || "").toUpperCase()
          : `${(temp?.firstName || "").toUpperCase()} ${(
            temp?.middleName || ""
          ).toUpperCase()} ${(temp?.lastName || "").toUpperCase()}` || null
      });
      setCAIObj((prevState) => ({
        ...prevState,
        [type]: result.toUpperCase(),
        accountName: temp?.customerName
          ? (temp?.customerName || "").toUpperCase()
          : `${(temp?.firstName || "").toUpperCase()} ${(
            temp?.middleName || ""
          ).toUpperCase()} ${(temp?.lastName || "").toUpperCase()}` || null
      }));
    } else {
      setCAIObj((prevState) => ({
        ...prevState,
        [type]: result,
      }));
    }
    return result;
  };

  // Handler Info Obj Address Informatiion
  const handleAddressObj = (e, type) => {
    let result;
    switch (type) {
      case "address1":
      case "address2":
      case "address3":
      case "address4":
        result = e.target.value;
        break;
      case "premiseAddress1":
      case "premiseAddress2":
      case "premiseAddress3":
      case "premiseAddress4":
        result = e.target.checked;
        break;
      default:
        result = e;
        break;
    }
    if (type?.includes("businessPurpose")) {
      const index = type?.includes("businessPurpose")
        ? parseInt(type?.slice(-1))
        : -1;

      // setAddressObj((prevState) => ({
      //   ...prevState,
      //   [`premiseAddress${index}`]: result.includes(166),
      // }));

      // If you choose ship to, you will run a premise check
      if (index >= 1 && index <= 4) {
        if (type === `businessPurpose${index}`) {

          // check if businessPurpose empty atau businessPurpose not ship to
          if(result.length === 0 || !result.includes(166)){
            setAddressObj((prevState) => ({
              ...prevState,
              [`premiseAddress${index}`]: false,
            }));
          }

          // check if business Purpose ship to
          if (result.includes(166)) {
            console.log(result, "hasilnya");
            dispatch(
              checkIsPremiseAlready({
                premiseFlag: true,
                addressId: addressTable[index - 1]?.addressId,
              })
            )
              .unwrap()
              .then(async (data) => {
                // const updatedKey = `premiseAddress${id}`;
                if (data.success === true) {
                  setAddressObj((prevState) => ({
                    ...prevState,
                    [`premiseAddress${index}`]: true,
                  }));
                }else{
                  setModalAlreadyPremise(true)
                  setAddressObj((prevState) => ({
                    ...prevState,
                    [`businessPurpose${index}`]: prevState[
                      `businessPurpose${index}`
                    ].filter((id) => id !== 166),
                    [`premiseAddress${index}`]: false,
                  }))
                  setAddressTable((prevState) => {
                    const tempTable = [...prevState];
                  
                    tempTable[index-1] = {
                      ...tempTable[index-1],
                      premiseFlag: false,
                      businessPurpose: tempTable[index-1]?.businessPurpose?.filter(
                        (id) => id !== 166
                      ),
                    };
                  
                    return tempTable;
                  });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        }
      }
    }

    setAddressObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));

    const index = type?.includes("businessPurpose")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (index !== -1) {
      setAddressTable((prevState) => {
        let tempTable = [...prevState];
        let premiseFlag = false;

        if (result.includes(166)) {
          premiseFlag = true;
        }

        tempTable[index] = {
          ...tempTable[index],
          businessPurpose: result,
          premiseFlag: premiseFlag,
        };
        return tempTable;
      });
    }

    const indexPremise = type?.includes("premiseAddress")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    // if (indexPremise !== -1) {
    //   setAddressTable((prevState) => {
    //     let tempTable = [...prevState];

    //     const obj = result ? true : false;
    //     tempTable[indexPremise] = {
    //       ...tempTable[indexPremise],
    //       premiseFlag: obj,
    //     };
    //     return tempTable;
    //   });
    // }
    if (indexPremise !== -1) {


      
      if (indexPremise >= 0 && indexPremise <= 3) {
        if(type === `premiseAddress${indexPremise+1}` && result === true){
          console.log(addressTable, "apaan");
            dispatch(
              checkIsPremiseAlready({
                premiseFlag: true,
                addressId: addressTable[indexPremise]?.addressId,
              })
            )
            .unwrap()
            .then(async (data) => {
              if (data && data.success === true) {
                setAddressTable((prevState) => {
                  const tempTable = [...prevState];

                  // Check if premiseFlag is being set to false
                  const obj = result ? true : false;
        
                  tempTable[indexPremise] = {
                    ...tempTable[indexPremise],
                    businessPurpose: [
                      ...(tempTable[indexPremise].businessPurpose || []),
                      166,
                    ],
                    premiseFlag: obj,
                  };
                  setAddressObj((prevObj) => ({
                    ...prevObj,
                    [`businessPurpose${indexPremise + 1}`]: [
                      ...(prevObj[`businessPurpose${indexPremise + 1}`] || []),
                      166,
                    ],
                    [`premiseAddress${indexPremise + 1}`]: true,
                  }));
                  return tempTable;
                });
              }else{
                setAddressTable((prevState) => {
                  const tempTable = [...prevState];
                  const businessPurposeKey = `businessPurpose${indexPremise + 1}`;
                
                  tempTable[indexPremise] = {
                    ...tempTable[indexPremise],
                    premiseFlag: false,
                    businessPurpose: tempTable[indexPremise]?.businessPurpose?.filter(
                      (id) => id !== 166
                    ),
                  };
                
                  setAddressObj((prevObj) => ({
                    ...prevObj,
                    [businessPurposeKey]:
                      prevObj && prevObj[businessPurposeKey]
                        ? prevObj[businessPurposeKey]?.filter((id) => id !== 166)
                        : [],
                    [`premiseAddress${indexPremise + 1}`]: false,
                  }));
                
                  return tempTable;
                });
                
                setModalAlreadyPremise(true)
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else{
          setAddressTable((prevState) => {
            let tempTable = [...prevState];

            // Check if premiseFlag is being set to false
            if (!result && tempTable[indexPremise].premiseFlag) {
              // Deselect id 166
              tempTable[indexPremise] = {
                ...tempTable[indexPremise],
                premiseFlag: false,
                businessPurpose: tempTable[indexPremise]?.businessPurpose.filter(
                  (id) => id !== 166
                ),
              };
              setAddressObj((prevObj) => ({
                ...prevObj,
                [`businessPurpose${indexPremise + 1}`]: prevObj[
                  `businessPurpose${indexPremise + 1}`
                ].filter((id) => id !== 166),
                [`premiseAddress${indexPremise + 1}`]: false,
              }));
            } else {
              const obj = result ? true : false;

              tempTable[indexPremise] = {
                ...tempTable[indexPremise],
                businessPurpose: [
                  ...(tempTable[indexPremise].businessPurpose || []),
                  166,
                ],
                premiseFlag: obj,
              };
              setAddressObj((prevObj) => ({
                ...prevObj,
                [`businessPurpose${indexPremise + 1}`]: [
                  ...(prevObj[`businessPurpose${indexPremise + 1}`] || []),
                  166,
                ],
                [`premiseAddress${indexPremise + 1}`]: true,
              }));
            }
            return tempTable;
          });
        }
      }
    }
    return result;
  };

    //handle reset
    const handleContactChangesByAddress = (keyModal, table, type) => {
      Object.keys(contactObj)
      .filter(key => key.startsWith('contactAddress'))
      .forEach((key, i) => {
        if(contactObj[`contactAddress${i + 1}`] !== null){
          
        let temp = (table || []).find((itemB, indexB) => (itemB.addressId ? itemB.addressId === contactObj[`contactAddress${i + 1}`] : itemB.tempId === contactObj[`contactAddress${i + 1}`]));
        if(type === "delete"){
          if (!temp || contactObj[`contactAddress${i + 1}`] === `TEMP${keyModal || 0}`) {
            form.resetFields([`contactAddress${i + 1}`]);
            setContactObj((prevState) => ({
              ...prevState,
              [`contactAddress${i + 1}`]: null,
            }));
            setContactTable((prevState) => {
              let tempTable = [...prevState];
              tempTable[i] = {
                ...tempTable[i],
                contactAddress: null,
              };
              return tempTable;
            });
          } else if (isNaN(contactObj[`contactAddress${i+1}`])){
            form.setFieldsValue({
              [`contactAddress${i + 1}`]: parseInt(contactObj[`contactAddress${i + 1}`].replace('TEMP', ''), 10) <= 1 ? null : `TEMP${parseInt(contactObj[`contactAddress${i + 1}`].replace('TEMP', ''), 10) - 1}` 
            });
            setContactObj((prevState) => ({
              ...prevState,
              [`contactAddress${i + 1}`]: parseInt(contactObj[`contactAddress${i + 1}`].replace('TEMP', ''), 10) <= 1 ? null : `TEMP${parseInt(contactObj[`contactAddress${i + 1}`].replace('TEMP', ''), 10) - 1}`
            }));
            setContactTable((prevState) => {
              let tempTable = [...prevState];
              tempTable[i] = {
                ...tempTable[i],
                contactAddress: parseInt(contactObj[`contactAddress${i + 1}`].replace('TEMP', ''), 10) <= 1 ? null : `TEMP${parseInt(contactObj[`contactAddress${i + 1}`].replace('TEMP', ''), 10) - 1}`
              };
              return tempTable;
            });
          }
        } else {
          //create new , reset the same id or no id found
          if (!temp || contactObj[`contactAddress${i + 1}`] === `TEMP${keyModal || 0}`) {
            form.resetFields([`contactAddress${i + 1}`]);
            setContactObj((prevState) => ({
              ...prevState,
              [`contactAddress${i + 1}`]: null,
            }));
            setContactTable((prevState) => {
              let tempTable = [...prevState];
              tempTable[i] = {
                ...tempTable[i],
                contactAddress: null,
              };
              return tempTable;
            });
          }
        }
  
        }
      });
    }

  // Handler Info Obj Contact Informatiion
  const handleContactObj = (e, type) => {
    let result;
    switch (type) {
      case "description1":
      case "description2":
      case "description3":
      case "description4":
      case "additionalNote1":
      case "additionalNote2":
      case "additionalNote3":
      case "additionalNote4":
        result = e?.target?.value;
        break;
      default:
        result = e;
        break;
    }

    setContactObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));

    if(result === null){
      form.resetFields([type])
    }

    const index = type?.includes("description")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (index !== -1) {
      setContactTable((prevState) => {
        let tempTable = [...prevState];

        tempTable[index] = {
          ...tempTable[index],
          description: result,
        };
        return tempTable;
      });
    }

    const indexAN = type?.includes("additionalNote")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (indexAN !== -1) {
      setContactTable((prevState) => {
        let tempTable = [...prevState];

        tempTable[indexAN] = {
          ...tempTable[indexAN],
          additionalNote: result,
        };
        return tempTable;
      });
    }

    const indexAC = type?.includes("contactAddress")
      ? parseInt(type?.slice(-1)) - 1
      : -1;

    if (indexAC !== -1) {
      setContactTable((prevState) => {
        let tempTable = [...prevState];

        tempTable[indexAC] = {
          ...tempTable[indexAC],
          contactAddress:
            typeof result !== "string" ? result?.toString() : result,
        };
        return tempTable;
      });
    }

    return result;
  };

  // Handler Info Obj Financial Information
  const handleFIObj = (e, type) => {
    let result;
    switch (type) {
      case "generateVA":
        result = e.target.checked;
        break;
      default:
        result = e;
        break;
    }
    setFiObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  // Handler Info Obj Tax Identifier
  const handleTIObj = (e, type) => {
    let result;
    switch (type) {
      case "taxIdentifierNumber":
      case "taxIdentifierName":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setTiObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  // Handler Info Obj Withholding Tax
  const handleWTObj = (e, type) => {
    let result;
    switch (type) {
      case "description":
        result = e.target.value;
        break;
      case "wapuFlag":
        result = e.target.checked;
        break;
      default:
        result = e;
        break;
    }
    setWtObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  const handleMandatory = (setTabPagesSectionCAI = () => {}, listDataAttachment, errorFields) => {
    setTabPagesSectionCAI((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge = item.value !== "Attachment" ? (errorFields || []).reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        ) : listDataAttachment.length < 1 ? 1 : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  }

  const FunctionCheckValidateAccount = () => {
    form
      .validateFields()
      .then((values) => {
        handleMandatory(setTabPagesSectionCAI, listDataAttachment);
        const body = {
          registrationNumber: caiObj?.accountRegistrationNumber || "",
        };
        dispatch(checkRegistrationNumber(body))
          .unwrap()
          .then((res) => {
            if (listDataAttachment.length > 0 && data?.registered === false) {
              if (
                tiObj.taxIdentifierType === 922 ||
                tiObj.taxIdentifierType === 921
              ) {
                setTiObj((prevState) => ({
                  ...prevState,
                  taxIdentifierName: data?.registered
                    ? data?.customerInformation?.customerName
                    : caiObj?.customerName ||
                      `${caiObj?.firstName} ${caiObj?.middleName || ""} ${
                        caiObj?.lastName || ""
                      }`,
                }));
              }
              next();
              scrollRightHandler();
            } else if (data?.registered === true) {
              if (
                tiObj.taxIdentifierType === 922 ||
                tiObj.taxIdentifierType === 921
              ) {
                setTiObj((prevState) => ({
                  ...prevState,
                  taxIdentifierName: data?.registered
                    ? data?.customerInformation?.customerName
                    : caiObj?.customerName ||
                      `${caiObj?.firstName} ${caiObj?.middleName || ""} ${
                        caiObj?.lastName || ""
                      }`,
                }));
              }
              next();
              scrollRightHandler();
            }
          });
      })
      .catch((error) => {
        console.error("Validation failed:", error);
        handleMandatory(
          setTabPagesSectionCAI,
          listDataAttachment,
          error.errorFields
        );
      });

  }
  const FunctionCheckValidateAddress = () => {
    form
      .validateFields([
        `businessPurpose1`,
        `businessPurpose2`,
        `businessPurpose3`,
        `businessPurpose4`,
      ])
      .then((values) => {
        next();
        scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  }

  const FunctionCheckValidateContact = () => {
    form
      .validateFields([
        `contactAddress1`,
        `contactAddress2`,
        `contactAddress3`,
        `contactAddress4`,
      ])
      .then((values) => {
        next();
        scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  }

  // Handle Next
  const handleButtonNext = (body) => {
    switch (steps[current].title) {
      case "CUSTOMER IDENTIFICATION":
        FunctionCheckCustomer(body);
        break;
      case "DISTRIBUTION MEDIA":
        FunctionGetFinancialInfo();
        break;
      case "ACCOUNT INFORMATION":
        FunctionCheckValidateAccount();
        break;
      case "ADDRESS":
        FunctionCheckValidateAddress();
        break;
      case "CONTACT":
        FunctionCheckValidateContact();
        break;
      default:
        next();
        scrollRightHandler();
        break;
    }
  };

  // Validation Business Purpose Information
  const validateBusinessPurpose = (index) => {
    if (
      addressTable[index] &&
      addressObj[`businessPurpose${index + 1}`]?.length > 0
    ) {
      return addressObj[`businessPurpose${index + 1}`];
    } else {
      return false;
    }
  };

  // Validation Address Information
  const validateAddress = () => {
    if (addressTable.length === 1) {
      return validateBusinessPurpose(0);
    }
    if (addressTable.length === 2) {
      return validateBusinessPurpose(1);
    }
    if (addressTable.length === 3) {
      return validateBusinessPurpose(2);
    }
    if (addressTable.length === 4) {
      return validateBusinessPurpose(3);
    } else {
      return false;
    }
  };

  // Validation Contact Address Information
  // const validateContactAddress = (index) => {
  //   if (contactTable[index] && contactObj[`contactAddress${index + 1}`] !== 0) {
  //     return contactObj[`contactAddress${index + 1}`];
  //   } else {
  //     return false;
  //   }
  // };

  // Validation Contact Information
  // const validateContact = () => {
  //   if (contactTable.length === 1) {
  //     return validateContactAddress(0);
  //   }
  //   if (contactTable.length === 2) {
  //     return validateContactAddress(1);
  //   }
  //   if (contactTable.length === 3) {
  //     return validateContactAddress(2);
  //   }
  //   if (contactTable.length === 4) {
  //     return validateContactAddress(3);
  //   } else {
  //     return false;
  //   }
  // };
  const dataContactAddress = (obj) =>{
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) {
        return true;
      }
    }
    return false;
  }

  const validationReadyAI = () => {
    if (data?.registered === true) {
      return caiObj.accountName;
    }
    if (data?.registered === false) {
      return caiObj.firstName;
    } else {
      return false;
    }
  };

  const validateAccountRegistrationNumber = () => {
    if(caiObj.accountRegistrationNumber){
      if(caiObj.accountRegistrationNumber.length > 0 && caiObj.accountRegistrationNumber.length < 11){
        return true;
      } else {
        return false
      }
    } else {
      return false;
    }
  }

  // Step
  const steps = [
    {
      title: "CUSTOMER IDENTIFICATION",
      content: (
        <CustomerIdentificationForm
          handleNext={handleButtonNext}
          dispatch={dispatch}
          setIdOneTime={setIdOneTime}
          setCreateOrChoose={setCreateOrChoose}
        />
      ),
    },
    {
      title: "ACCOUNT INFORMATION",
      content: (
        <SectionFormCAI
          dataCustomer={data}
          dataCheck={createOrChoose}
          dispatch={dispatch}
          handleCAIObj={handleCAIObj}
          CAIObj={caiObj}
          dataAttachment={listDataAttachment}
          updatedDataAttachment={setListDataAttachment}
          form={form}
          setValuePage={setValuePageSectionCAI}
          valuePage={valuePageSectionCAI}
          tabPages={tabPagesSectionCAI}
        />
      ),
      disabled: false
        // !validationReadyAI() ||
        // !caiObj.meterReadingCode ||
        // !caiObj.category ||
        // !caiObj.accountSegment ||
        // !caiObj.accountGroupType ||
        // !caiObj.accountType ||
        // !caiObj.classificationType||
        // validateAccountRegistrationNumber(),
    },
    {
      title: "ADDRESS",
      content: (
        <AddressForm
          dispatch={dispatch}
          handleAddressObj={handleAddressObj}
          addressObj={addressObj}
          addressTable={addressTable}
          setAddressTable={setAddressTable}
          customerId={data_detailCustomerOnetime?.customerId === undefined ? null : data_detailCustomerOnetime?.customerId}
          handleContactChangesByAddress={handleContactChangesByAddress}
          setAddressObj={setAddressObj}
          setTiObj={setTiObj}
          tiObj={tiObj}
        />
      ),
      disabled: false 
      // addressTable.length === 0 || !validateAddress(),
    },
    {
      title: "CONTACT",
      content: (
        <ContactForm
          dispatch={dispatch}
          handleContactObj={handleContactObj}
          contactObj={contactObj}
          contactTable={contactTable}
          setContactTable={setContactTable}
          dataAddress={addressTable}
          prefix1={prefix1}
          setPrefix1={setPrefix1}
          prefix2={prefix2}
          setPrefix2={setPrefix2}
          suffix={suffix}
          setSuffix={setSuffix}
          value={value}
          setValue={setValue}
          keyModal={keyModal}
          setKeyModal={setKeyModal}
          customerId={data_detailCustomerOnetime?.customerId === undefined ? null : data_detailCustomerOnetime?.customerId}
          form={form}
        />
      ),
      // disabled: contactTable.length === 0 || !validateContact(),
      disabled: false 
      // contactTable.length === 0 || dataContactAddress(contactObj),
    },
    {
      title: "DISTRIBUTION MEDIA",
      content: (
        <DistributionMediaForm
          dispatch={dispatch}
          data={dmArray}
          setData={setDmArray}
          type={"create"}
        />
      ),
      disabled: false 
      // dmArray.length === 0,
    },
    {
      title: "FINANCIAL INFORMATION",
      content: (
        <FinancialInformationForm
          handleFIObj={handleFIObj}
          handleTIObj={handleTIObj}
          handleWTObj={handleWTObj}
          tiObj={tiObj}
          wtObj={wtObj}
          fiObj={fiObj}
          dispatch={dispatch}
          dataFinancialInfo={data_financialInfo}
          dataAddress={addressTable}
          form={form}
          setTiObj={setTiObj}
        />
      ),
    },
  ];

  // Button Next
  const next = () => {
    setCurrent(current + 1);
  };

  const handleOkLostData = () => {
    setCAIObj({})
    setListDataAttachment([])
    setAddressObj({})
    setAddressTable([])
    setContactObj({})
    setContactTable([])
    setFiObj({})
    setTiObj({})
    setDmArray([])
    setWtObj({})
    form.resetFields()
    setCurrent(current - 1);
    setModalPrevLostData(false)
  }
  // Button Previous
  const prev = () => {
    if(current === 1){
      setModalPrevLostData(true)
    }else{
      setCurrent(current - 1);
    }
  };

  // Scroll Left Handler
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  // Scroll Right Handler
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  // Scroll Handler
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  // Mapping Step
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Handle Clear
  const handleClear = () => {
    if (steps[current].title === "ACCOUNT INFORMATION") {
      form.resetFields([
        "firstName",
        "middleName",
        "lastName",
        "customerName",
        "birthDate",
        "birthPlace",
        "sex",
        "maritalStatus",
        "search_Key",
        "description",
        "accountGroup",
        "customerManagement",
        "meterReadingCode",
        "accountName",
        "accountRegistrationNumber",
        "category",
        "descriptionAI",
        "accountSegment",
        "accountGroupType",
        "accountType",
        "classificationType",
        "priority",
        "corporateCustomer",
        "rb",
        "industrialSector",
        "budgetYear",
        "budget",
        "teritory",
      ]);
      setListDataAttachment([]);
      setCAIObj({});
    }
    if (steps[current].title === "ADDRESS") {
      form.resetFields([
        "businessPurpose1",
        "businessPurpose2",
        "businessPurpose3",
        "businessPurpose4",
        "premiseAddress1",
        "premiseAddress2",
        "premiseAddress3",
        "premiseAddress4",
      ]);
      setAddressTable([]);
      setAddressObj({});
    }
    if (steps[current].title === "CONTACT") {
      form.resetFields([
        "contactAddress1",
        "contactAddress2",
        "contactAddress3",
        "contactAddress4",
        "additionalNote1",
        "additionalNote2",
        "additionalNote3",
        "additionalNote4",
        "description1",
        "description2",
        "description3",
        "description4",
        "description5",
      ]);
      setContactTable([]);
      setContactObj({});
    }
    if (steps[current].title === "DISTRIBUTION MEDIA") {
      setDmArray([]);
    }
    if (steps[current].title === "FINANCIAL INFORMATION") {
      form.resetFields([
        "paymentChannelType",
        "generateVA",
        "taxIdentifierType",
        "taxIdentifierNumber",
        "taxIdentifierName",
        "taxAddress",
        "relatedAccountId",
        "startDateTI",
        "descriptionTI",
        "startDateWT",
        "descriptionWT",
      ]);
      setFiObj({});
      setTiObj({});
    }
  };

  const FunctionCheckCustomer = (bodyVal) => {
    const body = {
      customerType: bodyVal.customerTypeId || null,
      identificationType: bodyVal.identificationTypeId || null,
      identificationNumber: bodyVal.identificationNumber || null,
      accountGroup: "ONE_TIME",
    };
    dispatch(checkCustomer({ body: body }))
      .unwrap()
      .then(() => {
        next();
        scrollRightHandler();
      })
      .catch(() => {
        console.log("error");
      });
  };

  const FunctionGetFinancialInfo = () => {
    if(dmArray?.length === 0){
      setModalValidate(true)
    } else {
      const mappingAddress = addressTable?.map((item) => {
        return {
          addressId: item.addressId,
          countryId: item.countryId,
          provinceId: item.provinceId,
          cityId: item.cityId,
          districtId: item.districtId,
          subDistrictId: item.subDistrictId,
          premiseFlag: item.premiseFlag === undefined ? false : item.premiseFlag,
        };
      });
  
      const body = {
        accountInformation: {
          accountSegment: caiObj?.accountSegment,
          accountGroupType: caiObj?.accountGroupType,
          accountCategory: caiObj?.category,
          accountRuleId: caiObj?.classificationType,
          accountType: caiObj?.accountType,
          sor: data?.sor?.id,
          costCenter: data?.cc?.id,
          budget: caiObj?.budget,
          teritory: caiObj?.teritory,
          corporateFlag:
            caiObj.corporateCustomer === undefined
              ? false
              : caiObj.corporateCustomer,
        },
        accountAddress: mappingAddress,
      };
  
      dispatch(getFinancialInfo({ body: body }))
        .unwrap()
        .then(() => {
          next() && scrollRightHandler();
        })
        .catch(() => {
          next() && scrollRightHandler();
        });
    }
  };

  const handleCustomerName = () => {
    if(data.registered){
      // return data?.customerInformation?.customerName || ""
      return null
    } else {
      return caiObj?.customerName
      ? (caiObj?.customerName || "").toUpperCase()
      : `${(caiObj?.firstName || "").toUpperCase()} ${(
        caiObj?.middleName || ""
      ).toUpperCase()} ${(caiObj?.lastName || "").toUpperCase()}` || null;
    }
  }

  const handlefoundedBirthDate = () => {
    if(data.registered){
      // return hasValue(data?.customerInformation?.dateOfBirth) ? `${moment(data?.customerInformation?.dateOfBirth).format(dateFormatting.date)}` : ""
      return null
    } else {
      return hasValue(caiObj?.birthDate) ? `${moment(caiObj?.birthDate).format(dateFormatting.date)}` : ""
    }
  }
  // Handle Confirmation
  const handleSave = (formValue) => {
    form.validateFields([
      "taxIdentifierType",
      "taxIdentifierNumber",
      "taxIdentifierName",
      "taxAddress"
    ])
      .then((validatedValues) => {
        if (
          validatedValues.taxIdentifierType !== undefined &&
          validatedValues.taxIdentifierNumber !== undefined &&
          validatedValues.taxIdentifierName !== undefined &&
          validatedValues.taxAddress !== undefined
        ) {
          const mappingBillingBucket = data_financialInfo?.billingBucket?.map(
            (a) => a.billingBucketCode
          );

          const mappingTaxImplication = data_financialInfo?.taxImpli?.map(
            (a) => a.id
          );
          const bodyCustomerInformation = {
            customerId: data?.registered ? data?.customerInformation?.customerId : null,
            firstName: data?.registered ? data?.customerInformation?.firstName : (caiObj?.firstName || "").toUpperCase() || null,
            middleName: data?.registered ? data?.customerInformation?.middleName : (caiObj?.middleName || "").toUpperCase() || null,
            lastName: data?.registered ? data?.customerInformation?.lastName : (caiObj?.lastName || "").toUpperCase() || null,
            foundedBirthPlace: data?.registered ? data?.customerInformation?.placeOfBirth : caiObj?.birthPlace || null,
            sex: data?.registered ? data?.customerInformation?.sex : caiObj?.sex || null,
            maritalStatus: data?.registered ? data?.customerInformation?.maritalStatus : caiObj?.maritalStatus || null,
            searchKey:data?.registered ? data?.customerInformation?.searchKey : caiObj?.search_Key || null,
            description: data?.registered ? data?.customerInformation?.description : caiObj?.description || null,
            
            // firstName: data?.registered ? null : (caiObj?.firstName || "").toUpperCase(),
            // middleName: data?.registered ? null : (caiObj?.middleName || "").toUpperCase(),
            // lastName: data?.registered ? null : (caiObj?.lastName || "").toUpperCase(),
            // customerName: handleCustomerName(),
            // foundedBirthDate2: handlefoundedBirthDate(),
            // foundedBirthPlace: data?.registered ? null : caiObj?.birthPlace || null,
            // sex: data?.registered ? null : caiObj?.sex || null,
            // maritalStatus: data?.registered ? null : caiObj?.maritalStatus || null,
            // searchKey:data?.registered ? null : caiObj?.search_Key || null,
            // description: data?.registered ? null : caiObj?.description || null,
          };

          const bodyAccountInformation = {
            customerId: null,
            accountId: null,
            accountGroup: data?.accountGroup?.id || null, // belum ada
            customerManagement: data?.customerManagement?.id || null, // belum ada
            sor: data?.sor?.id || null,
            costCenter: data?.cc?.id || null,
            meterReadingCode: caiObj?.meterReadingCode || null,
            accountName: (caiObj?.accountName || "").toUpperCase() || null,
            registrationNumber: caiObj?.accountRegistrationNumber || null,
            accountCategory: caiObj?.category || null,
            description: caiObj?.descriptionAI || null,
            accountSegment: caiObj?.accountSegment || null,
            accountGroupType: caiObj?.accountGroupType || null,
            accountType: caiObj?.accountType || null,
            accountRuleId: caiObj?.classificationType || null,
            priority: caiObj?.priority || null,
            corporateFlag:
              caiObj.corporateCustomer === undefined
                ? false
                : caiObj.corporateCustomer,
            exceptionFlag: caiObj.rb === undefined ? false : caiObj.rb, // belum ada
            industrialSector: caiObj?.industrialSector || null, // belum ada
            budgetYear: caiObj?.budgetYear || null,
            budget: caiObj?.budget || null,
            teritory: caiObj?.teritory || null,
          };

          const address1 = addressTable[0];
          const address2 = addressTable.length >= 2 ? addressTable[1] : null;
          const address3 = addressTable.length >= 3 ? addressTable[2] : null;
          const address4 = addressTable.length >= 4 ? addressTable[3] : null;

          const bodyAddress = {
            address1: {
              ...address1,
              businessPurpose: addressObj?.businessPurpose1 || [],
              premiseFlag: addressObj?.premiseAddress1 || false,
            },
            address2:
              address2 !== null
                ? {
                  ...address2,
                  businessPurpose: addressObj?.businessPurpose2 || [],
                  premiseFlag: addressObj?.premiseAddress2 || false,
                }
                : null,
            address3:
              address3 !== null
                ? {
                  ...address3,
                  businessPurpose: addressObj?.businessPurpose3 || [],
                  premiseFlag: addressObj?.premiseAddress3 || false,
                }
                : null,
            address4:
              address4 !== null
                ? {
                  ...address4,
                  businessPurpose: addressObj?.businessPurpose4 || [],
                  premiseFlag: addressObj?.premiseAddress4 || false,
                }
                : null,
          };

          const contact1 = contactTable[0];
          const contact2 = contactTable.length >= 2 ? contactTable[1] : null;
          const contact3 = contactTable.length >= 3 ? contactTable[2] : null;
          const contact4 = contactTable.length >= 4 ? contactTable[3] : null;

          const bodyContact = {
            contact1:
              contact1 !== null
                ? {
                  ...contact1,
                  description: contactObj?.description1 || null,
                  contactAddress:
                    typeof contactObj !== "undefined" && contactObj.contactAddress1
                      ? typeof contactObj.contactAddress1 !== "string"
                        ? contactObj.contactAddress1.toString()
                        : contactObj.contactAddress1
                      : null,
                  additionalNote: contactObj?.additionalNote1 || null,
                }
                : null,
            contact2:
              contact2 !== null
                ? {
                  ...contact2,
                  description: contactObj?.description2 || null,
                  contactAddress:
                    typeof contactObj !== "undefined" && contactObj.contactAddress2
                      ? typeof contactObj.contactAddress2 !== "string"
                        ? contactObj.contactAddress2.toString()
                        : contactObj.contactAddress2
                      : null,
                  additionalNote: contactObj?.additionalNote2 || null,
                }
                : null,
            contact3:
              contact3 !== null
                ? {
                  ...contact3,
                  description: contactObj?.description3 || null,
                  contactAddress:
                    typeof contactObj !== "undefined" && contactObj.contactAddress3
                      ? typeof contactObj.contactAddress3 !== "string"
                        ? contactObj.contactAddress3.toString()
                        : contactObj.contactAddress3
                      : null,
                  additionalNote: contactObj?.additionalNote3 || null,
                }
                : null,
            contact4:
              contact4 !== null
                ? {
                  ...contact4,
                  description: contactObj?.description4 || null,
                  contactAddress:
                    typeof contactObj !== "undefined" && contactObj.contactAddress4
                      ? typeof contactObj.contactAddress4 !== "string"
                        ? contactObj.contactAddress4.toString()
                        : contactObj.contactAddress4
                      : null,
                  additionalNote: contactObj?.additionalNote4 || null,
                }
                : null,
          };

          const bodyRelationTax = {
            relatedAccountId: tiObj?.accountId || null,
            startDate: formValue.startDateTI ? moment(formValue.startDateTI).format(dateFormatting.date) || null : null,
            description: formValue.descriptionTI || null,
          };
          delete tiObj.accountId;

          const bodyData = {
            customerInformation: bodyCustomerInformation,
            accountInformation: bodyAccountInformation,
            accountAddress: bodyAddress,
            accountContact: bodyContact,
            distributionMedia: dmArray,
            financialInformation: {
              paymentChannel: {
                paymentChannelType: fiObj.paymentChannelType,
                virtualAccount:
                  fiObj.generateVA === undefined ? false : fiObj.generateVA,
              },
              taxIdentifier: {
                ...tiObj,
                taxAddress:
                  typeof tiObj?.taxAddress !== "string"
                    ? tiObj?.taxAddress?.toString()
                    : tiObj?.taxAddress,
              },
              // taxRelation: {
              //   relatedAccountId: formValue.relatedAccountId || null,
              //   startDate: hasValue(formValue.startDateTI) ? moment(formValue.startDateTI).format(dateFormatting.date) : null,
              //   description: formValue.descriptionTI || null,
              // },
              taxRelation: bodyRelationTax,
              wapu: {
                startDate: hasValue(formValue.startDateWT) ? moment(formValue.startDateWT).format(dateFormatting.date) : null,
                wapuFlag: wtObj.wapuFlag === undefined ? false : wtObj.wapuFlag,
                description: formValue.descriptionWT || null,
              },
              billingBucket: mappingBillingBucket || [],
              taxImplication: mappingTaxImplication || [],
            },
            registered: data?.registered,
            // customerId: data?.customerInformation === undefined ? null : data?.customerInformation?.customerId,
            customerId: data?.registered ? data?.customerInformation?.customerId : null,
            tempForm : formValue,
          };
          setDataConfirm(bodyData);
          setModalConfirm(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleCreateAccount = () => {
    // Account Address
    if (dataConfirm.accountAddress) {
      for (let i = 1; i <= 4; i++) {
        const addressKey = `address${i}`;
        if (dataConfirm.accountAddress[addressKey]) {
          const address = dataConfirm.accountAddress[addressKey];
          delete address.key;
          delete address.overview;
          delete address.city;
          delete address.country;
          delete address.district;
          delete address.subDistrict;
          // delete address.fullAddress;
          delete address.postalCode;
          delete address.province;
          delete address.type;
          delete address.streetNumber;
        }
      }
    }

    // Account Contact
    if (dataConfirm.accountContact) {
      for (let i = 1; i <= 4; i++) {
        const contactKey = `contact${i}`;
        if (dataConfirm.accountContact[contactKey]) {
          const contact = dataConfirm.accountContact[contactKey];
          const contactDetail =
            dataConfirm.accountContact[contactKey].contactDetail;
          delete contact.key;
          delete contact.overview;
          delete contact.contactDetails;
          delete contact.status;
          delete contact.positionName;
          delete contact.jobName;
          delete contact.source;
          delete contactDetail?.map((a) => {
            return {
              row: delete a.row,
              key: delete a.key,
            };
          });
        }
      }
    }

    // Distribution Media
    dataConfirm.distributionMedia?.map((a) => delete a.key);

    //delete form temp
    delete dataConfirm.tempForm

    const finalSubmitData = {
      ...dataConfirm,
      customerInformation : {
        customerId: null,
        firstName: data?.registered ? null : (caiObj?.firstName || "").toUpperCase(),
        middleName: data?.registered ? null : (caiObj?.middleName || "").toUpperCase(),
        lastName: data?.registered ? null : (caiObj?.lastName || "").toUpperCase(),
        customerName: data?.registered ? null : handleCustomerName(),
        foundedBirthDate2: handlefoundedBirthDate(),
        foundedBirthPlace: data?.registered ? null : caiObj?.birthPlace || null,
        sex: data?.registered ? null : caiObj?.sex || null,
        maritalStatus: data?.registered ? null : caiObj?.maritalStatus || null,
        searchKey: data?.registered ? null : caiObj?.search_Key || null,
        description: data?.registered ? null : caiObj?.description || null,
      }
    }
    dispatch(createAccount({ body: finalSubmitData }))
      .unwrap()
      .then(async (data_create) => {
        setLoadingForm(true);
        const customerId = data_create?.customer?.customerId;
        for (let icon = 0; icon < listDataAttachment.length; icon++) {
          const element = listDataAttachment[icon];
          const body = {
            file: element.file,
            category: element.fileCategoryId,
          };
          await accountManagementService.uploadAttachment(
            `/v1/dbs/api/customer/create-customer-attachment/${customerId}`,
            body
          );
        }
        setLoadingForm(false);
        setModalConfirm(false);
      })
      .catch((error) => {
        if (Math.floor((error.response.data_create.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ message });
          setModalError(true);
        }
        setModalConfirm(false);
      });

  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleCreateAccount();
    setModalError(false);
    setBodyError({});
  };

  return (
    <>
      <Spin spinning={isLoading}>
        <BreadCrumb routes={routes} />
        {steps[current].title === "ACCOUNT INFORMATION" &&
        createOrChoose === "choose" ? (
          <BaseContainer header={"Customer Information"}>
            <div className="w-full grid grid-cols-4 gap-5">
              <DetailText label={"Customer Number"}>
                {data_detailCustomerOnetime?.customerNumber}
              </DetailText>
              <DetailText label={"Identification Type"}>
                {data_detailCustomerOnetime?.identificationType}
              </DetailText>
              <DetailText label={"Customer Identification Number"}>
                {data_detailCustomerOnetime?.personalIdentificationNumber}
              </DetailText>
              <DetailText label={"Customer Name"}>
                {data_detailCustomerOnetime?.customerName}
              </DetailText>
              <DetailText label={"Customer Type"}>
                {data_detailCustomerOnetime?.customerType}
              </DetailText>
              <DetailText label={"Description"}>
                {data_detailCustomerOnetime?.description}
              </DetailText>
              <DetailText label={"Status"}>
                {data_detailCustomerOnetime?.status}
              </DetailText>
              <DetailText label={"Birth/Founded Place"}>
                {data_detailCustomerOnetime?.placeOfBirth}
              </DetailText>
              <DetailText label={"Birth/Founded Date"}>
                {moment(data_detailCustomerOnetime?.dateOfBirth).format(
                  dateFormatting.date
                )
                  ? moment(data_detailCustomerOnetime?.dateOfBirth).format(
                      dateFormatting.date
                    )
                  : ""}
              </DetailText>
              <DetailText label={"Sex"}>
                {data_detailCustomerOnetime?.sex}
              </DetailText>
              <DetailText label={"Search Key"}>
                {data_detailCustomerOnetime?.searchKey}
              </DetailText>
            </div>
          </BaseContainer>
        ) : null}

        <Form layout="vertical" form={form} onFinish={handleSave}>
          <BaseContainer header={"Account - One Time Information"}>
            <div className="flex flex-row gap-x-6 justify-center">
              <span className="mt-[10px]">
                <LeftCircleOutlined
                  style={{ fontSize: "24px", color: "#0075bf" }}
                  onClick={scrollLeftHandler}
                />
              </span>
              <div
                onScroll={handleScroll}
                ref={containerRef}
                className="overflow-x-scroll scrollStepsCstm"
              >
                <Steps
                  current={current}
                  items={items}
                  labelPlacement="vertical"
                />
              </div>
              <span className="mt-[10px]">
                <RightCircleOutlined
                  style={{ fontSize: "24px", color: "#0075bf" }}
                  onClick={scrollRightHandler}
                />
              </span>
            </div>

            <div className="steps-content my-[30px]">
              {steps[current].content}
            </div>
          </BaseContainer>

          {steps[current].title === "ADDRESS" ? (
            <AddressOverview
              addressTable={addressTable}
              setAddressTable={setAddressTable}
              type={"create"}
              form={form}
              setAddressObj={setAddressObj}
              handleContactChangesByAddress={handleContactChangesByAddress}
            />
          ) : null}

          {steps[current].title === "CONTACT" ? (
            <ContactOverview
              contactTable={contactTable}
              setContactTable={setContactTable}
              dataAddress={addressTable}
              form={form}
              type={"create"}
              prefix1={prefix1}
              prefix2={prefix2}
              suffix={suffix}
              keyModal={keyModal}
              setContactObj={setContactObj}
            />
          ) : null}

          <div className="mt-[30px] flex">
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

            <div className="flex w-full justify-end gap-x-4">
              {steps[current].title !== "CUSTOMER IDENTIFICATION" ? (
                <Form.Item>
                  <ButtonComponent
                    icon={<SVGIcon name={"IconButtonClear"} width={24} />}
                    type="submit"
                    onClick={() => handleClear()}
                  >
                    Clear
                  </ButtonComponent>
                </Form.Item>
              ) : null}
              {current > 0 && (
                <Form.Item>
                  <ButtonComponent
                    onClick={() => {
                      prev();
                      scrollLeftHandler();
                    }}
                    type={"submit"}
                    icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
                  >
                    Previous
                  </ButtonComponent>
                </Form.Item>
              )}

              {current < steps.length - 1 &&
              steps[current].title !== "CUSTOMER IDENTIFICATION" ? (
                <Form.Item>
                  <ButtonComponent
                    onClick={handleButtonNext}
                    type={"submit"}
                    className="ant-btn ant-btn-submit flex w-full justify-center"
                    disabled={steps[current].disabled}
                  >
                    <span className="p-1 text-[18px] text-center">Next</span>
                    <RightOutlined
                      style={{
                        justifyItems: "center",
                        fontSize: "18px",
                        color: "#fff",
                      }}
                    />
                  </ButtonComponent>
                </Form.Item>
              ) : null}
              {current === steps.length - 1 && (
                <Form.Item>
                  <ButtonComponent type={"submit"} htmlType={"submit"}>
                    Save
                  </ButtonComponent>
                </Form.Item>
              )}
            </div>
          </div>
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

        {/* Confirmation */}
        <ModalConfirmationLayout
          data={dataConfirm}
          dataCustomer={data}
          dataCheck={data?.registered}
          dataFinancialInfo={data_financialInfo}
          addressTable={addressTable}
          contactTable={contactTable}
          dataDM={dmArray}
          prefix1={prefix1}
          prefix2={prefix2}
          suffix={suffix}
          keyModal={keyModal}
          listAttachment={listDataAttachment}
          isOpen={modalConfirm}
          handleConfirm={() => handleCreateAccount()}
          handleCancel={() => {
            setDataConfirm({});
            setModalConfirm(false);
          }}
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
            <p className="pl-[70px]">{`Your data was not inactivate ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
        <ModalError
          isOpen={modalValidate}
          handleOk={() => setModalValidate(false)}
          handleCancel={() => setModalValidate(false)}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              {IconModal["icon_error_default"]}
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">
              {"Please Input at least one or more distribution media!"}
            </p>
          </div>
        </ModalError>

        {/* Modal Warning Lost Data */}
        {modalPrevLostData ? (
          // <ModalConfirm
          //   isOpen={modalPrevLostData}
          //   handleCancel={() => setModalPrevLostData(false)}
          //   handleOk={handleOkLostData}
          //   width={400}
          // >
          //   <div className="flex justify-center mt-5 gap-[20px]">
          //     <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          //     <p className="text-[18px] font-bold"></p>
          //   </div>
          //   <div><Alert message="Are you sure you want to go to previous step? your data will be lost!" type="error" /></div>
          // </ModalConfirm>
          <ModalConfirm
            isOpen={modalPrevLostData}
            handleCancel={() => setModalPrevLostData(false)}
            handleOk={handleOkLostData}
            width={500}
          >
            <div className="flex justify-center gap-[20px] mt-6">
              <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
              <p className={"text-[18px] font-bold"}>
                Are you sure want to go back?
              </p>
            </div>
            <Alert
              message="
                If you go to previous step, your data will be lost!"
              type={"error"}
            />
          </ModalConfirm>
        ) : null}

        {/* Modal premise already use */}
        {modalAlreadyPremise ? (
          <ModalError
            isOpen={modalAlreadyPremise}
            handleOk={() => setModalAlreadyPremise(false)}
            handleCancel={() => setModalAlreadyPremise(false)}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                {IconModal["icon_error_default"]}
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{isPremiseAlready?.message}</p>
            </div>
          </ModalError>
        ) : null}
      </Spin>
    </>
  );
};

export default OneTimeForm;
