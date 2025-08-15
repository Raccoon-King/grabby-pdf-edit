
import React, { useState, useCallback, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { PageInfo, EditableItem, PageDimensions, ItemType } from '../types';
import Toolbar from './Toolbar';
import PageSidebar from './PageSidebar';
import DocumentViewer from './DocumentViewer';

interface PdfEditorUIProps {
  file: File;
  onClose: () => void;
}

const PdfEditorUI: React.FC<PdfEditorUIProps> = ({ file, onClose }) => {
  const [fileUrl, setFileUrl] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [editableItems, setEditableItems] = useState<EditableItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [pageDimensions, setPageDimensions] = useState<PageDimensions>({});
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    // Clean up the object URL when the component unmounts or the file changes
    return () => {
      URL.revokeObjectURL(url);
      setFileUrl('');
    };
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPages(
      Array.from({ length: numPages }, (_, i) => ({
        id: crypto.randomUUID(),
        originalIndex: i,
      }))
    );
  };

  const handleAddItem = useCallback((type: ItemType) => {
    const newItem: EditableItem = {
      id: crypto.randomUUID(),
      pageNumber: currentPage,
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 150 : 100,
      height: type === 'text' ? 40 : 50,
      scale: 1,
      text: type === 'text' ? 'New Text' : '',
    };
    setEditableItems((prev) => [...prev, newItem]);
    setSelectedTextId(newItem.id);
  }, [currentPage]);

  const handleItemChange = useCallback((id: string, newValues: Partial<EditableItem>) => {
    setEditableItems((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...newValues } : el))
    );
  }, []);

  const handleItemDelete = useCallback((id: string) => {
    setEditableItems((prev) => prev.filter((el) => el.id !== id));
  }, []);

  const handlePageDelete = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  }, []);
  
  const handlePageSelect = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      const pageElement = document.getElementById(`page-${pageNumber}`);
      if (pageElement) {
          pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const fileBuffer = await file.arrayBuffer();
      const originalPdfDoc = await PDFDocument.load(fileBuffer);
      const newPdfDoc = await PDFDocument.create();
      const font = await newPdfDoc.embedFont(StandardFonts.Helvetica);

      const indicesToKeep = pages.map(p => p.originalIndex);
      const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, indicesToKeep);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      for (const item of editableItems) {
        const newPageIndex = indicesToKeep.indexOf(item.pageNumber - 1);
        if (newPageIndex === -1) continue; // Page was deleted

        const page = newPdfDoc.getPage(newPageIndex);
        const { width: pdfWidth, height: pdfHeight } = page.getSize();
        const renderWidth = pageDimensions[item.pageNumber]?.width;

        if (!renderWidth) continue;

        const scale = pdfWidth / renderWidth;
        const pdfX = item.x * scale;
        const pdfY = pdfHeight - (item.y * scale) - (item.height * scale);

        if (item.type === 'text' && item.text) {
          const fontSize = (item.height * scale) * 0.7;
          page.drawText(item.text, {
            x: pdfX,
            y: pdfY,
            font,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        } else if (item.type === 'redaction') {
            page.drawRectangle({
                x: pdfX,
                y: pdfY,
                width: item.width * scale,
                height: item.height * scale,
                color: rgb(0, 0, 0),
            });
        }
      }

      // Remove metadata
      newPdfDoc.setTitle('');
      newPdfDoc.setAuthor('');
      newPdfDoc.setSubject('');
      newPdfDoc.setCreator('React PDF Editor');
      newPdfDoc.setProducer('React PDF Editor');
      newPdfDoc.setKeywords([]);
      const now = new Date();
      newPdfDoc.setCreationDate(now);
      newPdfDoc.setModificationDate(now);

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `redacted_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("An error occurred while generating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };
  
  if (!fileUrl) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-200">
            <div className="page-loading-spinner"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-200 text-slate-800">
      <Toolbar 
        onAddText={() => handleAddItem('text')} 
        onAddRedaction={() => handleAddItem('redaction')}
        onDownload={handleDownload} 
        onClose={onClose} 
        isDownloading={isDownloading} 
      />
      <div className="flex flex-grow overflow-hidden">
        <PageSidebar
          pages={pages}
          currentPage={currentPage}
          numPages={numPages}
          onPageSelect={handlePageSelect}
          onPageDelete={handlePageDelete}
          fileUrl={fileUrl}
        />
        <DocumentViewer
          fileUrl={fileUrl}
          pages={pages}
          items={editableItems}
          selectedTextId={selectedTextId}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          setSelectedTextId={setSelectedTextId}
          onItemChange={handleItemChange}
          onItemDelete={handleItemDelete}
          setPageDimensions={setPageDimensions}
        />
      </div>
    </div>
  );
};

export default PdfEditorUI;
