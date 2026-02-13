// src/mocks/next-navigation.ts
import { useLocation, useNavigate, useParams as useRouterParams } from 'react-router-dom';

export const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};

export const useRouter = () => {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
};

export const useSearchParams = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  // Return a proper URLSearchParams object, not an array
  return searchParams;
};

export const useParams = () => {
  return useRouterParams();
};