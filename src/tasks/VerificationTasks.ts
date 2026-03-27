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

    log(`Verifying navigation bar`);
    await expect(page.locator('nav')).toBeVisible();

    const navLinks = ['/', '/about', '/projects', '/resume', '/contact', '/experience', '/education', '/certifications'];
    for (const href of navLinks) {
      const link = page.locator(`a[href="${href}"]`).first();
      await expect(link, `Expected navigation link ${href} to be visible`).toBeVisible();
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

    log(`Verifying social media links`);
    const socialLinks = [
      'a[href*="linkedin"]',
      'a[href*="github"]',
      'a[href*="ieee"]',
      'a[href*="astqb"]',
    ];

    for (const selector of socialLinks) {
      const link = page.locator(selector).first();
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
    log(`Verifying featured projects section`);
    await expectVisibleSection(actor, '[class*="project"], [class*="featured"]', 'featured projects section');
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
    log(`Verifying resume page content`);
    await expectVisibleSection(actor, '[class*="pdf"], [class*="resume"], iframe[src*="pdf"]', 'resume content');
    log(`[OK] Resume page content verified`);
    return actor;
  },
});

/**
 * Task: Verify resume page download/viewer affordances
 */
export const VerifyResumeDownloadOptions = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying resume download options`);
    await expectVisibleSection(
      actor,
      'a[download], button:has-text("Download"), iframe[src*="pdf"], [class*="pdf-viewer"]',
      'resume download button or PDF viewer',
    );
    log(`[OK] Resume download options verified`);
    return actor;
  },
});

/**
 * Task: Verify contact page form
 */
export const VerifyContactPageForm = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying contact page form`);
    await expectVisibleSection(actor, 'form, [class*="form"], [class*="contact"]', 'contact form');
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

    log(`Verifying contact page fields`);
    await expect(page.locator('input[name*="name"], input[type="text"]').first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    log(`[OK] Contact page fields verified`);
    return actor;
  },
});

/**
 * Task: Verify experience page content
 */
export const VerifyExperiencePageContent = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying experience page content`);
    await expectVisibleSection(actor, '[class*="experience"], [class*="job"], [class*="role"]', 'experience content');
    log(`[OK] Experience page content verified`);
    return actor;
  },
});

/**
 * Task: Verify experience page sections
 */
export const VerifyExperiencePageSections = () => ({
  performAs: async (actor: Actor) => {
    log(`Verifying experience page sections`);
    await expectVisibleSection(actor, '[class*="job"], [class*="position"], [class*="role"]', 'experience sections');
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
