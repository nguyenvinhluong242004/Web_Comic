$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        autoWidth: true,
        items: 1, // số lượng item hiển thị
        margin: 10,
        loop: true,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,

    });
    $('#txtInput').on('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn hành động mặc định (nếu có)
            vueApp.searchComic(); // Gọi hàm tìm kiếm
        }
    });
    $('#txtInput-ver2').on('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn hành động mặc định (nếu có)
            vueApp.searchComicVer2(); // Gọi hàm tìm kiếm
        }
    });

    $('.btn-up').on('click', function () {
        console.log('click')
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });

    $('.btn-up').hide();

    let startY = 0; // Vị trí Y khi bắt đầu vuốt
    let endY = 0;   // Vị trí Y khi kết thúc vuốt

    // Xử lý sự kiện vuốt màn hình (cho thiết bị cảm ứng)
    $(document).on('touchstart', function (e) {
        startY = e.originalEvent.touches[0].clientY; // Lấy tọa độ Y lúc bắt đầu
    });

    $(document).on('touchmove', function (e) {
        endY = e.originalEvent.changedTouches[0].clientY; // Lấy tọa độ Y lúc kết thúc

        if (startY > endY + 24) {
            console.log('Vuốt lên');
            $('.btn-up').hide();
        } else if (startY < endY - 24) {
            console.log('Vuốt xuống');
            $('.btn-up').show();
        }
    });

    $(document).on('touchend', function (e) {
        endY = e.originalEvent.changedTouches[0].clientY; // Lấy tọa độ Y lúc kết thúc
    });

    // Xử lý sự kiện lăn chuột (cho thiết bị desktop)
    $(document).on('wheel', function (e) {
        if (e.originalEvent.deltaY > 0) {
            console.log('Lăn xuống');
            $('.btn-up').hide();
        } else if (e.originalEvent.deltaY < 0) {
            console.log('Lăn lên');
            $('.btn-up').show();
        }
    });

});
