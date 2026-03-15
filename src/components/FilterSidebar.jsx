function getFilterEntries(filters) {
  return Object.entries(filters || {});
}

export function FilterSidebar({ filters = {}, selectedFilters = {}, onChange = () => {} }) {
  return (
    <aside className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Bộ lọc sản phẩm</h3>
        <p className="mt-1 text-sm text-slate-500">Lọc nhanh theo nhóm phổ biến để hạn chế bấm nhiều bước trên mobile.</p>
      </div>

      {getFilterEntries(filters).map(([group, values]) => (
        <div key={group} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-semibold capitalize text-slate-900">{group}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {values.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  onChange((currentFilters) => ({
                    ...currentFilters,
                    [group]: currentFilters[group] === value ? undefined : value,
                  }))
                }
                className={`rounded-full border px-3 py-2 text-sm transition ${
                  selectedFilters[group] === value
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
