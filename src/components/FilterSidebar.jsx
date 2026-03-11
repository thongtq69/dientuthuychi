export function FilterSidebar({ filters = {} }) {
  return (
    <aside className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Bộ lọc sản phẩm</h3>
        <p className="mt-1 text-sm text-slate-500">Placeholder có chủ đích để bám nhịp collection page gốc.</p>
      </div>

      {Object.entries(filters).map(([group, values]) => (
        <div key={group} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-semibold capitalize text-slate-900">{group}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {values.map((value) => (
              <button key={value} type="button" className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition hover:border-sky-200 hover:text-sky-700">
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
