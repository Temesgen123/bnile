'use server';

import { connectToDataBase } from '@/lib/db/index';
import Product, { IProduct } from '@/lib/db/models/product.model';
import { PAGE_SIZE } from '../constants';

export async function getAllCategories() {
  await connectToDataBase();
  const categories = await Product.find({ isPublished: true }).distinct(
    'category'
  );
  return categories;
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDataBase();
  const products = await Product.find(
    {
      tags: { $in: [tag] },
      isPublished: true,
    },
    {
      name: 1,
      href: { $concat: ['/product/', '$slug'] },
      image: { $arrayElemAt: ['$images', 0] },
    }
  )
    .sort({ createdAt: 'desc' })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as {
    name: string;
    href: string;
    image: string;
  }[];
}
//Get Product By Tag
export async function getProducstByTag({
  tag,
  limit = 10,
}: {
  tag: string;
  limit?: number;
}) {
  await connectToDataBase();
  const products = await Product.find({
    tags: { $in: [tag] },
    isPublished: true,
  })
    .sort({ createdAt: 'desc' })
    .limit(limit);
  return JSON.parse(JSON.stringify(products)) as IProduct[];
}

//Get One Product by Slug
export async function getProductBySlug(slug: string) {
  await connectToDataBase();
  const product = await Product.findOne({ slug, isPublished: true });
  if (!product) throw new Error('Product not found.');
  return JSON.parse(JSON.stringify(product)) as IProduct;
}

//Get Related Products : Products with the same category
export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  productId: string;
  limit?: number;
  page: number;
}) {
  await connectToDataBase();
  const skipAmount = (Number(page) - 1) * limit;
  const conditions = {
    isPublished: true,
    category,
    _id: { $ne: productId },
  };
  const products = await Product.find(conditions)
    .sort({ numSells: 'desc' })
    .skip(skipAmount)
    .limit(limit);
  const productsCount = await Product.countDocuments(conditions);
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(productsCount / limit),
  };
}

//Get All Products
export async function getAllProducts({
  query,
  limit,
  page,
  category,
  tag,
  price,
  rating,
  sort,
}: {
  query: string;
  category: string;
  tag: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDataBase();

  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {};
  const categoryFilter = category && category !== 'all' ? { category } : {};
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {};

  const ratingFilter =
    rating && rating !== 'all'
      ? {
          avgRating: {
            $gte: Number(rating),
          },
        }
      : {};
  //  10-50
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {};
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? {
          numSales: -1,
        }
      : sort === 'price-low-to-high'
        ? {
            price: 1,
          }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : {
                _id: -1,
              };
  const isPublished = { isPublished: true };
  const products = await Product.find({
    ...isPublished,
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .sort(order)
    .skip(limit * (Number(page) - 1))
    .limit(limit)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limit),
    totalProducts: countProducts,
    from: limit * (Number(page) - 1) + 1,
    to: limit * (Number(page) - 1) + products.length,
  };
}

export async function getAllTags() {
  const tags = await Product.aggregate([
    {
      $unwind: '$tags',
    },
    {
      $group: {
        _id: null,
        uniqueTags: { $addToSet: '$tags' },
      },
    },
    { $project: { _id: 0, uniqueTags: 1 } },
  ]);

  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  );
}
