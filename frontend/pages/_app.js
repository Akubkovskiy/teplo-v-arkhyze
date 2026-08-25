import '../styles.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { captureUtm } from '../lib/analytics';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) captureUtm(router.query);
  }, [router.isReady, router.query]);

  return <Component {...pageProps} />;
}
