import useAuth from "@/hooks/useAuth";
import { CheckIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import PlanLi from "./PlanLi";
import { Product } from "@stripe/firestore-stripe-payments";
import Table from "./Table";


interface Props {
    products: Product[]
  }

export default function Plans({ products }: Props) {
  const { logout } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<Product | null>(products[2])
  console.log(selectedPlan)
  return (
    <div>
      {" "}
      <Head>
        <title> Netflix</title>
      </Head>
      <header className="border-b border-white/10 bg-[#141414]">
        <Link href="/">
          <img
            src="https://rb.gy/ulxxee"
            alt="Netflix"
            width={150}
            height={90}
            className="cursor-pointer object-contain"
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
          Choose the plan that's right for you
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
        <div className="mt-4 flex flex-col space-y-4">
          <div className="flex w-full items-center self-end md:w-3/5">
          {
        products.map((product)=>(
            <div
                key={product.id}
                className={`planBox ${
                  selectedPlan?.id === product.id ? 'opacity-100' : 'opacity-60'
                }`}
                onClick={() => setSelectedPlan(product)}
              >{product.name}</div>
        ))
          }
            
          </div>
          <Table products={products} selectedPlan={selectedPlan} />
        </div>
      </main>
    </div>
  );
}
