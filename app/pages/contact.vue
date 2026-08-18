<script lang="ts" setup>
import ContactDetails from '~/components/contact/ContactDetails.vue'
import ContactFormContent from '~/components/contact/ContactFormContent.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/contact')
</script>

<template>
  <div class="mx-auto w-full overflow-x-hidden pt-8 px-4 2xl:px-0">
    <div id="contact" class="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in-up">
      <ContactDetails />
      <div class="glass-card p-8 md:p-10 border border-white/10">
        <ContactFormContent />
      </div>
    </div>
  </div>
</template>
