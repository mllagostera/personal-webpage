import type { Company, Education, Personal } from '~/utils/curriculumVitae'
import { SITE_OG_IMAGE, absoluteUrl } from '~~/shared/site'

/**
 * Injects a schema.org ProfilePage / Person block.
 *
 * Every value is read from the same i18n messages that render the page and from
 * `app.config.ts`, so the structured data can never drift from the visible CV.
 */
export const useProfileJsonLd = (path: string = '/') => {
  const { awesome } = useAppConfig()
  const { tm, rt } = useI18n()

  const jsonLd = computed(() => {
    const information = tm('cv.information') as unknown as Personal
    const education = tm('cv.education') as unknown as Education
    const experience = tm('cv.workExperience') as unknown as Company[]
    const summary = tm('cv.summary.summary') as unknown as string[]
    const technologies = tm('cv.technologies') as unknown as string[]

    const currentRole = Array.isArray(experience) ? experience[0] : undefined
    const links = awesome?.project?.links || {}

    const name = information?.fullName ? rt(information.fullName) : awesome?.author?.name || ''
    const jobTitle = currentRole?.position ? rt(currentRole.position) : ''
    const employer = currentRole?.companyName ? rt(currentRole.companyName) : ''
    const school = education?.school ? rt(education.school) : ''
    const knowsAbout = Array.isArray(technologies) ? technologies.map((t) => (t ? rt(t) : '')).filter(Boolean) : []
    const description = Array.isArray(summary) ? summary.map((s) => (s ? rt(s) : '')).filter(Boolean).join(' ') : ''
    const sameAs = [links.linkedin, links.github, links.x, links.stackshare].filter(Boolean)

    const person: Record<string, unknown> = {
      '@type': 'Person',
      '@id': `${absoluteUrl('/')}#person`,
      name,
      url: absoluteUrl('/'),
      image: absoluteUrl(SITE_OG_IMAGE),
    }

    if (description) person.description = description
    if (jobTitle) person.jobTitle = jobTitle
    if (employer) person.worksFor = { '@type': 'Organization', name: employer }
    if (school) person.alumniOf = { '@type': 'CollegeOrUniversity', name: school }
    if (knowsAbout.length) person.knowsAbout = knowsAbout
    if (sameAs.length) person.sameAs = sameAs

    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${absoluteUrl(path)}#profilepage`,
      url: absoluteUrl(path),
      name,
      mainEntity: person,
    }
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(jsonLd.value)),
      },
    ],
  })
}
