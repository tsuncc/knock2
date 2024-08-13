import { ClipLoader } from 'react-spinners'
import styles from './loading-spinner.module.css'

const LoadingSpinner = () => {
  return (
    <div className={styles.spinnerOverlay}>
      <ClipLoader
        color={'var(--sec-1)'}
        size={80}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  )
}

export default LoadingSpinner
