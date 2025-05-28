import { children } from 'solid-js';
import Header from './Header';
import Footer from './Footer';

function Layout(props) {
  const c = children(() => props.children);

  return (
    <div class="app-layout">
      <Header />
      
      <main class="main-content">
        {c()}
      </main>
      
      <Footer />
    </div>
  );
}

export default Layout;
