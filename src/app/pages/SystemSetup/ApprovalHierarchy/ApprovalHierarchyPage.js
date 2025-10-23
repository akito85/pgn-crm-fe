import {
  DownloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Checkbox,
  Form,
  Spin,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TablePagination from "../../../../components/TablePagination";
import {
  detailPositionHierarchy,
  downloadHierarchy,
  getApprovHierarchyPaginate,
  inactiveAppHierarchy,
} from "../../../../redux/slices/user_management/hierarchySlice";
import SVGIcon from "../../../../assets/Icon/index";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import CardComponent from "../../../../components/Card/CardComponent";
import {
  isEmpty,
  renderColumn,
  renderDateColumn,
  toTitleCase,
} from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchProps } from "../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../utils/sorterFunction";
import { updatePagination } from "../../../../utils/updatePagination";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const ApprovalHierarchyPage = () => {
  const { data, data_detail, loading } = useSelector(
    (state) => state.apphierarchy
  );
  const dispatch = useDispatch();
  const { bodyError } = useSelector(state => state?.general);


  // use state
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageDetail, setPageDetail] = useState(1);
  const [pageSizeDetail, setPageSizeDetail] = useState(10);
  const [form] = Form.useForm();
  const [status, setStatus] = useState("");
  const [modalType, setModalType] = useState("");
  const [appHierId, setAppHierId] = useState("");
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [search2, setSearch2] = useState({});
  const [searchText, setSearchText] = useState("");
  const [body, setBody] = useState({});
  const [record, setRecord] = useState({});
  const [sort, setSort] = useState("");
  const searchInput2 = useRef(null);
  const [searchedColumn2, setSearchedColumn2] = useState("");
  const [searchText2, setSearchText2] = useState("");
  const [typeColumn, setTypeColumn] = useState('string');


  // const handle fecth 
  const handleFetch = useCallback(() => {
    dispatch(
      getApprovHierarchyPaginate({ page, pageSize, sort, search: encodeURIComponent(JSON?.stringify(search)) })
    );
  }, [dispatch, page, pageSize, search, sort]);


  // use effect
  useEffect(() => {
    handleFetch()
  }, [handleFetch]);

  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(detailPositionHierarchy(id))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      setOpenModal(false);

    }
  };


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

  const handleSearch2 = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText2(selectedKeys[0]);
    switch (dataIndex) {
      case 'createdDate':
        setTypeColumn('datetime')
        break;
      case 'operation':
        setTypeColumn('status')
        break;
      default:
        setTypeColumn('string')
        break;
    }
    setSearchedColumn2(dataIndex);
    setSearch2((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeDetail !== pageSizeChange ? 1 : pageChange;
    setPageDetail(tempPage);
    setPageSizeDetail(pageSizeChange);
  };

  // Search Column Table

  const colLog = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) =>
        (pageDetail - 1) * pageSizeDetail + index + 1,
    },
    {
      title: "ACTOR",
      dataIndex: "createdBy",
      align: "left",
      sorter: (a, b) => sorterFunction('createdBy', a, b),
      ...getColumnSearchProps(
        "createdBy",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        true,
      ),
      render: (text) => renderColumn('createdBy', searchedColumn2, searchText2, text, false, 'input', search2)
    },
    {
      title: "ACTION",
      dataIndex: "operation",
      align: "left",
      width: 180,
      sorter: (a, b) => sorterFunction('operation', a, b),
      ...getColumnSearchProps(
        "operation",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        true,
        'status'
      ),
      render: (text) => renderColumn('operation', searchedColumn2, searchText2, text, false, 'input', search2)
    },
    {
      title: "ACTION DATE",
      dataIndex: "createdDate",
      align: "center",
      sorter: (a, b) => sorterFunction('createdDate', a, b, 'date'),
      ...getColumnSearchProps(
        "createdDate",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        false,
        'datetime'
      ),
      render: (text) => renderDateColumn('createdDate', searchedColumn2, searchText2, text, 'datetime', search2)
    },
    {
      title: "REMARK",
      dataIndex: "remark",
      sorter: (a, b) => a.remark?.localeCompare(b.remark),
      ...getColumnSearchProps(
        "remark",
        searchInput2,
        searchedColumn2,
        searchText2,
        handleSearch2,
        false,
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('remark', searchedColumn2, searchText2, text, true, 'input', search2)
    },
  ];

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },

    {
      title: "APPROVAL HIERARCHY NAME",
      dataIndex: "approvalName",
      sorter: true,
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "approvalName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn('approvalName', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "TYPE",
      dataIndex: "approvalType",
      sorter: true,
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "approvalType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('approvalType', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "desc",
      sorter: true,
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchProps(
        "desc",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('desc', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      align: "center",
      key: "status",
      sorter: true,
      width: 120,
      fixed: 'right',
      ...getColumnSearchProps(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
  ];

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: "",
      breadcrumbName: "Approval Hierarchy",
    },
  ];

  // handle cancel modals
  const handleCancelModal = () => {
    form.resetFields();
    setModalType('')
    setOpenModal(false);
    setRecord({});
  }

  // handle onfinish
  const onFinish = async (formValue, handleCancel) => {
    try {
      const payload = {
        id: appHierId,
        body: { ...formValue, status },
      }
      setBody(payload)
      handleCancel()
      handleCancelModal()
      await dispatch(
        inactiveAppHierarchy(payload)
      )?.unwrap();
      await handleFetch()?.unwrap()
    } catch (error) {
      await handleFetch()?.unwrap()
      handleCancelModal()
    }
  };

  // handle download
  const handleDownload = async () => {
    try {
      await dispatch(
        downloadHierarchy({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      )?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap()
    }
  }

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  // item actions 
  const itemActions = [
    // toolbar items
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={USER_ROUTES.CREATE_APPROVAL_HIERARCHY}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type={"submit"}
          >
            Create Approval Hierarchy
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
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record?.appHierId);
                setModalType("detail");
              }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <NavLink
              to={record?.status !== "INACTIVE" && USER_ROUTES.UPDATE_APPROVAL_HIERARCHY}
              state={record?.status !== "INACTIVE" && { id: record?.appHierId }}
              className={record?.status === "INACTIVE" && "cursor-not-allowed"}>
              {data_length > 3 ?
                <ButtonComponent
                  icon={<SVGIcon name="IconEdit" color={record?.status === "INACTIVE" ? "#C0BEC6" : "#ACC424"} width={24} className={record?.status === "INACTIVE" && "cursor-not-allowed"} />}
                  border={false}
                  disabled={record?.status === "INACTIVE" && true}>
                  <span className={"text-black"}> Update</span>
                </ButtonComponent>
                :
                <SVGIcon name="IconEdit" color={record?.status === "INACTIVE" ? "#C0BEC6" : "#ACC424"} width={24} className={record?.status === "INACTIVE" && "cursor-not-allowed"} />
              }
            </NavLink>
          </Tooltip>
        )
      }
    },
    {
      action: 'Activate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title={record?.status === 'ACTIVE' ? 'Inactivate' : 'Activate'}>
            <Link>
              <div>
                <Checkbox
                  onClick={() => {
                    setOpenModal(true);
                    setModalType("inactive");
                    setStatus(record?.status);
                    setAppHierId(record?.appHierId);
                    setRecord(record)
                  }}
                  checked={record?.status !== "ACTIVE"}
                />
              </div>
            </Link>
          </Tooltip>
        )
      }
    },

  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_APPROVAL_HIERARCHY") {
        dispatch(inactiveAppHierarchy(body));
      } else if (bodyError?.action === "GET_APPROVAL_HIERARCHY_DETAIL") {
        dispatch(detailPositionHierarchy(body))
      } else if (bodyError?.action === "DOWNLOAD_APPROVAL") {
        handleDownload()
      }
      handleCancelModal()
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };


  // use hooks handle retry
  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"Approval Hierarchy List"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={data?.result}
              totalData={data?.page?.totalElements}
              current={page}
              onChange={handleChange}
              pageSize={pageSize}
              columns={[...columns, ...useColumnActionPermission(['view', 'activate', 'update'], itemActions)]}
              onSort={onSort}
              tableScrolled={{ y: 500, x: 1300 }}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* MODAL DETAIL */}
      <ModalCustom
        isOpen={openModal && modalType === "detail"}
        handleCancel={handleCancelModal}
        header={modalType === "detail" && "Detail Approval Hierarchy Information"}
        width={1200}
        type={modalType === "detail" && "detail"}
      >
        <Spin spinning={loading}>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col col-span-2 gap-4 h-fit">
              <CardComponent
                header={" APPROVAL HIERARCHY INFORMATION"}
                cols={3}
              >
                <DetailText label={"Approval Hierarchy  Name"}>
                  {data_detail?.approvalName}
                </DetailText>
                {/* <DetailText label={"Approval Hierarchy Code"}>
                      {data_detail?.approvalCode}
                    </DetailText> */}
                <DetailText label={"Type"}>
                  {data_detail?.approvalType}
                </DetailText>
                <DetailText label={"Status"}>
                  {toTitleCase(data_detail?.status)}
                </DetailText>
                <DetailText label={"Description"}>
                  {data_detail?.desc}
                </DetailText>
              </CardComponent>
              <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
                <DetailText label={"Record Id"}>{
                  data_detail?.appHierId}
                </DetailText>
                <DetailText label={"Created Date"}>
                  {isEmpty(data_detail?.createdDate) && moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
                </DetailText>
                <DetailText label={"Created By"}>
                  {data_detail?.createdBy}
                </DetailText>
                <DetailText label={"Updated Date"}>
                  {isEmpty(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
                </DetailText>
                <DetailText label={"Updated By"}>
                  {data_detail?.updatedBy}
                </DetailText>
              </CardComponent>
            </div>
            <div className="h-auto mb-3">
              <div className="h-full bg-detail p-4 mb-3 rounded-md">
                <div className="text-primary text-xs font-semibold uppercase pb-[30px]">
                  APPROVAL Hierarchy
                </div>
                {data_detail?.detail?.map((item, idx) => (
                  <DetailText key={idx} label={item.positionName}>
                    {item.text}
                  </DetailText>
                ))}
              </div>
            </div>
          </div>
          <div className={" flex flex-col my-5 gap-5"}>
            <span className="text-dg-blue text-sm gap-5 ">
              ACTIVE/INACTIVE LOG INFORMATION
            </span>
            <TablePaginationNew
              type="FE"
              dataSource={data_detail?.logActiveInactive}
              // totalData={updatePagination(data_detail?.logActiveInactive, 'length', searchedColumn2, searchText2, pageDetail, pageSizeDetail, typeColumn)}
              current={pageDetail}
              onChange={handleChangeDetail}
              // onSizeChanger={handleChangeSizeDetail}
              pageSize={pageSizeDetail}
              columns={colLog}
              tableScrolled={{ y: 525, x: 900 }}
            />
          </div>

          <div className="flex justify-end mt-8">
            <ButtonComponent
              onClick={() => setOpenModal(false)}
              border={true}
            >
              Back
            </ButtonComponent>
          </div>
        </Spin>
      </ModalCustom>

      {/* modal active inactive */}
      <ModalApproveOrReject
        isOpen={openModal && modalType === 'inactive'}
        handleCloseModal={handleCancelModal}
        onFinish={onFinish}
        header={status === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={
          status === "INACTIVE" ? "activate" : "inactivate"
        }
        menu={"Approval Hierarchy"}
        named={record?.approvalName}
        width={800}
      />

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};
export default ApprovalHierarchyPage;
