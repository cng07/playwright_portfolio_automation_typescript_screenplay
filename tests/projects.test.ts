import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToProjectsPageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyProjectsPageContent,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
  VerifyProjectRepositoryLinks,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('Projects page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('Developer').can(BrowseTheWeb, page);
  });

  test('Verify Projects Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToProjectsPageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyProjectsPageContent(),
    );
  });

  test('Verify Projects Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/projects'),
      VerifyProjectsPageContent(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/projects');
  });

  test('Verify Projects Page repository links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/projects'),
      VerifyProjectRepositoryLinks(),
    );
  });

  test('Verify Projects Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/projects'),
      VerifyNavigationLinkHrefs(),
    );
  });
});
