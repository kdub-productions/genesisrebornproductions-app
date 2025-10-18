import { Html, Head, Main, NextScript } from 'next/document';

// Declare AMP custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'amp-auto-ads': any;
    }
  }
}

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        {/* Ad scripts are injected client-side after user consent by AdsLoader to respect privacy and avoid tracking-prevention console noise. */}
      </Head>
      <body>
        <div id="preloader">
          <div id="loader"></div>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
