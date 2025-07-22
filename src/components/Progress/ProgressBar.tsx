import React from "react";
import Chart from "react-apexcharts";
import { statusConfig } from "./statusConfig";

interface ProgressBarProps {
  stats: Array<{
    status: string;
    count: number;
    percentage: string;
  }>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ stats }) => {
  const labels = stats.map((s) => s.status);
  const series = stats.map((s) => parseFloat(s.percentage));
  const colors = stats.map((s) => {
    const colorMatch = statusConfig[s.status]?.color || "bg-gray-400";
    return colorMatch.replace("bg-[", "").replace("]", "");
  });

  const chartOptions = {
    chart: {
      type: "bar" as const,
      height: 300,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "50%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        colors: ["#111"],
      },
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
    xaxis: {
      categories: labels,
      labels: {
        style: { fontSize: "12px", colors: "#333" },
      },
    },
    colors: colors,
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
    legend: { show: false },
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Estimates Progress Overview
      </h2>
      <Chart
        options={chartOptions}
        series={[{ data: series }]}
        type="bar"
        height={350}
      />
    </div>
  );
};
