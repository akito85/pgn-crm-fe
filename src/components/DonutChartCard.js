import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const DonutChartCard = ({ title, data, labels, colors, centerLabel }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: colors,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "45%",
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 8,
              titleFont: {
                size: 11,
              },
              bodyFont: {
                size: 10,
              },
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.parsed || 0;
                  return `${label}: ${value}%`;
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, colors]);

  // Calculate positions for labels
  const getLabelData = () => {
    return data.map((value, index) => ({
      label: labels[index],
      value: value,
      color: colors[index],
    }));
  };

  const labelData = getLabelData();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden h-full"
      style={{ border: "1px solid #BDBDBD" }}
    >
      {/* Header */}
      <div className="px-3 py-2">
        <h3 className="text-[#0175BF] font-semibold text-xs uppercase m-0">
          {title}
        </h3>
      </div>

      {/* Chart Content */}
      <div className="px-3 py-5 bg-white">
        <div
          className="relative mx-auto"
          style={{ height: "180px", maxWidth: "180px" }}
        >
          <canvas ref={chartRef}></canvas>
          {centerLabel && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ pointerEvents: "none" }}
            >
              <div className="text-xl font-bold text-gray-800">
                {centerLabel.value}
              </div>
              {centerLabel.subtext && (
                <div className="text-[10px] text-gray-500">
                  {centerLabel.subtext}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend with labels positioned around chart */}
        <div className="mt-3 grid grid-cols-1 gap-1.5">
          {labelData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-gray-700">{item.label}</span>
              </div>
              <span className="text-[11px] font-semibold text-gray-800">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
