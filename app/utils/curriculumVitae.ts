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
  /** How the language is used at work, e.g. "professional, daily". */
  usage?: string
  /** One concrete situation that evidences the level. */
  evidence?: string
  /** Where the level stops being comfortable. Stated, not implied. */
  note?: string
  certification?: LanguageCertification
  flag: string
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
export interface Project {
  name: string
  startDate: string
  endDate?: string
  description?: string
  position: string
  developmentMethodologies?: string[] | string
  tools?: string[] | string
  technologies: string[] | string
  url?: string
}
