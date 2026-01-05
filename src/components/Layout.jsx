import React from "react";
import Navbar from "./Navbar";

function Layout({ children, navbarInsideChild = false }) {
  if (navbarInsideChild) {
    return (
      <>
        {
          React.cloneElement(children, {
            navbar: <Navbar />
          })
        }
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default Layout;
