-- init.sql - Create HRM tables and seed data
CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department_id INT NULL,
  position_id INT NULL,
  salary INT DEFAULT 0,
  bonus INT DEFAULT 0,
  deduction INT DEFAULT 0,
  hire_date DATE NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active'
);

INSERT INTO employees (name, department_id, position_id, salary, bonus, deduction, hire_date, email, phone, address, status)
VALUES
 ('Nguyễn Văn An', 1, 1, 15000000, 2000000, 500000, '2020-01-15', 'nguyenvanan@company.com', '0912345678', 'Hà Nội', 'active'),
 ('Trần Thị Bình', 2, 2, 12000000, 1500000, 300000, '2021-03-20', 'tranthibinh@company.com', '0923456789', 'Hồ Chí Minh', 'active');
