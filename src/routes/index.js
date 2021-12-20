import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import MainLayout from '../layouts/main';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';

// components
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...({
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    // Dashboard Routes
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <LandingPage /> },
        {
          path: 'movies',
          element: <MoviesLayout />,
          children: [
            { path: '/', element: <Navigate to="/movies/now-showing" /> },
            { path: 'now-showing', element: <LandingHotMovie /> },
            { path: 'coming-soon', element: <PageOne /> },
            { path: 'book', element: <MovieBook /> },
            { path: '/:maphim', element: <MovieDetails /> },
            { path: '*', element: <Navigate to="/404" replace /> },
          ]
        },
        { path: 'checkout', element: <Checkout /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

// IMPORT COMPONENTS

// Movie
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const MovieDetails = Loadable(lazy(() => import('../pages/movies/MovieDetails')));
const MovieBook = Loadable(lazy(() => import('../pages/movies/MovieBook')));
// Main
const MoviesLayout = Loadable(lazy(() => import('../layouts/movies')));
const LandingPage = Loadable(lazy(() => import('../pages/LandingPage')));
const Checkout = Loadable(lazy(() => import('../pages/Checkout')));
const LandingHotMovie = Loadable(lazy(() => import('../components/_external-pages/landing/LandingHotMovie')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));