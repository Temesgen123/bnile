import data from '@/lib/data';
import { connectToDataBase } from '.';
import Product from './models/product.model';
import User from './models/user.model';
import { cwd } from 'process';
import { loadEnvConfig } from '@next/env';


loadEnvConfig(cwd());

const main = async () => {
  try {
    const { products, users } = data;

    await connectToDataBase(process.env.MONGODB_URI);

    await User.deleteMany();
    const createdUser = await User.insertMany(users)


    await Product.deleteMany();
    const createdProducts = await Product.insertMany(products);
    console.log({createdUser, createdProducts, message: 'Seeded database successfully.' });
    process.exit(0);
  } catch (err) {
    console.error(err);
    throw new Error('Failed to seed database.');
  }
};
main();
