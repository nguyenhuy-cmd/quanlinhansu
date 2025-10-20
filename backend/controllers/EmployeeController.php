<?php
require_once __DIR__ . '/../models/EmployeeModel.php';

class EmployeeController {
    private EmployeeModel $model;
    public function __construct() { $this->model = new EmployeeModel(); }

    public function index() { json_response($this->model->all()); }
    public function show(int $id) { $emp = $this->model->get($id); json_response($emp ?? ['error'=>'Not found'], $emp?200:404); }
    public function store() { $data = json_decode(file_get_contents('php://input'), true) ?? []; $id = $this->model->create($data); json_response(['id'=>$id], 201); }
    public function update(int $id) { $data = json_decode(file_get_contents('php://input'), true) ?? []; $ok = $this->model->update($id,$data); json_response(['updated'=>$ok]); }
    public function destroy(int $id) { $ok = $this->model->delete($id); json_response(['deleted'=>$ok]); }
}
