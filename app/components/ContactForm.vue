<script setup lang="ts">
interface ContactResponse {
  success: boolean
  message?: string
  messageId?: number
}

const formEl = ref<HTMLFormElement>()
const busy = ref(false)
const status = ref<{ type: 'ok' | 'err'; text: string } | null>(null)

// Live per-field valid/invalid styling, like the old contact.js input listener.
function markValidity(e: Event) {
  const el = e.target as HTMLInputElement | HTMLTextAreaElement
  el.classList.remove('is-valid', 'is-invalid')
  el.classList.add(el.checkValidity() ? 'is-valid' : 'is-invalid')
}

async function onSubmit() {
  const el = formEl.value
  if (!el) return
  if (!el.checkValidity()) {
    el.reportValidity()
    return
  }

  const data = Object.fromEntries(new FormData(el).entries())
  busy.value = true
  status.value = null

  try {
    const result = await $fetch<ContactResponse>('/api/contact', {
      method: 'POST',
      body: data
    })
    status.value = { type: 'ok', text: `// sent. ${result.message} (ref: ${result.messageId})` }
    el.reset()
    el.querySelectorAll('input, textarea').forEach((i) => i.classList.remove('is-valid', 'is-invalid'))
  } catch (err: any) {
    const message = err?.data?.message || (err?.data?.errors ? 'rejected.' : 'network error. server unreachable.')
    status.value = { type: 'err', text: `// error: ${message}` }
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div>
    <form id="contact-form" ref="formEl" class="stacked-form" @submit.prevent="onSubmit">
      <div class="form-group">
        <label for="name">Name *</label>
        <input id="name" type="text" name="name" required minlength="5" maxlength="128" placeholder="Enter your name" title="At least 5 characters" @input="markValidity">
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input id="email" type="email" name="email" required maxlength="256" placeholder="name@example.com" @input="markValidity">
      </div>

      <div class="form-group">
        <label for="phone">Phone (Optional)</label>
        <input id="phone" type="tel" name="phone" minlength="7" placeholder="+421 900 000 000" @input="markValidity">
      </div>

      <div class="form-group">
        <label for="subject">Subject *</label>
        <input id="subject" type="text" name="subject" required minlength="3" maxlength="128" placeholder="Message Subject" @input="markValidity">
      </div>

      <div class="form-group">
        <label for="message">Message *</label>
        <textarea id="message" name="message" required minlength="5" placeholder="Type your message..." @input="markValidity" />
      </div>

      <button type="submit" class="button primary" :class="{ 'is-busy': busy }" :disabled="busy">
        {{ busy ? 'TRANSMITTING...' : 'SEND $' }}
      </button>
    </form>

    <p v-if="status" class="form-status" :class="status.type">{{ status.text }}</p>
  </div>
</template>
