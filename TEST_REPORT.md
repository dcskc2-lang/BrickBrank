# Báo Cáo Kiểm Thử Tự Động (Automation Test Report)

**Dự án:** BrickBrackWeb
**Mô-đun:** GameLogic (`components/BlockBlast/GameLogic.js`)
**Framework sử dụng:** Jest

## 1. Bảng Thông Số Kết Quả Kiểm Thử (Test Execution Report)

| Test Case ID | Description (Mô tả kịch bản) | Input Data (Dữ liệu đầu vào) | Expected Result (Kết quả mong đợi) | Actual Result (Kết quả thực tế) | Status (Trạng thái) |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Tạo bảng game rỗng với kích thước chuẩn | Gọi hàm `createEmptyBoard(8)` | Trả về mảng 2 chiều 8x8 (array), tất cả các phần tử mặc định mang giá trị `'0'` (cell trống). | Trả về mảng 8x8, tất cả phần tử là `'0'`. | ✅ **Pass** |
| **TC-02** | Đặt khối (Place Block) vào bảng rỗng hợp lệ | `board` rỗng, `shape` là `dot` (1x1), tọa độ `(row: 0, col: 0)` | Hàm `canPlaceShape` trả về giá trị boolean `true` (không bị overlap, không ra ngoài grid). | Hàm trả về `true`. | ✅ **Pass** |
| **TC-03** | Đặt khối ra ngoài biên của bảng (Out of bounds) | `board` rỗng, `shape` là khối `square-2` (2x2), tọa độ góc dưới `(row: 7, col: 7)` | Hàm `canPlaceShape` phát hiện index vượt quá `boardSize`, ném Exception hoặc trả về `false`. | Hàm trả về `false` do vi phạm Out of bounds. | ✅ **Pass** |
| **TC-04** | Xóa hàng (Clear Lines) và cộng điểm khi full block | `board` có `row 0` chứa đầy các phần tử `'#FF5722'` (block màu) thay vì rỗng | Hàm `checkAndClearLines` tự động xóa dòng (clear rows), chuyển các ô về `'0'`, `linesCleared = 1`. | Hàm trả về đối tượng có `linesCleared: 1` và `row 0` về `'0'`. | ✅ **Pass** |
| **TC-05** | Kích hoạt trạng thái Game Over | `board` chứa đầy block không còn chỗ trống. `availableShapes` chứa khối to (vd 2x2) | Hàm `checkGameOver` duyệt qua toàn bộ grid và trả về `true` (không còn moves khả thi). | Hàm trả về `true`. | ✅ **Pass** |

---

## 2. Hướng dẫn chạy Test trong Terminal

### Bước 1: Mở Terminal tại thư mục dự án
Đảm bảo bạn đang ở đường dẫn `D:\BrickBrackWeb`. Mở Terminal trong Visual Studio Code bằng phím tắt `` Ctrl + ` ``.

### Bước 2: Khởi chạy lệnh Jest
Chạy một trong các lệnh sau để thực thi file test `__tests__/GameLogic.test.js`:

```bash
# Lệnh chạy Jest nội bộ (khuyên dùng)
npx jest __tests__/GameLogic.test.js

# Hoặc nếu bạn gặp lỗi import ES Modules, hãy dùng lệnh flag thực nghiệm:
node --experimental-vm-modules node_modules/jest/bin/jest.js __tests__/GameLogic.test.js
```

### Bước 3: Đọc kết quả
Terminal sẽ in ra bảng log màu xanh lá cây thể hiện **PASS** với đầy đủ các `TC-01` tới `TC-05`.
