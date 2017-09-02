var SEARCH_PAGE_URL = '/tim-kiem.html',
    MOVIE_JSON_URL = '/get_movie_play_json',
    EPISODES_URL = '/lay-danh-sach-tap-phim.html?id=';

var categories = {
    'phim-le': 'Mới nhất',
    'phim-hdviet-de-cu': 'Phim HDViệt Đề Cử',
    'phim-thuyet-minh': 'Phim Thuyết Minh',
    'phim-chieu-rap': 'Phim Chiếu Rạp',
    'phim-au-my': 'Phim Âu Mỹ',
    'phim-chau-a': 'Phim Châu Á',
    'phim-kinh-di': 'Phim Kinh Dị',
    'phim-gia-dinh': 'Phim Gia Đình',
    'phim-lich-su': 'Phim Lịch Sử',
    'phim-tai-lieu': 'Phim Tài Liệu',
    'phim-hoat-hinh': 'Hoạt Hình',
    'phim-tam-ly': 'Tâm Lý',
    'phim-tinh-cam': 'Tình Cảm',
    'phim-hai': 'Hài Hước',
    'phim-vo-thuat': 'Võ Thuật',
    'phim-hanh-dong-phieu-luu': 'Hành động Phiêu lưu',
    'phim-khoa-hoc-vien-tuong': 'Khoa học Viễn tưởng',
    'phim-hinh-su-toi-pham': 'Hình sự Tội phạm',
    'phim-chien-tranh': 'Phim Chiến Tranh',
    'phim-am-nhac': 'Phim Âm Nhạc'
};

var series = {
    'phim-bo': 'Mới nhất',
    'phim-bo-hdviet-de-cu': 'Phim HDViệt Đề Cử',
    'phim-bo-thuyet-minh': 'Phim Thuyết Minh',
    'phim-bo-au-my': 'Âu Mỹ',
    'phim-bo-hong-kong': 'Hồng Kông',
    'phim-bo-trung-quoc': 'Trung Quốc',
    'phim-bo-han-quoc': 'Hàn Quốc',
    'phim-bo-cac-nuoc-khac': 'Các nước khác'
}

function createCategories(categoriesInfo, prefix) {
    var categories = [];
    for (var cat in categoriesInfo) {
        categories.push({
            path: [ prefix, ':category:', cat ].join(''),
            type: 'directory',
            title: categoriesInfo[cat]
        })
    }

    return categories;
}

function getCategoryTitle(key) {
    return categories[key];
}

module.exports = {
    movieCategories: null,
    serieCategories: null,
    prefix: 'hd-viet',
    movieTitle: 'Phim lẻ',
    searchTitle: 'Tìm kiếm',
    seriesTitle: 'Phim bộ',
    pageInfo: {},

    onStart: false,

    atPage: null,
    categoryTitle: null,

    movieInfo: null,

    selectedCategory: null,
    selectedMovieId: null,

    offset: 1,

    pageOperation: null,

    present: function present(proposal) {
        var model = this,
            operationIs = this.utils.operationIs(proposal.pageOperation);

        this.selectedMovieId = proposal.selectedMovieId;
        this.selectedCategory = proposal.selectedCategory;
        this.selectedEpisode = proposal.selectedEpisode;
        this.pageOperation = proposal.pageOperation;

        this.atPage = proposal.page;

        if (operationIs(this.ops.START_OP)) {
            this.movieCategories = createCategories(categories, this.prefix);
            this.serieCategories = createCategories(series, this.prefix);

            return this.represent(this);
        }

        if (operationIs(this.ops.FINISH_LOADING_OP) ||
            operationIs(this.ops.LOADING_PAGING_OP)) {
            return this.represent(this);
        }

        if (operationIs(this.ops.LOADING_CATEGORY_OP)) {
            this.categoryTitle = getCategoryTitle(this.selectedCategory);

            return this.represent(this);
        }

        if (operationIs(this.ops.FETCH_CATEGORY_ITEMS_OP) ||
            operationIs(this.ops.FETCH_CATEGORY_PAGING_ITEMS_OP)) {
            if (proposal.isPaging) {
                this.offset += 1;
            } else {
                this.offset = proposal.offset;
            }

            var pageInfo = this.service.loadPage(this._getCategoryUrl(proposal.selectedCategory, this.offset));

            this.pageInfo.movies = pageInfo.movies.map(function(movie) {
                return {
                    path: [ model.prefix, ':movie:', movie.movieId, ':', movie.title ].join(''),
                    type: 'video',
                    title: movie.title,
                    image: movie.image
                }
            });
            this.pageInfo.pageCount = pageInfo.pageCount;
            this.isPaging = proposal.isPaging;

            return this.represent(this);
        }

        if (operationIs(this.ops.SELECT_MOVIE_OP)) {
            var playInfo,
                movieInfo = this.service.loadMovieInfo(this._getMovieUrl(proposal.selectedMovieId)),
                sequence = movieInfo.Sequence,
                episodes = [];

            // series
            if (Number(sequence)) {
                for (var i = 1; i <= Number(sequence); i++) {
                    episodes.push({
                        path: [ this.prefix, ':video:', this.selectedMovieId, ':', i, ':', proposal.movieTitle ].join(''),
                        title: [ 'Tập ', i ].join('')
                    });
                }

                this.movieInfo = {
                    type: 'series',
                    episodes: episodes,
                    itemType: 'video',
                    changeDir: proposal.isSearchMovie,
                    title: proposal.movieTitle
                };
            } else {
                playInfo = this.service.playInfo(this._getPlayUrl(), this.selectedMovieId, sequence);
                playInfo.seq = sequence;

                this.movieInfo = {
                    type: 'single',
                    playInfo: playInfo,
                    title: proposal.movieTitle
                };
            }

            return this.represent(this);
        }

        if (operationIs(this.ops.SELECT_EPISODE_OP)) {
            var episodeInfo = this.service.playInfo(this._getPlayUrl(), this.selectedEpisode, proposal.seq);
            episodeInfo.seq = proposal.seq;

            this.movieInfo = {
                playInfo: episodeInfo
            };

            return this.represent(this);
        }

        if (operationIs(this.ops.LOADING_SEARCHING_OP)) {
            this.searchTerm = proposal.searchTerm;

            return this.represent(this);
        }

        if (operationIs(this.ops.FETCH_SEARCH_ITEMS_OP)) {
            var searchResult = this.service.search([ this.baseUrl, SEARCH_PAGE_URL ].join(''), {
                keyword: proposal.searchTerm,
                page: 1
            });

            this.pageInfo.movies = searchResult.movies.map(function(movie) {
                return {
                    path: [ model.prefix, ':search:movie:', movie.movieId, ':', movie.title ].join(''),
                    type: 'video',
                    title: movie.title,
                    image: movie.image
                }
            });
            this.atPage = proposal.page;
            this.pageInfo.pageCount = searchResult.pageCount;

            return this.represent(this);
        }
    },

    _getCategoryUrl: function _getCategoryUrl(category, offset) {
        return [ this.baseUrl, this._createCategoryUrl(category, offset) ].join('');
    },

    _getMovieUrl: function _getMovieUrl(movieId) {
        return [ this.baseUrl, this._createMovieUrl(movieId) ].join('');
    },

    _getPlayUrl: function _getPlayUrl() {
        return [ this.baseUrl, MOVIE_JSON_URL ].join('')
    },

    _createCategoryUrl: function _createCategoryUrl(category, offset) {
        return [ '/', category, '/trang-', offset, '.html'].join('')
    },

    _createMovieUrl: function _createCategoryUrl(movieId) {
        return [ EPISODES_URL, movieId ].join('');
    }
}
