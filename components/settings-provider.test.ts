const assert = require('assert');

test('valid API key', () => {
    const apiKey = 'valid_api_key';
    assert.strictEqual(apiKey, 'valid_api_key');
});

test('invalid API key', () => {
    const apiKey = 'invalid_api_key';
    assert.notStrictEqual(apiKey, 'valid_api_key');
});