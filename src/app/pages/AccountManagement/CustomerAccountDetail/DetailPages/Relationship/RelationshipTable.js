import React, { useEffect, useRef } from "react";
import { Spin, Input, Form, Alert, Popover, Checkbox, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import {
  DownloadOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  EditOutlined,
  WarningOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  CheckSquareOutlined,
  CheckSquareFilled,
  LeftOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
// import DetailMenuLayout from "./DetailMenuLayout";
import { Fragment } from "react";
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { setData } from "../../../../../../redux/slices/data_slice";
import RelationshipDetail from "./RelationshipDetail";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import getRelatedDetailColumns from "./getRelatedDetailColumns";
const data = [
  {
    startDate: "2021-08-01",
    endDate: "2021-08-31",
    directionFlag: "ACT-001",
    category: "INACTIVE",
    subjectTable: "AMR",
    subjectId: "AMR-001",
    subjectName: "Turbine",
    objectTable: "PGN AMR",
    objectId: "PGN",
    objectName: "2021",
    relationCode: "Yes",
    status: "Active",
    createdBy: "Annisa",
    createdDate: "21 Agustus 2023 11:03:55",
    updatedBy: "Annisa",
    updatedDate: "22 Agustus 2023 11:03:55",
  },
  {
    startDate: "2021-08-01",
    endDate: "2021-08-31",
    directionFlag: "ACT-001",
    category: "INACTIVE",
    subjectTable: "AMR",
    subjectId: "AMR-001",
    subjectName: "Turbine",
    objectTable: "PGN AMR",
    objectId: "PGN",
    objectName: "2021",
    relationCode: "Yes",
    status: "Inactive",
    createdBy: "Annisa",
    createdDate: "21 Agustus 2023 11:03:55",
    updatedBy: "Annisa",
    updatedDate: "22 Agustus 2023 11:03:55",
  },
];

const RelationshipTable = ({ handleChangeInteraction = () => {} }) => {
  //   const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [modalInactive, setModalInactive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState();
  const searchInput = useRef(null);
  const [data_detail, setDataDetail] = useState();
  const [modalSuccess, setModalSuccess] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  //   useEffect(() => {
  //     dispatch(getAllTosPaginate({ page, pageSize }));
  //   }, [dispatch, page, pageSize]);

  //handle on-changes listener
  const handleChange = (page) => {
    setPage(page);
    // dispatch(getAllTosPaginate({ page, pageSize, sort }));
  };
  const handleChangeSize = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
    // dispatch(
    //   getAllTosPaginate({ page: tempPage, pageSize: pageSizeChange, sort })
    // );
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
  const handleDetail = (record) => {
    // dispatch(getTosDetail(id));
    setDataDetail(record);
  };

  //handle Modal Pop up
  // const handleOpenModalInactivate = (data) => {
  // 	setModalInactive(true);
  // };
  // const handleCancelModalInactivate = () => {
  // 	setModalInactive(false);
  // };
  // const handleSubmitModalActivate = (res, handleClear) => {

  // // };
  // const handleOpenModalActivation = () => {
  //   setModalActivionChanges(true);
  // };
  // const handleCancelModalActivation = () => {
  //   setModalActivionChanges(false);
  // };
  // const handleSubmitModalInactivate = (res, handleClear) => {};

  // Search Column Table - replaced by getRelatedDetailColumns

  const columns = [
    ...getRelatedDetailColumns(
      page,
      pageSize,
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    {
      title: "ACTIONS",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip>
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  handleDetail(r);
                  setModalDetail(true);

                  // setModalConfirm(true);
                }}
              />
            </Tooltip>
            <NavLink
              to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP}
              state={{ id: r.id }}
            >
              <Tooltip title="Edit">
                <SVGIcon name="IconEdit" width={24} />
              </Tooltip>
            </NavLink>
            <Tooltip>
              <Checkbox
                // onClick={() => {
                //   handleActiveOrInactive(record);
                // }}
                checked={r.status === "Active" ? true : false}
              ></Checkbox>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    let obj = { page: 1, pageSize };
    if (dataSort) {
      obj.sort = dataSort;
      setSort(dataSort);
    }
    // dispatch(getAllTosPaginate(obj));
  };

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={data?.length}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 1300 }}
        onSort={onSort}
        columns={columns}
      />

      {/* modal detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Relationship"
        width={700}
        handleCancel={() => {
          setModalDetail(false);
        }}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalDetail(false)}
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
          </div>
        }
      >
        <RelationshipDetail data_detail={data_detail} />
      </ModalCustom>
    </Fragment>
  );
};

export default RelationshipTable;
