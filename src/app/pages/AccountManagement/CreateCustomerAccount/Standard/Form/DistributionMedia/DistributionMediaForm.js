import React, { useState, useRef, useCallback, useEffect } from "react";
import { Spin, Select, Form, Tooltip, DatePicker, Input } from "antd";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import moment from "moment";
import { FilterOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import { dateFormatting } from "../../../../../../../utils";
import SVGIcon from "../../../../../../../assets/Icon/index";
import TablePagination from "../../../../../../../components/TablePagination";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../../components/InputComponent";
import DateComponent from "../../../../../../../components/DateComponent";
import { getProductName } from "../../../../../../../redux/slices/account_management/Account/accountSlice";
import ModalDetailDM from "./ModalDetailDM";

const DistributionMediaForm = ({
  data = [],
  setData,
  dispatch = () => {},
  type,
}) => {
  // Selector
  const { loading, data_productName } = useSelector((state) => state.account);

  // Declaration
  const searchInput = useRef(null);
  const [formDM] = Form.useForm();

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [totalElements, setTotalElement] = useState(0);
  const [dataSourceDetail, setDataSourceDetail] = useState([]);

  const [description, setDescription] = useState("");
  const [remark, setRemark] = useState("");
  const [typeModal, setTypeModal] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [keyTable, setKeyTable] = useState();
  const [PDselect, setPDselect] = useState(0);
  const [dataDetail, setDataDetail] = useState({});

  // Use Effect
  useEffect(() => {
    if (dataSourceDetail && dataSourceDetail?.length > 0) {
      setTotalElement(dataSourceDetail?.length);
    }
  }, [dataSourceDetail?.length]);

  useEffect(() => {
    dispatch(getProductName());
  }, []);

  useEffect(() => {
    if (PDselect !== 0) {
      const findPriceCode = data_productName
        ?.filter((a) => a.productId === PDselect)
        ?.find((b) => b.pricing)?.pricing;

      const findDesc = data_productName
        ?.filter((a) => a.productId === PDselect)
        ?.find((b) => b.description)?.description;

      const findProductDetail = data_productName
        ?.filter((a) => a.productId === PDselect)
        ?.find((b) => b.productDetail)?.productDetail;

      formDM.setFieldsValue({
        priceCode: findPriceCode,
        productDescription: findDesc,
      });

      setDataSourceDetail(findProductDetail);
    }
  }, [PDselect]);

  // useEffect(() => {
  //   if (typeModal === "update") {
  //     const findPriceCode = data_productName
  //       ?.filter((a) => a.productVersionId === PDselect)
  //       ?.find((b) => b.pricing)?.pricing;

  //     const findDesc = data_productName
  //       ?.filter((a) => a.productVersionId === PDselect)
  //       ?.find((b) => b.description)?.description;

  //     const findProductDetail = data_productName
  //       ?.filter((a) => a.productVersionId === PDselect)
  //       ?.find((b) => b.productDetail)?.productDetail;

  //     setPDselect(dataUpdate.productVersionId);
  //     formDM.setFieldsValue({
  //       productVersionId: dataUpdate.productVersionId,
  //       priceCode: findPriceCode,
  //       productDescription: findDesc,
  //       startDate: moment(dataUpdate.startDate).clone(),
  //       description: dataUpdate.description,
  //     });
  //     setDataSourceDetail(findProductDetail);
  //   }
  // }, [typeModal, dataUpdate]);

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
    onFilter: (value, record) => {
      let result =
        type === "date"
          ? moment(record[dataIndex])
              .format(dateFormatting.dateFormal)
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : record[dataIndex]
              ?.toString()
              .toLowerCase()
              .includes(value.toLowerCase());
      return result;
    },
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

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const columnsDetail = [
    {
      title: "NO",
      width: 50,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },

    {
      sorter: true,
      title: "NAME",
      dataIndex: "name",
      align: "left",
      ...getColumnSearchProps("name"),
    },
    {
      title: "VALUE",
      sorter: true,
      align: "right",
      dataIndex: "value",
      ...getColumnSearchProps("value"),
      render: (text, record) => {
        const currency = record.currencyIds || 244;
        const tempValue = text ? (text + "").split(".") : [];
        const thousandSeparator = currency === 244 ? "." : ",";
        const decimalSeparator = currency === 244 ? "," : ".";
        const descimal = tempValue[1]
          ? `${decimalSeparator}${tempValue[1]}`
          : `${decimalSeparator}00`;
        const value =
          tempValue.length > 0
            ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
              descimal
            : "";
        if (searchedColumn === "value") {
          const highlight = (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={value || ""}
            />
          );
          if (value) {
            return value;
          }
          return highlight;
        } else {
          if (value) {
            return value;
          }
          return "";
        }
      },
    },
    {
      sorter: true,
      title: "UNIT",
      dataIndex: "unit",
      align: "center",
      ...getColumnSearchProps("unit"),
    },
  ];

  const columns = [
    {
      title: "NO",
      width: 50,
      dataIndex: "no",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      sorter: true,
      title: "MEDIA",
      dataIndex: "productId",
      // align: "center",
      ...getColumnSearchProps("productId"),
      render: (productId) => (
        <span>
          {data_productName &&
            data_productName
              ?.filter((a) => a.productId === productId)
              ?.find((b) => b.productName)?.productName}
        </span>
      ),
    },
    {
      sorter: true,
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => moment(startDate).format(dateFormatting.date),
    },
    {
      sorter: true,
      title: "REMARK",
      dataIndex: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (building) => (
        <Tooltip placement="topLeft" title={building}>
          <p>{building}</p>
        </Tooltip>
      ),
      ...getColumnSearchProps("remark"),
    },
    {
      title: "ACTION",
      align: "center",
      width: 150,
      dataIndex: "key",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-4">
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  onClick={() => {
                    handleUpdate(r);
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => {
                    handleDetail(r);
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1">
                <SVGIcon
                  name="IconDelete"
                  width={24}
                  onClick={() => {
                    handleDelete(r.key);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
  };

  const filterDataByPage = () => {
    let result = [...data];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toString()
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  const filterDataDetailByPage = () => {
    let result = [...(dataSourceDetail || [])];
    if (searchedColumn) {
      result = result.filter((item) => {
        return item[searchedColumn]
          ?.toString()
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
      });
    }
    const handleDataSort = (obj) => {
      switch (fieldSort) {
        case "startDate":
        case "endDate":
          const date = obj[fieldSort]
            ? moment(obj[fieldSort]).format("DD MMM YYYY")
            : "";
          return date.toString().toLowerCase();
        default:
          return obj[fieldSort].toString().toLowerCase();
      }
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };

  // handle Product Version
  const handleProductVersion = (value) => {
    setPDselect(value);
    return value;
  };

  // Handle Modal Detail
  const handleDetail = (r) => {
    const data = data_productName?.filter((a) => a.productId === r.productId);
    const dataAdditional = {
      startDate: r.startDate,
      remark: r.description,
    };
    const mergeData = {
      ...data[0],
      ...dataAdditional,
    };
    setDataDetail(mergeData);
    setModalDetail(true);
  };

  // Handle Update
  const handleUpdate = (r) => {
    setDataUpdate(r);
    setKeyTable(r?.key);
    setTypeModal("update");
    setOpenModal(true);
    setPDselect(r.productId);
    formDM.setFieldsValue({
      productId: r.productId,
      startDate: moment(r.startDate).clone(),
      description: r.description,
    });
  };

  // Handle Add Value to Array
  const handleAdd = (formValue) => {
    const newData = [...data];
    if (typeModal === "create") {
      const dataValue = {
        productId: formValue.productId,
        startDate: moment(formValue.startDate).format(dateFormatting.date),
        description: formValue.description,
        key: data.length + 1,
      };
      newData.push(dataValue);
      setData(newData);
    } else {
      const dataValue = {
        productId: formValue.productId,
        startDate: moment(formValue.startDate).format(dateFormatting.date),
        description: formValue.description,
        key: keyTable,
      };
      const findIndex = data.findIndex((item) => item.key === keyTable);
      const item = newData[findIndex];
      const updateRow = { ...item, ...dataValue };
      newData.splice(findIndex, 1, updateRow);
      setData(newData);
    }
    setOpenModal(false);
    formDM.resetFields();
    setDataSourceDetail([]);
    setPDselect(0);
    setTypeModal("");
  };

  // Delete Row
  const handleDelete = useCallback(
    (r) => {
      setData((prevState) =>
        prevState
          .filter((e) => e.key !== r)
          .map((e, i) => ({ ...e, key: i + 1 })),
      );
    },
    [data],
  );

  // Data Product
  const dataProductName =
    data?.length > 0 ? data?.map((item) => item.productId) : [];

  // Filter Product
  const filterProductName = () => {
    if (dataProductName?.length > 0) {
      return typeModal === "create"
        ? data_productName?.filter(
            (a) => !dataProductName?.includes(a.productId),
          )
        : [
            ...data_productName?.filter(
              (a) => !dataProductName?.includes(a.productId),
            ),
            ...data_productName.filter(
              (data) => data?.productId === dataUpdate?.productId,
            ),
          ];
    } else {
      return data_productName;
    }
  };

  return (
    <div>
      {type !== "confirmation" ? (
        <>
          <span className="text-primary uppercase font-bold mt-[60px]">
            DISTRIBUTION MEDIA INFORMATION
          </span>

          <div className="w-full flex justify-end my-[30px]">
            <ButtonComponent
              type={"submit"}
              onClick={() => {
                setOpenModal(true);
                setTypeModal("create");
                setDataUpdate([]);
              }}
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
            >
              Create
            </ButtonComponent>
          </div>

          <div className="w-full">
            <TablePagination
              dataSource={filterDataByPage()}
              totalData={totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              columns={columns}
              onSort={onSort}
            />
          </div>

          {/* Modal Value*/}
          <ModalCustom
            isOpen={openModal}
            type="confirmation"
            header="CREATE DISTRIBUTION MEDIA"
            width={1000}
            handleOk={() => handleAdd()}
            handleCancel={() => {
              formDM.resetFields();
              setDataSourceDetail([]);
              setPDselect(0);
              setOpenModal(false);
            }}
            footer={
              <div className={"w-full flex justify-end gap-5"}>
                <Form.Item>
                  <ButtonComponent
                    type="default"
                    onClick={() => {
                      formDM.resetFields();
                      setDataSourceDetail([]);
                      setPDselect(0);
                      setOpenModal(false);
                      setTypeModal("");
                    }}
                  >
                    Back
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    form={"formDM"}
                  >
                    Save
                  </ButtonComponent>
                </Form.Item>
              </div>
            }
          >
            <Form
              layout="vertical"
              form={formDM}
              onFinish={handleAdd}
              id={"formDM"}
            >
              <span className="text-primary uppercase font-bold">
                PRODUCT INFORMATION
              </span>

              <div className="w-full grid grid-cols-2 gap-2 pt-[30px]">
                <Form.Item
                  label="Product Name"
                  name="productId"
                  getValueFromEvent={handleProductVersion}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Product Name!",
                    },
                  ]}
                >
                  <SelectComponent>
                    {data_productName &&
                      filterProductName()?.map((data) => (
                        <Select.Option
                          key={data.productId}
                          value={data.productId}
                        >
                          {data.productName}
                        </Select.Option>
                      ))}
                  </SelectComponent>
                </Form.Item>
                <Form.Item label="Price Code" name="priceCode">
                  <InputComponent disabled />
                </Form.Item>
                <div className="col-span-2">
                  <Form.Item
                    label={"Product Description"}
                    name={"productDescription"}
                    className={"w-full"}
                  >
                    <InputComponent
                      type="textarea"
                      disabled
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>

              <span className="text-primary uppercase font-bold">
                PRODUCT DETAIL INFORMATION
              </span>

              <div className="w-full py-[30px]">
                <TablePagination
                  loading={loading}
                  dataSource={filterDataDetailByPage()}
                  totalData={totalElements}
                  current={page}
                  pageSize={pageSize}
                  onChange={handleChange}
                  columns={columnsDetail}
                  onSort={onSort}
                />
              </div>

              <span className="text-primary uppercase font-bold">
                DISTRIBUTION MEDIA INFORMATION
              </span>

              <div className="w-full grid grid-cols-1 gap-2 pt-[30px]">
                <Form.Item
                  label={"Start Date"}
                  name={"startDate"}
                  rules={[
                    {
                      required: true,
                      message: "Please input your Start Date!",
                    },
                  ]}
                >
                  <DateComponent />
                </Form.Item>

                <Form.Item
                  label={"Remark"}
                  name={"description"}
                  className={"w-full"}
                >
                  <InputComponent
                    type="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Form.Item>
              </div>
            </Form>
          </ModalCustom>

          {/* Modal Detail Distribution Media */}
          <ModalDetailDM
            openModal={modalDetail}
            closeModal={() => {
              setDataDetail({});
              setModalDetail(false);
            }}
            data={dataDetail}
            loading={loading}
            dataSource={filterDataDetailByPage()}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columnsDetail}
            onSort={onSort}
          />
        </>
      ) : (
        <>
          <div className="w-full">
            <TablePagination
              dataSource={filterDataByPage()}
              totalData={data?.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              columns={columns.filter((a) => a.title !== "ACTION")}
              onSort={onSort}
            />
          </div>

          {/* Modal Detail Distribution Media */}
          <ModalDetailDM
            openModal={modalDetail}
            closeModal={() => {
              setDataDetail({});
              setModalDetail(false);
            }}
            data={dataDetail}
            loading={loading}
            dataSource={filterDataDetailByPage()}
            totalData={totalElements}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            columns={columnsDetail}
            onSort={onSort}
          />
        </>
      )}
    </div>
  );
};

export default DistributionMediaForm;
