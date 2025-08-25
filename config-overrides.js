const path = require('node:path');
const appVersion = require(path.join(process.cwd(), 'package.json')).version;


module.exports = {
    webpack: (config, env) => {
        console.log("> webpack_stage\n")
        // Your custom webpack here
        config.output.filename = `static/js/[name].v${appVersion}_[contenthash].js`
        return config;
    }
}