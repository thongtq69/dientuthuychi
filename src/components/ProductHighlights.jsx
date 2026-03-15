'use client';

import { useId, useState } from 'react';

import { SmartImage } from '@/components/SmartImage';

export function ProductHighlights({ sections = [] }) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  if (!sections.length) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 flex items-center gap-3">
          <span className="h-6 w-1 bg-red-600 rounded-full"></span>
          Đặc điểm nổi bật
        </h2>
      </div>

      <div
        id={contentId}
        className={`p-4 sm:p-6 space-y-8 relative transition-[max-height] duration-500 ease-in-out ${
          expanded ? 'max-h-[10000px]' : 'max-h-[600px] overflow-hidden'
        }`}
      >
        {sections.map((section, index) => {
          const sectionImages = section.images?.filter((image) => image && typeof image === 'string') || [];

          return (
            <div key={`${section.heading || 'section'}-${index}`} className="space-y-4">
              {section.heading && section.heading !== 'Giới thiệu' ? (
                <h3 className="text-[15px] sm:text-[16px] font-extrabold text-slate-800 leading-snug">{section.heading}</h3>
              ) : null}

              {section.content ? (
                <div className="text-[14px] leading-relaxed text-slate-600 whitespace-pre-wrap">{section.content}</div>
              ) : null}

              {sectionImages.length > 0 ? (
                <div
                  className={`grid gap-3 ${
                    sectionImages.length >= 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : sectionImages.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-1'
                  }`}
                >
                  {sectionImages.map((image, imageIndex) => (
                    <div key={`${image}-${imageIndex}`} className="rounded-lg overflow-hidden border border-slate-100 bg-white">
                      <SmartImage src={image} alt={`${section.heading || 'highlight'} - ${imageIndex}`} className="w-full h-auto object-contain" hideOnError />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {!expanded ? <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div> : null}
      </div>

      <div className="p-4 flex justify-center border-t border-slate-100">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={contentId}
          className="flex items-center gap-2 rounded-lg border border-sky-500 bg-white px-8 py-2.5 text-[13px] font-bold text-sky-600 transition hover:bg-sky-50"
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
