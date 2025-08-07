-- Canvas Database Setup
-- Run this script in PostgreSQL to create the database

CREATE DATABASE canvas_db;

-- Connect to the database and run:
-- \c canvas_db

-- The application will automatically create the tables using JPA/Hibernate
-- Tables that will be created:
-- - users (id, username, password, email, created_at)
-- - canvases (id, title, user_id, created_at, updated_at)
-- - shapes (id, shape_id, type, x, y, canvas_id) 