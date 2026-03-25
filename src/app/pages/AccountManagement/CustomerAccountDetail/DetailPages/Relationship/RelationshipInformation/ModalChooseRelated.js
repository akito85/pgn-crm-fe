import { FilterOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import { TablePaginationNew } from "poc-table-dragandrop";
import { getRelatedObjectData } from "../../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import moment from "moment";

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
  const isAccountType = normalizedRelationType && ["CHILD_OF", "PARENT_OF"].includes(normalizedRelationType);
  const isCustomerType = normalizedRelationType && ["BRANCH_OF", "HEAD_QUARTER_OF", "COMPANY_GROUP"].includes(normalizedRelationType);

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
      key: item.id || item.relatedObjectId
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
      width: 50,
      align: "center",
      render: (text, object, index) => (
        <div className="py-2.5">{(page - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "partyType",
      width: 231,
      sorter: true,
      ...getColumnSearchProps("partyType"),
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 343,
      sorter: true,
      ...getColumnSearchProps("customerIdentificationNumber"),
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      sorter: true,
      width: 200,
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "CUSTOMER TYPE",
      dataIndex: "customerType",
      sorter: true,
      width: 194,
      ...getColumnSearchProps("customerType"),
      render: (text) => text || "-",
    },
    {
      title: "ACTION",
      align: "center",
      width: 127,
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
      width: 50,
      align: "center",
      render: (text, object, index) => (
        <div className="py-2.5">{(page - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      width: 220,
      sorter: true,
      ...getColumnSearchProps("customerNumber"),
    },
    {
      title: "IDENTIFICATION TYPE",
      dataIndex: "identificationType",
      width: 231,
      sorter: true,
      ...getColumnSearchProps("identificationType"),
      render: (text) => text || "-",
    },
    {
      title: "CUSTOMER IDENTIFICATION NUMBER",
      dataIndex: "customerIdentificationNumber",
      width: 343,
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
      width: 194,
      sorter: true,
      ...getColumnSearchProps("customerTypeName"),
      render: (text) => text || "-",
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 209,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "accountName",
      width: 189,
      sorter: true,
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "CATEGORY",
      dataIndex: "accountCategory",
      width: 148,
      sorter: true,
      ...getColumnSearchProps("accountCategory"),
      render: (text) => text || "-",
    },
    {
      title: "SOR",
      dataIndex: "sor",
      width: 100,
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
      dataIndex: "meterReadingCode",
      width: 173,
      sorter: true,
      ...getColumnSearchProps("meterReadingCode"),
      render: (text) => text || "-",
    },
    {
      title: "CUSTOMER MANAGEMENT",
      dataIndex: "customerManagement",
      width: 246,
      sorter: true,
      ...getColumnSearchProps("customerManagement"),
      render: (text) => text || "-",
    },
    {
      title: "CLASSIFICATION TYPE",
      dataIndex: "classificationType",
      width: 235,
      sorter: true,
      ...getColumnSearchProps("classificationType"),
      render: (text) => text || "-",
    },
    {
      title: "SEGMENT",
      dataIndex: "accountSegment",
      width: 142,
      sorter: true,
      ...getColumnSearchProps("accountSegment"),
      render: (text) => text || "-",
    },
    {
      title: "ACCOUNT GROUP TYPE",
      dataIndex: "accountGroupType",
      width: 239,
      sorter: true,
      ...getColumnSearchProps("accountGroupType"),
      render: (text) => text || "-",
    },
    {
      title: "PREMISE ADDRESS",
      dataIndex: "premiseAddress",
      width: 280,
      sorter: true,
      ...getColumnSearchProps("premiseAddress"),
      render: (text) => text || "-",
    },
    {
      title: "SUBDISTRICT",
      dataIndex: "subDistrict",
      width: 169,
      sorter: true,
      ...getColumnSearchProps("subDistrict"),
      render: (text) => text || "-",
    },
    {
      title: "DISTRICT",
      dataIndex: "district",
      width: 138,
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
      width: 141,
      sorter: true,
      ...getColumnSearchProps("country"),
      render: (text) => text || "-",
    },
    {
      title: "LONGITUDE",
      dataIndex: "longitude",
      width: 155,
      sorter: true,
      ...getColumnSearchProps("longitude"),
      render: (text) => text || "-",
    },
    {
      title: "LATITUDE",
      dataIndex: "latitude",
      width: 141,
      sorter: true,
      ...getColumnSearchProps("latitude"),
      render: (text) => text || "-",
    },
    {
      title: "ACTION",
      align: "center",
      width: 127,
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
  const tableScrolledWidth = isAccountType ? 3500 : 1400;

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
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
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
      type="confirmation"
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
        <TablePaginationNew
          loading={loadingRelatedObject}
          dataSource={dataSource}
          totalData={totalData}
          current={page}
          pageSize={pageSize}
          onChange={handleChange}
          columns={columns}
          tableScrolled={{ x: tableScrolledWidth, y: 400 }}
          rowClassName={(record) =>
            record.id === selectedRow?.id ? "bg-blue-50" : ""
          }
          rowKey="id"
          enableDragColumn={true}
        />
      </div>
    </ModalCustom>
  );
};

export default ModalChooseRelated;

