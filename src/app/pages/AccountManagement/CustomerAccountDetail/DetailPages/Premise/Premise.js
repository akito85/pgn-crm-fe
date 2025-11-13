import { Fragment } from "react";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import { DatePicker, Form, Input, Spin } from "antd";
import moment from "moment";
import PremiseTable from "./PremiseTable";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import ServicePointCreateAndUpdate from "../ServicePoint/ServicePointCreateAndUpdate";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../../../assets/Icon/index";
import ServicePointConfirm from "../ServicePoint/ServicePointConfirmation";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { useDispatch, useSelector } from "react-redux";
import {
  createServicePoint,
  getGlobalTypeListServicePoint,
  getPremise,
  inActiveServicePoint,
  updateServicePoint,
  getListAddressPremise
} from "../../../../../../redux/slices/account_management/detailAccount/Premise";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../utils";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../utils/Icon";
import { getGrantedAccessAccount, getGrantedAccessAccountExtend } from "../../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../ComponentAccount/ToolbarAccount";
import accountManagementService from "../../../../../../redux/services/account_management/accountManagementService";
import { validateCreateUpdate } from "../../../../../../redux/slices/general_slice";
import { useLocation } from "react-router-dom";

const Premise = ({ id = 0, idCustomer = 0, type = "" }) => {
  const dispatch = useDispatch();
  const { data_premise, data_globalTypeServicePoint, loading, data_list_address_premise } = useSelector(
    (state) => state.premise
  );
  const { access_account, access_account_extend } = useSelector(
    (state) => state.accountManagement
  );

  //declare
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [formInactive] = Form.useForm();
  const searchInput = useRef(null);

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalCreate, setModalCreate] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalInactive, setModalInactive] = useState(false);
  const [dataInactive, setDataInactive] = useState({});
  const [modalError, setModalError] = useState(false);
  const [modalValidate, setModalValidate] = useState(false);
  const [dataServicePoint, setDataServicePoint] = useState([]);
  const [dataConfirm, setDataConfirm] = useState({});
  const [dataUpdate, setDataUpdate] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [data, setData] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [btnIsEnable, setBtnIsEnable] = useState(true);
  const [typeRetry, setTypeRetry] = useState("");
  const [titleActiveOrInactive, setTitleActiveOrInactive] = useState("");
  const [premiseName, setPremiseName] = useState("");
  const location = useLocation();

  //useEffect
  useEffect(() => {
    if(location?.pathname.includes('account-standard')) {
      dispatch(getGrantedAccessAccount('/account-management/account-standard/premise'))
      dispatch(getGrantedAccessAccountExtend('/account-management/account-standard/service-point'))
    }else{
      dispatch(getGrantedAccessAccount('/account-management/account-onetime/premise'))
    }
  }, [dispatch])
  
  useEffect(() => {
    if (id) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(getPremise({ id, page, pageSize, sort, search: reqSearch }));
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    dispatch(getGlobalTypeListServicePoint());
    dispatch(getListAddressPremise({id}));
  }, [dispatch]);

  useEffect(() => {
    if (
      id &&
      data_premise &&
      data_premise.result
      // && data_premise.result.length > 0
    ) {
      setTotalElement(data_premise?.page?.totalElements);
      const data = (data_premise?.result || [])?.map(
        (premise, indexPremise) => ({
          ...premise,
          key: indexPremise + 1,
          servicePoint: (premise?.servicePoint || []).map(
            (servicePoint, index) => ({
              ...servicePoint,
              key: index + 1,
              parent: indexPremise + 1,
            })
          ),
        })
      );
      setDataTable(data);
      setBtnIsEnable(false);
    }
  }, [data_premise]);

  const handleOptionServicePoint = (value) => {
    formCreate.resetFields(["servicePointName"]);
    const temp = data_premise?.result
      ?.filter((item) => item?.id === value)[0] //static because we only need to 1 data
      ?.servicePoint?.filter((item) => item?.status === "ACTIVE")
      ?.map((item) => item?.servicePointName);
    setDataServicePoint(
      data_globalTypeServicePoint.filter((item) => !temp?.includes(item?.text))
    );
  };

  // Search Column Table
  const getColumnSearchProps = (dataIndex, type) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const onDataChange = (value, dateString) => {
        setSelectedKeys(dateString ? [dateString] : []);
        handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
      };
      return (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {type === "date" ? (
            <DatePicker onChange={onDataChange} />
          ) : (
            <Input
              ref={searchInput}
              placeholder={`Search`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => {
                handleSearch(selectedKeys, confirm, dataIndex);
              }}
              style={{
                marginBottom: 8,
                display: "block",
              }}
            />
          )}
        </div>
      );
    },
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    // onFilter: (value, record) =>
    //   record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 5000);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            type === "date"
              ? moment([searchText]).format(dateFormatting.dateFormal)
              : [searchText]
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  //handle
  const onFinishCreate = async (e) => {
    let url;
    let bodyRequest;
    const temp = data_globalTypeServicePoint.filter(
      (item) => item?.id === e?.servicePointName
    );
    setData({
      servicePointId: e?.servicePointName,
      servicePointName: temp[0]?.text,
      description: e?.description,
      accountAddressId: e?.premiseAddress,
    });
    setDataConfirm({
      servicePointId: e?.servicePointName,
      servicePointName: temp[0]?.text,
      description: e?.description,
      accountAddressId: data_list_address_premise?.filter(
        (item) => item?.id === e?.premiseAddress
      )[0]?.value,
    });
    bodyRequest = {
      servicePointName: e?.servicePointName,
      description: e?.description,
      accountAddressId: e.premiseAddress,
    };
    url = "/v1/dbs/api/premise/servicePoint/validate-create";
    await dispatch(validateCreateUpdate({ body: bodyRequest, services: accountManagementService, endPoint: url, type }))?.unwrap();
    setModalType(true);
  };

  const onFinishInactive = (e, handleClear) => {
    //code
    const data = {
      servicePointId: dataInactive?.servicePointId,
      remarks: e?.remark,
    };

    setModalInactive(false);
    dispatch(inActiveServicePoint({ ...data }))
      .unwrap()
      .then(() => {
        formInactive.resetFields();
        setDataInactive({});
        setModalInactive(false);
        handleClear();
        // dispatch(getPremise({ id, page, pageSize }));
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(getPremise({ id, page, pageSize, sort, search: reqSearch }));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setTypeRetry("inactive");
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  const handleInactive = (value) => {
    setDataInactive(value);
    setModalInactive(true);
    setTitleActiveOrInactive(
      value?.status === "ACTIVE" ? "Inactivate" : "Activate"
    );
    setPremiseName(value?.servicePointName);
  };

  const handleSendUpdate = (e) => {
    const data = {
      servicePointId: e?.servicePointId,
      description: e?.description,
    };
    setModalUpdate(false);
    dispatch(updateServicePoint({ ...data }))
      .unwrap()
      .then(() => {
        formUpdate.resetFields();
        setDataUpdate({});
        setModalUpdate(false);
        setModalType(false);
        // dispatch(getPremise({ id, page, pageSize }));
        
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(getPremise({ id, page, pageSize, sort, search: reqSearch }));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setTypeRetry("update");
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  }

  const onFinishUpdate = (e) => {
    const temp = data_globalTypeServicePoint.filter(
      (item) => item?.text === e?.servicePointName
    );
    setDataUpdate({
      ...dataUpdate,
      description: e?.description,
    })
    setDataConfirm({
      servicePointId: e?.servicePointName,
      servicePointName: temp[0]?.text,
      description: e?.description,
      accountAddressId: data_premise?.result?.filter(
        (item) => item?.id === e?.premiseAddress
      )[0]?.address,
    });
    setModalType(true);
  };

  const handleUpdate = (value) => {
    setDataUpdate(value);
    const temp = dataTable.filter((item) => item?.key === value?.parent);
    formUpdate.setFieldsValue({
      premiseAddress: temp[0]?.id,
      ...value,
    });
    setModalUpdate(true);
  };
  const handleRetry = () => {
    //code
    if (typeRetry === "create") {
      handleSendCreate(bodyError?.value);
    } else if (typeRetry === "update") {
      onFinishUpdate(bodyError?.value);
    } else {
      onFinishInactive(bodyError?.value);
    }
    setModalError(false);
    setBodyError({});
    setTypeRetry("");
  };

  const handleSendCreate = (e) => {
    const data = {
      accountAddressId: e.accountAddressId,
      servicePointName: e.servicePointId,
      description: e.description,
    };
    setModalCreate(false);
    dispatch(createServicePoint({ ...data }))
      .unwrap()
      .then(() => {
        formCreate.resetFields();
        setModalCreate(false);
        setData({});
        setDataServicePoint([]);
        // dispatch(
        //   getPremise({
        //     id,
        //     page,
        //     pageSize,
        //   })
        // );
        let tempSearch = "";
        for (const dataIndex in search) {
          if (Object.hasOwnProperty.call(search, dataIndex)) {
            const tempSearchText = search[dataIndex];
            if (tempSearchText) {
              tempSearch += `${dataIndex}~${tempSearchText},`;
            }
          }
        }
        tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
        dispatch(getPremise({ id, page, pageSize, sort, search: tempSearch }));
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setTypeRetry("create");
          setBodyError({ message, value: e });

          setModalError(true);
        }
      })
      .finally(() => {
        setModalType(false);
      });
  };

  const handleCancel = () => {
    setModalInactive(false);
    formInactive.resetFields();
  };

  const itemActions = [
    //action toolbar
    {
      action: 'Create',
      render: (
        <ButtonComponent
          onClick={() => {
            if (btnIsEnable || dataTable.length < 1) {
              setModalValidate(true);
            } else {
              setModalCreate(true);
            }
          }}
          type={"submit"}
          border={false}
          icon={<PlusOutlined style={{ fontSize: "24px" }} />}
        >
          Create Service Point
        </ButtonComponent>

      )
    }
  ]

  const accessServicePoint = {
    actionList: access_account_extend?.actionList?.filter(item =>
      item.path.includes("service-point") && !item.path.includes("asset") 
    ) 
  };
  
  return (
    <Spin spinning={loading}>
      <Fragment>
        <BaseContainer header={"PREMISE LIST"}>
          <div className={"w-full flex justify-end mb-5"}>
            <ToolbarAccount items={itemActions} advancedAccess={accessServicePoint}/>
          </div>
          <PremiseTable
            data={dataTable}
            handleChange={handleChange}
            handleChangeSize={handleChangeSize}
            totalElement={totalElement}
            page={page}
            pageSize={pageSize}
            onSort={onSort}
            searchText={searchText}
            searchedColumn={searchedColumn}
            getColumnSearchProps={getColumnSearchProps}
            handleInactive={handleInactive}
            handleUpdate={handleUpdate}
            idAccount={id}
            idCustomer={idCustomer}
            type={type}
            accessAccount={access_account}
            accessServicePoint={accessServicePoint}
          />
        </BaseContainer>

        {/* create */}
        <ModalCustom
          isOpen={modalCreate}
          type={"confirmation"}
          header="CREATE SERVICE POINT"
          width={700}
          handleCancel={() => {
            setDataServicePoint([]);
            setModalType(false);
            setModalCreate(false);
            formCreate.resetFields();
          }}
          footer={
            <div className={"w-full flex justify-end"}>
              {modalType ? (
                <div className="flex flex-row gap-3">
                  <ButtonComponent
                    onClick={() => {
                      setModalType(false);
                      // setModalCreate(false);
                      // formCreate.resetFields();
                    }}
                    type="default"
                  >
                    Back
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => handleSendCreate(data)}
                    type="submit"
                  >
                    Confirm
                  </ButtonComponent>
                </div>
              ) : (
                <div className="w-full flex justify-end gap-2">
                  <ButtonComponent
                    type="default"
                    onClick={() => {
                      setDataServicePoint([]);
                      setModalType(false);
                      setModalCreate(false);
                      formCreate.resetFields();
                    }}
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    form={"formCreateServicePoint"}
                    type={"submit"}
                    htmlType="submit"
                  >
                    Save
                  </ButtonComponent>
                </div>
              )}
            </div>
          }
        >
          <Form
            id={"formCreateServicePoint"}
            layout={"vertical"}
            form={formCreate}
            onFinish={onFinishCreate}
          >
            {modalType ? (
              <ServicePointConfirm data={dataConfirm} />
            ) : (
              <ServicePointCreateAndUpdate
                type={"create"}
                optionAddress={data_list_address_premise}
                optionServicePoint={dataServicePoint}
                handleOptionServicePoint={handleOptionServicePoint}
              />
            )}
          </Form>
        </ModalCustom>

        {/* upadte */}
        <ModalCustom
          isOpen={modalUpdate}
          type={"confirmation"}
          header="UPDATE SERVICE POINT"
          width={700}
          handleCancel={() => {
            setModalUpdate(false);
            formUpdate.resetFields();
          }}
          footer={
            <div className={"w-full flex justify-end"}>
              {modalType ? (
                <div className="flex flex-row gap-3">
                  <ButtonComponent
                    onClick={() => {
                      setModalType(false);
                      // setModalCreate(false);
                      // formCreate.resetFields();
                    }}
                    type="default"
                  >
                    Back
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() => handleSendUpdate(dataUpdate)}
                    type="submit"
                  >
                    Confirm
                  </ButtonComponent>
                </div>
              ) : (
                <div className="w-full flex justify-end gap-2">
                  <ButtonComponent
                    type="default"
                    onClick={() => {
                      setDataServicePoint([]);
                      setModalType(false);
                      setModalUpdate(false);
                      formUpdate.resetFields();
                    }}
                  >
                    Cancel
                  </ButtonComponent>
                  <ButtonComponent
                    form={"formUpdateServicePoint"}
                    type={"submit"}
                    htmlType="submit"
                  >
                    Save
                  </ButtonComponent>
                </div>
              )}
            </div>
          }
        >
          <Form
            id={"formUpdateServicePoint"}
            layout={"vertical"}
            form={formUpdate}
            onFinish={onFinishUpdate}
          >
            {modalType ? (
              <ServicePointConfirm data={dataConfirm} />
            ) : (
              <ServicePointCreateAndUpdate
                type={"update"}
                optionAddress={data_premise?.result}
                optionServicePoint={data_globalTypeServicePoint}
              />
            )}
          </Form>
        </ModalCustom>

        {/* inactive */}
        <ModalApproveOrReject
          isOpen={modalInactive}
          handleCloseModal={handleCancel}
          onFinish={onFinishInactive}
          header={titleActiveOrInactive}
          approveOrReject={titleActiveOrInactive}
          menu={"Premise"}
          named={premiseName}
        />
        {/* <ModalApproveOrReject
          isOpen={modalInactive}
          header="Inactive Information"
          handleCancel={() => {
            setModalInactive(false);
          }}
          message={`Are you sure you want to Inactive ${dataInactive?.servicePointName} ?`}
          width={1000}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => setModalInactive(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                form={"formInactiveServicePoint"}
                htmlType={"submit"}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id={"formInactiveServicePoint"}
            layout={"vertical"}
            form={formInactive}
            onFinish={onFinishInactive}
          >
            <Form.Item
              name={"remark"}
              label={"Remark"}
              rules={[{ required: true, message: requiredMessage("Remark") }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
              />
            </Form.Item>
          </Form>
        </ModalApproveOrReject> */}

        {/** Modal Retry */}
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
            <p className="pl-[70px]">{`Your data was not ${typeRetry}`}</p>
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
                "You can't create service point because this account doesn't have active premise address."
              }
            </p>
          </div>
        </ModalError>
      </Fragment>
    </Spin>
  );
};

export default Premise;
