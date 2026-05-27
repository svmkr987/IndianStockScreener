interface MetricsGridProps {
  data: Record<string, string | null>;
  cols?: number;
}

export function MetricsGrid({ data, cols = 3 }: MetricsGridProps) {
  const entries = Object.entries(data);
  const gridClass = cols === 2 ? 'grid-cols-2' : cols === 4 ? 'grid-cols-4' : 'grid-cols-3';
  
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:${gridClass} mt-4`}>
      {entries.map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{key}</div>
          <div className="text-xl font-bold text-slate-800">{value !== null ? value : 'N/A'}</div>
        </div>
      ))}
    </div>
  );
}
