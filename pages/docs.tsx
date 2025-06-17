import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function Docs() {
  useEffect(() => {
    const interval = setInterval(() => {
      // @ts-ignore
      if (window.SwaggerUIBundle) {
        // @ts-ignore
        window.SwaggerUIBundle({
          url: '/openapi.yaml',
          dom_id: '#swagger-ui',
        });
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>API Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      </Head>
      <Script
        src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"
        strategy="afterInteractive"
      />
      <div id="swagger-ui" />
    </>
  );
}
