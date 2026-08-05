"use client";

export interface PaymentProviderUsage {
  label: string;
  count: number;
}

interface IntegrationsTabProps {
  providers: PaymentProviderUsage[];
  isLoading?: boolean;
}

const IntegrationsTab = ({ providers, isLoading }: IntegrationsTabProps) => (
  <div className="flex flex-col gap-4 bg-white rounded-lg shadow-sm p-4 md:p-6">
    <h2 className="text-xl font-semibold text-gray-900">Integrations</h2>

    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">Payment Integrations</p>

      {isLoading ? (
        <p className="text-xs text-gray-400">Loading providers…</p>
      ) : !providers.length ? (
        <p className="text-xs text-gray-400">No payment providers used yet</p>
      ) : (
        providers.map((provider) => (
          <div
            key={provider.label}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3"
          >
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900">
                {provider.label}
              </p>
              <p className="text-xs text-gray-500">
                {provider.count.toLocaleString("en-NG")} payment(s) processed
              </p>
            </div>
            <p className="text-xs text-emerald-600">In use</p>
          </div>
        ))
      )}

      <button
        disabled
        title="Adding providers needs backend support"
        className="w-max rounded-md bg-bgBlue px-4 py-2 text-xs text-white opacity-50 cursor-not-allowed lg:text-sm"
      >
        Add New Provider
      </button>
    </div>

    <p className="text-[11px] text-gray-400">
      Providers are derived from the payment history, so this lists what is
      actually processing payments rather than a configured integration list.
    </p>
  </div>
);

export default IntegrationsTab;
