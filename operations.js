const got = require('got');

let response, pageCount = 0, data = [], requestList = []

async function fetchInitialData(){
	return new Promise(async (resolve, reject) => {
		try{
			// requesting bench api to get total page count
			response = await got(`https://resttest.bench.co/transactions/1.json`)
			if(response.body){
				response.body = JSON.parse(response.body)
				resolve(response.body)	
			}
			else{
				reject('No response body')
			}
		}
		catch(e){
			reject(e)
		}
	})
};

async function fetchAllData(response){
	return new Promise(async (resolve, reject) => {
		// check for proper response body with transactions
		if(response && response.totalCount && response.transactions.length > 0){
			pageCount = response.totalCount

			//spreading all transaction objects into data array
			data.push(...response.transactions)
			
			//creating an array list of promisable functions
			for(let i = 2; i <= pageCount; i++){
				requestList.push(new Promise(async (resolve, reject) => {
					try{
						let response = await got(`https://resttest.bench.co/transactions/${i}.json`)
						resolve(JSON.parse(response.body))
					}
					catch(e){
						resolve({})
					}
				}))
			}
			
			// async call to api endpoints
			Promise.all(requestList).then(result => {
				for(let element of result){
					if(Object.keys(element).length > 0){
						data.push(...element.transactions)
					}
				}
				resolve(data)
			})
		}
		else{
			reject('Missing data in resttest.bench.co api response')
		}
	})
}

async function calculateData(data) {
	return new Promise((resolve, reject) => {
		let consolidated = {}
		let amount = 0.0
		
		//sorting the data date wise
		data.sort(function(a, b) {
			let keyA = new Date(a.Date + 'T00:00:00Z')
		    let keyB = new Date(b.Date + 'T00:00:00Z')
			if (keyA < keyB) return -1;
			if (keyA > keyB) return 1;
			return 0;
		});
		
		//calculating day wise amounts
		for(let page of data){
			amount += parseFloat(page.Amount)
			consolidated[page.Date] = 0.0
			consolidated[page.Date] += parseFloat(amount.toFixed(2))
		}
		
		resolve(consolidated)
	})
}

module.exports = { fetchInitialData, fetchAllData, calculateData }