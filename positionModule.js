// PositionModule - Module quản lý vị trí công việc

const PositionModule = (() => {
    const STORAGE_KEY = 'hrm_positions';

    // Khởi tạo dữ liệu mặc định
    const initDefaultData = () => {
        const positions = getAllPositions();
        if (positions.length === 0) {
            const defaultPositions = [
                { id: 1, title: 'Giám đốc', description: 'Giám đốc công ty', salaryBase: 30000000 },
                { id: 2, title: 'Trưởng phòng', description: 'Trưởng phòng ban', salaryBase: 20000000 },
                { id: 3, title: 'Nhân viên chính', description: 'Nhân viên cấp cao', salaryBase: 15000000 },
                { id: 4, title: 'Nhân viên', description: 'Nhân viên thông thường', salaryBase: 10000000 },
                { id: 5, title: 'Thực tập sinh', description: 'Nhân viên thực tập', salaryBase: 5000000 }
            ];
            savePositions(defaultPositions);
        }
    };

    // Lấy tất cả vị trí
    const getAllPositions = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    // Lưu danh sách vị trí
    const savePositions = async (positions) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    };

    // Lấy vị trí theo ID
    const getPositionById = (id) => {
        return getAllPositions().find(pos => pos.id === parseInt(id));
    };

    // Thêm vị trí mới
    const addPosition = async (title, description = '', salaryBase = 0) => {
        if (!title || title.trim() === '') {
            throw new Error('Tên vị trí không được để trống');
        }

        if (salaryBase < 0) {
            throw new Error('Mức lương cơ bản phải >= 0');
        }

        const positions = getAllPositions();
        
        const newId = positions.length > 0 
            ? Math.max(...positions.map(p => p.id)) + 1 
            : 1;

        const newPosition = {
            id: newId,
            title: title.trim(),
            description: description.trim(),
            salaryBase: parseFloat(salaryBase)
        };

        positions.push(newPosition);
        await savePositions(positions);
        return newPosition;
    };

    // Sửa vị trí
    const updatePosition = async (id, updates) => {
        const positions = getAllPositions();
        const index = positions.findIndex(p => p.id === parseInt(id));

        if (index === -1) {
            throw new Error('Không tìm thấy vị trí');
        }

        if (updates.salaryBase !== undefined && updates.salaryBase < 0) {
            throw new Error('Mức lương cơ bản phải >= 0');
        }

        positions[index] = {
            ...positions[index],
            ...updates
        };

        await savePositions(positions);
        return positions[index];
    };

    // Xóa vị trí
    const deletePosition = async (id) => {
        const positions = getAllPositions();
        const filtered = positions.filter(p => p.id !== parseInt(id));

        if (filtered.length === positions.length) {
            throw new Error('Không tìm thấy vị trí');
        }

        await savePositions(filtered);
        return { success: true, message: 'Đã xóa vị trí' };
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const positions = getAllPositions();

        container.innerHTML = `
            <div class="form-container">
                <h2>Quản lý Vị trí</h2>
                
                <form id="position-form">
                    <input type="hidden" id="pos-id">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pos-title">Tên vị trí:</label>
                            <input type="text" id="pos-title" required>
                        </div>
                        <div class="form-group">
                            <label for="pos-salary">Lương cơ bản:</label>
                            <input type="number" id="pos-salary" min="0" step="100000" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pos-desc">Mô tả:</label>
                        <textarea id="pos-desc" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Thêm vị trí</button>
                    <button type="button" id="cancel-edit-pos" class="btn btn-secondary" style="display:none;">Hủy</button>
                </form>
            </div>

            <div class="table-container">
                <h3>Danh sách Vị trí</h3>
                ${positions.length === 0 ? 
                    '<div class="empty-state"><h3>Chưa có vị trí nào</h3></div>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên vị trí</th>
                                <th>Mô tả</th>
                                <th>Lương cơ bản</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${positions.map(pos => `
                                <tr>
                                    <td>${pos.id}</td>
                                    <td>${pos.title}</td>
                                    <td>${pos.description || '-'}</td>
                                    <td>${pos.salaryBase.toLocaleString('vi-VN')} VNĐ</td>
                                    <td class="action-buttons">
                                        <button class="btn btn-info edit-pos" data-id="${pos.id}">Sửa</button>
                                        <button class="btn btn-danger delete-pos" data-id="${pos.id}">Xóa</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        `;

        // Event listeners
        const form = document.getElementById('position-form');
        const cancelBtn = document.getElementById('cancel-edit-pos');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('pos-id').value;
            const title = document.getElementById('pos-title').value;
            const salaryBase = document.getElementById('pos-salary').value;
            const description = document.getElementById('pos-desc').value;

            try {
                if (id) {
                    await updatePosition(id, { title, salaryBase, description });
                    alert('Cập nhật vị trí thành công!');
                } else {
                    await addPosition(title, description, salaryBase);
                    alert('Thêm vị trí thành công!');
                }
                
                form.reset();
                document.getElementById('pos-id').value = '';
                cancelBtn.style.display = 'none';
                render(containerId);
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        });

        cancelBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('pos-id').value = '';
            cancelBtn.style.display = 'none';
        });

        // Edit buttons
        document.querySelectorAll('.edit-pos').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const pos = getPositionById(id);
                
                if (pos) {
                    document.getElementById('pos-id').value = pos.id;
                    document.getElementById('pos-title').value = pos.title;
                    document.getElementById('pos-salary').value = pos.salaryBase;
                    document.getElementById('pos-desc').value = pos.description || '';
                    cancelBtn.style.display = 'inline-block';
                }
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-pos').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const pos = getPositionById(id);
                
                if (confirm(`Bạn có chắc muốn xóa vị trí "${pos.title}"?`)) {
                    try {
                        await deletePosition(id);
                        alert('Đã xóa vị trí!');
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
        getAllPositions,
        getPositionById,
        addPosition,
        updatePosition,
        deletePosition,
        render
    };
})();

export default PositionModule;
