package com.example.demo.controller;

import com.example.demo.dto.CanvasRequest;
import com.example.demo.entity.Canvas;
import com.example.demo.service.CanvasService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/canvas")
@CrossOrigin(origins = "http://localhost:5173")
public class CanvasController {
    
    private final CanvasService canvasService;
    
    public CanvasController(CanvasService canvasService) {
        this.canvasService = canvasService;
    }
    
    @PostMapping
    public ResponseEntity<Canvas> saveCanvas(@RequestBody CanvasRequest request, Authentication authentication) {
        try {
            String username = authentication.getName();
            Canvas savedCanvas = canvasService.saveCanvas(username, request);
            return ResponseEntity.ok(savedCanvas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Canvas>> getUserCanvases(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<Canvas> canvases = canvasService.getUserCanvases(username);
            return ResponseEntity.ok(canvases);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Canvas> getCanvas(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            Canvas canvas = canvasService.getCanvas(username, id);
            return ResponseEntity.ok(canvas);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCanvas(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            canvasService.deleteCanvas(username, id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 