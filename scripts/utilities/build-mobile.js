const fs = require('fs').promises;
const path = require('path');

/********************* Path Configuration *********************/
const rootDir = path.resolve(__dirname, '../..');
const outputDir = path.join(rootDir, 'lexilock');

const baseUrl =
	'file:///storage/emulated/0/Android/data/org.cromite.cromite/files/download/lexilock/';

const replacements = [
	{
		pattern: /\.\.\//g,
		replacement: baseUrl,
		filter: filePath => path.basename(filePath) === 'learn.html',
	},
	{
		pattern: /\.\.\//g,
		replacement: baseUrl,
		filter: filePath => path.basename(filePath) === 'fonts.css',
	},
	{
		pattern: /<script>\s*const isDevelopment =[^]*?<\/script>/g,
		replacement:
			'<script src="file:///storage/emulated/0/Android/data/org.cromite.cromite/files/download/lexilock/learn.js"></script>',
		filter: filePath => path.basename(filePath) === 'learn.html',
	},
];

/******************* File Processing Functions *******************/
async function copyFileToLocation(sourcePath, destPath) {
	try {
		await fs.mkdir(path.dirname(destPath), { recursive: true });
		await fs.copyFile(sourcePath, destPath);
		console.log(`Copied: ${sourcePath} -> ${destPath}`);
	} catch (error) {
		console.error(
			`Error copying file ${sourcePath} to ${destPath}:`,
			error.message
		);
	}
}

async function copyDirectory(sourceDir, destDir) {
	try {
		await fs.mkdir(destDir, { recursive: true });

		const items = await fs.readdir(sourceDir, { withFileTypes: true });

		for (const item of items) {
			const sourcePath = path.join(sourceDir, item.name);
			const destPath = path.join(destDir, item.name);

			if (item.isDirectory()) {
				await copyDirectory(sourcePath, destPath);
			} else {
				await copyFileToLocation(sourcePath, destPath);
			}
		}
		console.log(`Copied directory: ${sourceDir} -> ${destDir}`);
	} catch (error) {
		console.error(`Error copying directory ${sourceDir}:`, error.message);
	}
}

/******************** File Selection Logic ********************/
const filesToCopy = [
	{ source: 'fonts', dest: 'fonts', isDirectory: true },

	{ source: 'styles/common.css', dest: 'styles/common.css' },
	{ source: 'styles/fonts.css', dest: 'styles/fonts.css' },
	{ source: 'styles/reset.css', dest: 'styles/reset.css' },
	{ source: 'styles/learn.css', dest: 'styles/learn.css' },
	{
		source: 'styles/variables-common.css',
		dest: 'styles/variables-common.css',
	},
	{ source: 'styles/variables-learn.css', dest: 'styles/variables-learn.css' },

	{ source: 'svg', dest: 'svg', isDirectory: true },

	{ source: 'pages/learn.html', dest: 'learn.html' },
	{ source: 'scripts/bundles/learn.bundle.js', dest: 'learn.js' },

	{ source: 'favicon.ico', dest: 'favicon.ico' },
];

/******************** Main Execution Logic ********************/
async function runReplacements() {
	console.log('Creating mobile build with replaced paths...');
	console.log(`Project root: ${rootDir}`);
	console.log(`Output directory: ${outputDir}`);

	try {
		await fs.rm(outputDir, { recursive: true, force: true });
	} catch (error) {}

	for (const fileConfig of filesToCopy) {
		const sourcePath = path.join(rootDir, fileConfig.source);
		const destPath = path.join(outputDir, fileConfig.dest);

		try {
			await fs.access(sourcePath);

			if (fileConfig.isDirectory) {
				await copyDirectory(sourcePath, destPath);
			} else {
				const fileName = path.basename(sourcePath);
				if (fileName === 'learn.html' || fileName === 'fonts.css') {
					let content = await fs.readFile(sourcePath, 'utf8');
					const rulesForFile = replacements.filter(rule =>
						rule.filter(sourcePath)
					);

					for (const rule of rulesForFile) {
						content = content.replace(rule.pattern, rule.replacement);
					}

					await fs.mkdir(path.dirname(destPath), { recursive: true });
					await fs.writeFile(destPath, content, 'utf8');
					console.log(`Created with replacements: ${destPath}`);
				} else {
					await copyFileToLocation(sourcePath, destPath);
				}
			}
		} catch (error) {
			console.warn(`File/Directory not found: ${sourcePath}`);
		}
	}

	console.log('Mobile build completed!');
	console.log(`Output folder: ${outputDir}`);
}

runReplacements();
