import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Stats from "@/components/sections/stats";
import Calculator from "@/components/sections/calculator";
import Services from "@/components/sections/services";
import Showcase from "@/components/sections/showcase";
import AboutFounders from "@/components/sections/about-founders";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Calculator />
        <Services />
        <Showcase />
        <AboutFounders />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
