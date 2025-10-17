// DepartmentModule - Module quản lý phòng ban

const DepartmentModule = (() => {
    const STORAGE_KEY = 'hrm_departments';

    // Khởi tạo dữ liệu mặc định
    const initDefaultData = () => {
        const departments = getAllDepartments();
        if (departments.length === 0) {
            const defaultDepartments = [
                { id: 1, name: 'Công nghệ thông tin', managerId: 1, description: 'Phòng IT' },
                { id: 2, name: 'Nhân sự', managerId: 2, description: 'Phòng HR' },
                { id: 3, name: 'Kế toán', managerId: null, description: 'Phòng Accounting' },
                { id: 4, name: 'Marketing', managerId: null, description: 'Phòng Marketing' }
            ];
            saveDepartments(defaultDepartments);
        }
    };

    // Lấy tất cả phòng ban
    const getAllDepartments = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    // Lưu danh sách phòng ban
    const saveDepartments = async (departments) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
    };

    // Lấy phòng ban theo ID
    const getDepartmentById = (id) => {
        return getAllDepartments().find(dept => dept.id === parseInt(id));
    };

    // Thêm phòng ban mới
    const addDepartment = async (name, description = '', managerId = null) => {
        if (!name || name.trim() === '') {
            throw new Error('Tên phòng ban không được để trống');
        }

        const departments = getAllDepartments();
        
        // Kiểm tra trùng tên
        if (departments.some(d => d.name.toLowerCase() === name.toLowerCase())) {
            throw new Error('Tên phòng ban đã tồn tại');
        }

        const newId = departments.length > 0 
            ? Math.max(...departments.map(d => d.id)) + 1 
            : 1;

        const newDepartment = {
            id: newId,
            name: name.trim(),
            description: description.trim(),
            managerId: managerId ? parseInt(managerId) : null
        };

        departments.push(newDepartment);
        await saveDepartments(departments);
        return newDepartment;
    };

    // Sửa phòng ban
    const updateDepartment = async (id, updates) => {
        const departments = getAllDepartments();
        const index = departments.findIndex(d => d.id === parseInt(id));

        if (index === -1) {
            throw new Error('Không tìm thấy phòng ban');
        }

        // Kiểm tra trùng tên (ngoại trừ chính nó)
        if (updates.name) {
            const duplicate = departments.find(d => 
                d.id !== parseInt(id) && 
                d.name.toLowerCase() === updates.name.toLowerCase()
            );
            if (duplicate) {
                throw new Error('Tên phòng ban đã tồn tại');
            }
        }

        departments[index] = {
            ...departments[index],
            ...updates
        };

        await saveDepartments(departments);
        return departments[index];
    };

    // Xóa phòng ban
    const deleteDepartment = async (id) => {
        const departments = getAllDepartments();
        const filtered = departments.filter(d => d.id !== parseInt(id));

        if (filtered.length === departments.length) {
            throw new Error('Không tìm thấy phòng ban');
        }

        await saveDepartments(filtered);
        return { success: true, message: 'Đã xóa phòng ban' };
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const departments = getAllDepartments();

        container.innerHTML = `
            <div class="form-container">
                <h2>Quản lý Phòng ban</h2>
                
                <form id="department-form">
                    <input type="hidden" id="dept-id">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="dept-name">Tên phòng ban:</label>
                            <input type="text" id="dept-name" required>
                        </div>
                        <div class="form-group">
                            <label for="dept-manager">Quản lý (ID):</label>
                            <input type="number" id="dept-manager">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="dept-desc">Mô tả:</label>
                        <textarea id="dept-desc" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Thêm phòng ban</button>
                    <button type="button" id="cancel-edit" class="btn btn-secondary" style="display:none;">Hủy</button>
                </form>
            </div>

            <div class="table-container">
                <h3>Danh sách Phòng ban</h3>
                ${departments.length === 0 ? 
                    '<div class="empty-state"><h3>Chưa có phòng ban nào</h3></div>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên phòng ban</th>
                                <th>Mô tả</th>
                                <th>Quản lý</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${departments.map(dept => `
                                <tr>
                                    <td>${dept.id}</td>
                                    <td>${dept.name}</td>
                                    <td>${dept.description || '-'}</td>
                                    <td>${dept.managerId || '-'}</td>
                                    <td class="action-buttons">
                                        <button class="btn btn-info edit-dept" data-id="${dept.id}">Sửa</button>
                                        <button class="btn btn-danger delete-dept" data-id="${dept.id}">Xóa</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        `;

        // Event listeners
        const form = document.getElementById('department-form');
        const cancelBtn = document.getElementById('cancel-edit');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('dept-id').value;
            const name = document.getElementById('dept-name').value;
            const managerId = document.getElementById('dept-manager').value;
            const description = document.getElementById('dept-desc').value;

            try {
                if (id) {
                    // Update
                    await updateDepartment(id, { name, managerId, description });
                    alert('Cập nhật phòng ban thành công!');
                } else {
                    // Add
                    await addDepartment(name, description, managerId);
                    alert('Thêm phòng ban thành công!');
                }
                
                form.reset();
                document.getElementById('dept-id').value = '';
                cancelBtn.style.display = 'none';
                render(containerId);
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        });

        cancelBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('dept-id').value = '';
            cancelBtn.style.display = 'none';
        });

        // Edit buttons
        document.querySelectorAll('.edit-dept').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const dept = getDepartmentById(id);
                
                if (dept) {
                    document.getElementById('dept-id').value = dept.id;
                    document.getElementById('dept-name').value = dept.name;
                    document.getElementById('dept-manager').value = dept.managerId || '';
                    document.getElementById('dept-desc').value = dept.description || '';
                    cancelBtn.style.display = 'inline-block';
                }
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-dept').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const dept = getDepartmentById(id);
                
                if (confirm(`Bạn có chắc muốn xóa phòng ban "${dept.name}"?`)) {
                    try {
                        await deleteDepartment(id);
                        alert('Đã xóa phòng ban!');
                        render(containerId);
                    } catch (error) {
                        alert('Lỗi: ' + error.message);
                    }
                }
            });
        });
    };

    // Initialize
    initDefaultData();

    return {
        getAllDepartments,
        getDepartmentById,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        render
    };
})();

export default DepartmentModule;
