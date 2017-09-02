module.exports.config = {
    baseUrl: 'http://movies.hdviet.com',
    prefix: 'hd-viet'
};

module.exports.constants = {
    START_OP: 'start',
    FINISH_LOADING_OP: 'finishLoading',
    LOADING_CATEGORY_OP: 'loadingCategory',
    FETCH_CATEGORY_ITEMS_OP: 'fetchCategoryItems',
    SELECT_MOVIE_OP: 'selectMovie',
    SELECT_EPISODE_OP: 'selectEpisode',
    LOADING_PAGING_OP: 'loadingPaging',
    FETCH_CATEGORY_PAGING_ITEMS_OP: 'fetchPagingItemsForCategory',
    LOADING_SEARCHING_OP: 'loadingSearch',
    FETCH_SEARCH_ITEMS_OP: 'fetchSearchItems'
};

module.exports.utils = {
    operationIs: function operationIs(pageOperation) {
        return function check(operation) {
            return pageOperation === operation;
        }
    }
};
