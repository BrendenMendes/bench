const { fetchInitialData, fetchAllData, calculateData }  = require('./operations')

//sync calls using promise chaining 
fetchInitialData()
	.then(data => fetchAllData(data))
	.then(data => { return calculateData(data)})
	.then(data => console.log(data))
	.catch(e => {
		console.log(e)
	})