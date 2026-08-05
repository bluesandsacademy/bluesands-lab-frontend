"use client";
import { exportGlobalReportCsv } from "@/services/globalAdminDashboardService";
import { useUser } from "@/services/UserContext";
import { useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa";

/**
 * The export endpoint takes free-text `type` and `period` strings with no
 * documented enum — these slugs are the frontend's guess and may need to be
 * aligned with whatever the backend switches on.
 */
const REPORT_TYPES = [
  {
    value: "comprehensive",
    title: "Comprehensive Report",
    description: "Full analytics with all metrics",
  },
  {
    value: "executive-summary",
    title: "Executive Summary",
    description: "High-level insights for leadership",
  },
  {
    value: "financial-impact",
    title: "Financial Impact",
    description: "Cost analysis and ROI metrics",
  },
  {
    value: "performance-metrics",
    title: "Performance Metrics",
    description: "Detailed performance analytics",
  },
];

const PERIODS = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
];

const ExportReportsPanel = () => {
  const { token } = useUser();

  const [type, setType] = useState(REPORT_TYPES[0].value);
  const [period, setPeriod] = useState("30d");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleCsvExport = async () => {
    setIsExporting(true);
    setError(null);
    setNotice(null);
    try {
      await exportGlobalReportCsv({ type, period }, token);
      setNotice("Export downloaded.");
    } catch (err) {
      console.error("CSV export failed", err);
      setError("Could not generate the export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Export Reports</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Report period"
          className="rounded-md border border-gray-300 p-2 text-xs text-gray-600"
        >
          {PERIODS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">Report Type</p>
        {REPORT_TYPES.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer"
          >
            <input
              type="radio"
              name="reportType"
              value={option.value}
              checked={type === option.value}
              onChange={(e) => setType(e.target.value)}
              className="mt-1"
            />
            <span className="flex flex-col">
              <span className="text-sm text-gray-900">{option.title}</span>
              <span className="text-xs text-gray-500">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-700">Export Format</p>
        <div className="flex flex-wrap gap-3">
          {/* Only CSV has an endpoint; the other two stay visibly unavailable. */}
          <button
            disabled
            title="PDF export is not available yet"
            className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm text-red-600 opacity-50 cursor-not-allowed"
          >
            <FaFilePdf /> PDF
          </button>
          <button
            disabled
            title="Excel export is not available yet"
            className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700 opacity-50 cursor-not-allowed"
          >
            <FaFileExcel /> Excel
          </button>
          <button
            onClick={handleCsvExport}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 disabled:opacity-50"
          >
            <FaFileCsv /> {isExporting ? "Exporting…" : "CSV"}
          </button>
        </div>
        <p className="text-[11px] text-gray-400">
          PDF and Excel exports need backend support.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          {notice}
        </p>
      )}
    </div>
  );
};

export default ExportReportsPanel;
