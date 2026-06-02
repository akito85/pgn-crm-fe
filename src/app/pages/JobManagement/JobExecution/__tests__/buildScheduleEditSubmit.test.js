import buildScheduleEditSubmit from "../buildScheduleEditSubmit";

const schedule = { scheduleId: 7, jobId: 42, scheduleName: "Nightly Bill" };

test("SPECIFIC_DAYS routes to a CRON schedule update", () => {
  const out = buildScheduleEditSubmit({
    triggerType: "SPECIFIC_DAYS",
    values: { cronExpression: "0 0 * * *", timezone: "UTC", startTime: "2026-06-01T00:00:00.000Z", endTime: null },
    schedule,
    cancelInFlight: false,
  });
  expect(out).toEqual({
    mode: "schedule",
    scheduleId: 7,
    cancelInFlight: false,
    payload: {
      scheduleName: "Nightly Bill",
      scheduleType: "CRON",
      cronExpression: "0 0 * * *",
      intervalSeconds: null,
      timezone: "UTC",
      startTime: "2026-06-01T00:00:00",
      endTime: null,
    },
  });
});

test("PERIODICALLY routes to an INTERVAL schedule update", () => {
  const out = buildScheduleEditSubmit({
    triggerType: "PERIODICALLY",
    values: { intervalSeconds: 3600, timezone: "Asia/Jakarta", startTime: null, endTime: null },
    schedule,
    cancelInFlight: true,
  });
  expect(out).toEqual({
    mode: "schedule",
    scheduleId: 7,
    cancelInFlight: true,
    payload: {
      scheduleName: "Nightly Bill",
      scheduleType: "INTERVAL",
      cronExpression: null,
      intervalSeconds: 3600,
      timezone: "Asia/Jakarta",
      startTime: null,
      endTime: null,
    },
  });
});

test("ONCE routes to an execution trigger", () => {
  const out = buildScheduleEditSubmit({
    triggerType: "ONCE",
    values: { scheduledAt: "2026-06-02T09:30:00.000Z", timezone: "UTC" },
    schedule,
    cancelInFlight: false,
  });
  expect(out).toEqual({
    mode: "execution",
    scheduleId: 7,
    cancelInFlight: false,
    triggerBody: { jobId: 42, triggerType: "ONCE", scheduledAt: "2026-06-02T09:30:00.000Z", timezone: "UTC" },
  });
});

test("IMMEDIATE routes to an execution trigger with no timing", () => {
  const out = buildScheduleEditSubmit({
    triggerType: "IMMEDIATE",
    values: {},
    schedule,
    cancelInFlight: true,
  });
  expect(out).toEqual({
    mode: "execution",
    scheduleId: 7,
    cancelInFlight: true,
    triggerBody: { jobId: 42, triggerType: "IMMEDIATE" },
  });
});
