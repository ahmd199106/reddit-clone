import React from 'react';
import Navbar from '../Navbar/Navbar';

type Layout = {
  children: React.ReactNode;
};

const Layout: React.FC<Layout> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};
export default Layout;
