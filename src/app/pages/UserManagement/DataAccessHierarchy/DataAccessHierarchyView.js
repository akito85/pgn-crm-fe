import React, { useCallback } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import {
  DownloadOutlined,
  PlusOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import {
  Alert,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Spin,
  Tooltip,
} from "antd";
import { Link, NavLink } from "react-router-dom";
import TablePagination from "../../../../components/TablePagination";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  activationDataAccess,
  downloadDataAccess,
  dupliacateDataAccess,
  getDataAccessPaginate,
} from "../../../../redux/slices/user_management/data_access";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { useRef } from "react";
import SVGIcon from "../../../../assets/Icon/index";
import { dateFormatting, hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
const DataAccessHierarchyView = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.dataAccess);
  const { bodyError } = useSelector(state => state?.general);


  // state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dahId, setDahId] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [body, setBody] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getDataAccessPaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort })
    );
  }, [dispatch, page, pageSize, search, sort]);


  useEffect(() => {
    handleFetch()
  }, [handleFetch]);

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

  // column
  const column = [
    {
      title: "NO",
      dataIndex: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "NAME",
      dataIndex: "name",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
      ),
      render: (text) => renderColumn('name', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      sorter: true,
      align: "center",
      width: 140,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"),
      render: (v) => renderDateColumn('startDate', hasValue(search['startDate']), searchText, v, 'date', search),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      sorter: true,
      align: "center",
      width: 140,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"),
      render: (v) => renderDateColumn('endDate', hasValue(search['endDate']), searchText, v, 'date', search),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      align: "center",
      width: 120,
      fixed: 'right',
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status')
    }
  ];
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: "",
      breadcrumbName: "Data Access Hierarchy",
    },
  ];
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };


  // handle cancel 
  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
  };

  // handle duplicate
  const onDuplication = async (formValue) => {
    try {
      const body = { ...formValue, id: dahId };
      setBody(body)
      handleCancel();
      await dispatch(dupliacateDataAccess(body))?.unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
    }
  };

  // handle activation
  const onActivation = async (formValue) => {
    try {
      const endDateFormat = moment(formValue.endDate).format(
        dateFormatting.dateCapital
      );
      const body = { endDate: endDateFormat === 'Invalid date' ? null : endDateFormat, id: dahId };
      setBody(body)
      handleCancel()
      await dispatch(activationDataAccess(body))?.unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
    }
  };

  // handle download 
  const handleDownload = () => {
    dispatch(
      downloadDataAccess({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON?.stringify(search)),
      })
    );
  }

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };


  const itemActions = [
    // toolbar items
    {
      action: 'Download',
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          {" "}
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={USER_ROUTES.CREATE_DATA_ACCESS}>
          <ButtonComponent
            type={"submit"}
            border={false}
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
          >
            Create Data Access Hierarchy
          </ButtonComponent>
        </NavLink>
      )
    },

    // column action
    {
      action: 'View',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              to={USER_ROUTES.DETAIL_DATA_ACCESS}
              state={{ id: record?.dahId }}
            >
              <div>
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Link>
          </Tooltip>
        )
      }
    },
    {
      action: 'Activate',
      type: 'table',
      render: (record, data_length) => {
        const isDraft = record?.status === "DRAFT";
        const statusLabel = record?.status === "ACTIVE" ? "Active" : record?.status === "INACTIVE" ? "Inactive" : "Activate Draft";
        const handleClick = () => {
          isDraft && setOpenModal(true);
          setDahId(record.dahId);
          form.setFieldsValue({
            startDate:
              record.startDate === null
                ? moment()
                : moment(record.startDate).clone("YYYY-MM-DD"),
            endDate:
              record.endDate === null
                ? null
                : moment(record.endDate).clone("YYYY-MM-DD "),
          });
          setModalType("activation");
        };
        return (
          <>
            {data_length > 3 ?
              <ButtonComponent
                onClick={handleClick}
                border={false}
                disabled={!isDraft}
              >
                <Checkbox checked={record?.status === "ACTIVE"} />

                <span className={"text-black"}>{statusLabel}</span>
              </ButtonComponent>
              :
              <Tooltip title={statusLabel}>
                <div className={isDraft ? 'cursor-pointer' : 'cursor-not-allowed'}
                  onClick={handleClick}>
                  <Checkbox checked={record?.status === "ACTIVE"} className={isDraft ? 'cursor-pointer' : 'cursor-not-allowed'} disabled={!isDraft} />
                </div>
              </Tooltip>
            }

          </>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (record, data_length) => {
        const isInactive = record?.status === "INACTIVE";
        const icon = data_length > 3 ?
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" color={isInactive ? "#8D91A0" : "#0075bf"} width={24} className={isInactive ? "cursor-not-allowed" : ""} />}
            border={false}
            disabled={isInactive}>
            <span className={isInactive ? "text-[#8D91A0]" : "text-black"}> Update</span>
          </ButtonComponent>
          :
          <SVGIcon name="IconEdit" color={isInactive ? "#C0BEC6" : "#ACC424"} width={24} className={isInactive ? "cursor-not-allowed" : ""} />;
        return (
          <Tooltip title="Update">
            {isInactive ?
              <div className="cursor-not-allowed">{icon}</div>
              :
              <NavLink to={USER_ROUTES.UPDATE_DATA_ACCESS} state={{ id: record?.dahId }}>
                {icon}
              </NavLink>
            }
          </Tooltip>
        )
      }
    },
    {
      action: 'duplicate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <>
            {data_length > 3 ?
              <ButtonComponent
                icon={<CopyOutlined style={{ fontSize: "24px" }} />}
                border={false}
                onClick={() => {
                  setOpenModal(true);
                  setDahId(record?.dahId);
                  form.setFieldsValue({ name: record?.name + " Copy" });
                  setModalType("duplication");
                }}>
                {data_length > 3 &&
                  <span className={'text-black'}> Duplicate</span>

                }
              </ButtonComponent>
              :
              <Tooltip title="Duplicate">
                <div className={`cursor-pointer`}
                  onClick={() => {
                    setOpenModal(true);
                    setDahId(record?.dahId);
                    form.setFieldsValue({ name: record?.name + " Copy" });
                    setModalType("duplication");
                  }}>
                  <CopyOutlined style={{ fontSize: "24px", color: "var(--primary)" }} />
                </div>
              </Tooltip>
            }
          </>
        )
      }
    },
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "ACTIVATION_DATA_ACCESS") {
        dispatch(activationDataAccess(body));
      } else if (bodyError?.action === "DUPLICATION_DATA_ACCESS") {
        dispatch(dupliacateDataAccess(body));
      } else if (bodyError?.action === "DOWNLOAD_DATA_ACCESS_VIEW") {
        handleDownload()
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  // use hooks handle retry
  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <>
      <Spin spinning={loading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <div className="w-full flex flex-col my-5 gap-5">
          <BaseContainer header={"DATA ACCESS HIERARCHY LIST"}>
            <TablePagination
              dataSource={data?.data?.result}
              columns={[...column, ...useColumnActionPermission(['view', 'duplicate', 'update', 'activate'], itemActions)]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              totalData={data?.data?.page?.totalElements}
              tableScrolled={{ y: 500, x: 1200 }}
              onSort={onSort}
            />
          </BaseContainer>
        </div>
        <ModalCustom
          isOpen={openModal}
          type={"confirmation"}
          header={
            modalType === "duplication"
              ? "Duplicate Data Access Hierarchy"
              : "Activation Confirmation"
          }
          handleCancel={() => setOpenModal(false)}
          width={750}
        >
          {modalType === "duplication" ? (
            <div className={"mt-4"}>
              <Form
                form={form}
                layout="vertical"
                className="mt-3"
                onFinish={onDuplication}
              >
                <Form.Item name={"name"} label={"Hierarchy Name"}>
                  <Input placeholder="Type your remark" />
                </Form.Item>
                <div className={"w-full flex justify-end gap-3"}>
                  <Form.Item>
                    <ButtonComponent
                      type={"default"}
                      onClick={() => {
                        setOpenModal(false);
                        form.resetFields();
                      }}
                      border={true}
                    >
                      Back
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item>
                    <ButtonComponent
                      type={"submit"}
                      htmlType={"submit"}
                      border={false}
                    >
                      Save
                    </ButtonComponent>
                  </Form.Item>
                </div>
              </Form>
            </div>
          ) : (
            <div className={"mt-4"}>
              <div className="w-full modalTerminate">
                <Alert
                  icon={
                    <ExclamationCircleOutlined
                      style={{ fontSize: "24px", color: "#65481C" }}
                    />
                  }
                  message={
                    "Are you sure you want to activate Data Access Hierarchy?"
                  }
                  description={
                    "Warning! If you activate this hierarchy, the current active hierarchy will be inactivated."
                  }
                  type={"warning"}
                  showIcon
                />
              </div>
              <Form
                form={form}
                layout="vertical"
                className="mt-3"
                onFinish={onActivation}
              >
                <Form.Item name={"startDate"} label={"Start Date"}>
                  <DatePicker
                    className="w-full"
                    format={"DD MMM YYYY"}
                    disabled
                  />
                </Form.Item>
                <Form.Item name={"endDate"} label={"End Date"}>
                  <DatePicker
                    className="w-full"
                    format={"DD MMM YYYY"}
                    disabledDate={(current) => {
                      return (
                        current &&
                        current < moment(form.getFieldValue("startDate"))
                      );
                    }}
                  />
                </Form.Item>
                <div className={"w-full flex justify-end gap-2"}>
                  <Form.Item>
                    <ButtonComponent
                      type={"default"}
                      onClick={() => setOpenModal(false)}
                      border={true}
                    >
                      Cancel
                    </ButtonComponent>
                  </Form.Item>
                  <Form.Item>
                    <ButtonComponent
                      type={"submit"}
                      htmlType={"submit"}
                      border={false}
                    >
                      Confirm
                    </ButtonComponent>
                  </Form.Item>
                </div>
              </Form>
            </div>
          )}
        </ModalCustom>
      </Spin>

      {/* modal try again */}
      {renderModal()}
    </>
  );
};

export default DataAccessHierarchyView;
