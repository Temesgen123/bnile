'use server';

import mongoose from 'mongoose';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';

import { connectToDataBase } from '../db';
import Product from '../db/models/product.model';
import Review, { IReview } from '../db/models/reviewmodel';
import { formatError } from '../utils';
import { ReviewInputSchema } from '../validator';
import { IReviewDetails, IReviewInput } from '@/types';
import { PAGE_SIZE } from '../constants';

export async function createUpdateReview({
  data,
  path,
}: {
  data: IReviewInput;
  path: string;
}) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error('User not authenticated.');
    }
    const review = ReviewInputSchema.parse({
      ...data,
      user: session?.user?.id,
    });
    await connectToDataBase();
    const existReview = await Review.findOne({
      product: review.product,
      user: review.user,
    });
    if (existReview) {
      existReview.comment = review.comment;
      existReview.rating = review.rating;
      existReview.title = review.title;
      await existReview.save();
      await updateProductReview(review.product);
      revalidatePath(path);
      return {
        success: true,
        message: 'Review updated successully.',
      };
    } else {
      await Review.create(review);
      await updateProductReview(review.product);
      revalidatePath(path);
      return {
        success: true,
        message: 'Review created successfully.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

const updateProductReview = async (productId: string) => {
  const result = await Review.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
  ]);

  const totalReviews = result.reduce((sum, { count }) => sum + count, 0);
  const avgRating =
    result.reduce((sum, { _id, count }) => sum + _id * count, 0) / totalReviews;

  const ratingMap = result.reduce((map, { _id, count }) => {
    map[_id] = count;
    return map;
  }, {});

  const ratingDistribution = [];
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 });
  }

  await Product.findByIdAndUpdate(productId, {
    avgRating: avgRating.toFixed(1),
    numReviews: totalReviews,
    ratingDistribution,
  });
};

export async function getReviews({
  productId,
  limit,
  page,
}: {
  productId: string;
  limit?: number;
  page: number;
}) {
  limit = limit || PAGE_SIZE;
  await connectToDataBase();
  const skipAmount = (page - 1) * limit;
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit);
  console.log(reviews);
  const reviewsCount = await Review.countDocuments({ product: productId });
  return {
    data: JSON.parse(JSON.stringify(reviews)) as IReviewDetails[],
    totalPages: reviewsCount === 0 ? 1 : Math.ceil(reviewsCount / limit),
  };
}

export const getReviewByProductId = async ({
  productId,
}: {
  productId: string;
}) => {
  await connectToDataBase();
  const session = await auth();
  if (!session) {
    throw new Error('User is not authorized.');
  }
  const review = await Review.findOne({
    product: productId,
    user: session?.user?.id,
  });
  return review ? (JSON.parse(JSON.stringify(review)) as IReview) : null;
};
