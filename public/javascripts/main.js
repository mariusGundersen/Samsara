(function () {
  var cacheKey = document
    .querySelector("meta[name=cachebust]")
    .getAttribute("content");

  require.config({
    baseUrl: "/javascripts",
    urlArgs: "cacheKey=" + cacheKey,

    paths: {
      bower_components: "/bower_components",
      io: "/socket.io/socket.io",
    },

    chain: {
      knockout: [
        "bower_components/knockout/build/output/knockout-latest",
        "customBindings/spinIcon",
        "customBindings/selectable",
        "customBindings/followProgress",
      ],
    },

    packages: [
      { name: "deco", location: "/bower_components/decojs/Dist", main: "deco" },
    ],
  });

  require(["deco", "knockout"], function (deco, ko) {
    ko.options.deferUpdates = true;
    deco
      .config({
        qvc: {
          cacheKey: cacheKey,
        },
      })
      .start();
  });
})();
