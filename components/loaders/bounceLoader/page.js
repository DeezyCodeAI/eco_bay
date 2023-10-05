import styles from "./styles.module.scss";
import BounceLoader from "react-spinners/BounceLoader";

export default function BounceLoaderpage({ loading }) {
  return (
    <div>
       <div className={styles.loader}>
      <BounceLoader color="#ca4200" loading={loading} />
    </div>
    </div>
  )
}
