interface ScoreGaugeProps {
  score: number;
  maxScore: number;
}

export function ScoreGauge({ score, maxScore }: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  
  let color = '#10b981'; // green
  if (percentage < 30) color = '#f43f5e'; // rose
  else if (percentage < 50) color = '#f59e0b'; // amber
  else if (percentage < 70) color = '#3b82f6'; // blue
  
  const radius = 40;
  const circumference = Math.PI * radius; // Half circle length
  const strokeDashoffset = Math.max(0, circumference - (percentage / 100) * circumference);

  return (
    <div className="relative w-48 h-24 mb-4">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round"/>
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out"/>
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="text-3xl font-black text-slate-800">{score}/{maxScore}</div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</div>
      </div>
    </div>
  );
}
