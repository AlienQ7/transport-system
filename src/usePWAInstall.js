import { useEffect, useState } from 'react'

export default function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice

    if (choice?.outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  return {
    install,
    canInstall: !!deferredPrompt,
    isInstalled
  }
}
