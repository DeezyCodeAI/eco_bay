'use client'

import { Rating } from "@mui/material";
import styles from "./styles.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useState, useEffect} from "react";
import Link from "next/link";
import { TbPlus, TbMinus } from "react-icons/tb";
import { BsHandbagFill, BsHeart } from "react-icons/bs";
import axios from "axios";
import Share from "./share/page";
import Accordian from "./Accordion";
import SimillarSwiper from "./SimilarSwiper";
import { addToCart, updateCart } from "../../../store/cartSlice";

export default function Infospage({product, setActiveImg}) {
  const router = useRouter()
  // get sizes 
  const sizeParams = useSearchParams()
  const dsize = sizeParams.get('size')
  const [size, setSize] = useState(dsize);
  // get styles
  const styleParams = useSearchParams()
  const style = styleParams.get('style')
  // 
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { cart } = useSelector((state) => ({ ...state }));
  console.log("the_cart", cart);
  // useEffect(() => {
  //   dispatch(hideDialog());
  // }, []);


  useEffect(() => {
    setSize("");
    setQty(1);
  }, [style]);


  useEffect(() => {
    if (qty > product.quantity) {
      setQty(product.quantity);
    }
  }, [size]);

  // addToCartHandler
  const addToCartHandler = async () => {
    if (!size) {
      setError("Please Select a size");
      return;
    }
    const { data } = await axios.get(
      `/api/product/${product._id}?style=${product.style}&size=${size}`
    )
    console.log(JSON.stringify(data));
    if (qty > data.quantity) {
      setError(
        "The Quantity you have choosed is more than in stock. Try and lower the Qty"
      );
    } else if (data.quantity  < 1) {
      setError("This Product is out of stock.");
      return;
    } else {
      let _uid = `${product._id}_${product.style}_${size}`;
      console.log("object_uid", _uid);
      let exist = cart.cartItems.find((p) => p._uid === _uid);
      if (exist) {
        let newCart = cart.cartItems.map((p) => {
          if (p._uid == exist._uid) {
            return { ...p, qty: qty };
          }
          return p;
        });
        dispatch(updateCart(newCart));
      } else {
        dispatch(
          addToCart({
            ...data,
            qty,
            size: data.size,
            _uid,
          })
        );
      }
    }
  };
  // addToCartHandler


  return (
    <div className={styles.info}>
        <div className={styles.infos__container}>
            <h1 className={styles.info__name}>{product.name}</h1>
            <h2 className={styles.info__name}>{product.sku}</h2>
            <div className={styles.infos__rating}>
                <Rating
                name="half-rating-read"
                defaultValue={product.rating}
                precision={0.5}
                readOnly
                style={{color: "#FACF19"}}
                />
               ( {product.numReviews}
                {
                  product.numReviews == 1 ? " review" :" reviews "
                })
            </div>

            {/* price */}
            <div className={styles.infos__price}>
            {!size ? <h2>{product.priceRange}</h2> : <h1>{product.price}$</h1>}
          {product.discount > 0 ? (
            <h3>
              {size && <span>{product.priceBefore}$</span>}
              <span>(-{product.discount}%)</span>
            </h3>
          ) : (
            ""
          )}
            </div>
            {/* price */}

            {/* shipping_infos */}
            <span className={styles.infos__shipping}>
                  {
                    product.shipping ? `+${product.shipping}$ Shipping fee` : "Free Shipping"
                  }          
            </span>         
            <span>
                  {
                    size 
                    ? product.quantity
                    : product.sizes.reduce((start,next)=>start+next.qty, 0)
                  }{" "}
                  pieces available.
            </span> 
            {/* shipping_infos */}

            {/* sizes */}
            <div className={styles.infos__sizes}>
          <h4>Select a Size : </h4>
          <div className={styles.infos__sizes_wrap}>
            {product.sizes.map((size, i) => (
              <Link legacyBehavior
                href={`/product/${product.slug}?style=${style}&size=${i}`}
              >
                <div
                  className={`${styles.infos__sizes_size} ${
                    i == size && styles.active_size
                  }`}
                  onClick={() => setSize(size.size)}
                >
                  {size.size}
                </div>
              </Link>
            ))}
          </div>
        </div>
            {/* sizes */}

            {/* colors */}

            <div className={styles.infos__colors}>
          {product.colors &&
            product.colors.map((color, i) => (
              <span
                className={i == style ? styles.active_color : ""}
                onMouseOver={() =>
                  setActiveImg(product.subProducts[i].images[0].url)
                }
                // i=index of the subProduct and 0 the first image
                onMouseLeave={() => setActiveImg("")}
              >
                <Link legacyBehavior href={`/product/${product.slug}?style=${i}`}>
                  <img src={color.image} alt="" />
                </Link>
              </span>
            ))}
        </div>

            {/* colors */}

            {/* quantity */}

            <div className={styles.infos__qty}>
          <button onClick={() => qty > 1 && setQty((prev) => prev - 1)}>
            <TbMinus />
          </button>
          <span>{qty}</span>
          <button
            onClick={() => qty < product.quantity && setQty((prev) => prev + 1)}
          >
            <TbPlus />
          </button>
        </div>

            {/* quantity */}

            {/* actions */}
            <div className={styles.infos__actions}>
          <button
            disabled={product.quantity < 1}
            style={{ cursor: `${product.quantity < 1 ? "not-allowed" : ""}` }}
            onClick={() => addToCartHandler()}
          >
            <BsHandbagFill />
            <b>ADD TO CART</b>
          </button>
          <button onClick={() => handleWishlist()}>
            <BsHeart />
            WISHLIST
          </button>
        </div>
            {/* actions */}
            {error && <span className={styles.error}>{error}</span>}
            {success && <span className={styles.success}>{success}</span>}
            <Share/>
            <Accordian details={[product.description, ...product.details]}/>
            <SimillarSwiper/>
        </div>
    </div>
  )
}
