import axios from "axios";
import Slugpage from "../../../components/slugpage/page";
import Product from "../../../models/Product";
import styles from "../../../styles/product.module.scss";
import db from "../../../utils/db";
import Category from "../../../models/Category";
import SubCategory from "../../../models/SubCategory";
import User from "../../../models/User";

export default async function ProductSlugpage({params, searchParams}) {

  let data = await axios.get("https://api.ipregistry.co/?key=eqe515rrg8bl21pz")
  .then((res) => {
    return res.data.location.country;
  })
  .catch((err) => {
    console.log(err);
  });
  
  let country = data
  
  const slug = params.slug;
  const style = searchParams.style;
  const size =  searchParams.size || 0;
  
  db.connectDb();
  // 
  let product = await Product.findOne({ slug })
  .populate({path:'category', model: Category})
  .populate({ path: "subCategories", model: SubCategory })
  .populate({ path: "reviews.reviewBy", model: User })
  .lean();
  let subProduct = product.subProducts[style];
  let prices = subProduct.sizes.map((s)=>{
    return s.price;
  }).sort((a,b)=>{
    return a-b;
  })

  let newProduct = {
    ...product,
    style,
    images: subProduct.images,
    sizes: subProduct.sizes,
    discount: subProduct.discount,
    sku: subProduct.sku,
    colors: product.subProducts.map((p)=>{
      return p.color;
    }),
    priceRange: subProduct.discount
      ? `From ${(prices[0] - prices[0] / subProduct.discount).toFixed(2)} to ${(
          prices[prices.length - 1] -
          prices[prices.length - 1] / subProduct.discount
        ).toFixed(2)}$`
      : `From ${prices[0]} to ${prices[prices.length - 1]}$`,
    price:
      subProduct.discount > 0
        ? (
            subProduct.sizes[size].price -
            subProduct.sizes[size].price / subProduct.discount
          ).toFixed(2)
        : subProduct.sizes[size].price,
    priceBefore: subProduct.sizes[size].price,
    quantity: subProduct.sizes[size].qty,
    ratings: [
      {
        percentage: calculatePercentage("5"),
      },
      {
        percentage: calculatePercentage("4"),
      },
      {
        percentage: calculatePercentage("3"),
      },
      {
        percentage: calculatePercentage("2"),
      },
      {
        percentage: calculatePercentage("1"),
      },
    ],
    reviews: product.reviews.reverse(),
    allSizes: product.subProducts
      .map((p) => {
        return p.sizes;
      })
      .flat()
      .sort((a, b) => {
        return a.size - b.size;
      })
      .filter(
        (element, index, array) =>
          array.findIndex((el2) => el2.size === element.size) === index
      ),
  };
  let slugProducts = JSON.parse(JSON.stringify(newProduct));
  const related = await Product.find({ category: product.category._id }).lean();
  //------------
  function calculatePercentage(num) {
    return (
      (product.reviews.reduce((a, review) => {
        return (
          a +
          (review.rating == Number(num) || review.rating == Number(num) + 0.5)
        );
      }, 0) *
        100) /
      product.reviews.length
    ).toFixed(1);
  }
  db.disconnectDb();


  return (
    <div>
      <Slugpage slugProducts={slugProducts} country={country}/>
    </div>
  )
}
