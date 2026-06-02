import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ActivityTable from "./ActivityTable";
import WoDataRequirement from "./WoDataRequirement";

/**
 * @param {{
 *   form: object,
 *   woContext: object,
 *   dropdowns: object,
 *   activityData: Array,
 *   setActivityData: Function,
 *   isUpdateMode: boolean,
 *   accountId: string | number,
 * }} props
 */
const WoActivityStep = ({ form, woContext, dropdowns, activityData, setActivityData, isUpdateMode, accountId }) => {
  const { list_woActivities } = useSelector((state) => state.workOrder);

  // Ref shadow keeps activityData readable inside effect without adding to deps.
  // Adding activityData to deps would cause an infinite loop (effect calls setActivityData).
  const activityDataRef = useRef(activityData);
  activityDataRef.current = activityData;

  useEffect(() => {
    if (isUpdateMode) return;           // update mode: ActivityTable handles its own init
    if (!list_woActivities.length) return;

    const isTemplateBatch = list_woActivities.every((item) => item.isTemplate !== false);
    if (!isTemplateBatch) return;

    // Skip re-init only if same template set is already loaded (user navigated back).
    // If template IDs differ, category changed → re-initialize.
    const incomingIds = list_woActivities.map((item) => item.id).join(",");
    const currentIds = activityDataRef.current
      .filter((row) => row.isTemplate)
      .map((row) => row.activityTemplDtlId)
      .join(",");
    if (incomingIds === currentIds) return;

    const templateRows = list_woActivities.map((item, i) => ({
      key: `tpl-${item.id || i}-${Date.now()}`,
      woActName: item.woActName || item.name || "",
      picPosition: "",
      picPositionId: "",
      picUser: "",
      picUserId: "",
      planDate: "",
      activityStatus: "PENDING",
      sequenceOrder: item.sequenceOrder || (i + 1),
      durationDays: item.durationDays || null,
      description: "",
      attachments: [],
      isTemplate: true,
      activityTemplDtlId: item.id || null,
    }));

    setActivityData((prev) => {
      const userCreated = prev.filter((row) => !row.isTemplate);
      return [...templateRows, ...userCreated];
    });
  }, [isUpdateMode, list_woActivities, setActivityData]);

  return (
    <div className="flex flex-col gap-y-4">
      <ActivityTable
        activityData={activityData}
        setActivityData={setActivityData}
        woContext={woContext}
        dropdowns={dropdowns}
        isUpdateMode={isUpdateMode}
      />
      <WoDataRequirement form={form} dropdowns={dropdowns} accountId={accountId} />
    </div>
  );
};

export default WoActivityStep;
