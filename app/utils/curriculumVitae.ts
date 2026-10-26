export interface Personal {
  fullName: string
  name?: string
  position: string
  dateOfBirth?: string
  age?: string
  email?: string
  phoneNumber?: string
  city?: string
}
export interface Summary {
  about?: string
  summary: string[]
}
export interface Company {
  position: string
  /** Short label for the stage in the home page pipeline. Falls back to `position`. */
  stage?: string
  companyName: string
  startDate: string
  endDate?: string
  description: string[] | string
  projects: string[] | string
  technologies: string[] | string
}
export interface WorkExperience {
  companies?: Company[] | null
}

export interface Skill {
  title: string
}

/** One entry of the tools grid: an Iconify name and the label shown under it. */
export interface StackItem {
  icon: string
  name: string
}

/** CEFR band, or `native` for a mother tongue — which CEFR does not describe. */
export type LanguageLevel = 'native' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export interface LanguageCertification {
  /** Official name of the certificate, kept in the language that issued it. */
  title: string
  issuer: string
  /** Optional: left out while the awarding year is unverified. */
  year?: number
  /** Public verification URL, when the issuer publishes one. */
  url?: string
}

export interface Language {
  name: string
  /** BCP-47 tag. Feeds `alternateName` in the schema.org Language object. */
  bcp47: string
  level: LanguageLevel
  /** One line on how the language is used at work: what it is used for, not how well. */
  usage?: string
  certification?: LanguageCertification
}

export interface Education {
  title: string
  school?: string
  scholastic?: string
}
export interface Certification {
  title: string
  school?: string
  scholastic?: string
  urlDescription?: string
  url?: string
}
export interface WorkCertification {
  certifications?: Certification[] | null
}
/** One line of the home page `impacto.log`: a snake_case key and its result. */
export interface ImpactMetric {
  key: string
  value: string
}

export interface CaseStudyFact {
  label: string
  value: string
}

/**
 * A case study: problem, decision and measured result. Each one is a page at
 * `/projects/<slug>`, so the slug is identical in every locale and must also be
 * listed in `SITE_ROUTES`.
 */
export interface CaseStudy {
  slug: string
  years: string
  /** The headline number on the cards, e.g. `2h → 5′`. */
  metric: string
  title: string
  /** One sentence for the cards. */
  summary: string
  /** The opening paragraph of the case study page. */
  lead: string
  facts: CaseStudyFact[]
  before: string
  after: string
  /** What `before` and `after` measure. */
  unit: string
  steps: string[]
  /** The stages of the pipeline the case built, drawn as a flow. */
  flow: string[]
  technologies: string[]
}
