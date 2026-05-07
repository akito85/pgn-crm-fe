import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { getSrAttachments } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";

const COLUMNS = [
  { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
  {
    title: "TYPE",
    dataIndex: "type",
    width: 120,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "FILE NAME",
    dataIndex: "fileName",
    width: 300,
    sorter: true,
    filter: true,
    render: (v) => v || "-",
  },
  {
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 120,
    align: "center",
    sorter: true,
    filter: true,
    render: (v) => v ? `${(v / 1024).toFixed(1)} KB` : "-",
  },
  {
    title: "ACTION",
    align: "center",
    width: 80,
    fixed: "right",
    render: (_, record) => (
      <div className="flex w-full justify-center">
        <Tooltip title="View">
          <EyeOutlined
            style={{ color: "#0075bf", fontSize: "16px", cursor: "pointer" }}
            onClick={() => {
              if (record.pathFile) window.open(record.pathFile, "_blank");
            }}
          />
        </Tooltip>
      </div>
    ),
  },
];

const CustomerServiceRequestDetailAttch = ({
  id,
  idAccount,
  onSort = () => {},
}) => {
  const dispatch = useDispatch();

  const { list_srAttachments, loading_listSrAttachments } = useSelector(
    (state) => state.serviceRequest
  );

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getSrAttachments({ accountId: idAccount, srId: id }));
    }
  }, [dispatch, id, idAccount]);

  const items = Array.isArray(list_srAttachments) ? list_srAttachments : [];

  return (
    <NxBaseContainer border>
      <NxTable
        idTable="sr-attachment-table"
        dataSource={items.map((item, i) => ({ ...item, key: item.id ?? i }))}
        columns={COLUMNS}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={false}
        showAdvanceSearch={false}
        showSearchBar={false}
        fontSize="small"
        tablePadding="small"
        tableScrolled={{ x: "max-content" }}
        loading={loading_listSrAttachments}
        onSort={onSort}
      />
    </NxBaseContainer>
  );
};

export default CustomerServiceRequestDetailAttch;
