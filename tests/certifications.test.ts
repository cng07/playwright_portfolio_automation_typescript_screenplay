import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToCertificationsPageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyCertificationsPageContent,
  VerifyCertificationEntries,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
  VerifyExternalLinksHealth,
} from '../src/tasks/LinkValidationTasks';
import { allAttributeValues, currentUrl } from '../src/questions/StateVerification';

test.describe('Certifications page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('Professional').can(BrowseTheWeb, page);
  });

  test('Verify Certifications Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToCertificationsPageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyCertificationsPageContent(),
    );
  });

  test('Verify Certifications Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/certifications'),
      VerifyCertificationsPageContent(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/certifications');
  });

  test('Verify Certifications Page entries', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/certifications'),
      VerifyCertificationEntries(),
    );
  });

  test('Verify Certifications Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/certifications'),
      VerifyNavigationLinkHrefs(),
    );
  });

  test('Verify Certifications external links', async () => {
    await actor.attemptsTo(NavigateToPageDirectly('/certifications'));

    const externalLinks = await actor.asksFor(allAttributeValues('a[href^="http"]', 'href'));
    const urls = Array.from(new Set(
      externalLinks.filter((href) => !href.startsWith('javascript'))
    )).slice(0, 5);

    expect(urls.length, 'Expected at least one external certification link').toBeGreaterThan(0);
    await actor.attemptsTo(VerifyExternalLinksHealth(urls));
  });
});
