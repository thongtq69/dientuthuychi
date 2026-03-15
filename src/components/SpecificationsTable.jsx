'use client';

export function SpecificationsTable({ technical_specifications = null }) {
  const normalizedSpecifications = Array.isArray(technical_specifications)
    ? { 'Thông số cơ bản': Object.fromEntries(technical_specifications) }
    : technical_specifications;

  if (!normalizedSpecifications || Object.keys(normalizedSpecifications).length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-[13px] font-medium">
        Thông số kỹ thuật đang được cập nhật...
      </div>
    );
  }

  return (
    <div className="w-full">
      {Object.entries(normalizedSpecifications).map(([category, items]) => (
        <div key={category} className="text-[13px]">
          <h4 className="bg-slate-100 px-3 py-2 font-bold text-slate-700 border-b border-slate-200 sticky top-0">
            {category}
          </h4>
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              {Object.entries(items).map(([label, value]) => (
                <tr key={label} className="hover:bg-slate-50/50 transition-colors">
                  <td className="w-2/5 py-2 px-3 font-medium text-slate-600 align-top leading-snug">
                    {label}
                  </td>
                  <td className="w-3/5 py-2 px-3 text-slate-800 leading-snug font-semibold">
                    {Array.isArray(value) ? value.join(', ') : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
