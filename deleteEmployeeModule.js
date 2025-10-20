// DeleteEmployeeModule - Module xóa nhân viên

import EmployeeDbModule from './employeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const DeleteEmployeeModule = (() => {
    
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const employees = EmployeeDbModule.getAllEmployees();

        container.innerHTML = `
            <div class="form-container">
                <h2>Xóa Nhân viên</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="delete-search-id">Tìm theo ID:</label>
                        <input type="number" id="delete-search-id" placeholder="Nhập ID nhân viên">
                    </div>
                    <div class="form-group">
                        <label for="delete-search-name">Tìm theo Tên:</label>
                        <input type="text" id="delete-search-name" placeholder="Nhập tên nhân viên">
                    </div>
                </div>
                
                <button id="btn-delete-search" class="btn btn-primary">Tìm kiếm</button>
            </div>

            <div id="employee-detail" style="display: none;">
                <div class="form-container">
                    <h3>Thông tin Nhân viên</h3>
                    <div id="employee-info"></div>
                    <div style="margin-top: 20px;">
                        <button id="btn-confirm-delete" class="btn btn-danger">Xác nhận xóa</button>
                        <button id="btn-cancel-delete" class="btn btn-secondary">Hủy</button>
                    </div>
                </div>
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
                                <th>Số điện thoại</th>
                                <th>Phòng ban</th>
                                <th>Vị trí</th>
                                <th>Trạng thái</th>
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
                                        <td>${emp.phone}</td>
                                        <td>${dept ? dept.name : '-'}</td>
                                        <td>${pos ? pos.title : '-'}</td>
                                        <td>${emp.status === 'active' ? 'Đang làm' : 'Đã nghỉ'}</td>
                                        <td>
                                            <button class="btn btn-danger btn-delete-emp" data-id="${emp.id}">Xóa</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        `;

        // State
        let selectedEmployee = null;

        // Show employee details
        const showEmployeeDetail = (employee) => {
            if (!employee) return;

            selectedEmployee = employee;
            const dept = DepartmentModule.getDepartmentById(employee.departmentId);
            const pos = PositionModule.getPositionById(employee.positionId);

            const infoDiv = document.getElementById('employee-info');
            infoDiv.innerHTML = `
                <table style="width: 100%; margin-top: 10px;">
                    <tr><td><strong>ID:</strong></td><td>${employee.id}</td></tr>
                    <tr><td><strong>Họ tên:</strong></td><td>${employee.name}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>${employee.email}</td></tr>
                    <tr><td><strong>Điện thoại:</strong></td><td>${employee.phone}</td></tr>
                    <tr><td><strong>Địa chỉ:</strong></td><td>${employee.address || '-'}</td></tr>
                    <tr><td><strong>Phòng ban:</strong></td><td>${dept ? dept.name : '-'}</td></tr>
                    <tr><td><strong>Vị trí:</strong></td><td>${pos ? pos.title : '-'}</td></tr>
                    <tr><td><strong>Lương:</strong></td><td>${employee.salary.toLocaleString('vi-VN')} VNĐ</td></tr>
                    <tr><td><strong>Ngày vào:</strong></td><td>${employee.hireDate}</td></tr>
                    <tr><td><strong>Trạng thái:</strong></td><td>${employee.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}</td></tr>
                </table>
            `;

            document.getElementById('employee-detail').style.display = 'block';
        };

        // Event listeners
        const searchBtn = document.getElementById('btn-delete-search');
        const searchIdInput = document.getElementById('delete-search-id');
        const searchNameInput = document.getElementById('delete-search-name');
        const confirmBtn = document.getElementById('btn-confirm-delete');
        const cancelBtn = document.getElementById('btn-cancel-delete');

        // Search
        const performSearch = () => {
            const id = searchIdInput.value.trim();
            const name = searchNameInput.value.trim();

            if (id) {
                const employee = EmployeeDbModule.getEmployeeById(id);
                if (employee) {
                    showEmployeeDetail(employee);
                } else {
                    alert('Không tìm thấy nhân viên với ID: ' + id);
                }
            } else if (name) {
                const results = EmployeeDbModule.searchEmployees({ name });
                if (results.length === 1) {
                    showEmployeeDetail(results[0]);
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

        // Delete buttons in table
        document.querySelectorAll('.btn-delete-emp').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const employee = EmployeeDbModule.getEmployeeById(id);
                if (employee) {
                    showEmployeeDetail(employee);
                }
            });
        });

        // Confirm delete
        confirmBtn.addEventListener('click', async () => {
            if (!selectedEmployee) {
                alert('Không xác định được nhân viên');
                return;
            }

            const confirmed = confirm(
                `Bạn có chắc chắn muốn xóa nhân viên "${selectedEmployee.name}" (ID: ${selectedEmployee.id})?\n\n` +
                `Hành động này không thể hoàn tác!`
            );

            if (confirmed) {
                try {
                    await EmployeeDbModule.deleteEmployee(selectedEmployee.id);
                    alert('Đã xóa nhân viên thành công!');
                    selectedEmployee = null;
                    render(containerId);
                } catch (error) {
                    alert('Lỗi: ' + error.message);
                }
            }
        });

        
        cancelBtn.addEventListener('click', () => {
            selectedEmployee = null;
            document.getElementById('employee-detail').style.display = 'none';
            searchIdInput.value = '';
        searchNameInput.value = '';
        });
    };

    return { render };
})();

export default DeleteEmployeeModule;

