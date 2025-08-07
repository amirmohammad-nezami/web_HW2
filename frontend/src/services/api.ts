import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    password: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    username: string;
}

export interface Shape {
    id?: string;
    shapeId?: string;
    type: string;
    x: number;
    y: number;
}

export interface CanvasRequest {
    title: string;
    shapes: Shape[];
}

export interface Canvas {
    id: number;
    title: string;
    shapes: Shape[];
    user?: any;
    createdAt: string;
    updatedAt: string;
}

export const authAPI = {
    login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
    signup: (data: SignupRequest) => api.post<AuthResponse>('/auth/signup', data),
};

export const canvasAPI = {
    saveCanvas: (data: CanvasRequest) => api.post<Canvas>('/canvas', data),
    getUserCanvases: () => api.get<Canvas[]>('/canvas'),
    getCanvas: (id: number) => api.get<Canvas>(`/canvas/${id}`),
    deleteCanvas: (id: number) => api.delete(`/canvas/${id}`),
};

export default api; 