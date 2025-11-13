import React, { useState, useMemo, useEffect, useRef } from "react";
import { Empty, Radio } from "antd";
import moment from "moment";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const TrendChart = ({ data = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState("all");
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({
      ...item,
      date: moment(item.date).format("DD MMM"),
      fullDate: moment(item.date).format("DD MMMM YYYY"),
      dayName: moment(item.date).format("dddd"),
    }));
  }, [data]);

  const metrics = [
    {
      key: "pendingTransactions",
      name: "Pending Transactions",
      color: "#faad14",
    },
    { key: "pendingApprovals", name: "Pending Approvals", color: "#1890ff" },
    {
      key: "gapRatingBilling",
      name: "Gap Rating vs Billing",
      color: "#f5222d",
    },
    {
      key: "gapPraBillingMaster",
      name: "Gap Pra-Billing vs Master",
      color: "#722ed1",
    },
  ];

  const activeMetrics =
    selectedMetric === "all"
      ? metrics
      : metrics.filter((m) => m.key === selectedMetric);

  const stats = useMemo(() => {
    if (chartData.length === 0) return [];
    return metrics.map((metric) => {
      const values = chartData.map((d) => d[metric.key] || 0);
      const total = values.reduce((a, b) => a + b, 0);
      const avg = total / values.length;
      const max = Math.max(...values);
      const trend = values[values.length - 1] - values[0];

      return {
        ...metric,
        total,
        avg: avg.toFixed(1),
        max,
        trend,
        trendPercent:
          values[0] !== 0 ? ((trend / values[0]) * 100).toFixed(1) : 0,
      };
    });
  }, [chartData]);

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    // Prepare datasets
    const datasets = activeMetrics.map((metric) => ({
      label: metric.name,
      data: chartData.map((item) => item[metric.key] || 0),
      borderColor: metric.color,
      backgroundColor: metric.color + "20",
      borderWidth: 2.5,
      tension: 0.1,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "#fff",
      pointBorderColor: metric.color,
      pointBorderWidth: 2,
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: metric.color,
      pointHoverBorderWidth: 3,
    }));

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.map((item) => item.date),
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: selectedMetric === "all",
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#fff",
            titleColor: "#262626",
            bodyColor: "#595959",
            borderColor: "#f0f0f0",
            borderWidth: 1,
            padding: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            displayColors: true,
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return `${chartData[index].dayName}, ${chartData[index].fullDate}`;
              },
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#f0f0f0",
              drawBorder: true,
              borderColor: "#d9d9d9",
              borderWidth: 1,
            },
            ticks: {
              color: "#999",
              font: {
                size: 10,
              },
              padding: 8,
            },
          },
          x: {
            grid: {
              display: false,
              drawBorder: true,
              borderColor: "#d9d9d9",
              borderWidth: 1,
            },
            ticks: {
              color: "#999",
              font: {
                size: 10,
              },
              padding: 8,
            },
          },
        },
      },
    });

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, activeMetrics, selectedMetric]);

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty description="Tidak ada data tren anomali" />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 8px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Radio.Group
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="all">Semua</Radio.Button>
          {metrics.map((m) => (
            <Radio.Button key={m.key} value={m.key}>
              {m.name.split(" ")[0]}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {stats.map((stat) => {
          const isActive =
            selectedMetric === "all" || selectedMetric === stat.key;
          return (
            <div
              key={stat.key}
              style={{
                padding: "12px 16px",
                borderRadius: 8,
                border: `2px solid ${isActive ? stat.color : "#f0f0f0"}`,
                backgroundColor: isActive ? `${stat.color}10` : "#fafafa",
                cursor: "pointer",
                transition: "all 0.3s",
                opacity: isActive ? 1 : 0.6,
              }}
              onClick={() => setSelectedMetric(stat.key)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>
                  {stat.name}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 24, fontWeight: 700, color: stat.color }}
                  >
                    {stat.total}
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>
                    Total • Avg: {stat.avg}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      stat.trend > 0
                        ? "#f5222d"
                        : stat.trend < 0
                        ? "#52c41a"
                        : "#999",
                    textAlign: "right",
                  }}
                >
                  {stat.trend > 0 ? "↑" : stat.trend < 0 ? "↓" : "→"}
                  {Math.abs(stat.trendPercent)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 16,
          border: "1px solid #f0f0f0",
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          height: 350,
        }}
      >
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TrendChart;
