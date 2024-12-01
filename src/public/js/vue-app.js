// vue-app.js
const vueApp = new Vue({
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
        comics_complete: [],
        images_complete: [],
        comicNameType: '',
        imgage_comics: [],
        comic_detail: [],
        comic_breadCrumb: [],
        comic_detail_chaps: [],
        comicName: '',
        comicNumber: 1,
        comicID: '',
        comicSlug: '',
        imgs_comic: [],
        imgs_path: '',
        comicNameSearch: '',
        chapterName: '',
        titlePage_type: '',

        isShowFullList: false,

        per_page: 24,
        total_page: 1,
        page: 1,

        isLogin: false,
        dataUser: [],
        dataUserTotalChaps: 0,
        dataLevel: [],
        dataComicFavor: [],
        loginEmail: '',
        loginPassword: '',
        signupEmail: '',
        username: '',
        signupPassword: '',
        confirmPassword: '',
        isFavor: false,

        comment: '',
        listCommentComic: [],
        isViewCmt: false,
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
        fetchComicCompletes() {
            fetch(`https://otruyenapi.com/v1/api/the-loai/manhua?page=${this.getRandomPage()}`)
                .then(response => response.json())
                .then(data => {
                    this.comics_complete = data.data.items;
                    this.images_complete = data.data.seoOnPage.og_image;
                    console.log(this.comics_complete);
                })
                .catch(error => console.error('Error fetching comics:', error));
        },
        fetchComicTypes(typeName) {
            fetch(`https://otruyenapi.com/v1/api/the-loai/${typeName}?page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    this.comics_type_result = data.data.items;
                    this.imgage_comics = data.data.seoOnPage.og_image;
                    this.titlePage_type = data.data.titlePage;
                    console.log(data);
                    console.log(this.comics_type_result);
                    this.comics_type_result.forEach(element => {
                        // Kiểm tra xem chaptersLatest tồn tại và là một mảng, đồng thời có phần tử đầu tiên
                        if (Array.isArray(element.chaptersLatest) && element.chaptersLatest.length > 0) {
                            const chapterName = element.chaptersLatest[0]?.chapter_name; // Dùng optional chaining để an toàn
                            if (chapterName) {
                                console.log(chapterName);
                            } else {
                                console.log('Không tìm thấy chapter_name cho truyện này.');
                            }
                        } else {
                            console.log('chaptersLatest không tồn tại hoặc không có phần tử.');
                        }
                    });

                    this.per_page = data.data.params.pagination.totalItemsPerPage;
                    this.total_page = Math.ceil(data.data.params.pagination.totalItems / this.per_page);
                    console.log(this.page)
                    console.log(this.per_page)
                    console.log(this.total_page)
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
                    this.comicSlug = this.comic_detail.slug;
                    this.isShowFullList = false;
                    this.comic_breadCrumb = data.data.breadCrumb;

                    console.log(this.comic_detail)
                    console.log(this.comic_detail.chapters);
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
                    if (this.isLogin) {
                        this.isFavor = !!this.dataComicFavor.find(item => item.id_truyen === this.comicSlug);
                    }

                    console.log(this.comic_detail_chaps)
                    console.log(this.domain_image + '/uploads/comics/' + this.comic_detail.thumb_url)

                    // Lưu lại vào sessionStorage
                    // sessionStorage.setItem('comic_detail', JSON.stringify(this.comic_detail));
                    // sessionStorage.setItem('comic_detail_chaps', JSON.stringify(this.comic_detail_chaps));
                    // sessionStorage.setItem('comicName', JSON.stringify(this.comicName));
                    // sessionStorage.setItem('comicSlug', JSON.stringify(this.comicSlug));
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        fetchComicReads(comicID) {
            // Fetch thông tin chi tiết của truyện từ backend
            fetch(`https://sv1.otruyencdn.com/v1/api/chapter/${comicID}`)
                .then(response => response.json())
                .then(data => {
                    this.domain_cdn_read = data.data.domain_cdn;
                    this.comicID = data.data.item._id;
                    console.log(data.data);
                    this.imgs_path = data.data.item.chapter_path;
                    this.imgs_comic = data.data.item.chapter_image;
                    console.log(this.imgs_comic[0]);

                    if (this.isLogin) {
                        this.isFavor = !!this.dataComicFavor.find(item => item.id_truyen === this.comicSlug);
                    }
                    // Lưu lại vào localStorage
                    sessionStorage.setItem('comicNumber', JSON.stringify(this.comicNumber));
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        async addTotalchaps() {
            try {
                const response = await axios.post('/read-comic/api/getTotal', {
                    idUser: this.dataUser.id_user,
                });

                if (response.data.success) {
                    console.log(response.data.totalChaps)
                    this.dataUserTotalChaps = response.data.totalChaps.total_chaps || 0;

                    
                    sessionStorage.setItem('dataUserTotalChaps', JSON.stringify(this.dataUserTotalChaps));
                } else {
                    alert('Có lỗi xảy ra khi đăng ký');
                }
            } catch (error) {
                console.error('Lỗi đăng ký:', error);
                alert('Có lỗi xảy ra khi đăng ký');
            }
        },
        searchComic() {
            if ($('#txtInput').val().trim()) {
                console.log($('#txtInput').val())
                window.location.href = `/search?keyword=${encodeURIComponent($('#txtInput').val()).replace(/%20/g, "+")}&page=1`;
            } else {
                //alert("Vui lòng nhập từ khóa tìm kiếm!");
            }
        },
        searchComicVer2() {
            if ($('#txtInput-ver2').val().trim()) {
                console.log($('#txtInput-ver2').val())
                window.location.href = `/search?keyword=${encodeURIComponent($('#txtInput-ver2').val()).replace(/%20/g, "+")}&page=1`;
            } else {
                //alert("Vui lòng nhập từ khóa tìm kiếm!");
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
                    sessionStorage.setItem('comicNameSearch', JSON.stringify(this.comicNameSearch));
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
        getRandomPage() {
            const min = 1;
            const max = 240;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        changeIsShow(sta) {
            this.isShowFullList = sta;
        },
        scrollToActiveChapter() {
            const dropdownMenu = $('.dropdownMenu');
            dropdownMenu.scrollTop(0);
            const activeItem = $('.active-chapter');
            console.log(dropdownMenu)
            if (activeItem) {
                dropdownMenu.scrollTop(activeItem.position().top - dropdownMenu.position().top);
            }
        },
        getAccount() {
            if (!this.isLogin) {
                window.location.href = `${this.DOMAIN}login`;
            }
            else {
                window.location.href = `${this.DOMAIN}account`;
            }
        },
        logOut() {
            this.isLogin = false;
            sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin));
            window.location.href = `${this.DOMAIN}login`;
        },
        async login() {
            if (this.loginEmail && this.loginPassword) {
                try {
                    const response = await axios.post('/login/api', {
                        loginEmail: this.loginEmail,
                        loginPassword: this.loginPassword
                    });

                    if (response.data.success) {
                        alert(response.data.message);
                        //this.goToDetailAccount();
                        this.dataUser = response.data.dataUser || [];
                        this.dataLevel = response.data.dataLevel || [];
                        this.dataComicFavor = response.data.dataComicFavor || [];
                        this.dataUserTotalChaps = response.data.totalChaps.total_chaps || 0;
                        console.log(this.dataUser.email);
                        this.isLogin = true;

                        sessionStorage.setItem('dataComicFavor', JSON.stringify(this.dataComicFavor));
                        sessionStorage.setItem('dataUserTotalChaps', JSON.stringify(this.dataUserTotalChaps));
                        sessionStorage.setItem('isLogin', JSON.stringify(this.isLogin));
                        sessionStorage.setItem('dataUser', JSON.stringify(this.dataUser));
                        sessionStorage.setItem('dataLevel', JSON.stringify(this.dataLevel));


                        window.location.href = `${this.DOMAIN}account`;
                    } else {
                        alert(response.data.message);
                    }
                } catch (error) {
                    console.error('Lỗi đăng nhập:', error);
                    alert('Có lỗi xảy ra khi đăng nhập');
                }

            } else {
                alert('Vui lòng nhập đầy đủ thông tin đăng nhập.');
            }
        },
        async signup() {
            if (this.signupPassword !== this.confirmPassword) {
                alert('Mật khẩu và mật khẩu xác nhận không khớp.');
            } else if (this.signupEmail && this.signupPassword) {
                try {
                    const response = await axios.post('/register/api', {
                        signupEmail: this.signupEmail,
                        username: this.username,
                        signupPassword: this.signupPassword
                    });

                    if (response.data.success) {
                        alert(response.data.message);
                        window.location.href = `${this.DOMAIN}login`;
                    } else {
                        alert('Có lỗi xảy ra khi đăng ký');
                    }
                } catch (error) {
                    console.error('Lỗi đăng ký:', error);
                    alert('Có lỗi xảy ra khi đăng ký');
                }
            } else {
                alert('Vui lòng nhập đầy đủ thông tin đăng ký.');
            }
        },
        async addFavor(sta) {
            if (!this.isLogin) {
                alert('Hãy đăng nhập');
                return;
            }
            console.log(this.dataUser.id_user)
            console.log(this.comicSlug)
            console.log(this.comicName)
            try {
                let response;
                if (sta) {
                    response = await axios.post('/read-comic/api/favor', {
                        idUser: this.dataUser.id_user,
                        idTruyen: this.comicSlug,
                        tenTruyen: this.comicName
                    });
                }
                else {
                    response = await axios.post('/detail-comic/api/favor', {
                        idUser: this.dataUser.id_user,
                        idTruyen: this.comicSlug,
                        tenTruyen: this.comicName
                    });
                }

                if (response.data.success) {
                    alert(response.data.message);
                    //this.goToDetailAccount();
                    this.dataComicFavor = response.data.dataComicFavor || [];
                    this.isFavor = response.data.favor;
                    console.log('add');

                    sessionStorage.setItem('dataComicFavor', JSON.stringify(this.dataComicFavor));

                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Lỗi:', error);
                alert('Có lỗi xảy ra khi xử lí yêu thích');
            }
        },
        async submitComment(sta, rq) {
            if (rq && !this.isLogin) {
                alert('Hãy đăng nhập');
                return;
            }
            if (rq && this.comment.trim() === '') {
                alert('Hãy nhập nội dung');
                return;
            }
            try {
                let response;
                if (sta) {
                    response = await axios.post('/read-comic/api/comment', {
                        require: rq,
                        idUser: this.dataUser?.id_user || '',
                        idTruyen: this.comicSlug,
                        idChapter: this.comicID,
                        comment: this.comment
                    });
                }
                else {
                    response = await axios.post('/detail-comic/api/comment', {
                        require: rq,
                        idUser: this.dataUser?.id_user || '',
                        idTruyen: this.comicSlug,
                        comment: this.comment
                    });
                }

                if (response.data.success) {
                    alert(response.data.message);

                    this.listCommentComic = response.data.listCommentComic;
                    console.log(this.listCommentComic)
                    this.comment = '';
                    this.isViewCmt = true;

                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                console.error('Lỗi:', error);
                alert('Có lỗi xảy ra khi xử lí yêu thích');
            }
        },
        fetchDataStorage() {
            console.log('get');
            // this.comicSlug = JSON.parse(sessionStorage.getItem('comicSlug'));
            // this.comic_detail_chaps = JSON.parse(sessionStorage.getItem('comic_detail_chaps'));
            // this.comic_detail = JSON.parse(sessionStorage.getItem('comic_detail'));
            this.isLogin = JSON.parse(sessionStorage.getItem('isLogin'));
            this.dataUser = JSON.parse(sessionStorage.getItem('dataUser'));
            this.dataUserTotalChaps = JSON.parse(sessionStorage.getItem('dataUserTotalChaps'));
            this.dataLevel = JSON.parse(sessionStorage.getItem('dataLevel'));
            console.log(this.dataUser)
            this.comicNameSearch = JSON.parse(sessionStorage.getItem('comicNameSearch'));
            // this.comicName = JSON.parse(sessionStorage.getItem('comicName'));
            this.comicNumber = JSON.parse(sessionStorage.getItem('comicNumber'));
            this.dataComicFavor = JSON.parse(sessionStorage.getItem('dataComicFavor'));
            console.log(this.dataComicFavor)
            this.comics_type = JSON.parse(localStorage.getItem('comics_type'));
            if (!this.comics_type) {
                this.fetchTypes();
            }
            
            console.log(this.dataUserTotalChaps);
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
            this.fetchTypes();
            this.fetchComicCompletes();
            this.fetchComicUpdates();
        }

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
            const comicSlug = urlParams.get('name');
            const comicId = urlParams.get('id');
            const comicNumber = parseInt(urlParams.get('num'), 10)
            const chapterName = urlParams.get('chapter-name');
            if (this.isLogin && comicNumber !== this.comicNumber) {
                this.addTotalchaps();
            }
            if (comicSlug) {
                console.log(comicId)
                console.log(comicNumber)
                this.comicSlug = comicSlug;
                this.comicNumber = comicNumber;
                this.chapterName = chapterName;
                this.fetchComicDetails(comicSlug);
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
