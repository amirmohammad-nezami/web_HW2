import React, { useState, useRef } from 'react';
import './App.css';

// Types
interface Shape {
  id: string;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
}

// Header Component
const Header: React.FC<{
  title: string;
  setTitle: (t: string) => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}> = ({ title, setTitle, onImport, onExport }) => (
  <header className="header">
    <input
      className="canvas-title"
      value={title}
      onChange={e => setTitle(e.target.value)}
      placeholder="Enter a title for your canvas"
    />
    <div className="header-actions">
      <label className="import-btn">
        Import
        <input type="file" accept="application/json" style={{ display: 'none' }} onChange={onImport} />
      </label>
      <button className="export-btn" onClick={onExport}>Export</button>
    </div>
  </header>
);

// Sidebar Component
const shapesList: Shape['type'][] = ['circle', 'square', 'triangle'];
const Sidebar: React.FC = () => (
  <aside className="sidebar">
    <div className="sidebar-title">Shapes</div>
    <div className="shapes-list">
      {shapesList.map(type => (
        <div
          key={type}
          className={`shape-icon ${type}`}
          draggable
          onDragStart={e => {
            e.dataTransfer.setData('shape-type', type);
          }}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>
      ))}
    </div>
  </aside>
);

// Canvas Component
const Canvas: React.FC<{
  shapes: Shape[];
  onDropShape: (type: Shape['type'], x: number, y: number) => void;
  onRemoveShape: (id: string) => void;
}> = ({ shapes, onDropShape, onRemoveShape }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('shape-type') as Shape['type'];
    if (!type) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    onDropShape(type, x, y);
  };

  return (
    <div
      className="canvas"
      ref={canvasRef}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      {shapes.map(shape => (
        <div
          key={shape.id}
          className={`canvas-shape ${shape.type}`}
          style={{ left: shape.x, top: shape.y }}
          onDoubleClick={() => onRemoveShape(shape.id)}
        >
          {shape.type === 'circle' && <div className="circle-shape" />}
          {shape.type === 'square' && <div className="square-shape" />}
          {shape.type === 'triangle' && <div className="triangle-shape" />}
        </div>
      ))}
    </div>
  );
};

// Footer Component
const Footer: React.FC<{ shapes: Shape[] }> = ({ shapes }) => {
  const counts = shapes.reduce(
    (acc, s) => {
      acc[s.type]++;
      return acc;
    },
    { circle: 0, square: 0, triangle: 0 } as Record<Shape['type'], number>
  );
  return (
    <footer className="footer">
      <span>Circle: {counts.circle}</span>
      <span>Square: {counts.square}</span>
      <span>Triangle: {counts.triangle}</span>
    </footer>
  );
};




const App: React.FC = () => {
  const [title, setTitle] = useState('My Canvas');
  const [shapes, setShapes] = useState<Shape[]>([]);

  // Add shape to canvas
  const handleDropShape = (type: Shape['type'], x: number, y: number) => {
    setShapes(prev => [
      ...prev,
      { id: crypto.randomUUID(), type, x, y }
    ]);
  };

  // Remove shape from canvas
  const handleRemoveShape = (id: string) => {
    setShapes(prev => prev.filter(s => s.id !== id));
  };

  // Export canvas as JSON
  const handleExport = () => {
    const data = JSON.stringify({ title, shapes }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'canvas'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import canvas from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.title && Array.isArray(data.shapes)) {
          setTitle(data.title);
          setShapes(data.shapes);
        }
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-container">
      <Header title={title} setTitle={setTitle} onImport={handleImport} onExport={handleExport} />
      <div className="main-content">
        <Sidebar />
        <Canvas shapes={shapes} onDropShape={handleDropShape} onRemoveShape={handleRemoveShape} />
      </div>
      <Footer shapes={shapes} />
    </div>
  );
};

export default App;
