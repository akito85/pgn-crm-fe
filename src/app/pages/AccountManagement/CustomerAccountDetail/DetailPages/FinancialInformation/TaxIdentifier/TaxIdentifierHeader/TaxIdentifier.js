import React, { useEffect, useRef } from "react";
import { PlusOutlined, FilterOutlined } from "@ant-design/icons";
import { Collapse, DatePicker, Form, Input, Space, Switch } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import ButtonComponent from "../../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import TaxIdentifierTable from "./TaxIdentifierTable";
import ModalCustom from "../../../../../../../../components/Modal/ModalCustom";
import TaxIdentifierCreate from "./TaxIdentifierCreate";
import TaxIdentifierConfirm from "./TaxIdentifierConfirm";
import {
  getTaxIdentifier,
  createTaxIdentifier,
  getListDetailAccountAddress,
  getGlobalTypeTaxIdentifier,
} from "../../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../../utils";
import moment from "moment";
import { ModalError } from "../../../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../../../utils/Icon";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import { validateCreateUpdate } from "../../../../../../../../redux/slices/general_slice";

const TaxIdentifier = ({access, id = 0 }) => {
  const dispatch = useDispatch();
  const {
    data_taxIdentifier,
    data_address_taxIdentifier,
    data_globalTypeTaxIdentifier,
  } = useSelector((state) => state.financialInformation);

  //declare
  const [formTaxIdentifier] = Form.useForm();
  const searchInput = useRef(null);

  // modal
  const [modalCreateTaxIdentifier, setModalCreateTaxIdentifier] =
    useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalValidate, setModalValidate] = useState(false);
  //state
  const [data, setData] = useState();
  const [bodyError, setBodyError] = useState({});
  const [btnIsEnable, setBtnIsEnable] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);

  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, updateSearch] = useState({});
  const [warning, setWarning] = useState("");
  const [textTax, setTextTax] = useState("");
  const [typeTax, setTypeTax] = useState(0);

  const [dataConfirm, setDataConfirm] = useState({});

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

      dispatch(
        getTaxIdentifier({ id, page, pageSize, sort, search: tempSearch })
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    if (id) {
      dispatch(getListDetailAccountAddress(id));
      dispatch(getGlobalTypeTaxIdentifier());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (data_taxIdentifier && data_taxIdentifier.page) {
      setTotalElement(data_taxIdentifier?.page?.totalElements);
    }
  }, [data_taxIdentifier]);

  // useEffect(() => {
  //   if (data_address_taxIdentifier) {
  //     formTaxIdentifier.setFieldsValue({
  //       taxIdentifierAddress: data_address_taxIdentifier?.fullAddress,
  //     });

  //   }
  // }, [data_address_taxIdentifier]);

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

  // // Search Column Table
  // const getColumnSearchProps = (dataIndex, type) => ({
  //   filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
  //     const onDataChange = (value, dateString) => {
  //       setSelectedKeys(dateString ? [dateString] : []);
  //       handleSearch(dateString ? [dateString] : [], confirm, dataIndex);
  //     };
  //     return (
  //       <div
  //         style={{
  //           padding: 8,
  //         }}
  //         onKeyDown={(e) => e.stopPropagation()}
  //       >
  //         {type === "date" ? (
  //           <DatePicker onChange={onDataChange} />
  //         ) : (
  //           <Input
  //             ref={searchInput}
  //             placeholder={`Search`}
  //             value={selectedKeys[0]}
  //             onChange={(e) =>
  //               setSelectedKeys(e.target.value ? [e.target.value] : [])
  //             }
  //             onPressEnter={() => {
  //               handleSearch(selectedKeys, confirm, dataIndex);
  //             }}
  //             style={{
  //               marginBottom: 8,
  //               display: "block",
  //             }}
  //           />
  //         )}
  //       </div>
  //     );
  //   },
  //   filterIcon: (filtered) => (
  //     <FilterOutlined
  //       style={{
  //         color: filtered ? "#1890ff" : undefined,
  //       }}
  //     />
  //   ),
  //   onFilterDropdownOpenChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 5000);
  //     }
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{
  //           backgroundColor: "#ffc069",
  //           padding: 0,
  //         }}
  //         searchWords={
  //           type === "date"
  //             ? moment([searchText]).format(dateFormatting.dateFormal)
  //             : [searchText]
  //         }
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : (
  //       text || ""
  //     ),
  // });

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

  //handle utils
  const onFinish = async (value) => {
    let url;
    let bodyRequest;
    setData(value);
    setDataConfirm({
      ...value,
      taxIdentifierAddress: data_address_taxIdentifier?.find(
        (item) => item.addressId === value.taxIdentifierAddress
      )?.fullAddress,
    });
    url = "/v1/dbs/api/tax-identifier/validate-create";
    bodyRequest = {
      ...value,
      startDate: moment(value?.startDate).format(dateFormatting.date),
      accountId: id,
    }
    await dispatch(validateCreateUpdate({ body: bodyRequest, services: accountManagementService, endPoint: url, type: "create" }))?.unwrap();
    setModalType(true);
  };

  const handleCloseModalTaxIdentifier = () => {
    setWarning("");
    setTextTax("");
    setTypeTax(0);
    setModalCreateTaxIdentifier(false);
    setModalType(false);
    formTaxIdentifier.resetFields();
  };

  const handleClearModalTaxIdentifier = () => {
    formTaxIdentifier.resetFields();
    setWarning("");
    setTextTax("");
    setTypeTax(0);
    setModalCreateTaxIdentifier(false);
  };

  const handleBtnIsEnable = (value) => {
    setBtnIsEnable(value);
  };

  const handleRetry = () => {
    handleSend(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const onChangedTypeTax = (e) => {
    setTypeTax(e);
    setTextTax("");
    setBtnIsEnable(true);
    formTaxIdentifier.resetFields(["taxIdentifierNumber"]);
  };

  const handleSend = (e) => {
    //activated tax Ident
    const data = {
      ...e,
      startDate: moment(e?.startDate).format(dateFormatting.date),
      // taxIdentifierAddress: data_address_taxIdentifier?.addressId,
      accountId: id,
    };
    // setModalCreateTaxIdentifier(false);
    dispatch(createTaxIdentifier({ ...data }))
      .unwrap()
      .then(() => {
        handleCloseModalTaxIdentifier();
        setDataConfirm({});
        setData({});
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
          getTaxIdentifier({ id, page, pageSize, sort, search: tempSearch })
        );
        // dispatch(getTaxIdentifier({ id, page, pageSize, sort, search }));
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
          handleClearModalTaxIdentifier();
          setBodyError({ message, value: e });

          setModalError(true);
        }
      })
      .finally(() => {
        setModalType(false);
      });
  };

  return (
    <Fragment>
      <div className="text-primary text-xs font-bold uppercase mb-5">
        {"Tax Identifier List"}
      </div>

      <div>
        <div className={"w-full flex justify-end mb-5"}>
          {access?.actionList?.some(action => action.name === 'Create' ) && 
            <ButtonComponent
              onClick={() => {
                if (
                  data_address_taxIdentifier &&
                  data_address_taxIdentifier.length > 0
                ) {
                  setModalCreateTaxIdentifier(true);
                } else {
                  setModalValidate(true);
                }
              }}
              type={"submit"}
              border={false}
              icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            >
              Create
            </ButtonComponent>
          }
        </div>
        <TaxIdentifierTable
          data={data_taxIdentifier?.result}
          handleChange={handleChange}
          handleChangeSize={handleChangeSize}
          totalElement={totalElement}
          page={page}
          pageSize={pageSize}
          onSort={onSort}
          searchText={searchText}
          searchedColumn={searchedColumn}
          // getColumnSearchProps={getSea}
          access={access}
          search={search}
          searchInput={searchInput}
          handleSearch={handleSearch}
        />
      </div>

      {/* modal Create Tax Identifier */}
      <ModalCustom
        isOpen={modalCreateTaxIdentifier}
        type={"confirmation"}
        header="CREATE NEW TAX IDENTIFIER"
        width={1200}
        handleCancel={handleCloseModalTaxIdentifier}
        footer={
          <div className={"w-full flex justify-end"}>
            {modalType ? (
              <div className="flex flex-row gap-2">
                <ButtonComponent
                  onClick={() => setModalType(false)}
                  type="default"
                >
                  Back
                </ButtonComponent>
                <ButtonComponent onClick={() => handleSend(data)} type="submit">
                  Confirm
                </ButtonComponent>
              </div>
            ) : (
              <div className="w-full flex justify-end gap-2">
                <ButtonComponent
                  type="default"
                  onClick={() => handleClearModalTaxIdentifier()}
                >
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  form={"formCreateTaxIdentifier"}
                  type={"submit"}
                  htmlType="submit"
                  // disabled={btnIsEnable}
                >
                  Save
                </ButtonComponent>
              </div>
            )}
          </div>
        }
      >
        <Form
          id={"formCreateTaxIdentifier"}
          layout={"vertical"}
          form={formTaxIdentifier}
          onFinish={onFinish}
        >
          {modalType ? (
            <TaxIdentifierConfirm
              data={dataConfirm}
              filterTax={data_globalTypeTaxIdentifier}
            />
          ) : (
            <TaxIdentifierCreate
              onChangedTypeTax={onChangedTypeTax}
              warning={warning}
              textTax={textTax}
              typeTax={typeTax}
              setTypeTax={setTypeTax}
              setTextTax={setTextTax}
              setWarning={setWarning}
              dataTaxIdentifier={data_globalTypeTaxIdentifier}
              dataTaxAddress={data_address_taxIdentifier}
              // handleBtnIsEnable={handleBtnIsEnable}
            />
          )}
        </Form>
      </ModalCustom>

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
          <p className="pl-[70px]">{"Your Data was not created. "}</p>
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
              "You can't create tax identifier because this account doesn't have active tax business purposed address."
            }
          </p>
        </div>
      </ModalError>
    </Fragment>
  );
};

export default TaxIdentifier;
