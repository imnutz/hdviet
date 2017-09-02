var container = {
    state: null,
    action: null,
    model: null,
    renderer: null,

    intents: {
        'start': 'start',
        'selectCategory': 'selectCategory',
        'selectMovie': 'selectMovie',
        'selectEpisode': 'selectEpisode',
        'doPaging': 'doPaging',
        'search': 'search',
        'doSearchPaging': 'doSearchPaging'
    },

    init: function init(state, action, model, renderer) {
        this.state = state;
        this.action = action;
        this.model = model;
        this.renderer = renderer;

        this._wireComponents();
    },

    _wireComponents: function _wireComponents() {
        this.model.represent = this.state.represent.bind(this.state);
        this.action.present = this.model.present.bind(this.model);

        this.state.renderer = this.renderer;
        this.state.action = this.action;
    },

    setServices: function setServices(services) {
        for (var key in services) {
            if (!this.model.hasOwnProperty(key)) {
                this.model[key] = services[key];
            }
        }
    },

    setConfigs: function setConfigs(config) {
        this.model.baseUrl = config.baseUrl;
        this.model.prefix = config.prefix;
        this.model.ops = config.ops;
        this.model.utils = config.utils;

        this.action.ops = config.ops;
        this.action.utils = config.utils;

        this.state.ops = config.ops;
        this.state.utils = config.utils;

        this.renderer.prefix = config.prefix;
    },

    dispatch: function dispatch(action) {
        var args = [].slice.call(arguments).slice(1),
            intent = this.intents[action];

        this.action[intent].apply(this.action, args);
    }
};

module.exports = container;
