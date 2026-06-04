const path = require('node:path');
const appVersion = require(path.join(process.cwd(), 'package.json')).version;


module.exports = {
    webpack: (config, env) => {
        console.log("> webpack_stage\n")
        config.output.filename = `static/js/[name].v${appVersion}_[contenthash].js`

        // Exclude node_modules from source-map-loader to prevent ENOENT errors
        // caused by packages with source maps referencing deduped/nested deps
        const sourceMapRule = config.module.rules.find(
            (r) => r.loader && r.loader.includes('source-map-loader')
        );
        if (sourceMapRule) {
            sourceMapRule.exclude = [/node_modules/];
        }

        return config;
    }
}