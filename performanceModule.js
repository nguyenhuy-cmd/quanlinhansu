// PerformanceModule - Module đánh giá hiệu suất

import EmployeeDbModule from './employeeDbModule.js';

const PerformanceModule = (() => {
    const STORAGE_KEY = 'hrm_performance';

    // Khởi tạo dữ liệu mặc định
    const initDefaultData = () => {
        const reviews = getAllReviews();
        if (reviews.length === 0) {
            const defaultReviews = [
                {
                    id: 1,
                    employeeId: 1,
                    date: '2024-09-01',
                    rating: 5,
                    feedback: 'Xuất sắc, hoàn thành tốt mọi công việc',
                    reviewedBy: 'Admin'
                },
                {
                    id: 2,
                    employeeId: 1,
                    date: '2024-06-01',
                    rating: 4,
                    feedback: 'Tốt, có tiến bộ',
                    reviewedBy: 'Admin'
                },
                {
                    id: 3,
                    employeeId: 2,
                    date: '2024-09-01',
                    rating: 4,
                    feedback: 'Làm việc chăm chỉ',
                    reviewedBy: 'Admin'
                },
                {
                    id: 4,
                    employeeId: 3,
                    date: '2024-09-01',
                    rating: 3,
                    feedback: 'Đạt yêu cầu cơ bản',
                    reviewedBy: 'Admin'
                }
            ];
            saveReviews(defaultReviews);
        }
    };

    // Lấy tất cả reviews
    const getAllReviews = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    };

    // Lưu reviews
    const saveReviews = async (reviews) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    };

    // Thêm đánh giá
    const addReview = async (employeeId, rating, feedback, reviewedBy = 'Admin') => {
        if (rating < 1 || rating > 5) {
            throw new Error('Đánh giá phải từ 1 đến 5');
        }

        const reviews = getAllReviews();
        const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1;

        const newReview = {
            id: newId,
            employeeId: parseInt(employeeId),
            date: new Date().toISOString().split('T')[0],
            rating: parseInt(rating),
            feedback: feedback || '',
            reviewedBy
        };

        reviews.push(newReview);
        await saveReviews(reviews);
        return newReview;
    };

    // Lấy đánh giá trung bình (sử dụng reduce)
    const getAverageRating = (employeeId) => {
        const reviews = getAllReviews().filter(r => r.employeeId === parseInt(employeeId));
        
        if (reviews.length === 0) return 0;

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length).toFixed(2);
    };

    // Lấy lịch sử đánh giá
    const getReviewHistory = (employeeId) => {
        return getAllReviews()
            .filter(r => r.employeeId === parseInt(employeeId))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    // Lấy top performers (sử dụng sort và higher-order functions)
    const getTopPerformers = (limit = 5) => {
        const employees = EmployeeDbModule.getAllEmployees();
        
        const employeesWithRatings = employees.map(emp => ({
            ...emp,
            averageRating: parseFloat(getAverageRating(emp.id)),
            reviewCount: getAllReviews().filter(r => r.employeeId === emp.id).length
        }));

        // Filter employees with at least one review
        const withReviews = employeesWithRatings.filter(emp => emp.reviewCount > 0);

        // Sort by rating descending
        return withReviews.sort((a, b) => b.averageRating - a.averageRating).slice(0, limit);
    };

    // Render UI
    const render = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const employees = EmployeeDbModule.getAllEmployees();
        const reviews = getAllReviews();
        const topPerformers = getTopPerformers(5);

        container.innerHTML = `
            <!-- Add Review Form -->
            <div class="form-container">
                <h2>Đánh giá Hiệu suất Nhân viên</h2>
                
                <form id="performance-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="perf-emp-id">Chọn nhân viên:</label>
                            <select id="perf-emp-id" required>
                                <option value="">-- Chọn nhân viên --</option>
                                ${employees.map(emp => 
                                    `<option value="${emp.id}">${emp.name} (ID: ${emp.id})</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="perf-rating">Đánh giá (1-5):</label>
                            <select id="perf-rating" required>
                                <option value="">-- Chọn --</option>
                                <option value="5">5 - Xuất sắc</option>
                                <option value="4">4 - Tốt</option>
                                <option value="3">3 - Trung bình</option>
                                <option value="2">2 - Dưới trung bình</option>
                                <option value="1">1 - Kém</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="perf-feedback">Nhận xét:</label>
                        <textarea id="perf-feedback" rows="4" placeholder="Nhập nhận xét chi tiết..."></textarea>
                    </div>

                    <div id="perf-messages"></div>

                    <button type="submit" class="btn btn-primary">Thêm đánh giá</button>
                    <button type="reset" class="btn btn-secondary">Nhập lại</button>
                </form>
            </div>

            <!-- Top Performers -->
            <div class="table-container">
                <h3>🏆 Top Performers</h3>
                ${topPerformers.length === 0 ? 
                    '<div class="empty-state"><p>Chưa có dữ liệu</p></div>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>Hạng</th>
                                <th>Nhân viên</th>
                                <th>Phòng ban</th>
                                <th>Số đánh giá</th>
                                <th>Điểm TB</th>
                                <th>Xếp loại</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${topPerformers.map((emp, index) => {
                                let rankIcon = '';
                                if (index === 0) rankIcon = '🥇';
                                else if (index === 1) rankIcon = '🥈';
                                else if (index === 2) rankIcon = '🥉';
                                else rankIcon = index + 1;

                                const getRatingLabel = (rating) => {
                                    if (rating >= 4.5) return '<span style="color: gold; font-weight: bold;">Xuất sắc</span>';
                                    if (rating >= 3.5) return '<span style="color: green;">Tốt</span>';
                                    if (rating >= 2.5) return '<span style="color: orange;">Trung bình</span>';
                                    return '<span style="color: red;">Cần cải thiện</span>';
                                };

                                return `
                                    <tr>
                                        <td style="font-size: 20px;">${rankIcon}</td>
                                        <td>${emp.name}</td>
                                        <td>${emp.departmentId}</td>
                                        <td>${emp.reviewCount}</td>
                                        <td><strong>${emp.averageRating}</strong> / 5</td>
                                        <td>${getRatingLabel(emp.averageRating)}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>

            <!-- All Reviews -->
            <div class="table-container">
                <h3>Lịch sử Đánh giá (${reviews.length})</h3>
                ${reviews.length === 0 ? 
                    '<div class="empty-state"><p>Chưa có đánh giá nào</p></div>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>Ngày</th>
                                <th>Nhân viên</th>
                                <th>Đánh giá</th>
                                <th>Nhận xét</th>
                                <th>Người đánh giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map(review => {
                                const emp = EmployeeDbModule.getEmployeeById(review.employeeId);
                                const stars = '⭐'.repeat(review.rating);
                                return `
                                    <tr>
                                        <td>${review.date}</td>
                                        <td>${emp ? emp.name : 'N/A'}</td>
                                        <td>${stars} (${review.rating}/5)</td>
                                        <td>${review.feedback || '-'}</td>
                                        <td>${review.reviewedBy}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>`
                }
            </div>

            <!-- Employee Performance Report -->
            <div class="table-container">
                <h3>Báo cáo Hiệu suất Tổng hợp</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nhân viên</th>
                            <th>Số đánh giá</th>
                            <th>Điểm TB</th>
                            <th>Đánh giá gần nhất</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.map(emp => {
                            const empReviews = getReviewHistory(emp.id);
                            const avgRating = getAverageRating(emp.id);
                            const lastReview = empReviews[0];
                            return `
                                <tr>
                                    <td>${emp.name}</td>
                                    <td>${empReviews.length}</td>
                                    <td>${empReviews.length > 0 ? avgRating : '-'}</td>
                                    <td>${lastReview ? lastReview.date : '-'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Event listeners
        const form = document.getElementById('performance-form');
        const messagesDiv = document.getElementById('perf-messages');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messagesDiv.innerHTML = '';

            const employeeId = document.getElementById('perf-emp-id').value;
            const rating = document.getElementById('perf-rating').value;
            const feedback = document.getElementById('perf-feedback').value;

            try {
                await addReview(employeeId, rating, feedback);
                
                const emp = EmployeeDbModule.getEmployeeById(employeeId);
                messagesDiv.innerHTML = `
                    <div class="alert alert-success">
                        Đã thêm đánh giá cho ${emp.name}!
                    </div>
                `;

                form.reset();
                
                setTimeout(() => {
                    render(containerId);
                }, 1500);
            } catch (error) {
                messagesDiv.innerHTML = `
                    <div class="alert alert-error">Lỗi: ${error.message}</div>
                `;
            }
        });
    };

    // Initialize
    initDefaultData();

    return {
        addReview,
        getAverageRating,
        getReviewHistory,
        getTopPerformers,
        render
    };
})();

export default PerformanceModule;
