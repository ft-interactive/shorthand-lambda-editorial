/**
 * Tests for Utils
 */

const { readFileSync } = require('fs');
const { resolve } = require('path');
const chai = require('chai');
chai.use(require('sinon-chai'));
const utils = require('./utils');

const expect = chai.expect;

describe('tests for the Utils module', () => {
  describe('getUUID', () => {
    it('returns a UUID given a HTML DOM string', () => {
      const fixture = readFileSync(
        resolve(__dirname, '..', 'test-fixtures', 'index.html'),
        { encoding: 'utf8' }
      );

      const result = utils.getUUID(fixture);

      expect(result).to.be.a.string;
    });
  });
});