import React, { useCallback, useEffect, useRef } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import {
  Spin,
  Tooltip,
  Checkbox,
} from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  DownloadOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import { useState } from "react";
import DetailText from "../../../../components/DetailText";
import moment from "moment";
import { hasValue, renderColumn, toTitleCase } from "../../../../utils";
import {
  downloadAction,
  getAllActionPaginate,
  getDetailAction,
  inactiveAction,
} from "../../../../redux/slices/system_setup/action";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import TablePagination from "../../../../components/TablePagination";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import CardComponent from "../../../../components/Card/CardComponent";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

const Action = () => {
  const dispatch = useDispatch();
  const { data, data_detail, loading } = useSelector(
    (state) => state.action
  );
  const { bodyError } = useSelector(state => state?.general);

  // state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalDetail, setModalDetail] = useState(false);
  const [actId, setActId] = useState("");
  const [modalActive, setModalActive] = useState(false);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalError, setModalError] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [status, setStatus] = useState("");
  const [body, setBody] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllActionPaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort })
    );
  }, [dispatch, page, pageSize, search, sort]);

  // use useEffect
  useEffect(() => {
    handleFetch();
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
  const columns = [
    {
      title: "NO",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTION NAME",
      dataIndex: "name",
      // width: 100,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('name', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      // width: "40%",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)

    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Action",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ACTION,
      breadcrumbName: "List Action",
    },
  ];

  // handle cancel modals
  const handleCancel = () => {
    setModalDetail(false);
    setModalActive(false);

  };


  // handle detail
  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(getDetailAction(id))?.unwrap();
      setModalDetail(true);
    } catch (error) {
      setModalDetail(false);
    }
  };

  // handle activation
  const handleOk = async () => {
    try {
      const payload = { id: actId, status };
      setBody(payload)
      handleCancel();
      await dispatch(inactiveAction(payload))?.unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
      handleCancel();
    }
  };

  const handleDownload = async () => {
    try {
      await dispatch(
        downloadAction({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort })
      )?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
    }
  }

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
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
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_ACTION}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Action
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
            <SVGIcon
              name="IconDetail"
              width={24}
              onClick={() => {
                handleDetail(record?.actionId);
              }}
            />
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
            <div className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
              <Link
                to={record?.status?.toLowerCase() !== "inactive" && SYSTEM_SETUP_ROUTES.UPDATE_ACTION}
                state={record?.status?.toLowerCase() !== "inactive" && { id: record?.actionId }}
              >
                <SVGIcon
                  className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                  color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"}
                  name="IconEdit" width={24} />
              </Link>
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: 'Activate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip
            title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                border={false}
                onClick={() => {
                  setModalActive(true);
                  setActId(record?.actionId);
                  setStatus(record.status);
                }}
                checked={record?.status !== "ACTIVE"}
              />
            </div>
          </Tooltip>
        )
      }
    }
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_ACTION") {
        dispatch(inactiveAction(body))
      } else if (bodyError?.action === "GET_DETAIL_ACTION") {
        dispatch(getDetailAction(body))
      } else if (bodyError?.action === "DOWNLOAD_ACTION") {
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
    <div>
      <Spin spinning={loading} className={"w-full top-20"}>
          <BreadCrumb routes={routes} />
          <Toolbar items={itemActions} />
          <Spin spinning={false} className={"w-full top-20"} tip={"Loading..."}>
            <BaseContainer header={"ACTION LIST"}>
              <div className={"w-full"}>
                <TablePagination
                  dataSource={data?.result}
                  totalData={data?.page?.totalElements}
                  current={page}
                  pageSize={pageSize}
                  onChange={handleChange}
                  columns={[...columns, ...useColumnActionPermission(['view', 'update', 'activate'], itemActions)]}
                  onSort={onSort}
                  tableScrolled={{ y: 500, x: 800 }}
                />
              </div>
            </BaseContainer>
          </Spin>

          {/* MODAL ACTIVE/INACTIVE */}
          <ModalConfirm
            isOpen={modalActive}
            handleCancel={() => setModalActive(false)}
            handleOk={handleOk}
            header={status === "active" ? "Inactive" : "Active"}
            width={500}
            useOk={true}
          >
            <div className="w-full flex flex-col mt-10 justify-end">
              <div className={"w-full flex flex-row items-center px-10"}>
                <WarningOutlined
                  style={{ color: "red" }}
                  className={"text-4xl"}
                />
                <span className={"text-lg text-black font-bold h-auto mx-auto"}>
                  {`Are you sure want to ${status === "ACTIVE" ? "inactivate" : "activate"
                    }?`}
                </span>
              </div>
            </div>
          </ModalConfirm>

          {/* MODAL DETAIL */}
          <ModalCustom
            isOpen={modalDetail}
            handleCancel={() => setModalDetail(false)}
            header={"DETAIL ACTION"}
            width={1000}
          >
            <div className="flex w-full flex-col gap-2">
              <div className={"grid grid-cols-1 gap-3"}>
                <CardComponent header={"ACTION INFORMATION"} cols={4}>
                  <DetailText label={"Action Name"}>
                    {data_detail?.name}
                  </DetailText>
                  <DetailText label={"Description"}>
                    {data_detail?.description}
                  </DetailText>
                  <DetailText label={"Status"}>
                    {toTitleCase(data_detail?.status)}
                  </DetailText>
                </CardComponent>
              </div>
            </div>
            <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
              <DetailText label={"Record Id"}>
                {data_detail?.actionId}
              </DetailText>
              <DetailText label={"Created Date"}>
                {

                  hasValue(data_detail?.createdDate) && moment(data_detail?.createdDate).format(
                    "DD MMM YYYY HH:mm:ss"
                  )}
              </DetailText>

              <DetailText label={"Created By"}>
                {data_detail?.createdBy}
              </DetailText>
              <DetailText label={"Updated Date"}>
                {
                  hasValue(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format(
                    "DD MMM YYYY HH:mm:ss"
                  )
                }
              </DetailText>
              <DetailText label={"Updated By"}>
                {data_detail?.updatedBy}
              </DetailText>
            </CardComponent>

            <div className="flex justify-end mt-8">
              <ButtonComponent
                // icon={<PlusCircleFilled style={{ fontSize: "16px" }} />}
                onClick={() => setModalDetail(false)}
                border={true}
              >
                Back
              </ButtonComponent>
            </div>
          </ModalCustom>

          {/* <ModalSuccess
            isOpen={modalSuccess}
            handleOk={() => setModalSuccess(false)}
            handleCancel={() => setModalSuccess(false)}
          >
            <div className="px-8 py-8 justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconSuccess" width={48} />
                <p className="text-[18px] font-bold">Successful</p>
              </div>
              <p className="pl-11">Your data has been Updated.</p>
            </div>
          </ModalSuccess> */}

          {/* Modal Error*/}
          <ModalError
            isOpen={modalError}
            handleOk={() => setModalError(false)}
            handleCancel={() => setModalError(false)}
          >
            <div className="px-8 py-8 justify-center">
              <div className="w-full flex gap-[20px]">
                <SVGIcon name="IconFailed" width={48} />
                <p className="text-[18px] font-bold">Failed</p>
              </div>
              <p className="pl-11">
                Your data was not created. Please try again.
              </p>
            </div>
          </ModalError>
        </Spin>

        {/* modal try again */}
        {renderModal()}
      </div>
    );
};

export default Action;
