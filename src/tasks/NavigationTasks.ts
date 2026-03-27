import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { click, openPage, waitForUrl } from '../actions/UserInteractions';
import { log } from '../utils/helpers';

const expectedUrlPattern = (path: string): RegExp => {
  const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^https://carlosng07\\.vercel\\.app${escapedPath}(?:[/?#].*)?$`);
};

const navigateViaMenu = (targetPath: string, label: string) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await actor.attemptsTo(openPage('/'));

    const visibleTargetLink = page.locator(`a[href="${targetPath}"]:visible`).first();
    if (await visibleTargetLink.count() === 0) {
      const moreButton = page.getByRole('button', { name: /More/i });
      if (await moreButton.count() > 0) {
        await moreButton.click();
      }
    }

    await actor.attemptsTo(
      click(`a[href="${targetPath}"]:visible`),
      waitForUrl(targetPath),
    );

    await expect(page).toHaveURL(expectedUrlPattern(targetPath));
    log(`[OK] Navigated to ${label} via menu`);
    return actor;
  },
});

/**
 * Task: Navigate to home page
 */
export const NavigateToHomePage = () => ({
  performAs: async (actor: Actor) => {
    await actor.attemptsTo(openPage('/'));
    log(`[OK] Navigated to home page`);
    return actor;
  },
});

/**
 * Task: Navigate to a specific page via direct URL
 */
export const NavigateToPageDirectly = (path: string) => ({
  performAs: async (actor: Actor) => {
    await actor.attemptsTo(openPage(path));
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    await expect(page).toHaveURL(expectedUrlPattern(path));
    log(`[OK] Navigated to ${path}`);
    return actor;
  },
});

/**
 * Task: Navigate to about page via navigation menu
 */
export const NavigateToAboutPageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/about', 'about page').performAs(actor),
});

/**
 * Task: Navigate to projects page via navigation menu
 */
export const NavigateToProjectsPageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/projects', 'projects page').performAs(actor),
});

/**
 * Task: Navigate to resume page via navigation menu
 */
export const NavigateToResumePageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/resume', 'resume page').performAs(actor),
});

/**
 * Task: Navigate to contact page via navigation menu
 */
export const NavigateToContactPageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/contact', 'contact page').performAs(actor),
});

/**
 * Task: Navigate to experience page via navigation menu
 */
export const NavigateToExperiencePageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/experience', 'experience page').performAs(actor),
});

/**
 * Task: Navigate to education page via navigation menu
 */
export const NavigateToEducationPageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/education', 'education page').performAs(actor),
});

/**
 * Task: Navigate to certifications page via navigation menu
 */
export const NavigateToCertificationsPageViaMenu = () => ({
  performAs: async (actor: Actor) => navigateViaMenu('/certifications', 'certifications page').performAs(actor),
});
