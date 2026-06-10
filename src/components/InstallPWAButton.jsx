import usePWAInstall from '../usePWAInstall'

export default function InstallPWAButton() {
  const { install, canInstall, isInstalled } = usePWAInstall()

  if (isInstalled) return null
  if (!canInstall) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <p style={{ margin: 0 }}>Install Transport App</p>
        <button onClick={install} style={styles.button}>
          Install
        </button>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: 20,
    left: 20,
    zIndex: 9999
  },
  card: {
    background: '#0f172a',
    color: 'white',
    padding: '12px 14px',
    borderRadius: 10,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
  },
  button: {
    background: '#22c55e',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 6,
    cursor: 'pointer',
    color: 'black',
    fontWeight: 'bold'
  }
}
