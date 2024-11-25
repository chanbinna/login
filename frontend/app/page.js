import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.texts}>
          <img src="https://likelion-ucsd-beginner-project.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flikelion-logo.6b3f26d9.png&w=128&q=75" alt="" />
          <h1>Welcome to LikeLion</h1>
          <p>Learn to code with us!</p>
        </div>
        <div className={styles.ctas}>
          <Link href="/login" className={styles.secondary}>
            Login
          </Link>
          <Link href="/signup" className={styles.secondary}>
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}