"use client";
import type { GlobalSettings } from "@/services/globalAdminDashboardService";

/** "en" → "English" where the runtime can resolve it, else the raw code. */
const languageName = (code: string) => {
  try {
    const display = new Intl.DisplayNames(["en"], { type: "language" });
    return display.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

const currencyName = (code: string) => {
  try {
    const display = new Intl.DisplayNames(["en"], { type: "currency" });
    return display.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
};

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 border-b border-gray-100 py-4 last:border-b-0 md:flex-row md:items-start md:justify-between md:gap-6">
    <div className="flex flex-col">
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-500">{hint}</p>
    </div>
    <div className="flex flex-wrap items-center gap-2 md:justify-end md:max-w-[60%]">
      {children}
    </div>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-3xl bg-blue-50 px-3 py-1 text-xs text-blue-600">
    {children}
  </span>
);

interface PlatformConfigTabProps {
  settings: GlobalSettings | null;
  isLoading?: boolean;
}

const PlatformConfigTab = ({ settings, isLoading }: PlatformConfigTabProps) => {
  const languages = settings?.languages ?? [];
  const regions = settings?.regions ?? [];

  return (
    <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Platform Configuration
      </h2>

      {isLoading ? (
        <p className="py-6 text-xs text-gray-400">Loading configuration…</p>
      ) : (
        <div className="flex flex-col">
          <Field
            label="Supported Languages"
            hint="Languages learners and staff can use across the platform"
          >
            {languages.length ? (
              languages.map((code) => (
                <Chip key={code}>
                  {languageName(code)}
                  <span className="ml-1 uppercase opacity-60">{code}</span>
                </Chip>
              ))
            ) : (
              <span className="text-xs text-gray-400">
                No languages configured
              </span>
            )}
          </Field>

          <Field
            label="Default Currency"
            hint="Currency used for invoices and billing totals"
          >
            {settings?.currency ? (
              <span className="text-sm font-semibold text-gray-900">
                {settings.currency}
                <span className="ml-2 text-xs font-normal text-gray-500">
                  {currencyName(settings.currency)}
                </span>
              </span>
            ) : (
              <span className="text-xs text-gray-400">Not set</span>
            )}
          </Field>

          <Field
            label="Regions"
            hint="Regions the platform is provisioned for"
          >
            {regions.length ? (
              regions.map((region) => <Chip key={region}>{region}</Chip>)
            ) : (
              <span className="text-xs text-gray-400">
                No regions configured
              </span>
            )}
          </Field>
        </div>
      )}

      {/* <p className="pt-2 text-[11px] text-gray-400">
        These values are read from the settings API. Editing them needs a
        backend update endpoint — only a GET is available today.
      </p> */}
    </div>
  );
};

export default PlatformConfigTab;
