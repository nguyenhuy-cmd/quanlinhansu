// app.js - File chính của ứng dụng HRM
// Import tất cả modules

import AuthModule from './authModule.js';
import EmployeeDbModule from './employeeDbModule.js';
import AddEmployeeModule from './addEmployeeModule.js';
import EditEmployeeModule from './editEmployeeModule.js';
import DeleteEmployeeModule from './deleteEmployeeModule.js';
import SearchEmployeeModule from './searchEmployeeModule.js';
import DepartmentModule from './departmentModule.js';
import PositionModule from './positionModule.js';
import SalaryModule from './salaryModule.js';
import AttendanceModule from './attendanceModule.js';
import LeaveModule from './leaveModule.js';
import PerformanceModule from './performanceModule.js';

// Application State (sử dụng closure)
const AppState = (() => {
    let currentModule = 'dashboard';
    let currentUser = null;

    return {
        getCurrentModule: () => currentModule,
        setCurrentModule: (module) => { currentModule = module; },
        getCurrentUser: () => currentUser,
        setCurrentUser: (user) => { currentUser = user; }
    };
})();

// DOM Elements - Các thành phần DOM
const loginScreen = document.getElementById('login-screen');
const registerScreen = document.getElementById('register-screen');
const forgotPasswordScreen = document.getElementById('forgot-password-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const contentArea = document.getElementById('content-area');

// Navigation Management - Quản lý điều hướng
const navigateToModule = (moduleName) => {
    // Xóa class active từ tất cả nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Thêm class active cho link hiện tại
    const activeLink = document.querySelector(`[data-module="${moduleName}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Cập nhật tiêu đề trang
    const pageTitles = {
        'dashboard': 'Dashboard',
        'add-employee': 'Thêm Nhân viên',
        'edit-employee': 'Sửa Nhân viên',
        'delete-employee': 'Xóa Nhân viên',
        'search-employee': 'Tìm kiếm Nhân viên',
        'departments': 'Quản lý Phòng ban',
        'positions': 'Quản lý Vị trí',
        'salary': 'Quản lý Lương',
        'attendance': 'Chấm công',
        'leave': 'Quản lý Nghỉ phép',
        'performance': 'Đánh giá Hiệu suất'
    };

    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = pageTitles[moduleName] || 'Dashboard';
    }
    AppState.setCurrentModule(moduleName);

    // Xóa nội dung khu vực content
    if (contentArea) {
        contentArea.innerHTML = '';
    }

    // Render module tương ứng
    switch(moduleName) {
        case 'dashboard':
            // Dashboard đơn giản - chỉ welcome message
            if (contentArea) {
                contentArea.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h2>Chào mừng đến với Hệ thống Quản lý Nhân sự</h2>
                        <p>Vui lòng chọn chức năng từ menu bên trái để bắt đầu.</p>
                    </div>
                `;
            }
            break;
        case 'add-employee':
            AddEmployeeModule.render('content-area');
            break;
        case 'edit-employee':
            EditEmployeeModule.render('content-area');
            break;
        case 'delete-employee':
            DeleteEmployeeModule.render('content-area');
            break;
        case 'search-employee':
            SearchEmployeeModule.render('content-area');
            break;
        case 'departments':
            DepartmentModule.render('content-area');
            break;
        case 'positions':
            PositionModule.render('content-area');
            break;
        case 'salary':
            SalaryModule.render('content-area');
            break;
        case 'attendance':
            AttendanceModule.render('content-area');
            break;
        case 'leave':
            LeaveModule.render('content-area');
            break;
        case 'performance':
            PerformanceModule.render('content-area');
            break;
        default:
            // Dashboard mặc định - chỉ hiển thị welcome message
            if (contentArea) {
                contentArea.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h2>Chào mừng đến với Hệ thống Quản lý Nhân sự</h2>
                        <p>Vui lòng chọn chức năng từ menu bên trái để bắt đầu.</p>
                    </div>
                `;
            }
    }
};

// Các hàm xác thực - Authentication Functions
const showLoginScreen = () => {
    console.log('Chuyển sang màn hình đăng nhập');
    loginScreen.classList.add('active');
    registerScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    
    // Cập nhật hiển thị bắt buộc
    loginScreen.style.display = 'flex';
    registerScreen.style.display = 'none';
    forgotPasswordScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
};

const showRegisterScreen = () => {
    console.log('Chuyển sang màn hình đăng ký');
    loginScreen.classList.remove('active');
    registerScreen.classList.add('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    
    // Cập nhật hiển thị bắt buộc
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'flex';
    forgotPasswordScreen.style.display = 'none';
    dashboardScreen.style.display = 'none';
};

const showForgotPasswordScreen = () => {
    console.log('Chuyển sang màn hình quên mật khẩu');
    loginScreen.classList.remove('active');
    registerScreen.classList.remove('active');
    forgotPasswordScreen.classList.add('active');
    dashboardScreen.classList.remove('active');
    
    // Cập nhật hiển thị bắt buộc
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    forgotPasswordScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
};

const showDashboard = (user) => {
    console.log('Chuyển sang dashboard');
    loginScreen.classList.remove('active');
    registerScreen.classList.remove('active');
    forgotPasswordScreen.classList.remove('active');
    dashboardScreen.classList.add('active');
    
    // Cập nhật hiển thị bắt buộc
    loginScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    forgotPasswordScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    
    AppState.setCurrentUser(user);
    
    // Đợi DOM cập nhật rồi mới set tên user
    setTimeout(() => {
        const currentUserElement = document.getElementById('current-user');
        if (currentUserElement) {
            currentUserElement.textContent = user.username;
        }
    }, 0);
    
    navigateToModule('dashboard');
};

// Xử lý form đăng nhập - Login Form Handler
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const result = await AuthModule.login(username, password);
        if (result.success) {
            showDashboard(result.user);
        }
    } catch (error) {
        alert('Lỗi đăng nhập: ' + error.message);
    }
});

// Xử lý form đăng ký - Register Form Handler
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (password !== confirm) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    try {
        const result = await AuthModule.register(username, password);
        if (result.success) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            showLoginScreen();
            registerForm.reset();
        }
    } catch (error) {
        alert('Lỗi đăng ký: ' + error.message);
    }
});

// Xử lý form quên mật khẩu - Forgot Password Form Handler
const forgotPasswordForm = document.getElementById('forgot-password-form');
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('forgot-username').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-new-password').value;

    if (newPassword !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }

    try {
        const result = await AuthModule.resetPassword(username, newPassword);
        if (result.success) {
            alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.');
            showLoginScreen();
            forgotPasswordForm.reset();
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
});

// Chuyển đổi giữa màn hình đăng nhập và đăng ký
document.getElementById('show-register').addEventListener('click', showRegisterScreen);
document.getElementById('show-login').addEventListener('click', showLoginScreen);
document.getElementById('show-forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordScreen();
});
document.getElementById('back-to-login').addEventListener('click', showLoginScreen);

// Xử lý đăng xuất - Logout Handler
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        AuthModule.logout();
        AppState.setCurrentUser(null);
        loginForm.reset();
        showLoginScreen();
    }
});

// Xử lý các liên kết điều hướng - Navigation Links Handler
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const module = link.dataset.module;
        navigateToModule(module);
    });
});

// Khởi tạo ứng dụng - Initialize Application
const initApp = () => {
    console.log('🚀 Đang khởi tạo ứng dụng HRM...');
    
    // Kiểm tra xem user đã đăng nhập chưa
    const session = AuthModule.checkSession();
    
    if (session) {
        console.log('✅ Tìm thấy session, đăng nhập với tên:', session.username);
        showDashboard(session);
    } else {
        console.log('❌ Không tìm thấy session, hiển thị màn hình đăng nhập');
        showLoginScreen();
    }

    console.log('✅ Ứng dụng khởi tạo thành công!');
    console.log('📊 Thống kê:', EmployeeDbModule.getStatistics());
};

// Khởi động ứng dụng khi DOM đã tải xong
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export để debug (tùy chọn)
window.HRM = {
    AuthModule,
    EmployeeDbModule,
    DepartmentModule,
    PositionModule,
    SalaryModule,
    AttendanceModule,
    LeaveModule,
    PerformanceModule,
    AppState,
    navigateToModule
};

console.log('💼 Hệ thống HRM đã tải. Công cụ debug có sẵn tại window.HRM');
