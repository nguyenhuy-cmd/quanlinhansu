// SalaryModule - Module quản lý lương

import EmployeeDbModule from './employeeDbModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';

const SalaryModule = (() => {
    
    // Tính lương thực nhận (sử dụng arrow function và destructuring)
    const calculateNetSalary = ({ salary = 0, bonus = 0, deduction = 0 }) => {
        return salary + bonus - deduction;
    };

    // Tạo báo cáo lương (sử dụng map và reduce)
    const generatePayrollReport = () => {
        const employees = EmployeeDbModule.getAllEmployees();
        
        return employees.map(emp => ({
            ...emp,
            netSalary: calculateNetSalary(emp),
            department: DepartmentModule.getDepartmentById(emp.departmentId),
            position: PositionModule.getPositionById(emp.positionId)
        }));
    };

    // Cập nhật lương nhân viên
    const updateSalary = async (employeeId, salaryData) => {
        const { salary, bonus, deduction } = salaryData;
        
        if (salary !== undefined && salary < 0) {
            throw new Error('Lương không được âm');
        }
        
        if (bonus !== undefined && bonus < 0) {
            throw new Error('Thưởng không được âm');
        }
        
        if (deduction !== undefined && deduction < 0) {
            throw new Error('Khấu trừ không được âm');
        }

        return await EmployeeDbModule.updateEmployee(employeeId, salaryData);
    };

    // Thống kê lương theo phòng ban (sử dụng reduce)
    const getSalaryByDepartment = () => {
        const employees = EmployeeDbModule.getAllEmployees();
        const departments = DepartmentModule.getAllDepartments();

        return departments.map(dept => {
            const deptEmployees = employees.filter(emp => emp.departmentId === dept.id);
            const totalSalary = deptEmployees.reduce((sum, emp) => sum + calculateNetSalary(emp), 0);
            const avgSalary = deptEmployees.length > 0 ? totalSalary / deptEmployees.length : 0;

            return {
                departmentId: dept.id,
                departmentName: dept.name,
                employeeCount: deptEmployees.length,
                totalSalary,
                avgSalary
            };
        });
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const payrollReport = generatePayrollReport();
        const departmentStats = getSalaryByDepartment();
        const totalPayroll = payrollReport.reduce((sum, emp) => sum + emp.netSalary, 0);

        container.innerHTML = `
            <div class="form-container">
                <h2>Quản lý Lương</h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Tổng quỹ lương</h3>
                        <p class="stat-number">${totalPayroll.toLocaleString('vi-VN')}</p>
                        <small>VNĐ/tháng</small>
                    </div>
                    <div class="stat-card">
                        <h3>Lương trung bình</h3>
                        <p class="stat-number">${payrollReport.length > 0 ? 
                            (totalPayroll / payrollReport.length).toLocaleString('vi-VN') : 0}</p>
                        <small>VNĐ/tháng</small>
                    </div>
                    <div class="stat-card">
                        <h3>Số nhân viên</h3>
                        <p class="stat-number">${payrollReport.length}</p>
                    </div>
                </div>
            </div>

            <!-- Update Salary Form -->
            <div class="form-container">
                <h3>Cập nhật Lương Nhân viên</h3>
                <form id="update-salary-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="salary-emp-id">Chọn nhân viên:</label>
                            <select id="salary-emp-id" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${payrollReport.map(emp => 
                                    `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="salary-base">Lương cơ bản:</label>
                            <input type="number" id="salary-base" min="0" step="100000">
                        </div>
                        <div class="form-group">
                            <label for="salary-bonus">Thưởng:</label>
                            <input type="number" id="salary-bonus" min="0" step="100000">
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="salary-deduction">Khấu trừ:</label>
                            <input type="number" id="salary-deduction" min="0" step="100000">
                        </div>
                    </div>

                    <div id="salary-messages"></div>

                    <button type="submit" class="btn btn-success">Cập nhật</button>
                    <button type="reset" class="btn btn-secondary">Reset</button>
                </form>
            </div>

            <!-- Payroll Report Table -->
            <div class="table-container">
                <h3>Bảng Lương Nhân viên</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Phòng ban</th>
                            <th>Vị trí</th>
                            <th>Lương CB</th>
                            <th>Thưởng</th>
                            <th>Khấu trừ</th>
                            <th>Thực nhận</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payrollReport.map(emp => `
                            <tr>
                                <td>${emp.id}</td>
                                <td>${emp.name}</td>
                                <td>${emp.department ? emp.department.name : '-'}</td>
                                <td>${emp.position ? emp.position.title : '-'}</td>
                                <td>${emp.salary.toLocaleString('vi-VN')}</td>
                                <td style="color: green;">${emp.bonus.toLocaleString('vi-VN')}</td>
                                <td style="color: red;">${emp.deduction.toLocaleString('vi-VN')}</td>
                                <td><strong>${emp.netSalary.toLocaleString('vi-VN')}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f8f9fa; font-weight: bold;">
                            <td colspan="7">TỔNG CỘNG</td>
                            <td>${totalPayroll.toLocaleString('vi-VN')} VNĐ</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Department Salary Statistics -->
            <div class="table-container">
                <h3>Thống kê Lương theo Phòng ban</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Phòng ban</th>
                            <th>Số nhân viên</th>
                            <th>Tổng lương</th>
                            <th>Lương TB</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${departmentStats.map(stat => `
                            <tr>
                                <td>${stat.departmentName}</td>
                                <td>${stat.employeeCount}</td>
                                <td>${stat.totalSalary.toLocaleString('vi-VN')} VNĐ</td>
                                <td>${stat.avgSalary.toLocaleString('vi-VN')} VNĐ</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Event listeners
        const form = document.getElementById('update-salary-form');
        const empSelect = document.getElementById('salary-emp-id');
        const salaryBase = document.getElementById('salary-base');
        const salaryBonus = document.getElementById('salary-bonus');
        const salaryDeduction = document.getElementById('salary-deduction');
        const messagesDiv = document.getElementById('salary-messages');

        // Auto-fill when employee selected
        empSelect.addEventListener('change', (e) => {
            const empId = e.target.value;
            if (empId) {
                const employee = EmployeeDbModule.getEmployeeById(empId);
                if (employee) {
                    salaryBase.value = employee.salary || 0;
                    salaryBonus.value = employee.bonus || 0;
                    salaryDeduction.value = employee.deduction || 0;
                }
            }
        });

        // Submit form
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messagesDiv.innerHTML = '';

            const empId = empSelect.value;
            if (!empId) {
                messagesDiv.innerHTML = '<div class="alert alert-error">Vui lòng chọn nhân viên</div>';
                return;
            }

            const salaryData = {
                salary: parseFloat(salaryBase.value) || 0,
                bonus: parseFloat(salaryBonus.value) || 0,
                deduction: parseFloat(salaryDeduction.value) || 0
            };

            try {
                await updateSalary(empId, salaryData);
                messagesDiv.innerHTML = '<div class="alert alert-success">Cập nhật lương thành công!</div>';
                
                setTimeout(() => {
                    render(containerId);
                }, 1500);
            } catch (error) {
                messagesDiv.innerHTML = `<div class="alert alert-error">Lỗi: ${error.message}</div>`;
            }
        });
    };

    return {
        calculateNetSalary,
        generatePayrollReport,
        updateSalary,
        getSalaryByDepartment,
        render
    };
})();

export default SalaryModule;
