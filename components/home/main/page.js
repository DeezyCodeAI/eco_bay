import HeaderMainpage from "./header";
import Mainmenu from "./menu";
import MainOfferspage from "./offers";
import styles from "./styles.module.scss";
import MainSwiper from "./swiper";
import MainUserpage from "./user";

export default function HomeMainpage() {
  return (
    <>
    <div className={styles.main}>
      <HeaderMainpage/>
      <Mainmenu/>
      <MainSwiper/>
      <MainOfferspage/>
      <MainUserpage/>
    </div>
    </>
  )
}
