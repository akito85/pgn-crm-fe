import React, { useRef } from "react";
import { Input, Checkbox, Tooltip } from "antd";
import Highlighter from "react-highlight-words";

import { useNavigate } from "react-router-dom";
import StatusComponent from "../../../../../../components/StatusComponent";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
// import DetailMenuLayout from "./DetailMenuLayout";
import { Fragment } from "react";
import moment from "moment";

const data = [
  {
    actId: "ACT-001",
    type: "Meter Reading",
    description: "Meter Reading",
    cRemark: "Meter Reading",
    startDate: "2021-08-01",
    endDate: "2021-08-31",
    status: "CLOSED",
  },
  {
    actId: "ACT-002",
    type: "Meter Reading",
    description: "Meter Reading",
    cRemark: "Meter Reading",
    startDate: "2021-08-01",
    endDate: "2021-08-31",
    status: "OPEN",
  },
];

const ServicePointActivityTable = () => {
  //   const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const navigate = useNavigate;
  const [pageSize, setPageSize] = useState(10);
  const [modalInactive, setModalInactive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalActivationChanges, setModalActivionChanges] = useState(false);
  const [id, setId] = useState("");
  const [status, setStatus] = useState();
  const searchInput = useRef(null);
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
  const handleDetail = (id) => {
    // dispatch(getTosDetail(id));
  };

  //handle Modal Pop up
  // const handleOpenModalInactivate = (data) => {
  // 	setModalInactive(true);
  // };
  // const handleCancelModalInactivate = () => {
  // 	setModalInactive(false);
  // };
  // const handleSubmitModalActivate = (res, handleClear) => {

  // };
  const handleOpenModalActivation = () => {
    setModalActivionChanges(true);
  };
  const handleCancelModalActivation = () => {
    setModalActivionChanges(false);
  };
  const handleSubmitModalInactivate = (res, handleClear) => {};

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
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACTIVITIES ID",
      dataIndex: "actId",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("actId"),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("type"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("description"),
    },
    {
      title: "COMPLETION REMARK",
      dataIndex: "cRemark",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("cRemark"),
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
          <StatusComponent colour={index === "CLOSED" ? "active" : "inactive"}>
            {index}
          </StatusComponent>
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
          <div className="flex justify-center align-middle gap-2">
            <Tooltip>
              <SVGIcon
                name="IconDetail"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  setModalDetail(true);
                  handleDetail(r.id);
                }}
              />
            </Tooltip>
            {r.status === "CLOSED" ? (
              <Tooltip>
                <Checkbox
                  // onClick={() => {
                  //   handleActiveOrInactive(record);
                  // }}
                  checked={r.status === "CLOSED" ? true : false}
                ></Checkbox>
              </Tooltip>
            ) : null}
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
      {/* <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Term Of Services"
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
        <TosDetail data_detail={data_detail} />
      </ModalCustom> */}

      {/* <ModalError
        isOpen={modalError}
        handleOk={() => setModalError(false)}
        handleCancel={() => setModalError(false)}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconInactive" width={48} />
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-[70px]">
            {`Your data was not inactivate. Please try again.`}
          </p>
        </div>
      </ModalError>

      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={() => setModalSuccess(false)}
        handleCancel={() => setModalSuccess(false)}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            <CloseCircleOutlined
              style={{ fontSize: "24px", color: "#ACC424" }}
            />
            <p className="text-[18px] font-bold">Successful</p>
          </div>
          <p className="pl-11">Your data has been inactivate</p>
        </div>
      </ModalSuccess>

      {/* modal active */}
      {/* <ModalConfirm
        isOpen={modalActivationChanges}
        handleCancel={() => handleCancelModalActivation()}
        handleOk={() => {
          handleCancelModalActivation();
          setModalSuccess(true);
        }}
        header={status === "active" ? "Inactive" : "Active"}
        width={500}
      >
        <div className="flex flex-col px-8 py-2">
          <div className="flex justify-start gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to{" "}
              {status === "INACTIVE" ? "active" : "inactive"}?
            </p>
          </div>
          <div className={"w-full justify-center my-4 flex text-sm"}>
            {status === "ACTIVE" ? (
              <Alert
                message={
                  "Warning! If you inactivate this data, it can't be use."
                }
                type={"error"}
                icon={status === "ACTIVE" && <WarningOutlined />}
              />
            ) : null}
          </div>
        </div>
      </ModalConfirm> */}
    </Fragment>
  );
};

export default ServicePointActivityTable;
