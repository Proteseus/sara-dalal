-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255)
);

-- Skin profiles table
CREATE TABLE skin_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skin_type VARCHAR(50),
    concerns TEXT[],
    allergies TEXT[],
    current_routine TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER,
    is_natural BOOLEAN,
    is_gentle BOOLEAN,
    price DECIMAL(10,2),
    size DECIMAL(10,2),
    unit VARCHAR(20),
    skin_type VARCHAR(50)[],
    target_concerns TEXT[],
    key_ingredients TEXT[],
    ingredients TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User routines table
CREATE TABLE user_routines (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Routine products table (junction table)
CREATE TABLE routine_products (
    id SERIAL PRIMARY KEY,
    routine_id INTEGER REFERENCES user_routines(id),
    product_id INTEGER REFERENCES products(id),
    step_order INTEGER NOT NULL,
    time_of_day VARCHAR(20), -- morning, evening, weekly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User feedback table
CREATE TABLE user_feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_skin_type ON products USING GIN(skin_type);
CREATE INDEX idx_products_target_concerns ON products USING GIN(target_concerns);
CREATE INDEX idx_user_routines_user ON user_routines(user_id);
CREATE INDEX idx_routine_products_routine ON routine_products(routine_id);
CREATE INDEX idx_routine_products_product ON routine_products(product_id); 