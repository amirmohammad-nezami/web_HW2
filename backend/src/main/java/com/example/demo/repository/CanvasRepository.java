package com.example.demo.repository;

import com.example.demo.entity.Canvas;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CanvasRepository extends JpaRepository<Canvas, Long> {
    List<Canvas> findByUser(User user);
    List<Canvas> findByUserOrderByUpdatedAtDesc(User user);
} 