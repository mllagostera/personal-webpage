export const useContactModal = () => {
  const isContactModalOpen = useState('isContactModalOpen', () => false)
  
  const openContactModal = () => {
    isContactModalOpen.value = true
  }
  
  const closeContactModal = () => {
    isContactModalOpen.value = false
  }

  return {
    isContactModalOpen,
    openContactModal,
    closeContactModal
  }
}
