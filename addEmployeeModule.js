// AddEmployeeModule - Module thêm nhân viên mới

import EmployeeDbModule from './employeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const AddEmployeeModule = (() => {
    
    // Xác thực dữ liệu nhân viên
    const validateEmployeeData = (data) => {
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

        if (!data.departmentId || isNaN(data.departmentId)) {
            errors.push('Vui lòng chọn phòng ban');
        }

        if (!data.positionId || isNaN(data.positionId)) {
            errors.push('Vui lòng chọn vị trí');
        }

        if (!data.hireDate) {
            errors.push('Vui lòng chọn ngày vào làm');
        }

        return errors;
    };

    // Kết xuất biểu mẫu
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const departments = DepartmentModule.getAllDepartments();
        const positions = PositionModule.getAllPositions();

        // Debug: Kiểm tra dữ liệu
        console.log('Departments loaded:', departments.length, departments);
        console.log('Positions loaded:', positions.length, positions);

        // Cảnh báo nếu chưa có dữ liệu
        if (departments.length === 0 || positions.length === 0) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <h3>⚠️ Chưa có dữ liệu cần thiết</h3>
                    <p>Vui lòng tạo Phòng ban và Vị trí trước khi thêm nhân viên.</p>
                    <ul>
                        ${departments.length === 0 ? '<li>❌ Chưa có Phòng ban</li>' : ''}
                        ${positions.length === 0 ? '<li>❌ Chưa có Vị trí</li>' : ''}
                    </ul>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="form-container">
                <h2>Thêm Nhân viên Mới</h2>
                
                <form id="add-employee-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="emp-name">Họ và tên: *</label>
                            <input type="text" id="emp-name" required>
                        </div>
                        <div class="form-group">
                            <label for="emp-email">Email: *</label>
                            <input type="email" id="emp-email" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="emp-phone">Số điện thoại: *</label>
                            <input type="tel" id="emp-phone" placeholder="0912345678" required>
                        </div>
                        <div class="form-group">
                            <label for="emp-address">Địa chỉ:</label>
                            <input type="text" id="emp-address">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="emp-department">Phòng ban: *</label>
                            <select id="emp-department" required>
                                <option value="">-- Chọn phòng ban --</option>
                                ${departments.map(dept => 
                                    `<option value="${dept.id}">${dept.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="emp-position">Vị trí: *</label>
                            <select id="emp-position" required>
                                <option value="">-- Chọn vị trí --</option>
                                ${positions.map(pos => 
                                    `<option value="${pos.id}">${pos.title}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="emp-salary">Lương cơ bản: *</label>
                            <input type="number" id="emp-salary" min="0" step="1000" required>
                        </div>
                        <div class="form-group">
                            <label for="emp-hire-date">Ngày vào làm: *</label>
                            <input type="date" id="emp-hire-date" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="emp-bonus">Thưởng:</label>
                            <input type="number" id="emp-bonus" min="0" step="1000" value="0">
                        </div>
                        <div class="form-group">
                            <label for="emp-deduction">Khấu trừ:</label>
                            <input type="number" id="emp-deduction" min="0" step="1000" value="0">
                        </div>
                    </div>

                    <div id="form-messages"></div>

                    <div style="margin-top: 20px;">
                        <button type="submit" class="btn btn-primary">Thêm nhân viên</button>
                        <button type="reset" class="btn btn-secondary">Nhập lại</button>
                    </div>
                </form>
            </div>
        `;

        // Sự kiện lắng nghe
        const form = document.getElementById('add-employee-form');
        const messagesDiv = document.getElementById('form-messages');

        // Tự động điền lương dựa trên vị trí
        const positionSelect = document.getElementById('emp-position');
        const salaryInput = document.getElementById('emp-salary');

        positionSelect.addEventListener('change', (e) => {
            const positionId = e.target.value;
            if (positionId) {
                const position = PositionModule.getPositionById(positionId);
                if (position && position.salaryBase) {
                    salaryInput.value = position.salaryBase;
                }
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messagesDiv.innerHTML = '';

            // Thu thập dữ liệu biểu mẫu
            const deptValue = document.getElementById('emp-department').value;
            const posValue = document.getElementById('emp-position').value;
            
            // Debug logs
            console.log('Department value:', deptValue);
            console.log('Position value:', posValue);
            
            const employeeData = {
                name: document.getElementById('emp-name').value.trim(),
                email: document.getElementById('emp-email').value.trim(),
                phone: document.getElementById('emp-phone').value.trim(),
                address: document.getElementById('emp-address').value.trim(),
                departmentId: parseInt(deptValue),
                positionId: parseInt(posValue),
                salary: parseFloat(document.getElementById('emp-salary').value),
                hireDate: document.getElementById('emp-hire-date').value,
                bonus: parseFloat(document.getElementById('emp-bonus').value) || 0,
                deduction: parseFloat(document.getElementById('emp-deduction').value) || 0
            };
            
            // Debug employee data
            console.log('Employee Data:', employeeData);

            // Xác thực dữ liệu
            const errors = validateEmployeeData(employeeData);
            if (errors.length > 0) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">
                        <ul>
                            ${errors.map(err => `<li>${err}</li>`).join('')}
                        </ul>
                    </div>
                `;
                return;
            }

            // Thêm vào cơ sở dữ liệu
            try {
                const newEmployee = await EmployeeDbModule.addEmployee(employeeData);
                
                messagesDiv.innerHTML = `
                    <div class="alert alert-success">
                        Đã thêm nhân viên thành công! ID: ${newEmployee.id}
                    </div>
                `;
                
                form.reset();

                // Tự động ẩn thông báo thành công sau 3 giây
                setTimeout(() => {
                    messagesDiv.innerHTML = '';
                }, 3000);
                
            } catch (error) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">
                        Lỗi: ${error.message}
                    </div>
                `;
            }
        });
    };

    return {
        render,
        validateEmployeeData
    };
})();

export default AddEmployeeModule;
