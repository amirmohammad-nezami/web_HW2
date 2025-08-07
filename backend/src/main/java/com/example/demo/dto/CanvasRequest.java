package com.example.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class CanvasRequest {
    private String title;
    private List<ShapeDto> shapes;
    
    @Data
    public static class ShapeDto {
        private String id;
        private String type;
        private Double x;
        private Double y;
    }
} 