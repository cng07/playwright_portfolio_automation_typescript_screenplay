import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { verifyUrlsApiResponses, verifyInternalPathsApiResponses, log } from '../utils/helpers';

const expectHealthyStatuses = (results: Map<string, number>, description: string): void => {
  const unhealthy = Array.from(results.entries()).filter(([, status]) => status < 200 || status >= 400);
  expect(unhealthy, `Expected healthy responses for ${description}`).toEqual([]);
};

/**
 * Task: Verify external links health
 */
export const VerifyExternalLinksHealth = (urls: string[]) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying ${urls.length} external links`);
    expect(urls.length, 'Expected at least one external URL to verify').toBeGreaterThan(0);

    const results = await verifyUrlsApiResponses(page, urls, { timeout: 5000 });
    expectHealthyStatuses(results, 'external links');

    log(`[OK] External links verification complete (${results.size}/${results.size} passed)`);
    return actor;
  },
});

/**
 * Task: Verify internal paths health
 */
export const VerifyInternalPathsHealth = (paths: string[]) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying ${paths.length} internal paths`);
    expect(paths.length, 'Expected at least one internal path to verify').toBeGreaterThan(0);

    const results = await verifyInternalPathsApiResponses(page, paths, { timeout: 5000 });
    expectHealthyStatuses(results, 'internal paths');

    log(`[OK] Internal paths verification complete (${results.size}/${results.size} passed)`);
    return actor;
  },
});

/**
 * Task: Verify navigation link hrefs
 */
export const VerifyNavigationLinkHrefs = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying navigation link hrefs`);
    const navLinks = [
      { href: '/', name: 'Home' },
      { href: '/about', name: 'About' },
      { href: '/projects', name: 'Projects' },
      { href: '/resume', name: 'Resume' },
      { href: '/contact', name: 'Contact' },
      { href: '/experience', name: 'Experience' },
      { href: '/education', name: 'Education' },
      { href: '/certifications', name: 'Certifications' },
    ];

    for (const link of navLinks) {
      const linkElement = page.locator(`a[href="${link.href}"]`).first();
      await expect(linkElement, `Expected ${link.name} navigation link`).toHaveAttribute('href', link.href);
    }

    log(`[OK] Navigation link hrefs verified`);
    return actor;
  },
});

/**
 * Task: Verify social media link hrefs
 */
export const VerifySocialMediaLinkHrefs = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const mainContent = page.locator('#main-content, main, [role="main"]').first();

    log(`Verifying social media link hrefs`);
    const socialLinks = [
      { selector: 'a[href*="linkedin.com"]', pattern: /linkedin\.com/i, name: 'LinkedIn' },
      { selector: 'a[href*="github.com"]', pattern: /github\.com/i, name: 'GitHub' },
      { selector: 'a[href*="ieeexplore.ieee.org"]', pattern: /ieeexplore\.ieee\.org/i, name: 'IEEE' },
      { selector: 'a[href*="atsqa.org"], a[href*="astqb"]', pattern: /atsqa\.org|astqb/i, name: 'AT*SQA / ASTQB' },
    ];

    for (const social of socialLinks) {
      const linkElement = mainContent.locator(social.selector).first();
      await expect(linkElement, `Expected ${social.name} social link`).toHaveAttribute('href', social.pattern);
    }

    log(`[OK] Social media link hrefs verified`);
    return actor;
  },
});

/**
 * Task: Verify project repository links
 */
export const VerifyProjectRepositoryLinks = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying project repository links`);
    const repoLinks = page.locator('a[href*="github.com"]');
    const count = await repoLinks.count();

    expect(count, 'Expected at least one project repository link').toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 10); i++) {
      await expect(repoLinks.nth(i)).toHaveAttribute('href', /github\.com/);
    }

    log(`[OK] Project repository links verified (${count} found)`);
    return actor;
  },
});

/**
 * Task: Verify company links in experience section
 */
export const VerifyExperienceCompanyLinks = (urls: string[] = []) => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying company links`);
    const companyLinks = page.locator('[class*="experience"] a, [class*="job"] a, [class*="role"] a');
    const count = await companyLinks.count();

    expect(count, 'Expected at least one company link').toBeGreaterThan(0);
    await expect(companyLinks.first()).toBeVisible();

    if (urls.length > 0) {
      const results = await verifyUrlsApiResponses(page, urls, { timeout: 5000 });
      expectHealthyStatuses(results, 'experience company links');
    }

    log(`[OK] Experience company links verified`);
    return actor;
  },
});

/**
 * Task: Verify internal page paths are accessible
 */
export const VerifyInternalPagesAccessible = () => ({
  performAs: async (actor: Actor) => {
    await VerifyInternalPathsHealth([
      '/about',
      '/projects',
      '/resume',
      '/contact',
      '/experience',
      '/education',
      '/certifications',
    ]).performAs(actor);

    log(`[OK] All internal pages accessibility verified`);
    return actor;
  },
});

/**
 * Task: Verify specific internal page paths are accessible
 */
export const VerifyInternalPagePathsAccessible = (paths: string[]) => ({
  performAs: async (actor: Actor) => {
    await VerifyInternalPathsHealth(paths).performAs(actor);
    log(`[OK] Internal page paths accessibility verified`);
    return actor;
  },
});
