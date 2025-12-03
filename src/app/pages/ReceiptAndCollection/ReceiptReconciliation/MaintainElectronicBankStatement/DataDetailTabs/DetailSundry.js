import {
  ExclamationCircleOutlined,
  LeftOutlined,
  MoreOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Checkbox,
  Form,
  Popover,
  Select,
  Space,
  Spin,
  Steps,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import SelectComponent from "../../../../../../components/SelectComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../../redux/slices/general_slice";
import {
  getAllApprovalList,
  getCustomerInfo,
  getListApprovalById,
  getListCategory,
  getTableSundry,
  getTableSundrySelect,
  requestApprove,
  requestModal,
} from "../../../../../../redux/slices/receipt_collection/electrionicBank";
import { dateFormatting, formMessageRequired } from "../../../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsPaging,
} from "../../../../../../utils/getColumnSearchProps";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import ContentModalConfirmSundry from "../ContentModalConfirmSundry";
import TableSundryFE from "./TableSundryFE";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { configApp } from "../../../../../../constants/configApp";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { Link } from "react-router-dom";
import SVGIcon from "../../../../../../assets/Icon/index";
const { Option } = Select;

export const columnAwal = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "RECEIPT CODE",
    dataIndex: "receiptCode",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      searchedColumn === "receiptCode" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "SOR",
    dataIndex: "sor",
    align: "left",
    sorter: true,
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsPaging(
      "sor",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      searchedColumn === "sor" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "COST CENTER",
    dataIndex: "costCenter",
    key: "costCenter",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "costCenter",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "costCenter" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "CUSTOMER",
    dataIndex: "customerName",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "customerName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "customerName" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "ACCOUNT",
    dataIndex: "accountNumber",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "accountNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "accountNumber" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "RECEIPT NUMBER",
    dataIndex: "receiptNumber",
    align: "left",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "receiptNumber" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "RECEIPT DATE",
    dataIndex: "receiptDate",
    align: "center",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "receiptDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "date",
    ),
    render: (text) =>
      searchedColumn === "receiptDate" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[
            searchText
              ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
              : "",
          ]}
          autoEscape
          textToHighlight={
            text ? moment(text).format(dateFormatting.dateCapital) : ""
          }
        />
      ) : (
        moment(text).format(dateFormatting.dateCapital) || ""
      ),
  },
  {
    title: "RECEIPT AMOUNT",
    dataIndex: "amount",
    align: "right",
    sorter: true,
    ...getColumnSearchPropsPaging(
      "amount",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    ellipsis: {
      showTitle: false,
    },
    render: (text) =>
      searchedColumn === "amount" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ) : (
        ""
      ),
  },
  {
    title: "APPROVAL STATUS",
    dataIndex: "statusApproval",
    key: "statusApproval",
    fixed: "right",
    width: 210,
    sorter: true,
    ...getColumnSearchPropsPaging(
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      searchedColumn === "statusApproval" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : text ? (
        <div className="flex justify-center">
          <StatusComponent colour={text}>{text}</StatusComponent>
        </div>
      ) : (
        ""
      ),
  },
  {
    title: "ACTION",
    align: "center",
    dataIndex: "id",
    fixed: "right",
    width: 130,
    render: (id, r) => {
      return (
        <Space>
          <Popover
            content={
              <Space direction="vertical">
                {r?.statusApproval !== "Waiting Approval" &&
                r?.status !== "Inactive" ? (
                  <Link
                    className="w-full"
                    // to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_MASTER_BANK}
                    // state={{ id: id }}
                  >
                    <ButtonComponent
                      className="gap-5 w-full"
                      icon={
                        <SVGIcon name="IconEdit" width={24} color={"#0075BF"} />
                      }
                      border={false}
                      disabled={true}
                    >
                      <span
                        className={
                          "text-black gap-2 text-xl text-center w-full"
                        }
                      >
                        Update
                      </span>
                    </ButtonComponent>
                  </Link>
                ) : (
                  <ButtonComponent
                    className="gap-5 w-full"
                    icon={
                      <SVGIcon name="IconEdit" width={24} color={"#d3d3d3"} />
                    }
                    border={false}
                    disabled={true}
                  >
                    <span
                      className={"text-black gap-2 text-xl text-center w-full"}
                    >
                      Update
                    </span>
                  </ButtonComponent>
                )}

                <Link>
                  {
                    // r?.status === "ACTIVE" &&
                    r?.statusApproval !== "Waiting Approval" &&
                    r?.status !== "Inactive" ? (
                      <ButtonComponent
                        border={false}
                        // disabled={r?.status === "Draft"}
                        disabled={true}
                        // onClick={() => handleInactive(r)}
                      >
                        <Checkbox
                          // checked={r?.status === "Active" ? true : false}
                          className="gap-7"
                        />
                        <span
                          className={"text-black gap-2 text-xl text-center"}
                        >
                          {r?.status === "ACTIVE" ? "Inactivate" : "Activate"}
                        </span>
                      </ButtonComponent>
                    ) : (
                      <ButtonComponent border={false} disabled={true}>
                        <Checkbox
                          checked={
                            r?.status === "Active"
                              ? true
                              : false || r?.status === "Draft"
                                ? true
                                : null
                          }
                          disabled={true}
                          className="gap-7"
                        />
                        <span
                          className={"text-black gap-2 text-xl text-center"}
                        >
                          {r?.status === "Active" ? "Inactivate" : "Activate"}
                        </span>
                      </ButtonComponent>
                    )
                  }
                </Link>
                <Link>
                  <ButtonComponent
                    className="gap-5"
                    icon={
                      <SVGIcon
                        name="IconLogHistory"
                        color={"#0075bf"}
                        width={24}
                      />
                    }
                    disabled={true}
                    border={false}
                    // onClick={() => handleApprovalHistory(r)}
                  >
                    <span className={"text-black text-xl text-center"}>
                      Approval History
                    </span>
                  </ButtonComponent>
                </Link>
              </Space>
            }
            trigger={"click"}
            placement="bottomRight"
          >
            <div className="pt-1">
              <MoreOutlined style={{ fontSize: "22px", color: "#0075BF" }} />
            </div>
          </Popover>
          <Tooltip title="Detail">
            <div className="pt-1">
              <Link
              // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK}
              // state={{ id: id }}
              >
                <SVGIcon name="IconDetail" width={24} />
              </Link>
            </div>
          </Tooltip>
        </Space>
      );
    },
  },
];

//ATAS COLUMNs

const DetailSundry = ({ data, id, isApprover }) => {
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const {
    data_sundry,
    dataListAppHierId,
    dataListAppHierDetail,
    data_sundry_select,
    data_customer,
    message,
    loadingApprove,
    loadingModalReq,
    loading,
  } = useSelector((state) => state.electronic);
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const [form] = Form.useForm();
  const [loadingForm, setLoadingForm] = useState();
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [tableDatas, setTableDatas] = useState([]);
  const [modalRequest, setModalRequest] = useState(false);
  const [tableForceSelected, setTableForceSelected] = useState([]);
  const [forceObj, setForceObj] = useState({});
  const [keyTableForceSelected, setKeyTableForceSelected] = useState([]);
  const [selectCustomer, setSelectCustomer] = useState({});
  const [modalApproval, setModalApproval] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [listDataAttachmentApprove, setListDataAttachmentApprove] = useState(
    [],
  );

  const [pageSelect, setPageSelect] = useState(1);
  const [pageSizeSelect, setPageSizeSelect] = useState(10);
  const [searchSelect, setSearchSelect] = useState("");
  const [sortSelect, setSortSelect] = useState("");
  const [selectSearchTextSelect, setSearchTextSelect] = useState("");
  const [searchedColumnSelect, setSearchedColumnSelect] = useState("");

  // Use Effect
  useEffect(() => {
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
      getTableSundry({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
        id,
      }),
    );
  }, [search, page, pageSize, sort, dispatch, id]);

  useEffect(() => {
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
      getTableSundrySelect({
        search: tempSearch,
        sort: sortSelect,
        id,
        boolean: showModal,
        page: pageSelect,
        pageSize: pageSizeSelect,
      }),
    );
  }, [
    searchSelect,
    pageSelect,
    pageSizeSelect,
    sortSelect,
    dispatch,
    id,
    showModal,
  ]);

  const handleSearchSelect = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextSelect(selectedKeys[0]);
    setSearchedColumnSelect(selectedKeys[0] ? dataIndex : "");
    setSearchSelect((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageSelect(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  useEffect(() => {
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
    dispatch(getCustomerInfo({ page, pageSize, search: tempSearch, sort }));
  }, [search, page, pageSize, sort, dispatch, id]);

  // use effect
  useEffect(() => {
    dispatch(getAllApprovalList());
    // dispatch(getCustomerInfo());
  }, []);
  useEffect(() => {
    if (forceObj.approvalHierarchy) {
      dispatch(getListApprovalById(forceObj.approvalHierarchy));
    }
  }, [forceObj]);
  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);
  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const matchedObjectsCriteria = data_sundry_select?.filter((obj) =>
    keyTableForceSelected.includes(obj.receiptReconcileId),
  );

  const combineAttachment = matchedObjectsCriteria?.flatMap(
    (obj) => obj.attachmentDtoList || [],
  );

  //attachment untuk approve use effect nya
  useEffect(() => {
    const dataAttachment = (combineAttachment || []).map((item) => {
      return {
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        createdBy: item.createdBy,
        createdDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "",
        dataType: "exist",
      };
    });
    setListDataAttachmentApprove(dataAttachment);
  }, [keyTableForceSelected, modalApproval]);

  const handleSelectCustomer = (e, key) => {
    setSelectCustomer((prevState) => ({
      ...prevState,
      [key]: e,
    }));
  };

  const dataCustomer = data_customer?.data?.result?.map((item) => {
    return {
      value: item?.accountNumber,
      label: item?.accountName,
    };
  });

  const columnsModal = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
  ) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECEIPT CODE",
      dataIndex: "receiptCode",
      sorter: true,
      ...getColumnSearchProps(
        "receiptCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "receiptCode" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      align: "",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) =>
        searchedColumn === "sor" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      sorter: true,
      ...getColumnSearchProps(
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "costCenter" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER",
      dataIndex: "customerName",
      align: "left",
      sorter: true,
      ...getColumnSearchProps(
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "customerName" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      align: "left",
      sorter: true,
      ...getColumnSearchProps(
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "accountNumber" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "RECEIPT NUMBER",
      dataIndex: "receiptNumber",
      align: "right",
      sorter: true,
      ...getColumnSearchProps(
        "receiptNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "receiptNumber" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "RECEIPT DATE",
      dataIndex: "receiptDate",
      align: "center",
      sorter: true,
      ...getColumnSearchProps(
        "receiptDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
      ),
      render: (text) =>
        searchedColumn === "receiptDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.dateCapital) : ""
            }
          />
        ) : (
          moment(text).format(dateFormatting.dateCapital) || ""
        ),
    },
    {
      title: "CUSTOMER INFORMATION",
      dataIndex: "cusinfo",
      key: "cusinfo",
      width: 300,
      sorter: (a, b) => a.cusinfo - b.cusinfo,
      ...getColumnSearchProps(
        "cusinfo",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        // dataCustomer,
        // selectCustomer,
        // handleSelectCustomer
      ),
      render: (dataCus, record) => (
        <div className=" w-full ">
          <SelectComponent
            value={selectCustomer[`${record.receiptReconcileId}`] || undefined}
            onChange={(e) =>
              handleSelectCustomer(e, `${record.receiptReconcileId}`)
            }
          >
            {dataCustomer?.map((item) => (
              <Option value={item?.value}>{item?.label}</Option>
            ))}
          </SelectComponent>
        </div>
      ),
    },
    {
      title: "CURRENCY",
      dataIndex: "currency",
      align: "right",
      sorter: true,
      ...getColumnSearchProps(
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "currency" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "RECEIPT AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: true,
      ...getColumnSearchProps(
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "amount" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "APPROVAL STATUS",
      dataIndex: "statusApproval",
      key: "statusApproval",
      sorter: true,
      ...getColumnSearchProps(
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (approvalStatus) => {
        let text;
        switch (approvalStatus) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          case "APPROVED":
            text = "Approved";
            break;
          default:
            text = approvalStatus
              ? approvalStatus.charAt(0).toUpperCase() +
                approvalStatus.slice(1).toLowerCase()
              : approvalStatus;
            break;
        }
        if (searchedColumn === "statusApproval") {
          return (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          );
        } else {
          return text ? (
            <div className={"flex justify-center"}>
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          ) : (
            text
          );
        }
      },
    },
  ];

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const tabData = [
    { value: "Sundry" },
    { value: "Approval" },
    { value: "Attachment" },
  ];

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };
  const handleButtonPrev = () => {
    prev();
    scrollLeftHandler();
  };

  const handleButtonNext = (key) => {
    switch (key) {
      case "Sundry Information":
        break;
      default:
        next();
        scrollRightHandler();
    }
  };

  const rowSelectionRequest = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    selectedRowKeys: keyTableForceSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setTableForceSelected(selectedRows);
      setKeyTableForceSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.statusApproval === "Waiting Approval" ||
        record?.statusApproval === "Approved",
    }),
  };

  const rowSelectionApproval = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    selectedRowKeys: keyTableForceSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setTableForceSelected(selectedRows);
      setKeyTableForceSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.statusApproval === "-" || record.statusApproval === "Approved",
    }),
  };

  const handleForceObj = (e, type) => {
    let result;
    switch (type) {
      case "remark":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setForceObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  const mappingData = (data = []) => {
    return data?.map((item) => ({
      ...item,
      key: item?.receiptReconcileId,
    }));
  };

  // body api
  const handleClear = () => {
    setModalRequest(false);
    setListDataAttachment([]);
    form.resetFields();
    setForceObj({});
    setCurrent(0);
    setKeyTableForceSelected([]);
    setSelectCustomer({});
  };

  const handleClearApprove = () => {
    setModalApproval(false);
    setListDataAttachment([]);
    form.resetFields();
    setForceObj({});
    setCurrent(0);
    setKeyTableForceSelected([]);
  };

  const handleSave = () => {
    const messageSukses = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: false,
    };
    const newSelect = selectCustomer;
    const values = Object.values(newSelect);

    const body = {
      dtoList: keyTableForceSelected.map((item, index) => ({
        id: item,
        accountNumber: values[index] || "",
      })),
      remark: forceObj?.remark,
      appHierId: forceObj?.approvalHierarchy,
      type: "SUNDRY",
      // accountNumberList: values,
    };
    dispatch(requestModal(body))
      .unwrap()
      .then(async (dataRequest) => {
        // const idForce = dataRequest.receiptReconcileId;
        setLoadingForm(true);
        for (let index = 0; index < dataRequest.length; index++) {
          const elements = dataRequest[index];

          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              category: "SUNDRY",
              // referensiId: idForce,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/receipt/upload-attachment/${elements}`,
              body,
            );
          }
        }
        setLoadingForm(false);
        handleClear();
        dispatch(showModalSuccess(messageSukses));
        setModalRequest(false);
        dispatch(
          getTableSundry({
            id,
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch(showModalError(message));
        }
      });
  };

  const handleSaveApprove = () => {
    const messageSukses = {
      title: "Successfull",
      description: `your data has been ${
        approveOrReject === "approve" ? "approved" : "rejected"
      }`,
      return: false,
    };
    const tempData = (data_sundry_select || [])
      .filter((data) =>
        keyTableForceSelected.includes(data?.receiptReconcileId),
      )
      ?.map((item) => {
        const dataApprov = {
          id: item?.receiptReconcileId,
          approvalId: item?.tapprovalDto?.tAppId,
        };
        return dataApprov;
      });
    const body = {
      action: approveOrReject.toUpperCase(),
      remark: forceObj?.remark,
      receiptReconcileDtoList: tempData,
      type: "SUNDRY",
    };
    dispatch(requestApprove(body))
      .unwrap()
      .then(async (dataApprove) => {
        setLoadingForm(true);
        for (let index = 0; index < dataApprove.length; index++) {
          const elements = dataApprove[index];
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              category: "SUNDRY",
              // referensiId: idForce,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/receipt/upload-attachment/${elements}`,
              body,
            );
          }
        }
        setLoadingForm(false);
        handleClear();
        dispatch(showModalSuccess(messageSukses));
        setModalApproval(false);
        dispatch(
          getTableSundry({
            id,
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch(showModalError(message));
        }
      });
  };

  //step
  const steps = () => {
    if (showModal === true) {
      let temp = [
        {
          title: "Sundry Information",
          content: (
            <>
              <p className="text-primary text-xl font-semibold uppercase py-[20px] gap-5">
                RECEIPT ON BANK STATEMENT
              </p>
              <div className="my-5">
                <TableSundryFE
                  data={mappingData(data_sundry_select)}
                  key={"1-approval"}
                  rowSelection={rowSelectionApproval}
                  type={1}
                  typeModal={showModal}
                  selectCustomer={selectCustomer}
                  setSelectCustomer={setSelectCustomer}
                />
              </div>
            </>
          ),
          disabled: tableForceSelected.length === 0,
        },
        {
          title: "Attachment Information",
          content: (
            <div className="my-5 gap-5">
              <AttachmentComponent
                data={listDataAttachmentApprove}
                updateData={setListDataAttachmentApprove}
                typeSelector="electronic"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                type={"detail"}
              />
            </div>
          ),
        },
        {
          title: "Confirmation",
          content: (
            <div className="my-5 gap-5">
              <TableSundryFE
                data={tableForceSelected}
                key={"3-confirm"}
                type={3}
                typeModal={showModal}
                selectCustomer={selectCustomer}
                setSelectCustomer={setSelectCustomer}
              />
              <div className="w-full my-5 gap-5">
                <Alert
                  icon={
                    <ExclamationCircleOutlined
                      style={{ fontSize: "20px", color: "#65481C" }}
                    />
                  }
                  message={`Are you sure want to ${approveOrReject} these Receipt?`}
                  type={"warning"}
                  showIcon
                />
              </div>
              <div className={"mt-4"}>
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={formMessageRequired("Remark")}
                  getValueFromEvent={(e) => handleForceObj(e, "remark")}
                >
                  <InputComponent rows={5} type="textarea" />
                </Form.Item>
              </div>
            </div>
          ),
          disabled: !forceObj.remark,
        },
      ];
      return temp;
    }
    let temp = [
      {
        title: "Sundry Information",
        content: (
          <>
            <p className="text-primary text-xl font-semibold uppercase py-[20px] gap-5">
              RECEIPT ON BANK STATEMENT
            </p>
            <div className="my-5">
              <TableSundryFE
                data={mappingData(data_sundry_select)}
                key={"1-request"}
                rowSelection={rowSelectionRequest}
                type={1}
                selectCustomer={selectCustomer}
                setSelectCustomer={setSelectCustomer}
              />
            </div>
            <div className={"mt-4"}>
              <Form.Item
                label={"Remark"}
                name={"remark"}
                rules={formMessageRequired("Remark")}
                getValueFromEvent={(e) => handleForceObj(e, "remark")}
              >
                <InputComponent rows={5} type="textarea" />
              </Form.Item>
            </div>
          </>
        ),
        disabled: !forceObj.remark || tableForceSelected.length === 0,
        // ||
        // keyTableForceSelected.some((item) => !selectCustomer[item]),
      },
      {
        title: "Approval Information",
        content: (
          <div className="my-5 gap-5">
            <ApprovalSectionForm
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={forceObj.approvalHierarchy}
              updateSelectedHierarchy={(e) =>
                handleForceObj(e, "approvalHierarchy")
              }
            />
          </div>
        ),
        disabled: !forceObj.approvalHierarchy,
      },
      {
        title: "Attachment Information",
        content: (
          <div className="my-5 gap-5">
            <AttachmentComponent
              // type={type}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="electronic"
              dispatch={dispatch}
              getAPICategory={getListCategory}
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              typeRBI={"data"}
            />
          </div>
        ),
        disabled:
          !forceObj.approvalHierarchy || listDataAttachment.length === 0,
      },
      {
        title: "Confirmation",
        content: (
          <div className="my-5 gap-5">
            <ContentModalConfirmSundry
              data={forceObj}
              tabData={tabData}
              pageSize={pageSize}
              columns={columnsModal(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                // handleSelectCustomer,
                // dataCustomer,
                // selectCustomer
              )}
              dataTable={tableForceSelected}
              listDataAttachment={listDataAttachment}
              listDataDetail={tableDatas}
              listDataAppHierDetail={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={forceObj.approvalHierarchy}
              selectCustomer={selectCustomer}
              setSelectCustomer={setSelectCustomer}
            />
          </div>
        ),
      },
    ];
    return temp;
  };

  return (
    <div className="my-5">
      <div className="w-full flex justify-end my-5 gap-5">
        <ButtonComponent
          //   icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
            setModalRequest(true);
            setShowModal(false);
          }}
        >
          Request
        </ButtonComponent>
        {isApprover ? (
          <>
            <ButtonComponent
              type="submit"
              onClick={() => {
                setModalApproval(true);
                setShowModal(true);
              }}
            >
              Approval
            </ButtonComponent>
          </>
        ) : null}
      </div>
      <TablePaginationNew
        dataSource={data?.result}
        totalData={data?.page?.totalElements || 0}
        columns={columnAwal(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        )}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        // onShowSizeChange={handleChange}
        onSizeChanger={handleChange}
        onSort={onSort}
        tableScrolled={{
          x: 3500,
          y: 300,
        }}
      />

      <ModalCustom
        isOpen={modalRequest}
        header={"RECOMMENDATION SUNDRY"}
        type={"confirmation"}
        handleOk={handleSave}
        handleCancel={handleClear}
        width={1200}
        footer={
          <div className="flex justify-end gap-5">
            <ButtonComponent type={"default"} onClick={handleClear}>
              Back
            </ButtonComponent>
            {current > 0 ? (
              <ButtonComponent
                type={"submit"}
                onClick={handleButtonPrev}
                icon={
                  <LeftOutlined
                    style={{
                      color: "#fff",
                      fontSize: 15, // Ubah ukuran ikon sesuai kebutuhan
                      marginRight: 10,
                    }}
                  />
                }
              >
                Previous
              </ButtonComponent>
            ) : null}

            {current < steps().length - 1 && (
              <ButtonComponent
                type={"submit"}
                onClick={handleButtonNext}
                disabled={steps()[current].disabled}
              >
                <div style={{ textAlign: "center" }}>
                  <span>Next</span>
                  <RightOutlined
                    style={{
                      color: "#fff",
                      fontSize: 15, // Ubah ukuran ikon sesuai kebutuhan
                      marginLeft: 10,
                    }}
                  />
                </div>
              </ButtonComponent>
            )}
            {current === steps().length - 1 && (
              <ButtonComponent
                type={"submit"}
                htmlType={"submit"}
                onClick={handleSave}
              >
                Confirm
              </ButtonComponent>
            )}
          </div>
        }
      >
        <div className="w-full gap-5">
          <Spin spinning={loadingModalReq}>
            <div
              ref={containerRef}
              className="overflow-x-scroll scrollStepsCstm gap-5"
            >
              <Steps
                current={current}
                items={steps()}
                labelPlacement="vertical"
              />
            </div>
            <Form
              form={form}
              layout="vertical"
              className="mt-3"
              // onFinish={handleSave}
              // onFinishFailed={onFinishFailed}
            >
              {steps()[current].content}
            </Form>
          </Spin>
        </div>
      </ModalCustom>

      <ModalCustom
        isOpen={modalApproval}
        handleOk={handleSaveApprove}
        handleCancel={handleClearApprove}
        header={"APPROVAL PAYMENT"}
        type={"confirmation"}
        width={1200}
        footer={
          current === 0 ? (
            <div className="flex mt-[30px] justify-between py-5">
              <ButtonComponent
                type={"submit"}
                onClick={() => handleClearApprove()}
                icon={
                  <LeftOutlined
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      justifyItems: "center",
                    }}
                  />
                }
              >
                Back
              </ButtonComponent>

              <div className={"w-full flex justify-end gap-5"}>
                <ButtonComponent
                  type="reject"
                  onClick={() => {
                    handleButtonNext();
                    setApproveOrReject("reject");
                  }}
                  disabled={steps()[current].disabled}
                >
                  Reject
                </ButtonComponent>

                <ButtonComponent
                  type="approve"
                  onClick={() => {
                    handleButtonNext();
                    setApproveOrReject("approve");
                  }}
                  disabled={steps()[current].disabled}
                >
                  Approve
                </ButtonComponent>
              </div>
            </div>
          ) : current === 1 ? (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent type="default" onClick={handleButtonPrev}>
                Back
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={handleButtonNext}
                disabled={steps()[current].disabled}
              >
                <div style={{ textAlign: "center" }}>
                  <span>Next</span>
                  <RightOutlined
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      marginLeft: 10,
                    }}
                  />
                </div>
              </ButtonComponent>
            </div>
          ) : (
            current === steps().length - 1 && (
              <div className={"w-full flex justify-end gap-5"}>
                <ButtonComponent
                  type={"default"}
                  onClick={handleClearApprove}
                  htmlType={"submit"}
                >
                  Cancel
                </ButtonComponent>

                <ButtonComponent
                  type={"submit"}
                  onClick={handleSaveApprove}
                  htmlType={"submit"}
                >
                  Confirm
                </ButtonComponent>
              </div>
            )
          )
        }
      >
        <div className="w-full gap-5">
          <Spin spinning={loadingApprove}>
            <div
              ref={containerRef}
              className="overflow-x-scroll scrollStepsCstm gap-5"
            >
              <Steps
                current={current}
                items={steps()}
                labelPlacement="vertical"
              />
            </div>
            <Form
              form={form}
              layout="vertical"
              className="mt-3"
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
            >
              {steps()[current].content}
            </Form>
          </Spin>
        </div>
      </ModalCustom>
    </div>
  );
};
export default DetailSundry;
