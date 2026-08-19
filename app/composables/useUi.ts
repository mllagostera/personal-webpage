// The element that opened the modal, so focus can go back to it on close.
// Headless UI restores focus itself for an eagerly mounted dialog, but this one
// is behind `LazyContactModal` and does not exist yet when the trigger is
// pressed, so the restore has to be done here.
//
// Module scope rather than `useState`: a DOM node cannot be serialised into the
// SSR payload. Both functions that touch it are click handlers, so this is only
// ever read or written on the client.
let lastTrigger: HTMLElement | null = null

export const useContactModal = () => {
  const isContactModalOpen = useState('isContactModalOpen', () => false)

  const openContactModal = () => {
    const active = import.meta.client ? document.activeElement : null
    lastTrigger = active instanceof HTMLElement ? active : null
    isContactModalOpen.value = true
  }

  const closeContactModal = () => {
    isContactModalOpen.value = false
  }

  /**
   * Puts focus back on whatever opened the modal.
   *
   * Headless UI's own focus trap restores focus in its `onUnmounted` hook, and
   * because the dialog is lazily mounted the element it captured is stale — it
   * lands on <body>. `afterLeave` fires *before* that unmount flush, so the
   * restore has to be deferred past it or it is immediately undone.
   */
  const restoreContactModalFocus = () => {
    if (!import.meta.client) return

    // The trigger may be gone: on mobile it lives in the nav drawer, which is
    // closed — and unmounted — in the same handler that opens the modal.
    const target = lastTrigger && document.contains(lastTrigger)
      ? lastTrigger
      : document.querySelector<HTMLElement>('main')
    lastTrigger = null

    nextTick(() => {
      requestAnimationFrame(() => target?.focus())
    })
  }

  return {
    isContactModalOpen,
    openContactModal,
    closeContactModal,
    restoreContactModalFocus,
  }
}
