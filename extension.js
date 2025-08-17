// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');

const INTENTO_API_URL = 'https://api.inten.to';

const getApiKey = () => {
	const apiKey = vscode.workspace.getConfiguration('intento').get('apiKey');
	if (!apiKey) {
		throw new Error('Inten.to API key is not set. Please configure it in Settings.');
	}
	return apiKey;
};

const getTargetLanguage = () => {
	const targetLanguage = vscode.workspace.getConfiguration('intento').get('targetLanguage');
	if (!targetLanguage) {
		throw new Error('Target language is not set. Please configure it in Settings.');
	}
	return targetLanguage;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getTranslation(text) {
    const apiKey = getApiKey();
    const targetLanguage = getTargetLanguage();

    const headers = { 'apikey': apiKey, 'Content-Type': 'application/json' };

    const submitResponse = await axios.post(`${INTENTO_API_URL}/ai/text/translate`, {
        context: { text: [text], to: targetLanguage, from: '' },
        service: { routing: 'best_it', async: true }
    }, { headers });

    const operationId = submitResponse.data.id;
    if (!operationId) {
        throw new Error('Failed to submit translation job to Inten.to.');
    }

    const maxRetries = 12;
    for (let i = 0; i < maxRetries; i++) {
        await sleep(1000);
        const resultResponse = await axios.get(`${INTENTO_API_URL}/operations/${operationId}`, { headers });
        const result = resultResponse.data;

        if (result.done) {
            if (result.error) {
                throw new Error(`Inten.to API Error: ${JSON.stringify(result.error)}`);
            }
            const translatedText = result.response?.[0]?.results?.[0];
            if (!translatedText) {
                throw new Error('Could not parse translated text from the API response.');
            }
            return translatedText;
        }
    }

    throw new Error('Translation job timed out. The server took too long to respond.');
}


function activate(context) {
    const translateCommand = vscode.commands.registerCommand('intento.translate', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.selection.isEmpty) {
            vscode.window.showWarningMessage('No text selected for translation.');
            return;
        }

        const selectedText = editor.document.getText(editor.selection);

        try {
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Translating with Inten.to...",
                cancellable: false
            }, async () => {
                const translatedText = await getTranslation(selectedText);

                await vscode.env.clipboard.writeText(translatedText);
                vscode.window.showInformationMessage(`Translated & Copied: ${translatedText}`);
            });
        } catch (error) {
            vscode.window.showErrorMessage(error.message);
            console.error(error);
        }
    });

    context.subscriptions.push(translateCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};