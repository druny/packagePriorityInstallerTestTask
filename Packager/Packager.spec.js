const assert = require('assert');

const Packager = require('./Packager');
const { PackagesRepository } = require('../repository');
const {
  HAS_NOT_PARSED_DATA,
  WRONG_INPUT_DATA_ERROR_MESSAGE,
  DEPENDENCIES_CYCLE_ERROR_MESSAGE,
}  = require('./constants');

const SUCCEED_RESULT_COLOR = '\x1b[36m%s\x1b[0m';

const PackagerSpec = {
  wrongInput() {
    const mockedWrongData = '';
    const PackagerBuilder = new Packager(mockedWrongData);

    try {
      PackagerBuilder.exec();

      throw new Error('[wrongInput] got wrong input');
    } catch ({ message }) {
      assert.deepEqual(message, WRONG_INPUT_DATA_ERROR_MESSAGE);

      console.log(SUCCEED_RESULT_COLOR, '[wrongInput]', 'DONE')
    }
  },

  hasNotParsedData() {
    const mockedWrongData = '';
    const PackagerBuilder = new Packager(mockedWrongData);

    try {
      PackagerBuilder.buildFlow();

      throw new Error('[hasNotParsedData] data has not parsed');
    } catch ({ message }) {
      assert.deepEqual(message, HAS_NOT_PARSED_DATA);

      console.log(SUCCEED_RESULT_COLOR, '[hasNotParsedData]', 'DONE')
    }
  },

  basicCall() {
    const mockedBasicData = PackagesRepository.getPackages();
    const mockedResult = 'KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream';

    const PackagerBuilder = new Packager(mockedBasicData);

    assert.deepEqual(PackagerBuilder.exec(), mockedResult);

    console.log(SUCCEED_RESULT_COLOR, '[basicCall]', 'DONE');
  },

  cyclicDependenciesCall() {
    const mockedCycleDependenciesData = PackagesRepository.getCycleDependenciesPackages();
    const PackagerBuilder = new Packager(mockedCycleDependenciesData);

    try {
      PackagerBuilder.exec();

      throw new Error('[cyclicDependenciesCall] was not determined cyclic dependency');
    } catch ({ message }) {
      assert.deepEqual(message, DEPENDENCIES_CYCLE_ERROR_MESSAGE);

      console.log(SUCCEED_RESULT_COLOR, '[cyclicDependenciesCall]', 'DONE')
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
