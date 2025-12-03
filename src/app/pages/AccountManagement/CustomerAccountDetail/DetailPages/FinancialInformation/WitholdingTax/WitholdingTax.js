import React, { useEffect, useRef } from "react";
import { FilterOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, Spin, Switch } from "antd";
import { useState } from "react";
import { Fragment } from "react";
import DetailText from "../../../../../../../components/DetailText";
import WitholdingTaxTable from "./WitholdingTaxTable";
import WitholdingTaxSet from "./WitholdingTaxSet";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { useDispatch, useSelector } from "react-redux";
import {
  createWitholdingTax,
  getWithHoldingTax,
  getWithHoldingTaxFirstIndex,
  inActiveWitholdingTax,
} from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import ModalApproveOrReject from "../../../../../../../components/Modal/ModalApproveOrReject";
import { requiredMessage } from "../../../../../../../utils";
import DateComponent from "../../../../../../../components/DateComponent";
import moment from "moment";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../utils";

const WitholdingTax = ({ access, id = 0 }) => {
  // Selector
  const { data_withHoldingTax, loading, data_withHoldingTaxFirstIndex } =
    useSelector((state) => state.financialInformation);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  //state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);

  //modal and extension
  const [modalInactive, setModalInactive] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [formInactive] = Form.useForm();
  const [formCreate] = Form.useForm();
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, updateSearch] = useState({});
  const [startDate, setStartDate] = useState();
  //declare
  useEffect(() => {
    if (id) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getWithHoldingTax({ id, page, pageSize, sort, search: reqSearch }),
      );
    }
  }, [dispatch, id, page, pageSize, sort, search]);

  useEffect(() => {
    if (data_withHoldingTax && data_withHoldingTax.page) {
      setTotalElement(data_withHoldingTax?.page?.totalElements);
    }
  }, [data_withHoldingTax]);

  //behavior clicked wapu
  const handleClear = () => {
    formCreate.resetFields();
  };

  const onClick = () => {
    if (data_withHoldingTax?.status) {
      dispatch(getWithHoldingTaxFirstIndex(id))
        .unwrap()
        .then((data) => {
          setStartDate(
            moment(data?.result[0]?.startDate)?.format(dateFormatting?.date),
          );
          setModalInactive(true);
        });
    } else {
      setModalCreate(true);
    }
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return moment(startDate) >= current;
    }
    return moment().add(-1, "days") >= current;
  };

  //behavior confirm
  const onFinish = (e, handleClear) => {
    if (data_withHoldingTax?.status === false) {
      //activated wapu
      const data = {
        accountId: id,
        startDate: moment(e.startDate).format("DD MMM YYYY"),
        description: e.description,
      };
      setModalCreate(false);
      dispatch(createWitholdingTax({ ...data }))
        .unwrap()
        .then((data) => {
          if (data) {
            const reqSearch = encodeURIComponent(JSON.stringify(search));
            dispatch(
              getWithHoldingTax({
                id,
                page,
                pageSize,
                sort,
                search: reqSearch,
              }),
            );
            formCreate.resetFields();
            handleClear();
            setModalCreate(false);
          }
        })
        .catch((error) => {
          formCreate.resetFields();
          handleClear();
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
    } else {
      //inactive wapu
      dispatch(getWithHoldingTaxFirstIndex(id))
        .unwrap()
        .then((data) => {
          const dataSend = {
            id: data?.result[0]?.id,
            endDate: moment(e.endDate).format("DD MMM YYYY"),
            remark: e.remark,
          };

          setModalInactive(false);
          dispatch(inActiveWitholdingTax({ ...dataSend }))
            .unwrap()
            .then(() => {
              handleClear();
              formCreate.resetFields();
              setModalInactive(false);
              const reqSearch = encodeURIComponent(JSON.stringify(search));
              dispatch(
                getWithHoldingTax({
                  id,
                  page,
                  pageSize,
                  sort,
                  search: reqSearch,
                }),
              );
              // dispatch(getWithHoldingTax({ id, page, pageSize }));
            })
            .catch((error) => {
              handleClear();
              formCreate.resetFields();
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
        });
    }
  };

  const handleRetry = () => {
    onFinish(bodyError?.value);
    setModalError(false);
    setBodyError({});
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

  const handleCancel = () => {
    setModalInactive(false);
  };
  return (
    <Fragment>
      <Spin spinning={loading}>
        <div className="text-primary text-xs font-bold uppercase my-5">
          {"Witholding Tax Information"}
        </div>

        {access?.actionList?.some((action) => action.name === "Create") && (
          <div className="flex flex-row gap-2">
            <Switch checked={data_withHoldingTax?.status} onClick={onClick} />
            <DetailText>WAPU</DetailText>
          </div>
        )}

        <div>
          {data_withHoldingTax?.status ? (
            <DetailText className="text-xs text-slate-500">
              {`Account Flagged as Wapu from ${moment(
                data_withHoldingTax?.result?.slice(0)[0]?.startDate,
              ).format("DD MMM YYYY")}`}
            </DetailText>
          ) : null}
        </div>

        <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
          {"WAPU HISTORY LIST"}
        </div>

        <div>
          <WitholdingTaxTable
            data={data_withHoldingTax?.result}
            handleChange={handleChange}
            handleChangeSize={handleChangeSize}
            totalElement={totalElement}
            page={page}
            pageSize={pageSize}
            searchText={searchText}
            searchedColumn={searchedColumn}
            onSort={onSort}
            getColumnSearchProps={getColumnSearchProps}
            access={access}
            search={search}
            searchInput={searchInput}
            handleSearch={handleSearch}
          />
        </div>

        {/* modal create */}
        <ModalCustom
          isOpen={modalCreate}
          type={"confirmation"}
          header="SET WAPU FLAG"
          width={700}
          handleCancel={() => {
            setModalCreate(false);
            handleClear();
          }}
          footer={
            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                type="default"
                onClick={() => {
                  setModalCreate(false);
                  handleClear();
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form={"formCreateWitholdingTax"}
                type={"submit"}
                htmlType="submit"
                // onClick={() => {setBtnType(true)}}
              >
                Save
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id={"formCreateWitholdingTax"}
            layout={"vertical"}
            form={formCreate}
            onFinish={onFinish}
          >
            <WitholdingTaxSet />
          </Form>
        </ModalCustom>

        {/** Modal Inactive */}
        <ModalApproveOrReject
          handleCloseModal={handleCancel}
          onFinish={onFinish}
          header={"Inactive"}
          approveOrReject={"Inactive"}
          menu={"Withholding Tax"}
          named={startDate}
          isOpen={modalInactive}
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
                          new Error("End date must after Start date"),
                        ),
                },
                { message: requiredMessage("End Date"), required: true },
              ]}
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
            setModalInactive(false);
            formInactive.resetFields();
          }}
          message={`Are you sure you want to Inactive WAPU Flag`}
          width={1000}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => {
                  setModalInactive(false);
                  formInactive.resetFields();
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                border={false}
                form={"formInactiveTax"}
                htmlType={"submit"}
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id={"formInactiveTax"}
            layout={"vertical"}
            form={formInactive}
            onFinish={onFinish}
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
                  { message: requiredMessage("End Date"), required: true },
                ]}
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
              data_withHoldingTax?.status ? "Inactive" : "Updated"
            }. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </Fragment>
  );
};

export default WitholdingTax;
