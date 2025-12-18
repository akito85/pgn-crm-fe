import { FilterOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import TablePagination from "../../../../../../../components/TablePagination";
import { getRelatedObjectData } from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";

const ModalChooseRelated = ({
  isOpen = false,
  handleCancel = () => { },
  handleSelect = () => { },
  idAccount = null,
  relationshipType = null,
  relationshipCategory = null,
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState(null);

  const { data_relatedObjectList, loadingRelatedObject } = useSelector(
    (state) => state.relationship
  );

  // Normalize relationshipType for comparison (convert "Child Of" to "CHILD_OF")
  const normalizedRelationType = relationshipType
    ? relationshipType.trim().toUpperCase().replace(/\s+/g, "_")
    : null;

  // Determine if showing Customer or Account based on relationshipType
  // IMPORTANT: BRANCH_OF, HEAD_QUARTER_OF, COMPANY_GROUP = ACCOUNT
  //            CHILD_OF, PARENT_OF = CUSTOMER
  const isAccountType = normalizedRelationType && ["BRANCH_OF", "HEAD_QUARTER_OF", "COMPANY_GROUP"].includes(normalizedRelationType);
  const isCustomerType = normalizedRelationType && ["CHILD_OF", "PARENT_OF"].includes(normalizedRelationType);

  // Debug logging
  useEffect(() => {
    console.log("DEBUG - ModalChooseRelated Props:", {
      relationshipType,
      normalizedRelationType,
      isCustomerType,
      isAccountType
    });
  }, [relationshipType, normalizedRelationType, isCustomerType, isAccountType]);

  useEffect(() => {
    if (isOpen && idAccount && relationshipType && relationshipCategory) {
      dispatch(getRelatedObjectData({
        idAccount,
        page,
        size: pageSize,
        relationshipType,
        relationshipCategory
      }));
    }
  }, [dispatch, isOpen, idAccount, page, pageSize, relationshipType, relationshipCategory]);

  // Robust extraction of dataSource and totalData
  let dataSource = [];
  let totalData = 0;

  if (data_relatedObjectList) {
    if (Array.isArray(data_relatedObjectList)) {
      dataSource = data_relatedObjectList;
      totalData = data_relatedObjectList.length;
    } else if (Array.isArray(data_relatedObjectList?.result)) {
      dataSource = data_relatedObjectList.result;
      totalData = data_relatedObjectList.page?.totalElements || data_relatedObjectList.result.length;
    } else if (Array.isArray(data_relatedObjectList?.data?.result)) {
      dataSource = data_relatedObjectList.data.result;
      totalData = data_relatedObjectList.data.page?.totalElements || 0;
    } else if (Array.isArray(data_relatedObjectList?.data)) {
      // Fallback if data itself is the array
      dataSource = data_relatedObjectList.data;
      totalData = data_relatedObjectList.data.length;
    }
  }

  // Map data to include key
  if (dataSource.length > 0) {
    dataSource = dataSource.map(item => ({
      ...item,
      key: item.id || item.objectId
    }));
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder="Search"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <FilterOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Columns for Customer (BRANCH_OF, HEAD_QUARTER_OF, COMPANY_GROUP)
  const customerColumns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (
        <div className="py-2.5">{(page - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "partyType",
      sorter: true,
      ...getColumnSearchProps("partyType"),
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      sorter: true,
      ...getColumnSearchProps("customerIdentificationNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      sorter: true,
      ...getColumnSearchProps("customerType"),
      render: (text) => text || "-",
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tooltip title="Select">
            <span
              className="flex justify-center cursor-pointer"
              onClick={() => {
                handleSelect(record);
                handleCancel();
              }}
            >
              <SVGIcon
                name="IconActionCreate"
                color="#0075bf"
                width={24}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Columns for Account (CHILD_OF, PARENT_OF)
  const accountColumns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (
        <div className="py-2.5">{(page - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 170,
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "customerType",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("customerType"),
      render: (text) => text || "-",
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("customerIdentificationNumber"),
      render: (text) => text || "-",
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerTypeName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("customerTypeName"),
      render: (text) => text || "-",
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "CATEGORY",
      dataIndex: "accountCategory",
      width: 120,
      sorter: true,
      ...getColumnSearchProps("accountCategory"),
      render: (text) => text || "-",
    },
    {
      title: "SOR",
      dataIndex: "sor",
      width: 120,
      sorter: true,
      ...getColumnSearchProps("sor"),
      render: (text) => text || "-",
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("costCenter"),
      render: (text) => text || "-",
    },
    {
      title: "METER READING CODES",
      dataIndex: "meterReadingCodes",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("meterReadingCodes"),
      render: (text) => text || "-",
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("customerManagement"),
      render: (text) => text || "-",
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("classificationType"),
      render: (text) => text || "-",
    },
    {
      title: "SEGMENT",
      dataIndex: "segment",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("segment"),
      render: (text) => text || "-",
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 180,
      sorter: true,
      ...getColumnSearchProps("accountGroupType"),
      render: (text) => text || "-",
    },
    {
      title: "PREMISE ADDRESS",
      dataIndex: "premiseAddress",
      width: 250,
      sorter: true,
      ...getColumnSearchProps("premiseAddress"),
      render: (text) => text || "-",
    },
    {
      title: "SUBDISTRICT",
      dataIndex: "subdistrict",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("subdistrict"),
      render: (text) => text || "-",
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("district"),
      render: (text) => text || "-",
    },
    {
      title: "CITY",
      dataIndex: "city",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("city"),
      render: (text) => text || "-",
    },
    {
      title: "COUNTRY",
      dataIndex: "country",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("country"),
      render: (text) => text || "-",
    },
    {
      title: "LONGITUDE",
      dataIndex: "longitude",
      width: 120,
      sorter: true,
      ...getColumnSearchProps("longitude"),
      render: (text) => text || "-",
    },
    {
      title: "LATITUDE",
      dataIndex: "latitude",
      width: 120,
      sorter: true,
      ...getColumnSearchProps("latitude"),
      render: (text) => text || "-",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("startDate"),
      render: (text) => text || "-",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("endDate"),
      render: (text) => text || "-",
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center">
          <Tooltip title="Select">
            <span
              className="flex justify-center cursor-pointer"
              onClick={() => {
                handleSelect(record);
                handleCancel();
              }}
            >
              <SVGIcon
                name="IconActionCreate"
                color="#0075bf"
                width={24}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Select appropriate columns based on type
  const columns = isAccountType ? accountColumns : isCustomerType ? customerColumns : customerColumns;

  // Determine modal header based on type
  const modalHeader = isAccountType ? "CHOOSE ACCOUNT" : isCustomerType ? "CHOOSE CUSTOMER" : "CHOOSE RELATED";

  // Debug columns selection
  console.log("DEBUG - Columns Selection:", {
    isCustomerType,
    isAccountType,
    totalColumns: columns.length,
    modalHeader,
    columnTitles: columns.map(col => col.title)
  });

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleConfirmSelect = () => {
    if (selectedRow) {
      handleSelect(selectedRow);
      handleCancel();
      setSelectedRow(null);
    }
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      type="default"
      header={modalHeader}
      width={1400}
      handleCancel={() => {
        handleCancel();
        setSelectedRow(null);
      }}
      footer={
        <div className="w-full flex justify-end">
          <ButtonComponent
            type="default"
            onClick={() => {
              handleCancel();
              setSelectedRow(null);
            }}
          >
            Back
          </ButtonComponent>
        </div>
      }
    >
      <div className="w-full">
        <TablePagination
          loading={loadingRelatedObject}
          dataSource={dataSource}
          totalData={totalData}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          onShowSizeChange={handleChange}
          columns={columns}
          tableScrolled={{ x: 3500 }}
          rowClassName={(record) =>
            record.id === selectedRow?.id ? "bg-blue-50" : ""
          }
          rowKey="id"
        />
      </div>
    </ModalCustom>
  );
};

export default ModalChooseRelated;
