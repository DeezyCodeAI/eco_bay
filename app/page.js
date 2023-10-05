import db from "../utils/db";
import Homepage from "../components/homepage/page";
import axios from "axios";
import Product from "../models/Product";

export default async function Home() {
 
  db.connectDb();
  let products = await Product.find().sort({ createdAt: -1 }).lean();
  let jsonProducts = JSON.parse(JSON.stringify(products));
  let data = await axios.get("https://api.ipregistry.co/?key=eqe515rrg8bl21pz")
  .then((res) => {
    return res.data.location.country;
  })
  .catch((err) => {
    console.log(err);
  });
  
  let country = data
  return (
    <>
   <div>
    <Homepage products={jsonProducts} country={country}/>
   </div>
    </>
  )
}

