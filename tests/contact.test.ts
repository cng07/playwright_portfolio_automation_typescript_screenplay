import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToContactPageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyContactPageForm,
  VerifyContactPageFields,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('Contact page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('Visitor').can(BrowseTheWeb, page);
  });

  test('Verify Contact Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToContactPageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyContactPageForm(),
    );
  });

  test('Verify Contact Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/contact'),
      VerifyContactPageForm(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/contact');
  });

  test('Verify Contact Page form fields', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/contact'),
      VerifyContactPageFields(),
    );
  });

  test('Verify Contact Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/contact'),
      VerifyNavigationLinkHrefs(),
    );
  });
});
