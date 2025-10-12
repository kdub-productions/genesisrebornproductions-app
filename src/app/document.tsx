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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4585137285765836"
     crossOrigin="anonymous"></script>
        {/* Ad scripts are injected client-side after user consent by AdsLoader to respect privacy and avoid tracking-prevention console noise. */}
        <script async custom-element="amp-auto-ads"
                src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
        </script>
      </Head>
      <body>
        <amp-auto-ads type="adsense"
                data-ad-client="ca-pub-4585137285765836">
        </amp-auto-ads>
        <div id="preloader">
          <div id="loader"></div>
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
