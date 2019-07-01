const assert = require('assert');

const Packager = require('./Packager');
const { PackagesRepository } = require('../repository');
const {
  HAS_NOT_PARSED_DATA,
  WRONG_INPUT_DATA_ERROR_MESSAGE,
  DEPENDENCIES_CYCLE_ERROR_MESSAGE,
}  = require('./constants');

const SUCCEED_RESULT_COLOR = '\x1b[36m%s\x1b[0m';

const getSucceedLog =
  (methodName) => console.log(SUCCEED_RESULT_COLOR, `[${methodName}]`, 'DONE');

const PackagerSpec = {
  wrongInput() {
    const methodName = this.wrongInput.name;
    const mockedWrongData = '';
    const PackagerBuilder = new Packager(mockedWrongData);

    try {
      PackagerBuilder.exec();

      throw new Error(`[${methodName}] got wrong input`);
    } catch ({ message }) {
      assert.deepEqual(message, WRONG_INPUT_DATA_ERROR_MESSAGE);

      getSucceedLog(methodName);
    }
  },

  hasNotParsedData() {
    const methodName = this.hasNotParsedData.name;
    const mockedWrongData = '';
    const PackagerBuilder = new Packager(mockedWrongData);

    try {
      PackagerBuilder.buildFlow();

      throw new Error(`[${methodName}] data has not parsed`);
    } catch ({ message }) {
      assert.deepEqual(message, HAS_NOT_PARSED_DATA);

      getSucceedLog(methodName);
    }
  },

  basicCall() {
    const methodName = this.basicCall.name;
    const mockedBasicData = PackagesRepository.getPackages();
    const mockedResult = 'KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream';

    const PackagerBuilder = new Packager(mockedBasicData);

    assert.deepEqual(PackagerBuilder.exec(), mockedResult);

    getSucceedLog(methodName);
  },

  cyclicDependenciesCall() {
    const methodName = this.cyclicDependenciesCall.name;

    const mockedCycleDependenciesData = PackagesRepository.getCycleDependenciesPackages();
    const PackagerBuilder = new Packager(mockedCycleDependenciesData);

    try {
      PackagerBuilder.exec();

      throw new Error(`[${methodName}] was not determined cyclic dependency`);
    } catch ({ message }) {
      assert.deepEqual(message, DEPENDENCIES_CYCLE_ERROR_MESSAGE);

      getSucceedLog(methodName);
    }
  },

  exec() {
    this.hasNotParsedData();
    this.basicCall();
    this.wrongInput();
    this.cyclicDependenciesCall();
  },
};

module.exports = PackagerSpec;
