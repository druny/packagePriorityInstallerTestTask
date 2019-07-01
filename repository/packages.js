const mockedPackages = require('./mockedPackages');

/**
 * Because of it's test task
 * I neglected that repository uses for test purpose
* */
const Packages = {
  getPackages() {
    return mockedPackages.dependencies;
  },

  getCycleDependenciesPackages() {
    return mockedPackages.cycleDependencies;
  }
};

module.exports = Packages;
