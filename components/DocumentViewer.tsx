
import React from 'react';
import { Document, Page } from 'react-pdf';
import DraggableItem from './DraggableItem';
import { PageInfo, EditableItem, PageDimensions } from '../types';

interface DocumentViewerProps {
  fileUrl: string;
  pages: PageInfo[];
  items: EditableItem[];
  selectedTextId: string | null;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  setSelectedTextId: (id: string | null) => void;
  onItemChange: (id: string, newValues: Partial<EditableItem>) => void;
  onItemDelete: (id: string) => void;
  setPageDimensions: React.Dispatch<React.SetStateAction<PageDimensions>>;
}

const DocumentViewer: React.FC<DocumentViewerProps> = (props) => {
  const {
    fileUrl,
    pages,
    items,
    selectedTextId,
    onDocumentLoadSuccess,
    setSelectedTextId,
    onItemChange,
    onItemDelete,
    setPageDimensions,
  } = props;

  const onPageLoadSuccess = (page: any, pageNumber: number) => {
    setPageDimensions((prev) => ({
      ...prev,
      [pageNumber]: { width: page.width, height: page.height },
    }));
  };

  return (
    <main className="flex-grow bg-slate-300 overflow-auto" onClick={() => setSelectedTextId(null)}>
      <div className="p-4 sm:p-8 space-y-4">
        <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="flex justify-center items-center h-full"><div className="page-loading-spinner"></div></div>}>
          {pages.map((pageInfo, index) => {
            const pageNumber = index + 1;
            return (
              <div key={pageInfo.id} id={`page-${pageNumber}`} className="relative mx-auto w-fit shadow-lg bg-white">
                <Page
                  pageNumber={pageInfo.originalIndex + 1}
                  onLoadSuccess={(page) => onPageLoadSuccess(page, pageNumber)}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  loading={<div className="bg-slate-200 h-[1122px] w-[794px] flex items-center justify-center"><div className="page-loading-spinner"></div></div>}
                />
                {items
                  .filter((el) => el.pageNumber === pageNumber)
                  .map((el) => (
                    <DraggableItem
                      key={el.id}
                      element={el}
                      isSelected={selectedTextId === el.id}
                      onSelect={setSelectedTextId}
                      onChange={onItemChange}
                      onDelete={onItemDelete}
                    />
                  ))}
              </div>
            );
          })}
        </Document>
      </div>
    </main>
  );
};

export default DocumentViewer;
