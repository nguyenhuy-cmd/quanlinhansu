<?php
require_once __DIR__ . '/../core/BaseModel.php';

class EmployeeModel extends BaseModel {
    public function all(): array {
        $stmt = $this->pdo->query('SELECT * FROM employees ORDER BY id');
        return $stmt->fetchAll();
    }

    public function get(int $id): ?array {
        $stmt = $this->pdo->prepare('SELECT * FROM employees WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int {
        $stmt = $this->pdo->prepare('INSERT INTO employees (name, department_id, position_id, salary, bonus, deduction, hire_date, email, phone, address, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
            $data['name'] ?? '',
            $data['department_id'] ?? null,
            $data['position_id'] ?? null,
            $data['salary'] ?? 0,
            $data['bonus'] ?? 0,
            $data['deduction'] ?? 0,
            $data['hire_date'] ?? null,
            $data['email'] ?? null,
            $data['phone'] ?? null,
            $data['address'] ?? null,
            $data['status'] ?? 'active',
        ]);
        return (int)$this->pdo->lastInsertId();
    }

    public function update(int $id, array $data): bool {
        $stmt = $this->pdo->prepare('UPDATE employees SET name=?, department_id=?, position_id=?, salary=?, bonus=?, deduction=?, hire_date=?, email=?, phone=?, address=?, status=? WHERE id=?');
        return $stmt->execute([
            $data['name'] ?? '',
            $data['department_id'] ?? null,
            $data['position_id'] ?? null,
            $data['salary'] ?? 0,
            $data['bonus'] ?? 0,
            $data['deduction'] ?? 0,
            $data['hire_date'] ?? null,
            $data['email'] ?? null,
            $data['phone'] ?? null,
            $data['address'] ?? null,
            $data['status'] ?? 'active',
            $id
        ]);
    }

    public function delete(int $id): bool {
        $stmt = $this->pdo->prepare('DELETE FROM employees WHERE id = ?');
        return $stmt->execute([$id]);
    }
}
