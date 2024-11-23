const vscode = require('vscode');
const fs = require('fs');

function activate(context) {

	// Get paths to CSS and JS files in the extension
	const extensionPath = context.extensionPath;
	let cssPath = extensionPath + "/css.css";
	let jsPath = extensionPath + "/js.js";

	// Validate the existence of CSS and JS files
	if (!fs.existsSync(cssPath)) {
		vscode.window.showErrorMessage('Custom CSS file not found.');
		return;
	}
	if (!fs.existsSync(jsPath)) {
		vscode.window.showErrorMessage('Custom JS file not found.');
		return;
	}

	cssPath = "file:///" + cssPath;
	jsPath = "file:///" + jsPath;

	// Get the current user settings
	const config = vscode.workspace.getConfiguration();

	// Get the current imports array
	let customCssImports = config.get('vscode_custom_css.imports') || [];

	// Ensure the imports array exists and is an array
	if (!Array.isArray(customCssImports)) {
		customCssImports = [];
	}

	// Add the new CSS import if it's not already in the array
	if (!customCssImports.includes(cssPath) && !customCssImports.includes(jsPath)) {
		customCssImports.push(cssPath);
		customCssImports.push(jsPath);

		// Update the settings with the modified array
		config.update('vscode_custom_css.imports', customCssImports, vscode.ConfigurationTarget.Global)
			.then(() => {
				vscode.window.showInformationMessage('Custom CSS and JS import added successfully!');
			}, (error) => {
				vscode.window.showErrorMessage(`Failed to update settings: ${error.message}`);
			});

		config.update('breadcrumbs.enabled', false, vscode.ConfigurationTarget.Global)
	}
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
};
