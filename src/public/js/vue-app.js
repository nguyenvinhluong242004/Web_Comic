// vue-app.js
new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        DOMAIN: 'https://web-comic-3.onrender.com/',
        //DOMAIN: 'http://localhost:8888/',
        domain_image: 'https://img.otruyenapi.com',
        domain_cdn_read: '',
        middle_domain: '/uploads/comics/',
        comics_update: [],
        comics_search_result: [],
        imgage_comics: [],
        comic_detail: [],
        comic_detail_chaps: [],
        comicName: '',
        comicNumber: 1,
        comicID: '',
        imgs_comic: [],
        imgs_path: '',

        per_page: 12,
        total_page: 1,
        page: 1,

    },
    methods: {
        fetchComics() {
            fetch('https://otruyenapi.com/v1/api/home')
                .then(response => response.json())
                .then(data => {
                    this.comics_update = data.data.items;
                    this.imgage_comics = data.data.seoOnPage.og_image;
                    console.log(this.comics_update[0].name);
                    console.log(data);
                    this.total_page = Math.ceil(this.comics_update.length / this.per_page);
                    this.page = 1;

                    console.log(this.total_page);
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
                    // Lưu lại vào localStorage
                    localStorage.setItem('comic_detail_chaps', JSON.stringify(this.comic_detail_chaps));
                    localStorage.setItem('comicName', JSON.stringify(this.comicName));


                    console.log(this.comic_detail_chaps)
                    console.log(this.domain_image + '/uploads/comics/' + this.comic_detail.thumb_url)
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

                    this.comic_detail_chaps = JSON.parse(localStorage.getItem('comic_detail_chaps'));
                    this.comicName = JSON.parse(localStorage.getItem('comicName'));
                    this.comicNumber = JSON.parse(localStorage.getItem('comicNumber'));



                    console.log(this.comic_detail_chaps);
                    console.log(this.comicName);
                    console.log(this.comicNumber);
                    //this.imgs_comic = [];
                    // if (Array.isArray(data.data.item.chapter_image)) {
                    //     data.data.item.chapter_image.forEach(element => {
                    //         const dataTemp = {
                    //             image_file: element.image_file,
                    //             image_path: element.image_path,
                    //         }

                    //         this.imgs_comic.push(dataTemp);
                    //     });
                    // }
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        searchComic() {
            if ($('#txtInput').val().trim()) {
                console.log($('#txtInput').val())
                window.location.href = `/search?keyword=${encodeURIComponent($('#txtInput').val()).replace(/%20/g, "+")}`;
            } else {
                alert("Vui lòng nhập từ khóa tìm kiếm!");
            }
        },
        fetchComicSearchs(key_word) {
            // Fetch thông tin chi tiết của truyện từ backend
            fetch(`https://otruyenapi.com/v1/api/tim-kiem?keyword=${key_word}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.comics_search_result = data.data.items;
                    this.imgage_comics = data.data.seoOnPage.og_image;

                    
                    this.total_page = Math.ceil(this.comics_search_result.length / this.per_page);
                    this.page = 1;
                    
                })
                .catch(error => console.error('Error fetching comic details:', error));
        },
        changeCurrentPage(event){
            let idx = event.currentTarget.textContent.trim();
            if (idx === "«") {
                console.log("pre");
                if (this.page > 1) {
                    this.page--;
                }
            }
            else if (idx === "»") {
                console.log("next");
                if (this.page < this.total_page) {
                    this.page++;
                }
            }
            else {
                console.log(idx);
                if (this.page === idx) {
                    return;
                }
                this.page = idx;
            }
        }
    },
    mounted() {
        // Fetch danh sách truyện khi trang được tải
        if (window.location.pathname === '/') {
            this.fetchComics();
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
            const comicNumber = urlParams.get('num'); 
            if (comicId) {
                console.log(comicId)
                console.log(comicNumber)
                this.comicNumber = comicNumber;
                // Lưu lại vào localStorage
                localStorage.setItem('comicNumber', JSON.stringify(this.comicNumber));
                this.fetchComicReads(comicId);  
            }
        }

        if (window.location.pathname === '/search') {
            const urlParams = new URLSearchParams(window.location.search);
            const comicNameSearch = urlParams.get('keyword');  
            if (comicNameSearch) {
                console.log(comicNameSearch)
                this.fetchComicSearchs(comicNameSearch); 
            }
        }

    },
});
