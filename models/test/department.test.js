const Department = require('../department.model.js');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Department', () => {
  it('should throw an error if no "name" arg', () => {
    const dep = new Department({});

    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });

  after(() => {
    mongoose.models = {};
  });

  it('should throw an error if "name" is not a string', () => {
    const cases = [{}, []];

    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  after(() => {
    mongoose.models = {};
  });

  it('should throw an error if "name" is shorter that 5letters and longer than 20letters', () => {
    const cases = ['abs', 'abcd', 'abcd efgh ijkl mnop rstu'];

    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  after(() => {
    mongoose.models = {};
  });

  it('should return proper department if "name" is correct', () => {
    const cases = ['test one', 'test two'];

    for (let name of cases) {
      const dep = new Department({ name });

      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });

});