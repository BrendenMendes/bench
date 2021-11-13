const expect = require('chai').expect;
const { fetchInitialData, fetchAllData, calculateData }  = require('../operations')

describe('Testing functions to fetch and sort data', () => {
    it('should be an object containing totalCount and transactions', async () => {
        let data = await fetchInitialData()
        expect(data).to.be.an('object');
        expect(data).to.have.nested.property('totalCount');
        expect(data).to.have.nested.property('transactions');
    }).timeout(5000);
    it('should provide object of all transactions', async () => {
        let partialData = await fetchInitialData()
        let allData = await fetchAllData(partialData)
        expect(allData).to.be.an('array');
        expect(Object.keys(allData[0])).to.have.members(['Date', 'Ledger', 'Amount', 'Company']);
    }).timeout(8000);
    it('should sort and calculate all transactions', async () => {
        let partialData = await fetchInitialData()
        let allData = await fetchAllData(partialData)
        let consolidatedData = await calculateData(allData)
        expect(consolidatedData).to.be.an('object');
    }).timeout(9000);
});