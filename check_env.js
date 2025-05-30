// check_env.js
const dotenv = require('dotenv');

// Explicitly configure dotenv to load from the .env.ci file
// that the previous step creates.
dotenv.config({ path: './.env.ci' });

console.log("--- Node.js Direct Environment Check ---");
console.log(`Node.js DEBUG: process.env.API_BASE_URL = '${process.env.API_BASE_URL}'`);
console.log(`Node.js DEBUG: process.env.API_KEY = '${process.env.API_KEY}'`);
console.log(`Node.js DEBUG: process.env.CI = '${process.env.CI}'`);
console.log("--------------------------------------");