@echo off
chcp 65001 > nul
title Mở Link Quà Tặng Online (Xem Từ Xa)
echo ===================================================
echo   ĐANG KHỞI TẠO ĐƯỜNG TRUYỀN ONLINE CHO MÓN QUÀ...
echo ===================================================
echo.
echo Đang mở kết nối... Vui lòng đợi 3-5 giây...
echo Khi thấy dòng link màu xanh có đuôi .lhr.life hoặc https://...
echo Bạn chỉ cần copy link đó gửi cho người ấy!
echo.
echo Nhấn Ctrl + C để dừng khi không dùng nữa.
echo ===================================================
echo.

ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 nokey@localhost.run
pause
