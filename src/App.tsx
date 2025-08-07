import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import { canvasAPI } from './services/api';
import type { Canvas } from './services/api';

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
    onSave?: () => void;
    loading?: boolean;
}> = ({ title, setTitle, onImport, onExport, onSave, loading }) => (
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
            {onSave && (
                <button className="save-btn" onClick={onSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                </button>
            )}
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [savedCanvases, setSavedCanvases] = useState<Canvas[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');
        if (token && savedUsername) {
            setIsAuthenticated(true);
            setUsername(savedUsername);
            loadUserCanvases();
        }
    }, []);

    const loadUserCanvases = async () => {
        try {
            const response = await canvasAPI.getUserCanvases();
            setSavedCanvases(response.data);
        } catch (error) {
            console.error('Failed to load canvases:', error);
        }
    };

    const handleLogin = (token: string, user: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);
        setIsAuthenticated(true);
        setUsername(user);
        loadUserCanvases();
    };

    const handleSignup = (token: string, user: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', user);
        setIsAuthenticated(true);
        setUsername(user);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername('');
        setSavedCanvases([]);
    };

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

    // Save canvas to backend
    const handleSaveCanvas = async () => {
        if (!isAuthenticated) return;
        
        setLoading(true);
        try {
            await canvasAPI.saveCanvas({ title, shapes });
            await loadUserCanvases();
            alert('Canvas saved successfully!');
        } catch (error) {
            alert('Failed to save canvas');
        } finally {
            setLoading(false);
        }
    };

    // Load canvas from backend
    const handleLoadCanvas = async (canvas: Canvas) => {
        console.log('Loading canvas:', canvas);
        setTitle(canvas.title);
        
        // Transform backend shape format to frontend format
        const transformedShapes = canvas.shapes.map(shape => ({
            id: (shape.shapeId || shape.id || crypto.randomUUID()) as string,
            type: (shape.type?.toLowerCase() as 'circle' | 'square' | 'triangle') || 'circle',
            x: shape.x,
            y: shape.y
        }));
        
        console.log('Transformed shapes:', transformedShapes);
        setShapes(transformedShapes);
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

    if (!isAuthenticated) {
        return (
            <div className="app-container">
                {showLogin ? (
                    <Login onLogin={handleLogin} onSwitchToSignup={() => setShowLogin(false)} />
                ) : (
                    <Signup onSignup={handleSignup} onSwitchToLogin={() => setShowLogin(true)} />
                )}
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="user-info">
                <span>Welcome, {username}!</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <Header 
                title={title} 
                setTitle={setTitle} 
                onImport={handleImport} 
                onExport={handleExport}
                onSave={handleSaveCanvas}
                loading={loading}
            />
            <div className="main-content">
                <Sidebar />
                <Canvas shapes={shapes} onDropShape={handleDropShape} onRemoveShape={handleRemoveShape} />
            </div>
            <Footer shapes={shapes} />
            {savedCanvases.length > 0 && (
                <div className="saved-canvases">
                    <h3>Saved Canvases</h3>
                    <div className="canvas-list">
                        {savedCanvases.map(canvas => (
                            <div key={canvas.id} className="canvas-item" onClick={() => handleLoadCanvas(canvas)}>
                                <span>{canvas.title}</span>
                                <small>{new Date(canvas.updatedAt).toLocaleDateString()}</small>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
