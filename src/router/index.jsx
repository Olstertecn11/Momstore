import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import Layout from "../components/Layout";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function RouterManager() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        {routes?.publicRoutes.map((route, index) => {
          const Page = route.component;

          const element = route.layout.use ? (
            <Layout {...route.layout.props}>
              <Page />
            </Layout>
          ) : (
            <Page />
          );

          return <Route key={`pub-${index}`} path={route.path} element={element} />;
        })}

        {/* ADMIN PROTEGIDO */}
        {routes?.adminRoutes.map((route, index) => {
          const Page = route.component;
          const roles = route.roles || ["ADMIN", "WORKER"];

          const element = (
            <ProtectedRoute roles={roles}>
              {route.layout.use ? (
                <Layout {...route.layout.props}>
                  <Page />
                </Layout>
              ) : (
                <Page />
              )}
            </ProtectedRoute>
          );

          return <Route key={`adm-${index}`} path={route.path} element={element} />;
        })}
      </Routes>
    </BrowserRouter>
  );
}
