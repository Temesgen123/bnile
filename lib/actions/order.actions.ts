'use server';

import { Cart, OrderItem, ShippingAddress } from '@/types';
import { formatError, round2 } from '../utils';
import { connectToDataBase } from '../db';
import { auth } from '@/auth';
import { OrderInputSchema } from '../validator';
import Order, { IOrder } from '../db/models/ordermodel';
import { AVAILABLE_DELIVERY_DATES } from '../constants';
import { paypal } from '../paypal';
import { sendPurchaseReceipt } from '@/emails';
import { revalidatePath } from 'next/cache';

//Create
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await connectToDataBase();
    const session = await auth();
    if (!session) throw new Error('User not authenticated.');
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    );
    return {
      success: true,
      message: 'Order placed successfully.',
      data: { orderId: createdOrder._id.toString() },
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};
export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calcDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  };
  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  });
  return await Order.create(order);
};

export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ];

  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
          itemsPrice >= deliveryDate.freeShippingMinPrice
        ? 0
        : deliveryDate.shippingPrice;

  // const shippingPrice = itemsPrice > FREE_SHIPPING_MIN_PRICE ? 0 : 5;
  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15);
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  );
  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};

export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectToDataBase();
  const order = await Order.findById(orderId);
  return JSON.parse(JSON.stringify(order));
}

export async function createPayPalOrder(orderId: string) {
  await connectToDataBase();
  try {
    const order = await Order.findById(orderId);
    if (order) {
      const paypalOrder = await paypal.createOrder(order.totalPrice);
      order.paymentResult = {
        id: paypalOrder.id,
        email_address: '',
        status: '',
        pricePaid: '0',
      };
      await order.save();
      return {
        success: true,
        message: 'Paypal order ctreated successfully.',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found.');
    }
  } catch (err) {
    return {
      success: false,
      message: formatError(err),
    };
  }
}

export async function approvePayPalOrder(
  oderId: string,
  data: { orderID: string }
) {
  await connectToDataBase();
  try {
    const order = await Order.findById(oderId).populate('user', 'email');
    if (!order) {
      throw new Error('Order not found.');
    }
    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in paypal payment.');
    }
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    };
    await order.save();
    await sendPurchaseReceipt({ order });
    revalidatePath(`/account/orders/${oderId}`);
    return {
      success: true,
      message: 'Your order has been successfully paid by paypal.',
    };
  } catch (err) {
    return { success: false, message: formatError(err) };
  }
}
