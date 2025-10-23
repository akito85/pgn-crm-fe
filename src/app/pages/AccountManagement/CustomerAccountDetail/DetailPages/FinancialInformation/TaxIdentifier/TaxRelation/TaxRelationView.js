import React, { useEffect, useRef } from "react";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Collapse, Space, Switch, Form, DatePicker, Input } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import TaxRelationTableView from "./TaxRelationTableView";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import TaxRelationConfirm from "./TaxRelationConfirm";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import TaxRelationCreate from "./TaxRelationCreate";
import TaxRelationChooseAccount from "./TaxRelationChooseAccount";
import moment from "moment";
import ModalApproveOrReject from "../../../../../../../../components/Modal/ModalApproveOrReject";
import { requiredMessage } from "../../../../../../../../utils";
import DateComponent from "../../../../../../../../components/DateComponent";
import InputComponent from "../../../../../../../../components/InputComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  createTaxRelation,
  getTaxRelation,
  getTaxRelationFirstIndex,
  inActiveTaxRelation,
} from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { dateFormatting } from "../../../../../../../../utils";
import Highlighter from "react-highlight-words";
import { ModalError } from "../../../../../../../../components/Modal/ModalPopUp";

const TaxRelationView = ({access, id = 0 }) => {
  const dispatch = useDispatch();
  const { data_taxRelation } = useSelector(
    (state) => state.financialInformation
  );
  //declare
  const [formTaxRelation] = Form.useForm();
  const [formInactive] = Form.useForm();
  const searchInput = useRef(null);

  //state
  const [modalInactive, setModalInactive] = useState(false);
  const [modalCreateTaxRelation, setModalCreateTaxRelation] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalChooseAccount, setModalChooseAccount] = useState({
    data: {},
    isOpen: false,
  });
  const [data, setData] = useState({});
  const [dataInactive, setDataInactive] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [retry, setRetry] = useState(false);
  const [btnIsEnable, setBtnIsEnable] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [modalValidate, setModalValidate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, updateSearch] = useState({});
  const [startDate, setStartDate] = useState();
  const [taxRelationName, setTaxRelationName] = useState('');

  //use effect
  useEffect(() => {
    if (id) {
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

      dispatch(
        getTaxRelation({ id, page, pageSize, sort, search: reqSearch })
      );
    }
  }, [id, page, pageSize, sort, search]);

  useEffect(() => {
    if (
      data_taxRelation &&
      data_taxRelation.result &&
      data_taxRelation.result.length > 0
    ) {
      setTotalElement(data_taxRelation?.page?.totalElements);
    }
  }, [data_taxRelation]);

  //handle utils
  const onFinish = (value) => {
    const data = {
      ...value,
      relatedAccountId: modalChooseAccount?.data?.accountId,
    };
    setData(data);
    setModalType(true);
  };

  const onFinishInactive = (e, handleClear) => {
    const data = {
      id: dataInactive?.id,
      endDate: moment(e.endDate).format("DD MMM YYYY"),
      remark: e.remark,
    };

    // setModalInactive(false);
    dispatch(inActiveTaxRelation({ ...data }))
      .unwrap()
      .then(() => {
        handleClear()
        formInactive.resetFields();
        setStartDate();
        setModalInactive(false);
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

        dispatch(
          getTaxRelation({ id, page, pageSize, sort, search: tempSearch })
        );
        // dispatch(getTaxRelation({ id, page, pageSize }));
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
          setBodyError({ message, value: e });
          setModalError(true);
        }
      });
  };

  const handleSend = (e) => {
    const data = {
      accountId: id,
      relatedAccountId: e?.relatedAccountId,
      startDate: moment(e?.startDate).format("DD MMM YYYY"),
      description: e?.description,
    };
    // setModalCreateTaxRelation(false);
    dispatch(createTaxRelation({ ...data }))
      .unwrap()
      .then(() => {
        formTaxRelation.resetFields();
        setModalCreateTaxRelation(false);
        setAccountNumber("");
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

        dispatch(
          getTaxRelation({ id, page, pageSize, sort, search: tempSearch })
        );
        // dispatch(getTaxRelation({ id, page, pageSize, sort, search }));
      })
      .catch((error) => {
        setRetry(true);
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setBodyError({ message, value: e });

          setModalError(true);
        }
      })
      .finally(() => {
        setModalType(false);
      });
  };

  const handleRetryCreate = () => {
    handleSend(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const handleRetryInactive = () => {
    onFinishInactive(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const handleChooseAccount = (value) => {
    setModalChooseAccount(value);
    if (value.data && value.isOpen === false) {
      setAccountNumber(value?.data?.accountNumber);
      let data = { ...value?.data };
      delete data.startDate;
      formTaxRelation.setFieldsValue({
        ...data,
      });
    }
  };

  const handleModalInactive = (isEnable, value) => {
    setStartDate(moment(value?.startDate));
    setModalInactive(isEnable);
    setDataInactive(value);
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  //handle on-changes listener
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    updateSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
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
        text || ""
      ),
  });

  const handleChange = (page) => {
    setPage(page);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  const handleCreateTaxRelation = () => {
    dispatch(
      getTaxRelationFirstIndex( id )
    )
      .unwrap()
      .then((data) => {
        if (data?.result[0]?.status === "ACTIVE") {
          setModalValidate(true);
        } else {
          setModalCreateTaxRelation(true);
        }
      });
  };

  const handleCancel = () => {
    formInactive.resetFields();
    setStartDate();
    setModalInactive(false);
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mt-10 mb-5">
        {"TAX RELATION LIST"}
      </div>

      <div>
        <div className={"w-full flex justify-end mb-5"}>
          {access?.actionList?.some(action => action.name === 'Create' ) && 
            <ButtonComponent
              onClick={() => {
                handleCreateTaxRelation();
              }}
              type={"submit"}
              border={false}
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            >
              Create
            </ButtonComponent>
          }
        </div>
        <TaxRelationTableView
          data={data_taxRelation?.result}
          handleModalInactive={handleModalInactive}
          handleChange={handleChange}
          handleChangeSize={handleChangeSize}
          totalElement={totalElement}
          page={page}
          pageSize={pageSize}
          onSort={onSort}
          getColumnSearchProps={getColumnSearchProps}
          setTaxRelationName={setTaxRelationName}
          access={access}
          search={search}
          handleSearch={handleSearch}
          searchText={searchText}
          searchInput={searchInput}
          searchedColumn={searchedColumn}
        />
      </div>

      {/* create tax relation */}
      <ModalCustom
        isOpen={modalCreateTaxRelation}
        type={"confirmation"}
        header="CREATE TAX RELATION"
        width={1200}
        handleCancel={() => {
          setAccountNumber("");
          setModalCreateTaxRelation(false);
          formTaxRelation.resetFields();
        }}
        footer={
          <div className={"w-full flex justify-end"}>
            {modalType ? (
              <div className="w-full flex justify-end gap-5">
                <ButtonComponent
                  type={"default"}
                  onClick={() => {
                    // setAccountNumber("");
                    setModalType(false);
                    // setModalCreateTaxRelation(false);
                    // formTaxRelation.resetFields();
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  onClick={() => {
                    handleSend(data);
                  }}
                >
                  Confirm
                </ButtonComponent>
              </div>
            ) : (
              <div className="w-full flex justify-end gap-5">
                <ButtonComponent
                  type="default"
                  onClick={() => {
                    setAccountNumber("");
                    setModalType(false);
                    formTaxRelation.resetFields();
                    setModalCreateTaxRelation(false);
                  }}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  form={"formCreateTaxRelation"}
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
          id={"formCreateTaxRelation"}
          layout={"vertical"}
          form={formTaxRelation}
          onFinish={onFinish}
        >
          {modalType ? (
            <TaxRelationConfirm data={data} />
          ) : (
            <TaxRelationCreate
              handleChooseAccount={handleChooseAccount}
              accountNumber={accountNumber}
              setAccountNumber={setAccountNumber}
            />
          )}
        </Form>
      </ModalCustom>

      {/* choose account */}
      <ModalCustom
        isOpen={modalChooseAccount?.isOpen}
        type={"confirmation"}
        header="CREATE TAX RELATION ( CHOOSE ACCOUNT )"
        width={1200}
        handleCancel={() => {
          setModalChooseAccount({
            data: {},
            isOpen: false,
          });
        }}
        footer={
          <div className={"w-full flex justify-end"}>
            <ButtonComponent
              type={"default"}
              onClick={() => {
                setModalChooseAccount({
                  data: {},
                  isOpen: false,
                });
              }}
            >
              Back
            </ButtonComponent>
          </div>
        }
      >
        <TaxRelationChooseAccount
          dispatch={dispatch}
          handleChooseAccount={handleChooseAccount}
          id={id}
        />
      </ModalCustom>

      {/* inactive relation */}
      <ModalApproveOrReject
        isOpen={modalInactive}
        handleCloseModal={handleCancel}
        onFinish={onFinishInactive}
        header={"Inactive Information"}
        approveOrReject={"Inactive Information"}
        menu={"Tax Relation"}
        named={taxRelationName}
        children={
          <Form.Item
          name={"endDate"}
          label={"End Date"}
          rules={[
            {
              validator: (_, value) =>
                (value && moment(startDate) < moment(value)) || !value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("End date must after Start date")
                    ),
            },
            { message: requiredMessage("End Date"), required: true }]}
          className="no-margin-form"
        >
          <DateComponent dateDisable={handleDisableEndDate} />
        </Form.Item>
        }
      />

      {/* <ModalApproveOrReject
        isOpen={modalInactive}
        header="Inactive Information"
        handleCancel={() => {
          formInactive.resetFields();
          setStartDate();
          setModalInactive(false);
        }}
        message={`Are you sure you want to Inactive Tax Relation to account ${dataInactive?.accountName}`}
        width={1000}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={() => {
                formInactive.resetFields()
                setStartDate();
                setModalInactive(false)
              }}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              border={false}
              form={"formInactive"}
              htmlType={"submit"}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id={"formInactive"}
          layout={"vertical"}
          form={formInactive}
          onFinish={onFinishInactive}
        >
          <div className="flex flex-col gap-5">
            <Form.Item
              name={"endDate"}
              label={"End Date"}
              rules={[
                {
                  validator: (_, value) =>
                    (value && moment(startDate) < moment(value)) || !value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("End date must after Start date")
                        ),
                },
                { message: requiredMessage("End Date"), required: true }]}
              className="no-margin-form"
            >
              <DateComponent dateDisable={handleDisableEndDate} />
            </Form.Item>
            <Form.Item 
              name={"remark"} 
              label={"Remark"} 
              rules={[
                {
                  message: requiredMessage("Remark"),
                  required: true,
                },
              ]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
              />
            </Form.Item>
          </div>
        </Form>
      </ModalApproveOrReject> */}

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={retry ? handleRetryCreate : handleRetryInactive}
        handleCancel={() => {
          setRetry(false);
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
            retry ? "Created." : "Inactive."
          } ${bodyError?.message}`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

      <ModalError
        isOpen={modalValidate}
        handleOk={()=>setModalValidate(false)}
        handleCancel={()=>setModalValidate(false)}
        customText={"Back"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{"You can't create tax relation. Please inactive your latest tax relation."}</p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default TaxRelationView;
