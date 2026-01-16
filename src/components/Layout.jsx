import React from "react";
import Navbar from "./Navbar";
import AdminNav from "./admin/Navbar";
import Footer from "./Footer";

function Layout({ children, navbarInsideChild = false, navbarDarkmode = false, admin = false }) {
  if (navbarInsideChild) {
    return (
      <>
        {
          React.cloneElement(children, {
            navbar: admin ? <AdminNav /> : <Navbar />,
          })
        }
        <Footer />
      </>
    );
  }

  return (
    <>
      {
        admin ? <AdminNav /> : <Navbar darkmode={navbarDarkmode} />
      }
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
