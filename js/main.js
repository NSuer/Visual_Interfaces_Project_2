

d3.csv('data/MyData.csv')
	.then(data => {
		//process the data 
		console.log(data);

	})
	.catch(error => {
		console.log('Error loading the data');
		console.log(error);
	});
