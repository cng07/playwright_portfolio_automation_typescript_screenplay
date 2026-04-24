import { expect } from '@playwright/test';
import { Actor } from '../actors/Actor';
import { BrowseTheWeb } from '../abilities/BrowseTheWeb';
import { log } from '../utils/helpers';

const expectVisibleSection = async (actor: Actor, selector: string, description: string): Promise<void> => {
  const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
  const section = page.locator(selector);
  const count = await section.count();

  expect(count, `Expected ${description} to exist`).toBeGreaterThan(0);

  let firstVisibleIndex = -1;
  for (let i = 0; i < count; i++) {
    if (await section.nth(i).isVisible()) {
      firstVisibleIndex = i;
      break;
    }
  }

  expect(firstVisibleIndex, `Expected ${description} to have at least one visible match`).toBeGreaterThanOrEqual(0);
  await expect(section.nth(firstVisibleIndex), `Expected ${description} to be visible`).toBeVisible();
};

/**
 * Task: Verify home page navigation bar
 */
export const VerifyHomePageNavigationBar = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const primaryNav = page.getByRole('navigation', { name: /Primary/i });

    log(`Verifying navigation bar`);
    await expect(primaryNav).toBeVisible();

    for (const linkName of ['Home', 'Projects', 'About', 'Contact']) {
      await expect(
        primaryNav.getByRole('link', { name: linkName, exact: true }),
        `Expected primary navigation link ${linkName} to be visible`,
      ).toBeVisible();
    }

    const resumePrimaryLink = primaryNav.getByRole('link', { name: 'Resume', exact: true });
    const qaLabPrimaryLink = primaryNav.getByRole('link', { name: 'QA Lab', exact: true });
    if ((await resumePrimaryLink.count()) > 0) {
      await expect(resumePrimaryLink, 'Expected Resume primary navigation link to be visible').toBeVisible();
    } else {
      await expect(
        qaLabPrimaryLink,
        'Expected QA Lab primary navigation link to be visible when Resume is not present',
      ).toBeVisible();
    }

    const overflowLinks = ['Experience', 'Education', 'Certifications'];
    const visibleOverflowLinkCount = await primaryNav.locator(
      'a[href="/experience"]:visible, a[href="/education"]:visible, a[href="/certifications"]:visible',
    ).count();

    if (visibleOverflowLinkCount >= overflowLinks.length) {
      for (const linkName of overflowLinks) {
        await expect(
          primaryNav.getByRole('link', { name: linkName, exact: true }),
          `Expected overflow navigation link ${linkName} to be visible`,
        ).toBeVisible();
      }
    } else {
      const moreButton = primaryNav.getByRole('button', { name: /More/i });
      await expect(moreButton, 'Expected More button for overflow navigation').toBeVisible();
      await moreButton.click();

      for (const linkName of overflowLinks) {
        await expect(
          primaryNav.getByRole('menuitem', { name: linkName, exact: true }),
          `Expected overflow menu item ${linkName} to be visible`,
        ).toBeVisible();
      }
    }

    log(`[OK] Navigation bar verified`);
    return actor;
  },
});

/**
 * Task: Verify home page hero section
 */
export const VerifyHomePageHeroSection = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying hero section`);
    await expectVisibleSection(actor, 'h1, [class*="hero"]', 'hero section');
    log(`[OK] Hero section verified`);
    return actor;
  },
});

/**
 * Task: Verify home page social media links
 */
export const VerifyHomePageSocialMediaLinks = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const mainContent = page.locator('#main-content, main, [role="main"]').first();

    log(`Verifying social media links`);
    const socialLinks = [
      'a[href*="linkedin.com"]',
      'a[href*="github.com"]',
      'a[href*="ieeexplore.ieee.org"]',
      'a[href*="atsqa.org"], a[href*="astqb"]',
    ];

    for (const selector of socialLinks) {
      const link = mainContent.locator(selector).first();
      await expect(link, `Expected social link ${selector} to exist`).toBeVisible();
    }

    log(`[OK] Social media links verified`);
    return actor;
  },
});

/**
 * Task: Verify home page featured projects section
 */
export const VerifyHomePageFeaturedProjects = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const mainContent = page.locator('#main-content, main, [role="main"]').first();

    log(`Verifying featured projects section`);
    await expect(page.getByRole('heading', { name: /Featured Projects/i })).toBeVisible();
    await expect(
      mainContent.getByRole('link', { name: /Repository/i }).first(),
      'Expected at least one featured project repository link',
    ).toBeVisible();
    await expect(
      mainContent.getByRole('link', { name: /View All Projects/i }),
      'Expected View All Projects link',
    ).toBeVisible();
    log(`[OK] Featured projects section verified`);
    return actor;
  },
});

/**
 * Task: Verify page accessibility elements
 */
export const VerifyPageAccessibilityElements = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying accessibility elements`);

    const mainContent = page.locator('#main-content, main, [role="main"]').first();
    await expect(mainContent, 'Expected a main content landmark').toBeVisible();

    const skipLink = page.locator('a[href="#main-content"], [class*="skip"]').first();
    if (await skipLink.count() > 0) {
      await expect(skipLink).toHaveAttribute('href', /#main-content/);
    }

    log(`[OK] Accessibility elements verified`);
    return actor;
  },
});

/**
 * Task: Verify about page content
 */
export const VerifyAboutPageContent = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying about page content`);
    const headingCount = await page.locator('h1, h2').count();
    expect(headingCount, 'Expected about page headings').toBeGreaterThan(0);
    log(`[OK] About page content verified`);
    return actor;
  },
});

/**
 * Task: Verify projects page content
 */
export const VerifyProjectsPageContent = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying projects page content`);
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: /View Repository/i }).first()).toBeVisible();
    log(`[OK] Projects page content verified`);
    return actor;
  },
});

/**
 * Task: Verify resume page content
 */
export const VerifyResumePageContent = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying resume page content`);
    await expect(page.getByRole('heading', { name: 'Resume', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
    log(`[OK] Resume page content verified`);
    return actor;
  },
});

/**
 * Task: Verify resume page download/viewer affordances
 */
export const VerifyResumeDownloadOptions = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying resume download options`);
    await expect(page.getByRole('button', { name: /Download PDF/i })).toBeVisible();
    log(`[OK] Resume download options verified`);
    return actor;
  },
});

/**
 * Task: Verify contact page form
 */
export const VerifyContactPageForm = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const mainContent = page.locator('#main-content, main, [role="main"]').first();
    const contactMethods = mainContent.locator(
      'a[href^="mailto:"], a[href*="linkedin.com"], a[href*="github.com"], a[href*="ieeexplore.ieee.org"], a[href*="atsqa.org"]',
    );

    log(`Verifying contact page form`);
    await expect(page.getByRole('heading', { name: /Get in Touch/i })).toBeVisible();
    expect(await contactMethods.count(), 'Expected visible contact methods in main content').toBeGreaterThanOrEqual(5);
    await expect(contactMethods.first(), 'Expected at least one contact method to be visible').toBeVisible();
    log(`[OK] Contact page form verified`);
    return actor;
  },
});

/**
 * Task: Verify contact page fields
 */
export const VerifyContactPageFields = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const mainContent = page.locator('#main-content, main, [role="main"]').first();

    log(`Verifying contact page fields`);
    const contactLinks = [
      { selector: 'a[href^="mailto:"]', description: 'email contact link' },
      { selector: 'a[href*="linkedin.com/in/"]', description: 'LinkedIn contact link' },
      { selector: 'a[href*="github.com"]', description: 'GitHub contact link' },
      { selector: 'a[href*="ieeexplore.ieee.org"]', description: 'IEEE contact link' },
      { selector: 'a[href*="atsqa.org"]', description: 'AT*SQA profile link' },
    ];

    for (const contactLink of contactLinks) {
      await expect(
        mainContent.locator(contactLink.selector).first(),
        `Expected ${contactLink.description} to be visible`,
      ).toBeVisible();
    }

    log(`[OK] Contact page fields verified`);
    return actor;
  },
});

/**
 * Task: Verify experience page content
 */
export const VerifyExperiencePageContent = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying experience page content`);
    await expect(page.getByRole('heading', { name: /Work Experience/i })).toBeVisible();
    await expectVisibleSection(actor, 'main ul, main ol, main [role="list"]', 'experience content');
    log(`[OK] Experience page content verified`);
    return actor;
  },
});

/**
 * Task: Verify experience page sections
 */
export const VerifyExperiencePageSections = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();
    const experienceLists = page.locator('main ul, main ol, main [role="list"]');

    log(`Verifying experience page sections`);
    expect(await experienceLists.count(), 'Expected multiple experience sections').toBeGreaterThanOrEqual(3);
    await expect(experienceLists.first(), 'Expected the first experience section to be visible').toBeVisible();
    await expect(page.getByText(/Senior Quality Assurance Automation Engineer/i)).toBeVisible();
    log(`[OK] Experience page sections verified`);
    return actor;
  },
});

/**
 * Task: Verify education page content
 */
export const VerifyEducationPageContent = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying education page content`);
    await expect(page.getByRole('heading', { name: 'Education', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Asia Pacific College/i })).toBeVisible();
    log(`[OK] Education page content verified`);
    return actor;
  },
});

/**
 * Task: Verify education page entries
 */
export const VerifyEducationPageEntries = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying education page entries`);
    await expect(page.getByRole('heading', { name: /Asia Pacific College/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Makati Science High School/i })).toBeVisible();
    log(`[OK] Education page entries verified`);
    return actor;
  },
});

/**
 * Task: Verify education page institution links
 */
export const VerifyEducationInstitutionLinks = () => ({
  performAs: async (actor: Actor) => {
    const page = actor.recall<BrowseTheWeb>(BrowseTheWeb).getPage();

    log(`Verifying education page institution links`);
    await expect(page.locator('a[href*="ieeexplore.ieee.org"]').first()).toBeVisible();
    log(`[OK] Education page institution links verified`);
    return actor;
  },
});

/**
 * Task: Verify certifications page content
 */
export const VerifyCertificationsPageContent = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying certifications page content`);
    await expectVisibleSection(actor, '[class*="cert"], [class*="badge"], [class*="award"]', 'certifications content');
    log(`[OK] Certifications page content verified`);
    return actor;
  },
});

/**
 * Task: Verify certification entries
 */
export const VerifyCertificationEntries = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying certification entries`);
    await expectVisibleSection(actor, '[class*="cert"], [class*="badge"], [class*="award"], [class*="credential"]', 'certification entries');
    log(`[OK] Certification entries verified`);
    return actor;
  },
});
