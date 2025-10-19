#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_LOADER_PATH = path.join(
	__dirname,
	'../modules/learn/data-loader.js'
);

function toFileName(name) {
	return name
		.toLowerCase()
		.replace(/[&\s\/]+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-');
}

function toVarName(name) {
	return name
		.replace(/[^a-zA-Z0-9\s\/]/g, '')
		.split(/[\s\/]+/)
		.map((word, index) =>
			index === 0
				? word.toLowerCase()
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		)
		.join('');
}

function toPropertyName(name) {
	return name
		.split(/\s+/)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

async function create(newData, targetFile) {
	try {
		const fileName = toFileName(targetFile);
		const varName = toVarName(targetFile);
		const propertyName = toPropertyName(targetFile);

		const filePath = path.join(DATA_DIR, `${fileName}.json`);

		try {
			await fs.access(filePath);
			console.log(`File ${fileName}.json already exists. Use 'add' instead.`);
			return;
		} catch {}

		const dataArray = Array.isArray(newData) ? newData : [newData];
		await fs.writeFile(filePath, JSON.stringify(dataArray, null, 2));
		console.log(`Created ${fileName}.json with ${dataArray.length} entries`);

		await updateDataLoader(fileName, varName, propertyName);
	} catch (error) {
		console.error('Error in create:', error.message);
	}
}

async function add(newData, targetFile) {
	try {
		const fileName = toFileName(targetFile);
		const filePath = path.join(DATA_DIR, `${fileName}.json`);

		const existingData = JSON.parse(await fs.readFile(filePath, 'utf8'));

		if (Array.isArray(newData)) {
			existingData.push(...newData);
		} else {
			existingData.push(newData);
		}

		await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
		console.log(
			`Added ${
				Array.isArray(newData) ? newData.length : 1
			} entry/entries to ${fileName}.json (now ${existingData.length} entries)`
		);
	} catch (error) {
		console.error('Error in add:', error.message);
	}
}

async function updateDataLoader(fileName, varName, propertyName) {
	try {
		let content = await fs.readFile(DATA_LOADER_PATH, 'utf8');

		const devImport = `\t\tconst ${varName} = await fetch('/data/${fileName}.json').then(\n\t\t\tresponse => response.json()\n\t\t);`;

		const devReturnIndex = content.indexOf(
			'return {',
			content.indexOf('if (isDevelopment) {')
		);
		const beforeDevReturn = content.lastIndexOf(';', devReturnIndex) + 1;

		if (beforeDevReturn > 0) {
			content =
				content.slice(0, beforeDevReturn) +
				'\n' +
				devImport +
				content.slice(beforeDevReturn);
		}

		const prodImport = `\t\tconst ${varName} = require('../../../data/${fileName}.json');`;

		const prodReturnIndex = content.indexOf(
			'return {',
			content.indexOf('} else {')
		);
		const beforeProdReturn = content.lastIndexOf(';', prodReturnIndex) + 1;

		if (beforeProdReturn > 0) {
			content =
				content.slice(0, beforeProdReturn) +
				'\n' +
				prodImport +
				content.slice(beforeProdReturn);
		}

		const returnEntry = `\t\t\t'${propertyName}': ${varName},`;

		const returnSections = content.matchAll(/return {([\s\S]*?)\n\t\t};/g);

		for (const match of returnSections) {
			const fullReturn = match[0];
			const insideReturn = match[1];

			const cleanedReturn = insideReturn.replace(/\n\s*\n/g, '\n');
			const newInsideReturn = cleanedReturn + '\n' + returnEntry;
			const newReturn = `return {${newInsideReturn}\n\t\t};`;

			content = content.replace(fullReturn, newReturn);
		}

		await fs.writeFile(DATA_LOADER_PATH, content);
		console.log(`✅ Updated data-loader.js with ${fileName}`);
	} catch (error) {
		console.error('❌ Error updating data-loader.js:', error.message);
	}
}

function parseJsonInput(input) {
	const cleaned = input.replace(/,\s*([}\]])/g, '$1');

	try {
		return JSON.parse(cleaned);
	} catch (error) {
		try {
			if (cleaned.trim().startsWith('{') && cleaned.includes('},{')) {
				const wrapped = '[' + cleaned + ']';
				return JSON.parse(wrapped);
			}
			throw new Error('Invalid JSON format. Please check your syntax.');
		} catch (wrapError) {
			throw new Error('Invalid JSON format. Please check your syntax.');
		}
	}
}

async function runCLI() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log('📚 LexiLock Data Manager\n');

	const ask = question =>
		new Promise(resolve => rl.question(question, resolve));

	try {
		console.log('Paste your JSON data and press Enter:');
		const jsonInput = await ask('');

		const targetFile = await ask(
			'\nEnter a category name like "news/politics", "science", "games", etc.: '
		);

		const data = parseJsonInput(jsonInput);

		const fileName = toFileName(targetFile);
		const filePath = path.join(DATA_DIR, `${fileName}.json`);

		try {
			await fs.access(filePath);
			console.log(`📁 Adding to existing file: ${fileName}.json`);
			await add(data, targetFile);
		} catch {
			console.log(`🆕 Creating new file: ${fileName}.json`);
			await create(data, targetFile);
		}

		console.log('✅ Done!');
	} catch (error) {
		console.error('❌ Error:', error.message);
	} finally {
		rl.close();
	}
}

if (require.main === module) {
	runCLI();
}

module.exports = { create, add };
