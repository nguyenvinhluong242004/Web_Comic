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
    $('.bi-person-circle').on('click', function(){
        console.log('ggg');
        $(".owl-carousel").owlCarousel({
            autoWidth: true,
            items: 1, // số lượng item hiển thị
            margin: 10,
            loop: true,
            nav: true,
            autoplay: true,
            autoplayTimeout: 3000,
          
        });
    });
});
