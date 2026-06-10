import React from "react";
import {
  ThunderboltOutlined, ClockCircleOutlined, SyncOutlined, CalendarOutlined,
} from "@ant-design/icons";

// Shared trigger/schedule configuration constants.
// Consumed by ModalRunJob (run a job) and ScheduleConfigFields / EditScheduleModal.

export const TIMEZONES = [
  "UTC", "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura",
  "America/New_York", "Europe/London", "Asia/Tokyo",
];

export const TRIGGER_TYPES = ["IMMEDIATE", "ONCE", "PERIODICALLY", "SPECIFIC_DAYS"];

export const TRIGGER_META = {
  IMMEDIATE:    { icon: <ThunderboltOutlined />, label: "Immediate",     desc: "Run the job right now",                color: "#f97316" },
  ONCE:         { icon: <ClockCircleOutlined />, label: "Once",          desc: "Schedule for a specific date & time",  color: "#3b82f6" },
  PERIODICALLY: { icon: <SyncOutlined />,        label: "Periodically",  desc: "Repeat at a fixed interval",           color: "#8b5cf6" },
  SPECIFIC_DAYS:{ icon: <CalendarOutlined />,    label: "Specific Days", desc: "Use a cron expression for scheduling", color: "#10b981" },
};

export const CRON_PRESETS = [
  { label: "Hourly",             value: "0 * * * *",        hint: "Every hour at :00" },
  { label: "Daily (midnight)",   value: "0 0 * * *",        hint: "Every day at 00:00" },
  { label: "Daily (6am)",        value: "0 6 * * *",        hint: "Every day at 06:00" },
  { label: "Weekdays (Mon–Fri)", value: "0 0 * * 1-5",      hint: "Mon to Fri at midnight" },
  { label: "Weekly (Monday)",    value: "0 0 * * 1",        hint: "Every Monday at midnight" },
  { label: "Fortnightly",        value: "0 0 1,15 * *",     hint: "1st and 15th of each month" },
  { label: "Monthly (1st)",      value: "0 0 1 * *",        hint: "1st of every month at midnight" },
  { label: "Quarterly",          value: "0 0 1 1,4,7,10 *", hint: "1st of Jan, Apr, Jul, Oct" },
  { label: "Custom / Advanced",  value: "__custom__",       hint: "Enter your own cron expression" },
];
