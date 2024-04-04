import Image from "next/image";
import Link from "next/link";
import herobgcode from "./assets/hero-code.png"
import Navbar from "./components/Navbar";
import { TypewriterEffect } from "../app/components/ui/typewriter-effect";
import Card from "./components/Card";

export default function Home() {

  const words = [
    {
      text: "Collaborate.",
    },
    {
      text: "Code.",
    },
    {
      text: "Repeat.",
    },
    {
      text: "with",
    },
    {
      text: "CodeXEditor",
      className: "text-button-primary dark:text-button-primary",
    },
  ];

  return (
    <div>
      <Navbar />
      <main className="flex h-screen flex-col items-center">
        <section className="text-center container mx-auto justify-center max-w-6xl space-y-8 p-none md:p-16 lg:p-24">
          <div className="mt-[5em] space-y-5">
            <TypewriterEffect words={words} />
            <p className="text-sm md:text-lg lg:text-xl text-center font-semibold">
              Run your code in <span className="text-yellow-400">real-time</span> and share with others.
            </p>
            <div className="flex flex-col md:flex-row lg:flex-row gap-5 items-center justify-center">
              <Link href="/joinroom" className="bg-button-primary rounded-lg p-2 flex items-center justify-center w-[10em] h-[3em]">
                <p className="text-xl">Code live</p>
              </Link>
              <Link href="/login" className="border-2 border-button-primary rounded-lg flex items-center justify-center w-[10em] h-[3em]">
                <p className="text-xl">Sign up</p>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center p-8">
            <Image src={herobgcode} alt="code-ide" className="shadow-xl shadow-secondary-blue top-[25em] border-[0.1em] border-gray-border rounded-xl w-full md:w-auto lg:w-auto h-auto md:h-[25em] lg:h-[35em] md:max-w-[50em] lg:max-w-none" />
          </div>
        </section>
        <section className="container mx-auto justify-center max-w-6xl mt-10 ">
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-[1000] text-center">Let's <span className="text-green-500">create</span> from here</h2>
          </div>
          <div className="flex flex-wrap gap-10 justify-center">
            <Card header="Online Compiler" description="Use our tool to let you code." bgImg="" url="/" />
            <Card header="Collaborate with others" description="Use our tool to let you code." bgImg="" url="/" />
            <Card header="Code in real-time" description="Use our tool to let you code." bgImg="" url="/" />
            <Card header="Create own Rooms" description="Use our tool to let you code." bgImg="" url="/" />
          </div>
        </section>
      </main>
    </div>
  );
}
