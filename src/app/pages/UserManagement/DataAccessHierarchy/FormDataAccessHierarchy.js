import React, { useCallback, useMemo, useRef } from "react";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  ArrowLeftOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Alert, Form, Select, Spin, Tooltip } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { useEffect } from "react";

import { useState } from "react";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ConfirmDataAccessLayout from "./ConfirmDataAccessLayout";
import DetailCostCenterLayout from "./DetailCostCenterLayout";
import DataAccessInformation from "./DataAccessInformation";
import {
  activationCostCenter,
  createDataAccess,
  getAllCostCenter,
  getDetailDataAccess,
  updateDataAccess,
} from "../../../../redux/slices/user_management/data_access";
import SVGIcon from "../../../../assets/Icon/index";
import moment from "moment";
import {
  ModalAttention,
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import HierarchyDataAccess from "./HierarchyDataAccess";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderColumn,
} from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import SelectComponent from "../../../../components/SelectComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
const { Option } = Select;

const FormDataAccessHierarchy = (props) => {
  const { type } = props;
  const { cost_center_data, data_detail, loading } = useSelector(
    (state) => state.data_access,
  );
  const { bodyError } = useSelector((state) => state?.general);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formHeader] = Form.useForm();
  const [data, setData] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState();
  const [sibling, setSibling] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [updateTree, setUpdateTree] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState({});
  const [modalActive, setModalActive] = useState(false);
  const [recordId, setRecordId] = useState();
  const [isSame, setIsSame] = useState(false);
  const [disabledParent, setDisabledParent] = useState(false);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [costCenterListHierarchyIsNull, setCostCenterListHierarchyIsNull] =
    useState(false);
  const [inputParentAlert, setInputParentAlert] = useState(false);
  const [inputCostCenterAlert, setInputCostCenterAlert] = useState(false);
  const [disableButtonAdd, setDisabledButtonAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const id = location?.state?.id;
  const [payload, setPayload] = useState({});

  // assert callback (include render hierarchy)
  const assert = useCallback(
    (data_detail, cost_center_data) => {
      if (data_detail && cost_center_data) {
        const mappedParent = data_detail?.rDataAccessHierarchy?.map(
          (item) => item.costCenter,
        );
        const filteredParent = cost_center_data?.filter((item) =>
          mappedParent?.includes(item?.name),
        );

        setParents(filteredParent);
        formHeader.setFieldsValue({
          id: data_detail?.dahId,
          name: data_detail?.name,
          startDate:
            data_detail?.startDate !== null
              ? moment(data_detail?.startDate).clone()
              : moment(),
          endDate:
            data_detail?.endDate !== null
              ? moment(data_detail?.endDate).clone()
              : moment(),
          saveAs: data_detail?.status,
          descriptionHierarchy: data_detail?.description,
        });
        const filteredCostCenters = cost_center_data?.filter(
          (costCenter) =>
            !data_detail?.rDataAccessHierarchy?.some(
              (dataCostCenter) =>
                dataCostCenter?.costCenter === costCenter?.name,
            ),
        );
        setCostCenters(filteredCostCenters);

        setData(
          data_detail?.rDataAccessHierarchy?.map((item, index) => {
            return {
              id: item?.rDahId,
              costCenter: item?.costCenter,
              key: item?.parent === "" ? "1" : (index + 2).toString(),
              parent: item?.parent,
              sibling: Array.isArray(item?.sibling)
                ? item.sibling.map((item) => {
                    return item?.sibling;
                  })
                : [],
              description: item?.description,
              status: item?.status,
              createdDate:
                hasValue(item?.createdDate) &&
                moment(item?.createdDate).format(dateFormatting.dateTime),
              updatedDate:
                hasValue(item?.updatedDate) &&
                moment(item?.updatedDate).format(dateFormatting.dateTime),
              createdBy: item?.createdBy,
              updatedBy: item?.updatedBy,
            };
          }) || [],
        );
      }
    },
    [formHeader],
  );

  // use effect get data
  useEffect(() => {
    dispatch(getAllCostCenter());
    if (type === "update") {
      dispatch(getDetailDataAccess(location?.state?.id));
    } else {
      setCostCenters(cost_center_data);
    }
  }, [dispatch, type]);

  // use effect assert data
  useEffect(() => {
    // if (loading === false) {
    if (type === "update" && id) {
      assert(data_detail, cost_center_data);
    } else {
      setCostCenters(cost_center_data || []);
    }
    // }
  }, [type, data_detail, loading, id, assert, cost_center_data]);

  // use effect set fields
  useEffect(() => {
    if (selectedData.length > 0) {
      const dataUpdate = Object.assign({}, ...selectedData);
      form.setFieldsValue({
        id: dataUpdate?.rDahId !== "" ? dataUpdate?.rDahId : "",
        key: dataUpdate.key,
        costCenter: dataUpdate.costCenter,
        parent: dataUpdate.parent === null ? null : dataUpdate.parent,
        description: dataUpdate.description,
        sibling: dataUpdate.sibling,
      });
    }
  }, [form, selectedData]);

  // use effect disabled button
  // useEffect(() => {
  //   form.getFieldValue("costCenter") !== undefined
  //     ? setDisabledButtonAdd(false)
  //     : setDisabledButtonAdd(true);
  // }, [form]);

  // handle change cost center
  const handleChangeCostCenter = (e) => {
    const selectedParentData = Object.assign(
      {},
      ...costCenters?.filter((item) => item?.name === e),
    );
    // if (hasValue(e)) {
    //   setDisabledButtonAdd(false);
    // } else {
    //   setDisabledButtonAdd(true);
    // }
    setSelectedParent(selectedParentData);
  };

  // handle change parent cost center
  const handleParentChange = (e) => {
    const row = form.getFieldsValue();
    if (row.costCenter === row.parent) {
      setIsSame(true);
    } else {
      const siblingsData = data?.filter((item) => item?.parent === e);
      setSibling(siblingsData);
      setIsSame(false);
    }
  };

  // handleUpdate row data access
  const handleUpdateRow = useCallback(
    (key) => {
      const selectData = data.filter((item) => item.key === key);
      const costCenter = data.filter((item) => item.key === key)[0]?.costCenter;
      const hasChildren = data.filter((item) => item.parent === costCenter);
      const filteredBySelectedCostCenter = parents.filter(
        (item) => item?.name !== costCenter,
      );
      if (
        key === "1" ||
        hasChildren.length > 0 ||
        selectData[0]?.sibling?.length > 0
      ) {
        setDisabledParent(true);
      } else {
        setDisabledParent(false);
      }
      const rowSelected = Object.assign({}, ...selectData);
      setSelectedData(selectData);
      setSibling(
        data
          ?.filter((item) => item?.parent === rowSelected?.parent)
          ?.filter((item) => item?.costCenter !== rowSelected?.costCenter),
      );
      setUpdateTree(true);
      setDisabledButtonAdd(false);
      setParents(filteredBySelectedCostCenter);
      form.getFieldValue("costCenter");
    },
    [data, form, parents],
  );

  // add & update hierarchy
  const onFinnish = () => {
    const formValue = form.getFieldsValue();
    let dataTable;
    let newParent;
    let updatedCostCenters;
    if (updateTree) {
      const row = form.getFieldsValue();
      const key = Object.assign({}, ...selectedData);
      const rowData = { key: key?.key, ...row };
      const findIndex = data.findIndex((item) => rowData.key === item.key);
      const newData = [...data];
      const item = newData[findIndex];
      const updatedRow = { ...item, ...row };
      newData.splice(findIndex, 1, updatedRow);
      setData(newData);
      setUpdateTree(false);
      setIsSame(false);
      updatedCostCenters = costCenters?.filter((item) => {
        return item?.name !== formValue.costCenter;
      });
      setCostCenters(updatedCostCenters);
      setInputParentAlert(false);
      setInputCostCenterAlert(false);
    } else {
      const maxId = data.reduce(
        (max, item) => (item.key > max ? item.key : max),
        0,
      );
      const values =
        type === "create"
          ? {
              key: (maxId + 1).toString(),
              parent:
                formValue?.parent === undefined ? null : formValue?.parent,
              ...formValue,
            }
          : {
              id: null,
              key: (maxId + 1).toString(),
              ...formValue,
              status: "ACTIVE",
            };
      if (data?.length === 0) {
        dataTable = [...data, values];
        newParent = [...parents, selectedParent];
        updatedCostCenters = costCenters.filter((item) => {
          return item?.name !== formValue.costCenter;
        });
      } else if (
        data?.length > 0 &&
        formValue?.parent !== undefined &&
        formValue?.costCenter !== undefined
      ) {
        dataTable = [...data, values];
        newParent = [...parents, selectedParent];
        updatedCostCenters = costCenters.filter((item) => {
          return item?.name !== formValue.costCenter;
        });
        setInputCostCenterAlert(false);
        setInputParentAlert(false);
      } else if (
        formValue?.costCenter === undefined &&
        formValue?.parent === undefined
      ) {
        dataTable = data;
        newParent = parents;
        updatedCostCenters = costCenters;
        setInputParentAlert(true);
        setInputCostCenterAlert(true);
      } else if (formValue?.costCenter === undefined) {
        dataTable = data;
        newParent = parents;
        updatedCostCenters = costCenters;
        setInputCostCenterAlert(true);
        setInputParentAlert(false);
      } else if (formValue?.parent === undefined) {
        dataTable = data;
        newParent = parents;
        updatedCostCenters = costCenters;
        setInputCostCenterAlert(false);
        setInputParentAlert(true);
      }
      setData(dataTable);
      setParents(newParent);
    }
    setCostCenters(updatedCostCenters);
    form.resetFields();
    setDisabledParent(false);
    // setDisabledButtonAdd(true)
  };

  // delete hierarchy
  const handleDelete = useCallback(
    (key, costCenter, parentsData) => {
      const findIndex = data.findIndex((item) => item.key === key);
      if (findIndex === 0 || key === 1) {
        setParents([]);
        const filteredCostCenter = parentsData.filter(
          (item) => item?.value || item?.name !== null,
        );
        setCostCenters([...costCenters, ...filteredCostCenter]);
        setData([]);
      } else {
        const item = data[findIndex];
        const setCostCenter = item.costCenter;
        const filteredCostCenter = parentsData.filter(
          (item) => item.name === setCostCenter,
        );
        const setParent = item.parent;
        const newData = [...data];
        const updatedParent = { parent: setParent };
        newData.forEach((item, index) => {
          if (index !== findIndex && item.parent === setCostCenter) {
            newData[index] = { ...item, ...updatedParent };
          }
        });
        const updatedData = newData.filter((item) => item.key !== key);
        setData(updatedData);
        setParents(parents.filter((item) => item.name !== setCostCenter));
        setCostCenters([...costCenters, ...filteredCostCenter]);
      }
      setIsSame(false);
      setDisabledParent(false);
      form.resetFields();
    },
    [costCenters, data, form, parents],
  );

  // func detail cost centers
  const handleDetail = (record) => {
    setOpenModal(true);
    setModalType("detail");
    if (record?.id === undefined || record?.id === null) {
      setSelectedDetail(record);
    } else {
      setSelectedDetail(record);
    }
  };

  // activation
  const handleActivation = async () => {
    try {
      setPayload(recordId);
      await dispatch(activationCostCenter({ id: recordId }))?.unwrap();
      await dispatch(getDetailDataAccess(id))?.unwrap();
    } catch (error) {
      // console.log(error);
    }
  };

  // close modal
  const handleCancel = async () => {
    setModalActive(false);
  };

  // search sort columns
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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

  // transform data to tree
  const transformDataToTree = (data) => {
    console.log(data);

    const nodes = {};
    const rootNodeIds = new Set();
    if (data?.length === 0) {
      return [{ name: "No Data", children: [] }];
    } else {
      data?.forEach((node) => {
        const { costCenter, parent } = node;
        nodes[costCenter] = { ...node, children: [] };
        if (parent === null || parent === "" || parent === undefined) {
          rootNodeIds?.add(costCenter);
        }
      });
      data?.forEach((node) => {
        const { costCenter, parent } = node;
        if (parent !== null || parent === "" || parent === undefined) {
          nodes[parent]?.children?.push(nodes[costCenter]);
        }
      });
    }
    return Array.from(rootNodeIds).map((rootId) => nodes[rootId]);
  };

  const hasChildren = useCallback((data, filterId) => {
    const findMatchingObject = (items) => {
      for (let item of items) {
        // Check if the current item's id matches the filterId
        if (item.key === filterId) {
          return item.children && item.children.length > 0; // Return true if it has children, false otherwise
        }

        // If it has children, search recursively
        if (item.children && item.children.length > 0) {
          const result = findMatchingObject(item.children);
          if (result !== null) {
            return result;
          }
        }
      }
      return null;
    };
    return findMatchingObject(data) !== null ? findMatchingObject(data) : false;
  }, []);

  // column
  const column = useCallback(
    (transformData) => [
      {
        key: "no",
        title: "NO",
        dataIndex: "no",
        width: "5%",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "COST CENTER",
        dataIndex: "costCenter",
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
        sorter: (a, b) => sorterFunction("costCenter", a, b),
        render: (text) =>
          renderColumn(
            "costCenter",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "PARENT",
        dataIndex: "parent",
        ...getColumnSearchProps(
          "parent",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => sorterFunction("parent", a, b),
        render: (text) =>
          renderColumn(
            "parent",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "SIBLING",
        dataIndex: "sibling",
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) => {
          const aSiblingText = a.sibling?.join(", ");
          const bSiblingText = b.sibling?.join(", ");
          return sorterFunction("sibling", aSiblingText, bSiblingText);
        },
        ...getColumnSearchProps(
          "sibling",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        render: (text) => {
          const texts = text?.join(", ");
          return renderColumn(
            "sibling",
            searchedColumn,
            searchText,
            texts,
            true,
            "input",
            search,
          );
        },
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchProps(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
        ),
        sorter: (a, b) => a.description?.localeCompare(b.description),
        render: (text) =>
          renderColumn(
            "description",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        key: "no",
        title: "ACTION",
        fixed: "right",
        width: 160,
        render: (_, record, data) => {
          const isDisabled = hasChildren(transformData, record?.key);
          return (
            <div className="w-full flex justify-center gap-4 mt-1 items-start">
              <Tooltip title={"Detail"}>
                <div
                  border={false}
                  onClick={() => {
                    handleDetail(record);
                  }}
                >
                  <UnorderedListOutlined
                    style={{ fontSize: "24px", color: "#0075bf" }}
                  />
                </div>
              </Tooltip>
              <Tooltip title={"Update"}>
                <div onClick={() => handleUpdateRow(record.key)}>
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Tooltip>
              <Tooltip title={"Delete"}>
                <div
                  className={isDisabled ? " cursor-not-allowed" : ""}
                  onClick={() => {
                    isDisabled === false &&
                      handleDelete(record.key, record, parents);
                  }}
                >
                  <DeleteOutlined
                    style={{
                      color: isDisabled ? "#8D91A0" : "#BE3036",
                      fontSize: 24,
                      cursor: isDisabled ? "not-allowed" : "pointer",
                    }}
                  />
                </div>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [
      handleDelete,
      handleUpdateRow,
      hasChildren,
      page,
      pageSize,
      parents,
      search,
      searchText,
      searchedColumn,
    ],
  );

  // filtering column
  let columnEdit = useMemo(
    () =>
      column(transformDataToTree(data)).filter(function (item) {
        return item?.dataIndex !== "status";
      }),
    [column, data],
  );

  // routes breadcrumb
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: USER_ROUTES.VIEW_DATA_ACCESS,
      breadcrumbName: "Data Access Hierarchy",
    },
    {
      path: "",
      breadcrumbName:
        type === "create"
          ? "Create Data Access Hierarchy"
          : "Update Data Access Hierarchy",
    },
  ];

  // render detail layout
  const renderDetailLayout = () => {
    if (selectedData?.rDahId) {
      return (
        <DetailCostCenterLayout
          type={type}
          detatilCostCenter={selectedDetail}
          rDahId={id}
        />
      );
    } else {
      return (
        <DetailCostCenterLayout
          type={type}
          detatilCostCenter={selectedDetail}
          rDahId={id}
        />
      );
    }
  };

  // handle reset data access
  const handleResetData = async () => {
    if (type === "create") {
      form.resetFields();
      setData([]);
      setParents([]);
      setCostCenters(cost_center_data);
      // setDisabledButtonAdd(true);
    } else {
      assert(data_detail, cost_center_data);
      // setDisabledButtonAdd(true);
    }
  };

  // handle clear input
  const handleClearInput = () => {
    form.resetFields();
    setUpdateTree(false);
    setIsSame(false);
    setDisabledParent(false);
    setInputParentAlert(false);
    setInputCostCenterAlert(false);
    // setDisabledButtonAdd(true)
    setParents(
      cost_center_data?.filter((itemCostCenter) =>
        data?.some((item) => item?.costCenter === itemCostCenter?.name),
      ),
    );
    setPayload({});
  };

  // update data pagination
  const updateDataPagination = (type = "data") => {
    let result = [...data];
    if (searchedColumn && hasValue(searchText)) {
      const fixSearchText = searchText?.toLowerCase();
      result = result?.filter((item) => {
        if (searchedColumn === "createdDate") {
          const tempDate =
            moment(item[searchedColumn])?.format(dateFormatting.dateTime) || "";
          return tempDate?.toLowerCase().includes(fixSearchText);
        } else if (searchedColumn === "sibling") {
          return item[searchedColumn]
            ?.map((item) => item)
            ?.join(", ")
            ?.toLowerCase()
            ?.includes(fixSearchText);
        } else {
          return item[searchedColumn].toLowerCase().includes(fixSearchText);
        }
      });
    } else {
      result = data;
    }
    const fix = result?.slice((page - 1) * pageSize, page * pageSize);
    return type === "data" ? fix : result.length;
  };

  // handle change pagination
  const handleChange = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // handle change sibling
  const handleChangeSibling = (e) => {
    if (e?.length === 0) {
      setDisabledParent(false);
    } else {
      setDisabledParent(true);
    }
  };

  const handleRetry = () => {
    handleCancelTryAgain();
    if (bodyError?.action === "CREATE_DATA_ACCESS") {
      dispatch(createDataAccess(payload));
    } else if (bodyError?.action === "UPDATE_DATA_ACCES") {
      dispatch(updateDataAccess(payload));
    } else if (bodyError?.action === "GET_DETAIL_DATA_ACCESS") {
      dispatch(getDetailDataAccess(location?.state?.id));
    } else if (bodyError?.action === "ACTIVATION_COST_CENTER") {
      dispatch(activationCostCenter({ id: payload }));
    } else {
      dispatch(getAllCostCenter());
    }
  };

  // render required input parent
  const isRequired = useMemo(() => {
    let rules;
    if (
      selectedData?.filter((item) => item?.key === "1")?.length === 1 &&
      updateTree === true
    ) {
      rules = false;
    } else if (data?.length > 0 && updateTree === false) {
      rules = true;
    } else if (data?.length > 0) {
      return true;
    }
    return rules;
  }, [data?.length, selectedData, updateTree]);

  console.log(data, " data");

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinnish}>
          <div className={"w-full flex flex-col gap-5 my-5"}>
            {type === "update" && <DataAccessInformation data={data_detail} />}
            <BaseContainer header={"DATA ACCESS HIERARCHY "}>
              <div className="grid grid-cols-2 gap-7">
                {!data || data?.length === 0 ? (
                  <div
                    className={
                      "w-full bg-gray-200 flex justify-center items-center"
                    }
                  >
                    <span> Area Bagan Hierarchy</span>
                  </div>
                ) : (
                  <HierarchyDataAccess
                    data={transformDataToTree(data)}
                    onClick={handleUpdateRow}
                  />
                )}
                <div className={"w-full"}>
                  <Form.Item
                    label={"Cost Center"}
                    name={"costCenter"}
                    rules={formMessageRequired("Cost Center")}
                  >
                    <SelectComponent
                      value={selectedParent?.name}
                      onChange={(e) => handleChangeCostCenter(e)}
                      disabled={updateTree === true ? true : false}
                    >
                      {costCenters?.map((item, key) => {
                        return (
                          <Option value={item?.name} key={key}>
                            {item?.name}
                          </Option>
                        );
                      })}
                    </SelectComponent>
                  </Form.Item>
                  <span className="text-red-600 text-uppercase my-2">
                    <p>
                      {inputCostCenterAlert === true &&
                        "Gagal, silakan pilih cost center"}
                    </p>
                  </span>
                  <Form.Item
                    label={"Parent"}
                    name={"parent"}
                    rules={isRequired ? formMessageRequired("Parent") : null}
                  >
                    <SelectComponent
                      onChange={(e) => handleParentChange(e)}
                      disabled={disabledParent}
                    >
                      {parents?.map((item, index, key) => {
                        return (
                          <Option
                            value={item?.name}
                            key={key}
                            disabled={isSame}
                          >
                            {item?.name}
                          </Option>
                        );
                      })}
                    </SelectComponent>
                  </Form.Item>
                  <span className="text-red-600 text-uppercase my-2">
                    <p>
                      {isSame === true &&
                        "Data cost center dan parent tidak boleh sama"}
                      {inputParentAlert === true &&
                        "Gagal, silakan pilih parent"}
                    </p>
                  </span>
                  <span className="text-red-600 text-uppercase my-2"></span>
                  <Form.Item label={"Siblings"} name={"sibling"}>
                    <SelectComponent
                      mode={"multiple"}
                      onChange={handleChangeSibling}
                    >
                      {sibling?.map((item, key) => {
                        return (
                          <Option value={item?.costCenter} key={key}>
                            {item?.costCenter}
                          </Option>
                        );
                      })}
                    </SelectComponent>
                  </Form.Item>
                  <Form.Item label={"Description"} name={"description"}>
                    <InputComponent type="textarea" />
                  </Form.Item>
                </div>
              </div>
            </BaseContainer>
            <div className={"w-full flex justify-end gap-2"}>
              <ButtonComponent
                type={"submit"}
                border={false}
                onClick={handleClearInput}
                icon={<SVGIcon name={`IconButtonClear`} width={24} />}
              >
                Clear
              </ButtonComponent>
              <Form.Item>
                <ButtonComponent
                  type={"submit"}
                  border={true}
                  htmlType={"submit"}
                  disabled={disableButtonAdd}
                >
                  {" "}
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
            <BaseContainer header={"COST CENTER LIST"}>
              <TablePaginationNew
                type="FE"
                columns={
                  type === "update"
                    ? column(transformDataToTree(data))
                    : columnEdit
                }
                pageSize={pageSize}
                current={page}
                dataSource={data}
                // totalData={updateDataPagination("length")}
                className="w-full"
                tableScrolled={{ x: 1500, y: 500 }}
                onSizeChanger={handleChange}
                onChange={handleChange}
              />
            </BaseContainer>
            <div className={"w-full flex"}>
              <div className={"w-full"}>
                <ButtonComponent
                  type={"submit"}
                  icon={<ArrowLeftOutlined style={{ fontSize: "24px" }} />}
                  border={false}
                  onClick={() => setModalBack(true)}
                >
                  Back
                </ButtonComponent>
              </div>
              <div className={"flex justify-end gap-2"}>
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  onClick={handleResetData}
                  icon={
                    <SVGIcon
                      name={
                        type === "update"
                          ? `IconButtonReset`
                          : `IconButtonClear`
                      }
                      width={24}
                    />
                  }
                >
                  {type === "create" ? "Clear" : "Reset"}
                </ButtonComponent>
                <ButtonComponent
                  type={"submit"}
                  border={false}
                  onClick={() => {
                    if (data?.length === 0) {
                      setCostCenterListHierarchyIsNull(true);
                    } else {
                      setOpenModal(true);
                      setModalType("confirmation");
                    }
                  }}
                  disabled={isSame}
                >
                  {" "}
                  Save
                </ButtonComponent>
              </div>
            </div>
          </div>
        </Form>
        <ModalCustom
          isOpen={openModal}
          type={modalType}
          header={
            modalType === "confirmation"
              ? "Save Hierarchy"
              : "DETAIL COST CENTER"
          }
          handleCancel={() => setOpenModal(false)}
          width={1000}
          footer={
            modalType !== "confirmation" && (
              <ButtonComponent
                type={"submit"}
                onClick={() => setOpenModal(false)}
              >
                Back
              </ButtonComponent>
            )
          }
        >
          {modalType === "confirmation" ? (
            <ConfirmDataAccessLayout
              data={data}
              handleCancel={() => setOpenModal(false)}
              typeAction={type}
              formValue={formHeader}
              id={id}
              setPayload={setPayload}
            />
          ) : (
            renderDetailLayout()
          )}
        </ModalCustom>
        <ModalConfirm
          isOpen={modalActive}
          handleCancel={handleCancel}
          handleOk={handleActivation}
          header={"Inactive Action"}
          width={800}
        >
          <div className="flex flex-col px-8 py-6">
            <div className="w-full justify-center items-center flex my-2">
              <div className={"mr-4 text-[#3C6DB2] text-2xl"}>
                <WarningOutlined style={{ color: "red" }} />
              </div>
              <h1 className="text-center text-[20px] font-medium">
                Are you sure want to inactivation?
              </h1>
            </div>
            <div className={"w-full justify-center my-4 flex text-sm"}>
              <Alert
                message={"Warning! if you inactive this data, it can't be use."}
                icon={<WarningOutlined />}
                type={"error"}
                showIcon
              />
            </div>
          </div>
        </ModalConfirm>
        {/* modal back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>
        <ModalAttention
          isOpen={costCenterListHierarchyIsNull}
          handleCancel={() => setCostCenterListHierarchyIsNull(false)}
          handleOk={() => setCostCenterListHierarchyIsNull(false)}
          textList={"cost center list hierarchy"}
        />
      </Spin>

      {/* render try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default FormDataAccessHierarchy;
