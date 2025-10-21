import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ModalCustom from "../ModalCustom";
import ButtonComponent from "../../ButtonComponent";
import { getColumnSearchProps } from "../../../utils/getColumnSearchProps";
import { Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import TablePagination from "../../TablePagination";
import TablePaginationNew from "../../TablePaginationNew";

const ModalChooseContact = ({
  isOpen,
  dispactherChoose = () => {},
  handleCancelModalChoose = () => {},
  dataChoose = [],
  formContact,
  handleChooseContact = () => {},
  datas = {},
}) => {
  const searchInput = useRef(null);
  const [pageChoose, setPageChoose] = useState(1);
  const [pageChooseSize, setPageChooseSize] = useState(10);
  const [sort, setSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  useEffect(() => {
    if (isOpen) {
      dispactherChoose(pageChoose, pageChooseSize, sort, search);
    }
  }, [isOpen, pageChoose, pageChooseSize, search, sort]);

  // handle search
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageChoose(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  }, []);
  const columns = useMemo(() => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) =>
          (pageChoose - 1) * pageChooseSize + index + 1,
      },
      {
        title: "CONTACT NAME",
        dataIndex: "contactName",
        sorter: true,
        ...getColumnSearchProps(
          "contactName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleChooseContact,
        ),
      },
      {
        title: "JOB TITLE",
        dataIndex: "jobName",
        sorter: true,
        align: "center",
        ...getColumnSearchProps(
          "jobName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleChooseContact,
        ),
        render: (type) => <span>{type}</span>,
      },
      {
        title: "POSITION",
        dataIndex: "positionName",
        sorter: true,
        align: "center",
        ...getColumnSearchProps(
          "positionName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleChooseContact,
        ),
        render: (type) => <span>{type}</span>,
      },
      {
        title: "SOURCE",
        dataIndex: "source",
        sorter: true,
        align: "center",
        ...getColumnSearchProps(
          "source",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          handleChooseContact,
        ),
        render: (type) => <span>{type}</span>,
      },
      {
        title: "ACTION",
        align: "center",
        dataIndex: "id",
        width: 100,
        fixed: "right",
        render: (v, r, i) => {
          return (
            <div className="flex justify-center gap-2">
              <Tooltip title="Choose">
                <PlusCircleOutlined
                  onClick={() => handleChooseContact(r)}
                  style={{
                    color: "#0075BF",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];
  }, [
    handleChooseContact,
    handleSearch,
    pageChoose,
    pageChooseSize,
    searchText,
    searchedColumn,
  ]);

  // expand row render
  const expandedRowRender = (record) => {
    const column = [
      {
        title: "NO",
        align: "center",
        width: 60,
        render: (text, object, index) => index + 1,
      },
      {
        title: "TYPE",
        dataIndex: "typeName",
        width: 250,
      },
      {
        title: "INPUT TYPE",
        dataIndex: "inputTypeName",
        // editable: true,
        // sorter: true,
        // inputType: "select",
        // options: dataInputType,
      },
      {
        title: "VALUE",
        dataIndex: "fullValue",
        // width: 350,
      },
    ];

    return (
      <div>
        <TablePagination
          useSelect={false}
          usePagination={false}
          // onSort={onSort}
          dataSource={record?.contactDetails}
          columns={column}
        />
      </div>
    );
  };

  const handleChange = useCallback(
    (pageChange, pageSizeChange) => {
      const tempPage = pageChooseSize !== pageSizeChange ? 1 : pageChange;
      setPageChoose(tempPage);
      setPageChooseSize(pageSizeChange);
    },
    [pageChooseSize],
  );

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const resetState = useCallback(() => {
    setPageChoose(1);
    setPageChooseSize(10);
  }, []);

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header={"Choose Contact"}
      handleCancel={() => {
        handleCancelModalChoose();
        resetState();
      }}
      width={1200}
      footer={[
        <ButtonComponent onClick={handleCancelModalChoose}>
          Back
        </ButtonComponent>,
      ]}
    >
      <TablePagination
        totalData={dataChoose?.data?.page?.totalElements}
        dataSource={dataChoose?.data?.result?.map((item, index) => {
          return { ...item, key: (index + 1)?.toString() };
        })}
        columns={columns}
        current={pageChoose}
        pageSize={pageChooseSize}
        expandable={{
          expandedRowRender,
        }}
        onChange={handleChange}
        onSizeChanger={handleChange}
        onSort={onSort}
        tableScrolled={{ x: 500, y: 500 }}
      />
    </ModalCustom>
  );
};

export default ModalChooseContact;
