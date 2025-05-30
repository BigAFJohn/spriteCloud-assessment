const { execSync } = require('child_process');

try {
  const testType = process.env.TEST_ENV || 'ui';
  const cucumberProfile = testType === 'ui' ? 'ui' : 'api';

  console.log('Running Cucumber Tests with profile:', cucumberProfile);
  execSync(`npx cucumber-js -p default -p ${cucumberProfile}`, { stdio: 'inherit' });
} catch (error) {
  console.error('Test run failed');
  process.exit(1);
}
