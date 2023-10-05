'use client'
import styles from "../../../styles/cart.module.scss";
import Empty from "../empty/page";

export default function CartMainpage() {
  const cart = [];
  return (
    <>
     <div className={styles.cart}>
        {
          cart.length > 1 ? (
          <div className={styles.cart__container}></div>
          )
          :
          (
         <Empty/>
          )}
      </div>
    </>
  );
          };
