import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ModalCustom from "../ModalCustom";
import ButtonComponent from "../../ButtonComponent";
import { getColumnSearchProps } from "../../../utils/getColumnSearchProps";
import { Button, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import NxTable from "../../Nx/NxTable";
import NxModal from "../../Nx/NxModal";
import ContactDetailExpandTable from "./ContactDetailExpandTable";

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
        key: "no",
        title: "NO",
        width: 50,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "contactName",
        title: "CONTACT NAME",
        dataIndex: "contactName",
        width: 240,
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
        key: "jobName",
        title: "JOB TITLE",
        dataIndex: "jobName",
        width: 240,
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
        width: 240,
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
        width: 240,
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
    <NxModal
      isOpen={isOpen}
      title={"Choose Contact"}
      handleCancel={handleClose}
      width={1200}
      footer={[
        <div className="w-full flex justify-end">
          <Button type="menu" onClick={handleClose}>Back</Button>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-y-4 p-4">
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
          expandable={{ expandedRowRender: dataTable.length ? (record) => <ContactDetailExpandTable contactDetails={record.contactDetails} /> : undefined }}
          onSort={onSort}
          tableScrolled={{ y: 400, x: "max-content" }}
        />
      </div>
    </NxModal>
  );
};

export default ModalChooseContact;
