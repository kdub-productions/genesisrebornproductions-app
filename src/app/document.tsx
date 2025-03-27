import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4585137285765836"
     crossOrigin="anonymous"></script>
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