(function () {
  var _config = require.config;

  require.config = function (config) {
    if ("chain" in config) {
      for (var key in config.chain) {
        var chain = config.chain[key].concat(["*"]);

        var map = config.map || {};

        for (var i = 0; i + 1 < chain.length; i++) {
          var current = chain[i];
          var next = chain[i + 1];
          map[next] = map[next] || {};
          map[next][key] = current;
        }

        config.map = map;
      }
    }

    _config(config);
  };
})();
