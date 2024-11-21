// vue-app.js
new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        DOMAIN: 'https://comic-sv1.onrender.com/',
        //DOMAIN: 'http://localhost:8888/',
        domain_image: 'https://img.otruyenapi.com',
        domain_cdn_read: '',
        middle_domain: '/uploads/comics/',
        comics_update: [],
        comics_type: [],
        comics_type_result: [],
        comics_search_result: [],
        comicNameType: '',
        imgage_comics: [],
        comic_detail: [],
        comic_detail_chaps: [],
        comicName: '',
        comicNumber: 1,
        comicSlug: '',
        imgs_comic: [],
        imgs_path: '',
        comicNameSearch: '',
        chapterName: '',

        per_page: 24,
        total_page: 1,
        page: 1,

    },
    methods: {
        fetchComicUpdates() {
            fetch(`https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.comics_update = data.data.items;
                    this.imgage_comics = data.data.seoOnPage.og_image;
                    console.log(this.comics_update[0].name);
                    this.per_page = data.data.params.pagination.totalItemsPerPage;
                    this.total_page = Math.ceil(data.data.params.pagination.totalItems / this.per_page);
                    console.log(this.total_page);
                })
                .catch(error => console.error('Error fetching comics:', error));
        },
        fetchComicTypes(typeName) {
            fetch(`https://otruyenapi.com/v1/api/the-loai/${typeName}?page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.comics_type_result = data.data.items;
                    this.imgage_comics = data.data.seoOnPage.og_image;
                    console.log(data);
                    console.log(this.comics_type_result);
                    this.per_page = data.data.params.pagination.totalItemsPerPage;
                    this.total_page = Math.ceil(data.data.params.pagination.totalItems / this.per_page);
                    console.log(this.page)
                    console.log(this.per_page)
                    console.log(this.total_page)

                    // Lưu lại vào localStorage
                    localStorage.setItem('comicNameType', JSON.stringify(this.comicNameType));
                })
                .catch(error => console.error('Error fetching comics:', error));
        },
        fetchTypes() {
            fetch('https://otruyenapi.com/v1/api/the-loai')
                .then(response => response.json())
                .then(data => {
                    this.comics_type = data.data.items;
                    console.log(data);
                    console.log(this.comics_type);

                    // Lưu lại vào localStorage
                    localStorage.setItem('comics_type', JSON.stringify(this.comics_type));
                })
                .catch(error => console.error('Error fetching comics:', error));
        },
        fetchComicDetails(comicName) {
            // Fetch thông tin chi tiết của truyện từ backend
            fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${comicName}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.comic_detail = data.data.item;
                    this.comicName = this.comic_detail.name;
                    this.comicSlug = comicName;

                    console.log(this.comic_detail.chapters);
                    this.comic_detail.chapters.forEach(element => {
                        console.log(element.server_data);
                    });
                    this.comic_detail_chaps = [];
                    if (Array.isArray(this.comic_detail.chapters)) {
                        this.comic_detail.chapters.forEach(element => {
                            if (Array.isArray(element.server_data)) {
                                element.server_data.forEach(server => {
                                    const dataTemp = {
                                        chapter_api_data: server.chapter_api_data.split('/').pop(),
                                        chapter_name: server.chapter_name,
                                    }

                                    this.comic_detail_chaps.push(dataTemp);
                                });
                            }
                        });
                    }
                    console.log(this.comic_detail_chaps)
                    console.log(this.domain_image + '/uploads/comics/' + this.comic_detail.thumb_url)

                    // Lưu lại vào localStorage
                    localStorage.setItem('comic_detail_chaps', JSON.stringify(this.comic_detail_chaps));
                    localStorage.setItem('comicName', JSON.stringify(this.comicName));
                    localStorage.setItem('comicSlug', JSON.stringify(this.comicSlug));
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        fetchComicReads(comicID) {
            // Fetch thông tin chi tiết của truyện từ backend
            fetch(`https://sv1.otruyencdn.com/v1/api/chapter/${comicID}`)
                .then(response => response.json())
                .then(data => {
                    this.domain_cdn_read = data.data.domain_cdn;
                    console.log(data.data.item);
                    this.imgs_path = data.data.item.chapter_path;
                    console.log(this.imgs_comic[0]);
                    this.imgs_comic = data.data.item.chapter_image;

                    // Lưu lại vào localStorage
                    localStorage.setItem('comicNumber', JSON.stringify(this.comicNumber));
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        searchComic() {
            if ($('#txtInput').val().trim()) {
                console.log($('#txtInput').val())
                window.location.href = `/search?keyword=${encodeURIComponent($('#txtInput').val()).replace(/%20/g, "+")}&page=1`;
            } else {
                alert("Vui lòng nhập từ khóa tìm kiếm!");
            }
        },
        fetchComicSearchs(key_word) {
            // Fetch thông tin chi tiết của truyện từ backend
            fetch(`https://otruyenapi.com/v1/api/tim-kiem?keyword=${key_word}&page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.comics_search_result = data.data.items;
                    this.imgage_comics = data.data.seoOnPage.og_image;
                    this.per_page = data.data.params.pagination.totalItemsPerPage;
                    this.total_page = Math.ceil(data.data.params.pagination.totalItems / this.per_page);

                    // Lưu lại vào localStorage
                    localStorage.setItem('comicNameSearch', JSON.stringify(this.comicNameSearch));
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        formatTimeDifference(dateString) {
            const currentTime = new Date();
            const updateTime = new Date(dateString);
            const timeDifference = currentTime - updateTime; // Tính sự khác biệt giữa 2 thời điểm (ms)
        
            const seconds = Math.floor(timeDifference / 1000); // Chuyển sang giây
            const minutes = Math.floor(seconds / 60); // Chuyển sang phút
            const hours = Math.floor(minutes / 60); // Chuyển sang giờ
            const days = Math.floor(hours / 24); // Chuyển sang ngày
        
            // Nếu thời gian nhỏ hơn 1 phút
            if (seconds < 60) {
                return `${seconds} giây trước`;
            }
            // Nếu thời gian trong vòng 1 giờ
            if (minutes < 60) {
                return `${minutes} phút trước`;
            }
            // Nếu thời gian trong vòng 24 giờ
            if (hours < 24) {
                return `${hours} giờ trước`;
            }
            // Nếu thời gian trong vòng 7 ngày
            if (days <= 7) {
                return `${days} ngày trước`;
            }
        
            // Nếu quá 7 ngày, hiển thị dạng ngày/tháng/năm
            const day = String(updateTime.getDate()).padStart(2, '0');
            const month = String(updateTime.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
            const year = updateTime.getFullYear();
        
            return `${day}/${month}/${year}`;
        },
        formatDateTime(dateString) {
            const date = new Date(dateString);

            // Lấy các thành phần ngày, giờ
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            // Trả về chuỗi theo định dạng yêu cầu
            return `Cập nhật lúc: ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        },
        fetchDataStorage() {
            console.log('get');
            this.comicSlug = JSON.parse(localStorage.getItem('comicSlug'));
            this.comic_detail_chaps = JSON.parse(localStorage.getItem('comic_detail_chaps'));
            this.comicNameSearch = JSON.parse(localStorage.getItem('comicNameSearch'));
            this.comicName = JSON.parse(localStorage.getItem('comicName'));
            this.comicNumber = JSON.parse(localStorage.getItem('comicNumber'));
            this.comics_type = JSON.parse(localStorage.getItem('comics_type'));
        }
    },
    computed: {
        visiblePages() {
            console.log(this.page)
            // Tính toán phạm vi hiển thị từ page đến page + 15
            const start = this.page;
            const end = Math.min(this.page + 7, this.total_page); // Không vượt quá total_page
            console.log(Array.from({ length: end - start + 1 }, (_, i) => start + i))
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
        },
    },
    mounted() {
        this.fetchDataStorage();

        // Fetch danh sách truyện khi trang được tải
        if (window.location.pathname === '/') {
            const urlParams = new URLSearchParams(window.location.search);
            const page = parseInt(urlParams.get('page'), 10);
            if (page) {
                this.page = page;
            }
            this.fetchTypes()
            this.fetchComicUpdates();
        }
        console.log(this.comicName)

        if (window.location.pathname === '/detail-comic') {
            const urlParams = new URLSearchParams(window.location.search);
            const comicName = urlParams.get('id');
            if (comicName) {
                console.log(comicName)
                this.fetchComicDetails(comicName);
            }
        }

        if (window.location.pathname === '/read-comic') {
            const urlParams = new URLSearchParams(window.location.search);
            const comicId = urlParams.get('id');
            const comicNumber = parseInt(urlParams.get('num'), 10)
            const chapterName = urlParams.get('chapter-name');
            if (comicId) {
                console.log(comicId)
                console.log(comicNumber)
                this.comicNumber = comicNumber;
                this.chapterName = chapterName;
                this.fetchComicReads(comicId);
            }
        }

        if (window.location.pathname === '/search') {
            const urlParams = new URLSearchParams(window.location.search);
            const comicNameSearch = urlParams.get('keyword');
            this.page = parseInt(urlParams.get('page'), 10)
            if (comicNameSearch) {
                console.log(comicNameSearch)
                console.log(this.page)
                this.comicNameSearch = comicNameSearch;
                this.fetchComicSearchs(comicNameSearch);
            }
        }

        if (window.location.pathname === '/type') {
            const urlParams = new URLSearchParams(window.location.search);
            const comicNameType = urlParams.get('name');
            this.page = parseInt(urlParams.get('page'), 10)
            if (comicNameType) {
                this.comicNameType = comicNameType;
                console.log(comicNameType)
                console.log(this.page)
                this.fetchComicTypes(comicNameType);
            }
        }

    },
});
