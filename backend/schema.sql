
-- Cattle table
CREATE TABLE IF NOT EXISTS Cattle (
    cattle_ID INT AUTO_INCREMENT PRIMARY KEY,
    animal_Type VARCHAR(50) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    average_Weight DECIMAL(10,2) NOT NULL,
    farm_ID INT NOT NULL,
    unit_ID INT NOT NULL,
    FOREIGN KEY (farm_ID) REFERENCES FarmFarmer(farm_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (unit_ID) REFERENCES ProcessingUnit(unit_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- FarmFarmer table
CREATE TABLE IF NOT EXISTS FarmFarmer (
    farm_ID INT AUTO_INCREMENT PRIMARY KEY,
    farm_Name VARCHAR(100) NOT NULL,
    livestock_Type VARCHAR(50) NOT NULL,
    available_Stock INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    number_of_Livestock INT NOT NULL DEFAULT 0,
    contact_info VARCHAR(100) NOT NULL
);

-- MeatProduct table
CREATE TABLE IF NOT EXISTS MeatProduct (
    product_ID INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    meat_Type VARCHAR(50) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    cut_Type VARCHAR(50) NOT NULL,
    seasonality VARCHAR(50),
    processing_Date DATE NOT NULL,
    expiration_Date DATE NOT NULL,
    weight_Per_Unit DECIMAL(10,2) NOT NULL,
    price_Per_Unit DECIMAL(10,2) NOT NULL,
    stock_Availability INT NOT NULL,
    batch_ID INT,
    FOREIGN KEY (batch_ID) REFERENCES MeatBatch(batch_ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- ProcessingUnit table
CREATE TABLE IF NOT EXISTS ProcessingUnit (
    unit_ID INT AUTO_INCREMENT PRIMARY KEY,
    facility_Name VARCHAR(100) NOT NULL,
    processing_Capacity INT NOT NULL,
    processing_Date DATE NOT NULL
);

-- MeatBatch table
CREATE TABLE IF NOT EXISTS MeatBatch (
    batch_ID INT AUTO_INCREMENT PRIMARY KEY,
    production_Date DATE NOT NULL,
    expiration_Date DATE NOT NULL,
    total_Weight DECIMAL(10,2) NOT NULL,
    batch_Status ENUM('transit', 'stored', 'sold') NOT NULL,
    unit_ID INT NOT NULL,
    warehouse_ID INT,
    FOREIGN KEY (unit_ID) REFERENCES ProcessingUnit(unit_ID),
    FOREIGN KEY (warehouse_ID) REFERENCES Warehouse(warehouse_ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Warehouse table
CREATE TABLE IF NOT EXISTS Warehouse (
    warehouse_ID INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    current_Stock INT NOT NULL,
    capacity INT NOT NULL,
    storage_Condition VARCHAR(100) NOT NULL
);

-- Consumer table (simplified structure)
CREATE TABLE IF NOT EXISTS Consumer (
    consumer_ID INT AUTO_INCREMENT PRIMARY KEY,
    consumer_name VARCHAR(100) NOT NULL,
    preferred_Meat_Type VARCHAR(50) NOT NULL,
    preferred_Cut VARCHAR(50) NOT NULL,
    average_Order_Size DECIMAL(10,2) NOT NULL,
    average_Spending DECIMAL(10,2) NOT NULL,
    region VARCHAR(100) DEFAULT 'National' NOT NULL,
    season VARCHAR(50) DEFAULT 'All Year' NOT NULL,
    consumption_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    record_date DATE NOT NULL
);

-- Order table
CREATE TABLE IF NOT EXISTS `Order` (
    order_ID INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    consumer_ID INT NOT NULL,
    delivery_ID INT,
    FOREIGN KEY (consumer_ID) REFERENCES Consumer(consumer_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (delivery_ID) REFERENCES Delivery(delivery_ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- OrderProduct junction table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS OrderProduct (
    order_ID INT NOT NULL,
    product_ID INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (order_ID, product_ID),
    FOREIGN KEY (order_ID) REFERENCES `Order`(order_ID),
    FOREIGN KEY (product_ID) REFERENCES MeatProduct(product_ID)
);

-- Delivery table
CREATE TABLE IF NOT EXISTS Delivery (
    delivery_ID INT AUTO_INCREMENT PRIMARY KEY,
    delivery_Type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    delivery_Status VARCHAR(50) NOT NULL,
    order_ID INT NOT NULL,
    vendor_ID INT NOT NULL,
    batch_ID INT NOT NULL,
    warehouse_ID INT NOT NULL,
    FOREIGN KEY (order_ID) REFERENCES `Order`(order_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (vendor_ID) REFERENCES Vendor(vendor_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (batch_ID) REFERENCES MeatBatch(batch_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (warehouse_ID) REFERENCES Warehouse(warehouse_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Retailer table
CREATE TABLE IF NOT EXISTS Retailer (
    retailer_ID INT AUTO_INCREMENT PRIMARY KEY,
    salesVolume_perMonth DECIMAL(10,2) NOT NULL,
    average_Customer_Footfall INT NOT NULL,
    price_markup DECIMAL(5,2) NOT NULL
);

-- Wholeseller table
CREATE TABLE IF NOT EXISTS Wholeseller (
    wholeseller_ID INT AUTO_INCREMENT PRIMARY KEY,
    purchase_Frequency VARCHAR(50) NOT NULL,
    average_Order_Value DECIMAL(10,2) NOT NULL,
    price_markup DECIMAL(5,2) NOT NULL
);

-- Vendor table
CREATE TABLE IF NOT EXISTS Vendor (
    vendor_ID INT AUTO_INCREMENT PRIMARY KEY,
    vendor_Name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    stock_Quantity INT NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    business_Type VARCHAR(100) NOT NULL
);

-- HistoricalPrice table for market trends
CREATE TABLE IF NOT EXISTS HistoricalPrice (
    record_ID INT AUTO_INCREMENT PRIMARY KEY,
    product_ID INT NOT NULL,
    price_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    region VARCHAR(100) NOT NULL,
    FOREIGN KEY (product_ID) REFERENCES MeatProduct(product_ID)
);
