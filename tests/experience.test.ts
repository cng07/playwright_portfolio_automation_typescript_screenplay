import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToExperiencePageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyExperiencePageContent,
  VerifyExperiencePageSections,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
  VerifyExperienceCompanyLinks,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('Experience page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('CareerExplorer').can(BrowseTheWeb, page);
  });

  test('Verify Experience Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToExperiencePageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyExperiencePageContent(),
    );
  });

  test('Verify Experience Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/experience'),
      VerifyExperiencePageContent(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/experience');
  });

  test('Verify Experience Page company links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/experience'),
      VerifyExperienceCompanyLinks(),
    );
  });

  test('Verify Experience Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/experience'),
      VerifyNavigationLinkHrefs(),
    );
  });

  test('Verify Experience Page sections', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/experience'),
      VerifyExperiencePageSections(),
    );
  });
});
