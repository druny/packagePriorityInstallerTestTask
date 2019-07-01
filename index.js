const { Packager } = require('./Packager');
const { PackagesRepository } = require('./repository');

const PackagerBuilder = new Packager(PackagesRepository.getPackages());

console.log('\x1b[32m%s\x1b[0m', PackagerBuilder.exec());
