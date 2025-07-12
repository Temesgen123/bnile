import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// import { sendPurchaseReceipt } from '@/emails';
// import Order from '@/lib/db/models/ordermodel';
// import { error } from 'console';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string; //added

export async function POST(req: NextRequest) {
  const rawResponse = await req.arrayBuffer(); //added
  const respose = Buffer.from(rawResponse); //added
  const sig = req.headers.get('stripe-signature')!; //added

  try {
    const event = stripe.webhooks.constructEvent(respose, sig, endpointSecret);
    if (event.type === 'charge.succeeded') {
      const charge = event.data.object;
      console.log(
        'charge succeeded: ',
        charge.id,
        charge.amount,
        charge.currency
      );
      //add here
      //add more logic
      return NextResponse.json({ received: true }, { status: 200 });
    }
    //return 200 for other events
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook error: ', err.message);
    } else {
      console.error('Unknown error.', err);
    }
    return NextResponse.json(
      { error: `webhook Error : ${err}` },
      { status: 400 }
    );
  }

  // const event = await stripe.webhooks.constructEvent(
  //   await req.text(),
  //   req.headers.get('stripe-signature') as string,
  //   process.env.STRIPE_WEBHOOK_SECRET as string
  // );
  // if (event.type === 'charge.succeeded') {
  //   const charge = event.data.object;
  //   const orderId = charge.metadata.orderId;
  //   const email = charge.billing_details.email;
  //   const pricePaidInCents = charge.amount;
  //   const order = await Order.findById(orderId).populate('user', 'email');
  //   if (order == null) {
  //     return new NextResponse('Bad request', { status: 400 });
  //   }
  //   order.isPaid = true;
  //   order.paidAt = new Date();
  //   order.paymentResult = {
  //     id: event.id,
  //     status: 'COMPLETED',
  //     email_address: email!,
  //     pricePaid: (pricePaidInCents / 100).toFixed(2),
  //   };
  //   await order.save();
  //   try {
  //     await sendPurchaseReceipt({ order });
  //   } catch (err) {
  //     console.log('email error', err);
  //   }
  //   return NextResponse.json({
  //     message: 'updateOrderToPaid is successful.',
  //   });
  // }
  // return new NextResponse();
}
