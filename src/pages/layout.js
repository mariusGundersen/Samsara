import react from "react-dom/server";

const cachebust = new Date().toISOString().replace(/[^0-9]/g, "");

export default (title = null, ...panes) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="cachebust" content="${cachebust}" />
  <title>${title}${title ? " - " : ""}Samsara</title>
  <link rel="stylesheet" href="/bower_components/purecss/build/pure-min.css?cachebust=${cachebust}" />
  <link rel="stylesheet" href="/stylesheets/style.css?cachebust=${cachebust}" />
  <link rel="stylesheet" href="/bower_components/font-awesome/css/font-awesome.min.css?cachebust=${cachebust}">
</head>
<body>

  ${panes.map(react.renderToString)}

  <script src="/javascripts/sidemenu.js?cachebust=${cachebust}"></script>
  <script src="/bower_components/requirejs/bin/r.js?cachebust=${cachebust}" data-main="/javascripts/main.js?cachebust=${cachebust}"></script>
  <script src="/javascripts/chain.js?cachebust=${cachebust}"></script>
</body>
</html>`;
