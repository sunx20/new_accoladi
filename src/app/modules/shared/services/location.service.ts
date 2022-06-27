import { Injectable } from '@angular/core';

const usStates = [
	{_id: 1, abbr: 'AL', name: 'Alabama', country: 'USA' },
	{_id: 2, abbr: 'AK', name: 'Alaska', country: 'USA' },
	{_id: 3, abbr: 'AZ', name: 'Arizona', country: 'USA' },
	{_id: 4, abbr: 'AR', name: 'Arkansas', country: 'USA' },
	{_id: 5, abbr: 'CA', name: 'California', country: 'USA' },
	{_id: 6, abbr: 'CO', name: 'Colorado', country: 'USA' },
	{_id: 7, abbr: 'CT', name: 'Connecticut', country: 'USA' },
	{_id: 8, abbr: 'DE', name: 'Delaware', country: 'USA' },
	{_id: 9, abbr: 'FL', name: 'Florida', country: 'USA' },
	{_id: 10, abbr: 'GA', name: 'Georgia', country: 'USA' },
	{_id: 11, abbr: 'HI', name: 'Hawaii', country: 'USA' },
	{_id: 12, abbr: 'ID', name: 'Idaho', country: 'USA' },
	{_id: 13, abbr: 'IL', name: 'Illinois', country: 'USA' },
	{_id: 14, abbr: 'IN', name: 'Indiana', country: 'USA' },
	{_id: 15, abbr: 'IA', name: 'Iowa', country: 'USA' },
	{_id: 16, abbr: 'KS', name: 'Kansas', country: 'USA' },
	{_id: 17, abbr: 'KY', name: 'Kentucky', country: 'USA' },
	{_id: 18, abbr: 'LA', name: 'Louisiana', country: 'USA' },
	{_id: 19, abbr: 'ME', name: 'Maine', country: 'USA' },
	{_id: 20, abbr: 'MD', name: 'Maryland', country: 'USA' },
	{_id: 21, abbr: 'MA', name: 'Massachusetts', country: 'USA' },
	{_id: 22, abbr: 'MI', name: 'Michigan', country: 'USA' },
	{_id: 23, abbr: 'MN', name: 'Minnesota', country: 'USA' },
	{_id: 24, abbr: 'MS', name: 'Mississippi', country: 'USA' },
	{_id: 25, abbr: 'MO', name: 'Missouri', country: 'USA' },
	{_id: 26, abbr: 'MT', name: 'Montana', country: 'USA' },
	{_id: 27, abbr: 'NE', name: 'Nebraska', country: 'USA' },
	{_id: 28, abbr: 'NV', name: 'Nevada', country: 'USA' },
	{_id: 29, abbr: 'NH', name: 'New Hampshire', country: 'USA' },
	{_id: 30, abbr: 'NJ', name: 'New Jersey', country: 'USA' },
	{_id: 31, abbr: 'NM', name: 'New Mexico', country: 'USA' },
	{_id: 32, abbr: 'NY', name: 'New York', country: 'USA' },
	{_id: 33, abbr: 'NC', name: 'North Carolina', country: 'USA' },
	{_id: 34, abbr: 'ND', name: 'North Dakota', country: 'USA' },
	{_id: 35, abbr: 'OH', name: 'Ohio', country: 'USA' },
	{_id: 36, abbr: 'OK', name: 'Oklahoma', country: 'USA' },
	{_id: 37, abbr: 'OR', name: 'Oregon', country: 'USA' },
	{_id: 38, abbr: 'PA', name: 'Pennsylvania', country: 'USA' },
	{_id: 39, abbr: 'RI', name: 'Rhode Island', country: 'USA' },
	{_id: 40, abbr: 'SC', name: 'South Carolina', country: 'USA' },
	{_id: 41, abbr: 'SD', name: 'South Dakota', country: 'USA' },
	{_id: 42, abbr: 'TN', name: 'Tennessee', country: 'USA' },
	{_id: 43, abbr: 'TX', name: 'Texas', country: 'USA' },
	{_id: 44, abbr: 'UT', name: 'Utah', country: 'USA' },
	{_id: 45, abbr: 'VT', name: 'Vermont', country: 'USA' },
	{_id: 46, abbr: 'VA', name: 'Virginia', country: 'USA' },
	{_id: 47, abbr: 'WA', name: 'Washington', country: 'USA' },
	{_id: 48, abbr: 'WV', name: 'West Virginia', country: 'USA' },
	{_id: 49, abbr: 'WI', name: 'Wisconsin', country: 'USA' },
	{_id: 50, abbr: 'WY', name: 'Wyoming', country: 'USA' }
];

const countries = [
	{
		_id: 1,
		name: 'United States',
		abbr: 'USA'
	},
	{
		_id: 2,
		name: 'Canada',
		abbr: 'CAN'
	}
];

@Injectable()

export class LocationService {

	states: any[];
	countries: any[];

	constructor() {
	}

	getStates (): any {
		return usStates;
	}

	getCountries (): any {
		return countries;
	}

}