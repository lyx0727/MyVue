const args = require('minimist')(process.argv.slice(2));
const {resolve} = require('path');
let target = args._[0] || 'reactivity';
let format = args.f || 'global';

let pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// iife 立即执行函数 (function(){})()
// cjs node中的模块 module.exports
// esm 浏览器中的esModule模块 import


let outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`) 

format = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm';

const { build } = require('esbuild');

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,   // 所有打包到一起
    sourcemap: true,
    format,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {    // 监控文件变化
        onRebuild(error){
            if(!error){
                console.log(`rebuilt~~`);
            }
        }
    }
}).then(()=>{
    console.log(`watching~~`);
})