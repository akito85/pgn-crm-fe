import { PlusCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import { useEffect, useRef, useState, useNavigate } from "react";
import { useDispatch } from "react-redux";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import StatusComponent from "../../../../../../components/StatusComponent";
import TablePagination from "../../../../../../components/TablePagination";

const expandedRowRender = (record) => {
  // const contactDetail = record?.contactDetail;
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "type",
    },
    {
      title: "VALUE",
      dataIndex: "fullValue",
    },
  ];

  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase">CONTACT DETAL</p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        className="table-expand-custom"
        dataSource={""}
        columns={columns}
        tableScrolled={{
          x: 1000,
        }}
      />
    </div>
  );
};

const ModalChooseContact = ({
  isOpen,
  dataChooseContact,
  getDetailContactById = () => {},
  setModalChooseContact = () => {},
  setModalCreateNewContact,
  type,
}) => {
  const dispatch = useDispatch();
  // const { data_detail, loading } = useSelector(
  //   (state) => state.accountManagement
  // );
  const [page, setPage] = useState(1);
  // const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [typeModal, setTypeModal] = useState("");
  const [dataTable, setDataTable] = useState([]);

  // mapping for push key data
  // useEffect(() => {
  //   if (dataChooseContact?.data && dataChooseContact?.data?.length > 0) {
  //     const data = dataChooseContact?.data?.map((a, index) => ({
  //       ...a,
  //       key: index + 1,
  //       contactDetail: a.contactDetail?.map((b, index) => ({
  //         ...b,
  //         key: index + 1,
  //       })),
  //     }));
  //     setDataTable(data);
  //   }
  // }, [dataChooseContact]);

  const handleCloseModal = () => {
    setModalChooseContact((prevState) => (prevState = false));
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CONTACT NAME",
      dataIndex: "contactName",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("contactName"),
    },
    {
      title: "JOB TITLE",
      dataIndex: "jobTitle",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("jobTitle"),
    },
    {
      title: "CONTACT ADDRESS",
      dataIndex: "contactAddress",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("contactAddress"),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("description"),
    },
    {
      title: "PRIMARY",
      dataIndex: "primary",
      width: 150,
      sorter: true,
      // ...getColumnSearchProps("primary"),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 100,
      sorter: true,
      // ...getColumnSearchProps("status"),
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{index}</StatusComponent>
        </div>
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <Space>
            <Tooltip title="Detail">
              <PlusCircleOutlined
                onClick={() => getDetailContactById(r?.contactId)}
                style={{ color: "#0075BF", cursor: "pointer" }}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <ModalCustom
        header={"CHOOSE CONTACT"}
        isOpen={isOpen}
        type={"confirmation"}
        handleCancel={() => handleCloseModal()}
        width={1000}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent onClick={handleCloseModal} type="default">
              Back
            </ButtonComponent>
          </div>
        }
      >
        <div className="flex w-full justify-end gap-x-2 pb-6">
          <ButtonComponent
            type="submit"
            onClick={() => {
              setModalCreateNewContact(true);
            }}
          >
            Create
          </ButtonComponent>
        </div>
        <div className={"w-full"}>
          <TablePagination
            dataSource={dataTable}
            columns={columns}
            pageSize={pageSize}
            current={page}
            expandable={{ expandedRowRender }}
            // totalData={data.length}
            // onChange={handleChange}
            // onSizeChanger={handleChangeSize}
            tableScrolled={{ x: 1300 }}
          />
        </div>
      </ModalCustom>
    </div>
  );
};
export default ModalChooseContact;
