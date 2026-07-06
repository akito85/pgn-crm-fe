import React, { useRef, useState } from "react";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import Highlighter from "react-highlight-words";
import { Tooltip } from "antd";
import { getColumnSearchProps } from "../../../../../../utils/getColumnSearchProps";
import { useSelector } from "react-redux";
import ModalFormEligibilityProduct from "./ModalFormEligibilityProduct";
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
  handleSearch,
  type,
  handleUpdate,
  handleDelete
) => {
  const result = [
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
      dataIndex: "productName",
      onFilter: (value, record) => onFilter("productName", value, record),
      sorter: (a, b) => sorter("productName", a, b),
      ...getColumnSearchProps(
        "productName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
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
      title: "START DATE",
      key: "startDate",
      width: 240,
      align: "center",
      dataIndex: "startDate",
      onFilter: (value, record) => onFilter("startDate", value, record),
      sorter: (a, b) => sorter("startDate", a, b),
      ...getColumnSearchProps(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "END DATE",
      key: "endDate",
      width: 240,
      align: "center",
      dataIndex: "endDate",
      onFilter: (value, record) => onFilter("endDate", value, record),
      sorter: (a, b) => sorter("endDate", a, b),
      ...getColumnSearchProps(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "DESCRIPTIONS",
      key: "description",
      width: 180,
      dataIndex: "description",
      onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      ...getColumnSearchProps(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "description") {
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
      title: "ACTION",
      key: "action",
      width: 120,
      align: "center",
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Edit">
              <span className="flex justify-center">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  onClick={() => handleUpdate(r)}
                />
              </span>
            </Tooltip>
            <Tooltip title="Delete">
              <span
                className={`flex justify-center${
                  r.typeData === "exist" ? " cursor-not-allowed" : ""
                }`}
              >
                <SVGIcon
                  name="IconDelete"
                  color={r.typeData !== "exist" ? "#D90000" : "#8D91A0"}
                  width={24}
                  className={r.typeData === "exist" ? "disabled" : undefined}
                  onClick={
                    r.typeData !== "exist" ? () => handleDelete(r) : undefined
                  }
                />
              </span>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  if (type === "preview" || type === "detail") {
    return result.filter((col) => col.title !== "ACTION");
  }

  return result;
};
const typeFormList = ["create", "update"];
const PDIEligibilityProductForm = ({
  type,
  data = [],
  updateData = () => {},
  productObj = {},
  prevPage,
  idParent,
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalForm, setModalForm] = useState(false);
  const [typeForm, setTypeForm] = useState(typeFormList[0]);
  const [dataEdit, setDataEdit] = useState({});

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  const {
    dataListProductType = [],
    dataListProductClass = [],
    dataListServiceType = [],
  } = useSelector((state) => state.product);

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
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const handleCreate = () => {
    setTypeForm(typeFormList[0]);
    setModalForm(true);
  };
  const handleUpdate = (record) => {
    setDataEdit(record);
    setTypeForm(typeFormList[1]);
    setModalForm(true);
  };
  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleCloseModal = () => {
    setModalForm(false);
    setDataEdit({});
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {type !== "detail" && type !== "preview" ? (
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
        idTable={`eligibility-product-table-${type}`}
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={data}
        totalData={data.length}
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
          handleSearch,
          type,
          handleUpdate,
          handleDelete
        )}
      />
      {modalForm ? (
        <ModalFormEligibilityProduct
          openModal={modalForm}
          closeModal={handleCloseModal}
          updateTable={updateData}
          dataObj={dataDetailProduct}
          typeForm={typeForm}
          existData={data.map((item) => item.productId)}
          dataFormObj={dataEdit}
          type={type}
          prevPage={prevPage}
          idParent={idParent}
        />
      ) : null}
    </div>
  );
};

export default PDIEligibilityProductForm;
