const Employee = require('../employee.model.js');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Employee', () => {

  before(async () => {

    try {
      const employeeDB = new MongoMemoryServer();

      const uri = await employeeDB.getConnectionString();

      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const test1 = new Employee({ firstName: 'Johnny', lastName: 'Doe', department: 'Management' });
      await test1.save();

      const test2 = new Employee({ firstName: 'Amelie', lastName: 'Spring', department: 'Resources' });
      await test2.save();
    });

    it('should return all the data with "find" method', async () => {
      try {
        const employees = await Employee.find();
        const expectedLength = 2;

        expect(employees.length).to.be.equal(expectedLength);
      } catch (err) {
        console.log(err);
      }
    });

    it('should return proper doc by various params with "findOne" method', async () => {
      try {
        const test1 = await Employee.findOne({ firstName: 'Johnny' });
        const test2 = await Employee.findOne({ lastName: 'Spring' });
        const test3 = await Employee.findOne({ department: 'Resources' });

        const expectedName = 'Johnny';
        const expectedSurname = 'Spring';
        const expectedDep = 'Resources';

        expect(test1.firstName).to.be.equal(expectedName);
        expect(test2.lastName).to.be.equal(expectedSurname);
        expect(test3.department).to.be.equal(expectedDep);
      } catch (err) {
        console.log(err);
      }
    });


  });

  describe('Creating data', () => {

    it('should insert new doc with "insertOne" method', async () => {
      const newEmployee = new Employee({ firstName: 'Willy', lastName: 'Wonka', department: 'Entertainment' });
      await newEmployee.save();

      expect(newEmployee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const newEmpOne = new Employee({ firstName: 'Honey', lastName: 'Dilly', department: 'Management' });
      await newEmpOne.save();

      const newEmpTwo = new Employee({ firstName: 'George', lastName: 'Orwell', department: 'Future' });
      await newEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly update one doc with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Honey' }, { $set: { firstName: 'Barbara' }});
      const employee = await Employee.findOne({ firstName : 'Barbara' });

      expect(employee).to.not.be.null;
    });

    it('should properly update one doc with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Honey' });
      employee.firstName = 'Barbara';
      await employee.save();

      const updatedEmp = await Employee.findOne({ firstName: 'Barbara' });
      expect(updatedEmp).to.not.be.null;
    });

    it('should properly update many docs with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'Lilly' }});
      const employees = await Employee.find();

      expect(employees[0].firstName).to.be.equal('Lilly');
      expect(employees[1].firstName).to.be.equal('Lilly');
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const newEmpOne = new Employee({ firstName: 'Honey', lastName: 'Dilly', department: 'Management' });
      await newEmpOne.save();

      const newEmpTwo = new Employee({ firstName: 'George', lastName: 'Orwell', department: 'Future' });
      await newEmpTwo.save();
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });

    it('should properly remove one doc with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Honey' });
      const removedEmp = await Employee.findOne({ firstName: 'Honey' });

      expect(removedEmp).to.be.null;
    });

    it('should properly remove one doc with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Honey' });
      await employee.remove();
      const removedEmp = await Employee.findOne({ firstName: 'Honey' });

      expect(removedEmp).to.be.null;
    });

    it('should properly remove many docs with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();

      expect(employees.length).to.be.equal(0);
    });
  });


});