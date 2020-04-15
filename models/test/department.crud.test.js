const Department = require('../department.model.js');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Department', () => {

  before(async () => {

    try {
      const fakeDB = new MongoMemoryServer();

      const uri = await fakeDB.getConnectionString();

      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    } catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const testDepOne = new Department({ name: 'Department 1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department 2' });
      await testDepTwo.save();
    });

    it('should return all the data with find method', async () => {
      const departments = await Department.find();
      const expectedLength = 2;

      expect(departments.length).to.be.equal(expectedLength);
    });

    it('should return a proper doc by "name" with "findOne" method', async () => {
      const department = await Department.findOne({ name: 'Department 1' });
      const expectedName = 'Department 1';

      expect(department.name).to.be.equal(expectedName);
    });

  });

  describe('Creating data', () => {

    it('should insert new doc with "insertOne" method', async () => {
      const department = new Department({ name: 'Department 1' });
      await department.save();

      expect(department.isNew).to.be.false;
    });

    after(async () => {
      await Department.deleteMany();
    });
  });

  describe('Updating data' ,() => {

    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department 1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department 2' });
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne({ name: 'Department 1' }, { $set: { name: '=Department 1=' }});
      const updatedDepartment = await Department.findOne({ name: '=Department 1=' });

      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({ name: 'Department 1' });
      department.name = '=Department 1=';
      await department.save();

      const updatedDepartment = await Department.findOne({ name: '=Department 1=' });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Department.updateMany({}, { $set: { name: 'New name' }});
      const departments = await Department.find();

      expect(departments[0].name).to.be.equal('New name');
      expect(departments[1].name).to.be.equal('New name');
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department 1' });
      await testDepOne.save();

      const testDepTwo = new Department({ name: 'Department 2' });
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly remove one doc with "deleteOne" method', async () => {
      await Department.deleteOne({ name: 'Department 1' });
      const removedDep = await Department.findOne({ name: 'Department 1' });

      expect(removedDep).to.be.null;
    });

    it('should properly remove one doc with "remove" method', async () => {
      const department = await Department.findOne({ name: 'Department 1' });
      await department.remove();
      const removedDep = await Department.findOne({ name: 'Department 1' });

      expect(removedDep).to.be.null;
    });

    it('should properly remove multiple docs with "deleteMany" method', async () => {
      await Department.deleteMany();
      const departments = await Department.find();

      expect(departments.length).to.be.equal(0);
    });
  });
});