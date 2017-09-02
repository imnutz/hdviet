var page = require('showtime/page'),
    io = require('native/io'),
    fs = require('native/fs'),
    http = require('showtime/http'),
    service = require('showtime/service'),
    html = require('showtime/html'),
    cache = require('showtime/store').create('cache');

var common = require('./common');

var state = require('./state'),
    model = require('./model'),
    action = require('./action'),
    renderer = require('./renderer'),
    hdvietService = require('./service'),
    container = require('./container');

var UA = 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:15.0) Gecko/20100101 Firefox/15.0.1';

io.httpInspectorCreate(common.baseUrl + '/.*', function (ctrl) {
    ctrl.setHeader('User-Agent', UA);
    return 0;
});

if (!cache.recent) {
    cache.recent = [];
}

// Wiring components
hdvietService.http = http;
hdvietService.html = html;

container.init(state, action, model, renderer);
container.setServices({
    service: hdvietService,
    searchCache: cache
});
container.setConfigs({
    baseUrl: common.config.baseUrl,
    prefix: common.config.prefix,
    ops: common.constants,
    utils: common.utils
});


// Create plugin
service.create('myhdviet', [common.config.prefix, ':start'].join(''), 'video', true, [Plugin.path, 'logo.png'].join(''));

// Adding routes
new page.Route([common.config.prefix, ':start'].join(''), function(page) {
    container.dispatch('start', page);
});

new page.Route([common.config.prefix, ':category:(.*)'].join(''), function (page, category) {
    page.type = 'directory';
    page.asyncPaginator = container.dispatch.bind(container, 'doPaging', page, category);

    container.dispatch('selectCategory', page, category);
});

new page.Route([common.config.prefix, ":movie:([^:]+):([^:]+)"].join(''), function(page, movie, title) {
    container.dispatch('selectMovie', page, movie, title);
});

new page.Route([common.config.prefix, ':video:([^:]+):([^:]+):([^:]+)'].join(''), function(page, movie, seq, title) {
    container.dispatch('selectEpisode', movie, seq, title);
});

new page.Route([common.config.prefix, ':search:(.*)'].join(''), function(page, query) {
    page.type = 'directory';

    page.asyncPaginator = container.dispatch.bind(container, 'doSearchPaging', page, query);

    container.dispatch('search', page, query);
});

new page.Route([common.config.prefix, ':search:movie:([^:]+):([^:]+)'].join(''), function(page, movie, title) {
    container.dispatch('selectMovie', page, movie, title);
});
