'use client';

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { Card, CardContent } from '@/components/ui/card';

import {
  createPayPalOrder,
  approvePayPalOrder,
} from '@/lib/actions/order.actions';
import { IOrder } from '@/lib/db/models/ordermodel';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import CheckoutFooter from '../checkout-footer';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProductPrice from '@/components/shared/product/product-price';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripeForm from './stripe-form';

//OrderDetailsForm ***
export default function OrderPaymentForm({
  order,
  paypalClientId,
  clientSecret,
}: {
  order: IOrder;
  paypalClientId: string;
  isAdmin: boolean;
  clientSecret: string | null;
}) {
  const router = useRouter();
  const {
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    expectedDeliveryDate,
    isPaid,
  } = order;
  if (isPaid) {
    redirect(`/account/orders/${order._id}`);
  }

  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';
    if (isPending) {
      status = 'Loading PayPal...';
    } else if (isRejected) {
      status = 'Error in loading paypal.';
    }
    return status;
  }
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order._id);
    if (!res.success) {
      return toast.error(res.message, { description: res.message });
    }
    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order._id, data);
    toast(`${res.message}`, { description: res.message });
  };

  const CheckoutSummary = () => (
    <Card>
      <CardContent className="p-4">
        <div className=" bg-slate-200 p-2">
          <div className="text-lg font-bold ">Order Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items: </span>
              <span>
                {' '}
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className="flex justify-between">
              <span> Shipping & Handling</span>
              <span>
                {shippingPrice === undefined ? (
                  '__'
                ) : shippingPrice === 0 ? (
                  'Free'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax: </span>
              <span>
                {taxPrice === undefined ? (
                  '__'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-lg">
              <span>Order Total: </span>
              <span>
                {' '}
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
            {!isPaid && paymentMethod === 'PayPal' && (
              <div className="">
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            {!isPaid && paymentMethod === 'Stripe' && clientSecret && (
              <Elements options={{ clientSecret }} stripe={stripePromise}>
                <StripeForm
                  priceInCents={Math.round(order.totalPrice * 100)}
                  orderId={order._id}
                />
              </Elements>
            )}
            {!isPaid && paymentMethod === 'Cash On Delivery' && (
              <Button
                className="w-full rounded-full"
                onClick={() => {
                  router.push(`/account/orders/${order._id}`);
                }}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  return (
    <main className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {/* {Shipping address} */}
          <div className="">
            <div className="grid md:grid-cols-3 my-3 pb-3">
              <div className="text-lg font-bold">
                <span>Shipping Address</span>
              </div>
              <div className="col-span-2">
                <p>
                  {shippingAddress.fullName} <br />
                  {shippingAddress.street} <br />
                  {`${shippingAddress.city}, ${shippingAddress.province}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
                </p>
              </div>
            </div>
          </div>
          {/* {Payment Method} */}
          <div className="border-y">
            <div className="grid md:grid-cols-3 my-3 pb-3">
              <div className="text-lg font-bold">
                <span>Payment Method</span>
              </div>
              <div className="col-span-2">
                <p>{paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 my-3 pb-3">
            <div className="flex text-lg font-bold">
              <span>Items and Shipping</span>
            </div>
            <div className="col-span-2">
              <p>
                Delivery Date: {formatDateTime(expectedDeliveryDate).dateOnly}
              </p>
              <ul>
                {items.map((item) => (
                  <li key={item.slug}>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="block md:hidden">
            <CheckoutSummary />
          </div>
          <CheckoutFooter />
        </div>
        <div className="hidden md:block">
          <CheckoutSummary />
        </div>
      </div>
    </main>
  );
}
