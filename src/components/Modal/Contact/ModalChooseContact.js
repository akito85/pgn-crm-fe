import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ModalCustom from "../ModalCustom";
import ButtonComponent from "../../ButtonComponent";
import { getColumnSearchProps } from "../../../utils/getColumnSearchProps";
import { Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import NxTable from "../../Nx/NxTable";

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
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sort, setSort] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [totalElements, setTotalElements] = useState(0);

  const hasMore = dataTable.length < totalElements;

  useEffect(() => {
    if (isOpen) {
      dispactherChoose(page, pageSize, sort, search);
    }
  }, [isOpen, page, sort, search]);

  // accumulate data per page
  useEffect(() => {
    if (dataChoose?.data?.result?.length > 0) {
      setTotalElements(dataChoose?.data?.page?.totalElements);
      const newItems = dataChoose.data.result.map((item, index) => ({
        ...item,
        key: item.id?.toString() || `${page}-${index + 1}`,
        contactDetails: item.contactDetails?.map((d, i) => ({
          ...d,
          key: i + 1,
        })),
      }));
      setDataTable((prev) => {
        if (page === 1) return newItems;
        const existingIds = new Set(prev.map((item) => item.id));
        const merged = [...prev];
        newItems.forEach((item) => {
          if (!existingIds.has(item.id)) merged.push(item);
        });
        return merged;
      });
    } else if (page === 1) {
      setDataTable([]);
    }
  }, [dataChoose]);

  // handle search
  const handleSearch = useCallback((selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setPage(1);
    setDataTable([]);
    setSearch((prevState) => ({
      ...prevState,
      [dataIndex]: selectedKeys[0],
    }));
  }, []);

  const columns = useMemo(() => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
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
          handleChooseContact
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
          handleChooseContact
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
          handleChooseContact
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
          handleChooseContact
        ),
        render: (type) => <span>{type}</span>,
      },
      {
        title: "ACTION",
        align: "center",
        dataIndex: "id",
        width: 100,
        fixed: "right",
        render: (v, r) => (
          <div className="flex justify-center gap-2">
            <Tooltip title="Choose">
              <PlusCircleOutlined
                onClick={() => handleChooseContact(r)}
                style={{ color: "#0075BF", cursor: "pointer" }}
              />
            </Tooltip>
          </div>
        ),
      },
    ];
  }, [handleChooseContact, handleSearch, searchText, searchedColumn]);

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
      },
      {
        title: "VALUE",
        dataIndex: "fullValue",
      },
    ];

    return (
      <div className="pl-6 py-2">
        <NxTable
          idTable={`table-contact-detail-expand-${record.key}`}
          dataSource={record?.contactDetails}
          columns={column}
          useSelect={false}
          usePagination={false}
          showAdvanceSearch={false}
          showSearchBar={false}
          tableScrolled={{ x: "max-content" }}
        />
      </div>
    );
  };

  const onSort = (_, __, sortInfo) => {
    const dataSort =
      sortInfo.order !== undefined
        ? `${sortInfo.field}~${sortInfo.order === "ascend" ? "asc" : "desc"}`
        : "";
    setPage(1);
    setDataTable([]);
    setSort(dataSort);
  };

  const handleLoadMore = async () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
    return Promise.resolve();
  };

  const handleClose = useCallback(() => {
    handleCancelModalChoose();
    setPage(1);
    setDataTable([]);
    setTotalElements(0);
  }, [handleCancelModalChoose]);

  return (
    <ModalCustom
      isOpen={isOpen}
      type="confirmation"
      header={"Choose Contact"}
      handleCancel={handleClose}
      width={1200}
      footer={[
        <div className="w-full flex justify-end">
          <div style={{ width: "120px" }}>
            <ButtonComponent onClick={handleClose}>Back</ButtonComponent>
          </div>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-y-4">
        <NxTable
          idTable="table-choose-contact"
          dataSource={dataTable}
          columns={columns}
          totalData={totalElements}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          useSelect={true}
          showAdvanceSearch={false}
          showSearchBar={true}
          expandable={{ expandedRowRender }}
          onSort={onSort}
          tableScrolled={{ y: 400, x: "max-content" }}
        />
      </div>
    </ModalCustom>
  );
};

export default ModalChooseContact;
