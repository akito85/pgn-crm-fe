import { useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tooltip, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Pencil, Eye, CircleCheck, Ban, Trash2 } from "lucide-react";

import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import StatusComponent from "../../../../components/StatusComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTemplates, useSetTemplateActive } from "../../../../hooks/notifications/useNotificationAdmin";

// Columns follow the standard NxTable look (UPPERCASE titles, fixed NO + STATUS).
const columnsTemplates = [
  {
    title: "NO",
    align: "center",
    width: 60,
    key: "no",
    fixed: "left",
    render: (text, object, index) => index + 1,
  },
  {
    title: "CATEGORY",
    dataIndex: "category",
    key: "category",
    align: "left",
    width: 180,
    sorter: true,
    ellipsis: true,
    render: (text, r) => text || r.eventCode || "-",
  },
  {
    title: "MODULE",
    dataIndex: "module",
    key: "module",
    align: "left",
    width: 120,
    sorter: true,
    ellipsis: true,
    render: (v) => v || "-",
  },
  {
    title: "SUBMODULE",
    dataIndex: "submodule",
    key: "submodule",
    align: "left",
    width: 130,
    sorter: true,
    ellipsis: true,
    render: (v) => v || "-",
  },
  {
    title: "TEMPLATE CODE",
    dataIndex: "templateCode",
    key: "templateCode",
    align: "left",
    width: 200,
    sorter: true,
    ellipsis: true,
    render: (v) => v || "-",
  },
  {
    title: "CHANNEL",
    dataIndex: "channelType",
    key: "channelType",
    align: "center",
    width: 130,
    sorter: true,
  },
  {
    title: "LANGUAGE",
    dataIndex: "language",
    key: "language",
    align: "center",
    width: 110,
    sorter: true,
    render: (v) => v || "-",
  },
  {
    title: "DEFAULT",
    dataIndex: "isDefault",
    key: "isDefault",
    align: "center",
    width: 100,
    render: (v) => (v ? "Yes" : "-"),
  },
  {
    title: "UPDATED",
    dataIndex: "updatedAt",
    key: "updatedAt",
    align: "center",
    width: 170,
    sorter: true,
    render: (v) => (v ? new Date(v).toLocaleString() : "-"),
  },
  {
    title: "STATUS",
    dataIndex: "isActive",
    key: "isActive",
    align: "center",
    width: 120,
    fixed: "right",
    render: (v) => {
      const label = v ? "Active" : "Inactive";
      const code = v ? "ACTIVE" : "INACTIVE";
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <StatusComponent colour={code} size="small">
            {label}
          </StatusComponent>
        </div>
      );
    },
  },
];

const TemplatesList = () => {
  const rawToken = useSelector((state) => state.auth?.token);

  const userId = useMemo(() => {
    try {
      const t = JSON.parse(rawToken || "{}");
      return t?.userId || t?.id || t?.username || null;
    } catch {
      return null;
    }
  }, [rawToken]);

  const { data: templates = [], isLoading: loading, refetch } = useTemplates({});
  const setActiveMutation = useSetTemplateActive();

  const reload = () => refetch();

  const handleToggleActive = (record) => {
    setActiveMutation.mutate(
      { id: record.templateId, active: !record.isActive },
      {
        onSuccess: () =>
          message.success(`Template ${record.isActive ? "deactivated" : "activated"}`),
        onError: (e) =>
          message.error(typeof e === "string" ? e : "Failed to change template state"),
      }
    );
  };

  // Action names map to M_ACTION verbs wired to the menu (Update/Preview/Activate/Inactivate).
  const itemActions = useMemo(
    () => [
      {
        action: "Create",
        render: (
          <NavLink to="/notifications/templates/create">
            <ButtonComponent icon={<PlusOutlined />} type="submit">
              New Template
            </ButtonComponent>
          </NavLink>
        ),
      },
      {
        action: "Update",
        type: "table",
        render: (record) => (
          <Tooltip title="Update">
            <Link
              to="/notifications/templates/update"
              state={{ id: record?.templateId }}
              className="inline-flex items-center"
              style={{ color: "#1976D2" }}
            >
              <Pencil size={18} />
            </Link>
          </Tooltip>
        ),
      },
      {
        action: "Preview",
        type: "table",
        render: (record) => (
          <Tooltip title="Preview">
            <Link
              to="/notifications/templates/update"
              state={{ id: record?.templateId, preview: true }}
              className="inline-flex items-center"
              style={{ color: "#1976D2" }}
            >
              <Eye size={18} />
            </Link>
          </Tooltip>
        ),
      },
      {
        action: "Activate",
        type: "table",
        render: (record) =>
          record?.isActive ? null : (
            <Tooltip title="Activate">
              <span
                className="inline-flex items-center cursor-pointer"
                style={{ color: "#16a34a" }}
                onClick={() => handleToggleActive(record)}
              >
                <CircleCheck size={18} />
              </span>
            </Tooltip>
          ),
      },
      {
        action: "Inactivate",
        type: "table",
        render: (record) =>
          record?.isActive ? (
            <Tooltip title="Inactivate">
              <span
                className="inline-flex items-center cursor-pointer"
                style={{ color: "#BE3036" }}
                onClick={() => handleToggleActive(record)}
              >
                <Ban size={18} />
              </span>
            </Tooltip>
          ) : null,
      },
      {
        // DELETE has no backend endpoint yet — rendered disabled until one lands.
        action: "Delete",
        type: "table",
        render: () => (
          <Tooltip title="Delete (pending backend support)">
            <span className="inline-flex items-center text-gray-300 cursor-not-allowed pointer-events-none">
              <Trash2 size={18} />
            </span>
          </Tooltip>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const actionColumns = useColumnActionPermission(
    ["Update", "Preview", "Activate", "Inactivate", "Delete"],
    itemActions,
    "Update"
  );

  const allColumns = useMemo(
    () => [...columnsTemplates, ...actionColumns],
    [actionColumns]
  );

  return (
    <>
      <BreadCrumb
        routes={[
          { breadcrumbName: "Notifications" },
          { breadcrumbName: "Templates" },
        ]}
      />
      <NxCardContainer header="NOTIFICATION TEMPLATES" actions={itemActions}>
      <div className="w-full">
        <NxTable
          idTable="notification-templates-table"
          userId={userId}
          dataSource={templates}
          columns={allColumns}
          rowKey={(r) => r.templateId}
          loading={loading}
          totalData={templates?.length || 0}
          usePagination={false}
          useInfiniteScroll={false}
          showExport={true}
          showSearchBar={true}
          showAdvanceSearch={false}
          showRefresh={true}
          onRefresh={reload}
          tableScrolled={{ x: 1600, y: 600 }}
        />
      </div>
      </NxCardContainer>
    </>
  );
};

export default TemplatesList;
