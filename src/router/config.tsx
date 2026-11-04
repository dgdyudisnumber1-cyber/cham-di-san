import type { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/NotFound';
import Home from '@/pages/home/page';
import LocationDetail from '@/pages/location/page';
import Stories from '@/pages/stories/page';
import StoryDetail from '@/pages/story/page';
import HeritageStories from '@/pages/heritage-stories/page';
import HeritageStoryDetail from '@/pages/heritage-story/page';
import About from '@/pages/about/page';
import Contribute from '@/pages/contribute/page';
import ArtisanDetail from '@/pages/artisan/page';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Callback from '@/pages/auth/Callback';
import ResetPassword from '@/pages/auth/ResetPassword';
import Account from '@/pages/account/page';
import Search from '@/pages/search/page';

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/location/:slug', element: <LocationDetail /> },
  { path: '/stories', element: <Stories /> },
  { path: '/story/:slug', element: <StoryDetail /> },
  { path: '/heritage-stories', element: <HeritageStories /> },
  { path: '/heritage-story/:slug', element: <HeritageStoryDetail /> },
  { path: '/about', element: <About /> },
  { path: '/contribute', element: <Contribute /> },
  { path: '/artisan/:id', element: <ArtisanDetail /> },
  { path: '/auth/login', element: <Login /> },
  { path: '/auth/register', element: <Register /> },
  { path: '/auth/reset-password', element: <ResetPassword /> },
  { path: '/auth/callback', element: <Callback /> },
  { path: '/account', element: <Account /> },
  { path: '/search', element: <Search /> },
  { path: '*', element: <NotFound /> },
];

export default routes;