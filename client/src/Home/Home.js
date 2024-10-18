import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Footer } from "./components/Footer";
import { NavBar } from './components/NavBar';

export function Home() {
  return (
    <div>
      <NavBar />
      <Banner />
      <Skills />

      <Footer />
    </div>
  );
}

 ;
