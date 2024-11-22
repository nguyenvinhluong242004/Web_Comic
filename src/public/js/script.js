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
});
