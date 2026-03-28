/**
 * CMS → i18n Override Bridge
 *
 * Loads cms-data.json and injects page content as i18n resource overrides.
 * This means every t('key') call will first check CMS data, then fall back
 * to the hardcoded i18n defaults.
 *
 * The CMS stores pages by slug (home, about, contact, etc.) with field keys
 * like hero_subtitle, bio_1, etc. The frontend i18n uses dotted keys like
 * hero.subtitle, about.bio_1, etc.
 *
 * This module maps CMS page fields → i18n keys using a prefix mapping.
 */
import i18n from 'i18next'

/**
 * Maps CMS page slug + field key → i18n key prefix.
 *
 * For the "home" page, fields are spread across multiple i18n prefixes:
 *   hero_*, home.*, about.* (teaser), opportunities.*, insights.* (teaser)
 *
 * For other pages, the mapping is simpler:
 *   about → about.*
 *   contact → contact.*
 *   organisations → organisations_page.*
 *   insights → insights_page.*
 *   speaking → speaking_page.*
 *   impact → impact_page.*
 *   interests → interests_page.*
 *   wisdom → wisdom_page.*
 *   media → media_page.*
 *   projects → projects_page.*
 *   year-in-review → year_review_page.*
 */

// Home page has a complex mapping — field keys map to different i18n prefixes
const HOME_KEY_PREFIX_MAP: Record<string, string> = {
  // Hero section → hero.*
  hero_badge: 'hero.badge',
  hero_chinese_name: 'hero.chinese_name',
  hero_name: 'hero.name',
  hero_tagline: 'hero.tagline',
  hero_subtitle: 'hero.subtitle',
  hero_cta_insights: 'hero.cta_insights',
  hero_cta_speak: 'hero.cta_speak',
  hero_cta_connect: 'hero.cta_connect',
  // Credential chips → hero.credential_*
  credential_airdi: 'hero.credential_airdi',
  credential_hkirc: 'hero.credential_hkirc',
  credential_tia: 'hero.credential_tia',
  credential_tagdigital: 'hero.credential_tagdigital',
  credential_mh: 'hero.credential_mh',
  credential_un: 'hero.credential_un',
  // Stat labels → hero.stat_*
  hero_stat_years: 'hero.stat_years',
  hero_stat_articles: 'hero.stat_articles',
  hero_stat_roles: 'hero.stat_roles',
  hero_stat_patents: 'hero.stat_patents',
  // About teaser → about.*
  about_teaser_label: 'about.label',
  about_teaser_title: 'about.title',
  about_teaser_desc_1: 'about.bio_1',
  about_teaser_desc_2: 'about.bio_2',
  about_teaser_cta: 'about.full_bio',
  about_teaser_linkedin: 'about.view_linkedin',
  // Formulas → home.formulas_*, home.formula_*
  formulas_label: 'home.formulas_label',
  formulas_title_1: 'home.formulas_title_1',
  formulas_title_2: 'home.formulas_title_2',
  formula_ai_label: 'home.formula_ai_label',
  formula_ai_eq: 'home.formula_ai_eq',
  formula_ai_desc: 'home.formula_ai_desc',
  formula_ind_label: 'home.formula_ind_label',
  formula_ind_eq: 'home.formula_ind_eq',
  formula_ind_desc: 'home.formula_ind_desc',
  formula_gba_label: 'home.formula_gba_label',
  formula_gba_eq: 'home.formula_gba_eq',
  formula_gba_desc: 'home.formula_gba_desc',
  // Achievements → home.achievement_*, home.achievements_*
  achievements_label: 'home.achievements_label',
  achievements_title_1: 'home.achievements_title_1',
  achievements_title_2: 'home.achievements_title_2',
  achievement_patent: 'home.achievement_patent',
  achievement_patent_sub: 'home.achievement_patent_sub',
  achievement_tvc: 'home.achievement_tvc',
  achievement_tvc_sub: 'home.achievement_tvc_sub',
  achievement_apicta: 'home.achievement_apicta',
  achievement_apicta_sub: 'home.achievement_apicta_sub',
  achievement_judging: 'home.achievement_judging',
  achievement_judging_sub: 'home.achievement_judging_sub',
  achievement_prove: 'home.achievement_prove',
  achievement_prove_sub: 'home.achievement_prove_sub',
  achievement_un: 'home.achievement_un',
  achievement_un_sub: 'home.achievement_un_sub',
  // Opportunities → opportunities.*
  opportunities_label: 'opportunities.label',
  opportunities_title: 'opportunities.title',
  opportunities_consulting_title: 'opportunities.consulting_title',
  opportunities_consulting_desc: 'opportunities.consulting_desc',
  opportunities_teaching_title: 'opportunities.teaching_title',
  opportunities_teaching_desc: 'opportunities.teaching_desc',
  opportunities_ceo_title: 'opportunities.ceo_title',
  opportunities_ceo_desc: 'opportunities.ceo_desc',
  opportunities_cta: 'opportunities.cta',
  // Insights teaser → insights.*
  insights_label: 'insights.label',
  insights_title: 'insights.title',
  insights_cta: 'insights.view_all',
  // Media strip
  media_strip_label: 'home.media_strip_label',
}

// Simple prefix mapping for non-home pages
const PAGE_PREFIX_MAP: Record<string, string> = {
  about: 'about',
  contact: 'contact',
  organisations: 'organisations_page',
  insights: 'insights_page',
  speaking: 'speaking_page',
  impact: 'impact_page',
  interests: 'interests_page',
  wisdom: 'wisdom_page',
  media: 'media_page',
  projects: 'projects_page',
  'year-in-review': 'year_review_page',
}

let applied = false

/**
 * Apply CMS page content as i18n overrides.
 * Call this once at app startup after loading cms-data.json.
 */
export function applyCmsOverrides(pages: Record<string, Record<string, string>>) {
  if (applied) return
  applied = true

  const overrides: Record<string, string> = {}

  for (const [slug, content] of Object.entries(pages)) {
    if (!content || typeof content !== 'object') continue

    if (slug === 'home') {
      // Home page uses the complex mapping
      for (const [fieldKey, value] of Object.entries(content)) {
        if (!value || typeof value !== 'string' || !value.trim()) continue
        const i18nKey = HOME_KEY_PREFIX_MAP[fieldKey]
        if (i18nKey) {
          overrides[i18nKey] = value
        }
      }
    } else {
      // Other pages use simple prefix mapping
      const prefix = PAGE_PREFIX_MAP[slug]
      if (!prefix) continue
      for (const [fieldKey, value] of Object.entries(content)) {
        if (!value || typeof value !== 'string' || !value.trim()) continue
        overrides[`${prefix}.${fieldKey}`] = value
      }
    }
  }

  // Apply overrides to i18n
  if (Object.keys(overrides).length > 0) {
    i18n.addResourceBundle('en', 'translation', overrides, true, true)
    console.log(`[CMS] Applied ${Object.keys(overrides).length} i18n overrides from CMS`)
  }
}
