import React from "react";
import { Tooltip } from "antd";
import { useState } from "react";
import TablePagination from "../../../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import ModalCustom from "../../../../../../../../../components/Modal/ModalCustom";

const TOSAttachmentTable = ({ 
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  getColumnSearchProps = () => {}}) => {
  // state
  const [modalDetail, setModalDetail] = useState();
  const [dataDetail, setDataDetail] = useState("");

  //   useEffect(() => {
  //     dispatch(getAllTosPaginate({ page, pageSize }));
  //   }, [dispatch, page, pageSize]);

  const handleDetail = (record) => {
    setDataDetail(record);
  };

  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "taxIdentifierTypeValue",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("taxIdentifierTypeValue"),
    },
    {
      title: "FILENAME",
      dataIndex: "taxIdentifierNumber",
      width: 200,
      sorter: true,
      ...getColumnSearchProps("taxIdentifierNumber"),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "taxIdentifierName",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("taxIdentifierName"),
    },
    {
      title: "UPLOADED DATE",
      dataIndex: "taxIdentifierAddressValue",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("taxIdentifierAddressValue"),
    },
    {
      title: "FILE SIZE",
      dataIndex: "taxIdentifierAddressValue",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("taxIdentifierAddressValue"),
    },
    {
      title: "ACTIONS",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <Tooltip>
            <SVGIcon
              name="IconDetail"
              color={"#0075bf"}
              width={24}
              onClick={() => {
                handleDetail(r);
                setModalDetail(true);
              }}
            />
          </Tooltip>
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

      {/* modal detail */}
      <ModalCustom
        isOpen={modalDetail}
        type="detail"
        header="Detail Tax Identifier"
        width={700}
        handleCancel={() => {
          setModalDetail(false);
        }}
      >
      </ModalCustom>
    </Fragment>
  );
};

export default TOSAttachmentTable;
