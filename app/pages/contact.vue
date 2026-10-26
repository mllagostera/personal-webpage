<script lang="ts" setup>
import ContactDetails from '~/components/contact/ContactDetails.vue'
import ContactFormContent from '~/components/contact/ContactFormContent.vue'

definePageMeta({ layout: 'page' })

useSiteSeo('/contact')
</script>

<template>
  <div id="contact" class="px-4 sm:px-8 py-14 sm:py-16 grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-12">
    <ContactDetails />
    <ContactFormContent />
  </div>
</template>
