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

export interface Language {
  name: string
  level: string
  /** CEFR label as shown, e.g. "C2 (Nativo)". Localised, so it lives in the locale. */
  levelLabel: string
  /** Percentage the progress bar fills to. */
  proficiency: number
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
