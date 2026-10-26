import type { Company } from '~/utils/curriculumVitae'

/** The year in a localised date such as `Abr 2008`; undefined for `Actualidad`. */
const yearOf = (date: string) => Number(date.match(/\d{4}/)?.[0]) || undefined

/**
 * The work experience as pipeline stages, newest first, numbered from the oldest
 * (stage 1) up. Shared by the home page pipeline and the experience page so both
 * count stages and years the same way.
 */
export const useCareer = () => {
  const { tm, rt } = useI18n()

  const text = (value: unknown) => (value ? rt(value as string) : '')
  const list = (value: unknown) => (Array.isArray(value) ? value.map(text) : [])

  const stages = computed(() => {
    const companies = tm('cv.workExperience') as unknown as Company[]
    if (!Array.isArray(companies)) return []

    return companies.map((item, index) => {
      const startDate = text(item.startDate)
      const endDate = text(item.endDate)
      const startYear = yearOf(startDate)
      const endYear = yearOf(endDate)

      return {
        n: companies.length - index,
        position: text(item.position),
        stage: text(item.stage) || text(item.position),
        companyName: text(item.companyName),
        startDate,
        endDate,
        startYear,
        endYear,
        // An end date without a year is "Present" in whatever language.
        isCurrent: !endYear,
        description: list(item.description),
        projects: list(item.projects),
        technologies: list(item.technologies),
      }
    })
  })

  const careerStartYear = computed(() =>
    Math.min(...stages.value.map((stage) => stage.startYear ?? Infinity)),
  )

  const yearsOfExperience = computed(() => new Date().getFullYear() - careerStartYear.value)

  return { stages, careerStartYear, yearsOfExperience }
}
