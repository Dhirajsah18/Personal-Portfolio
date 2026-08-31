import { ThemeProvider } from "./context/ThemeContext";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SectionDivider from "./components/SectionDivider";

function App() {
  return (
    <ThemeProvider>
      <Background />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Education />
        <SectionDivider />
        <Contact />
        <SectionDivider />
        <Footer />
      </main>
    </ThemeProvider>
  );
}

export default App;
