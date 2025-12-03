import React from "react";
import { Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TablePagination from "../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../assets/Icon/index";
import { Fragment } from "react";
import moment from "moment";

const AttachmentTable = ({
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  getColumnSearchProps = () => {},
}) => {
  // const dispatch = useDispatch();
  // const { data_detail, loading } = useSelector(
  //   (state) => state.accountManagement
  // );
  const navigate = useNavigate;
  const [id, setId] = useState("");
  const [status, setStatus] = useState();

  const renderDate = (date) => {
    if (date) {
      return moment(date).format("DD MMM YYYY");
    } else {
      return "";
    }
  };

  const columns = [
    {
      title: "NO",
      width: "5%",
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("category"),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("fileName"),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "uploadBy",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("uploadBy"),
    },
    {
      title: "UPLOADED DATE",
      dataIndex: "uploadDate",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("uploadDate"),
      render: (endDate) => renderDate(endDate),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("fileSize"),
    },
    {
      title: "ACTIONS",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip>
              <SVGIcon
                name="IconEye"
                color={"#0075bf"}
                width={24}
                onClick={() => {
                  // handleDetail(r);
                  // setModalDetail(true);
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 1300 }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default AttachmentTable;
