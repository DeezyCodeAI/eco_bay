import { NextResponse } from "next/server";
import db from "../../../../utils/db";
import Product from "../../../../models/Product";

export async function GET(req, res) {
    try {
        db.connectDb();
        const id = req.params.id;
        const style = req.searchParams.style;
        const size = req.searchParams.size;
        const product = await Product.findById(id).lean();
        console.log("object_product", product)
        let discount = product.subProducts[style].discount;
        let priceBefore = product.subProducts[style].sizes[size].price;
        let price = discount ? priceBefore - priceBefore / discount : priceBefore;
        db.disconnectDb();
        return res.json({
          _id: product._id,
          style: Number(style),
          name: product.name,
          description: product.description,
          slug: product.slug,
          sku: product.subProducts[style].sku,
          brand: product.brand,
          category: product.category,
          subCategories: product.subCategories,
          shipping: product.shipping,
          images: product.subProducts[style].images,
          color: product.subProducts[style].color,
          size: product.subProducts[style].sizes[size].size,
          price,
          priceBefore,
          quantity: product.subProducts[style].sizes[size].qty,
        });
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
          );
    }
};
