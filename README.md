# 🎁 Món Quà Tặng Lãng Mạn - Mưa Sao Trái Tim 3D Neon (Bản Siêu Mượt 60FPS)

Phiên bản nâng cấp tối thượng giải quyết triệt để 2 vấn đề:
1. **Khắc phục 100% tình trạng giật lag**: Ứng dụng chạy mượt mà 60 FPS - 120 FPS trên mọi thiết bị nhờ cơ chế tăng tốc phần cứng GPU (Additive Blending `ctx.globalCompositeOperation = 'lighter'`) thay thế việc tính toán bóng mờ CPU đắt đỏ.
2. **Cơ chế Phân Quyền Thông Minh (Bạn chỉnh mọi thứ - Người nhận chỉ được ngắm)**:
   - Người nhận quà khi mở link sẽ **hoàn toàn không thấy thanh chỉnh nào**, không thể can thiệp hay phá hỏng thiết kế.
   - Bạn (Người tạo quà) có thể mở bảng cài đặt bí mật để chỉnh tên, lời chúc, ký tự, màu sắc và bấm 1 nút để tạo link gửi người ấy!

---

## 🔑 Cách Mở Bảng Cài Đặt Bí Mật Dành Cho Bạn

Bạn có thể mở bảng cài đặt bằng **1 trong 3 cách sau**:

1. **Nhấn phím bí mật**: Khi đang mở trang web trên máy tính, chỉ cần nhấn phím **`A`** hoặc phím **`S`** trên bàn phím.
2. **Chạm 3 lần liên tiếp**: Nhấp chuột hoặc chạm tay 3 lần vào **góc dưới cùng bên trái màn hình** (điểm cảm ứng bí mật).
3. **Mở link Admin**: Truy cập qua đường dẫn:
   👉 **`http://localhost:3000/?admin`**

---

## 🎨 Trong Bảng Cài Đặt Bạn Có Thể Chỉnh Những Gì?

- **Tên người nhận**: Ví dụ: *Bé Yêu, Linh, Phương Anh, My Sweetheart...*
- **Tên người gửi (Chữ ký thiệp)**: Ví dụ: *From Hoàng With Love ♥*
- **Ký tự mưa chữ & trái tim**: Nhập tên 2 bạn, ngày kỷ niệm, emoji tình yêu (`♥LOVE★YOU∞FOREVER✿EM1314💖520`).
- **Nội dung bức thư tình**: Soạn lời chúc ngọt ngào của riêng bạn.
- **Tông màu Neon**: *Hồng Neon, Vàng Hoàng Kim, Xanh Cyber, Tím Cực Quang*.
- **Số lượng hạt & tốc độ rơi**: Căn chỉnh độ dày mượt mà.

---

## 🎁 Tính Năng: "Sao Chép Link Gửi Người Ấy"

Khi bạn đã tùy chỉnh xong xuôi và ưng ý nhất:
1. Bấm nút màu hồng: **"🎁 Sao Chép Link Gửi Người Ấy (Không Chỉnh Được)"**.
2. Toàn bộ thiết lập của bạn (tên, chữ, màu sắc, bức thư) sẽ được đóng gói tự động vào link.
3. Gửi link đó cho người ấy. Khi người ấy mở link lên:
   - Sẽ thấy món quà đúng 100% những gì bạn vừa tạo.
   - **Tuyệt đối KHÔNG có bất kỳ nút chỉnh hay bảng cài đặt nào**, chỉ có ngắm trái tim, mở thư tình và bật nhạc thư giãn!

---

## 🚀 Trải Nghiệm Ngay

Mở trình duyệt:
👉 **[http://localhost:3000](http://localhost:3000)** (Nhấn phím **`A`** để mở bảng chỉnh)
hoặc:
👉 **[http://localhost:3000/?admin](http://localhost:3000/?admin)**

---

## 🧩 1. Bức Tranh Toàn Cảnh: Web Hoạt Động Như Thế Nào?

1. **Mặt tiền cửa hàng (`HTML + CSS + Canvas`):**
   - Là thứ đập vào mắt người xem: Bầu trời sao rơi xuống, tụ lại thành hình trái tim 3D phát sáng, bức thư tình cảm mở ra khi bấm vào icon lá thư 💌.
2. **Cuốn sổ ghi nhớ (`config.json`):**
   - Lưu sẵn toàn bộ nội dung: Lời chúc Má 20/10 (*"Mẹ hoa yêu quý hehe"*), lời chúc Người yêu, lời chúc Em gái, màu vàng/hồng, chữ ký *"Lucas của má"*.
3. **Người quản gia (`server.js`):**
   - Chạy ngầm trên máy tính bạn (cổng 3000). Khi có ai gõ vào web, người quản gia sẽ mở cuốn sổ `config.json` ra và đưa đúng nội dung đó cho người xem.
4. **Cây cầu ra Internet (`Ngrok`):**
   - Máy tính của bạn bình thường người ngoài mạng không vào được (`localhost:3000` chỉ mình bạn thấy).
   - Ngrok như một cây cầu nối máy tính bạn ra ngoài Internet, tạo thành link công khai (ví dụ: `https://astronaut-anchor-jackpot.ngrok-free.dev`) để Má hay Người yêu ở xa bấm vào điện thoại là xem được.

---

## 🛡️ 2. Tại Sao Chỉ Mình Bạn Chỉnh Được, Người Nhận KHÔNG THỂ Chỉnh?

* **Khi bạn mở trên máy bạn (`localhost:3000`):** Web nhận diện bạn là **Admin/Chủ nhân** ➡️ Cho phép bạn bấm phím **`A`** để mở bảng cài đặt, chỉnh chữ, đổi màu, tăng giảm hạt tim.
* **Khi Má hay Bạn gái mở link ngrok trên điện thoại:** Web nhận diện đây là **Khách nhận quà** ➡️ **Tự động giấu tiệt toàn bộ bảng cài đặt và khóa phím tắt**. Người nhận chỉ thấy trái tim lung linh và mở đọc thư, không tài nào chỉnh sửa hay phá giao diện được.

---

## 🔗 3. Tại Sao Lại Sinh Ra 3 Link `/me`, `/crush`, `/emgai`?

Trước đây gửi link kèm câu chữ dài ngoằng (`?to=MeHoa&msg=Chuc...`), khi gửi qua Zalo / Messenger nó tự động cắt đứt chữ tiếng Việt có dấu khiến link bị lỗi hoặc nhảy về mặc định.

**Bây giờ:**
* Toàn bộ câu chúc của từng người đã được cất cố định trong file `config.json` trên máy bạn rồi.
* Bạn chỉ việc gửi đường link siêu ngắn:
  * 🌸 **Đuôi `/me`**: Web tự biết mở lời chúc của **Má**.
  * 💖 **Đuôi `/crush`**: Web tự biết mở lời chúc của **Người yêu**.
  * 🎀 **Đuôi `/emgai`**: Web tự biết mở lời chúc của **Em gái**.
* Link ngắn như vậy thì Zalo/Messenger **không bao giờ bị cắt xén hay mất chữ nữa**!

---

## 🚀 4. Quy Trình Sử Dụng Thực Tế (3 Bước Cực Dễ)

Mỗi khi bạn muốn gửi quà cho ai:
1. **Bước 1:** Bật ngrok trong CMD (`ngrok http 3000`) để lấy link (ví dụ: `https://astronaut-anchor-jackpot.ngrok-free.dev`).
2. **Bước 2:** Vào web `http://localhost:3000`, bấm phím **`A`** mở bảng cài đặt:
   - Chỉnh sửa lời chúc nếu muốn.
   - Dán link ngrok vào ô màu vàng (hệ thống sẽ tự động lưu vĩnh viễn vào máy).
3. **Bước 3:** Nhìn xuống bên dưới, bấm nút **[Sao chép]** ở dòng **Gửi Má** (hoặc Crush/Em gái) rồi dán vào Zalo gửi đi là xong! Người nhận mở ra sẽ thấy chuẩn 100% như trên máy bạn!

