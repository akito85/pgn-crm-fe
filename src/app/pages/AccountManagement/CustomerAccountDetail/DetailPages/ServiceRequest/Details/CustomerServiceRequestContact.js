import { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import NxTable from "../../../../../../../components/Nx/NxTable";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { getContactsByServiceRequest } from "../../../../../../../redux/slices/account_management/detailAccount/ServiceRequestSlice";

// ── Expand sub-table (CONTACT DETAIL) ────────────────────────────────────────
const EXPAND_COLUMNS = [
  { title: "NO",    width: 60,  align: "center", render: (_, __, i) => i + 1 },
  { title: "TYPE",  dataIndex: "type",  width: 150 },
  { title: "VALUE", dataIndex: "value" },
];

const ExpandSubTable = ({ details = [] }) => (
  <div className="py-3 px-4 bg-[#f9fafb]">
    <div className="text-primary text-sm font-semibold uppercase mb-2 px-1">
      CONTACT DETAIL
    </div>
    <Table
      dataSource={details.map((d, i) => ({ ...d, key: d.id ?? i }))}
      columns={EXPAND_COLUMNS}
      pagination={false}
      size="small"
      bordered
      style={{ fontSize: 12 }}
    />
  </div>
);

// ── Main columns ──────────────────────────────────────────────────────────────
const MAIN_COLUMNS = [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (_, __, i) => i + 1,
  },
  {
    title: "PRIMARY",
    dataIndex: "primary",
    width: 80,
    sorter: true,
    filter: true,
    render: (v) => {
      const isYes = v === "Yes" || v === true || v === 1;
      return (
        <StatusComponent colour={isYes ? "active" : "inactive"} margin={false}>
          {isYes ? "Yes" : "No"}
        </StatusComponent>
      );
    },
  },
  { title: "CONTACT NAME",    dataIndex: "contactName",                   width: 160, sorter: true, filter: true },
  { title: "JOB",             dataIndex: "job",                           width: 140, sorter: true, filter: true },
  { title: "POSITION",        dataIndex: "position",                      width: 140, sorter: true, filter: true },
  { title: "CONTACT ADDRESS", dataIndex: "contactAddress",                width: 200, sorter: true, filter: true },
  { title: "ADDITIONAL NOTE", dataIndex: "contactAddressAdditionalNote",  width: 180, sorter: true, filter: true },
  { title: "DESCRIPTION",     dataIndex: "description",                   width: 200, sorter: true, filter: true },
  {
    title: "STATUS",
    dataIndex: "status",
    width: 100,
    sorter: true,
    filter: true,
    render: (v) => (
      <StatusComponent colour={(v || "").toLowerCase()} margin={false}>
        {v}
      </StatusComponent>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const CustomerServiceRequestContact = ({
  id,
  idAccount,
  onSort = () => {},
}) => {
  const dispatch = useDispatch();
  const [expandedKeys, setExpandedKeys] = useState([]);

  const { data_contacts, loading_contacts } = useSelector(
    (state) => state.serviceRequest
  );

  useEffect(() => {
    if (id && idAccount) {
      dispatch(getContactsByServiceRequest({ accountId: idAccount, srId: id }));
    }
  }, [dispatch, id, idAccount]);

  const contacts = Array.isArray(data_contacts) ? data_contacts : [];

  return (
    <NxTable
      idTable="sr-contact-table"
      dataSource={contacts.map((item, i) => ({ ...item, key: item.id ?? i }))}
      columns={MAIN_COLUMNS}
      usePagination={false}
      useInfiniteScroll={true}
      hasMore={false}
      showAdvanceSearch={false}
      showSearchBar={false}
      fontSize="small"
      tablePadding="small"
      tableScrolled={{ x: "max-content" }}
      loading={loading_contacts}
      onSort={onSort}
      expandable={{
        expandedRowKeys: expandedKeys,
        onExpand: (isExpanded, record) => {
          setExpandedKeys(
            isExpanded
              ? [...expandedKeys, record.key]
              : expandedKeys.filter((k) => k !== record.key)
          );
        },
        expandedRowRender: (record) => (
          <ExpandSubTable details={record.details || []} />
        ),
        rowExpandable: () => true,
      }}
    />
  );
};

export default CustomerServiceRequestContact;
