let d = new Date();

export const environment = {
	production: false,
	label: 'Local Development',
	title: 'Accoladi.com',
	copywrite: '(c) 2017-' + d.getFullYear(),
	build: '20220614', //d.getFullYear().toString() + (d.getMonth()+1).toString() + ('0' + d.getDate()).slice(-2).toString() + '.' + d.getHours().toString() + d.getMinutes().toString(),
	//apiUrl: 'http://localhost:3002',	
	apiUrl: 'https://sa-members-api-dev.herokuapp.com',
	uiUrl: 'http://localhost:4200',
	// uiUrl: 'https://dev-members.accoladi.com',
	apiPath: '/api',
	stripeKey: 'pk_test_HVjpUsglKB3zCbRyCD1MXyZM00e9h1tEjq',
};