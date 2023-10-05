'use client'

import Image from 'next/image';
import styles from '../../styles/Home.module.scss';
import FooterPage from '../../components/footer/page';
import HeaderPage from '../../components/header/page';
import { useSession } from 'next-auth/react';
import { M_PLUS_1 } from 'next/font/google';
import HomeMainpage from '../home/main/page';
import FlashDealspage from '../home/flashDeals/page';
import CategoryHomepage from '../home/category/page';
import { women_accessories, women_dresses, women_shoes, women_swiper } from '../data/home';
import { useMediaQuery } from "react-responsive";
import ProductsSwiperpage from '../productsSwiper/page';
import ProductCardpage from '../productCard/page';

export default function Homepage({ country, products }) {
    const { data: session } = useSession();
    console.log(session)
    const isMedium = useMediaQuery({ query: "(max-width:850px)" });
    const isMobile = useMediaQuery({ query: "(max-width:550px)" });
    
  return (
    <div>
    <HeaderPage country={country}/>
    <div className={styles.home}>
    <div className={styles.container}>
        <HomeMainpage/>
        <FlashDealspage/>
        <div className={styles.home__category}>
          <CategoryHomepage 
              header="Dresses"
              products={women_dresses}
              background="#5a31f4"
              />

            {!isMedium && (
              <CategoryHomepage 
                header="Shoes"
                products={women_shoes}
                background="#3c811f"
              />
            )}
            {isMobile && (
              <CategoryHomepage 
                header="Shoes"
                products={women_shoes}
                background="#3c811f"
              />
            )}
            <CategoryHomepage 
              header="Accessories"
              products={women_accessories}
              background="#ca4200"
            />
        </div>
        <ProductsSwiperpage products={women_swiper} />

        <div className={styles.products}>
            {products.map((product) => (
              <ProductCardpage product={product} key={product._id} />
            ))}
          </div>

    </div>
    </div>
    <FooterPage country={country}/>
    </div>
  )
}
