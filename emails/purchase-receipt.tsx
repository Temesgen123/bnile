import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { formatCurrency } from '@/lib/utils';
import { IOrder } from '../lib/db/models/ordermodel';
import { SERVER_URL } from '@/lib/constants';

type OrderInformationProps = {
  order: IOrder;
};

PurchaseReceiptEmail.PreviewProps = {
  order: {
    _id: '123',
    isPaid: true,
    paidAt: new Date(),
    totalPrice: 100,
    itemsPrice: 100,
    taxPrice: 0,
    shippingPrice: 0,
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
    },
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St.',
      city: 'Houston',
      postalCode: '77022',
      country: 'USA',
      phone: '123-123-1234',
      province: 'Texas',
    },
    items: [
      {
        name: 'product-1',
        image: '/imageone.jpg',
        price: 100,
        quantity: 1,
        product: '123',
        slug: 'product-1',
        category: 'Category 1',
        countInStock: 10,
      },
    ],
    paymentMethod: 'PayPal',
    expectedDeliveryDate: new Date(),
    isDelivered: true,
  } as IOrder,
} satisfies OrderInformationProps;

const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

export default async function PurchaseReceiptEmail({
  order,
}: OrderInformationProps) {
  return (
    <Html>
      <Preview>View order receipt.</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Order Id
                  </Text>
                  <Text className="mt-0 mr-4">{order._id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-4 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Purchased On
                  </Text>
                  <Text className="mt-0 mr-4 ">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-4 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.items.map((item) => (
                <Row key={item.product} className="mt-8">
                  <Column className="w-20">
                    <Img
                      width="80"
                      className="rounded"
                      alt={item.name}
                      src={
                        item.image.startsWith('/')
                          ? `${SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="align-top">
                    <Text className="mx-t my-0">
                      {item.name}x{item.quantity}
                    </Text>
                  </Column>
                  <Column align="right" className="align-top">
                    <Text className="m-0">{formatCurrency(item.price)}</Text>
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}: </Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
