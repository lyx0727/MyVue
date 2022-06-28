const args = require("minimist")(process.argv.slice(2));

const target = args._[0] || 'reactivity';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// life 立即执行函数 (function(){})()
// cjs node中的模块 module.exports
// esm 浏览器中的esModule模块 import
format = format.startsWith('global') ? 'life' : format === 'cjs' ? 'cjs' : 'esm';

const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`) 

import { build } from "esbuild";
build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,   // 所有打包到一起
    sourcemap: true,
    format,
    globalName: pkg.buildOptions?.name
})