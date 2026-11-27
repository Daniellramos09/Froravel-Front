import Header from './Header';
import Footer from './Footer';
import SmoothScroll from '../Effects/SmoothScroll';

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen bg-[#FCF7F9] text-[#294D33] transition-colors duration-300">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
