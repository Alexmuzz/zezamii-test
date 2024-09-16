Database Management

1. Database Design
Below are SQL queries to create tables for a basic e-commerce system, including Products, Orders, OrderItems, and Customers.

-- Create the Products table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    CONSTRAINT CHK_Products_Price CHECK (Price >= 0),
    CONSTRAINT CHK_Products_StockQuantity CHECK (StockQuantity >= 0)
);

Mock data for Products
INSERT INTO Products (Name, Description, Price, StockQuantity)
VALUES 
('Laptop', '14-inch, 8GB RAM, 256GB SSD', 1200.00, 50),
('Smartphone', '5.5-inch, 64GB Storage', 600.00, 200),
('Headphones', 'Wireless noise-cancelling', 150.00, 75),
('Smartwatch', 'Waterproof, GPS', 250.00, 120),
('Gaming Console', '4K Ultra HD, 1TB Storage', 450.00, 30),
('Bluetooth Speaker', 'Portable, 10-hour battery life', 80.00, 150),
('Tablet', '10-inch, 128GB Storage', 300.00, 100),
('Monitor', '27-inch, 144Hz refresh rate', 400.00, 60),
('Keyboard', 'Mechanical, RGB lighting', 100.00, 80),
('Mouse', 'Wireless, ergonomic design', 50.00, 200);


-- Create the Customers table
CREATE TABLE Customers (
    CustomerID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Phone NVARCHAR(15),
    Address NVARCHAR(255)
);

Mock data for Customers
INSERT INTO Customers (FirstName, LastName, Email, Phone, Address)
VALUES 
('John', 'Doe', 'john.doe@example.com', '555-1234', '123 Main St, Springfield'),
('Jane', 'Smith', 'jane.smith@example.com', '555-5678', '456 Elm St, Metropolis'),
('Michael', 'Johnson', 'michael.johnson@example.com', '555-9876', '789 Oak St, Gotham'),
('Emily', 'Davis', 'emily.davis@example.com', '555-6543', '101 Pine St, Star City'),
('David', 'Wilson', 'david.wilson@example.com', '555-3210', '202 Maple St, Central City'),
('Sarah', 'Brown', 'sarah.brown@example.com', '555-4321', '303 Cedar St, Coast City'),
('James', 'Miller', 'james.miller@example.com', '555-7654', '404 Birch St, Bludhaven'),
('Elizabeth', 'Taylor', 'elizabeth.taylor@example.com', '555-8765', '505 Willow St, Keystone City');


-- Create the Orders table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    CustomerID INT,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID) REFERENCES Customers(CustomerID),
    CONSTRAINT CHK_Orders_TotalAmount CHECK (TotalAmount >= 0)
);

Mock data for Customers
INSERT INTO Orders (CustomerID, OrderDate, TotalAmount)
VALUES 
(1, '2023-09-01', 1450.00),
(2, '2023-09-03', 850.00),
(3, '2023-09-05', 1650.00),
(4, '2023-09-10', 250.00),
(5, '2023-09-12', 1200.00),
(6, '2023-09-14', 450.00),
(7, '2023-09-15', 80.00),
(8, '2023-09-20', 600.00),
(1, '2023-09-22', 1800.00),
(2, '2023-09-25', 950.00);


-- Create the OrderItems table
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    ProductID INT,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    CONSTRAINT CHK_OrderItems_Quantity CHECK (Quantity > 0),
    CONSTRAINT CHK_OrderItems_Price CHECK (Price >= 0)
);

Mock data for OrderItems
INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
VALUES 
(1, 1, 1, 1200.00),
(1, 3, 2, 150.00),
(2, 2, 1, 600.00),
(2, 4, 1, 250.00),
(3, 5, 1, 450.00),
(3, 6, 3, 80.00),
(4, 4, 1, 250.00),
(5, 7, 1, 300.00),
(5, 8, 1, 400.00),
(6, 5, 1, 450.00),
(7, 6, 1, 80.00),
(8, 2, 1, 600.00),
(9, 1, 1, 1200.00),
(9, 8, 1, 400.00),
(10, 9, 2, 100.00);


2. SQL Queries

Retrieve all orders and their associated customer details:

SELECT 
    Orders.OrderID, 
    Orders.OrderDate, 
    Orders.TotalAmount, 
    Customers.CustomerID, 
    Customers.FirstName, 
    Customers.LastName, 
    Customers.Email, 
    Customers.Phone, 
    Customers.Address
FROM 
    Orders
JOIN 
    Customers ON Orders.CustomerID = Customers.CustomerID;

Retrieve a list of products not ordered in the last 30 days:

SELECT 
    Products.ProductID, 
    Products.Name, 
    Products.Description, 
    Products.Price, 
    Products.StockQuantity
FROM 
    Products
LEFT JOIN 
    OrderItems ON Products.ProductID = OrderItems.ProductID
LEFT JOIN 
    Orders ON OrderItems.OrderID = Orders.OrderID AND Orders.OrderDate >= DATEADD(DAY, -30, GETDATE())
WHERE 
    Orders.OrderID IS NULL;

Update a product’s price and reflect that in all current orders:

BEGIN TRANSACTION;

UPDATE Products
SET Price = @NewPrice
WHERE ProductID = @ProductID;

UPDATE OrderItems
SET Price = @NewPrice
WHERE ProductID = @ProductID;

COMMIT TRANSACTION;


3. Stored Procedures

Create a stored procedure that accepts a customer ID and returns their order history, including product details:

CREATE PROCEDURE GetCustomerOrderHistory
    @CustomerID INT
AS
BEGIN
    SELECT 
        Orders.OrderID, 
        Orders.OrderDate, 
        Orders.TotalAmount, 
        OrderItems.OrderItemID, 
        Products.ProductID, 
        Products.Name, 
        OrderItems.Quantity, 
        OrderItems.Price
    FROM 
        Orders
    JOIN 
        OrderItems ON Orders.OrderID = OrderItems.OrderID
    JOIN 
        Products ON OrderItems.ProductID = Products.ProductID
    WHERE 
        Orders.CustomerID = @CustomerID;
END

EXEC GetCustomerOrderHistory @CustomerID = 1;


Bonus
Write a query that returns the total revenue generated by each customer:

SELECT 
    Customers.CustomerID,
    Customers.FirstName,
    Customers.LastName,
    SUM(Orders.TotalAmount) AS TotalRevenue
FROM 
    Orders
JOIN 
    Customers ON Orders.CustomerID = Customers.CustomerID
GROUP BY 
    Customers.CustomerID,
    Customers.FirstName,
    Customers.LastName;
