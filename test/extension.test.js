const assert = require('assert');
const vscode = require('vscode');
const sinon = require('sinon');
const axios = require('axios');
const extension = require('../extension');

suite('Inten.to VSCode Translator', () => {
    let sandbox;
    let showErrorStub, showWarningStub, showInfoStub;
    let configStub;

    setup(() => {
        sandbox = sinon.createSandbox();
        
        showErrorStub = sandbox.stub(vscode.window, 'showErrorMessage');
        showWarningStub = sandbox.stub(vscode.window, 'showWarningMessage');
        showInfoStub = sandbox.stub(vscode.window, 'showInformationMessage');
        
        configStub = sandbox.stub(vscode.workspace, 'getConfiguration');
        configStub.returns({
            get: (key) => {
                if (key === 'apiKey') return 'test-api-key';
                if (key === 'targetLanguage') return 'en';
                return null;
            }
        });
    });

    teardown(() => {
        sandbox.restore();
    });

    test('validate api key config', () => {
        configStub.returns({
            get: (key) => key === 'apiKey' ? '' : 'en'
        });
        
        assert.throws(
            () => extension.getApiKey(),
            /API key is not set/
        );
    });

    test('validate target lang', () => {
        configStub.returns({
            get: (key) => key === 'targetLanguage' ? '' : 'test-key'
        });
        
        assert.throws(
            () => extension.getTargetLanguage(),
            /Target language is not set/
        );
    });

    test('handle success translation', async () => {
        const postStub = sandbox.stub(axios, 'post').resolves({
            data: { id: 'op-123' }
        });
        
        const getStub = sandbox.stub(axios, 'get').resolves({
            data: {
                done: true,
                response: [{ results: ['Hello World'] }]
            }
        });

        const result = await extension.getTranslation('Hola Mundo', 'test-key', 'en');
        
        assert.strictEqual(result, 'Hello World');
        assert(postStub.calledOnce);
        assert(getStub.calledOnce);
    });

    test('handle api errors', async () => {
        sandbox.stub(axios, 'post').rejects(new Error('Network error'));
        
        await assert.rejects(
            () => extension.getTranslation('text', 'key', 'en'),
            /Network error/
        );
    });

    test('handle api timeout', async () => {
        sandbox.stub(axios, 'post').resolves({ data: { id: 'op-123' } });
        sandbox.stub(axios, 'get').resolves({ data: { done: false } });
        
        sandbox.stub(global, 'setTimeout').yields();
        
        await assert.rejects(
            () => extension.getTranslation('text', 'key', 'en'),
            /Translation job timed out/
        );
    });
});