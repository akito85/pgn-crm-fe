import React, { useRef } from "react";
import { Input, Checkbox, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { LeftOutlined } from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
// import DetailMenuLayout from "./DetailMenuLayout";
import { Fragment } from "react";
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import RelationshipDetail from "./RelationshipDetail";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
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

  // Search Column Table
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
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            display: "block",
          }}
        />
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "DIRECTION FLAG",
      dataIndex: "directionFlag",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("directionFlag"),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "SUBJECT TABLE",
      dataIndex: "subjectTable",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("subjectTable"),
    },
    {
      title: "SUBJECT ID",
      dataIndex: "subjectId",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("subjectId"),
    },
    {
      title: "SUBJECT NAME",
      dataIndex: "subjectName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("subjectName"),
    },
    {
      title: "OBJECT TABLE",
      dataIndex: "objectTable",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("objectTable"),
    },
    {
      title: "OBJECT ID",
      dataIndex: "objectId",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("objectId"),
    },
    {
      title: "OBJECT NAME",
      dataIndex: "objectName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("objectName"),
    },
    {
      title: "RELATION CODE",
      dataIndex: "relationCode",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("relationCode"),
    },
    {
      title: "START DATE",
      width: 200,
      dataIndex: "startDate",
      render: (startDate) => moment(startDate).format("DD MMM YYYY"),
      sorter: true,
      ...getColumnSearchProps("startDate"),
    },
    {
      title: "END DATE",
      width: 200,
      dataIndex: "endDate",
      render: (endDate) => moment(endDate).format("DD MMM YYYY"),
      sorter: true,
      ...getColumnSearchProps("endDate"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 100,
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{index}</StatusComponent>
        </div>
      ),
    },
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
