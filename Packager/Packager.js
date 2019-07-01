const { DEPENDENCIES_CYCLE_ERROR_MESSAGE, WRONG_INPUT_DATA_ERROR_MESSAGE } = require('./constants');

class Packager {
  constructor(packages) {
    this.packages = packages;

    this.checkedPackages = new Set();
    this.packagesInstallFlow = new Set();
    this.packagesDependencies = new Map();
  }

  static parseDependencies(dependency) {
    return dependency.split(':')
      .map((element) => element.trim())
      .filter((element) => element);
  }

  static setDependencies(packages, packagesDependencies) {
    const isPackagesTypeObject = typeof packages === 'object';

    if (!isPackagesTypeObject) throw new TypeError(WRONG_INPUT_DATA_ERROR_MESSAGE);

    return packages
      .map(Packager.parseDependencies)
      .map(([dependent, subject]) => {
        if (packagesDependencies.has(dependent)) {
          const existedDependencies = packagesDependencies.get(dependent);

          packagesDependencies.set(dependent, Array(subject, ...existedDependencies));
        } else {
          packagesDependencies.set(dependent, Array(subject))
        }

        return packagesDependencies.get(dependent);
      });
  }

  managePackageDependedncies(packageDependencies, dependent) {
    const subjects = packageDependencies.get(dependent);

    subjects.forEach((subject) => {
      if (this.checkedPackages.has(subject)) throw new Error(DEPENDENCIES_CYCLE_ERROR_MESSAGE);

      if (!this.packagesInstallFlow.has(dependent) && subject) {
        this.checkedPackages.add(subject);
        this.managePackageDependedncies(packageDependencies, subject);
      }

      if (!subject || this.packagesInstallFlow.has(subject)) {
        this.packagesInstallFlow.add(dependent);
        this.checkedPackages.clear();
      }
    });
  }

  buildFlow(packageDependencies) {
    for (let [dependent] of packageDependencies.entries()) {
      this.managePackageDependedncies(packageDependencies, dependent);
    }

    return this.packagesInstallFlow;
  }

  parsePackagesInstallFlow() {
    return [...this.packagesInstallFlow].join(", ");
  }

  exec() {
    const { packages, packagesDependencies } = this;

    Packager.setDependencies(packages, packagesDependencies);
    this.buildFlow(packagesDependencies);


    return this.parsePackagesInstallFlow();
  }
}

module.exports = Packager;
