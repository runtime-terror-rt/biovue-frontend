"use client";
interface TextBlockProps {
  heading: string;
  subheading?: string;
  className?: string; 
}

export default function DashboardHeading({
  heading,
  subheading,
  className,
}: TextBlockProps) {
  return (
    <div className={`flex flex-col gap-[9px] ${className || ""}`}>
      <h2 className="text-[20px] font-medium">{heading}</h2>
      {subheading && <p className="text-[14px] font-normal">{subheading}</p>}
    </div>
  );
}
