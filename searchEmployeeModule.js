// SearchEmployeeModule - Module tìm kiếm nhân viên nâng cao

import EmployeeDbModule from './employeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const SearchEmployeeModule = (() => {
    
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const departments = DepartmentModule.getAllDepartments();
        const positions = PositionModule.getAllPositions();

        container.innerHTML = `
            <div class="form-container">
                <h2>Tìm kiếm Nhân viên Nâng cao</h2>
                
                <form id="search-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-name-pattern">Tên (hỗ trợ regex):</label>
                            <input type="text" id="search-name-pattern" placeholder="Ví dụ: Nguyễn.*An">
                        </div>
                        <div class="form-group">
                            <label for="search-email">Email:</label>
                            <input type="text" id="search-email" placeholder="example@company.com">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-department">Phòng ban:</label>
                            <select id="search-department">
                                <option value="">-- Tất cả --</option>
                                ${departments.map(dept => 
                                    `<option value="${dept.id}">${dept.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="search-position">Vị trí:</label>
                            <select id="search-position">
                                <option value="">-- Tất cả --</option>
                                ${positions.map(pos => 
                                    `<option value="${pos.id}">${pos.title}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-min-salary">Lương tối thiểu:</label>
                            <input type="number" id="search-min-salary" min="0" step="100000">
                        </div>
                        <div class="form-group">
                            <label for="search-max-salary">Lương tối đa:</label>
                            <input type="number" id="search-max-salary" min="0" step="100000">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-status">Trạng thái:</label>
                            <select id="search-status">
                                <option value="">-- Tất cả --</option>
                                <option value="active">Đang làm việc</option>
                                <option value="inactive">Đã nghỉ việc</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="sort-by">Sắp xếp theo:</label>
                            <select id="sort-by">
                                <option value="name">Tên</option>
                                <option value="salary">Lương</option>
                                <option value="hireDate">Ngày vào làm</option>
                                <option value="id">ID</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="sort-order">Thứ tự:</label>
                            <select id="sort-order">
                                <option value="asc">Tăng dần</option>
                                <option value="desc">Giảm dần</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Tìm kiếm</button>
                    <button type="reset" class="btn btn-secondary">Xóa bộ lọc</button>
                </form>
            </div>

            <div id="search-results"></div>
        `;

        // Event listeners
        const form = document.getElementById('search-form');
        const resultsDiv = document.getElementById('search-results');

        // Submit search
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });

        // Reset
        form.addEventListener('reset', () => {
            setTimeout(() => {
                resultsDiv.innerHTML = '';
            }, 0);
        });

        // Perform search function
        const performSearch = () => {
            // Build search criteria
            const criteria = {};

            const namePattern = document.getElementById('search-name-pattern').value.trim();
            const email = document.getElementById('search-email').value.trim();
            const departmentId = document.getElementById('search-department').value;
            const positionId = document.getElementById('search-position').value;
            const minSalary = document.getElementById('search-min-salary').value;
            const maxSalary = document.getElementById('search-max-salary').value;
            const status = document.getElementById('search-status').value;

            if (namePattern) criteria.name = namePattern;
            if (departmentId) criteria.departmentId = departmentId;
            if (positionId) criteria.positionId = positionId;
            if (minSalary) criteria.minSalary = minSalary;
            if (maxSalary) criteria.maxSalary = maxSalary;
            if (status) criteria.status = status;

            // Get results
            let results = EmployeeDbModule.searchEmployees(criteria);

            // Additional filter by email if provided
            if (email) {
                const emailRegex = new RegExp(email, 'i');
                results = results.filter(emp => emailRegex.test(emp.email));
            }

            // Sort results
            const sortBy = document.getElementById('sort-by').value;
            const sortOrder = document.getElementById('sort-order').value;
            results = EmployeeDbModule.sortEmployees(results, sortBy, sortOrder);

            // Display results
            displayResults(results);
        };

        // Display search results
        const displayResults = (results) => {
            if (results.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="table-container">
                        <div class="empty-state">
                            <h3>Không tìm thấy nhân viên nào phù hợp</h3>
                            <p>Vui lòng thử lại với điều kiện tìm kiếm khác</p>
                        </div>
                    </div>
                `;
                return;
            }

            resultsDiv.innerHTML = `
                <div class="table-container">
                    <h3>Kết quả tìm kiếm (${results.length} nhân viên)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Điện thoại</th>
                                <th>Phòng ban</th>
                                <th>Vị trí</th>
                                <th>Lương</th>
                                <th>Ngày vào</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(emp => {
                                const dept = DepartmentModule.getDepartmentById(emp.departmentId);
                                const pos = PositionModule.getPositionById(emp.positionId);
                                return `
                                    <tr>
                                        <td>${emp.id}</td>
                                        <td>${emp.name}</td>
                                        <td>${emp.email}</td>
                                        <td>${emp.phone}</td>
                                        <td>${dept ? dept.name : '-'}</td>
                                        <td>${pos ? pos.title : '-'}</td>
                                        <td>${emp.salary.toLocaleString('vi-VN')} VNĐ</td>
                                        <td>${emp.hireDate}</td>
                                        <td>${emp.status === 'active' ? 
                                            '<span style="color: green;">Đang làm</span>' : 
                                            '<span style="color: red;">Đã nghỉ</span>'}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>

                    <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                        <h4>Thống kê:</h4>
                        <p>Tổng số: ${results.length} nhân viên</p>
                        <p>Tổng lương: ${results.reduce((sum, e) => sum + e.salary, 0).toLocaleString('vi-VN')} VNĐ</p>
                        <p>Lương trung bình: ${(results.reduce((sum, e) => sum + e.salary, 0) / results.length).toLocaleString('vi-VN')} VNĐ</p>
                    </div>
                </div>
            `;
        };

        // Auto-search on load to show all employees
        performSearch();
    };

    return { render };
})();

export default SearchEmployeeModule;
