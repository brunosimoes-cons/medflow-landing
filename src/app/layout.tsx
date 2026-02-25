import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MedFlow — Automação Inteligente para Clínicas Médicas",
  description:
    "Transforme leads em pacientes com IA. Qualificação automática, agendamento inteligente e nurturing 24/7 pelo WhatsApp. Mais consultas, menos no-show.",
  keywords:
    "automação clínica médica, CRM médico, WhatsApp clínica, agendamento automático, qualificação leads médicos, IA para clínicas, marketing médico, reduzir no-show, captação pacientes",
  authors: [{ name: "MedFlow" }],
  robots: "index, follow",
  metadataBase: new URL("https://medflowhub.com.br"),
  alternates: {
    canonical: "https://medflowhub.com.br",
  },
  openGraph: {
    type: "website",
    url: "https://medflowhub.com.br",
    title: "MedFlow — Automação Inteligente para Clínicas",
    description:
      "IA no WhatsApp da sua clínica. Qualificação, agendamento e nurturing automáticos. Mais pacientes, menos trabalho manual.",
    images: [
      {
        url: "https://medflowhub.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "MedFlow — Automação Inteligente para Clínicas Médicas",
      },
    ],
    locale: "pt_BR",
    siteName: "MedFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "MedFlow — Automação Inteligente para Clínicas",
    description:
      "IA no WhatsApp da sua clínica. Qualificação, agendamento e nurturing automáticos.",
    images: ["https://medflowhub.com.br/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MedFlow",
  applicationCategory: "BusinessApplication",
  description:
    "Plataforma de automação inteligente para clínicas médicas. Qualificação de leads, agendamento automático e nurturing via WhatsApp com IA.",
  url: "https://medflowhub.com.br",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    category: "SaaS",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "5",
  },
  featureList: [
    "Qualificação automática de leads via WhatsApp",
    "Agendamento inteligente com IA",
    "Scoring multicritério de leads",
    "Nurturing automatizado",
    "Dashboard com ROI por campanha",
    "Integração Meta Ads",
    "Lembretes anti no-show",
    "CRM completo para clínicas",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MedFlow",
  url: "https://medflowhub.com.br",
  logo: "https://medflowhub.com.br/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-31-99733-2026",
    contactType: "sales",
    availableLanguage: "Portuguese",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Script
          id="schema-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema),
          }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Google Tag Manager — replace GTM-MRXDXHCR with your ID */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MRXDXHCR');`}
        </Script>
        {/* Meta Pixel — replace 1231388152463300 */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1231388152463300');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-dm-sans)] antialiased`}
      >
        {/* GTM noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MRXDXHCR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
