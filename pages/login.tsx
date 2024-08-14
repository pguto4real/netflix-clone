import useAuth from "@/hooks/useAuth";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  email: string;
  password: string;
}

export default function Login() {
  const [login, setLogin] = useState(false);

  const {signIn,signUp} = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({email,password}) => {
    if (login) {
      await signIn(email,password)
    } else {
      await signUp(email,password)
    }
  };

  return (
    <div
      className="relative flex h-screen w-screen flex-col bg-black md:items-center
   md:justify-center md:bg-transparent"
    >
      <Head>
        <title>Home - Netflix</title>
        <Link href="/favicon.ico" />
      </Head>

      <Image
        className="-z-10 !hidden opacity-60 sm:!inline"
        src="https://rb.gy/p2hphi"
        alt=""
        layout="fill"
        objectFit="cover"
      />

      <img
        src="https://rb.gy/ulxxee"
        alt=""
        width={150}
        height={150}
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        action=""
        className="relative mt-24 space-y-8 rounded bg-black/75 py-10 
         px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl">Sign In</h1>

        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              className="input"
              placeholder="Email or mobile number"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="p-1 text-[13px] font-light text-orange-500">
                Please enter a valid email
              </p>
            )}
          </label>
          <label className="inline-block w-full">
            <input
              type="password"
              className="input"
              id=""
              placeholder="Password"
              {...register("password", {
                required: true,
                minLength: 4,
                maxLength: 60,
              })}
            />
            {errors.password && (
              <p className="p-1 text-[13px] font-light text-orange-500">
                Your password must contain between 4 and 60 characters.
              </p>
            )}
          </label>
        </div>

        <button
          className="w-full bg-[rgb(153,22,29)] rounded py-3 font-semibold"
          onClick={() => setLogin(true)}
        >
          Sign In
        </button>

        <div className="text-[gray]">
          New to Netflix?{"  "}
          <button
            type="submit"
            className="text-white hover:underline"
            onClick={() => setLogin(false)}
          >
            Sign up now
          </button>
        </div>
      </form>
    </div>
  );
}
