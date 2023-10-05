'use client'

import Ad from "./Ad";
import Main from "./Main";
import Top from "./Top";
import styles from "./styles.module.scss";

export default function HeaderPage({country}) {
  return (
    <header className={styles.header}>
    <Ad/>
    <Top country={country}/>
    <Main/>
</header>
  )
}



