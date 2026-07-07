import React, { useEffect, useRef, useState } from "react";
import { Form, Select, Tooltip } from "antd";
import { useSelector } from "react-redux";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import {
  getAttributeTos,
  getListFromItemTos,
  getListUnitTOS,
  getTosList,
} from "../../../../../../redux/slices/product_promo/product";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import TableDetailTos from "./TableDetailTos";
// import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";

import SVGIcon from "../../../../../../assets/Icon/index";
import SelectComponent from "../../../../../../components/SelectComponent";
import { hasValue, renderColumn, requiredMessage } from "../../../../../../utils";
import SectionInfoProductDetail from "../../ProductDetail/SectionPricing/SectionInfoProductDetail";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import NxTable from "../../../../../../components/Nx/NxTable";

const onFilter = (dataIndex, value, record) => {
  const tempSearchText = value.toLowerCase();
  return record[dataIndex]?.toString()?.toLowerCase().includes(tempSearchText);
};

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    return obj[fieldSort]?.toString()?.toLowerCase();
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

const columns = ({
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  type,
  detail = () => {},
  update = () => {},
  deleteRow = () => {},
}) => {
  const result = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TERMS OF SERVICE",
      key: "tosName",
      width: 180,
      dataIndex: "tosName",
      onFilter: (value, record) => onFilter("tosName", value, record),
      sorter: (a, b) => sorter("tosName", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "tosName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "tosName",
          hasValue(search["tosName"]),
          searchText,
          text?.label,
          true,
          "input",
          search
        ),
    },
    {
      title: "DESCRIPTIONS",
      key: "description",
      width: 240,
      dataIndex: "description",
      onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input"
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "ACTION",
      key: "operation",
      width: 120,
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <div className="flex w-full justify-center my-3 gap-2">
            {type !== "preview" ? (
              <>
                <Tooltip title="Detail">
                  <span className="flex justify-center">
                    <SVGIcon
                      name="IconDetail"
                      width={24}
                      onClick={() => detail(record)}
                    />
                  </span>
                </Tooltip>
                <Tooltip title="Edit">
                  <span className="flex justify-center">
                    <SVGIcon
                      name="IconEdit"
                      width={24}
                      onClick={() => update(record)}
                    />
                  </span>
                </Tooltip>
                <Tooltip title="Delete">
                  <span
                    className={`flex justify-center${
                      record.typeData === "exist" ? " cursor-not-allowed" : ""
                    }`}
                  >
                    <SVGIcon
                      name="IconDelete"
                      color={
                        record.typeData !== "exist" ? "#D90000" : "#8D91A0"
                      }
                      width={24}
                      className={
                        record.typeData === "exist" ? "disabled" : undefined
                      }
                      onClick={
                        record.typeData !== "exist"
                          ? () => deleteRow(record)
                          : undefined
                      }
                    />
                  </span>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Detail">
                <span className="flex justify-center">
                  <SVGIcon
                    name="IconDetail"
                    width={24}
                    onClick={() => detail(record)}
                  />
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
  return result;
};
const typeFormList = ["create", "update"];
const PDITosForm = ({
  dataArrayFilter = [],
  type = "form",
  productObj = {},
  data = [],
  updateData = () => {},
  dispatch = () => {},
}) => {
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [dataTableDetail, setDataTableDetail] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [storedData, setStoredData] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [typeForm, setTypeForm] = useState(typeFormList[0]);
  const [selectedData, setSelectedData] = useState({});
  const [modalForm, setModalForm] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [description, setDescription] = useState(false);
  const [search, setSearch] = useState({})
  const {
    dataListProductType = [],
    dataListProductClass = [],
    dataListServiceType = [],
    dataListTos = [],
  } = useSelector((state) => state.product);
  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  useEffect(() => {
    if (type === "form") {
      dispatch(getTosList(dataArrayFilter));
      dispatch(getAttributeTos());
      dispatch(getListUnitTOS());
      dispatch(getListFromItemTos());
    }
  }, [type, dispatch, dataArrayFilter]);

  const tempProductType = (dataListProductType || []).filter(
    (item) => item.value === (productObj.productType || 0)
  );
  const tempProductClass = (dataListProductClass || []).filter(
    (item) => item.value === (productObj.productClass || 0)
  );
  const tempServiceType = (dataListServiceType || []).filter(
    (item) => item.value === (productObj.serviceType || 0)
  );
  const dataDetailProduct = {
    productName: productObj.productName,
    productType: tempProductType.length > 0 ? tempProductType[0].label : "",
    productClass: tempProductClass.length > 0 ? tempProductClass[0].label : "",
    serviceType: tempServiceType.length > 0 ? tempServiceType[0].label : "",
    startDate: productObj.startDate || "",
    endDate: productObj.endDate || "",
    productDescription: productObj.productDescription || "",
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    // const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    // if (searchedColumn !== tempSearchColumn) {
    //   setPage(1);
    // }
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      }
    });
    setSearchedColumn(dataIndex);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const handleCreate = () => {
    setTypeForm(typeFormList[0]);
    setModalForm(true);
  };
  const handleDetail = (record) => {
    setSelectedData(record);
    setDataTableDetail(record.productTosDetailDtos);
    if (type !== "preview") {
      setModalDetail(true);
    }
  };
  const handleUpdate = (record) => {
    setSelectedData(record);
    setTypeForm(typeFormList[1]);
    form.setFieldsValue({
      tos: record.tosName,
      description: record.description,
    });
    setDataTableDetail(
      (record.productTosDetailDtos || []).map((item) => ({
        ...item,
        typeData: record.typeData || undefined,
      }))
    );
    setModalForm(true);
  };
  const handleDelete = (record) => {
    updateData((prevState) =>
      prevState.filter((item) => item.key !== record.key)
    );
  };
  const handleCancelModalDetail = () => {
    setModalDetail(false);
    setSelectedData({});
    setDataTableDetail([]);
  };
  const handleCancelModalForm = () => {
    setStoredData(false);
    setModalForm(false);
    form.resetFields();
    setDescription("");
    setDataTableDetail([]);
    setSelectedData({});
  };
  const handleSaveModalTOSForm = (values) => {
    let obj = {
      tosName: values.tos,
      description: values.description,
      productTosDetailDtos: dataTableDetail,
    };
    if (typeForm === typeFormList[1]) {
      updateData((prevState) => {
        const index = prevState.findIndex(
          (detail) => detail.key === selectedData.key
        );
        let temp = [...prevState];
        temp[index] = { ...temp[index], ...obj };
        return temp;
      });
    } else {
      updateData((prevState) => [...prevState, obj]);
    }
    handleCancelModalForm();
  };
  const handleSelectTos = (e) => {
    const dataTemp = dataListTos.filter((item) => item.id === e.value);
    if (dataTemp.length > 0) {
      const temp = (dataTemp[0]?.rtosAttributes || []).map((item) => {
        return {
          key: item.id,
          attribute: {
            value: item.attributeId,
            label: item.attributeName,
          },
        };
      });
      setDataTableDetail(temp);
    }
    return e;
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {type !== "preview" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={handleCreate}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
      <NxTable
        idTable={"tableTOS"}
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={data}
        totalData={data.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 300, x: 700 }}
        onChange={handleChangeSize}
        columns={columns({
          search,
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          type,
          detail: handleDetail,
          update: handleUpdate,
          deleteRow: handleDelete,
        })}
      />

      {type === "preview" && selectedData ? (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex align-middle gap-2">
            <p className="text-[15px] font-semibold text-text-color-semibold">
              Name:
            </p>
            <p className="text-[15px] font-semibold text-primary">
              {selectedData?.tosName?.label || "-"}
            </p>
          </div>
          <TableDetailTos
            key={"preview"}
            dataTable={dataTableDetail}
            updateTable={setDataTableDetail}
            type={"preview"}
          />
        </div>
      ) : null}

      {/* Modal Detail TOS */}
      <ModalCustom
        isOpen={modalDetail}
        handleCancel={handleCancelModalDetail}
        type="detail"
        header="TERM OF SERVICE DETAIL"
        width={800}
        footer={
          <ButtonComponent type={"default"} onClick={handleCancelModalDetail}>
            Back
          </ButtonComponent>
        }
      >
        <div className="flex flex-col gap-4 w-full">
          <SectionInfoProductDetail dataDetailProduct={dataDetailProduct} />
          <TableDetailTos
            key={"detail"}
            dataTable={dataTableDetail}
            updateTable={setDataTableDetail}
            type={"preview"}
          />
        </div>
      </ModalCustom>

      {/* Modal Create Update Detail TOS */}
      <ModalCustom
        isOpen={modalForm}
        handleCancel={handleCancelModalForm}
        header={`${
          typeForm === typeFormList[1] ? "UPDATE" : "CREATE"
        } TERM OF SERVICE`}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalForm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form="detailTosForm"
              type="submit"
              htmlType="submit"
              disabled={
                dataTableDetail.length === 0 ||
                dataTableDetail.some(
                  (item) => !item.value && item.value !== 0
                ) ||
                storedData
              }
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id="detailTosForm"
          form={form}
          layout="vertical"
          onFinish={handleSaveModalTOSForm}
        >
          <div className="flex flex-col w-full gap-4">
            <Form.Item
              name={"tos"}
              rules={[
                { message: requiredMessage("Term Of Service"), required: true },
              ]}
              className={"w-full no-margin-form"}
              getValueFromEvent={handleSelectTos}
              label={"Term Of Service"}
              required
            >
              {dataListTos && dataListTos.length > 0 && (
                <SelectComponent labelInValue>
                  {dataListTos.map((tos) => (
                    <Select.Option key={tos.id} value={tos.id}>
                      {tos.name}
                    </Select.Option>
                  ))}
                </SelectComponent>
              )}
            </Form.Item>
            <Form.Item
              name={"description"}
              className={"w-full no-margin-form"}
              getValueFromEvent={(e) => {
                const value = e.target.value;
                setDescription(value);
                return value;
              }}
              label={"Description"}
            >
              <InputComponent type="textarea" value={description} />
            </Form.Item>
            <TableDetailTos
              key={"form"}
              dataTable={dataTableDetail}
              updateTable={setDataTableDetail}
              type={type}
              storedData={storedData}
              setStoredData={setStoredData}
            />
          </div>
        </Form>
      </ModalCustom>
    </div>
  );
};

export default PDITosForm;
