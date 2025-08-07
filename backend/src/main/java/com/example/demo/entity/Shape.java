package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "shapes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shape {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String shapeId; // Frontend UUID
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShapeType type;
    
    @Column(nullable = false)
    private Double x;
    
    @Column(nullable = false)
    private Double y;
    
    public enum ShapeType {
        CIRCLE, SQUARE, TRIANGLE
    }
} 