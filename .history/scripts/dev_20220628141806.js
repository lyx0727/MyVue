const args = require("minimist")(process.argv.slice(2));

console.log(args)

const target = args._[0] || 'reactivity';
const format = args.f || 'global';

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// life 立即执行函数
const outputFormat = format.startWith('global') ? 'life' : format === 'cjs' ? 'cjs' : 'esm';