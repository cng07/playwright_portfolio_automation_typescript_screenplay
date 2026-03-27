import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToAboutPageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyAboutPageContent,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
  VerifyInternalPagePathsAccessible,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('About page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('Sarah').can(BrowseTheWeb, page);
  });

  test('Verify About Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToAboutPageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyAboutPageContent(),
    );
  });

  test('Verify About Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/about'),
      VerifyAboutPageContent(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/about');
  });

  test('Verify About Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/about'),
      VerifyNavigationLinkHrefs(),
    );
  });

  test('Verify About Page API links health', async () => {
    await actor.attemptsTo(VerifyInternalPagePathsAccessible(['/about']));
  });
});
