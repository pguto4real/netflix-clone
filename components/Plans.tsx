import useAuth from "@/hooks/useAuth";
import { CheckIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import PlanLi from "./PlanLi";
import { Product } from "@stripe/firestore-stripe-payments";
import Table from "./Table";
import { loadCheckout } from "@/lib/stripe";
import Loader from "./Loader";
import Image from "next/image";


interface Props {
    products: Product[]
  }

export default function Plans({ products }: Props) {
  const { logout,user } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2])
  const [isBillingLoading, setBillingLoading] = useState(false)

  const subscribeToPlan = () => {

    if (!user) return

    loadCheckout(selectedPlan?.priceId!,user.uid)
    setBillingLoading(true)
  }

  return (
    <div>
      {" "}
      <Head>
        <title> Netflix</title>
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          
          <Image
            src="/Netflix_2015_logo.svg"
            className="cursor-pointer object-contain "
            width={150}
            height={90}
            alt=""
          />
        </Link>
        <button
          className="text-lg font-medium hover:underline"
          onClick={logout}
        >
          Sign Out
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 pt-28 pb-12 transition-all md:px-10">
        <h1 className="mb-3 text-3xl font-medium">
          Choose the plan that&apos;s right for you
        </h1>
        <ul>
          <PlanLi text="Watch all you want.    Ad-free." />
          <PlanLi
            text="Recommendations
            just for you."
          />
          <PlanLi
            text="Change or cancel
            your plan anytime."
          />
        </ul>
        <div className="mt-4 flex flex-col space-y-4 ">
          <div className="flex w-full items-center self-end md:w-3/5">
          {
        products.map((product)=>(
            <div
                key={product.id}
                className={`planBox cursor-pointer ${
                  selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSelectedPlan(product)}
              >{product.name}</div>
        ))
          }
            
          </div>
          <Table products={products} selectedPlan={selectedPlan} />
          <button
            disabled={!selectedPlan || isBillingLoading}
            className={`mx-auto w-11/12 rounded bg-[#E50914] py-4 text-xl shadow hover:bg-[#f6121d] md:w-[420px] ${
              isBillingLoading && 'opacity-60'
            }`}
            onClick={subscribeToPlan}
          >
            {isBillingLoading ? (
              <Loader color="dark:fill-gray-300" />
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
