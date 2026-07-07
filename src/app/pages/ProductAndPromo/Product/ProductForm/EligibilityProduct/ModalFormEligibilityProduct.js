import React, { useEffect, useRef, useState } from "react";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Form, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductActivePaginate } from "../../../../../../redux/slices/product_promo/product";
import SectionInfoProductDetail from "../../ProductDetail/SectionPricing/SectionInfoProductDetail";
import DateComponent from "../../../../../../components/DateComponent";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import InputComponent from "../../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../../utils";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import Highlighter from "react-highlight-words";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import NxTable from "../../../../../../components/Nx/NxTable";

const onFilter = (dataIndex, value, record) => {
  const tempSearchText = value.toLowerCase();
  return (record[dataIndex]?.toString() || "")
    ?.toLowerCase()
    .includes(tempSearchText);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return (obj[fieldSort]?.toString() || "")?.toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const columns = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch
) => {
  return [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRODUCT NAME",
      key: "productName",
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      dataIndex: "productName",
      onFilter: (value, record) => onFilter("productName", value, record),
      sorter: (a, b) => sorter("productName", a, b),
      ...getColumnSearchPropsPaging(
        "productName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "productName") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "PRODUCT TYPE",
      key: "productTypeName",
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      dataIndex: "productTypeName",
      onFilter: (value, record) => onFilter("productTypeName", value, record),
      sorter: (a, b) => sorter("productTypeName", a, b),
      ...getColumnSearchPropsPaging(
        "productTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "productTypeName") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "PRODUCT CLASS",
      key: "productClassName",
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      dataIndex: "productClassName",
      onFilter: (value, record) => onFilter("productClassName", value, record),
      sorter: (a, b) => sorter("productClassName", a, b),
      ...getColumnSearchPropsPaging(
        "productClassName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "productClassName") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "SERVICE TYPE",
      key: "serviceTypeName",
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      dataIndex: "serviceTypeName",
      onFilter: (value, record) => onFilter("serviceTypeName", value, record),
      sorter: (a, b) => sorter("serviceTypeName", a, b),
      ...getColumnSearchPropsPaging(
        "serviceTypeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => {
        if (searchedColumn === "serviceTypeName") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "START DATE",
      width: 240,
      dataIndex: "startDate",
      key: "startDate",
      onFilter: (value, record) => onFilter("startDate", value, record),
      sorter: (a, b) => sorter("startDate", a, b),
      ...getColumnSearchPropsPaging(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "END DATE",
      width: 240,
      dataIndex: "endDate",
      key: "endDate",
      onFilter: (value, record) => onFilter("endDate", value, record),
      sorter: (a, b) => sorter("endDate", a, b),
      ...getColumnSearchPropsPaging(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
  ];
};

const ModalFormEligibilityProduct = ({
  typeForm = "create",
  dataObj = {},
  dataFormObj = {},
  updateTable = () => {},
  existData = [],
  openModal = false,
  closeModal = () => {},
  type,
  prevPage,
  idParent,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedKeyDataTable, setSelecetedKeyDataTable] = useState([]);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const { dataActiveProduct = [], loadingProduct } = useSelector(
    (state) => state.product
  );

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  useEffect(() => {
    if (typeForm === "update" && dataFormObj && dataFormObj.productName) {
      form.setFieldsValue({
        startDate: dataFormObj.startDate
          ? moment(dataFormObj.startDate, "DD MMM YYYY")
          : undefined,
        endDate: dataFormObj.endDate
          ? moment(dataFormObj.endDate, "DD MMM YYYY")
          : undefined,
        description: dataFormObj.description,
      });
    }
  }, [typeForm, form, dataFormObj]);

  useEffect(() => {
    dispatch(
      getAllProductActivePaginate({
        id:
          type !== "create" || prevPage !== "table-product"
            ? idParent
            : undefined,
      })
    );
  }, [dispatch, type, prevPage, idParent]);

  useEffect(() => {
    if (openModal && dataActiveProduct) {
      setDataTable(
        (dataActiveProduct || []).map((item) => ({
          ...item,
          startDate: item.startDate
            ? moment(item.startDate).format("DD MMM YYYY")
            : "",
          endDate: item.endDate
            ? moment(item.endDate).format("DD MMM YYYY")
            : "",
          key: item.id,
        }))
      );
    }
  }, [openModal, dataActiveProduct]);

  const handleCancelModalForm = () => {
    setDataTable([]);
    setPage(1);
    setPageSize(10);
    setSearchedColumn("");
    setSearchText("");
    setStartDate(undefined);
    closeModal();
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleStartDate = (value) => {
    setStartDate(value);
    return value;
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return typeForm === "create"
        ? moment(startDate) >= current
        : moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleSaveModal = (data) => {
    console.log(data);
    const obj = {
      startDate: data.startDate
        ? moment(data.startDate).format("DD MMM YYYY")
        : "",
      endDate: data.endDate ? moment(data.endDate).format("DD MMM YYYY") : "",
      description: data.description,
    };
    let fixData = [];
    if (typeForm === "create") {
      const filterSelected = dataTable.filter((item) =>
        selectedKeyDataTable.includes(item.id)
      );
      fixData = filterSelected.map((item) => ({
        productId: item.id,
        productName: item.productName,
        productIdGenerate: item.productIdGenerate,
        ...obj,
      }));
      updateTable((prevState) => [...prevState, ...fixData]);
    } else {
      updateTable((prevState) => {
        const tempData = {
          productId: dataFormObj.productId,
          productName: dataFormObj.productName,
          productIdGenerate: dataFormObj.productIdGenerate,
          ...obj,
        };
        const index = prevState.findIndex(
          (detail) => detail.productId === dataFormObj.productId
        );
        let temp = [...prevState];
        temp[index] = {
          ...temp[index],
          ...tempData,
        };
        return temp;
      });
    }
    handleCancelModalForm();
  };

  const rowSelection = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelecetedKeyDataTable(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: existData.includes(record.id),
      // Column configuration not to be checked
      name: record.id,
    }),
  };

  return (
    <ModalCustom
      isOpen={openModal}
      handleCancel={handleCancelModalForm}
      header={`${
        typeForm === "update" ? "UPDATE" : "CREATE"
      } ELIGIBILITY PRODUCT`}
      width={1000}
      type={"confirmation"}
      footer={
        <div className="w-full flex justify-end gap-5 p-4">
          <ButtonComponent onClick={handleCancelModalForm} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent
            form="eligibilityProductForm"
            type="submit"
            htmlType="submit"
            disabled={
              typeForm === "create" && selectedKeyDataTable.length === 0
            }
          >
            Save
          </ButtonComponent>
        </div>
      }
    >
      <Spin spinning={loadingProduct}>
        <div className="flex flex-col gap-4">
          <SectionInfoProductDetail dataDetailProduct={dataObj} />
          {typeForm === "create" ? (
            <NxTable
              idTable={`eligibility-product-table-${typeForm}`}
              userId={dataUser?.data?.username}
              showAdvanceSearch={false}
              showSearchBar={false}
              usePagination={false}
              type="FE"
              dataSource={dataTable}
              totalData={dataTable.length}
              current={page}
              pageSize={pageSize}
              tableScrolled={{ y: 300, x: 1500 }}
              onChange={handleChangeSize}
              columns={columns(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              rowSelection={rowSelection}
            />
          ) : (
            <CardComponent cols={4}>
              <DetailText label={"Product ID"}>
                {dataFormObj.productIdGenerate}
              </DetailText>
              <DetailText label={"Product Name"}>
                {dataFormObj.productName}
              </DetailText>
            </CardComponent>
          )}
          <Form
            id="eligibilityProductForm"
            form={form}
            layout="vertical"
            onFinish={handleSaveModal}
          >
            <div className="grid grid-cols-4 gap-4">
              <Form.Item
                name={"startDate"}
                rules={[
                  { message: requiredMessage("Start Date"), required: true },
                ]}
                className="no-margin-form w-full"
                getValueFromEvent={handleStartDate}
                label="Start Date"
                required
              >
                <DateComponent />
              </Form.Item>
              <Form.Item
                name={"endDate"}
                className="no-margin-form w-full"
                rules={[
                  {
                    validator: (_, value) =>
                      (value &&
                        ((typeForm === "create" &&
                          moment(startDate) < moment(value)) ||
                          (typeForm === "update" &&
                            moment(startDate) <= moment(value)))) ||
                      !value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("End date must before Start date")
                          ),
                  },
                ]}
                label="End Date"
              >
                <DateComponent
                  dateDisable={handleDisableEndDate}
                  disabled={startDate === null}
                />
              </Form.Item>
              <div className="col-span-4">
                <Form.Item
                  name={"description"}
                  className="w-full"
                  label={"Description"}
                >
                  <InputComponent
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </Spin>
    </ModalCustom>
  );
};

export default ModalFormEligibilityProduct;
