import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children, navbarInsideChild = false, navbarDarkmode = false }) {
  if (navbarInsideChild) {
    return (
      <>
        {
          React.cloneElement(children, {
            navbar: <Navbar />
          })
        }
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar darkmode={navbarDarkmode} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
