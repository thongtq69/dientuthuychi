export function CollectionToolbar({ sortOptions = [], productCount = 0, activeSort, onSortChange = () => {} }) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{productCount} sản phẩm</span>
        <span>·</span>
        <span>Đã áp dụng bộ lọc theo danh mục để khách xem nhanh hơn</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option, index) => (
          <button
            key={option}
            type="button"
            onClick={() => onSortChange(option)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              (activeSort || sortOptions[0]) === option || (!activeSort && index === 0)
                ? 'bg-slate-950 text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
