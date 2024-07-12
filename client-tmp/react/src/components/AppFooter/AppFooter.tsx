import GenesisLogo from '../../assets/logo-icon--light.svg';
import ReactLogo from '../../assets/react-icon.svg';
import styles from './AppFooter.module.css';

function AppFooter() {
  return (
    <section className={styles.appFooter}>
      <img src={ReactLogo} alt="Angular logo" />
      <span>x</span>
      <img src={GenesisLogo} alt="Genesis logo" />
    </section>
  );
}

export default AppFooter;
