
const common = [
  '--require-module', 'ts-node/register',
  '--require-module', 'tsconfig-paths/register',
  '--require', 'src/test/support/hooks.ts', 
  '--format', 'summary', 
  '--format-options', '{"snippetInterface":"async-await"}',
  '--publish-quiet' 
].join(' ');


const defaultProfile = [
  common, 
  '--require', 'src/test/stepdefinitions/**/*.ts', 
  'resources/features/**/*.feature',
  '--format', 'json:./test-results/reports/cucumber-default.json', 
  '--format', 'junit:./test-results/junit/results-default.xml' 
].join(' ');


const ui = [
  common, 
  '--tags', '@ui-test',
  '--require', 'src/test/stepdefinitions/ui_steps/**/*.ts', 
  'resources/features/ui_features/**/*.feature', 
  '--format', 'json:./test-results/reports/cucumber-ui.json', 
  '--format', 'junit:./test-results/junit/results-ui.xml' 
].join(' ');

const api = [
  common, 
  '--tags', '@api-test',
  '--require', 'src/test/stepdefinitions/api_steps/**/*.ts',
  '--require', 'src/test/support/api_hooks.ts', 
  'resources/features/api_features/**/*.feature', 
  '--format', 'json:./test-results/reports/cucumber-api.json', 
  '--format', 'junit:./test-results/junit/results-api.xml' 
].join(' ');

module.exports = {
  default: defaultProfile,
  ui: ui,
  api: api
};