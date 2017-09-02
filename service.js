module.exports = {
    loadPage: function loadPage(url) {
        var result = this.http.request(url);

        return this._populateResults(this.html.parse(result));
    },

    _populateResults: function _populateResults(dom) {
        var movieElements,
            pagingListElements,
            movies = [],
            backdrop,
            tooltip,
            link,
            img,
            pages,
            length,
            domElement,
            movieId;

        movieElements = dom.root.getElementByClassName('box-movie-list')[0].getElementByClassName('mov-item');
        length = movieElements.length;

        for (var i = 0; i < length; i++) {
            domElement = movieElements[i];

            backdrop = domElement.getElementByClassName('backdropimg')[0];
            tooltip = domElement.getElementByClassName('tooltipthumb2')[0];

            link = backdrop.getElementByTagName('a')[0].attributes.getNamedItem('href');
            img = backdrop.getElementByTagName('img')[0];

            movieId = tooltip.getElementByClassName('icon-infomovie')[0].attributes.getNamedItem('data-id');

            movies.push({
                path: link.value.replace([ this.baseUrl, '/' ].join(''), ''),
                title: img.attributes.getNamedItem('title').value,
                image: img.attributes.getNamedItem('src').value,
                movieId: Number(movieId.value)
            });
        }
        // paging element

        pagingListElements = dom.root.getElementByClassName('paginglist');
        if (pagingListElements && pagingListElements.length) {
            pages = pagingListElements[0].getElementByTagName('a');
        }

        return {
            movies: movies,
            pageCount: (pages && pages[pages.length - 1].textContent) || "0"
        };

    },

    loadMovieInfo: function loadMovieInfo(url) {
        var response = this.http.request(url);

        return JSON.parse(response);
    },

    playInfo: function playInfo(url, movieId, seq) {
        var options = {
            args: {
                movieid: movieId,
                sequence: seq
            },
            noFail: true,
            compression: true,
            caching: true
        };
        var response = this.http.request(url, options);

        return JSON.parse(response);
    },

    search: function search(url, opts) {
        var result;
        var options = {
            args: {
                keyword: opts.keyword,
                page: opts.page
            }
        };

        result = this.http.request(url, options);

        return this._populateResults(this.html.parse(result));
    }
};
