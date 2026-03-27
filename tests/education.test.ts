import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToEducationPageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyEducationPageContent,
  VerifyEducationPageEntries,
  VerifyEducationInstitutionLinks,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('Education page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('Student').can(BrowseTheWeb, page);
  });

  test('Verify Education Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToEducationPageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyEducationPageContent(),
    );
  });

  test('Verify Education Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/education'),
      VerifyEducationPageContent(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/education');
  });

  test('Verify Education Page entries', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/education'),
      VerifyEducationPageEntries(),
    );
  });

  test('Verify Education Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/education'),
      VerifyNavigationLinkHrefs(),
    );
  });

  test('Verify Education Page university/institution links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/education'),
      VerifyEducationInstitutionLinks(),
    );
  });
});
