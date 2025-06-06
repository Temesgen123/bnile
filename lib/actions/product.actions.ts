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
