// Trims NxDate's ISO output ("...THH:mm:ss.sssZ") to the offsetless
// LocalDateTime form the schedule update endpoint expects ("YYYY-MM-DDTHH:mm:ss").
// Mirrors the prior datetime-local serialization. Verify against the backend
// in Task 5/6's manual check.
const toLocalDateTime = (iso) => (iso ? String(iso).slice(0, 19) : null);

/**
 * Map the edit modal's selection to a submit descriptor.
 *  - SPECIFIC_DAYS / PERIODICALLY -> { mode:"schedule" } (PUT /definitions/schedules/{id})
 *  - ONCE / IMMEDIATE             -> { mode:"execution" } (POST /executions)
 */
export default function buildScheduleEditSubmit({ triggerType, values, schedule, cancelInFlight }) {
  if (triggerType === "SPECIFIC_DAYS" || triggerType === "PERIODICALLY") {
    const isCron = triggerType === "SPECIFIC_DAYS";
    return {
      mode: "schedule",
      scheduleId: schedule.scheduleId,
      cancelInFlight,
      payload: {
        scheduleName: schedule.scheduleName,
        scheduleType: isCron ? "CRON" : "INTERVAL",
        cronExpression: isCron ? values.cronExpression : null,
        intervalSeconds: isCron ? null : values.intervalSeconds,
        timezone: values.timezone,
        startTime: toLocalDateTime(values.startTime),
        endTime: toLocalDateTime(values.endTime),
      },
    };
  }

  const triggerBody =
    triggerType === "ONCE"
      ? { jobId: schedule.jobId, triggerType: "ONCE", scheduledAt: values.scheduledAt, timezone: values.timezone }
      : { jobId: schedule.jobId, triggerType: "IMMEDIATE" };

  return { mode: "execution", scheduleId: schedule.scheduleId, cancelInFlight, triggerBody };
}
