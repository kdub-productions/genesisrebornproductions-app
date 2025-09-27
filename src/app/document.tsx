import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
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