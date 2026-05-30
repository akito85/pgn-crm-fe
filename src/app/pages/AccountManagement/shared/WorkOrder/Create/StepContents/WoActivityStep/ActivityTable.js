import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Tooltip } from "antd";
import NxBaseContainer from "../../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import ActivityModal from "./ActivityModal";
import NxDate from "../../../../../../../../components/Nx/NxDatePicker";

/**
 * @param {{
 *   activityData: Array,
 *   setActivityData: (rows: Array) => void,
 *   woContext: object,
 *   dropdowns: object,
 *   isUpdateMode: boolean,
 * }} props
 */
const ActivityTable = ({ activityData, setActivityData, woContext, dropdowns, isUpdateMode }) => {
  const {
    list_woActivities,
    pagination_woActivities,
    loading_listWoActivities,
  } = useSelector((state) => state.workOrder);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    if (isUpdateMode && list_woActivities.length > 0 && activityData.length === 0) {
      setActivityData(
        list_woActivities.map((item, i) => ({
          key: item.id?.toString() || `${Date.now()}-${i}`,
          woActName: item.woActName || "",
          picPosition: item.picPositionName || "",
          picPositionId: item.picPositionId?.toString() || "",
          picUser: item.picUserName || "",
          picUserId: item.picUserId?.toString() || "",
          planDate: item.planDate || "",
          activityStatus: item.activityStatus || "",
          sequenceOrder: item.sequenceOrder || 0,
          durationDays: item.durationDays || null,
          description: item.woActDesc || "",
          attachments: item.attachments || [],
          isTemplate: item.isTemplate === "Y",
          activityTemplDtlId: item.activityTemplDtlId || null,
        }))
      );
    }
  }, [isUpdateMode, list_woActivities]);

  const handleEdit = (record) => {
    setEditingRow(record);
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    setActivityData(activityData.filter((row) => row.key !== record.key));
  };

  const handleSave = (rowData) => {
    if (editingRow) {
      setActivityData(activityData.map((row) => (row.key === editingRow.key ? { ...row, ...rowData } : row)));
    } else {
      setActivityData([
        ...activityData,
        { key: Date.now().toString(), isTemplate: false, ...rowData },
      ]);
    }
    setEditingRow(null);
    setModalOpen(false);
  };

  const columns = [
    { title: "NO", width: 60, align: "center", render: (_, __, i) => i + 1 },
    { title: "ACTIVITY NAME", dataIndex: "woActName",   width: 180, render: (v) => v || "-" },
    { title: "PIC POSITION",  dataIndex: "picPosition", width: 160, render: (v) => v || "-" },
    { title: "PIC USER",      dataIndex: "picUser",     width: 160, render: (v) => v || "-" },
    { title: "PLAN DATE",     dataIndex: "planDate",    width: 130, render: (v) => v ? NxDate.formatDate(v, "DD MMM YYYY") : "-" },
    { title: "STATUS",        dataIndex: "activityStatus", width: 120, render: (v) => v || "-" },
    { title: "DESCRIPTION",   dataIndex: "description", width: 200, render: (v) => v || "-" },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Tooltip title="Edit">
            <div className="cursor-pointer" onClick={() => handleEdit(record)}>
              <SVGIcon name="IconEdit" color="#0075bf" width={20} />
            </div>
          </Tooltip>
          {!record.isTemplate && (
            <Tooltip title="Delete">
              <div className="cursor-pointer" onClick={() => handleDelete(record)}>
                <SVGIcon name="IconDelete" color="#BE3036" width={20} />
              </div>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <NxBaseContainer border header="ACTIVITY LIST">
        <div className="flex justify-end mb-3">
          <Button
            type="submit"
            icon={<SVGIcon name="IconButtonCreate" width={14} />}
            onClick={() => { setEditingRow(null); setModalOpen(true); }}
          >
            Create
          </Button>
        </div>
        <NxTable
          idTable="wo-activity-table"
          dataSource={activityData.map((item, i) => ({ ...item, _idx: i }))}
          columns={columns}
          usePagination={false}
          useInfiniteScroll={isUpdateMode}
          hasMore={isUpdateMode && activityData.length < (pagination_woActivities.totalElement || 0)}
          loading={loading_listWoActivities}
          tableScrolled={{ x: "max-content" }}
          showAdvanceSearch={false}
          showSearchBar={false}
        />
      </NxBaseContainer>

      <ActivityModal
        isOpen={modalOpen}
        editingRow={editingRow}
        dropdowns={dropdowns}
        onSave={handleSave}
        onCancel={() => { setEditingRow(null); setModalOpen(false); }}
      />
    </>
  );
};

export default ActivityTable;
