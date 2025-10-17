// LeaveModule - Module quản lý nghỉ phép
// Tự động xóa các bản ghi nghỉ phép có id null khi load module
(function cleanNullLeaveIds() {
    let leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
    const filtered = leaves.filter(l => l.id !== null && l.id !== 'null');
    if (filtered.length !== leaves.length) {
        localStorage.setItem('leaves', JSON.stringify(filtered));
    }
})();

import EmployeeDbModule from './employeeDbModule.js';

const LeaveModule = (() => {
    const STORAGE_KEY = 'hrm_leaves';
    const ANNUAL_LEAVE_DAYS = 20; // Số ngày phép hàng năm

    // Khởi tạo dữ liệu mặc định
    const initDefaultData = () => {
        const leaves = getAllLeaves();
        if (leaves.length === 0) {
            const defaultLeaves = [
                {
                    id: 1,
                    employeeId: 1,
                    startDate: '2024-10-20',
                    endDate: '2024-10-22',
                    type: 'annual',
                    reason: 'Nghỉ phép thường niên',
                    status: 'approved',
                    requestDate: '2024-10-15',
                    approvedDate: '2024-10-16'
                },
                {
                    id: 2,
                    employeeId: 2,
                    startDate: '2024-10-25',
                    endDate: '2024-10-26',
                    type: 'sick',
                    reason: 'Ốm',
                    status: 'pending',
                    requestDate: '2024-10-17'
                }
            ];
            saveLeaves(defaultLeaves);
        }
    };

    // Lấy tất cả leaves
    const getAllLeaves = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        const leaves = data ? JSON.parse(data) : [];
        // Lọc bỏ các bản ghi có id null
        return leaves.filter(l => l.id !== null && l.id !== 'null' && l.id !== undefined);
    };

    // Lưu leaves
    const saveLeaves = async (leaves) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        // Lọc bỏ các bản ghi có id null trước khi lưu
        const validLeaves = leaves.filter(l => l.id !== null && l.id !== 'null' && l.id !== undefined);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validLeaves));
    };

    // Tính số ngày nghỉ
    const calculateLeaveDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    // Yêu cầu nghỉ phép
    const requestLeave = async (employeeId, startDate, endDate, type, reason) => {
        const leaves = getAllLeaves();
        
        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
        }

        const leaveDays = calculateLeaveDays(startDate, endDate);
        const balance = getLeaveBalance(employeeId);

        // Chỉ check balance cho annual leave
        if (type === 'annual' && leaveDays > balance) {
            throw new Error(`Không đủ số ngày phép (còn ${balance} ngày)`);
        }

        const newId = leaves.length > 0 ? Math.max(...leaves.map(l => l.id)) + 1 : 1;

        const newLeave = {
            id: `L-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            employeeId: parseInt(employeeId),
            startDate,
            endDate,
            type,
            reason: reason || '',
            status: 'pending',
            requestDate: new Date().toISOString().split('T')[0],
            approvedDate: null
        };

        leaves.push(newLeave);
        await saveLeaves(leaves);
        return newLeave;
    };

    // Duyệt nghỉ phép
    const approveLeave = async (leaveId, approve = true) => {
        const leaves = getAllLeaves();
        // Convert leaveId to number để so sánh chính xác
        const id = parseInt(leaveId);
        const leave = leaves.find(l => parseInt(l.id) === id);

        if (!leave) {
            throw new Error('Không tìm thấy yêu cầu nghỉ phép');
        }

        if (leave.status !== 'pending') {
            throw new Error('Yêu cầu này đã được xử lý');
        }

        leave.status = approve ? 'approved' : 'rejected';
        leave.approvedDate = new Date().toISOString().split('T')[0];

        await saveLeaves(leaves);
        return leave;
    };

    // Lấy số ngày phép còn lại
    const getLeaveBalance = (employeeId) => {
        const leaves = getAllLeaves();
        const approvedAnnualLeaves = leaves.filter(l => 
            l.employeeId === parseInt(employeeId) && 
            l.type === 'annual' && 
            l.status === 'approved'
        );

        const usedDays = approvedAnnualLeaves.reduce((sum, leave) => {
            return sum + calculateLeaveDays(leave.startDate, leave.endDate);
        }, 0);

        return ANNUAL_LEAVE_DAYS - usedDays;
    };

    // Lấy lịch sử nghỉ phép
    const getLeaveHistory = (employeeId) => {
        const leaves = getAllLeaves();
        return leaves.filter(l => l.employeeId === parseInt(employeeId))
                    .sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const employees = EmployeeDbModule.getAllEmployees();
        const leaves = getAllLeaves();
        const pendingLeaves = leaves.filter(l => l.status === 'pending');

        container.innerHTML = `
            <!-- Request Leave Form -->
            <div class="form-container">
                <h2>Yêu cầu Nghỉ phép</h2>
                
                <form id="leave-request-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="leave-emp-id">Nhân viên:</label>
                            <select id="leave-emp-id" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${employees.map(emp => 
                                    `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label id="balance-label">Số ngày phép còn: -</label>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="leave-start-date">Từ ngày:</label>
                            <input type="date" id="leave-start-date" required>
                        </div>
                        <div class="form-group">
                            <label for="leave-end-date">Đến ngày:</label>
                            <input type="date" id="leave-end-date" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="leave-type">Loại nghỉ phép:</label>
                            <select id="leave-type" required>
                                <option value="annual">Phép năm</option>
                                <option value="sick">Ốm đau</option>
                                <option value="personal">Cá nhân</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="leave-reason">Lý do:</label>
                        <textarea id="leave-reason" rows="3"></textarea>
                    </div>

                    <div id="leave-messages"></div>

                    <button type="submit" class="btn btn-primary">Gửi yêu cầu</button>
                    <button type="reset" class="btn btn-secondary">Nhập lại</button>
                </form>
            </div>

            <!-- Pending Approvals -->
            <div class="table-container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3>Yêu cầu Chờ duyệt (${pendingLeaves.length})</h3>
                    <button id="clean-null-leaves-btn" class="btn btn-danger" style="font-size: 14px;">
                        🗑️ Xóa dữ liệu lỗi (id null)
                    </button>
                </div>
                ${pendingLeaves.length === 0 ? 
                    '<div class="empty-state"><p>Không có yêu cầu nào</p></div>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nhân viên</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Số ngày</th>
                                <th>Loại</th>
                                <th>Lý do</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingLeaves.map(leave => {
                                const emp = EmployeeDbModule.getEmployeeById(leave.employeeId);
                                const days = calculateLeaveDays(leave.startDate, leave.endDate);
                                const typeLabel = {
                                    'annual': 'Phép năm',
                                    'sick': 'Ốm đau',
                                    'personal': 'Cá nhân',
                                    'other': 'Khác'
                                };
                                return `
                                    <tr>
                                        <td>${leave.id}</td>
                                        <td>${emp ? emp.name : 'N/A'}</td>
                                        <td>${leave.startDate}</td>
                                        <td>${leave.endDate}</td>
                                        <td>${days} ngày</td>
                                        <td>${typeLabel[leave.type]}</td>
                                        <td>${leave.reason || '-'}</td>
                                        <td class="action-buttons">
                                            <button class="btn btn-success approve-leave" data-id="${leave.id}">Duyệt</button>
                                            <button class="btn btn-danger reject-leave" data-id="${leave.id}">Từ chối</button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>

            <!-- All Leave History -->
            <div class="table-container">
                <h3>Lịch sử Nghỉ phép</h3>
                ${leaves.length === 0 ? 
                    '<div class="empty-state"><p>Chưa có dữ liệu</p></div>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nhân viên</th>
                                <th>Từ ngày</th>
                                <th>Đến ngày</th>
                                <th>Số ngày</th>
                                <th>Loại</th>
                                <th>Trạng thái</th>
                                <th>Ngày yêu cầu</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${leaves.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)).map(leave => {
                                const emp = EmployeeDbModule.getEmployeeById(leave.employeeId);
                                const days = calculateLeaveDays(leave.startDate, leave.endDate);
                                const typeLabel = {
                                    'annual': 'Phép năm',
                                    'sick': 'Ốm đau',
                                    'personal': 'Cá nhân',
                                    'other': 'Khác'
                                };
                                const statusLabel = {
                                    'pending': '<span style="color: orange;">Chờ duyệt</span>',
                                    'approved': '<span style="color: green;">Đã duyệt</span>',
                                    'rejected': '<span style="color: red;">Từ chối</span>'
                                };
                                return `
                                    <tr>
                                        <td>${leave.id}</td>
                                        <td>${emp ? emp.name : 'N/A'}</td>
                                        <td>${leave.startDate}</td>
                                        <td>${leave.endDate}</td>
                                        <td>${days} ngày</td>
                                        <td>${typeLabel[leave.type]}</td>
                                        <td>${statusLabel[leave.status]}</td>
                                        <td>${leave.requestDate}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        `;

        // Event listeners
        const form = document.getElementById('leave-request-form');
        const empSelect = document.getElementById('leave-emp-id');
        const balanceLabel = document.getElementById('balance-label');
        const messagesDiv = document.getElementById('leave-messages');

        // Update balance when employee selected
        empSelect.addEventListener('change', (e) => {
            const empId = e.target.value;
            if (empId) {
                const balance = getLeaveBalance(empId);
                balanceLabel.textContent = `Số ngày phép còn: ${balance} ngày`;
            } else {
                balanceLabel.textContent = 'Số ngày phép còn: -';
            }
        });

        // Submit form
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messagesDiv.innerHTML = '';

            const employeeId = empSelect.value;
            const startDate = document.getElementById('leave-start-date').value;
            const endDate = document.getElementById('leave-end-date').value;
            const type = document.getElementById('leave-type').value;
            const reason = document.getElementById('leave-reason').value;

            try {
                await requestLeave(employeeId, startDate, endDate, type, reason);
                messagesDiv.innerHTML = `
                    <div class="alert alert-success">
                        Gửi yêu cầu nghỉ phép thành công!
                    </div>
                `;
                
                form.reset();
                balanceLabel.textContent = 'Số ngày phép còn: -';
                
                setTimeout(() => {
                    render(containerId);
                }, 1500);
            } catch (error) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">Lỗi: ${error.message}</div>
                `;
            }
        });

        // Approve buttons
        document.querySelectorAll('.approve-leave').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                try {
                    await approveLeave(id, true);
                    alert('Đã duyệt yêu cầu!');
                    render(containerId);
                } catch (error) {
                    alert('Lỗi: ' + error.message);
                }
            });
        });

        // Reject buttons
        document.querySelectorAll('.reject-leave').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (confirm('Bạn có chắc muốn từ chối yêu cầu này?')) {
                    try {
                        await approveLeave(id, false);
                        alert('Đã từ chối yêu cầu!');
                        render(containerId);
                    } catch (error) {
                        alert('Lỗi: ' + error.message);
                    }
                }
            });
        });

        // Clean null leaves button
        const cleanNullBtn = document.getElementById('clean-null-leaves-btn');
        if (cleanNullBtn) {
            cleanNullBtn.addEventListener('click', () => {
                if (confirm('Bạn có chắc muốn xóa tất cả các bản ghi nghỉ phép có ID lỗi (null)?')) {
                    let leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
                    const originalLength = leaves.length;
                    leaves = leaves.filter(l => l.id && l.id !== 'null' && l.id !== null);
                    localStorage.setItem('leaves', JSON.stringify(leaves));
                    
                    const deletedCount = originalLength - leaves.length;
                    alert(`Đã xóa ${deletedCount} bản ghi lỗi!`);
                    render(containerId);
                }
            });
        }
    };

    // Initialize
    initDefaultData();

    return {
        requestLeave,
        approveLeave,
        getLeaveBalance,
        getLeaveHistory,
        calculateLeaveDays,
        render
    };
})();

export default LeaveModule;
