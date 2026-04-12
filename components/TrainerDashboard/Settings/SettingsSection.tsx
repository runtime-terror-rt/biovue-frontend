"use client";

import { ReactNode } from "react";

interface Props {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  className?: string;
}

export default function SettingsSection({
  title,
  action,
  children,
  description,
  className = "",
}: Props) {
  return (
    <div className={`bg-white rounded-3xl border border-[#F1F5F9] shadow-sm mb-6 ${className}`}>
      {(title || action) && (
        <div className="px-8 py-6 border-b border-[#F1F5F9] flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg md:text-xl font-semibold text-[#0FA4A9]">{title}</h3>}
            {description && <p className="text-sm text-[#94A3B8] mt-1">{description}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="">
        {children}
      </div>
    </div>
  );
}
