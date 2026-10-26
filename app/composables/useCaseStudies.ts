import type { CaseStudy, CaseStudyFact } from '~/utils/curriculumVitae'

/**
 * The case studies from the locale files, unwrapped, with the values the
 * listings derive from them: the page path, the `.md` file name the cards show,
 * and a short stack line.
 */
export const useCaseStudies = () => {
  const { tm, rt } = useI18n()

  const text = (value: unknown) => (value ? rt(value as string) : '')
  const list = (value: unknown) => (Array.isArray(value) ? value.map(text) : [])

  const caseStudies = computed(() => {
    const items = tm('cv.caseStudies') as unknown as CaseStudy[]
    if (!Array.isArray(items)) return []

    return items.map((item) => {
      const slug = text(item.slug)
      const technologies = list(item.technologies)

      return {
        slug,
        to: `/projects/${slug}`,
        file: `${slug}.md`,
        years: text(item.years),
        metric: text(item.metric),
        title: text(item.title),
        summary: text(item.summary),
        lead: text(item.lead),
        facts: (Array.isArray(item.facts) ? item.facts : []).map((fact: CaseStudyFact) => ({
          label: text(fact.label),
          value: text(fact.value),
        })),
        before: text(item.before),
        after: text(item.after),
        unit: text(item.unit),
        steps: list(item.steps),
        flow: list(item.flow),
        technologies,
        // The cards have room for four; the case study page lists them all.
        stack: technologies.slice(0, 4).join(' · '),
      }
    })
  })

  return { caseStudies }
}
