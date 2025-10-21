import React, { useState, useMemo } from "react";
import { Empty, Card, Radio } from "antd";
import moment from "moment";

const TrendChart = ({ data = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
    { key: 'pendingTransactions', name: 'Pending Transactions', color: '#faad14'},
    { key: 'pendingApprovals', name: 'Pending Approvals', color: '#1890ff'},
    { key: 'gapRatingBilling', name: 'Gap Rating vs Billing', color: '#f5222d'},
    { key: 'gapPraBillingMaster', name: 'Gap Pra-Billing vs Master', color: '#722ed1'},
  ];

  const activeMetrics = selectedMetric === "all" 
    ? metrics 
    : metrics.filter(m => m.key === selectedMetric);

  const stats = useMemo(() => {
    if (chartData.length === 0) return [];
    return metrics.map(metric => {
      const values = chartData.map(d => d[metric.key] || 0);
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
        trendPercent: values[0] !== 0 ? ((trend / values[0]) * 100).toFixed(1) : 0
      };
    });
  }, [chartData]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 10;
    const allValues = activeMetrics.flatMap(metric => 
      chartData.map(item => item[metric.key] || 0)
    );
    return Math.max(...allValues, 10);
  }, [chartData, activeMetrics]);

  const chartHeight = 280;
  const chartWidth = Math.max(chartData.length * 80, 600);

  const padding = { top: 20, right: 10, bottom: 40, left: 45 };

  const yTicks = useMemo(() => {
    const tickCount = 5;
    return Array.from({ length: tickCount }, (_, i) => {
      const value = Math.round((maxValue / (tickCount - 1)) * (tickCount - 1 - i));
      return {
        value,
        y: padding.top + ((chartHeight - padding.top - padding.bottom) / (tickCount - 1)) * i
      };
    });
  }, [maxValue, chartHeight, padding.top, padding.bottom]);

  if (!data || data.length === 0) {
    return (
      <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Empty description="Tidak ada data tren anomali" />
      </div>
    );
  }

  const getY = (value) => {
    const innerHeight = chartHeight - padding.top - padding.bottom;
    const ratio = value / maxValue;
    return padding.top + innerHeight * (1 - ratio);
  };

  const getX = (index) => {
    const innerWidth = chartWidth - padding.left - padding.right;
    const step = innerWidth / (chartData.length - 1 || 1);
    return padding.left + step * index;
  };

  const generatePath = (metricKey) => {
    const points = chartData.map((item, i) => {
      const x = getX(i);
      const y = getY(item[metricKey] || 0);
      return { x, y };
    });

    if (points.length === 0) return '';
    
    let path = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`;
    }
    
    return path;
  };

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <Radio.Group 
          value={selectedMetric} 
          onChange={(e) => setSelectedMetric(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="all">Semua</Radio.Button>
          {metrics.map(m => (
            <Radio.Button key={m.key} value={m.key}>
              <span style={{ marginRight: 4 }}>{m.icon}</span>
              {m.name.split(' ')[0]}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        {stats.map(stat => {
          const isActive = selectedMetric === "all" || selectedMetric === stat.key;
          return (
            <div
              key={stat.key}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                border: `2px solid ${isActive ? stat.color : '#f0f0f0'}`,
                backgroundColor: isActive ? `${stat.color}10` : '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.3s',
                opacity: isActive ? 1 : 0.6
              }}
              onClick={() => setSelectedMetric(stat.key)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <span style={{ fontSize: 12, color: '#666', fontWeight: 500 }}>
                  {stat.name}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>
                    {stat.total}
                  </div>
                  <div style={{ fontSize: 11, color: '#999' }}>
                    Total • Avg: {stat.avg}
                  </div>
                </div>
                <div style={{ 
                  fontSize: 12, 
                  fontWeight: 600,
                  color: stat.trend > 0 ? '#f5222d' : stat.trend < 0 ? '#52c41a' : '#999',
                  textAlign: 'right'
                }}>
                  {stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '→'}
                  {Math.abs(stat.trendPercent)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        border: '1px solid #f0f0f0',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
      }}>
        <svg
            width="100%"
            height={chartHeight}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
            >

          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={chartWidth - padding.right}
                y2={tick.y}
                stroke="#f0f0f0"
                strokeWidth="0.5"
              />
              <text
                x={padding.left - 5}
                y={tick.y}
                textAnchor="end"
                alignmentBaseline="middle"
                fontSize="10"
                fill="#999"
              >
                {tick.value}
              </text>
            </g>
          ))}

          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="#d9d9d9"
            strokeWidth="1"
          />
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="#d9d9d9"
            strokeWidth="1"
          />

          {activeMetrics.map(metric => {
            const path = generatePath(metric.key);
            return (
              <g key={metric.key}>
                <path
                  d={`${path} L ${getX(chartData.length - 1)},${chartHeight - padding.bottom} L ${padding.left},${chartHeight - padding.bottom} Z`}
                  fill={metric.color}
                  opacity="0.1"
                />
                <path
                  d={path}
                  fill="none"
                  stroke={metric.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}

          {activeMetrics.map(metric => 
            chartData.map((item, i) => {
              const x = getX(i);
              const y = getY(item[metric.key] || 0);
              const isHovered = hoveredIndex === i;

              return (
                <g key={`${metric.key}-${i}`}>
                  {isHovered && (
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill={metric.color}
                      opacity="0.15"
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? "5" : "3.5"}
                    fill="#fff"
                    stroke={metric.color}
                    strokeWidth="2"
                    style={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              );
            })
          )}

          {chartData.map((item, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - padding.bottom + 15}
                textAnchor="middle"
                fontSize="10"
                fill={isHovered ? "#262626" : "#999"}
                fontWeight={isHovered ? "600" : "400"}
              >
                {item.date}
              </text>
            );
          })}

          {hoveredIndex !== null && (
            <line
              x1={getX(hoveredIndex)}
              y1={padding.top}
              x2={getX(hoveredIndex)}
              y2={chartHeight - padding.bottom}
              stroke="#bfbfbf"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          )}
        </svg>

        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute',
            top: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#fff',
            padding: '12px 16px',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            border: '1px solid #f0f0f0',
            minWidth: 220,
            zIndex: 100
          }}>
            <div style={{ 
              fontWeight: 600, 
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: '1px solid #f0f0f0',
              fontSize: 13
            }}>
              {chartData[hoveredIndex].dayName}, {chartData[hoveredIndex].fullDate}
            </div>
            {activeMetrics.map(metric => (
              <div key={metric.key} style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
                fontSize: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: metric.color
                  }} />
                  <span style={{ color: '#595959' }}>{metric.name}</span>
                </div>
                <span style={{ 
                  fontWeight: 700,
                  color: metric.color,
                  fontSize: 14
                }}>
                  {chartData[hoveredIndex][metric.key] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedMetric === "all" && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: 20,
          marginTop: 16,
          flexWrap: 'wrap'
        }}>
          {metrics.map(metric => (
            <div key={metric.key} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              fontSize: 12
            }}>
              <div style={{ 
                width: 16, 
                height: 3, 
                backgroundColor: metric.color,
                borderRadius: 2
              }} />
              <span style={{ color: '#666' }}>{metric.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendChart;