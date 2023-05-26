import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'

export default defineStore('tableSecurity', () => {
  const loader = useLoader()

  const pinEnabled = ref(false)
  const pinCode = ref('')

  const saveSettings = async () => {
    loader.showLoader('security')
    const config = {
      pinEnabled: pinEnabled.value ? 1 : 0,
      pinCode: pinCode.value
    }

    await table.post('/settings/security', config)
    window.tablePin = pinCode.value
    loader.hideLoader('security')
  }

  const getSecurityConfig = async () => {
    loader.showLoader('security')
    const resp = await table.get('/settings/security')
    const data = resp.data.security
    pinCode.value = data.pinCode ?? ''
    pinEnabled.value = (data.pinEnabled ?? 0) === 1
    loader.hideLoader('security')
  }

  getSecurityConfig().then(() => {})

  return {
    pinCode,
    pinEnabled,
    saveSettings
  }
})