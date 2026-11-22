import Script from 'next/script';
import { GA_SCRIPT_ID } from './constants';

export const GoogleAnalytics = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

  if (!measurementId) {
    return null;
  }

  const measurementIdLiteral = JSON.stringify(measurementId).replace(
    /</g,
    '\\u003c',
  );

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id={GA_SCRIPT_ID} strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${measurementIdLiteral});`}
      </Script>
    </>
  );
};
