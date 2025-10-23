import { Fragment, useCallback, useState } from "react";
import React, { useEffect } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import FunctionalTableInlineAccount from "./FunctionalTableInlineAccount";
import { Alert, Form, Spin } from "antd";
import { additionalInformationTable, itemActionViewAdditionalInfoTable } from "./AdditionalInformationDetail";
import { useDispatch, useSelector } from "react-redux";
import {createUpdateAdditionalInfo, deleteAdditonalInfo, getAccountAdditionalInfo, getValueAdditionalInfoList } from "../../../../../../redux/slices/account_management/detailAccount/additionalInformation";
import { dateFormatting, hasValue } from "../../../../../../utils";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import { showModalSuccess, validateCreateUpdate } from "../../../../../../redux/slices/general_slice";
import DetailText from "../../../../../../components/DetailText";
import { ModalConfirm, ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { WarningOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";
import moment from "moment";
import CardComponent from "../../../../../../components/Card/CardComponent";

const AdditionalInformation = ({idAccount = 0}) => {
  const { data, data_category, data_value, loading } = useSelector(
    (state) => state.additionalInformation
  );

  const dispatch = useDispatch();
  const [formTable] = Form.useForm();

  const [listAdditionalInfo, setListAdditionalInfo] = useState([]);
  const [editDataRecord, setEditDataRecord] = useState({});
  const [storedData, setStoredData] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [statusAction, setStatusAction] = useState("");

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [filteredCategoryList, setFilteredCategoryList] = useState([]);
  const [bodyData, setBodyData] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);
  const [bodyError, setBodyError] = useState({});

  //useEffect
  useEffect(() => {
    dispatch(getAccountAdditionalInfo(idAccount));
  }, [dispatch, idAccount]);

  useEffect(() => {
    setListAdditionalInfo(data?.map((item, index) => {
      return {
        key: index + 1,
        id: item?.id || null,
        category: {
          value: item?.informationType,
          label: item?.informationTypeVal
        },
        value: !hasValue(item.valueStr) ? ({
          value: item?.valueIntDdl?.id,
          label: item?.valueIntDdl?.value
        }) : item.valueStr,
        createdDate: moment(item?.createdDate).format(dateFormatting.dateTime),
        createdBy: item?.createdBy,
        updatedDate: item?.updatedDate ? moment(item?.updatedDate).format(dateFormatting.dateTime) : "",
        updatedBy: item?.updatedBy,
      }
    }));
  }, [data]);

  useEffect(() => {
    if(data_category && listAdditionalInfo && listAdditionalInfo.length > 0){
      setFilteredCategoryList(
        data_category?.filter(
          (item) =>
            !listAdditionalInfo?.map((data) => data?.category?.value)?.includes(item?.value)
        )
      );
    }
  }, [data_category, listAdditionalInfo]);
  
  const handleDescriptionSuccess = useCallback(
    (flag) => {
      setLoadingForm(false)
      const successMessage = {
        title: "Successful",
        description: hasValue(flag) ? "Your data has been updated" : "Your data has been created",
        return: false,
      };
      dispatch(showModalSuccess(successMessage));
    },
    [dispatch, setLoadingForm]
  );

  // Function Save Data
  const save = useCallback(
    async (key) => {
      try {
        const row = await formTable.validateFields();
        const body = {
          id: editDataRecord[key + "id"] || null,
          accountId: idAccount,
          informationType: editDataRecord[key + "category"],
          valueStr:
            typeof row?.value === "object" ? null : row?.value || null,
          valueIntDdl: {
            id: row?.value?.value || null,
            value: row?.value?.label || "",
          },
        };

        setBodyData(body);
        
        const validateValueObj = {
          body: {
            ...body,
            informationType: body?.informationType?.value,
          },
          services: accountManagementService,
          endPoint:
            "/v1/dbs/api/account-detail/additional-information/validate-create-update",
          type: statusAction === "add" ? "create" : "update",
        };
        await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
        setModalConfirm(true);
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    },
    [formTable, editDataRecord, idAccount, statusAction, dispatch]
  );

  // Function Edit Data
  const edit = useCallback(
    (record) => {
      setFilteredCategoryList(
        data_category?.filter(
          (item) =>
            !listAdditionalInfo?.map((data) => data?.category?.value)?.includes(item?.value) ||
            item?.value === record?.category?.value
        )
      );
      setStoredData(true);
      setStatusAction("edit");
      formTable.setFieldsValue({
        ...record,
      });
      
      const { key, ...extraProps } = record || {};
      const tempValue = { ...extraProps };

      const ddlHasAnyChild = data_category.find(
        (item) => item.value === tempValue?.category.value
      )?.isAnyChild;

      for (const attribute in tempValue) {
        if (Object.hasOwnProperty.call(tempValue, attribute)) {
          const tempData = tempValue[attribute];
          setEditDataRecord((prevState) => {
            return {
              ...prevState,
              [`${key}${attribute}`]:
                attribute === "category"
                  ? {
                      ...tempData,
                      isAnyChild: ddlHasAnyChild,
                    }
                  : tempData,
            };
          });
        }
      }
      setEditingKey(record.key);
      if (ddlHasAnyChild && record?.category && record?.category?.value) {
        dispatch(getValueAdditionalInfoList(record?.category?.value));
      }
    },
    [data_category, formTable, data, dispatch]
  );

  // Handle Edit Data Record
  const handleEditDataRecord = useCallback(
    (data, key, index) => {
      const keyName = key + index;
      let value;
      switch (
        additionalInformationTable().find((item) => item?.dataIndex === index)?.inputType
      ) {
        case "input":
        case "number":
          value = data?.target?.value;
          break;
        case "select":
          value = data;
          break;
        case "dynamic":          
          value = editDataRecord[key + "category"]?.isAnyChild
            ? data
            : data?.target?.value;
          break;
        default:
          value = data?.target?.value;
          break;
      }
      
      const ddlHasAnyChild = data_category.find(
        (item) => item.value === value.value
      )?.isAnyChild;

      setEditDataRecord((prevState) => {
        return {
          ...prevState,
          [keyName]:
            index === "category"
              ? {
                  ...value,
                  isAnyChild: ddlHasAnyChild,
                }
              : {...value},
        };
      });

      if (index === `category`) {
        if (ddlHasAnyChild && hasValue(value.value)) {
          dispatch(getValueAdditionalInfoList(data?.value));
        }
        formTable.resetFields(["value"]);
        setEditDataRecord((prevState) => {
          return {
            ...prevState,
            [key + "value"]: undefined,
          };
        });
      }
      return value;
    },
    [dispatch, formTable, setEditDataRecord, editDataRecord]
  );
  
  const handleConfirm = useCallback((bodyData) => {
    const body = {
      ...bodyData,
      informationType: bodyData?.informationType?.value,
    };
    dispatch(createUpdateAdditionalInfo({body})).unwrap()
    .then(async () => {
      setLoadingForm(true)
      setModalConfirm(false)
      dispatch(getAccountAdditionalInfo(idAccount))
      handleDescriptionSuccess(bodyData?.id);
      setStatusAction("")
      setStoredData(false)
      setEditingKey("")
    })
    .catch((error) => {
      if (Math.floor((error.response.data.code || 0) / 100) === 5) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoadingForm(false)
        setBodyError({ message, body});
        setModalError(true);
      }
    });

  },[dispatch, handleDescriptionSuccess, idAccount]);

  const handleDeleted = useCallback((record) => {
    setBodyData(record)
    setModalDelete(true)
  },[])

  const deleted = useCallback((bodyData) => {
    dispatch(deleteAdditonalInfo(bodyData?.id)).unwrap()
    .then(async () => {
      setModalDelete(false)
      dispatch(getAccountAdditionalInfo(idAccount))
      setStoredData(false)
      setStatusAction("")
      setEditingKey("")
    })
    .catch((error) => {
      if (Math.floor((error.response.data.code || 0) / 100) === 5) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoadingForm(false)
        setBodyError({ message, body: bodyData});
        setModalError(true);
      }
    });

  },[dispatch, idAccount])

  const handleRetry = useCallback((bodyError) => {
    if(hasValue(statusAction)){
      handleConfirm(bodyError?.body)
    } else {
      deleted(bodyError?.body)
    }
  },[statusAction, handleConfirm, deleted])

  const handleViewDetail = useCallback((record) => {
    return (
      <CardComponent header={"ADDITIONAL INFORMATION"} cols={2}>
        <DetailText label="Category">{record?.category?.label}</DetailText>
        <DetailText label="Value">
          {!hasValue(record?.value?.label)
            ? record?.value
            : record?.value?.label}
        </DetailText>
      </CardComponent>
    );
  },[])

  return (
    <Fragment>
      <Spin spinning={loading || loadingForm} className={"w-full top-20"}>
        <BaseContainer header={"ADDITIONAL INFORMATION LIST"}>
          <div className={"w-full mt-5"}>
            <FunctionalTableInlineAccount
              path={
                "/account-management/account-standard/additional-information"
              }
              columnsTable={additionalInformationTable}
              columnsActionTable={itemActionViewAdditionalInfoTable}
              data={listAdditionalInfo}
              updateData={setListAdditionalInfo}
              headerInformation="DETAIL ADDITIONAL INFORMATION"
              selectorColumn="accountManagement"
              editDataRecord={editDataRecord}
              formTable={formTable}
              save={save}
              edit={edit}
              deleted={handleDeleted}
              handleEditDataRecord={handleEditDataRecord}
              listOption={{
                data_category: [...filteredCategoryList],
                data_value,
              }}
              editingKey={editingKey}
              setEditingKey={setEditingKey}
              setStoredData={setStoredData}
              storedData={storedData}
              setStatusAction={setStatusAction}
              statusAction={statusAction}
              detailView={handleViewDetail}
            />
          </div>
        </BaseContainer>
      </Spin>

      {modalConfirm ? (
        <ModalCustom
          isOpen={modalConfirm}
          handleCancel={() => setModalConfirm(false)}
          header={"CONFIRMATION"}
          width={1200}
          type={"confirmation"}
          footer={
            <div className="w-full flex justify-end gap-5">
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
                  handleConfirm(bodyData);
                }}
                disabled={loading || loadingForm}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <div>
            <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
              {"ADDITIONAL INFORMATION"}
            </div>

            <div className="w-full grid grid-cols-2 gap-3">
              <DetailText label="Category">
                {bodyData?.informationType?.label || ""}
              </DetailText>
              <DetailText label="Value">
                {bodyData?.informationType?.isAnyChild
                  ? bodyData?.informationType?.label
                  : bodyData?.valueStr || ""}
              </DetailText>
            </div>
          </div>
        </ModalCustom>
      ) : null}

      {modalDelete ? (
        <ModalConfirm
          isOpen={modalDelete}
          handleCancel={() => setModalDelete(false)}
          handleOk={() => deleted(bodyData)}
          width={500}
          useOk={true}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className={"text-[18px] font-bold"}>
              {`Are you sure want to delete additional information ${
                bodyData?.category?.label || ""
              }?`}
            </p>
          </div>
          {/* <Alert
            message="Warning! if you delete this data, it will be permanently."
            type={"error"}
          /> */}
        </ModalConfirm>
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
            <p className="pl-[70px]">{`Your data was not  ${(() => {
              switch (statusAction) {
                case "add":
                  return "created";
                case "edit":
                  return "updated";
                default:
                  return "deleted";
              }
            })()}. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      ) : null}
    </Fragment>
  );
};

export default AdditionalInformation;
