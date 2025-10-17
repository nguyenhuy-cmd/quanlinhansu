// EditEmployeeModule - Module sửa thông tin nhân viên

import EmployeeDbModule from './employeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const EditEmployeeModule = (() => {
    // Closure để lưu trạng thái edit
    let currentEmployeeId = null;

    // Validate form data
    function validateEmployeeData(data) {
        const errors = [];

        if (!data.name || data.name.trim() === '') {
            errors.push('Tên nhân viên không được để trống');
        }

        if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.push('Email không hợp lệ');
        }

        if (!data.phone || !data.phone.match(/^[0-9]{10,11}$/)) {
            errors.push('Số điện thoại không hợp lệ (10-11 số)');
        }

        if (!data.salary || parseFloat(data.salary) <= 0) {
            errors.push('Lương phải lớn hơn 0');
        }

        return errors;
    }

    // Load employee data into form
    const loadEmployeeData = (employee) => {
        if (!employee) return;

        currentEmployeeId = employee.id;

        document.getElementById('edit-emp-name').value = employee.name || '';
        document.getElementById('edit-emp-email').value = employee.email || '';
        document.getElementById('edit-emp-phone').value = employee.phone || '';
        document.getElementById('edit-emp-address').value = employee.address || '';
        document.getElementById('edit-emp-department').value = employee.departmentId || '';
        document.getElementById('edit-emp-position').value = employee.positionId || '';
        document.getElementById('edit-emp-salary').value = employee.salary || 0;
        document.getElementById('edit-emp-hire-date').value = employee.hireDate || '';
        document.getElementById('edit-emp-bonus').value = employee.bonus || 0;
        document.getElementById('edit-emp-deduction').value = employee.deduction || 0;
        document.getElementById('edit-emp-status').value = employee.status || 'active';

        // Show edit form
        document.getElementById('search-section').style.display = 'none';
        document.getElementById('edit-section').style.display = 'block';
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const departments = DepartmentModule.getAllDepartments();
        const positions = PositionModule.getAllPositions();
        const employees = EmployeeDbModule.getAllEmployees();

        container.innerHTML = `
            <!-- Search Section -->
            <div id="search-section">
                <div class="form-container">
                    <h2>Tìm kiếm Nhân viên để Sửa</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="search-id">Tìm theo ID:</label>
                            <input type="number" id="search-id" placeholder="Nhập ID nhân viên">
                        </div>
                        <div class="form-group">
                            <label for="search-name">Tìm theo Tên:</label>
                            <input type="text" id="search-name" placeholder="Nhập tên nhân viên">
                        </div>
                    </div>
                    
                    <button id="btn-search" class="btn btn-primary">Tìm kiếm</button>
                </div>

                <div class="table-container">
                    <h3>Danh sách Nhân viên</h3>
                    ${employees.length === 0 ? 
                        '<div class="empty-state"><h3>Chưa có nhân viên nào</h3></div>' :
                        `<table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Phòng ban</th>
                                    <th>Vị trí</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${employees.map(emp => {
                                    const dept = DepartmentModule.getDepartmentById(emp.departmentId);
                                    const pos = PositionModule.getPositionById(emp.positionId);
                                    return `
                                        <tr>
                                            <td>${emp.id}</td>
                                            <td>${emp.name}</td>
                                            <td>${emp.email}</td>
                                            <td>${dept ? dept.name : '-'}</td>
                                            <td>${pos ? pos.title : '-'}</td>
                                            <td>
                                                <button class="btn btn-info btn-edit" data-id="${emp.id}">Sửa</button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>`
                    }
                </div>
            </div>

            <!-- Edit Section -->
            <div id="edit-section" style="display: none;">
                <div class="form-container">
                    <h2>Chỉnh sửa Thông tin Nhân viên</h2>
                    
                    <form id="edit-employee-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-emp-name">Họ và tên: *</label>
                                <input type="text" id="edit-emp-name" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-emp-email">Email: *</label>
                                <input type="email" id="edit-emp-email" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-emp-phone">Số điện thoại: *</label>
                                <input type="tel" id="edit-emp-phone" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-emp-address">Địa chỉ:</label>
                                <input type="text" id="edit-emp-address">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-emp-department">Phòng ban: *</label>
                                <select id="edit-emp-department" required>
                                    <option value="">-- Chọn phòng ban --</option>
                                    ${departments.map(dept => 
                                        `<option value="${dept.id}">${dept.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-emp-position">Vị trí: *</label>
                                <select id="edit-emp-position" required>
                                    <option value="">-- Chọn vị trí --</option>
                                    ${positions.map(pos => 
                                        `<option value="${pos.id}">${pos.title}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-emp-salary">Lương cơ bản: *</label>
                                <input type="number" id="edit-emp-salary" min="0" step="100000" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-emp-hire-date">Ngày vào làm: *</label>
                                <input type="date" id="edit-emp-hire-date" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="edit-emp-bonus">Thưởng:</label>
                                <input type="number" id="edit-emp-bonus" min="0" step="100000">
                            </div>
                            <div class="form-group">
                                <label for="edit-emp-deduction">Khấu trừ:</label>
                                <input type="number" id="edit-emp-deduction" min="0" step="100000">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="edit-emp-status">Trạng thái:</label>
                            <select id="edit-emp-status">
                                <option value="active">Đang làm việc</option>
                                <option value="inactive">Đã nghỉ việc</option>
                            </select>
                        </div>

                        <div id="edit-messages"></div>

                        <div style="margin-top: 20px;">
                            <button type="submit" class="btn btn-success">Cập nhật</button>
                            <button type="button" id="btn-cancel" class="btn btn-secondary">Hủy</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Event listeners
        const searchBtn = document.getElementById('btn-search');
        const searchIdInput = document.getElementById('search-id');
        const searchNameInput = document.getElementById('search-name');
        const editForm = document.getElementById('edit-employee-form');
        const cancelBtn = document.getElementById('btn-cancel');
        const messagesDiv = document.getElementById('edit-messages');

        // Search functionality
        const performSearch = () => {
            const id = searchIdInput.value.trim();
            const name = searchNameInput.value.trim();

            if (id) {
                const employee = EmployeeDbModule.getEmployeeById(id);
                if (employee) {
                    loadEmployeeData(employee);
                } else {
                    alert('Không tìm thấy nhân viên với ID: ' + id);
                }
            } else if (name) {
                const results = EmployeeDbModule.searchEmployees({ name });
                if (results.length === 1) {
                    loadEmployeeData(results[0]);
                } else if (results.length > 1) {
                    alert(`Tìm thấy ${results.length} nhân viên. Vui lòng chọn từ bảng bên dưới.`);
                } else {
                    alert('Không tìm thấy nhân viên');
                }
            } else {
                alert('Vui lòng nhập ID hoặc tên để tìm kiếm');
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        searchNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        // Edit buttons in table
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const employee = EmployeeDbModule.getEmployeeById(id);
                if (employee) {
                    loadEmployeeData(employee);
                }
            });
        });

        // Cancel button
        cancelBtn.addEventListener('click', () => {
            currentEmployeeId = null;
            document.getElementById('search-section').style.display = 'block';
            document.getElementById('edit-section').style.display = 'none';
            messagesDiv.innerHTML = '';
        });

        // Submit form
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messagesDiv.innerHTML = '';

            if (!currentEmployeeId) {
                alert('Lỗi: Không xác định được nhân viên');
                return;
            }

            const employeeData = {
                name: document.getElementById('edit-emp-name').value.trim(),
                email: document.getElementById('edit-emp-email').value.trim(),
                phone: document.getElementById('edit-emp-phone').value.trim(),
                address: document.getElementById('edit-emp-address').value.trim(),
                departmentId: parseInt(document.getElementById('edit-emp-department').value),
                positionId: parseInt(document.getElementById('edit-emp-position').value),
                salary: parseFloat(document.getElementById('edit-emp-salary').value),
                hireDate: document.getElementById('edit-emp-hire-date').value,
                bonus: parseFloat(document.getElementById('edit-emp-bonus').value) || 0,
                deduction: parseFloat(document.getElementById('edit-emp-deduction').value) || 0,
                status: document.getElementById('edit-emp-status').value
            };

            const errors = validateEmployeeData(employeeData);
            if (errors.length > 0) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">
                        <ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>
                    </div>
                `;
                return;
            }

            try {
                await EmployeeDbModule.updateEmployee(currentEmployeeId, employeeData);
                
                messagesDiv.innerHTML = `
                    <div class="alert alert-success">
                        Cập nhật thông tin nhân viên thành công!
                    </div>
                `;
                
                setTimeout(() => {
                    currentEmployeeId = null;
                    render(containerId);
                }, 2000);
                
            } catch (error) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">Lỗi: ${error.message}</div>
                `;
            }
        });
    };

    return { render };
})();

export default EditEmployeeModule;
