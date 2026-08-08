interface MetricChartProps {
  label: string;
  value: string;
  change: string;
  bars: number[];
  tone?: "blue" | "emerald" | "violet";
}

const toneClasses = {
  blue: "from-primary/90 to-sky-300",
  emerald: "from-emerald-500 to-teal-300",
  violet: "from-violet-500 to-fuchsia-300",
};

export function MetricChart({ label, value, change, bars, tone = "blue" }: MetricChartProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/[0.23] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">{change}</span>
      </div>
      <div className="mt-5 flex h-28 items-end gap-1.5 sm:gap-2" aria-label={label + " trend"}>
        {bars.map((bar, index) => (
          <div key={index} className="group relative flex flex-1 items-end">
            <div
              className={"w-full rounded-t-md bg-gradient-to-t " + toneClasses[tone] + " opacity-65 transition-all duration-300 group-hover:opacity-100"}
              style={{ height: bar + "%" }}
              title={bar + "%"}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Today</span>
      </div>
    </div>
  );
}
