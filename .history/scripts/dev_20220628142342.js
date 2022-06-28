const args = require("minimist")(process.argv.slice(2));

console.log(args)

const target = args._[0] || 'reactivity';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// life 立即执行函数 (function(){})()
// cjs node中的模块 module.exports
// esm 浏览器中的esModule模块 import
const outputFormat = format.startsWith('global') ? 'life' : format === 'cjs' ? 'cjs' : 'esm';

const outputFile = resolve(__dirname, `../packages/${target}/`) 