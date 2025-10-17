// AttendanceModule - Module quản lý chấm công

import EmployeeDbModule from './employeeDbModule.js';

const AttendanceModule = (() => {
    const STORAGE_KEY = 'hrm_attendance';

    // Khởi tạo dữ liệu mặc định
    const initDefaultData = () => {
        const attendance = getAllAttendance();
        if (attendance.length === 0) {
            // Tạo một số record mẫu
            const today = new Date();
            const defaultRecords = [];
            
            for (let i = 0; i < 5; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                
                defaultRecords.push({
                    id: i + 1,
                    employeeId: (i % 5) + 1,
                    date: dateStr,
                    checkIn: '08:30',
                    checkOut: '17:30',
                    totalHours: 9,
                    status: 'present'
                });
            }
            
            saveAttendance(defaultRecords);
        }
    };

    // Lấy tất cả records
    const getAllAttendance = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    // Lưu attendance
    const saveAttendance = async (records) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    };

    // Check in
    const checkIn = async (employeeId) => {
        const records = getAllAttendance();
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // Kiểm tra đã check in chưa
        const existing = records.find(r => 
            r.employeeId === parseInt(employeeId) && r.date === today
        );

        if (existing && existing.checkIn) {
            throw new Error('Đã check in hôm nay rồi');
        }

        const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;

        const newRecord = {
            id: newId,
            employeeId: parseInt(employeeId),
            date: today,
            checkIn: currentTime,
            checkOut: null,
            totalHours: 0,
            status: 'present'
        };

        records.push(newRecord);
        await saveAttendance(records);
        return newRecord;
    };

    // Check out
    const checkOut = async (employeeId) => {
        const records = getAllAttendance();
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const record = records.find(r => 
            r.employeeId === parseInt(employeeId) && r.date === today
        );

        if (!record) {
            throw new Error('Chưa check in hôm nay');
        }

        if (record.checkOut) {
            throw new Error('Đã check out rồi');
        }

        // Tính tổng giờ làm
        const checkInTime = record.checkIn.split(':');
        const checkOutTime = currentTime.split(':');
        const checkInMinutes = parseInt(checkInTime[0]) * 60 + parseInt(checkInTime[1]);
        const checkOutMinutes = parseInt(checkOutTime[0]) * 60 + parseInt(checkOutTime[1]);
        const totalHours = (checkOutMinutes - checkInMinutes) / 60;

        record.checkOut = currentTime;
        record.totalHours = parseFloat(totalHours.toFixed(2));

        await saveAttendance(records);
        return record;
    };

    // Lấy báo cáo chấm công
    const getAttendanceReport = (employeeId, fromDate, toDate) => {
        let records = getAllAttendance();

        if (employeeId) {
            records = records.filter(r => r.employeeId === parseInt(employeeId));
        }

        if (fromDate) {
            records = records.filter(r => r.date >= fromDate);
        }

        if (toDate) {
            records = records.filter(r => r.date <= toDate);
        }

        return records.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Tính tổng giờ làm
    const getTotalHours = (employeeId, fromDate, toDate) => {
        const records = getAttendanceReport(employeeId, fromDate, toDate);
        return records.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const employees = EmployeeDbModule.getAllEmployees();
        const today = new Date().toISOString().split('T')[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

        container.innerHTML = `
            <!-- Check In/Out Section -->
            <div class="form-container">
                <h2>Chấm công</h2>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="attendance-emp-id">Chọn nhân viên:</label>
                        <select id="attendance-emp-id" required>
                            <option value="">-- Chọn nhân viên --</option>
                            ${employees.map(emp => 
                                `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>

                <div id="attendance-messages"></div>

                <div style="margin-top: 20px;">
                    <button id="btn-check-in" class="btn btn-success">Check In</button>
                    <button id="btn-check-out" class="btn btn-warning">Check Out</button>
                </div>
            </div>

            <!-- Report Section -->
            <div class="form-container">
                <h3>Báo cáo Chấm công</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="report-emp-id">Nhân viên:</label>
                        <select id="report-emp-id">
                            <option value="">-- Tất cả --</option>
                            ${employees.map(emp => 
                                `<option value="${emp.id}">${emp.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="report-from-date">Từ ngày:</label>
                        <input type="date" id="report-from-date" value="${firstDayOfMonth}">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="report-to-date">Đến ngày:</label>
                        <input type="date" id="report-to-date" value="${today}">
                    </div>
                </div>

                <button id="btn-generate-report" class="btn btn-primary">Xem báo cáo</button>
            </div>

            <div id="report-results"></div>
        `;

        // Event listeners
        const empSelect = document.getElementById('attendance-emp-id');
        const checkInBtn = document.getElementById('btn-check-in');
        const checkOutBtn = document.getElementById('btn-check-out');
        const messagesDiv = document.getElementById('attendance-messages');
        const generateReportBtn = document.getElementById('btn-generate-report');

        // Check in
        checkInBtn.addEventListener('click', async () => {
            const empId = empSelect.value;
            if (!empId) {
                alert('Vui lòng chọn nhân viên');
                return;
            }

            try {
                const record = await checkIn(empId);
                const emp = EmployeeDbModule.getEmployeeById(empId);
                messagesDiv.innerHTML = `
                    <div class="alert alert-success">
                        ${emp.name} đã check in lúc ${record.checkIn}
                    </div>
                `;
            } catch (error) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">Lỗi: ${error.message}</div>
                `;
            }
        });

        // Check out
        checkOutBtn.addEventListener('click', async () => {
            const empId = empSelect.value;
            if (!empId) {
                alert('Vui lòng chọn nhân viên');
                return;
            }

            try {
                const record = await checkOut(empId);
                const emp = EmployeeDbModule.getEmployeeById(empId);
                messagesDiv.innerHTML = `
                    <div class="alert alert-success">
                        ${emp.name} đã check out lúc ${record.checkOut}<br>
                        Tổng giờ làm: ${record.totalHours} giờ
                    </div>
                `;
            } catch (error) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">Lỗi: ${error.message}</div>
                `;
            }
        });

        // Generate report
        generateReportBtn.addEventListener('click', () => {
            const empId = document.getElementById('report-emp-id').value;
            const fromDate = document.getElementById('report-from-date').value;
            const toDate = document.getElementById('report-to-date').value;

            const records = getAttendanceReport(empId, fromDate, toDate);
            displayReport(records, empId, fromDate, toDate);
        });

        // Display initial report
        const initialRecords = getAttendanceReport(null, firstDayOfMonth, today);
        displayReport(initialRecords, null, firstDayOfMonth, today);
    };

    // Display report
    const displayReport = (records, empId, fromDate, toDate) => {
        const resultsDiv = document.getElementById('report-results');
        const totalHours = records.reduce((sum, r) => sum + (r.totalHours || 0), 0);

        if (records.length === 0) {
            resultsDiv.innerHTML = `
                <div class="table-container">
                    <div class="empty-state">
                        <h3>Không có dữ liệu chấm công</h3>
                    </div>
                </div>
            `;
            return;
        }

        resultsDiv.innerHTML = `
            <div class="table-container">
                <h3>Báo cáo Chấm công (${records.length} bản ghi)</h3>
                <p>Từ ${fromDate} đến ${toDate}</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Nhân viên</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Giờ làm</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${records.map(record => {
                            const emp = EmployeeDbModule.getEmployeeById(record.employeeId);
                            return `
                                <tr>
                                    <td>${record.date}</td>
                                    <td>${emp ? emp.name : 'N/A'}</td>
                                    <td>${record.checkIn || '-'}</td>
                                    <td>${record.checkOut || '-'}</td>
                                    <td>${record.totalHours ? record.totalHours + ' giờ' : '-'}</td>
                                    <td>${record.status === 'present' ? 
                                        '<span style="color: green;">Có mặt</span>' : 
                                        '<span style="color: red;">Vắng</span>'}
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background: #f8f9fa; font-weight: bold;">
                            <td colspan="4">TỔNG</td>
                            <td>${totalHours.toFixed(2)} giờ</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    };

    // Initialize
    initDefaultData();

    return {
        checkIn,
        checkOut,
        getAttendanceReport,
        getTotalHours,
        render
    };
})();

export default AttendanceModule;
