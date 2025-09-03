import styles from "./Header.module.css";
import { FaLinkedin, FaGithub, FaFileAlt } from "react-icons/fa";

function Header() {
  return (
    <header className={styles.header}>
      <a href="a" className={styles.logo}>
        <span>Tunely</span>
      </a>
      <nav className={styles.icons}>
         <a href="https://www.linkedin.com/in/vinicius-vicente-developer"
          target="_blank"
          rel="noopener noreferrer"
          >
        <FaLinkedin className={styles.headerIcons} />
      </a>
        <a href="https://github.com/viniovicente99" 
        target="_blank"
        rel="noopener noreferrer"
        >
        <FaGithub className={styles.headerIcons} />
      </a>
        <a href="/curriculo_2025.docx"
        download="curriculo_2025.docx"
        rel="noopener noreferrer"
        >
        <FaFileAlt className={styles.headerIcons}/>
      </a>
      </nav>
    </header>
  );
}
export default Header;
