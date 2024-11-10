import React from 'react';
import Navbar from '../components/Home/NavBar';
import Footer from '@/components/Home/Footer';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default MainLayout;