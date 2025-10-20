<?php
// Simple Router

class Router {
    private array $routes = [];

    public function add(string $method, string $path, callable $handler): void {
        $this->routes[] = [$method, $path, $handler];
    }

    public function dispatch(string $method, string $uri) {
        $path = parse_url($uri, PHP_URL_PATH);
        foreach ($this->routes as [$m, $p, $h]) {
            if ($m === $method && $p === $path) {
                return $h();
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
}
