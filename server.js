const { createServer } = require('http');
const next = require('next'); //next helper to configure app instance

const app = next({ // we pass configuration object to next and it has single propery od dev, and it specifies weather we are running server on production or development mode
  dev: process.env.NODE_ENV !== 'production', // tells our app to look at global variable NODE_ENV and see if it is set to production 
  conf: {
    webpack: config => {
      config.devtool = false;

      for (const r of config.module.rules) {
        if (r.loader === 'babel-loader') {
          r.options.sourceMaps = false;
        }
      }

      return config;
    }
  }
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => { // set app to listen on specific port
  createServer(handler).listen(3000, err => {
    if (err) throw err;
    console.log('Ready on localhost:3000');
  });
});