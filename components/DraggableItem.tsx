import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import { EditableItem } from '../types';
import { X } from 'lucide-react';

interface DraggableItemProps {
  element: EditableItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (id: string, newValues: Partial<EditableItem>) => void;
  onDelete: (id: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ element, isSelected, onSelect, onChange, onDelete }) => {
  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };
  
  return (
    <Draggable
      position={{ x: element.x, y: element.y }}
      onStop={(_, data) => onChange(element.id, { x: data.x, y: data.y })}
      handle=".drag-handle"
    >
      <ResizableBox
        width={element.width}
        height={element.height}
        onResizeStop={(_, data) => {
          onChange(element.id, { width: data.size.width, height: data.size.height });
        }}
        minConstraints={[50, 20]}
        maxConstraints={[800, 400]}
        style={{ position: 'absolute', top: 0, left: 0 }}
        className={`group ${isSelected ? 'border-2 border-blue-500' : 'border border-dashed border-transparent hover:border-slate-400'}`}
      >
        <div 
          className="w-full h-full relative"
          onClick={handleItemClick}
        >
          {element.type === 'text' ? (
            <textarea
              value={element.text}
              onChange={(e) => onChange(element.id, { text: e.target.value })}
              className="w-full h-full p-1 bg-transparent resize-none focus:outline-none"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            />
          ) : (
            <div className="w-full h-full bg-black/70" />
          )}

          {isSelected && (
            <>
              <div className="drag-handle absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full cursor-move" title="Move"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(element.id);
                }}
                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                title="Delete"
              >
                <X size={12} />
              </button>
            </>
          )}
        </div>
      </ResizableBox>
    </Draggable>
  );
};

export default DraggableItem;