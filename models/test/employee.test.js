const Employee = require('../employee.model.js');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Employee', () => {
  it('should throw an error if there are no args', () => {
    const employee = new Employee({});

    employee.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });


  it('should throw an error when at leat one arg is missing', () => {
    const employee = new Employee({ firstName: 'ana', lastName: 'doe' });

    employee.validate(err => {
      expect(err.errors.department).to.exist;
    });
  });


  it('should throw an error if args are not strings', () => {
    const cases = [{}, []];

    for (let name of cases) {
      const employee = new Employee({ name, name, name });

      employee.validate(err => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should return proper employee when args are correct', () => {
    const employee = new Employee({ firstName: 'Ana', lastName: 'Doe', department: 'Management' });

    employee.validate(err => {
      expect(err).to.not.exist;
    });
  });
});
