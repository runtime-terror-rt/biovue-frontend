"use client";

export default function DangerZone() {
  return (
    <div className="bg-[#C73434]/5 rounded-3xl border border-[#FEE2E2] p-8 md:p-10 mb-8">
      <h3 className="text-xl font-bold text-[#E31D48] mb-8">Danger Zone</h3>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold text-[#1E293B]">Reset Platform Cache</h4>
            <p className="text-base text-[#5F6F73] font-medium mt-1">
              Force clear all globally cached metrics and session data.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-lg font-semibold text-[#1E293B]">Disable New Registrations</h4>
            <p className="text-base text-[#5F6F73] font-medium mt-1">
              Prevent any new user or trainer signups across the platform.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#FEE2E2]">
          <h4 className="text-[17px] font-bold text-[#1E293B] mb-4">Disclaimer Text</h4>
          <div className="bg-[#C73434]/5 border border-[#0D9488] rounded-2xl p-6">
            <p className="text-[13px] text-[#E31D48] italic">
              Warning: Use these options with extreme caution. Changes may affect platform availability and global business operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
