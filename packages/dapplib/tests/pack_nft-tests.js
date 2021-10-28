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

	/************ Basic Beasts ************/

	describe('Basic Beasts Tests', async () => {
		it(`1. Set up account`, async () => {
			let testData0 = {
				signer: config.accounts[0],
			};

			let testData1 = {
				signer: config.accounts[1],
			};
			await DappLib.basicBeastSetupAccount(testData0);
			await DappLib.basicBeastSetupAccount(testData1);
		});

		it(`2. Create EvolutionSet - Admin`, async () => {
			let testData1 = {
				signer: config.accounts[0],
				setName: 'Stark',
				setID: '1',
			};

			let testData2 = {
				signer: config.accounts[0],
				setName: 'Targaryen',
				setID: '2',
			};
			await DappLib.basicBeastCreateEvolutionSet(testData1);
			await DappLib.basicBeastCreateEvolutionSet(testData2);

			let res1 = await DappLib.basicBeastGetEvolutionSetName(testData1);
			assert.equal(
				res1.result,
				'Stark',
				'Incorrect. Set name should be Stark'
			);

			let res2 = await DappLib.basicBeastGetEvolutionSetName(testData2);
			assert.equal(
				res2.result,
				'Targaryen',
				'Incorrect. Set name should be Targaryen'
			);
		});

		it(`3. Cannot create an EvolutionSet - Non Admin`, async () => {
			let testData = {
				signer: config.accounts[1],
				setName: 'Non admin EvolutionSet',
			};

			try {
				await DappLib.basicBeastCreateEvolutionSet(testData);
			} catch (e) {
				let res = await DappLib.basicBeastGetNextEvolutionSetID({});
				// The next EvolutionSetID should be 3 since there are created 2 in total and setID starts with 1
				assert.equal(
					res.result,
					3,
					'❗Incorrect. Non Admin account should not be able to create an EvolutionSet'
				);
			}
		});

		it(`4. Create beastTemplates - Admin`, async () => {
			let testData1 = {
				signer: config.accounts[0],
				dexNumber: '1',
				name: 'Moon',
				image: 'URL',
				description: 'Basic beast',
				rarity: 'Secret Rare',
				skin: 'Normal',
				starLevel: '1',
				asexual: 'false',
				ultimateSkill: 'Fart',
				basicSkills: ['Eat', 'Sleep'],
				elements: { Fire: 'true' },
				data: { Data: 'Data..' },
				beastTemplateID: 1,
			};

			let testData2 = {
				signer: config.accounts[0],
				dexNumber: '2',
				name: 'Sir Moon',
				image: 'URL',
				description: 'Fine beast',
				rarity: 'Secret Rare',
				skin: 'Normal',
				starLevel: '2',
				asexual: 'false',
				ultimateSkill: 'Do Math',
				basicSkills: ['Eat', 'Sleep'],
				elements: { Fire: 'true' },
				data: { Data: 'Data..' },
				beastTemplateID: 2,
			};

			let testData3 = {
				signer: config.accounts[0],
				dexNumber: '3',
				name: 'CEO Moon',
				image: 'URL',
				description: 'Perfect beast',
				rarity: 'Secret Rare',
				skin: 'Shiny Gold',
				starLevel: '3',
				asexual: 'false',
				ultimateSkill: 'Dance to BTS',
				basicSkills: ['Eat', 'Sleep'],
				elements: { Fire: 'true' },
				data: { Data: 'Data..' },
				beastTemplateID: 3,
			};

			await DappLib.basicBeastCreateBeastTemplate(testData1);
			await DappLib.basicBeastCreateBeastTemplate(testData2);
			await DappLib.basicBeastCreateBeastTemplate(testData3);

			let res1 = await DappLib.basicBeastGetBeastTemplate(testData1);
			let res2 = await DappLib.basicBeastGetBeastTemplate(testData2);
			let res3 = await DappLib.basicBeastGetBeastTemplate(testData3);

			// assert res1
			assert.equal(
				res1.result.dexNumber,
				'1',
				"❗Incorrect. The beast's dexNumber should be 1"
			);

			assert.equal(
				res1.result.name,
				'Moon',
				"❗Incorrect. The beast's name should be Moon"
			);

			assert.equal(
				res1.result.image,
				'URL',
				"❗Incorrect. The beast's image should be URL"
			);

			assert.equal(
				res1.result.description,
				'Basic beast',
				"❗Incorrect. The beast's description should be Basic beast"
			);

			assert.equal(
				res1.result.rarity,
				'Secret Rare',
				"❗Incorrect. The beast's rarity should be Secret Rare"
			);

			assert.equal(
				res1.result.skin,
				'Normal',
				"❗Incorrect. The beast's skin should be Normal"
			);

			assert.equal(
				res1.result.starLevel,
				'1',
				"❗Incorrect. The beast's starLevel should be 1"
			);

			assert.isFalse(
				res1.result.asexual,
				"❗Incorrect. The beast's asexual should be false"
			);

			assert.equal(
				res1.result.ultimateSkill,
				'Fart',
				"❗Incorrect. The beast's ultimateSkill should be Fart"
			);

			assert.deepEqual(
				res1.result.basicSkills,
				['Eat', 'Sleep'],
				"❗Incorrect. The beast's basicSkills should be Eat and Sleep"
			);

			assert.equal(
				Object.keys(res1.result.elements)[0],
				'Fire',
				"❗Incorrect. The beast's element's key should be: Fire"
			);

			assert.isTrue(
				res1.result.elements[Object.keys(res1.result.elements)[0]],
				"❗Incorrect. The beast's element's value should be: True"
			);

			assert.equal(
				Object.keys(res1.result.data)[0],
				'Data',
				"❗Incorrect. The beast's data's key should be: Data"
			);

			assert.equal(
				res1.result.data[Object.keys(res1.result.data)[0]],
				'Data..',
				"❗Incorrect. The character's data's value should be: Data.."
			);

			// assert res2
			assert.equal(
				res2.result.dexNumber,
				'2',
				"❗Incorrect. The beast's dexNumber should be 2"
			);

			assert.equal(
				res2.result.name,
				'Sir Moon',
				"❗Incorrect. The beast's name should be Sir Moon"
			);

			assert.equal(
				res2.result.image,
				'URL',
				"❗Incorrect. The beast's image should be URL"
			);

			assert.equal(
				res2.result.description,
				'Fine beast',
				"❗Incorrect. The beast's description should be Fine beast"
			);

			assert.equal(
				res2.result.rarity,
				'Secret Rare',
				"❗Incorrect. The beast's rarity should be Secret Rare"
			);

			assert.equal(
				res2.result.skin,
				'Normal',
				"❗Incorrect. The beast's skin should be Normal"
			);

			assert.equal(
				res2.result.starLevel,
				'2',
				"❗Incorrect. The beast's starLevel should be 2"
			);

			assert.isFalse(
				res2.result.asexual,
				"❗Incorrect. The beast's asexual should be false"
			);

			assert.equal(
				res2.result.ultimateSkill,
				'Do Math',
				"❗Incorrect. The beast's ultimateSkill should be Do Math"
			);

			assert.deepEqual(
				res2.result.basicSkills,
				['Eat', 'Sleep'],
				"❗Incorrect. The beast's basicSkills should be Eat and Sleep"
			);

			assert.equal(
				Object.keys(res2.result.elements)[0],
				'Fire',
				"❗Incorrect. The beast's element's key should be: Fire"
			);

			assert.isTrue(
				res2.result.elements[Object.keys(res1.result.elements)[0]],
				"❗Incorrect. The beast's element's value should be: True"
			);

			assert.equal(
				Object.keys(res2.result.data)[0],
				'Data',
				"❗Incorrect. The beast's data's key should be: Data"
			);

			assert.equal(
				res2.result.data[Object.keys(res2.result.data)[0]],
				'Data..',
				"❗Incorrect. The character's data's value should be: Data.."
			);

			// assert res3
			assert.equal(
				res3.result.dexNumber,
				'3',
				"❗Incorrect. The beast's dexNumber should be 3"
			);

			assert.equal(
				res3.result.name,
				'CEO Moon',
				"❗Incorrect. The beast's name should be CEO Moon"
			);

			assert.equal(
				res3.result.image,
				'URL',
				"❗Incorrect. The beast's image should be URL"
			);

			assert.equal(
				res3.result.description,
				'Perfect beast',
				"❗Incorrect. The beast's description should be Perfect beast"
			);

			assert.equal(
				res3.result.rarity,
				'Secret Rare',
				"❗Incorrect. The beast's rarity should be Secret Rare"
			);

			assert.equal(
				res3.result.skin,
				'Shiny Gold',
				"❗Incorrect. The beast's skin should be Shiny Gold"
			);

			assert.equal(
				res3.result.starLevel,
				'3',
				"❗Incorrect. The beast's starLevel should be 3"
			);

			assert.isFalse(
				res3.result.asexual,
				"❗Incorrect. The beast's asexual should be false"
			);

			assert.equal(
				res3.result.ultimateSkill,
				'Dance to BTS',
				"❗Incorrect. The beast's ultimateSkill should be Dance to BTS"
			);

			assert.deepEqual(
				res3.result.basicSkills,
				['Eat', 'Sleep'],
				"❗Incorrect. The beast's basicSkills should be Eat and Sleep"
			);

			assert.equal(
				Object.keys(res3.result.elements)[0],
				'Fire',
				"❗Incorrect. The beast's element's key should be: Fire"
			);

			assert.isTrue(
				res3.result.elements[Object.keys(res3.result.elements)[0]],
				"❗Incorrect. The beast's element's value should be: True"
			);

			assert.equal(
				Object.keys(res3.result.data)[0],
				'Data',
				"❗Incorrect. The beast's data's key should be: Data"
			);

			assert.equal(
				res3.result.data[Object.keys(res3.result.data)[0]],
				'Data..',
				"❗Incorrect. The character's data's value should be: Data.."
			);
		});

		it(`5. Cannot create a beastTemplate - Non Admin`, async () => {
			let testData = {
				signer: config.accounts[1],
				dexNumber: '1',
				name: 'Test',
				image: 'URL',
				description: 'Basic beast test',
				rarity: 'Secret Rare test',
				skin: 'Normal test',
				starLevel: '1',
				asexual: 'false',
				ultimateSkill: 'Fart test',
				basicSkills: ['Test'],
				elements: { Test: 'true' },
				data: { Test: 'Data..' },
				beastTemplateID: 4,
			};

			try {
				await DappLib.basicBeastCreateBeastTemplate(testData);
			} catch (e) {
				let res = await DappLib.basicBeastGetNextBeastTemplateID({});
				// The next beastTemplateID should be 4 since there are created 3 in total and beastTemplateID starts with 1
				assert.equal(
					res.result,
					4,
					'❗Incorrect. Non Admin account should not be able to create a beastTemplateID'
				);
			}
		});

		it(`6. Add a beastTemplate in an EvolutionSet - Admin`, async () => {
			let testData = {
				signer: config.accounts[0],
				setID: 1,
				beastTemplateID: 1,
			};

			await DappLib.basicBeastAddBeastTemplateToEvolutionSet(testData);
			let res = await DappLib.basicBeastGetBeastTemplateEvolutionSet(
				testData
			);
			assert.equal(
				res.result,
				1,
				'❗Incorrect. Admin is not able to add a beastTemplate to an EvolutionSet'
			);
		});

		it(`7. Cannot add an exsisting beastTemplate in an EvolutionSet - Admin`, async () => {
			let testData = {
				signer: config.accounts[0],
				setID: 1,
				beastTemplateID: 1,
			};

			try {
				await DappLib.basicBeastAddBeastTemplateToEvolutionSet(
					testData
				);
			} catch (e) {}
		});

		it(`8. Cannot add a beastTemplate in an EvolutionSet - Non Admin`, async () => {
			let testData = {
				signer: config.accounts[1],
				setID: 2,
				beastTemplateID: 2,
			};

			try {
				await DappLib.basicBeastAddBeastTemplateToEvolutionSet(
					testData
				);
			} catch (e) {
				let res =
					await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
						testData
					);
				assert.deepEqual(
					res.result,
					[],
					'❗Incorrect. Non Admin should not be able to add a beastTemplate to an EvolutionSet'
				);
			}
		});

		it(`9. Add BeastTemplates in an EvolutionSet - Admin`, async () => {
			let testData = {
				signer: config.accounts[0],
				setID: 2,
				beastTemplateID: [2, 3],
			};

			try {
				await DappLib.basicBeastAddBeastTemplatesToEvolutionSet(
					testData
				);
			} catch (e) {
				let res =
					await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
						testData
					);
				assert.deepEqual(
					res.result,
					[2, 3],
					'❗Incorrect. BeastTemplates cannot be added to the EvolutionSet'
				);
			}
		});

		it(`10. Cannot remove BeastTemplate from EvolutionSet - Non Admin`, async () => {
			let testData = {
				signer: config.accounts[1],
				setID: 1,
				beastTemplateID: 1,
			};

			try {
				await DappLib.basicBeastRemoveBeastTemplateFromEvolutionSet(
					testData
				);
			} catch (e) {
				let res =
					await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
						testData
					);
				assert.deepEqual(
					res.result,
					[1],
					'❗Incorrect. Non Admin should not be able to remove the beastTemplate from the EvolutionSet'
				);
			}
		});

		it(`11. Remove BeastTemplate from EvolutionSet - Admin`, async () => {
			let testData = {
				signer: config.accounts[0],
				setID: 1,
				beastTemplateID: 1,
			};

			await DappLib.basicBeastRemoveBeastTemplateFromEvolutionSet(
				testData
			);
			let res = await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
				testData
			);
			assert.deepEqual(
				res.result,
				[],
				'❗Incorrect. Admin should be able to remove the beastTemplate from the EvolutionSet'
			);
		});

		it(`12. Cannot remove all BeastTemplates from EvolutionSet - Non Admin`, async () => {
			let testData = {
				signer: config.accounts[1],
				setID: 2,
			};

			try {
				await DappLib.basicBeastRemoveAllBeastTemplatesFromEvolutionSet(
					testData
				);
			} catch (e) {
				let res =
					await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
						testData
					);
				assert.deepEqual(
					res.result,
					[2, 3],
					'❗Incorrect. Non Admin should not be able to remove all beastTemplates from the EvolutionSet'
				);
			}
		});

		it(`13. Remove all BeastTemplates from EvolutionSet - Admin`, async () => {
			let testData = {
				signer: config.accounts[0],
				setID: 2,
			};

			await DappLib.basicBeastRemoveAllBeastTemplatesFromEvolutionSet(
				testData
			);
			let res = await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
				testData
			);
			assert.deepEqual(
				res.result,
				[],
				'❗Incorrect. Admin should be able to remove all beastTemplates from the EvolutionSet'
			);
		});

		it(`14. Cannot add BeastTemplates in an EvolutionSet - Non Admin`, async () => {
			let testData = {
				signer: config.accounts[1],
				setID: 2,
				beastTemplateID: [2, 3],
			};

			try {
				await DappLib.basicBeastAddBeastTemplatesToEvolutionSet(
					testData
				);
			} catch (e) {
				let res =
					await DappLib.basicBeastGetBeastTemplatesInEvolutionSet(
						testData
					);
				assert.deepEqual(
					res.result,
					[],
					'❗Incorrect. BeastTemplates should not be added to the EvolutionSet - Non Admin action'
				);
			}
		});
	});
});
