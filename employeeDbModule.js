// EmployeeDbModule - Module quản lý cơ sở dữ liệu nhân viên
// Sử dụng localStorage và higher-order functions

const EmployeeDbModule = (() => {
    const STORAGE_KEY = 'hrm_employees';

    // Khởi tạo dữ liệu mặc định
    const initDefaultData = () => {
        const employees = getAllEmployees();
        if (employees.length === 0) {
            const defaultEmployees = [
                {
                    id: 1,
                    name: 'Nguyễn Văn An',
                    departmentId: 1,
                    positionId: 1,
                    salary: 15000000,
                    bonus: 2000000,
                    deduction: 500000,
                    hireDate: '2020-01-15',
                    email: 'nguyenvanan@company.com',
                    phone: '0912345678',
                    address: 'Hà Nội',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'Trần Thị Bình',
                    departmentId: 2,
                    positionId: 2,
                    salary: 12000000,
                    bonus: 1500000,
                    deduction: 300000,
                    hireDate: '2021-03-20',
                    email: 'tranthibinh@company.com',
                    phone: '0923456789',
                    address: 'Hồ Chí Minh',
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Lê Văn Cường',
                    departmentId: 1,
                    positionId: 3,
                    salary: 10000000,
                    bonus: 1000000,
                    deduction: 200000,
                    hireDate: '2022-05-10',
                    email: 'levancuong@company.com',
                    phone: '0934567890',
                    address: 'Đà Nẵng',
                    status: 'active'
                },
                {
                    id: 4,
                    name: 'Phạm Thị Dung',
                    departmentId: 3,
                    positionId: 4,
                    salary: 8000000,
                    bonus: 800000,
                    deduction: 150000,
                    hireDate: '2023-02-01',
                    email: 'phamthidung@company.com',
                    phone: '0945678901',
                    address: 'Hải Phòng',
                    status: 'active'
                },
                {
                    id: 5,
                    name: 'Hoàng Văn Em',
                    departmentId: 2,
                    positionId: 5,
                    salary: 9000000,
                    bonus: 900000,
                    deduction: 180000,
                    hireDate: '2023-08-15',
                    email: 'hoangvanem@company.com',
                    phone: '0956789012',
                    address: 'Cần Thơ',
                    status: 'active'
                }
            ];
            saveEmployees(defaultEmployees);
        }
    };

    // Lấy tất cả nhân viên
    const getAllEmployees = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    // Lưu danh sách nhân viên (async để giả lập delay)
    const saveEmployees = async (employees) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        return { success: true };
    };

    // Lấy nhân viên theo ID
    const getEmployeeById = (id) => {
        const employees = getAllEmployees();
        return employees.find(emp => emp.id === parseInt(id));
    };

    // Thêm nhân viên mới
    const addEmployee = async (employeeData) => {
        const employees = getAllEmployees();
        
        // Generate ID mới
        const newId = employees.length > 0 
            ? Math.max(...employees.map(e => e.id)) + 1 
            : 1;

        const newEmployee = {
            id: newId,
            ...employeeData,
            status: 'active'
        };

        employees.push(newEmployee);
        await saveEmployees(employees);
        return newEmployee;
    };

    // Cập nhật thông tin nhân viên
    const updateEmployee = async (id, updates) => {
        const employees = getAllEmployees();
        const index = employees.findIndex(emp => emp.id === parseInt(id));

        if (index === -1) {
            throw new Error('Không tìm thấy nhân viên');
        }

        employees[index] = {
            ...employees[index],
            ...updates
        };

        await saveEmployees(employees);
        return employees[index];
    };

    // Xóa nhân viên
    const deleteEmployee = async (id) => {
        const employees = getAllEmployees();
        const filtered = employees.filter(emp => emp.id !== parseInt(id));

        if (filtered.length === employees.length) {
            throw new Error('Không tìm thấy nhân viên');
        }

        await saveEmployees(filtered);
        return { success: true, message: 'Đã xóa nhân viên' };
    };

    // Tìm kiếm nhân viên (higher-order function)
    const searchEmployees = (criteria) => {
        const employees = getAllEmployees();
        
        return employees.filter(emp => {
            let match = true;

            // Tìm theo tên (RegExp)
            if (criteria.name) {
                const regex = new RegExp(criteria.name, 'i');
                match = match && regex.test(emp.name);
            }

            // Tìm theo phòng ban
            if (criteria.departmentId) {
                match = match && emp.departmentId === parseInt(criteria.departmentId);
            }

            // Tìm theo vị trí
            if (criteria.positionId) {
                match = match && emp.positionId === parseInt(criteria.positionId);
            }

            // Tìm theo khoảng lương
            if (criteria.minSalary) {
                match = match && emp.salary >= parseFloat(criteria.minSalary);
            }

            if (criteria.maxSalary) {
                match = match && emp.salary <= parseFloat(criteria.maxSalary);
            }

            // Tìm theo trạng thái
            if (criteria.status) {
                match = match && emp.status === criteria.status;
            }

            return match;
        });
    };

    // Sắp xếp nhân viên (higher-order function)
    const sortEmployees = (employees, field = 'name', order = 'asc') => {
        return [...employees].sort((a, b) => {
            let comparison = 0;
            
            if (a[field] < b[field]) comparison = -1;
            if (a[field] > b[field]) comparison = 1;
            
            return order === 'asc' ? comparison : -comparison;
        });
    };

    // Lọc nhân viên theo điều kiện (higher-order function)
    const filterEmployees = (predicate) => {
        return getAllEmployees().filter(predicate);
    };

    // Map nhân viên (higher-order function)
    const mapEmployees = (mapper) => {
        return getAllEmployees().map(mapper);
    };

    // Thống kê
    const getStatistics = () => {
        const employees = getAllEmployees();
        
        return {
            total: employees.length,
            active: employees.filter(e => e.status === 'active').length,
            inactive: employees.filter(e => e.status === 'inactive').length,
            totalSalary: employees.reduce((sum, e) => sum + e.salary, 0),
            averageSalary: employees.length > 0 
                ? employees.reduce((sum, e) => sum + e.salary, 0) / employees.length 
                : 0
        };
    };

    // Initialize
    initDefaultData();

    // Export
    return {
        getAllEmployees,
        getEmployeeById,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        saveEmployees,
        searchEmployees,
        sortEmployees,
        filterEmployees,
        mapEmployees,
        getStatistics
    };
})();

export default EmployeeDbModule;
