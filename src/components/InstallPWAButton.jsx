import usePWAInstall from '../usePWAInstall'
import { useState } from 'react'
import "../styles/install.css"

export default function InstallPWAButton() {
  const { install, canInstall, isInstalled } = usePWAInstall()
  const [hidden, setHidden] = useState(false)

  if (isInstalled || !canInstall || hidden) return null

  return (
    <div className="pwa-install-wrapper">
      <div className="pwa-install-card">

        <div>
          <strong>SmartDesk</strong>
          <div className="pwa-install-sub">
            Install for faster access & offline use
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            className="pwa-install-btn"
            onClick={install}
          >
            Install
          </button>

          <button
            className="pwa-install-close"
            onClick={() => setHidden(true)}
          >
            ✕
          </button>
        </div>

      </div>
    </div>
  )
}
