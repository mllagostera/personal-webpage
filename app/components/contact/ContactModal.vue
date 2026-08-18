<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
} from '@headlessui/vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'closed'])

function closeModal() {
  emit('close')
}
</script>

<template>
  <!-- `closed` fires once the leave transition is over and Headless UI has
       released its focus trap, which is the only safe moment to move focus
       back to the trigger. -->
  <TransitionRoot appear :show="isOpen" as="template" @after-leave="emit('closed')">
    <!-- `aria-label` rather than a `DialogTitle` around the heading inside the
         slot: that heading lives in ContactFormContent, which is also rendered
         standalone on /contact, where there is no Dialog context to provide. -->
    <Dialog as="div" :aria-label="$t('contactTitle')" class="relative z-[60]" @close="closeModal">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-950/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900 border border-white/10 p-1 text-left align-middle shadow-2xl transition-all"
            >
              <div class="relative bg-gray-900 rounded-2xl overflow-hidden p-6 md:p-10">
                <!-- Close button -->
                <button
                  :aria-label="$t('close')"
                  class="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors z-20"
                  @click="closeModal"
                >
                  <Icon name="heroicons:x-mark" class="w-6 h-6" />
                </button>

                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
