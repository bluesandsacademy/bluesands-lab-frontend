"use client";

/**
 * Every control here is presentational. There is no endpoint to read or write
 * 2FA, encryption or backup settings, so the inputs are disabled rather than
 * accepting changes that would be silently discarded on reload.
 */
const BACKUP_FREQUENCIES = ["Daily", "Weekly", "Monthly"];

const DataSecurityTab = () => (
  <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-6">
    <h2 className="text-xl font-semibold text-gray-900">
      Data Security &amp; backups
    </h2>

    {/* <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      These settings are not connected yet — the backend exposes no endpoint to
      read or change them. The controls stay disabled so nothing appears saved
      when it isn&apos;t.
    </p> */}
    <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      These settings are not connected yet
    </p>

    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-3 text-sm text-gray-500">
        <input
          type="checkbox"
          disabled
          className="h-4 w-4 rounded border-gray-300"
        />
        Enable Two-Factor Authentication
      </label>

      <label className="flex items-center gap-3 text-sm text-gray-500">
        <input
          type="checkbox"
          disabled
          className="h-4 w-4 rounded border-gray-300"
        />
        Encrypt Data at Rest
      </label>
    </div>

    <div className="flex flex-col gap-1">
      <label
        htmlFor="backupFrequency"
        className="text-sm font-medium text-gray-900"
      >
        Backup Frequency
      </label>
      <select
        id="backupFrequency"
        disabled
        defaultValue="Daily"
        className="w-full rounded-md border border-gray-300 p-2.5 text-sm text-gray-500 disabled:bg-gray-50"
      >
        {BACKUP_FREQUENCIES.map((frequency) => (
          <option key={frequency} value={frequency}>
            {frequency}
          </option>
        ))}
      </select>
    </div>

    <button
      disabled
      title="Backups need backend support"
      className="w-full rounded-md bg-green-600 py-3 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
    >
      Run Backup Now
    </button>
  </div>
);

export default DataSecurityTab;
