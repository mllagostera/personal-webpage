/**
 * The social profiles from `app.config.ts`, in the order the footer and the
 * contact page list them. Entries without a URL are left out.
 */
export const useSocialLinks = () => {
  const { awesome } = useAppConfig()

  return computed(() =>
    [
      { href: awesome?.project?.links?.linkedin, icon: 'mdi:linkedin', label: 'LinkedIn' },
      { href: awesome?.project?.links?.github, icon: 'mdi:github-face', label: 'GitHub' },
      // Drawn a step smaller: the X logo fills its box, the mdi glyphs do not.
      { href: awesome?.project?.links?.x, icon: 'simple-icons:x', label: 'X', small: true },
      { href: awesome?.project?.links?.stackshare, icon: 'mdi:stack-exchange', label: 'StackShare' },
    ].filter((link): link is { href: string, icon: string, label: string, small?: boolean } => !!link.href),
  )
}
