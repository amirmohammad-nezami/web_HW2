package com.example.demo.service;

import com.example.demo.dto.CanvasRequest;
import com.example.demo.entity.Canvas;
import com.example.demo.entity.Shape;
import com.example.demo.entity.User;
import com.example.demo.repository.CanvasRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CanvasService {
    
    private final CanvasRepository canvasRepository;
    private final UserRepository userRepository;
    
    public CanvasService(CanvasRepository canvasRepository, UserRepository userRepository) {
        this.canvasRepository = canvasRepository;
        this.userRepository = userRepository;
    }
    
    public Canvas saveCanvas(String username, CanvasRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Canvas canvas = new Canvas();
        canvas.setTitle(request.getTitle());
        canvas.setUser(user);
        
        List<Shape> shapes = request.getShapes().stream()
                .map(shapeDto -> {
                    Shape shape = new Shape();
                    shape.setShapeId(shapeDto.getId());
                    shape.setType(Shape.ShapeType.valueOf(shapeDto.getType().toUpperCase()));
                    shape.setX(shapeDto.getX());
                    shape.setY(shapeDto.getY());
                    return shape;
                })
                .collect(Collectors.toList());
        
        canvas.setShapes(shapes);
        return canvasRepository.save(canvas);
    }
    
    public List<Canvas> getUserCanvases(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return canvasRepository.findByUserOrderByUpdatedAtDesc(user);
    }
    
    public Canvas getCanvas(String username, Long canvasId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Canvas canvas = canvasRepository.findById(canvasId)
                .orElseThrow(() -> new RuntimeException("Canvas not found"));
        
        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return canvas;
    }
    
    public void deleteCanvas(String username, Long canvasId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Canvas canvas = canvasRepository.findById(canvasId)
                .orElseThrow(() -> new RuntimeException("Canvas not found"));
        
        if (!canvas.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        canvasRepository.delete(canvas);
    }
} 