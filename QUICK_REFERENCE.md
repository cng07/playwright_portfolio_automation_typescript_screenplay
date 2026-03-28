# Quick Reference Guide - Screenplay Pattern Testing

## Screenplay Pattern Overview

The project follows this basic flow:

```text
Actor performs a Task
  -> Task coordinates Actions
  -> Actions use Abilities
  -> Questions read state for assertions
```

## Core Components

### Actors

- Represent test users
- Hold abilities
- Example: `Actor_Builder('John').can(BrowseTheWeb, page)`

### Abilities

- Grant actors capabilities
- Current implementation: `BrowseTheWeb`
- Wrap the Playwright `page` object

### Tasks

- Express business-level intent
- Used for navigation, verification, and link health checks

### Actions

- Reusable low-level interactions
- Examples: `openPage`, `click`, `fill`, `waitForUrl`

### Questions

- Read application state for assertions
- Examples: `currentUrl`, `elementCount`, `allAttributeValues`

## Quick Start

### Install

```bash
npm install
```

### Run Tests

```bash
npm test
npm run test:headed
npm run test:chrome
npm run test:smoke
npm run test:debug
npm run test:ui
```

### Basic Test Example

```typescript
import { expect, test } from '@playwright/test';
import { Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import { NavigateToHomePage } from '../src/tasks/NavigationTasks';
import { VerifyHomePageNavigationBar } from '../src/tasks/VerificationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test('Home navigation', async ({ page }) => {
  const actor = Actor_Builder('John').can(BrowseTheWeb, page);

  await actor.attemptsTo(
    NavigateToHomePage(),
    VerifyHomePageNavigationBar(),
  );

  expect(await actor.asksFor(currentUrl())).toContain('/');
});
```

## Project Structure

```text
src/
|-- actors/                  # Actor definitions
|-- abilities/               # Abilities
|-- tasks/                   # Navigation and verification tasks
|-- actions/                 # Low-level interactions
|-- questions/               # State queries
|-- utils/                   # Helper functions
`-- test-data/               # CSV test data

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

## Common Patterns

### Navigation

```typescript
await actor.attemptsTo(NavigateToAboutPageViaMenu());
await actor.attemptsTo(NavigateToPageDirectly('/about'));
```

### Verification

```typescript
await actor.attemptsTo(VerifyPageAccessibilityElements());
await actor.attemptsTo(VerifyProjectsPageContent());
```

### Questions

```typescript
const url = await actor.asksFor(currentUrl());
const links = await actor.asksFor(allAttributeValues('a[href^="http"]', 'href'));
```

### Link Health

```typescript
await actor.attemptsTo(VerifyNavigationLinkHrefs());
await actor.attemptsTo(VerifyExternalLinksHealth(urls));
await actor.attemptsTo(VerifyInternalPagesAccessible());
```

## Debugging

```bash
npx playwright test tests/home.test.ts
npx playwright test tests/home.test.ts --debug
npm run test:headed
npm test -- --reporter=list
```

## Reports

```bash
npm run ci
```

Generated outputs:

- `test-results/results.json`
- `test-results/results.xml`
- Playwright HTML report output

## Docker

```bash
npm run docker:build
npm run docker:run
npm run docker:compose:up
npm run docker:compose:down
```

## Useful Links

- https://serenity-js.org/handbook/screenplaypattern/
- https://playwright.dev/
- https://cucumber.io/docs/bdd/
