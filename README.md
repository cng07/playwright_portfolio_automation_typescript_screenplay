# Playwright Portfolio Automation - Screenplay Pattern

A Playwright test automation project that applies the Screenplay pattern to validate a portfolio site through navigation, UI checks, accessibility checks, and link health verification.

## Screenplay Pattern Overview

The test design is organized around these concepts:

- **Actors**: the users interacting with the application
- **Abilities**: what an actor can do, such as browsing the web
- **Tasks**: higher-level business actions
- **Actions**: reusable low-level interactions
- **Questions**: read operations used for assertions

## Project Structure

```text
src/
|-- actors/         # Actor definitions
|-- abilities/      # Browser and interaction abilities
|-- tasks/          # High-level test operations
|-- actions/        # Low-level UI interactions
|-- questions/      # State verification queries
|-- utils/          # Helper utilities
`-- test-data/      # CSV test data

tests/
|-- home.test.ts
|-- about.test.ts
|-- projects.test.ts
|-- resume.test.ts
|-- contact.test.ts
|-- experience.test.ts
|-- education.test.ts
`-- certifications.test.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run with browser visible
npm run test:headed

# Run in UI mode
npm run test:ui

# Run specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run with debugging
npm run test:debug

# Run smoke tests only
npm run test:smoke
```

## Test Coverage

The suite currently contains 37 tests across 8 spec files:

| Test Suite | Focus |
| --- | --- |
| Home | Homepage UI, navigation, social links, internal route health |
| About | About page content, navigation, route health |
| Projects | Project listing and repository links |
| Resume | Resume content, viewer/download affordances |
| Contact | Contact page structure and form fields |
| Experience | Experience content, sections, company links |
| Education | Education content, entries, institution links |
| Certifications | Certification content, entries, external links |

## Configuration

Key settings live in [playwright.config.ts](./playwright.config.ts):

- Base URL: `https://carlosng07.vercel.app`
- Parallel execution enabled
- Retries enabled on CI
- HTML, JSON, and JUnit reporting in CI
- Screenshots and video retained on failure

## Docker Support

```bash
# Build Docker image
npm run docker:build

# Run tests in Docker
npm run docker:run

# Using docker-compose
npm run docker:compose:up
npm run docker:compose:down
```

## Dependencies

- `@playwright/test`
- `@playwright/mcp`
- `typescript`
- `@fast-csv/parse`
- `fast-csv`

## License

MIT - Copyright 2026 Carlos Ng
