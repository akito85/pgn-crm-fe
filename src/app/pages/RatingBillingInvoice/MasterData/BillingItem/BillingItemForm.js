import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Spin } from "antd";
import { WarningOutlined, LeftOutlined } from "@ant-design/icons";
import RadioTabs from "../../../../../components/RadioTabs";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import {
  ModalConfirm,
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import SVGIcon from "../../../../../assets/Icon/index";
import { configApp } from "../../../../../constants/configApp";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import BillingItemSectionForm from "./Form/BillingItemSectionForm";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import {
  getBillingItemCategory,
  getAvailableApproval,
  getSelectedApproval,
  getAttachmentCategory,
  getDetailMappingCategory,
  getBillType,
  createBillingItem,
  updateBillingItem,
  getBillingItemDetail,
  getBillingItemCategoryDdl,
  getConfigFileRBIBillingItem,
  getDetailDraft,
} from "../../../../../redux/slices/rating_billing_invoice/billingItem";
import MappingInformation from "./Form/tab/MappingInformation";
import DetailMappingInformation from "./Form/tab/DetailMappingInformation";
import { handleMandatory } from "./Utils/Utils";
import {
  showModalError,
  showModalSuccess,
  validateCreateUpdate,
} from "../../../../../redux/slices/general_slice";
import { dateFormatting, hasValue } from "../../../../../utils";
import moment from "moment";
import BillingItemConfirmation from "./Form/BillingItemConfirmation";
import AttachmentSectionComponent from "./Form/tab/AttachmentSectionComponent";

const BillingItemForm = (props) => {
  //Selector
  const {
    data_billingItemCategory,
    data_billType, //list map
    dataListAppHierId,
    dataListAppHierDetail,
    detail_mapping_category,
    data_BillingItemDetail,
    data_billingItemCategoryDdl,
    data_detailDraft,
    loading, //list detail map ( dependent on category )
  } = useSelector((state) => state.billing_item);

  // Declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id; //id

  // State
  const [listSectionInfo, setListSectionInfo] = useState([
    {
      value: "Billing Item",
      paramValue: [
        //mandatory fields
        "billingItemCategory",
        "name",
        "billType",
        "startDate",
        "endDate",
        "description",
      ],
    },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  //radio tab
  const [valuePage, setValuePage] = useState(listSectionInfo[0].value);

  const { type } = props;
  const [form] = Form.useForm();

  const [openModal, setOpenModal] = useState(false); //modal confirm
  const [modalBack, setModalBack] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [modalValidationTable, setModalValidationTable] = useState(false)

  const [detailMapping, setDetailMapping] = useState(false); //map detail shown
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateMap, setStartDateMap] = useState();
  const [endDateMap, setEndDateMap] = useState();
  const [modalRequired, setModalRequired] = useState(false);

  //approval
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();

  //Billing item
  const [checkedLateCharge, setCheckedLateCharge] = useState(false);
  const [checkedPaymentWarranty, setCheckedPaymentWarranty] = useState(false);

  //data Map info
  const [dataTable, setdataTable] = useState([]);
  const [dataDetailTable, setdataDetailTable] = useState([]);
  const [allDataDetailTable, setAllDataDetailTable] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  const [listDataAttachment, setListDataAttachment] = useState([]);

  const [category, setCategory] = useState("");
  const [typeSubmit, setTypeSubmit] = useState(false);

  const [loadingForm, setLoadingForm] = useState(false); //loading
  const [dataSend, setDataSend] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getBillingItemCategory());
    dispatch(getBillingItemCategoryDdl());
    dispatch(getBillType());
    dispatch(getAvailableApproval());
    dispatch(getSelectedApproval());
  }, [dispatch]);

  useEffect(() => {
    if (type === "update" && id) {
      dispatch(getBillingItemDetail({ id }));
      dispatch(getDetailDraft({id}))
    }
  }, [dispatch, type, id]);

  const handleDataTypeExist = ( //for billing item
    status,
    statusApproval,
    dataDetail,
    dataCompare,
    table = "mapping",
  ) => {
    switch (status) {
      case "ACTIVE":
        if (statusApproval === "DRAFT" && table === "mapping") {
          return dataCompare?.some(
            (item) => item?.categoryId === dataDetail?.categoryId
          ) ? { dataType: "exist" } : null;
        } else if (statusApproval === "DRAFT"){
          return dataCompare?.some((item) =>
            item?.detailMappingInfo?.some(
              (detail) => detail?.item === dataDetail?.item
            )
          ) ? { dataType: "exist" } : null;
        } else {
          return { dataType: "exist" }; // for active & approve
        }
      case "DRAFT":
        return null;
      default:
        return null;
    }
  };

  const handleSetDataUpdate = useCallback(
    (dataDetail, dataCompare = null) => {
      setStartDate(moment(dataDetail?.startDate));
      setSelectedHierarchy(dataDetail?.approvalHierarchy);
      form.setFieldsValue({
        ...dataDetail,
        billingItemCategory: dataDetail?.billingItemCategoryId,
        name: dataDetail?.billingItemName,
        billType: dataDetail?.billingTypeId,
        apphierId: dataDetail?.approvalHierarchy,
        startDate: dataDetail?.startDate ? moment(dataDetail?.startDate) : null,
        endDate: dataDetail?.endDate ? moment(dataDetail?.endDate) : null,
      });
      setCheckedLateCharge(dataDetail?.lateCharge);
      setCheckedPaymentWarranty(dataDetail?.paymentWarranty);
      setListDataAttachment(
        dataDetail?.attachmentDtoList
          ? (dataDetail?.attachmentDtoList || [])?.map((item) => {
              return {
                ...item,
                createdDate: moment(item.createdDate).format(
                  dateFormatting.date
                ),
                // fileSize: bytesConverter(item.fileSize || 0),
                // urlFile1: `${urlLink(item?.id)}`,
                dataType: "exist",
              };
            })
          : []
      );
      setdataTable(
        dataDetail?.mappingInformation?.map((item, index) => {
          return {
            key: `${index + 1}`,
            rCategoryId: item.rCategoryId,
            category: item.categoryId,
            categoryName: item.category,
            startDate: item?.startDate
              ? moment(item?.startDate).format(dateFormatting.date)
              : null,
            endDate: item?.endDate
              ? moment(item?.endDate).format(dateFormatting.date)
              : null,
            description: item?.description,
            ...(handleDataTypeExist(dataDetail?.status, dataDetail?.statusApproval, item, dataCompare)),
          };
        }) || []
      );
      (dataDetail?.mappingInformation || [])?.map((item) => {
        setAllDataDetailTable((prev) => {
          return {
            ...prev,
            [item.categoryId]:
              item.detailMappingInfo?.map((detail, indexDetail) => {
                return {
                  key: `${indexDetail + 1}`,
                  rMappingId: detail?.rMappingId,
                  item: detail?.item,
                  itemName: detail?.itemName,
                  startDate: detail?.startDate
                    ? moment(detail?.startDate).format(dateFormatting.date)
                    : null,
                  endDate: detail?.endDate
                    ? moment(detail?.endDate).format(dateFormatting.date)
                    : null,
                  description: detail?.description,
                  ...(handleDataTypeExist(dataDetail?.status, dataDetail?.statusApproval, detail, dataCompare, "detailMap")),
                };
              }) || [],
          };
        });
      });
    },
    [form]
  );

  useEffect(() => {
    if (
      type === "update" &&
      id &&
      data_BillingItemDetail &&
      data_BillingItemDetail.billingItemCode === id
    ) {
      if (
        data_BillingItemDetail?.status === "ACTIVE" &&
        data_BillingItemDetail?.statusApproval === "DRAFT" &&
        data_BillingItemDetail.billingItemCode === id
      ){
        
        const body = {
          ...data_detailDraft,
          startDate : data_detailDraft.startDate,
          endDate: data_detailDraft?.endDate,
          approvalHierarchy: data_detailDraft?.approvalHierarchy,
          billingItemCategory: data_detailDraft?.billingItemCategoryId,
          name: data_detailDraft?.billingItemName,
          billType: data_detailDraft?.billingTypeId,
          apphierId: data_detailDraft?.approvalHierarchy,
          attachmentDtoList: data_BillingItemDetail?.attachmentDtoList,
          lateCharge: data_detailDraft?.lateCharge,
          paymentWarranty: data_detailDraft?.paymentWarranty,
          status: data_BillingItemDetail?.status,
          statusApproval: data_BillingItemDetail?.statusApproval,
        }

        handleSetDataUpdate(body, data_BillingItemDetail?.mappingInformation);
      } else {
        handleSetDataUpdate(data_BillingItemDetail);
      }
    }
  }, [data_BillingItemDetail, type, id, handleSetDataUpdate]);

  //approval
  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getSelectedApproval({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  //approval detail ( table )
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

  //approval list ddl
  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleStartDate = (e) => {
    form.resetFields(["endDate"]);
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  const handleEndDate = (e) => {
    if (e === null || e === undefined) {
      setEndDate(e);
    } else {
      setEndDate(moment(e));
    }
  }

  const handleChangesPayment = (e) => {
    setCheckedPaymentWarranty(e.target.checked);
  };

  const handleChangesLateCharge = (e) => {
    setCheckedLateCharge(e.target.checked);
  };

  const handleCheckDetailDateConflict = (data) =>{
    const index = data_billingItemCategory
    ?.filter((category) => category?.name === data.categoryName)
    .find((data) => data?.id)?.id
    let result = false;
    if(allDataDetailTable[index]?.length || 0 > 0){
      result = allDataDetailTable[index].some((dataDetail) => {
        if(moment(data.startDate) > moment(dataDetail.startDate)){
          const body = {
            title: "Failed",
            description: `Detail Mapping has conflicted Date. Please try again.`,
            return: false,
          }
          dispatch(showModalError(body));
          return true;
          }
        })
        return result;
      }
      return false
    }

  const handleChangesMapInformation = (e, newData = {}) => {
    if(!handleCheckDetailDateConflict(newData)){
      const temp = e.map((item) => {
        return {
          ...item,
          ...(hasValue(item.categoryName) //looking for name for filtering table to get ID
            ? {
                category: data_billingItemCategory
                  ?.filter((category) => category?.name === item.categoryName)
                  .find((item) => item?.id)?.id  || item?.category,
                // startDate: moment(item.startDate).format(dateFormatting.date),
                // endDate: item?.endDate
                //   ? moment(item.endDate).format(dateFormatting.date)
                //   : null,
              }
            : {}),
        };
      });
  
      setdataTable(
        // e.map((item) => {
        //   return {
        //     ...item,
        //     ...(hasValue(item.categoryName) //looking for name for filtering table to get ID
        //       ? {
        //           category: data_billingItemCategory
        //             ?.filter((category) => category?.name === item.categoryName)
        //             .find((item) => item?.id)?.id,
        //           startDate: moment(item.startDate).format(dateFormatting.date),
        //           endDate: item?.endDate
        //             ? moment(item.endDate).format(dateFormatting.date)
        //             : null,
        //         }
        //       : {}),
        //   };
        // })
        temp
      );
  
      setStartDateMap(
        moment(
          temp?.find((item) => item.category === category)?.startDate
        )
      );
      setEndDateMap(
        moment(
          temp?.find((item) => item.category === category)?.endDate
        )
      )
    }
  };

  const handleChangesMapDetailInformation = (e) => {
    const temp = e.map((item) => {
      return {
        ...item,
        ...(hasValue(item.itemName) //looking for name for filtering table to get ID
          ? {
              item: detail_mapping_category
                ?.filter((category) => category?.name === item.itemName)
                .find((item) => item?.id)?.id || item?.item,
              // startDate: moment(item.startDate).format(dateFormatting.date),
              // endDate: item?.endDate
              //   ? moment(item.endDate).format(dateFormatting.date)
              //   : null,
            }
          : {}),
      };
    });
    handleChangesCreateButtonDetail(category, "", temp);
    setdataDetailTable(temp);
  };

  //checking if there are missing in detail map
  const handleCheckMissingDetailMap = (data, dataDetail) => {
    return (
      dataDetail.some(
        (detail) => !data.hasOwnProperty(detail.category.toString())
      ) || Object.keys(data).some((key) => data[key].length === 0)
    );
  };

  //getting all name of missing detail map
  const handleAllMissingDetailMap = (data, dataDetail) => {
    const missingCategories = [];
    Object.keys(dataDetail).forEach((key) => {
      if (
        !data.hasOwnProperty(dataDetail[key].category) ||
        data[dataDetail[key].category].length === 0
      ) {
        missingCategories.push(dataDetail[key].category);
      }
    });

    const missingMap = missingCategories.map((item) => {
      return {
        item: parseInt(item),
        name: (data_billingItemCategory || []).find(
          (data) => data.id === parseInt(item)
        )?.name,
      };
    });

    return `Missing Detail Map for ${missingMap
      .map((item) => item.name)
      .join(", ")}`;
  };

  //handle data for submit to API
  const handleMappingInfo = (data) => {
    return dataTable.map((item) => {
      // console.log(item, "item");
      return {
        ...item,
        detail:
          data[item?.category].map((detail) => {
            return {
              ...detail,
              // item: detail.item,
              // startDate: detail?.startDate,
              // ? moment(detail.startDate).format(dateFormatting.date)
              // : null
              // endDate: detail?.endDate,
              // ? moment(detail.endDate).format(dateFormatting.date)
              // : null
            };
          }) || [],
      };
    });
  };

  const onFinishFailed = ({ values, errorFields, outOfDate }) => {
    handleMandatory(setListSectionInfo, listDataAttachment, errorFields);
  };

  //for changes dynamic table
  const handleChangesCreateButtonDetail = (
    oldCategory,
    newCategory,
    dataDetailTable
  ) => {
    // setLoadingDetail(true);
    setAllDataDetailTable((prev) => ({
      ...prev,
      ...(oldCategory !== "" ? { [oldCategory]: dataDetailTable } : {}),
    }));
    setdataDetailTable((prevState) => {
      return newCategory !== ""
        ? allDataDetailTable[newCategory] || []
        : prevState;
    });
    // setLoadingDetail(false);
  };

  const handleValidateUpdate = (dataTable, bodyData, status, isValidate) => {
    if (status === "create" || isValidate) {
      return true;
    } else {
      const dataConflict = [];
      const temp =
        allDataDetailTable[
          data_billingItemCategory?.find(
            (item) => bodyData?.categoryName === item?.name
          )?.id
        ] || [];

      temp?.forEach((item) => {
        if(moment(item?.startDate) < moment(bodyData?.startDate) || moment(item?.endDate) > moment(bodyData?.endDate)){
          dataConflict.push(item);
        }
      })
      if(dataConflict?.length > 0){
        setModalValidationTable(true)
      }
      return dataConflict?.length > 0 ? false : true 
    }

  };

  const handleCreate = (e) => {
    //changing data Detail Table with handle create button
    handleChangesCreateButtonDetail(category, e.category, dataDetailTable);
    if (e.category === category) {
      setDetailMapping(false);
      setCategory("");
    } else {
      dispatch(getDetailMappingCategory(e.category));
      setStartDateMap(
        moment(
          dataTable?.find((item) => item.category === e.category)?.startDate
        )
      );
      setEndDateMap(
        moment(
          dataTable?.find((item) => item.category === e.category)?.endDate
        )
      )
      setCategory(e.category);
      setDetailMapping(true);
    }
  };

  //checking if category is active but deleted from  table mapping
  const filteringAllDataDetailTable = useCallback(() => {
    Object.keys(allDataDetailTable).forEach((key) => {
      if (!dataTable.map((data) => data.category).includes(parseInt(key))) {
        delete allDataDetailTable[key];
      }
    });
  }, [allDataDetailTable, dataTable]);

  //changes for dataTable
  useEffect(() => {
    filteringAllDataDetailTable();
    if (category !== "") {
      setDetailMapping(
        (dataTable || [])?.find((item) => item.category === category)
      );
    }
  }, [dataTable, category, filteringAllDataDetailTable]);

   // Validate Data before Modal
   const checkDataValidity = async (data) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/billingitem/validate-create"
        : "/v1/dbs/api/billingitem/validate-update";

    try {
      await dispatch(
        validateCreateUpdate({
          body: data,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const onFinish = async (e) => {
    if (listDataAttachment.length === 0) {
      handleMandatory(setListSectionInfo, listDataAttachment); // attachment mandatory onFinish
    } else {
      handleMandatory(setListSectionInfo, listDataAttachment);
      if (dataTable.length === 0) {
        const errorBody = {
          title: "Failed",
          description: `Mapping Information is Mandatory. Please insert data.`,
        };
        dispatch(showModalError(errorBody));
      } else if (handleCheckMissingDetailMap(allDataDetailTable, dataTable)) {
        const errorBody = {
          title: "Failed",
          description: `${handleAllMissingDetailMap(
            allDataDetailTable,
            dataTable
          )}. Please insert data.`,
        };
        dispatch(showModalError(errorBody));
      } else {
        const body = {
          ...e,
          billingItemCode: id ? id : undefined,
          appHierId: e.apphierId,
          startDate: moment(e.startDate).format(dateFormatting.date),
          endDate: e.endDate
            ? moment(e.endDate).format(dateFormatting.date)
            : null,
          lateCharge: checkedLateCharge ? checkedLateCharge : false,
          paymentWarranty: checkedPaymentWarranty
            ? checkedPaymentWarranty
            : false,
          mappingInfo: handleMappingInfo(allDataDetailTable),
          action: typeSubmit ? "SUBMIT" : "DRAFT",
        };

        delete body.apphierId;
        // console.log(body);

        const isDataValid = await checkDataValidity(body);

        if (isDataValid) {
          setDataSend(body);
          setOpenModal(true);
          
        } else {
          setOpenModal(false)
        }

      }
    }
  };

  const handleDescriptionSuccess = useCallback(
    (data, type) => {
      let text = "";
      switch (type) {
        case "create":
          text = `Your data has been ${
            data.action === "DRAFT" ? "created" : "submitted"
          }.`;
          break;
        case "update":
          text = `Your data has been ${
            data.action === "DRAFT" ? "updated" : "submitted"
          }.`;
          break;
        default:
          break;
      }
      const successMessage = {
        title: "Successful",
        description: text,
      };
      dispatch(showModalSuccess(successMessage));
    },
    [dispatch]
  );

  const handleSave = (e) => {
    //dataSend
    dispatch(type === "create" ? createBillingItem(e) : updateBillingItem(e))
      .unwrap()
      .then(async (data) => {
        const id = type === "create" ? data?.id : data_BillingItemDetail?.id;
        setLoadingForm(true);
        const filterDataAttach = listDataAttachment.filter(
          (item) => item.dataType !== "exist"
        );
        for (let icon = 0; icon < filterDataAttach.length; icon++) {
          const element = filterDataAttach[icon];
          const body = {
            files: element.file,
            referensiId: id,
            fileCategoryId: element.fileCategoryId,
          };
          await ratingBillingHttpService.uploadAttachment(
            `/v1/dbs/api/billingitem/attachment-upload`,
            body
          );
        }
        setLoadingForm(false);
        handleClear("clear");
        handleDescriptionSuccess(e, type);
        // const successBody = {
        //   title: "Successful",
        //   description: `Your data has been ${
        //     e.action === "DRAFT" ? "created" : "submitted"
        //   }.`,
        // };
        // dispatch(showModalSuccess(successBody));
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
        }
      });
  };

  const handleRetry = () => {
    handleSave(bodyError?.value);
    setModalError(false);
  };

  const handleClear = (state = "") => {
    if (type === "create" || state === "clear") {
      form.resetFields();
      setAllDataDetailTable({});
      setdataTable([]);
      setdataDetailTable([]);
      setAppHierDataDetail([]);
      setAppHierOptions([]);
      setSelectedHierarchy();
      setListDataAttachment([]);
      setIsEditable(false);
      setCheckedLateCharge(false);
      setCheckedPaymentWarranty(false);
      setTypeSubmit(false);
      setStartDate(null)
      setStartDateMap(null)
      setEndDate(null)
      setEndDateMap(null)
    } else {
      setDetailMapping(false)
      setCategory("");
        if (
          data_BillingItemDetail?.status === "ACTIVE" &&
          data_BillingItemDetail?.statusApproval === "DRAFT" &&
          data_BillingItemDetail.billingItemCode === id
        ){
          const body = {
            ...data_detailDraft,
            startDate : data_detailDraft.startDate,
            endDate: data_detailDraft?.endDate,
            approvalHierarchy: data_detailDraft?.approvalHierarchy,
            billingItemCategory: data_detailDraft?.billingItemCategoryId,
            name: data_detailDraft?.billingItemName,
            billType: data_detailDraft?.billingTypeId,
            apphierId: data_detailDraft?.approvalHierarchy,
            attachmentDtoList: data_BillingItemDetail?.attachmentDtoList,
            lateCharge: data_detailDraft?.lateCharge,
            paymentWarranty: data_detailDraft?.paymentWarranty,
            status: data_BillingItemDetail?.status,
            statusApproval: data_BillingItemDetail?.statusApproval,
          }

          handleSetDataUpdate(body, data_BillingItemDetail?.mappingInformation);
        } else {
          handleSetDataUpdate(data_BillingItemDetail);
      }
    }
    setOpenModal(false);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RBI_ROUTES.BILLING_ITEM_VIEW,
      breadcrumbName: "Billing Item",
    },
    {
      path: "",
      breadcrumbName: `${
        type === "update" ? "Update Billing Item" : "Create Billing Item"
      }`,
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading || loadingForm}>
        <BreadCrumb routes={routes} />
        <div className={"w-full flex flex-col"}>
          <div className={"w-full flex justify-start"}>
            <RadioTabs
              data={listSectionInfo}
              onChange={onChange}
              currentPosition={valuePage}
            />
          </div>
        </div>

        <Form
          id={"form"}
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError={true}
        >
          <div
            style={{
              display:
                valuePage !== listSectionInfo[0].value ? "none" : undefined,
            }}
          >
            <BillingItemSectionForm
              type={type}
              dispatch={dispatch}
              statusDetail={data_BillingItemDetail?.status === "ACTIVE"}
              data_billType={data_billType}
              data_billingItemCategory={data_billingItemCategoryDdl}
              data_glAccount={[]}
              checkedLateCharge={checkedLateCharge}
              checkedPaymentWarranty={checkedPaymentWarranty}
              onChangeLateCharge={handleChangesLateCharge}
              onChangePayment={handleChangesPayment}
              startDate={startDate}
              endDate={endDate}
              handleStartDate={handleStartDate}
              mappingData={dataTable?.length || 0}
              handleEndDate={handleEndDate}
            />
            <MappingInformation
              key="mappingInformation"
              dataCategoryMapList={data_billingItemCategory}
              dataTable={dataTable}
              handleCreate={handleCreate}
              handleDataMapChanges={handleChangesMapInformation}
              isEditabled={isEditable}
              setIsEditabled={setIsEditable}
              type={type}
              startDate={startDate}
              endDate={endDate}
              setModalRequired={setModalRequired}
              handleValidateUpdate={handleValidateUpdate}
            />
            {detailMapping &&
            dataTable?.length > 0 &&
            (dataTable || []).find((item) => item.category === category) ? (
              <DetailMappingInformation
                key="mappingDetailInformation"
                dataMapDetailItemList={detail_mapping_category}
                subHeader={`${
                  (data_billingItemCategory || []).find(
                    (item) => item.id === category
                  )?.name
                }`}
                dataTable={dataDetailTable || []}
                handleDataMapChanges={handleChangesMapDetailInformation}
                setIsEditabled={setIsEditable}
                isEditabled={isEditable}
                type={type}
                startDateMappping={startDateMap}
                endDateMapping={endDateMap}
                handleValidateUpdate={handleValidateUpdate}
              />
            ) : null}
          </div>

          <div
            style={{
              display:
                valuePage !== listSectionInfo[1].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          <div
            style={{
              display:
                valuePage !== listSectionInfo[2].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"Attachment Information"}>
              <AttachmentSectionComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                dispatch={dispatch}
                getAPICategory={getAttachmentCategory}
                typeSelector="billing_item"
                service={ratingBillingHttpService}
                configApplication={configApp.RATING_BILLING_SERVICE}
                getAPIGuard={getConfigFileRBIBillingItem}
                typeRBI={"standalone"}
                mandatory={true}
              />
            </BaseContainer>
          </div>
        </Form>

        <div className="flex w-full justify-between align-middle my-3">
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
              onClick={!isEditable ? handleClear : undefined}
              disabled={isEditable}
            >
              {type === "update" ? "Reset" : "Clear"}
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              htmlType={"submit"}
              form={"form"}
              onClick={() => setTypeSubmit(false)}
              disabled={isEditable}
              // disabled={disableSubmit}
            >
              Save as Draft
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              htmlType={"submit"}
              form={"form"}
              onClick={() => setTypeSubmit(true)}
              disabled={isEditable}
              // disabled={disableSubmit}
            >
              Save & Submit
            </ButtonComponent>
          </div>
        </div>

        {openModal ? (
          <ModalCustom
            isOpen={openModal}
            handleCancel={() => setOpenModal(false)}
            header={"CONFIRMATION"}
            width={1200}
            type={"confirmation"}
            footer={
              <div className="w-full flex justify-end gap-5">
                <ButtonComponent
                  type={"default"}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type={"submit"}
                  onClick={() => {
                    handleSave(dataSend);
                  }}
                  disabled={loading || loadingForm}
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <BillingItemConfirmation
              dataTable={dataTable}
              allData={allDataDetailTable}
              dataAttachment={listDataAttachment}
              dataConfirm={dataSend}
              dataApproval={selectedHierarchy}
              dataApprovalTable={appHierDataDetail}
              listApproval={appHierOptions}
            />
          </ModalCustom>
        ) : null}

        {modalError ? (
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
              <p className="pl-[70px]">{`Your data was not ${
                type === "create" ? "Created." : "Updated."
              } ${bodyError?.message}`}</p>
              <p className="pl-[70px]">Please try again.</p>
            </div>
          </ModalError>
        ) : null}

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

        {/* Modal Start Date still empty or null */}
        <ModalError
          isOpen={modalRequired}
          handleOk={() => setModalRequired(false)}
          handleCancel={() => setModalRequired(false)}
          // customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`You can't create Mapping Information. Please fill out the start date first`}</p>
          </div>
        </ModalError>

        {modalValidationTable ? (
          <ModalError
            isOpen={modalValidationTable}
            handleOk={() => setModalValidationTable(false)}
            handleCancel={() => setModalValidationTable(false)}
            // customText={"Try Again"}
          >
            <div className="px-5 pt-5 pb-[10px] justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">{"Failed"}</p>
              </div>
              <p className="pl-[70px]">{`You can't update Mapping Information. Start date and enda date can't be overlap`}</p>
            </div>
          </ModalError>
        ) : null}
      </Spin>
    </LayoutMenu>
  );
};

export default BillingItemForm;
