import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Spin, Tooltip } from "antd";
import moment from "moment";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import {  getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CardComponent from "../../../../../../components/Card/CardComponent";
import { dateFormatting, hasValue, renderColumn } from "../../../../../../utils";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import DetailText from "../../../../../../components/DetailText";
import {
  getDetailRateType,
  getDowloadRateType,
  getRateTypePaginate,
  inactiveMasterRateType,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/rateType";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";

export const columnRateType = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleModalDetail = () => {},
  handleModalInactive = () => {}
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "CODE",
    dataIndex: "code",
    key: "code",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "code",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (text) => renderColumn('code', hasValue(search['code']), searchText, text, false, 'input', search)
  },
  {
    title: "DESCRIPTION",
    dataIndex: "description",
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    ellipsis: {
      showTitle: false,
    },
    sorter: true,
    render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    fixed: "right",
    width: 150,
    sorter: true,
    align: "left",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (a) => {
      let text;
      switch (a) {
        case "ACTIVE":
          text = "Active";
          break;
        case "INACTIVE":
          text = "Inactive";
          break;
        default:
          text = a ? a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() : a;
          break;
      }
      return renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
    },
  },
];

const RateTypeView = () => {
  // Selector
  const { data_list, data_detail, loading } = useSelector(
    (state) => state.rate_type
  );

  // Declaration
  const dispatch = useDispatch();
  const location = useLocation();
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const id = location?.state?.id;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [idModal, setIdModal] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetailRate, setModalDetailRate] = useState(false);

  // Use Effect
  useEffect(() => {
    dispatch(
      getRateTypePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

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

  const handleModalDetail = (r) => {
    setModalDetailRate(true);
    dispatch(getDetailRateType(r?.typeId));
  };

  const handleModalInactive = (r) => {
    setModalInactive(true);
    setCode(r?.code);
    setStatus(r?.status);
    setIdModal(r?.typeId);
  };

  const confirmInactiveRate = (res, handleClear) => {
    setModalInactive(false);
    const body = {
      typeId: idModal,
      remark: res.remark,
    };
    dispatch(inactiveMasterRateType(body))
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(
          getRateTypePaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          })
        );
      });
  };

  const handleCancelInactiveRate = () => {
    setModalInactive(false);
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
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
              getDowloadRateType({
                search: tempSearch,
                page,
                pageSize,
                sort,
              })
            );
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.RATE_TYPE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Rate Type
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleModalDetail(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Update">
            <Link
              to={RBI_ROUTES.RATE_TYPE_UPDATE}
              state={{ id: record?.typeId }}
            >
              <div className="pt-1">
                <SVGIcon name="IconEdit" width={24} />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record) => {
        return (
          <Tooltip
            title={`${record?.status === "ACTIVE" ? "Inactivate" : "Activate"}`}
          >
            <div className="pt-1">
              <Checkbox
                className="inactive-check"
                checked={record?.status !== "ACTIVE"}
                disabled={record?.status === "ACTIVE" ? false : true}
                width={24}
                onClick={() => handleModalInactive(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <div className="w-full flex justify-end gap-[20px]">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"RATE TYPE LIST"}>
          <TablePaginationNew
            dataSource={data_list?.result}
            pageSize={pageSize}
            columns={[
              ...columnRateType(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleModalDetail,
                handleModalInactive
              ),
              ...useColumnActionPermission(
                ["view", "activate", "update", "history"],
                itemGrantAccess
              ),
            ]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data_list?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{
              x: 1000,
              y: 525,
            }}
          />
        </BaseContainer>

        {/* MODAL DETAIL */}
        <ModalCustom
          isOpen={modalDetailRate}
          handleCancel={() => {
            setModalDetailRate(false);
          }}
          header={"RATE TYPE DETAIL"}
          width={1000}
          type={"detail"}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type={"default"}
                onClick={() => setModalDetailRate(false)}
              >
                Cancel
              </ButtonComponent>
            </div>
          }
        >
          <CardComponent header={"RATE TYPE INFORMATION"} cols={1}>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 py-1">
              <DetailText label={"Code"}>{data_detail?.code}</DetailText>
              <DetailText label={"Status"}>
                {data_detail?.status
                  ? data_detail?.status.charAt(0).toUpperCase() +
                    data_detail?.status.slice(1).toLowerCase()
                  : data_detail?.status}
              </DetailText>
            </div>
            <div className="grid grid-cols-1 gap-y-2.5 gap-x-2 py-1">
              <DetailText label={"Description"}>
                {data_detail?.description}
              </DetailText>
            </div>
          </CardComponent>
          <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
            <DetailText label={"Record ID"}>{data_detail?.typeId}</DetailText>
            <DetailText label={"Created Date"}>
              {data_detail?.createdDate !== null
                ? moment(data_detail?.createdDate).format(
                    dateFormatting.dateTime
                  )
                : " "}
            </DetailText>
            <DetailText label={"Created By"}>
              {data_detail?.createdBy}
            </DetailText>
            <DetailText label={"Updated Date"}>
              {data_detail?.updatedDate !== null
                ? moment(data_detail?.updatedDate).format(
                    dateFormatting.dateTime
                  )
                : " "}
            </DetailText>
            <DetailText label={"Updated By"}>
              {data_detail?.updatedBy}
            </DetailText>
          </CardComponent>
        </ModalCustom>

        {/* MODAL ACTIVE/INACTIVE */}
        <ModalApproveOrReject
          isOpen={modalInactive}
          handleCloseModal={handleCancelInactiveRate}
          onFinish={confirmInactiveRate}
          header={"Inactive"}
          approveOrReject={"Inactive"}
          menu={"Rate Type"}
          named={code}
        />
      </Spin>
    </div>
  );
};

export default RateTypeView;
