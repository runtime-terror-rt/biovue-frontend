interface StatCardProps {
  label: string;
  value: string | number;
  description: string;
}

export default function StatCard({ label, value, description }: StatCardProps) {
  return (
    <div className="bg-white space-y-4 rounded-lg border border-gray-200 p-5">
      <p className="text-base font-medium text-[#0D9488] ">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 ">{value}</p>
      <p className="text-sm text-[#5F6F73]">{description}</p>
    </div>
  );
}
