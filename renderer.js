module.exports = {
    loading: function loading(page, searchTerm) {
        if (searchTerm) {
            page.metadata.title = [ 'Đang tìm phim: ', searchTerm ].join('');
        }
        page.loading = true;
    },

    renderLanding: function renderLanding(page, searchTitle, movieTitle, seriesTitle, movieCategories, serieCategories) {
        page.type = 'directory';
        page.metadata.title = 'HDVIET';

        page.appendItem([ this.prefix, ':search:' ].join(''), 'search',  { title: searchTitle });

        page.appendItem('', 'separator', { title: movieTitle });
        movieCategories.forEach(function(category) {
            page.appendItem(category.path, category.type, { title: category.title });
        });

        page.appendItem('', 'separator', { title: seriesTitle });
        serieCategories.forEach(function(category) {
            page.appendItem(category.path, category.type, { title: category.title });
        });
    },

    renderMoviesPage: function renderMoviesPage(currentPage, title, movies) {
        currentPage.metadata.title = title;

        movies.forEach(function(movie) {
            currentPage.appendItem(movie.path, movie.type, {
                title: movie.title,
                icon: movie.image
            });
        });

        currentPage.haveMore(true);
    },

    stopPagination: function stopPagination(page) {
        page.haveMore(false);
    },

    addMoreItems: function addMoreItems(currentPage, movies, offset, pageCount) {
        movies.forEach(function(movie) {
            currentPage.appendItem(movie.path, movie.type, {
                title: movie.title,
                icon: movie.image
            });
        });
        currentPage.haveMore(true);
    },

    playback: function playback(page, movieId, playInfo, title) {
        var videoParams;

        page.type = 'video';

        if (!playInfo.error) {
            videoParams = {
                title: [ 'Playing...', title ].join(''),
                no_fs_scan: true,
                no_subtitle_scan: true,
                sources: [
                    {
                        url: playInfo.data.playList.replace('playlist.m3u8', 'playlist_h.m3u8')
                    }
                ],
                subtitles: playInfo.data.subtitle.map(function(sub) {
                    return {
                        title: sub.label,
                        url: sub.source,
                        language: sub.source.match(/_(eng|vie).srt/i)[1]
                    }
                })
            };

            page.source = [ 'videoparams:', JSON.stringify(videoParams) ].join('');
        } else {
            if (page) page.error(playInfo.data);
        }
    },

    renderEpisodes: function renderEpisodes(page, episodeInfo) {
        page.type = 'directory';
        page.metadata.title = episodeInfo.title;

        episodeInfo.episodes.forEach(function(esp) {
            page.appendItem(esp.path, episodeInfo.itemType, {
                title: esp.title
            });
        });
    },

    stopLoading: function stopLoading(page) {
        page.loading = false;
    }
};
