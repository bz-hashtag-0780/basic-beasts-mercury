const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Flow Dapp Tests', async () => {
	let config = null;
	before('setup contract', async () => {
		// Setup tasks for tests
		config = DappLib.getConfig();
	});

	after(() => {
		fkill(':3570');
	});

	describe('\nPack NFT', async () => {
		it(`mints tokens into the admin and user accounts and has the correct balance in the account`, async () => {
			let testData1 = {
				amount: '30.0',
				recipient: config.accounts[0],
			};
			let testData2 = {
				amount: '30.0',
				recipient: config.accounts[1],
			};
			let testData3 = {
				account: config.accounts[0],
			};
			let testData4 = {
				account: config.accounts[1],
			};

			await DappLib.mintFlowTokens(testData1);
			await DappLib.mintFlowTokens(testData2);
			let res1 = await DappLib.getFlowBalance(testData3);
			let res2 = await DappLib.getFlowBalance(testData4);

			assert.equal(
				res1.result,
				1030.001,
				'Did not mint tokens correctly'
			);
			assert.equal(
				res2.result,
				1030.001,
				'Did not mint tokens correctly'
			);
		});
	});
});
