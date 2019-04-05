const path = require('path');
const solc = require('solc');
const fs = require('fs-extra'); //improved version of fs (file system) module 

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); //extra func, looks in given folder and deletes everything inside of it

const campaignPath = path.resolve(__dirname, 'contracts', 'CharityInitiative.sol');
const source = fs.readFileSync(campaignPath, 'utf8'); //content of file
const output = solc.compile(source, 1).contracts; // complied source, we only need contracts property

fs.ensureDirSync(buildPath); // make sure that build directory is createt again

console.log(output);
// output has 2 parts - for our 2 contracts
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  );
}