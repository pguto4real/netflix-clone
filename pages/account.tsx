import { getProducts, Product } from '@stripe/firestore-stripe-payments'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
// import Membership from '../components/Membership'
import useAuth from '../hooks/useAuth'
import useSubscription from '../hooks/useSubscription'
import payments from '../lib/stripe'
import { collection, doc, getDocs, query } from 'firebase/firestore'
import { db } from '@/firebase'

interface Props {
  products: Product[]
}

function Account({ products }: Props) {
  console.log(products)
  const { user, logout } = useAuth()
  const subscription = useSubscription(user)
  console.log(subscription)
  console.log(subscription?.created)

  return (
    <div>
      <Head>
        <title>Account Settings - Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={`bg-[#141414]`}>
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            width={120}
            height={120}
            className="cursor-pointer object-contain"
          />
        </Link>
        <Link href="/account">
          <img
            src="https://rb.gy/g1pwyx"
            alt=""
            className="cursor-pointer rounded"
          />
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-24 pb-12 transition-all md:px-10">
        <div className="flex flex-col gap-x-4 md:flex-row md:items-center">
          <h1 className="text-3xl md:text-4xl">Account</h1>
          <div className="-ml-0.5 flex items-center gap-x-1.5">
            <img src="https://rb.gy/4vfk4r" alt="" className="h-7 w-7" />
            <p className="text-xs font-semibold text-[#555]">
              Member since {subscription?.created.toDate().toString()}
            </p>
          </div>
        </div>

        {/* <Membership /> */}

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0 md:pb-0">
          <h4 className="text-lg text-[gray]">Plan Details</h4>
          {/* Find the current plan */}
          <div className="col-span-2 font-medium">fgfg
            {
              products.filter(
                (product) => product.id === subscription?.product
              )[0]?.name
            }
          </div>
          <p className="cursor-pointer text-blue-500 hover:underline md:text-right">
            Change plan
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-4 border px-4 py-4 md:grid-cols-4 md:border-x-0 md:border-t md:border-b-0 md:px-0">
          <h4 className="text-lg text-[gray]">Settings</h4>
          <p
            className="col-span-3 cursor-pointer text-blue-500 hover:underline"
            onClick={logout}
          >
            Sign out of all devices
          </p>
        </div>
      </main>
    </div>
  )
}

export default Account

export const getStaticProps: GetStaticProps = async () => {
    const productdatas = (await getDocs(collection(db, "products"))).docs;
    let products = [];
    let i = 0;
    let productsId = [];
    productdatas.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      productsId[i] = { id: doc.id, data: doc.data() };
      i++;
    });
  
    for (let index = 0; index < productsId.length; index++) {
      console.log(productsId[index]);
      const postRef = collection(db, "products", productsId[index].id, "prices");
      const q = query(postRef);
      const pricesQuerySnap = await getDocs(q);
      const post = pricesQuerySnap.docs.map((item) => ({
        ...productsId[index].data,
        id: productsId[index].id,
        priceId: item.id,
        prices: item.data(),
      }));
      console.log(pricesQuerySnap);
      console.log(post);
      products.push(post[0]);
    }
  

  return {
    props: {
      products,
    },
  }
}