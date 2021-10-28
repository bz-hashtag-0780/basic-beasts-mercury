'use strict';
const Blockchain = require('./blockchain');
const dappConfig = require('./dapp-config.json');
const ClipboardJS = require('clipboard');
const BN = require('bn.js'); // Required for injected code
const manifest = require('../manifest.json');
const t = require('@onflow/types');

module.exports = class DappLib {
	/********** BASIC BEAST **********/

	// 1 basicBeastSetupAccount
	// calls transactions/basicbeast/setup_account.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastSetupAccount(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_setup_account'
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 2 basicBeastCreateEvolutionSet
	// calls transactions/basicbeast/create_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastCreateEvolutionSet(data) {
		let config = DappLib.getConfig();
		let result = await Blockchain.post(
			{
				config: config,
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_create_evolutionSet',
			{
				setName: { value: data.setName, type: t.String },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 3 basicBeastGetEvolutionSetName
	// calls scripts/basicbeast/sets/get_setName.cdc
	//
	// signer/proposer/authorizer:
	//
	static async basicBeastGetEvolutionSetName(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {},
			},
			'basicbeast_sets_get_evolutionSetName',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'Evolution Set Name is',
			result: result.callData,
		};
	}

	// 4 basicBeastCreateBeastTemplate
	// calls transactions/basicbeast/create_beastTemplate.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastCreateBeastTemplate(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_create_beastTemplate',
			{
				dexNumber: { value: parseInt(data.dexNumber), type: t.UInt32 },
				name: { value: data.name, type: t.String },
				image: { value: data.image, type: t.String },
				description: { value: data.description, type: t.String },
				rarity: { value: data.rarity, type: t.String },
				skin: { value: data.skin, type: t.String },
				starLevel: { value: parseInt(data.starLevel), type: t.UInt32 },
				// help
				asexual: { value: false, type: t.Bool },
				ultimateSkill: { value: data.ultimateSkill, type: t.String },
				basicSkills: DappLib.formatFlowArray(
					data.basicSkills,
					t.String
				),
				elements: DappLib.formatFlowDictionary(data.elements, {
					key: t.String,
					value: t.Bool,
				}),
				data: DappLib.formatFlowDictionary(data.data, {
					key: t.String,
					value: t.String,
				}),
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 5 basicBeastGetBeastTemplate
	// calls scripts/basicbeast/beastTemplates/get_beastTemplate.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetBeastTemplate(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_beastTemplates_get_beastTemplate',
			{
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
			}
		);

		console.log(result);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'Beast information',
			result: result.callData,
		};
	}

	// 6 basicBeastGetAllBeastTemplates
	// calls scripts/basicbeast/beastTemplates/get_all_beastTemplates.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetAllBeastTemplates(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_beastTemplates_get_all_beastTemplates',
			{}
		);

		console.log(result);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'Beast information',
			result: result.callData,
		};
	}

	// 7 basicBeastGetAllBeastTemplatesInAnEvolutionSet
	// calls scripts/basicbeast/get_all_beastTemplates_in_an_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetAllBeastTemplatesInAnEvolutionSet(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_get_all_beastTemplates_in_an_evolutionSet',
			{}
		);

		console.log(result);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'Beast information',
			result: result.callData,
		};
	}

	// 8 basicBeastGetBeastTemplatesInEvolutionSet.cdc
	// calls scripts/basicbeast/sets/get_beastTemplates_in_evolutionSet.cdc.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetBeastTemplatesInEvolutionSet(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_sets_get_beastTemplates_in_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
			}
		);

		console.log(result);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'Beast information',
			result: result.callData,
		};
	}

	// 9 basicBeastAddBeastTemplateToEvolutionSet
	// calls transactions/basicbeast/add_beastTemplate_to_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastAddBeastTemplateToEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_add_beastTemplate_to_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 10 basicBeastAddBeastTemplatesToEvolutionSet
	// calls transactions/basicbeast/add_beastTemplates_to_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastAddBeastTemplatesToEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_add_beastTemplates_to_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
				beastTemplateID: DappLib.formatFlowArray(
					data.beastTemplateID,
					t.UInt32
				),
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 11 basicBeastGetBeastTemplateEvolutionSet
	// calls scripts/basicbeast/get_beastTemplate_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastGetBeastTemplateEvolutionSet(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_get_beastTemplate_evolutionSet',
			{
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
			}
		);

		console.log(data.signer);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'setID',
			result: result.callData,
		};
	}

	// 12 basicBeastRemoveBeastTemplateFromEvolutionSet
	// calls transactions/basicbeast/remove_beastTemplate_from_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastRemoveBeastTemplateFromEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_remove_beastTemplate_from_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 13 basicBeastRemoveAllBeastTemplatesFromEvolutionSet
	// calls transactions/basicbeast/remove_all_beastTemplates_from_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastRemoveAllBeastTemplatesFromEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_remove_all_beastTemplates_from_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 14 basicBeastMintBeast
	// calls transactions/basicbeast/mint_beast.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastMintBeast(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_mint_beast',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
				matron: { value: parseInt(data.matron), type: t.UInt64 },
				sire: { value: parseInt(data.sire), type: t.UInt64 },
				evolvedFrom: DappLib.formatFlowArray(
					data.evolvedFrom,
					t.UInt64
				),
				recipientAddr: { value: data.recipientAddr, type: t.Address },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 15 basicBeastBatchMintBeast
	// calls transactions/basicbeast/batch_mint_beast.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastBatchMintBeast(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_batch_mint_beast',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
				matron: { value: parseInt(data.matron), type: t.UInt64 },
				sire: { value: parseInt(data.sire), type: t.UInt64 },
				evolvedFrom: DappLib.formatFlowArray(
					data.evolvedFrom,
					t.UInt64
				),
				quantity: { value: parseInt(data.quantity), type: t.UInt64 },
				recipientAddr: { value: data.recipientAddr, type: t.Address },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 16 basicBeastGetTotalSupply
	// calls scripts/basicbeast/get_totalSupply.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastGetTotalSupply(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_get_totalSupply',
			{}
		);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'Total minted Beast NFTs',
			result: result.callData,
		};
	}

	// 17 basicBeastGetCollectionOwnedBeastsIds
	// calls scripts/basicbeast/collections/get_collection_owned_beasts_ids.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastGetCollectionOwnedBeastsIds(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_collections_get_collection_owned_beasts_ids',
			{
				account: { value: data.account, type: t.Address },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'The Collection s Beast NFTs',
			result: result.callData,
		};
	}

	// 18 basicBeastGetBeastIdInCollection
	// calls scripts/basicbeast/collections/get_beast_id_in_Collection.cdc
	//
	// signer/proposer/authorizer: data.signer
	//

	static async basicBeastGetBeastIdInCollection(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_collections_get_beast_id_in_Collection',
			{
				account: { value: data.account, type: t.Address },
				id: { value: parseInt(data.id), type: t.UInt64 },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_STRING,
			label: 'The Collection s Beast NFTs',
			result: result.callData,
		};
	}

	// 19 basicBeastLockEvolutionSet
	// calls transactions/basicbeast/lock_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastLockEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_lock_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 20 basicBeastRetireBeastTemplateFromEvolutionSet
	// calls transactions/basicbeast/retire_beastTemplate_from_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastRetireBeastTemplateFromEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_retire_beastTemplate_from_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
				beastTemplateID: {
					value: parseInt(data.beastTemplateID),
					type: t.UInt32,
				},
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 21 basicBeastRetireAllBeastTemplatesFromEvolutionSet
	// calls transactions/basicbeast/retire_all_beastTemplates_from_evolutionSet.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastRetireAllBeastTemplatesFromEvolutionSet(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_retire_all_beastTemplates_from_evolutionSet',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 22 basicBeastStartNewGeneration
	// calls transactions/basicbeast/start_new_generation.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastStartNewGeneration(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_start_new_generation',
			{}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 23 basicBeastGetCurrentGeneration
	// calls scripts/basicbeast/get_currentGeneration.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetCurrentGeneration(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_get_currentGeneration',
			{}
		);

		return {
			type: DappLib.DAPP_RESULT_BIG_NUMBER,
			label: 'The current generation is',
			result: result.callData,
		};
	}

	// 24 basicBeastDepositBeastNft
	// calls transactions/basicbeast/deposit_beast_nft.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastDepositBeastNft(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_deposit_beast_nft',
			{
				recipientAddr: { value: data.recipientAddr, type: t.Address },
				beastID: { value: parseInt(data.beastID), type: t.UInt64 },
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 25 basicBeastDepositBeastNfts
	// calls transactions/basicbeast/deposit_beast_nfts.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastDepositBeastNfts(data) {
		let result = await Blockchain.post(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_deposit_beast_nfts',
			{
				recipientAddr: { value: data.recipientAddr, type: t.Address },
				beastIDs: DappLib.formatFlowArray(data.beastIDs, t.UInt64),
			}
		);

		return {
			type: DappLib.DAPP_RESULT_TX_HASH,
			label: 'Transaction Hash',
			result: result.callData.transactionId,
		};
	}

	// 26 basicBeastGetEvolutionSetData
	// calls scripts/basicbeast/sets/get_evolutionSetData.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetEvolutionSetData(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_sets_get_evolutionSetData',
			{
				setID: { value: parseInt(data.setID), type: t.UInt32 },
			}
		);

		console.log(result);

		return {
			type: DappLib.DAPP_RESULT_BIG_NUMBER,
			label: 'The current generation is',
			result: result.callData,
		};
	}

	//  basicBeastGetNextEvolutionSetID
	// calls scripts/basicbeast/sets/get_next_evolutionSetID.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetNextEvolutionSetID(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_sets_get_next_evolutionSetID',
			{}
		);

		console.log(result);

		return {
			type: DappLib.DAPP_RESULT_BIG_NUMBER,
			label: 'The current generation is',
			result: result.callData,
		};
	}

	//  basicBeastGetNextBeastTemplateID
	// calls scripts/basicbeast/beastTemplates/get_next_beastTemplateID.cdc
	//
	// signer/proposer/authorizer: data.signer
	//
	static async basicBeastGetNextBeastTemplateID(data) {
		let result = await Blockchain.get(
			{
				config: DappLib.getConfig(),
				roles: {
					proposer: data.signer,
				},
			},
			'basicbeast_get_next_beastTemplateID',
			{}
		);

		return {
			type: DappLib.DAPP_RESULT_BIG_NUMBER,
			label: 'The next beastTemplate is',
			result: result.callData,
		};
	}

	/*
      data - an object of key value pairs
      ex. { number: 2, id: 15 }

      types - an object that holds the type of the key 
      and value using the FCL types
      ex. { key: t.String, value: t.Int }
    */
	static formatFlowDictionary(data, types) {
		let newData = [];
		let dataKeys = Object.keys(data);

		for (let key of dataKeys) {
			if (types.key.label.includes('Int')) key = parseInt(key);
			else if (types.key == t.Bool) key = key === 'true';

			if (types.value.label.includes('Int'))
				data[key] = parseInt(data[key]);
			else if (types.value == t.Bool) data[key] = data[key] === 'true';
			newData.push({ key: key, value: data[key] });
		}
		return { value: newData, type: t.Dictionary(types) };
	}

	/*
      data - an array of values
      ex. ["Hello", "World", "!"]
  
      type - the type of the values using the FCL type
      ex. t.String
    */
	static formatFlowArray(data, type) {
		if (type == t.String) return { value: data, type: t.Array(type) };

		let newData = [];
		for (let element of data) {
			if (type.label.includes('Int')) element = parseInt(element);
			else if (type == t.Bool) element = element === 'true';

			newData.push(element);
		}
		return { value: newData, type: t.Array(type) };
	}

	/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> DAPP LIBRARY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

	static get DAPP_STATE_CONTRACT() {
		return 'dappStateContract';
	}
	static get DAPP_CONTRACT() {
		return 'dappContract';
	}

	static get DAPP_STATE_CONTRACT_WS() {
		return 'dappStateContractWs';
	}
	static get DAPP_CONTRACT_WS() {
		return 'dappContractWs';
	}

	static get DAPP_RESULT_BIG_NUMBER() {
		return 'big-number';
	}

	static get DAPP_RESULT_ACCOUNT() {
		return 'account';
	}

	static get DAPP_RESULT_TX_HASH() {
		return 'tx-hash';
	}

	static get DAPP_RESULT_IPFS_HASH_ARRAY() {
		return 'ipfs-hash-array';
	}

	static get DAPP_RESULT_SIA_HASH_ARRAY() {
		return 'sia-hash-array';
	}

	static get DAPP_RESULT_ARRAY() {
		return 'array';
	}

	static get DAPP_RESULT_OBJECT() {
		return 'object';
	}

	static get DAPP_RESULT_STRING() {
		return 'string';
	}

	static get DAPP_RESULT_ERROR() {
		return 'error';
	}

	static async addEventHandler(contract, event, params, callback) {
		Blockchain.handleEvent(
			{
				config: DappLib.getConfig(),
				contract: contract,
				params: params || {},
			},
			event,
			(error, result) => {
				if (error) {
					callback({
						event: event,
						type: DappLib.DAPP_RESULT_ERROR,
						label: 'Error Message',
						result: error,
					});
				} else {
					callback({
						event: event,
						type: DappLib.DAPP_RESULT_OBJECT,
						label: 'Event ' + event,
						result: DappLib.getObjectNamedProperties(result),
					});
				}
			}
		);
	}

	static getTransactionHash(t) {
		if (!t) {
			return '';
		}
		let value = '';
		if (typeof t === 'string') {
			value = t;
		} else if (typeof t === 'object') {
			if (t.hasOwnProperty('transactionHash')) {
				value = t.transactionHash; // Ethereum
			} else {
				value = JSON.stringify(t);
			}
		}
		return value;
	}

	static formatHint(hint) {
		if (hint) {
			return `<p class="mt-3 grey-text"><strong>Hint:</strong> ${hint}</p>`;
		} else {
			return '';
		}
	}

	static formatNumber(n) {
		var parts = n.toString().split('.');
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return `<strong class="p-1 blue-grey-text number copy-target" style="font-size:1.1rem;" title="${n}">${parts.join(
			'.'
		)}</strong>`;
	}

	static formatAccount(a) {
		return `<strong class="green accent-1 p-1 blue-grey-text number copy-target" title="${a}">${DappLib.toCondensed(
			a,
			6,
			4
		)}</strong>${DappLib.addClippy(a)}`;
	}

	static formatTxHash(a) {
		let value = DappLib.getTransactionHash(a);
		return `<strong class="teal lighten-5 p-1 blue-grey-text number copy-target" title="${value}">${DappLib.toCondensed(
			value,
			6,
			4
		)}</strong>${DappLib.addClippy(value)}`;
	}

	static formatBoolean(a) {
		return a ? 'YES' : 'NO';
	}

	static formatText(a, copyText) {
		if (!a) {
			return;
		}
		if (a.startsWith('<')) {
			return a;
		}
		return `<span class="copy-target" title="${
			copyText ? copyText : a
		}">${a}</span>${DappLib.addClippy(copyText ? copyText : a)}`;
	}

	static formatStrong(a) {
		return `<strong>${a}</strong>`;
	}

	static formatPlain(a) {
		return a;
	}

	static formatObject(a) {
		let data = [];
		let labels = ['Item', 'Value'];
		let keys = ['item', 'value'];
		let formatters = ['Strong', 'Text-20-5']; // 'Strong': Bold, 'Text-20-5': Compress a 20 character long string down to 5
		let reg = new RegExp('^\\d+$'); // only digits
		for (let key in a) {
			if (!reg.test(key)) {
				data.push({
					item: key.substr(0, 1).toUpperCase() + key.substr(1),
					value: a[key],
				});
			}
		}
		return DappLib.formatArray(data, formatters, labels, keys);
	}

	static formatArray(h, dataFormatters, dataLabels, dataKeys) {
		let output = '<table class="table table-striped">';

		if (dataLabels) {
			output += '<thead><tr>';
			for (let d = 0; d < dataLabels.length; d++) {
				output += `<th scope="col">${dataLabels[d]}</th>`;
			}
			output += '</tr></thead>';
		}
		output += '<tbody>';
		h.map((item) => {
			output += '<tr>';
			for (let d = 0; d < dataFormatters.length; d++) {
				let text = String(
					dataKeys && dataKeys[d] ? item[dataKeys[d]] : item
				);
				let copyText =
					dataKeys && dataKeys[d] ? item[dataKeys[d]] : item;
				if (text.startsWith('<')) {
					output +=
						(d == 0 ? '<th scope="row">' : '<td>') +
						text +
						(d == 0 ? '</th>' : '</td>');
				} else {
					let formatter = 'format' + dataFormatters[d];
					if (formatter.startsWith('formatText')) {
						let formatterFrags = formatter.split('-');
						if (formatterFrags.length === 3) {
							text = DappLib.toCondensed(
								text,
								Number(formatterFrags[1]),
								Number(formatterFrags[2])
							);
						} else if (formatterFrags.length === 2) {
							text = DappLib.toCondensed(
								text,
								Number(formatterFrags[1])
							);
						}
						formatter = formatterFrags[0];
					}
					output +=
						(d == 0 ? '<th scope="row">' : '<td>') +
						DappLib[formatter](text, copyText) +
						(d == 0 ? '</th>' : '</td>');
				}
			}
			output += '</tr>';
		});
		output += '</tbody></table>';
		return output;
	}

	static getFormattedResultNode(retVal, key) {
		let returnKey = 'result';
		if (key && key !== null && key !== 'null' && typeof key === 'string') {
			returnKey = key;
		}
		let formatted = '';
		switch (retVal.type) {
			case DappLib.DAPP_RESULT_BIG_NUMBER:
				formatted = DappLib.formatNumber(
					retVal[returnKey].toString(10)
				);
				break;
			case DappLib.DAPP_RESULT_TX_HASH:
				formatted = DappLib.formatTxHash(retVal[returnKey]);
				break;
			case DappLib.DAPP_RESULT_ACCOUNT:
				formatted = DappLib.formatAccount(retVal[returnKey]);
				break;
			case DappLib.DAPP_RESULT_BOOLEAN:
				formatted = DappLib.formatBoolean(retVal[returnKey]);
				break;
			case DappLib.DAPP_RESULT_IPFS_HASH_ARRAY:
				formatted = DappLib.formatArray(
					retVal[returnKey],
					['TxHash', 'IpfsHash', 'Text-10-5'], //Formatter
					['Transaction', 'IPFS URL', 'Doc Id'], //Label
					['transactionHash', 'ipfsHash', 'docId'] //Values
				);
				break;
			case DappLib.DAPP_RESULT_SIA_HASH_ARRAY:
				formatted = DappLib.formatArray(
					retVal[returnKey],
					['TxHash', 'SiaHash', 'Text-10-5'], //Formatter
					['Transaction', 'Sia URL', 'Doc Id'], //Label
					['transactionHash', 'docId', 'docId'] //Values
				);
				break;
			case DappLib.DAPP_RESULT_ARRAY:
				formatted = DappLib.formatArray(
					retVal[returnKey],
					retVal.formatter ? retVal.formatter : ['Text'],
					null,
					null
				);
				break;
			case DappLib.DAPP_RESULT_STRING:
				formatted = DappLib.formatPlain(retVal[returnKey]);
				break;
			case DappLib.DAPP_RESULT_OBJECT:
				formatted = DappLib.formatObject(retVal[returnKey]);
				break;
			default:
				formatted = retVal[returnKey];
				break;
		}

		let resultNode = document.createElement('div');
		resultNode.className = `note text-xs ${
			retVal.type === DappLib.DAPP_RESULT_ERROR
				? 'bg-red-400'
				: 'bg-green-400'
		} m-3 p-3`;
		let closeMarkup =
			'<div class="float-right" onclick="this.parentNode.parentNode.removeChild(this.parentNode)" title="Dismiss" class="text-right mb-1 mr-2" style="cursor:pointer;">X</div>';
		resultNode.innerHTML =
			closeMarkup +
			`${retVal.type === DappLib.DAPP_RESULT_ERROR ? '☹️' : '👍️'} ` +
			(Array.isArray(retVal[returnKey]) ? 'Result' : retVal.label) +
			': ' +
			formatted +
			DappLib.formatHint(retVal.hint);
		// Wire-up clipboard copy
		new ClipboardJS('.copy-target', {
			text: function (trigger) {
				return trigger.getAttribute('data-copy');
			},
		});

		return resultNode;
	}

	static getObjectNamedProperties(a) {
		let reg = new RegExp('^\\d+$'); // only digits
		let newObj = {};
		for (let key in a) {
			if (!reg.test(key)) {
				newObj[key] = a[key];
			}
		}
		return newObj;
	}

	static addClippy(data) {
		return `
        <svg data-copy="${data}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 22.1 23.5" style="enable-background:new 0 0 22.1 23.5;cursor:pointer;" class="copy-target" width="19px" height="20.357px" xml:space="preserve">
        <style type="text/css">
            .st99{fill:#777777;stroke:none;stroke-linecap:round;stroke-linejoin:round;}
        </style>
        <path class="st99" d="M3.9,17.4h5.4v1.4H3.9V17.4z M10.7,9.2H3.9v1.4h6.8V9.2z M13.4,13.3v-2.7l-4.1,4.1l4.1,4.1V16h6.8v-2.7H13.4z
             M7.3,12H3.9v1.4h3.4V12z M3.9,16h3.4v-1.4H3.9V16z M16.1,17.4h1.4v2.7c0,0.4-0.1,0.7-0.4,1c-0.3,0.3-0.6,0.4-1,0.4H2.6
            c-0.7,0-1.4-0.6-1.4-1.4V5.2c0-0.7,0.6-1.4,1.4-1.4h4.1c0-1.5,1.2-2.7,2.7-2.7s2.7,1.2,2.7,2.7h4.1c0.7,0,1.4,0.6,1.4,1.4V12h-1.4
            V7.9H2.6v12.2h13.6V17.4z M3.9,6.5h10.9c0-0.7-0.6-1.4-1.4-1.4h-1.4c-0.7,0-1.4-0.6-1.4-1.4s-0.6-1.4-1.4-1.4S8,3.1,8,3.8
            S7.4,5.2,6.6,5.2H5.3C4.5,5.2,3.9,5.8,3.9,6.5z"/>
        </svg>
        `;
	}

	static getAccounts() {
		let accounts = dappConfig.accounts;
		return accounts;
	}

	static fromAscii(str, padding) {
		if (Array.isArray(str)) {
			return DappLib.arrayToHex(str);
		}

		if (str.startsWith('0x') || !padding) {
			return str;
		}

		if (str.length > padding) {
			str = str.substr(0, padding);
		}

		var hex = '0x';
		for (var i = 0; i < str.length; i++) {
			var code = str.charCodeAt(i);
			var n = code.toString(16);
			hex += n.length < 2 ? '0' + n : n;
		}
		return hex + '0'.repeat(padding * 2 - hex.length + 2);
	}

	static toAscii(hex) {
		var str = '',
			i = 0,
			l = hex.length;
		if (hex.substring(0, 2) === '0x') {
			i = 2;
		}
		for (; i < l; i += 2) {
			var code = parseInt(hex.substr(i, 2), 16);
			if (code === 0) continue; // this is added
			str += String.fromCharCode(code);
		}
		return str;
	}

	static arrayToHex(bytes) {
		if (Array.isArray(bytes)) {
			return (
				'0x' +
				Array.prototype.map
					.call(bytes, function (byte) {
						return ('0' + (byte & 0xff).toString(16)).slice(-2);
					})
					.join('')
			);
		} else {
			return bytes;
		}
	}

	static hexToArray(hex) {
		if (typeof hex === 'string' && hex.beginsWith('0x')) {
			let bytes = [];
			for (let i = 0; i < hex.length; i += 2) {
				bytes.push(parseInt(hex.substr(i, 2), 16));
			}
			return bytes;
		} else {
			return hex;
		}
	}

	static toCondensed(s, begin, end) {
		if (!s) {
			return;
		}
		if (s.length && s.length <= begin + end) {
			return s;
		} else {
			if (end) {
				return `${s.substr(0, begin)}...${s.substr(
					s.length - end,
					end
				)}`;
			} else {
				return `${s.substr(0, begin)}...`;
			}
		}
	}

	static getManifest() {
		return manifest;
	}

	// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	static getUniqueId() {
		return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(
			/[x]/g,
			function (c) {
				var r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			}
		);
	}

	static getConfig() {
		return dappConfig;
	}

	// Return value of this function is used to dynamically re-define getConfig()
	// for use during testing. With this approach, even though getConfig() is static
	// it returns the correct contract addresses as its definition is re-written
	// before each test run. Look for the following line in test scripts to see it done:
	//  DappLib.getConfig = Function(`return ${ JSON.stringify(DappLib.getTestConfig(testDappStateContract, testDappContract, testAccounts))}`);
	static getTestConfig(
		testDappStateContract,
		testDappContract,
		testAccounts
	) {
		return Object.assign({}, dappConfig, {
			dappStateContractAddress: testDappStateContract.address,
			dappContractAddress: testDappContract.address,
			accounts: testAccounts,
			owner: testAccounts[0],
			admins: [testAccounts[1], testAccounts[2], testAccounts[3]],
			users: [
				testAccounts[4],
				testAccounts[5],
				testAccounts[6],
				testAccounts[7],
				testAccounts[8],
			],
			///+test
		});
	}
};
