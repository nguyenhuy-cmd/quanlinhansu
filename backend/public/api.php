<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../controllers/EmployeeController.php';

$router = new Router();
$emp = new EmployeeController();

$router->add('GET',    '/api/employees', fn() => $emp->index());
$router->add('GET',    '/api/employees/show', function(){ $id = (int)($_GET['id'] ?? 0); (new EmployeeController())->show($id); });
$router->add('POST',   '/api/employees', fn() => $emp->store());
$router->add('PUT',    '/api/employees', function(){ $id = (int)($_GET['id'] ?? 0); (new EmployeeController())->update($id); });
$router->add('DELETE', '/api/employees', function(){ $id = (int)($_GET['id'] ?? 0); (new EmployeeController())->destroy($id); });

$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
