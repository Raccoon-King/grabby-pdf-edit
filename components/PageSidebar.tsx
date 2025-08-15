
import React from 'react';
import { Document, Page } from 'react-pdf';
import { PageInfo } from '../types';
import { X } from 'lucide-react';

interface PageSidebarProps {
  pages: PageInfo[];
  currentPage: number;
  numPages: number;
  onPageSelect: (pageNumber: number) => void;
  onPageDelete: (id: string) => void;
  fileUrl: string;
}

const PageSidebar: React.FC<PageSidebarProps> = ({ pages, currentPage, onPageSelect, onPageDelete, fileUrl }) => {
  return (
    <aside className="w-48 bg-slate-50 p-2 overflow-y-auto shadow-lg">
      <h2 className="text-sm font-semibold mb-2 text-center text-slate-600">Pages ({pages.length})</h2>
      <div className="space-y-2">
        <Document file={fileUrl} loading={<div className="text-center">Loading...</div>}>
          {pages.map((pageInfo, index) => (
            <div
              key={pageInfo.id}
              onClick={() => onPageSelect(index + 1)}
              className={`group relative cursor-pointer border-2 rounded-md overflow-hidden transition-all duration-200
                ${currentPage === index + 1 ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-blue-300'}`}
            >
              <Page
                pageNumber={pageInfo.originalIndex + 1}
                width={150}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<div className="bg-slate-200 h-48 w-full flex items-center justify-center"><div className="page-loading-spinner"></div></div>}
              />
              <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-br-md">
                {index + 1}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPageDelete(pageInfo.id);
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Delete page ${index + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </Document>
      </div>
    </aside>
  );
};

export default PageSidebar;
