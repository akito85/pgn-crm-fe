import React, { useState, useMemo, useEffect, useRef } from "react";
import { Empty, Select } from "antd";
import moment from "moment";
import { Chart, registerables } from "chart.js";

const { Option } = Select;

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
      date: moment(item.date).format("MMM"),
      fullDate: moment(item.date).format("DD MMMM YYYY"),
      dayName: moment(item.date).format("dddd"),
    }));
  }, [data]);

  const metrics = [
    {
      key: "pendingTransactions",
      name: "Pending Transactions",
      color: "#FF9800",
    },
    { 
      key: "pendingApprovals", 
      name: "Pending Approvals", 
      color: "#2196F3" 
    },
    {
      key: "gapRatingBilling",
      name: "Gap Rating vs Billing",
      color: "#F44336",
    },
    {
      key: "gapPraBillingMaster",
      name: "Gap Pra Billing vs Master",
      color: "#9E9E9E",
    },
  ];

  const getActiveMetrics = () => {
    if (selectedMetric === "all") {
      return metrics;
    }
    return metrics.filter((m) => m.key === selectedMetric);
  };

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    const activeMetrics = getActiveMetrics();

    // Prepare datasets
    const datasets = activeMetrics.map((metric) => ({
      label: metric.name,
      data: chartData.map((item) => item[metric.key] || 0),
      borderColor: metric.color,
      backgroundColor: "transparent",
      borderWidth: 2,
      tension: 0.4,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: metric.color,
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointHoverBackgroundColor: metric.color,
      pointHoverBorderColor: "#fff",
      pointHoverBorderWidth: 2,
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
            display: true,
            position: "bottom",
            align: "start",
            labels: {
              usePointStyle: true,
              pointStyle: "line",
              padding: 20,
              font: {
                size: 11,
                family: "Arial, sans-serif",
              },
              color: "#666",
              boxWidth: 20,
              boxHeight: 2,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#fff",
            titleColor: "#262626",
            bodyColor: "#595959",
            borderColor: "#e0e0e0",
            borderWidth: 1,
            padding: 10,
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
            max: 100,
            ticks: {
              stepSize: 20,
              color: "#999",
              font: {
                size: 10,
              },
              padding: 8,
            },
            grid: {
              color: "#f0f0f0",
              drawBorder: false,
            },
            border: {
              display: false,
            },
          },
          x: {
            ticks: {
              color: "#999",
              font: {
                size: 10,
              },
              padding: 8,
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            border: {
              display: false,
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
  }, [chartData, selectedMetric]);

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
    <div>
      {/* Header dengan Dropdown */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#262626",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          CHART GRAPHIC TREND ANOMALIES
        </div>
        <Select
          value={selectedMetric}
          onChange={(value) => setSelectedMetric(value)}
          style={{ width: 200 }}
          size="middle"
        >
          <Option value="all">Semua</Option>
          {metrics.map((m) => (
            <Option key={m.key} value={m.key}>
              {m.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Chart Container */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "6px",
          padding: "20px 16px",
          border: "1px solid #f0f0f0",
          height: 320,
        }}
      >
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TrendChart;