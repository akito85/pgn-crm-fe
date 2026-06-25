import React, { useState, useRef, useEffect } from "react";
import { Spin, Steps, Form, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  LeftCircleOutlined,
  RightCircleOutlined,
  LeftOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import { dateFormatting } from "../../../../../utils";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import DetailText from "../../../../../components/DetailText";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import CustomerIdentificationForm from "./Form/CustomerIdentification/CustomerIdentificationForm";
import SectionFormCAI from "./Form/CustomerAccountInformation/SectionFormCAI";
import AddressForm from "./Form/Address/AddressForm";
import AddressOverview from "./Form/Address/AddressOverview";
import ContactOverview from "./Form/Contact/ContactOverview";
import ContactForm from "./Form/Contact/ContactForm";
import DistributionMediaForm from "./Form/DistributionMedia/DistributionMediaForm";
import FinancialInformationForm from "./Form/FinancialInformation/FinancialInformationForm";
import ModalCheckCustomer from "./Modal/ModalCheckCustomer";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import {
  checkCustomer,
  checkRegistrationNumber,
  createAccount,
  getFinancialInfo,
  checkIsPremiseAlready,
} from "../../../../../redux/slices/account_management/Account/accountSlice";
import ModalConfirmationLayout from "./Modal/ModalConfirmationLayout";
import accountManagementService from "../../../../../redux/services/account_management/accountManagementService";
import { IconModal } from "../../../../../utils/Icon";

const StandardForm = () => {
  // Selector
  const { data, data_financialInfo, loading, data_create, isPremiseAlready } = useSelector(
    (state) => state.account
  );

  // Declaration
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // State
  const [modalCheckCustomer, setModalCheckCustomer] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dataConfirm, setDataConfirm] = useState({});
  // Customer Information
  const [ciObj, setCIObj] = useState({});
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
  const [fiCurrent, setFiCurrent] = useState(0);
  const [fiErrorFieldName, setFiErrorFieldName] = useState(null);
  // Tax Identifier Information
  const [tiObj, setTiObj] = useState({});
  // Withholding Tax Information
  const [wtObj, setWtObj] = useState({});
  // Distribution Media Information
  const [dmArray, setDmArray] = useState([]);

  const [bodyError, setBodyError] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);

  const [modalPrevLostData, setModalPrevLostData] = useState(false)
  const [modalAlreadyPremise, setModalAlreadyPremise] = useState(false)

  const isLoading = loading || loadingForm;
  const [modalValidate, setModalValidate] = useState(false);
  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Account Management",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_STANDARD,
      breadcrumbName: "Account - Standard",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_STANDARD,
      breadcrumbName: "Create Account Standard",
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
  const [caiErrorType, setCaiErrorType] = useState(null);
  const [caiErrorField, setCaiErrorField] = useState(null);

  useEffect(() => {
    if (valuePageSectionCAI === "Attachment" && caiErrorType === "attachment") {
      if (window) {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      setCaiErrorType(null);
    }
    else if (valuePageSectionCAI === "Customer/Account Information" && caiErrorType === "info" && caiErrorField) {
      form.scrollToField(caiErrorField, {
        block: "center",
        behavior: "smooth",
      });
      setCaiErrorField(null)
      setCaiErrorType(null);
    }
    
  }, [valuePageSectionCAI, caiErrorType, caiErrorField])

  useEffect(() => {
    form.setFieldsValue({
      [`businessPurpose1`]: addressObj[`businessPurpose1`],
      [`businessPurpose2`]: addressObj[`businessPurpose2`],
      [`businessPurpose3`]: addressObj[`businessPurpose3`],
      [`businessPurpose4`]: addressObj[`businessPurpose4`],
    });
  }, [addressObj]);

  // Handler Info Obj Customer Identification
  const handleCIObj = (e, type) => {
    let result;
    switch (type) {
      case "customerIdentificationNumber":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setCIObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));

    if (type === "identificationType") {
      if (result === 61 || result === 60) {
        setTiObj((prevState) => ({
          ...prevState,
          taxIdentifierType: result === 61 ? 922 : 921,
        }));
      } else {
        setTiObj((prevState) => ({
          ...prevState,
          taxIdentifierType: null,
          taxIdentifierNumber: null,
        }));
      }
      form.resetFields(["customerIdentificationNumber"]);
    }

    if (type === "customerIdentificationNumber") {
      if (tiObj.taxIdentifierType === 922 || tiObj.taxIdentifierType === 921) {
        setTiObj((prevState) => ({
          ...prevState,
          taxIdentifierNumber: result,
        }));
      }
      if (result.length === 16 && ciObj.identificationType === 60) {
        form.setFieldsValue({
          customerIdentificationNumberNpwp: `${result.slice(
            0,
            3
          )}.${result.slice(3, 6)}.${result.slice(6, 9)}.${result.slice(
            9,
            10
          )}-${result.slice(10, 13)}.${result.slice(13)}`,
        });
      } else {
        form.setFieldsValue({
          customerIdentificationNumberNpwp: result,
        });
      }
    }
    return result;
  };

  // Handler Info Obj Customer Account Informatiion
  const handleCAIObj = (e, type) => {
    let result;
    switch (type) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "search_Key":
      case "description":
      case "accountName":
      case "accountRegistrationNumber":
      case "descriptionAI":
      case "customerName":
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
    } 
    else if(type === "firstName" || type === "middleName" || type === "lastName" || type === "customerName"){
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
    }
    else {
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
  // const handleAddressObj = (e, type) => {
  //   let result;
  //   switch (type) {
  //     case "address1":
  //     case "address2":
  //     case "address3":
  //     case "address4":
  //       result = e.target.value;
  //       break;
  //     case "premiseAddress1":
  //     case "premiseAddress2":
  //     case "premiseAddress3":
  //     case "premiseAddress4":
  //       result = e.target.checked;
  //       break;
  //     default:
  //       result = e;
  //       break;
  //   }

  //   if (type?.includes("businessPurpose")) {
  //     const index = type?.includes("businessPurpose")
  //       ? parseInt(type?.slice(-1))
  //       : -1;
  //     setAddressObj((prevState) => ({
  //       ...prevState,
  //       [`premiseAddress${index}`]: result.includes(166),
  //     }));
  //   }

  //   setAddressObj((prevState) => ({
  //     ...prevState,
  //     [type]: result,
  //   }));

  //   const index = type?.includes("businessPurpose")
  //     ? parseInt(type?.slice(-1)) - 1
  //     : -1;

  //   if (index !== -1) {
  //     setAddressTable((prevState) => {
  //       let tempTable = [...prevState];
  //       let premiseFlag = false;

  //       if (result.includes(166)) {
  //         premiseFlag = true;
  //       }

  //       tempTable[index] = {
  //         ...tempTable[index],
  //         businessPurpose: result,
  //         premiseFlag: premiseFlag,
  //       };
  //       return tempTable;
  //     });
  //   }

  //   const indexPremise = type?.includes("premiseAddress")
  //     ? parseInt(type?.slice(-1)) - 1
  //     : -1;

  //   if (indexPremise !== -1) {
  //     setAddressTable((prevState) => {
  //       let tempTable = [...prevState];

  //       // Check if premiseFlag is being set to false
  //       if (!result && tempTable[indexPremise].premiseFlag) {
  //         // Deselect id 166
  //         tempTable[indexPremise] = {
  //           ...tempTable[indexPremise],
  //           premiseFlag: false,
  //           businessPurpose: tempTable[indexPremise]?.businessPurpose.filter(
  //             (id) => id !== 166
  //           ),
  //         };
  //         setAddressObj((prevObj) => ({
  //           ...prevObj,
  //           [`businessPurpose${indexPremise + 1}`]: prevObj[
  //             `businessPurpose${indexPremise + 1}`
  //           ].filter((id) => id !== 166),
  //           [`premiseAddress${indexPremise + 1}`]: false,
  //         }));
  //       } else {
  //         const obj = result ? true : false;

  //         tempTable[indexPremise] = {
  //           ...tempTable[indexPremise],
  //           businessPurpose: [
  //             ...(tempTable[indexPremise].businessPurpose || []),
  //             166,
  //           ],
  //           premiseFlag: obj,
  //         };
  //         setAddressObj((prevObj) => ({
  //           ...prevObj,
  //           [`businessPurpose${indexPremise + 1}`]: [
  //             ...(prevObj[`businessPurpose${indexPremise + 1}`] || []),
  //             166,
  //           ],
  //           [`premiseAddress${indexPremise + 1}`]: true,
  //         }));
  //       }
  //       return tempTable;
  //     });
  //   }
  //   return result;
  // };

  //handle reset
  const handleContactChangesByAddress = (keyModal, table, type) => {
    Object.keys(contactObj)
    .filter(key => key.startsWith('contactAddress'))
    .forEach((key, i) => {
      if(contactObj[`contactAddress${i + 1}`] !== null){
        
      let temp = (table || []).find((itemB, indexB) => (itemB.addressId ? itemB.addressId === contactObj[`contactAddress${i + 1}`] : itemB.tempId === contactObj[`contactAddress${i + 1}`]));
      // console.log("masuk",`contactAddress${i + 1}`);
      // console.log(temp,"masuk temp")
      if(type === "delete"){
        if (!temp || contactObj[`contactAddress${i + 1}`] === `TEMP${keyModal || 0}`) {
          // console.log("masuk if pertama",`contactAddress${i + 1}`);
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
          // console.log("masuk if kedua",`contactAddress${i + 1}`);
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
        // console.log("masuk else ",`contactAddress${i + 1}`);
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

  // useEffect(() => {

  // },[contactObj])
  // console.log(contactTable,"contactTable");
  // console.log(contactObj,"contactObj");
  // console.log(addressTable,"addressTable");
  // console.log(addressObj,"addressObj");

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

  // Validation Customer Identification Number
  const validationCI = () => {
    if (ciObj.identificationType === 61) {
      if (ciObj.customerIdentificationNumber?.length === 16) {
        return ciObj.customerIdentificationNumber;
      }
    }
    if (ciObj.identificationType === 60) {
      if (ciObj.customerIdentificationNumber?.length === 16) {
        return ciObj.customerIdentificationNumber;
      }
    }
    if (ciObj.identificationType === 893) {
      return ciObj.customerIdentificationNumber;
    } else {
      return false;
    }
  };

  const validationReadyAI = () => {
    if (data?.registered === true) {
      return caiObj.accountName;
    } else {
      if (ciObj.customerType === 58) {
        return caiObj.customerName;
      }
      if (ciObj.customerType === 59) {
        return caiObj.firstName;
      } else {
        return false;
      }
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
  const validateAddress = (index) => {
    if ( index === 1 && addressTable.length >= 1) {
      return validateBusinessPurpose(0);
    }
    if (index === 2 && addressTable.length >= 2) {
      return validateBusinessPurpose(1);
    }
    if (index === 3 && addressTable.length >= 3) {
      return validateBusinessPurpose(2);
    }
    if (index === 4 && addressTable.length >= 4) {
      return validateBusinessPurpose(3);
    } else {
      return false;
    }
  };

  // Validation Contact Address Information
  const validateContactAddress = (index) => {
    if (contactTable[index] && contactObj[`contactAddress${index + 1}`] !== 0) {
      return contactObj[`contactAddress${index + 1}`];
    } else {
      return false;
    }
  };

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

  // console.log(caiObj,"caiObj")
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
//   console.log(contactTable, ' contact');
// console.log(addressTable, ' lalal');

  // Step
  const steps = [
    {
      title: "CUSTOMER IDENTIFICATION",
      content: (
        <CustomerIdentificationForm
          dispatch={dispatch}
          handleCIObj={handleCIObj}
          CIObj={ciObj}
          form={form}
        />
      ),
      disabled: false
        // !ciObj.customerType || !ciObj.identificationType || !validationCI(),
    },
    {
      title: "ACCOUNT INFORMATION",
      content: (
        <SectionFormCAI
          dataCustomer={data}
          dataCheck={data?.registered}
          dispatch={dispatch}
          handleCAIObj={handleCAIObj}
          CAIObj={caiObj}
          CIObj={ciObj}
          data={listDataAttachment}
          updateData={setListDataAttachment}
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
        // !caiObj.classificationType ||
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
          form={form}
          customerId={
            data?.customerInformation?.customerId === undefined
              ? null
              : data?.customerInformation?.customerId
          }
          handleContactChangesByAddress={handleContactChangesByAddress}
          setAddressObj={setAddressObj}
          setTiObj={setTiObj}
          tiObj={tiObj}
          // validateAddress={validateAddress}
        />
      ),
      disabled: false,
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
          customerId={
            data?.customerInformation?.customerId === undefined
              ? null
              : data?.customerInformation?.customerId
          }
          form={form}
        />
      ),
      // disabled: contactTable.length === 0 || !validateContact(),
      disabled: false,
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
      disabled: false,
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
          current={fiCurrent}
          setCurrent={setFiCurrent}
          errorFieldName={fiErrorFieldName}
          setErrorFieldName={setFiErrorFieldName}
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
    setTabPagesSectionCAI([
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
    setValuePageSectionCAI(tabPagesSectionCAI[0].value)
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
    form.validateFields()
    .then((values) => {
      handleMandatory(setTabPagesSectionCAI, listDataAttachment);

      if (!listDataAttachment.length) {
        setValuePageSectionCAI("Attachment");
        setCaiErrorType("attachment");
        return;
      }

      const body = {
        registrationNumber: caiObj?.accountRegistrationNumber || "",
      };
      dispatch(
        checkRegistrationNumber(body))
        .unwrap()
        .then((res) => {
          if(listDataAttachment.length > 0 && data?.registered === false){
            if (tiObj.taxIdentifierType === 922 || tiObj.taxIdentifierType === 921) {
              setTiObj((prevState) => ({
                ...prevState,
                taxIdentifierName: data?.registered ? data?.customerInformation?.customerName : caiObj?.customerName ||
                  `${caiObj?.firstName} ${caiObj?.middleName || ""} ${
                    caiObj?.lastName || ""
                  }`,
              }));
            }
            next();
            scrollRightHandler();
          }else if(data?.registered === true){
            if (tiObj.taxIdentifierType === 922 || tiObj.taxIdentifierType === 921) {
              setTiObj((prevState) => ({
                ...prevState,
                taxIdentifierName: data?.registered ? data?.customerInformation?.customerName : caiObj?.customerName ||
                  `${caiObj?.firstName} ${caiObj?.middleName || ""} ${
                    caiObj?.lastName || ""
                  }`,
              }));
            }
            next();
            scrollRightHandler();
          }
        })
    })
    .catch((error) => {
      console.error("Validation failed:", error);
      handleMandatory(setTabPagesSectionCAI, listDataAttachment, error.errorFields);

      // Handle scroll to the first field that failed
      if (error.errorFields && error.errorFields.length > 0) {
        const firstErrorFieldName = error.errorFields[0].name;

        if (valuePageSectionCAI === "Customer/Account Information")
          form.scrollToField(firstErrorFieldName, {
            behavior: 'smooth',
            block: 'center',
          });
        else if (valuePageSectionCAI === "Attachment") {
          setValuePageSectionCAI("Customer/Account Information")
          setCaiErrorType("info");
          setCaiErrorField(firstErrorFieldName);
        }
      }
    });
  }

  const FunctionCheckValidateAddress = () => {
    form
      .validateFields([
        "address1",
        "businessPurpose1",
        "address2",
        "businessPurpose2",
        "businessPurpose3",
        "address3",
        "businessPurpose4",
        "address4",
      ])
      .then((values) => {
        next();
        scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);

        // Handle scroll to the first field that failed
        if (error.errorFields && error.errorFields.length > 0) {
          const firstErrorFieldName = error.errorFields[0].name;
          
          form.scrollToField(firstErrorFieldName, {
            behavior: 'smooth',
            block: 'center',
          });
        }
      });
  }

  const FunctionCheckValidateContact = () => {
    form
      .validateFields([
        "contact1",
        "contactAddress1",
        "contact2",
        "contactAddress2",
        "contact3",
        "contactAddress3",
        "contact4",
        "contactAddress4",
      ])
      .then((values) => {
        next();
        scrollRightHandler();
      })
      .catch((error) => {
        console.error("Validation failed:", error);

        // Handle scroll to the first field that failed
        if (error.errorFields && error.errorFields.length > 0) {
          const firstErrorFieldName = error.errorFields[0].name;
          
          form.scrollToField(firstErrorFieldName, {
            behavior: 'smooth',
            block: 'center',
          });
        }
      });
  }

  // Handle Next
  const handleButtonNext = () => {
    switch (steps[current].title) {
      case "CUSTOMER IDENTIFICATION":
        FunctionCheckCustomer();
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

  // Mapping Step
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Handle Clear
  const handleClear = () => {
    if (steps[current].title === "CUSTOMER IDENTIFICATION") {
      form.resetFields([
        "customerType",
        "identificationType",
        "customerIdentificationNumber",
      ]);
      setCIObj({});
    }
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
      setWtObj();
    }
  };

  // Handle Confirmation
  const handleSave = (formValue) => {
    form.validateFields([        
      "taxIdentifierType",
      "taxIdentifierNumber",
      "taxIdentifierName",
      "taxAddress"
    ])
    .then((validatedValues) => {
      // Handle validation success if needed
      if(
        validatedValues.taxIdentifierType !== undefined && 
        validatedValues.taxIdentifierNumber !== undefined &&
        validatedValues.taxIdentifierName !== undefined &&
        validatedValues.taxAddress !== undefined
      ){
        const mappingBillingBucket = data_financialInfo?.billingBucket?.map(
          (a) => a.billingBucketCode
        );
    
        const mappingTaxImplication = data_financialInfo?.taxImpli?.map(
          (a) => a.id
        );
    
        const bodyCustomerInformation = {
          customerIdentificationNumber: ciObj?.customerIdentificationNumber,
          customerType: ciObj?.customerType,
          identificationType: ciObj?.identificationType,
          customerId: null,
          firstName: (caiObj?.firstName || "").toUpperCase() || null,
          middleName: (caiObj?.middleName || "").toUpperCase() || null,
          lastName: (caiObj?.lastName || "").toUpperCase() || null,
          customerName: caiObj?.customerName
            ? (caiObj?.customerName || "").toUpperCase()
            : `${(caiObj?.firstName || "").toUpperCase()} ${(
                caiObj?.middleName || ""
              ).toUpperCase()} ${(caiObj?.lastName || "").toUpperCase()}` || null,
          foundedBirthDate: caiObj?.birthDate ?
            moment(caiObj?.birthDate).format(dateFormatting.date) || null : null,
          foundedBirthPlace: caiObj?.birthPlace || null,
          sex: caiObj?.sex || null,
          maritalStatus: caiObj?.maritalStatus || null,
          searchKey: caiObj?.search_Key || null,
          description: caiObj?.description || null,
        };
    
        const bodyAccountInformation = {
          customerId: null,
          accountId: null,
          accountGroup: data?.accountGroup?.id || null,
          customerManagement: data?.customerManagement?.id || null,
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
          exceptionFlag: caiObj.rb === undefined ? false : caiObj.rb,
          industrialSector: caiObj?.industrialSector || null,
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
            //   relatedAccountId: tiObj?.accountId || null,
            //   startDate: formValue.startDateTI ? moment(formValue.startDateTI).format(dateFormatting.date) || null : null,
            //   description: formValue.descriptionTI || null,
            // },
            taxRelation: bodyRelationTax,
            wapu: {
              startDate:formValue.startDateWT ?
                moment(formValue.startDateWT).format(dateFormatting.date) || null : null,
              wapuFlag: wtObj.wapuFlag === undefined ? false : wtObj.wapuFlag,
              description: formValue.descriptionWT || null,
            },
            billingBucket: mappingBillingBucket || [],
            taxImplication: mappingTaxImplication || [],
          },
          registered: data?.registered,
          customerId:
            data?.customerInformation !== null
              ? data?.customerInformation?.customerId
              : null,
          tempForm : formValue,
        };

        setDataConfirm(bodyData);
        setModalConfirm(true);
      }
    })
    .catch((error) => {
      // Handle validation errors if needed
      console.log(error);
    });
  };

  const handleSaveFailed = (error) => {
    if (error.errorFields && error.errorFields.length > 0) {
      
      const firstErrorFieldName = error.errorFields[0].name[0];

      switch (firstErrorFieldName) {
        case "paymentChannelType":
        case "generateVA":
          setFiCurrent(0);
          break;
        
        case "taxIdentifierType":
        case "taxIdentifierNumber":
        case "taxIdentifierName":
        case "taxAddress":
        case "relatedAccountId":
        case "customerNameTI":
        case "accountNameTI":
        case "ratit":
        case "ratin":
        case "ratin2":
        case "ratia":
        case "startDateTI":
        case "descriptionTI":
          setFiCurrent(1);
          break;

        case "wapuFlag":
        case "startDateWT":
        case "descriptionWT":
          setFiCurrent(2);
          break;
        
        case "receivableAccount":
        case "revenueAccount":
          setFiCurrent(3)
      }
      setFiErrorFieldName(firstErrorFieldName);
    }
  }

  const FunctionCheckCustomer = () => {
    form.validateFields()
      .then((values) => {
        const body = {
          customerType: ciObj.customerType,
          identificationType: ciObj.identificationType,
          identificationNumber: ciObj.customerIdentificationNumber.toString(),
          accountGroup: "STANDARD",
        };
    
        dispatch(checkCustomer({ body: body }))
          .unwrap()
          .then((data) => {
            data?.registered !== true
              ? next() && scrollRightHandler()
              : setModalCheckCustomer(true);
          })
          .catch(() => {
            handleButtonNext();
          });  
      })
      .catch((error) => {
        console.error("Validation failed:", error);

        // Handle scroll to the first field that failed
        if (error.errorFields && error.errorFields.length > 0) {
          const firstErrorFieldName = error.errorFields[0].name;
          
          form.scrollToField(firstErrorFieldName, {
            behavior: 'smooth',
            block: 'center',
          });
        }
      });
  };

  const FunctionGetFinancialInfo = () => {
    // if (tiObj.taxIdentifierType === 922 || tiObj.taxIdentifierType === 921) {
    //   setTiObj((prevState) => ({
    //     ...prevState,
    //     taxIdentifierName: data?.registered ? data?.customerInformation?.customerName : caiObj?.customerName ||
    //       `${caiObj?.firstName} ${caiObj?.middleName || ""} ${
    //         caiObj?.lastName || ""
    //       }`,
    //   }));
    // }
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

    dispatch(createAccount({ body: dataConfirm }))
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
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
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
        data?.registered === true ? (
          <BaseContainer header={"Customer Information"}>
            <div className="w-full grid grid-cols-4 gap-5">
              <DetailText label={"Customer Number"}>
                {data?.customerInformation?.customerNumber}
              </DetailText>
              <DetailText label={"Identification Type"}>
                {data?.customerInformation?.identificationType}
              </DetailText>
              <DetailText label={"Customer Identification Number"}>
                {data?.customerInformation?.personalIdentificationNumber}
              </DetailText>
              <DetailText label={"Customer Name"}>
                {data?.customerInformation?.customerName}
              </DetailText>
              <DetailText label={"Customer Type"}>
                {data?.customerInformation?.customerType}
              </DetailText>
              <DetailText label={"Description"}>
                {data?.customerInformation?.description}
              </DetailText>
              <DetailText label={"Status"}>
                {data?.customerInformation?.status}
              </DetailText>
              <DetailText label={"Birth/Founded Place"}>
                {data?.customerInformation?.placeOfBirth}
              </DetailText>
              <DetailText label={"Birth/Founded Date"}>
                {moment(data?.customerInformation?.dateOfBirth).format(
                  dateFormatting.date
                )
                  ? moment(data?.customerInformation?.dateOfBirth).format(
                      dateFormatting.date
                    )
                  : "-"}
              </DetailText>
              <DetailText label={"Sex"}>
                {data?.customerInformation?.sex}
              </DetailText>
              <DetailText label={"Search Key"}>
                {data?.customerInformation?.searchKey}
              </DetailText>
            </div>
          </BaseContainer>
        ) : null}

        <Form layout="vertical" form={form} onFinish={handleSave} onFinishFailed={handleSaveFailed} >
          <BaseContainer header={"Account - Standard Information"}>
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
              value={value}
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
              <Form.Item>
                <ButtonComponent
                  icon={<SVGIcon name={"IconButtonClear"} width={24} />}
                  type="submit"
                  onClick={() => handleClear()}
                >
                  Clear
                </ButtonComponent>
              </Form.Item>
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

              {current < steps.length - 1 && (
                <Form.Item>
                  <ButtonComponent
                    onClick={() => {
                      handleButtonNext();
                    }}
                    type={"submit"}
                    className="ant-btn ant-btn-submit flex w-full justify-center"
                    disabled={steps[current].disabled}
                  >
                    <div className="flex gap-x-2 items-center">
                      <span>Next</span>
                      <RightOutlined
                        style={{
                          justifyItems: "center",
                          fontSize: "18px",
                          color: "#fff",
                        }}
                      />
                    </div>
                  </ButtonComponent>
                </Form.Item>
              )}
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

        {/* Check Customer */}
        <ModalCheckCustomer
          data={data?.customerInformation}
          dataTable={data?.accountList}
          isOpen={modalCheckCustomer}
          handleCancel={() => setModalCheckCustomer(false)}
          handleConfirm={() => {
            setModalCheckCustomer(false);
            next();
            scrollRightHandler();
          }}
        />

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
          value={value}
          listAttachment={listDataAttachment}
          isOpen={modalConfirm}
          handleConfirm={() => handleCreateAccount()}
          handleCancel={() => {
            setDataConfirm({});
            setModalConfirm(false);
          }}
        />

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
              {
                "Please Input at least one or more distribution media!"
              }
            </p>
          </div>
        </ModalError>

        {/* Modal Warning Lost Data */}
        {
          modalPrevLostData ? (
            // <ModalConfirm
            //   isOpen={modalPrevLostData}
            //   handleCancel={() => setModalPrevLostData(false)}
            //   handleOk={handleOkLostData}
            //   width={400}
            // >
            //   <div className="flex justify-center mt-5 gap-[20px]">
            //     <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            //     <p className="text-[18px] font-bold">
            //     Are you sure you want to go to previous step? your data will be lost!
            //     </p>
            //   </div>
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
          )
          : null 
        }

         {/* Modal premise already use */}
         {modalAlreadyPremise ? 
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
              <p className="pl-[70px]">
                {isPremiseAlready?.message}
              </p>
            </div>
          </ModalError>
          : null 
        }

      </Spin>
    </>
  );
};

export default StandardForm;
