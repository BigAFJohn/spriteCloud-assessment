# End-to-End Testing Framework

This repository hosts a robust End-to-End (E2E) testing framework built with Playwright, Cucumber.js, and TypeScript. It is designed to facilitate both Web UI and API testing with a focus on maintainability, scalability, and clear reporting.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Features](#features)
3.  [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Environment Configuration](#environment-configuration)
    * [Running Tests Locally](#running-tests-locally)
4.  [Project Structure](#project-structure)
5.  [CI/CD Pipeline (GitHub Actions)](#cicd-pipeline-github-actions)
    * [GitHub Secrets](#github-secrets)
    * [Workflow Details](#workflow-details)
    * [Viewing Results](#viewing-results)


---

## 1. Project Overview

This framework provides an automated testing solution for web application:
• End-to-end checkout of ≥2 items, asserting final total price
• Sort products by Name (Z→A) and verify order
• Verify proper error on failed login and API:
• GET a paginated users list
• POST login (successful)
• PUT update a user
• DELETE a user
• Two custom negative scenarios (e.g. missing fields)
• Parameterized delayed GET (≤ 3 s) and measure response time
 It leverages the Behavior-Driven Development (BDD) approach with Cucumber.js, allowing tests to be written in a human-readable Gherkin syntax, while Playwright handles the browser automation and API interactions efficiently.

## 2. Features

* **Behavior-Driven Development (BDD):** Tests are written in Gherkin (`.feature` files) using Cucumber.js, promoting collaboration between technical and non-technical stakeholders.
* **Web UI Testing:** Utilizes Playwright for fast, reliable, and headless browser automation across Chromium, Firefox (though currently configured for Chromium in local browser launch, UI tests are designed to be cross-browser compatible).
* **API Testing:** Leverages Playwright's `request` context for making HTTP requests, enabling robust API test automation.
* **TypeScript:** All test code, step definitions, and utilities are written in TypeScript for enhanced type safety, maintainability, and developer experience.
* **Page Object Model (POM):** UI tests follow the POM design pattern, separating test logic from page element locators and interactions, improving reusability and readability.
* **Modular Design:** Step definitions, hooks, and utility functions are organized into logical modules for better maintainability.
* **Environment Management:** Configurable base URLs and other parameters via `.env` files for local development and GitHub Secrets for CI/CD environments.
* **CI/CD Integration:** Automated testing pipeline configured with GitHub Actions, running tests on every push to `main` and publishing results.
* **JUnit XML Reporting:** Generates JUnit XML reports for easy integration with CI platforms, providing clear pass/fail status in the GitHub Actions tab.

## 3. Getting Started

Follow these steps to set up and run the tests locally.

### Prerequisites

* **Node.js:** Version 18 or higher (LTS recommended).
    * Download from [nodejs.org](https://nodejs.org/).
* **npm:** Node Package Manager (comes with Node.js).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BigAFJohn/spriteCloud-assessment.git
    cd spriteCloud-assignment
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Install Playwright browser binaries:**
    ```bash
    npx playwright install --with-deps
    ```

### Environment Configuration

Test execution relies on environment variables for base URLs and other settings.

1.  **Create a `.env` file:**
    In the root of your project, create a file named `.env`.
2.  **Add required variables:**
    Populate it with the following essential variables:
    ```env
    # Base URL for your UI application
    BASE_URL= https://www.saucedemo.com

    # Base URL for your API endpoints
    API_BASE_URL= https://reqres.in

    # API_KEY= your_api_key_here

    # Set to 'ui', 'api'
    # TEST_ENV=ui

    # Set to 'true' to record video on local runs (disabled in CI)
    # RECORD_VIDEO=false
    ```
    *These variables will be automatically loaded by `dotenv` in the `hooks.ts`.*

### Running Tests Locally

Use the predefined npm scripts to execute tests.

* **Run UI Tests:**
    ```bash
    npm run test:ui
    ```
    (This will run features tagged with `@ui-test`.)

* **Run API Tests:**
    ```bash
    npm run test:api
    ```
    (This will run features tagged with `@api-test`.)

* **Run Default Tests:**
    ```bash
    npm run test
    ```
    (This will run features *not* tagged with `@ui-test` or `@api-test`.)

After execution, JUnit XML reports will be generated in `test-results/junit/`.

## 4. Project Structure

The key directories and files are organized as follows:

.
├── .github/                     # GitHub Actions workflows
│   └── workflows/
│       └── pipeline.yml         # CI/CD pipeline definition
├── src/
│   └── test/
│       ├── support/             # Global configurations, hooks, and custom types
│       │   ├── hooks.ts         # Cucumber Before/After hooks, browser/context setup
│       │   ├── world.ts         # Custom Cucumber World definition
│       │   ├── CustomWorld.ts   # Custom World interface for TypeScript
│       │   └── Logger.ts        # Utility for logging
│       ├── stepdefinitions/     # Cucumber step definitions
│       │   ├── api_steps/       # API-specific step definitions
│       │   └── ui_steps/        # UI-specific step definitions
│       ├── pages/               # Page Object Models (POM) for UI elements and interactions
│       │   ├── LoginPage.ts
│       │   ├── BasePage.ts
│       │   ├── CartPage.ts
│       │   ├── CheckoutCompletePage.ts
│       │   ├── CheckoutConfirmationPage.ts
│       │   ├── CheckoutInformationPage.ts
│       │   └── ProductListPage.ts
│       └── utils/               # General utility functions
│           ├── Logger.ts        # Utility for logging
│           └── assertions.ts    # Custom assertion helpers
├── resources/
│   └── features/                # Gherkin feature files
│       ├── api_features/        # API test feature files
│       └── ui_features/         # UI test feature files
├── .env                         # Environment variables (local)
├── cucumber.js                  # Cucumber.js configuration for profiles
├── playwright.config.ts         # Playwright configuration (timeouts, reporters, browser settings)
├── package.json                 # Project dependencies and scripts
└── tsconfig.json                # TypeScript configuration

## 5. CI/CD Pipeline (GitHub Actions)

The project includes a GitHub Actions workflow that automates the testing process.

* **Location:** `.github/workflows/pipeline.yml`
* **Triggers:** The pipeline runs automatically on:
    * Every `push` to the `main` branch.
    * Every `pull_request` targeting the `main` branch.
* **Parallel Execution:** The pipeline consists of two parallel jobs:
    * `ui_tests`: Runs all UI-related E2E tests.
    * `api_tests`: Runs all API-related E2E tests.
* **Reporting:**
    * Each job generates a separate JUnit XML report (`results-ui.xml` and `results-api.xml`).
    * These reports are uploaded as artifacts in the Actions tab.

### GitHub Secrets

For secure handling of sensitive environment variables in CI/CD, the pipeline leverages GitHub Secrets. You **must** configure these in your GitHub repository:

1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
3.  Click on **New repository secret**.
4.  Add the following secrets:
    * `BASE_URL`:  
    * `API_BASE_URL`: 
    * `API_KEY`: 

### Workflow Details

Each job (`ui_tests` and `api_tests`) performs the following steps:

1.  **Checkout Repository:** Fetches the code.
2.  **Setup Node.js:** Configures the Node.js environment.
3.  **Install NPM Dependencies:** Installs all project dependencies using `npm ci`.
4.  **Install Playwright Browsers:** (Only for `ui_tests`) Installs necessary browser binaries for Playwright.
5.  **Set Environment Variables:** Sets `BASE_URL`, `API_BASE_URL`, and other necessary variables directly from GitHub Secrets.
6.  **Run Cucumber Tests:** Executes the respective `npm run test:ui` or `npm run test:api` command.
7.  **Upload JUnit XML Results Artifact:** Stores the generated XML report as a downloadable artifact.
8.  **Publish JUnit Test Results Summary:** Displays a summary of test results directly in the GitHub Actions run overview.

### Viewing Results

1.  Navigate to the **Actions** tab in your GitHub repository.
2.  Click on any workflow run.
3.  You will see two separate job summaries: "Run UI Tests" and "Run API Tests". Each will have a detailed breakdown of passed/failed tests directly in the GitHub UI.
4.  You can also download the raw JUnit XML files from the "Summary" section of the workflow run under the "Artifacts" heading.

---