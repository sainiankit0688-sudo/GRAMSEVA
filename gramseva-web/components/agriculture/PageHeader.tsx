'use client';

interface PageHeaderProps {
  title: string;
  titleHindi: string;
  icon?: string;
  gradient?: string;
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  titleHindi,
  icon,
  gradient = 'linear-gradient(135deg, #2E7D32, #4CAF50)',
  children,
}: PageHeaderProps) {
  return (
    <div className="px-5 pt-6 pb-8" style={{ background: gradient }}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          <p className="text-green-100 text-sm">{titleHindi}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
