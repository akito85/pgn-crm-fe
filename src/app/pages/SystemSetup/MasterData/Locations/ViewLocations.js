import React from "react";
import { Alert, Checkbox, Form, Select, Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import SelectComponent from "../../../../../components/SelectComponent";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import {
  activationLocation,
  downloadLocation,
  getDetailLocation,
  getLocationPaginate,
  getLocationType,
} from "../../../../../redux/slices/account_management/MasterData/location_slice";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import { useRef } from "react";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../components/Card/CardComponent";
import {
  dateFormatting,
  formMessageRequired,
  hasValue,
  renderColumn,
  toTitleCase,
} from "../../../../../utils";
import InputComponent from "../../../../../components/InputComponent";
import DetailText from "../../../../../components/DetailText";
import moment from "moment";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";
import { usePrevLocContext } from "../../../../../utils/usePrevLoc";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useMemo } from "react";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../components/CardContainer";

const ViewLocations = () => {
  const { data, loading, data_detail, data_location_type } = useSelector(
    (state) => state.location
  );
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const searchInput = useRef(null);
  const [selectedLocationColumn, setSelectedLocationColumn] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalActivation, setOpenModalActivation] = useState(false);
  const [typeStatus, setTypeStatus] = useState("");
  const [locationId, setLocationId] = useState(null);
  const [additionalLabel, setAdditionalLabel] = useState({});
  const [form] = Form.useForm();
  const [selectedLocationType, setSelectedLocationType] = useState(null);
  const [modalError, setModalError] = useState(false);
  const [currentLocationType, setCurrentLocationType] = useState("");
  const dataLocation = data_location_type?.map((item) => ({
    value: item?.id,
    name: item?.name,
  }));
  const { remark } = form.getFieldsValue();
  const { path } = usePrevLocContext();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));

  // use effect get location type
  useEffect(() => {
    dispatch(getLocationType());
  }, [path, dispatch]);

  // set location type state
  useEffect(() => {
    if (hasValue(path?.state) === false) {
      setSelectedLocationType(
        dataLocation?.filter((item) => item?.value === 2346)[0]?.value || 2346
      );
    } else {
      setSelectedLocationType(
        dataLocation?.filter(
          (item) => item?.value === path?.state?.currentLocation
        )[0]?.value
      );
      handleChangeLocationType(path?.state?.currentLocation);
    }
  }, [path]);

  // use effect fetch data
  useEffect(() => {
    if (selectedLocationType) {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getLocationPaginate({
          typeId: selectedLocationType,
          search: reqSearch,
          sort,
          page,
          pageSize,
        })
      );
    }
  }, [dispatch, page, pageSize, search, sort, selectedLocationType]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

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
    setFilteredInfo((prev) => ({
      ...prev,
      [dataIndex]: selectedKeys[0],
    }));
  };

  // handle active inactive
  const handleActiveOrInactive = (record) => {
    setOpenModalActivation(true);
    setLocationId(record?.locationId);
    setTypeStatus(record?.status);
    setAdditionalLabel({
      name: record?.locationName,
      nameParentType: record?.locationParentType,
      nameParent: record?.locationParent,
    });
  };

  // handle detail
  const handleDetail = async (record, selectedLocationType) => {
    let id = "";
    if (selectedLocationType === 2346) {
      id = record?.postalCodeId;
    } else {
      id = record?.locationId;
    }
    await dispatch(
      getDetailLocation({ id: id, locationType: selectedLocationType })
    )?.unwrap();
    setOpenModal(true);
  };

  // handle cancel modal
  const handleCancel = () => {
    setOpenModal(false);
    setOpenModalActivation(false);
    form.resetFields();
  };

  // handle save activation
  const handleSaveActivation = async (formValue) => {
    const body = {
      ...formValue,
      locationId: locationId,
    };
    await dispatch(activationLocation(body))?.unwrap();
    setOpenModalActivation(false);
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    await dispatch(
      getLocationPaginate({
        typeId: selectedLocationType,
        page,
        pageSize,
        sort,
        search: reqSearch,
      })
    )?.unwrap();
    form.resetFields();
  };

  const handleChangeLocationType = (e) => {
    setPage(1);
    setPageSize(10);
    setSearch({});
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    setFilteredInfo({});
    if (hasValue(e) === false) {
      if (!hasValue(path)) setSelectedLocationType(2346);
      else setSelectedLocationType(selectedLocationType);
    } else {
      setSelectedLocationType(e);
    }
  };

  // Base columns with useMemo
  const baseColumns = useMemo(() => {
    let arrayCols = [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        dataIndex: "no",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "locationCode",
        title: "CODE",
        dataIndex: "locationCode",
        filteredValue: [search?.locationCode] || null,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "locationCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "locationCode",
            hasValue(search["locationCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "country",
        title: "COUNTRY",
        dataIndex: "country",
        sorter: true,
        filteredValue: [search?.country] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "country",
            hasValue(search["country"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "province",
        title: "PROVINCE",
        dataIndex: "province",
        sorter: true,
        filteredValue: [search?.province] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "province",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "province",
            hasValue(search["province"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "city",
        title: "CITY",
        dataIndex: "city",
        sorter: true,
        filteredValue: [search?.city] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "city",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "city",
            hasValue(search["city"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "district",
        title: "DISTRICT",
        dataIndex: "district",
        sorter: true,
        filteredValue: [search?.district] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "district",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "district",
            hasValue(search["district"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "subDistrict",
        title: "SUB DISTRICT",
        dataIndex: "subDistrict",
        sorter: true,
        filteredValue: [search?.subDistrict] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "subDistrict",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "subDistrict",
            hasValue(search["subDistrict"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "postalCode",
        title: "POSTAL CODE",
        dataIndex: "postalCode",
        sorter: true,
        filteredValue: [search?.postalCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "postalCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "postalCode",
            hasValue(search["postalCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "locationType",
        title: "LOCATION TYPE",
        dataIndex: "locationType",
        sorter: true,
        filteredValue: [search?.locationType] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "locationType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "locationType",
            hasValue(search["locationType"]),
            searchText,
            text?.toUpperCase(),
            false,
            "input",
            search
          ),
      },
      {
        key: "locationName",
        title: "LOCATION NAME",
        dataIndex: "locationName",
        sorter: true,
        filteredValue: [search?.locationName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "locationName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "locationName",
            hasValue(search["locationName"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "locationParent",
        title: "LOCATION PARENT",
        dataIndex: "locationParent",
        sorter: true,
        filteredValue: [search?.locationParent] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "locationParent",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "locationParent",
            hasValue(search["locationParent"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "locationParentType",
        title: "LOCATION PARENT TYPE",
        dataIndex: "locationParentType",
        sorter: true,
        filteredValue: [search?.locationParentType] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "locationParentType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "locationParentType",
            hasValue(search["locationParentType"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "locationReference",
        title: "LOCATION REFERENCE",
        dataIndex: "locationReference",
        sorter: true,
        filteredValue: [search?.locationReference] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "locationReference",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "locationReference",
            hasValue(search["locationReference"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        filteredValue: [search?.status] || null,
        width: 120,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
    ];

    if (selectedLocationType !== 2346) {
      return arrayCols?.filter(
        (item) =>
          item?.dataIndex === "no" ||
          item.dataIndex === "locationName" ||
          item.dataIndex === "locationType" ||
          item?.dataIndex === "locationParent" ||
          item?.dataIndex === "locationParentType" ||
          item.dataIndex === "locationReference" ||
          item?.dataIndex === "locationCode" ||
          item?.dataIndex === "status"
      );
    } else {
      return arrayCols?.filter(
        (item) =>
          item?.dataIndex === "no" ||
          item?.dataIndex === "country" ||
          item?.dataIndex === "province" ||
          item?.dataIndex === "city" ||
          item?.dataIndex === "district" ||
          item?.dataIndex === "subDistrict" ||
          item?.dataIndex === "postalCode"
      );
    }
  }, [
    page,
    pageSize,
    search,
    searchText,
    searchedColumn,
    selectedLocationType,
  ]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: "",
      breadcrumbName: "Location",
    },
  ];

  // handle change pagination
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // onsort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const RenderLayoutDetail = ({ selectedLocationType }) => {
    if (selectedLocationType === 2346) {
      return (
        <>
          <CardComponent header={"location information"} cols={4}>
            <DetailText label={"Location Code"}>
              {data_detail?.locationCode}
            </DetailText>
            <DetailText label={"Country"}>{data_detail?.country}</DetailText>
            <DetailText label={"Province"}>{data_detail?.province}</DetailText>
            <DetailText label={"City"}>{data_detail?.city}</DetailText>
            <DetailText label={"District"}>{data_detail?.district}</DetailText>
            <DetailText label={"Subdistrict"}>
              {data_detail?.subdistrict}
            </DetailText>
            <DetailText label={"Postal Code"}>
              {data_detail?.postalCode}
            </DetailText>
            <DetailText label={"Status"}>
              {toTitleCase(data_detail?.status)}
            </DetailText>
          </CardComponent>
          <CardComponent header={"history log information"} cols={5}>
            <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
            <DetailText label={"Created Date"}>
              {hasValue(data_detail?.createdDate) &&
                moment(data_detail?.createdDate).format(
                  dateFormatting?.dateTime
                )}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {hasValue(data_detail?.updatedDate) &&
                moment(data_detail?.updatedDate).format(
                  dateFormatting?.dateTime
                )}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </CardComponent>
        </>
      );
    } else {
      return (
        <>
          <CardComponent header={"location information"} cols={4}>
            <DetailText label={"Location Code"}>
              {data_detail?.locationCode}
            </DetailText>
            <DetailText label={"Location Type"}>
              {data_detail?.locationType?.name?.toUpperCase()}
            </DetailText>
            <DetailText label={"Location Name"}>
              {data_detail?.locationName}
            </DetailText>
            <DetailText label={"Location Reference"}>
              {data_detail?.locationReference?.name}
            </DetailText>
            <DetailText label={"Location Parent Type"}>
              {data_detail?.locationParentType?.name}
            </DetailText>
            <DetailText label={"Location Parent"}>
              {data_detail?.locationParent?.name}
            </DetailText>
            <DetailText label={"Status"}>
              {toTitleCase(data_detail?.status)}
            </DetailText>
          </CardComponent>
          <CardComponent header={"history log information"} cols={5}>
            <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
            <DetailText label={"Created Date"}>
              {hasValue(data_detail?.createdDate) &&
                moment(data_detail?.createdDate).format(
                  dateFormatting?.dateTime
                )}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {hasValue(data_detail?.updatedDate) &&
                moment(data_detail?.updatedDate).format(
                  dateFormatting?.dateTime
                )}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </CardComponent>
        </>
      );
    }
  };

  const handleConfirm = () => {
    if (bodyError?.action === "GET_LOCATION_PAGINATE") {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(
        getLocationPaginate({
          typeId: selectedLocationType,
          search: reqSearch,
          sort,
          page,
          pageSize,
        })
      );
    } else if (bodyError?.action === "DOWNLOAD_LOCATION") {
      handleDownload();
    } else {
      handleSaveActivation();
    }
    dispatch(clearBodyMessage());
  };

  // handle retry
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle download
  const handleDownload = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      downloadLocation({
        parentType: selectedLocationType,
        search: reqSearch,
        page,
        pageSize,
      })
    );
  };

  const itemActions = [
    //action toolbar
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={""}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink
          to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_LOCATIONS}
          state={{ currentLocation: selectedLocationType }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Location
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record, selectedLocationType);
              }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            {record?.status === "INACTIVE" ? (
              <Link>
                <div className={"cursor-not-allowed"}>
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    color={"#C0BEC6"}
                    className={"cursor-not-allowed"}
                  />
                </div>
              </Link>
            ) : (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_LOCATIONS}
                state={{
                  id: record?.locationId,
                  currentLocation: selectedLocationType,
                }}
              >
                <div>
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            )}
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={() => {
                  handleActiveOrInactive(record);
                }}
                checked={record?.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["Activate", "View", "Update"],
    selectedLocationType !== 2346 ? itemActions : []
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <Spin spinning={loading}>
      <>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">LOCATION LIST</p>
              <div className="flex gap-[20px]">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <div className="w-1/3 mb-5">
            <SelectComponent
              value={selectedLocationType}
              onChange={handleChangeLocationType}
              label={"Location Type"}
            >
              {dataLocation?.map((item) => (
                <Select.Option key={item?.value} value={item?.value}>
                  {item?.name}
                </Select.Option>
              ))}
            </SelectComponent>
          </div>

          <div className="my-0">
            <TableRBI
              dataSource={data?.result}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={
                selectedLocationType === 2346
                  ? { x: 1500, y: 525 }
                  : { x: 1800, y: 525 }
              }
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          type={"detail"}
          header={"location detail"}
          width={1000}
          footer={
            <ButtonComponent onClick={handleCancel}>Cancel</ButtonComponent>
          }
        >
          <RenderLayoutDetail selectedLocationType={selectedLocationType} />
        </ModalCustom>

        {openModalActivation ? (
          <ModalCustom
            isOpen={openModalActivation}
            header={`${
              typeStatus === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"
            } INFORMATION`}
            width={1000}
            type={"confirmation"}
            handleCancel={handleCancel}
            footer={
              <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
                <ButtonComponent onClick={handleCancel} type="default">
                  Cancel
                </ButtonComponent>
                <ButtonComponent
                  form="inactivateForm"
                  type="submit"
                  htmlType="submit"
                >
                  Confirm
                </ButtonComponent>
              </div>
            }
          >
            <Form
              id="inactivateForm"
              form={form}
              onFinish={handleSaveActivation}
              layout="vertical"
            >
              <div className="flex flex-col gap-6">
                <Alert
                  message={`Are you sure want to ${
                    typeStatus === "ACTIVE" ? "inactivate" : "activate"
                  } ${
                    selectedLocationType === 2346 ||
                    selectedLocationType === 103
                      ? `location named ${(
                          additionalLabel?.name || ""
                        )?.toLowerCase()}`
                      : `location named ${(
                          additionalLabel?.name || ""
                        )?.toLowerCase()} of parent ${(
                          additionalLabel?.nameParentType || ""
                        )?.toLowerCase()} named ${(
                          additionalLabel?.nameParent || ""
                        )?.toLowerCase()}`
                  }?`}
                  icon={<InfoCircleOutlined />}
                  type={"warning"}
                  showIcon
                  className="inactivate-alert"
                />
                <Form.Item
                  name={"remark"}
                  label={"Remark"}
                  rules={formMessageRequired("remark")}
                  className="w-full"
                >
                  <InputComponent
                    group
                    rows={1}
                    type="textarea"
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </Form>
          </ModalCustom>
        ) : null}

        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">
              {bodyError?.response?.data?.message?.toString()}
            </p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </>
    </Spin>
  );
};

export default ViewLocations;
