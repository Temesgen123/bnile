import { z } from 'zod';
import { formatNumberWithDecimal } from './utils';

//common
const MongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid MongoDB Id' });

const Price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (value) => (
        /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
        `${field} must have exactly two decimal places (e.g., 49.99)`
      )
    );
//Product
export const ReviewInputSchema = z.object({
  product: MongoId,
  user: MongoId,
  isVerifiedPurchase: z.boolean(),
  title: z.string().min(1, 'Title is required.'),
  comment: z.string().min(1, 'Comment is required.'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5.'),
});

export const ProductInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  slug: z.string().min(3, 'Slug must be at least 3 characters.'),
  category: z.string().min(1, 'Category is required.'),
  images: z.array(z.string()).min(1, 'Product must have at least 1 image.'),
  brand: z.string().min(1, 'Brand is required.'),
  description: z.string().min(1, 'Description is required.'),
  isPublished: z.boolean(),
  price: Price('Price'),
  listPrice: Price('List price'),
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative('Count in stock must be a non-negative number'),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, 'Average rating must be at least 0.')
    .max(5, 'Average rating must be at most 5'),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative('Number of reviews must be non-negative number.'),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),
  reviews: z.array(ReviewInputSchema).default([]),
  numSales: z.coerce
    .number()
    .int()
    .nonnegative('Number of sales must be a non-negative number.'),
});

//OrderItem
export const OrderItemSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  product: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'name is required'),
  slug: z.string().min(1, 'slug is required'),
  category: z.string().min(1, 'Category is required'),
  quantity: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative number.'),
  countInStock: z
    .number()
    .int()
    .nonnegative('Quantity must be a non-negative number.'),
  image: z.string().min(1, 'Image is required.'),
  price: Price('Price'),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  street: z.string().min(1, 'Address is required.'),
  city: z.string().min(1, 'City is required.'),
  postalCode: z.string().min(1, 'Postal Code is required.'),
  province: z.string().min(1, 'Province is required.'),
  phone: z.string().min(1, 'Phone is required.'),
  country: z.string().min(1, 'Country is required.'),
});

//Order
export const OrderInputSchema = z.object({
  user: z.union([
    MongoId,
    z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  ]),
  items: z
    .array(OrderItemSchema)
    .min(1, 'Order must contain at least one item'),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
  itemsPrice: Price('Items price'),
  shippingPrice: Price('Shipping price'),
  taxPrice: Price('Tax price '),
  totalPrice: Price('Total price'),
  expectedDeliveryDate: z
    .date()
    .refine(
      (value) => value > new Date(),
      'Expected delivery date must be in the future.'
    ),
  isDelivered: z.boolean().default(false),
  deliveredAt: z.date().optional(),
  isPaid: z.boolean().default(false),
  paidAt: z.date().optional(),
});

//Cart
export const CartSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, 'Order must contain at least one item.'),
  itemsPrice: z.number(),
  taxPrice: z.optional(z.number()),
  shippingPrice: z.optional(z.number()),
  totalPrice: z.number(),
  paymentMethod: z.optional(z.string()),
  shippingAddress: z.optional(ShippingAddressSchema),
  deliveryDateIndex: z.optional(z.number()),
  expectedDeliveryDate: z.optional(z.date()),
});

//User
const UserName = z
  .string()
  .min(2, { message: 'User name must be al least 2 characters.' })
  .max(50, { message: 'User name must be at most 50 characters. ' });
const Email = z
  .string()
  .min(1, 'Email is required.')
  .email('Email is invalid.');
const Password = z.string().min(3, 'Password must be at least 3 chararcters.');
const UserRole = z.string().min(1, 'Role is required.');

export const UserInputSchema = z.object({
  name: UserName,
  email: Email,
  image: z.string().optional(),
  emailVerified: z.boolean(),
  role: UserRole,
  password: Password,
  paymentMethod: z.string().min(1, 'Payment method is required.'),
  address: z.object({
    fullName: z.string().min(1, 'Full name is required.'),
    street: z.string().min(1, 'Street name is required.'),
    city: z.string().min(1, 'City name is required.'),
    province: z.string().min(1, 'Province is required.'),
    postalCode: z.string().min(1, 'Postalcode  is required.'),
    country: z.string().min(1, 'Country name is required.'),
    phone: z.string().min(1, 'Phone number is required.'),
  }),
});

export const UserSignInSchema = z.object({ email: Email, password: Password });

export const UserSignUpSchema = UserSignInSchema.extend({
  name: UserName,
  confirmPassword: Password,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password doesn't match.",
  path: ['confirmPassword'],
});

export const UserNameSchema = z.object({
  name: UserName,
});
