import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { dateFormatting } from "../../../../../../../utils";
import { Form, Select, Input, Button, DatePicker, Tooltip } from "antd";
import SelectComponent from "../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import {
  getAllAccountPaginate,
  getTaxIdentifierType,
} from "../../../../../../../redux/slices/account_management/Account/accountSlice";
import DateComponent from "../../../../../../../components/DateComponent";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../../../../components/TablePagination";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import { onInputUpperCase } from "../../../../Utils";

const TaxIdentifierForm = ({
  dispatch = () => {},
  handleTIObj = () => {},
  tiObj = {},
  dataAddress,
  form,
}) => {
  // Selector
  const { loading, data_taxIdentifierType, data_account } = useSelector(
    (state) => state.account,
  );

  // Declaration
  const searchInput = useRef(null);
  const dataSource = data_account?.result;

  // State
  const [descriptionTI, setDescriptionTI] = useState("");
  const [modalChoose, setModalChoose] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const [dataAccount, setDataAccount] = useState();
  const [accountNumber, setAccountNumber] = useState();
  // Use Effect
  useEffect(() => {
    dispatch(getTaxIdentifierType());
  }, []);

  useEffect(() => {
    form.resetFields(["taxAddress"]);
  }, [dataAddress]);

  useEffect(() => {
    if (dataAccount !== 0) {
      const findCustomerName = dataSource
        ?.filter((a) => a.accountId === dataAccount)
        ?.find((b) => b.customerName)?.customerName;

      const findAccountName = dataSource
        ?.filter((a) => a.accountId === dataAccount)
        ?.find((b) => b.accountName)?.accountName;

      const findTaxType = dataSource
        ?.filter((a) => a.accountId === dataAccount)
        ?.find((b) => b.taxIdentifierTypeValue)?.taxIdentifierTypeValue;

      const findTaxNumber = dataSource
        ?.filter((a) => a.accountId === dataAccount)
        ?.find((b) => b.taxIdentifierNumber)?.taxIdentifierNumber;

      const findTaxName = dataSource
        ?.filter((a) => a.accountId === dataAccount)
        ?.find((b) => b.taxIdentifierName)?.taxIdentifierName;

      const findTaxAddress = dataSource
        ?.filter((a) => a.accountId === dataAccount)
        ?.find((b) => b.taxIdentifierAddressValue)?.taxIdentifierAddressValue;

      setAccountNumber(
        dataSource
          ?.filter((a) => a.accountId === dataAccount)
          ?.find((b) => b.accountName)?.accountNumber,
      );

      form.setFieldsValue({
        relatedAccountId: dataSource
          ?.filter((a) => a.accountId === dataAccount)
          ?.find((b) => b.accountName)?.accountNumber,
        customerNameTI: findCustomerName,
        accountNameTI: findAccountName,
        ratit: findTaxType,
        ratin: findTaxNumber,
        ratin2: findTaxName,
        ratia: findTaxAddress,
      });
      handleTIObj(dataAccount, "accountId");
    }
  }, [dataAccount]);

  const handleChangesReset = (e) => {
    if (e === "" || e === undefined) {
      setDataAccount();
      setAccountNumber("");
      handleTIObj(e, "accountId");
      form.resetFields([
        "relatedAccountId",
        "customerNameTI",
        "accountNameTI",
        "ratit",
        "ratin",
        "ratin2",
        "ratia",
        "startDateTI",
        "descriptionTI",
      ]);
    }
  };

  // Use Effect
  useEffect(() => {
    dispatch(getAllAccountPaginate({ search, sort, page, pageSize }));
  }, [search, sort, page, pageSize]);

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
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
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
    setSearch(
      selectedKeys.length === 0 ? "" : `${dataIndex}~${selectedKeys[0]}`,
    );
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "TAX IDENTIFIER TYPE",
      dataIndex: "taxIdentifierTypeValue",
      sorter: true,
      ...getColumnSearchProps("taxIdentifierTypeValue"),
    },
    {
      title: "TAX IDENTIFIER NUMBER",
      dataIndex: "taxIdentifierNumber",
      sorter: true,
      ...getColumnSearchProps("taxIdentifierNumber"),
    },
    {
      title: "TAX IDENTIFIER NAME",
      dataIndex: "taxIdentifierName",
      sorter: true,
      ...getColumnSearchProps("taxIdentifierName"),
    },
    {
      title: "TAX IDENTIFIER ADDRESS",
      dataIndex: "taxIdentifierAddressValue",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps("taxIdentifierAddressValue"),
      render: (taxIdentifierAddressValue) => (
        <Tooltip placement="topLeft" title={taxIdentifierAddressValue}>
          {taxIdentifierAddressValue}
        </Tooltip>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      dataIndex: "accountId",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center gap-2">
            <Tooltip title="Choose">
              <PlusCircleOutlined
                onClick={() => handleChooseAccount(v)}
                style={{
                  color: "#0075BF",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // Handle Choose Account
  const handleChooseAccount = (id) => {
    setDataAccount(id);
    setModalChoose(false);
  };

  const validateInputNumber = (rule, value, callback) => {
    if (tiObj.taxIdentifierType === 922) {
      if (value && value.toString().length !== 16) {
        callback("Input number must be 16 digits!");
      } else {
        callback();
      }
    }
    if (tiObj.taxIdentifierType === 921) {
      if (value && value.toString().length !== 16) {
        callback("Input number must be 16 digits!");
      } else {
        callback();
      }
    } else {
      callback();
    }
  };

  return (
    <div>
      <span className="text-primary uppercase font-bold">
        TAX IDENTIFIER INFORMATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item
          label={"Tax Identifier Type"}
          name={"taxIdentifierType"}
          rules={[
            {
              required: true,
              message: "Please input your Tax Identifier Type!",
            },
          ]}
          getValueFromEvent={(e) =>
            handleTIObj(
              e,
              "taxIdentifierType",
              form.resetFields(["taxIdentifierName"]),
              form.resetFields(["taxIdentifierNumber"]),
              form.resetFields(["taxAddress"]),
            )
          }
        >
          <SelectComponent>
            {data_taxIdentifierType &&
              data_taxIdentifierType?.map((ta, index) => (
                <Select.Option value={ta.id} key={index}>
                  {ta.text}
                </Select.Option>
              ))}
          </SelectComponent>
        </Form.Item>
        <Form.Item
          label={"Tax Identifier Number"}
          name={"taxIdentifierNumber"}
          rules={[
            {
              required: true,
              message: "Please input your Tax Identifier Number!",
            },
            { validator: validateInputNumber },
          ]}
          getValueFromEvent={(e) => handleTIObj(e, "taxIdentifierNumber")}
        >
          <InputComponent
            maxLength={tiObj?.taxIdentifierType === 922 ? 16 : 16}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
            disabled={!tiObj?.taxIdentifierType ? true : false}
          />
        </Form.Item>
        <Form.Item
          label={"Tax Identifier Name"}
          name={"taxIdentifierName"}
          rules={[
            {
              required: true,
              message: "Please input your Tax Identifier Name!",
            },
          ]}
          getValueFromEvent={(e) => handleTIObj(e, "taxIdentifierName")}
        >
          <InputComponent
            disabled={!tiObj?.taxIdentifierType ? true : false}
            onInput={onInputUpperCase}
          />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Tax Identifier Address"}
            name={"taxAddress"}
            rules={[
              {
                required: true,
                message: "Please input your Tax Identifier Address!",
              },
            ]}
            getValueFromEvent={(e) => handleTIObj(e, "taxAddress")}
          >
            <SelectComponent
              disabled={!tiObj?.taxIdentifierType ? true : false}
            >
              {dataAddress &&
                dataAddress?.map((data) => (
                  <Select.Option
                    key={data.addressId === null ? data.tempId : data.addressId}
                    value={
                      data.addressId === null ? data.tempId : data.addressId
                    }
                  >
                    {data.fullAddress}
                  </Select.Option>
                ))}
            </SelectComponent>
          </Form.Item>
        </div>
      </div>

      <span className="text-primary uppercase font-bold">
        TAX IDENTIFIER RELATION
      </span>

      <div className="w-full grid grid-cols-3 gap-2 pt-[30px]">
        <Form.Item label={"Account Number"} name={"relatedAccountId"}>
          <div className="flex flex-row">
            <Input.Group compact>
              <InputComponent
                // value={
                //   dataSource
                //     ?.filter((a) => a.accountId === dataAccount)
                //     ?.find((b) => b.accountName)?.accountName
                // }
                value={accountNumber}
                onChange={(e) => {
                  handleChangesReset(e.target.value);
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setModalChoose(true);
                }}
              >
                Choose
              </Button>
            </Input.Group>
          </div>
        </Form.Item>
        <Form.Item label={"Customer Name"} name={"customerNameTI"}>
          <InputComponent disabled />
        </Form.Item>
        <Form.Item label={"Account Name"} name={"accountNameTI"}>
          <InputComponent disabled />
        </Form.Item>
        <Form.Item label={"Related Account Tax Identifier Type"} name={"ratit"}>
          <InputComponent disabled />
        </Form.Item>
        <Form.Item
          label={"Related Account Tax Identifier Number"}
          name={"ratin"}
        >
          <InputComponent disabled />
        </Form.Item>
        <Form.Item
          label={"Related Account Tax Identifier Name"}
          name={"ratin2"}
        >
          <InputComponent disabled />
        </Form.Item>

        <div className="col-span-3">
          <Form.Item
            label={"Related Account Tax Identifier Address"}
            name={"ratia"}
          >
            <InputComponent disabled />
          </Form.Item>
        </div>
        <div className="col-span-3">
          <Form.Item
            label={"Start Date"}
            name={"startDateTI"}
            rules={[
              {
                required: dataAccount ? true : false,
                message: "Please input your Start Date!",
              },
            ]}
          >
            <DateComponent />
          </Form.Item>
        </div>
        <div className="col-span-3">
          <Form.Item
            label={"Description"}
            name={"descriptionTI"}
            className={"w-full"}
          >
            <InputComponent
              type="textarea"
              value={descriptionTI}
              onChange={(e) => setDescriptionTI(e.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      {/* Modal Choose Account Number */}
      <ModalCustom
        isOpen={modalChoose}
        type="confirmation"
        header={"Choose Account Number"}
        width={1000}
        handleCancel={() => setModalChoose(false)}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={() => setModalChoose(false)}
            >
              Cancel
            </ButtonComponent>
          </div>
        }
      >
        <p className="text-primary uppercase font-bold">ACCOUNT INFORMATION</p>

        <div className="w-full">
          <TablePagination
            dataSource={dataSource}
            columns={columns}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            totalData={data_account?.page?.totalElements}
            tableScrolled={{
              x: 2000,
              y: 300,
            }}
          />
        </div>
      </ModalCustom>
    </div>
  );
};

export default TaxIdentifierForm;
