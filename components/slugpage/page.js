'use client'

import head from 'next/head';
import MainSwiper from '../productPage/mainSwiper/page';
import HeaderPage from '../header/page';
import styles from "../../styles/product.module.scss";
import { useState } from 'react';
import Infospage from '../productPage/infos/page';
import Reviews from '../productPage/reviews/page';

export default function Slugpage({slugProducts, country}) {
    let product = slugProducts;
    const [activeImg, setActiveImg] = useState("");
  return (
    <>
    <head>
      <title>{product.name}</title>
    </head>
    <HeaderPage country={country} />
    <div className={styles.product}>
      <div className={styles.product__container}>
        <div className={styles.path}>
          Home / {product.category.name}
          {product.subCategories.map((sub) => (
            <span>/{sub.name}</span>
          ))}
        </div>
        <div className={styles.product__main}>
          <MainSwiper images={product.images} activeImg={activeImg} />
          <Infospage product={product} setActiveImg={setActiveImg} />
        </div>
        <Reviews product={product} />
        {/* <Reviews product={product} /> */}
        {/*
        <ProductsSwiper products={related} />
        */}
      </div>
    </div>
  </>
  )
}
