import { expect, test } from '@playwright/test';
import { Actor, Actor_Builder } from '../src/actors/Actor';
import { BrowseTheWeb } from '../src/abilities/BrowseTheWeb';
import {
  NavigateToHomePage,
  NavigateToAboutPageViaMenu,
  NavigateToProjectsPageViaMenu,
} from '../src/tasks/NavigationTasks';
import {
  VerifyHomePageNavigationBar,
  VerifyHomePageHeroSection,
  VerifyHomePageSocialMediaLinks,
  VerifyHomePageFeaturedProjects,
  VerifyPageAccessibilityElements,
} from '../src/tasks/VerificationTasks';
import {
  VerifyNavigationLinkHrefs,
  VerifySocialMediaLinkHrefs,
  VerifyInternalPagesAccessible,
} from '../src/tasks/LinkValidationTasks';
import { currentUrl } from '../src/questions/StateVerification';

test.describe('Home page', () => {
  let actor: Actor;

  test.beforeEach(async ({ page }) => {
    actor = Actor_Builder('John').can(BrowseTheWeb, page);
  });

  test('Verify Home Page UI elements', async () => {
    await actor.attemptsTo(
      NavigateToHomePage(),
      VerifyPageAccessibilityElements(),
      VerifyHomePageNavigationBar(),
      VerifyHomePageHeroSection(),
      VerifyHomePageSocialMediaLinks(),
      VerifyHomePageFeaturedProjects(),
    );
  });

  test('Verify Home Page navigation links', async () => {
    await actor.attemptsTo(
      NavigateToHomePage(),
      VerifyNavigationLinkHrefs(),
    );
  });

  test('Verify Home Page social media links', async () => {
    await actor.attemptsTo(
      NavigateToHomePage(),
      VerifySocialMediaLinkHrefs(),
    );
  });

  test('Verify all internal pages are accessible', async () => {
    await actor.attemptsTo(VerifyInternalPagesAccessible());
  });

  test('Verify navigation to About page via menu @smoke', async () => {
    await actor.attemptsTo(NavigateToAboutPageViaMenu());
    expect(await actor.asksFor(currentUrl())).toContain('/about');
  });

  test('Verify navigation to Projects page via menu @smoke', async () => {
    await actor.attemptsTo(NavigateToProjectsPageViaMenu());
    expect(await actor.asksFor(currentUrl())).toContain('/projects');
  });
});
