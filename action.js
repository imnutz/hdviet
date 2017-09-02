module.exports = {
    start: function start(page) {
        this.present({
            pageOperation: this.ops.START_OP,
            page: page
        });
    },

    stopLoading: function stopLoading(page) {
        this.present({
            pageOperation: this.ops.FINISH_LOADING_OP,
            page: page
        });
    },

    selectCategory: function selectCategory(page, category) {
        this.present({
            selectedCategory: category,
            page: page,
            pageOperation: this.ops.LOADING_CATEGORY_OP
        });
    },

    fetchCategoryItems: function fetchCategoryItems(page, selectedCategory) {
        this.present({
            selectedCategory: selectedCategory,
            pageOperation: this.ops.FETCH_CATEGORY_ITEMS_OP,
            offset: 1,
            page: page
        })
    },

    selectMovie: function selectMovie(page, movieId, title) {
        this.present({
            selectedMovieId: movieId,
            page: page,
            movieTitle: title,
            pageOperation: this.ops.SELECT_MOVIE_OP
        });
    },

    selectEpisode: function selectEpisode(page, movieId, seq, title) {
        this.present({
            selectedEpisode: movieId,
            page: page,
            seq: seq,
            movieTitle: title,
            pageOperation: this.ops.SELECT_EPISODE_OP
        });
    },

    doPaging: function doPaging(page, category) {
        this.present({
            page: page,
            selectedCategory: category,
            pageOperation: this.ops.LOADING_PAGING_OP
        });
    },

    fetchPagingItems: function fetchPagingItems(page, category) {
        this.present({
            selectedCategory: category,
            page: page,
            pageOperation: this.ops.FETCH_CATEGORY_PAGING_ITEMS_OP,
            isPaging: true
        });
    },

    search: function search(page, searchTerm) {
        this.present({
            searchTerm: searchTerm,
            page: page,
            pageOperation: this.ops.LOADING_SEARCHING_OP
        });
    },

    doSearching: function doSearching(page, searchTerm) {
        this.present({
            searchTerm: searchTerm,
            page: page,
            searchOffset: 1,
            pageOperation: this.ops.FETCH_SEARCH_ITEMS_OP
        });
    },

    doSearchPaging: function doSearchPaging(page, searchTerm) {
        this.present({
            pageOperation: this.ops.LOADING_SEARCH_PAGING_OP,
            page: page,
            searchTerm: searchTerm
        });
    },

    fetchSearchPagingItems: function fetchSearchPagingItems(page, searchTerm) {
        this.present({
            pageOperation: this.ops.FETCH_SEARCH_PAGING_ITEMS_OP,
            page: page,
            searchTerm: searchTerm,
            isPaging: true
        });
    }
};
