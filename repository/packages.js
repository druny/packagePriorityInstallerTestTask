const mockedPackages = require('./mockedPackages');

const Packages = {
  getPackages() {
    return mockedPackages.dependencies;
  },
  getCycleDependenciesPackages() {
    return mockedPackages.cycleDependencies;
  }
};

module.exports = Packages;
