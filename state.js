module.exports = {
    represent: function represent(model) {
        var operationIs = this.utils.operationIs(model.pageOperation);

        if (operationIs(this.ops.START_OP)) {
            this.renderer.renderLanding(
                model.atPage,
                {
                    searchTitle: model.searchTitle,
                    movieTitle: model.movieTitle,
                    seriesTitle: model.seriesTitle,
                    appTitle: model.appTitle,
                    movieCategories: model.movieCategories,
                    serieCategories: model.serieCategories,
                    searchTerms: model.searchCache.recent,
                    recentSearchTitle: model.getRecentSearchTitle()
                }
            );
        }

        if (operationIs(this.ops.LOADING_CATEGORY_OP) ||
            operationIs(this.ops.LOADING_SEARCHING_OP) ||
            operationIs(this.ops.LOADING_PAGING_OP) ||
            operationIs(this.ops.LOADING_SEARCH_PAGING_OP)) {
            var isSearching = operationIs(this.ops.LOADING_SEARCHING_OP) || operationIs(this.ops.LOADING_SEARCH_PAGING_OP);

            this.renderer.loading(model.atPage, isSearching ? model.searchTerm : '');
        }

        if (operationIs(this.ops.FINISH_LOADING_OP)) {
            this.renderer.stopLoading(model.atPage);
        }

        if (operationIs(this.ops.FETCH_CATEGORY_ITEMS_OP) ||
            operationIs(this.ops.FETCH_CATEGORY_PAGING_ITEMS_OP)) {
            if (model.isPaging) {
                if (model.offset > model.pageInfo.pageCount) {
                    this.renderer.stopPagination(model.atPage);
                } else {
                    this.renderer.addMoreItems(model.atPage, model.pageInfo.movies, model.offset, model.pageInfo.pageCount);
                }
            } else {
                this.renderer.renderMoviesPage(model.atPage, model.categoryTitle, model.pageInfo.movies);
            }
        }

        if (operationIs(this.ops.SELECT_MOVIE_OP)) {
            if (model.movieInfo.type === 'single') {
                this.renderer.playback(model.atPage, model.selectedMovieId, model.movieInfo.playInfo, model.movieInfo.title);
            } else {
                this.renderer.renderEpisodes(model.atPage, model.movieInfo);
            }
        }

        if (operationIs(this.ops.SELECT_EPISODE_OP)) {
            this.renderer.playback(model.atPage, model.selectedEpisode, model.movieInfo.playInfo);
        }

        if (operationIs(this.ops.FETCH_SEARCH_ITEMS_OP) ||
            operationIs(this.ops.FETCH_SEARCH_PAGING_ITEMS_OP)) {

            if (model.isPaging && model.searchOffset > model.pageInfo.pageCount) {
                    this.renderer.stopPagination(model.atPage);
            } else {
                this.renderer.renderMoviesPage(model.atPage, model.categoryTitle, model.pageInfo.movies);
            }
        }

        this.nextAction(model);
    },

    nextAction: function nextAction(model) {
        var operationIs = this.utils.operationIs(model.pageOperation);

        if (operationIs(this.ops.LOADING_SEARCHING_OP)) {
            return this.action.doSearching(model.atPage, model.searchTerm);
        }

        if (operationIs(this.ops.LOADING_PAGING_OP)) {
            return this.action.fetchPagingItems(model.atPage, model.selectedCategory);
        }

        if (operationIs(this.ops.LOADING_CATEGORY_OP)) {
            return this.action.fetchCategoryItems(model.atPage, model.selectedCategory);
        }

        if (operationIs(this.ops.LOADING_SEARCH_PAGING_OP)) {
            return this.action.fetchSearchPagingItems(model.atPage, model.searchTerm);
        }

        if (operationIs(this.ops.FETCH_CATEGORY_ITEMS_OP) ||
            operationIs(this.ops.FETCH_SEARCH_ITEMS_OP) ||
            operationIs(this.ops.FETCH_CATEGORY_PAGING_ITEMS_OP) ||
            operationIs(this.ops.FETCH_SEARCH_PAGING_ITEMS_OP)) {
            return this.action.stopLoading(model.atPage);
        }
    }
};
