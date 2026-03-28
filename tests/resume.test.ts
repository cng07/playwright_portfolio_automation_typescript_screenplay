import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToResumePageViaMenu,
  NavigateToPageDirectly,
} from '../src/tasks/NavigationTasks';
import {
  VerifyResumePageContent,
  VerifyResumeDownloadOptions,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('Resume page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('Recruiter').can(BrowseTheWeb, page);
  });

  test('Verify Resume Page UI via navigation', async () => {
    await actor.attemptsTo(
      NavigateToResumePageViaMenu(),
      VerifyPageAccessibilityElements(),
      VerifyResumePageContent(),
    );
  });

  test('Verify Resume Page UI via direct URL @smoke', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/resume'),
      VerifyResumePageContent(),
    );

    expect(await actor.asksFor(currentUrl())).toContain('/resume');
  });

  test('Verify Resume Page viewer and download', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/resume'),
      VerifyResumeDownloadOptions(),
    );
  });

  test('Verify Resume Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToPageDirectly('/resume'),
      VerifyNavigationLinkHrefs(),
    );
  });
});
