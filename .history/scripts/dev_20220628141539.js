const args = require("minimist")(process.argv.slice(2));

console.log(args)

const target = args._[0] || 'reactivity'