// AuthModule - Module xác thực người dùng
// Sử dụng closure để bảo mật thông tin

const AuthModule = (() => {
    const STORAGE_KEY = 'hrm_users';
    const SESSION_KEY = 'hrm_session';

    // Hash đơn giản cho mật khẩu (trong thực tế nên dùng bcrypt)
    const simpleHash = (password) => {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(36);
    };

    // Khởi tạo dữ liệu mặc định
    const initDefaultUsers = () => {
        const users = getUsers();
        if (users.length === 0) {
            // Tạo tài khoản admin mặc định
            const defaultUsers = [
                {
                    id: 1,
                    username: 'admin',
                    password: simpleHash('admin123'),
                    role: 'admin',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
        }
    };

    // Lấy danh sách người dùng
    const getUsers = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    // Lưu danh sách người dùng
    const saveUsers = (users) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    };

    // Đăng ký người dùng mới (async để giả lập delay)
    const register = async (username, password) => {
        // Giả lập delay network
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        
        // Kiểm tra username đã tồn tại
        if (users.some(user => user.username === username)) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        // Validate
        if (username.length < 3) {
            throw new Error('Tên đăng nhập phải có ít nhất 3 ký tự');
        }

        if (password.length < 6) {
            throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
        }

        // Tạo user mới
        const newUser = {
            id: users.length + 1,
            username,
            password: simpleHash(password),
            role: 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        return { success: true, message: 'Đăng ký thành công' };
    };

    // Đăng nhập (async để giả lập delay)
    const login = async (username, password) => {
        // Giả lập delay network
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        const hashedPassword = simpleHash(password);

        const user = users.find(u => 
            u.username === username && u.password === hashedPassword
        );

        if (!user) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
        }

        // Tạo session (không lưu password)
        const session = {
            id: user.id,
            username: user.username,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        // Dùng sessionStorage thay vì localStorage
        // Session sẽ tự động xóa khi đóng browser/tab
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { success: true, user: session };
    };

    // Đăng xuất
    const logout = () => {
        // Xóa session từ sessionStorage
        sessionStorage.removeItem(SESSION_KEY);
        return { success: true, message: 'Đã đăng xuất' };
    };

    // Kiểm tra session hiện tại
    const checkSession = () => {
        // Đọc từ sessionStorage thay vì localStorage
        const sessionData = sessionStorage.getItem(SESSION_KEY);
        if (!sessionData) {
            return null;
        }

        try {
            return JSON.parse(sessionData);
        } catch (error) {
            return null;
        }
    };

    // Kiểm tra người dùng đã đăng nhập chưa
    const isAuthenticated = () => {
        return checkSession() !== null;
    };

    // Lấy thông tin user hiện tại
    const getCurrentUser = () => {
        return checkSession();
    };

    // Reset mật khẩu (Forgot Password)
    const resetPassword = async (username, newPassword) => {
        // Giả lập delay network
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getUsers();
        
        // Tìm user theo username
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) {
            throw new Error('Tên đăng nhập không tồn tại');
        }

        // Validate mật khẩu mới
        if (newPassword.length < 6) {
            throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
        }

        // Cập nhật mật khẩu
        users[userIndex].password = simpleHash(newPassword);
        users[userIndex].passwordResetAt = new Date().toISOString();
        
        saveUsers(users);

        return { success: true, message: 'Đặt lại mật khẩu thành công' };
    };

    // Initialize khi module load
    initDefaultUsers();

    // Export các hàm public
    return {
        register,
        login,
        logout,
        isAuthenticated,
        getCurrentUser,
        checkSession,
        resetPassword
    };
})();

export default AuthModule;
