import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  schemaMarkup?: object
}

export default function SEO({
  title = "Taskify - From Plan To Done | Professional Task Management",
  description = "Transform your productivity with Taskify - the ultimate task management app. Organize projects, track deadlines, collaborate with teams, and achieve your goals efficiently.",
  image = "/tsakify-preview.png",
  url,
  type = "website",
  noindex = false,
  schemaMarkup
}: SEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taskifyes.vercel.app"
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Taskify" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@taskifyes" />
      <meta name="twitter:creator" content="@Manishabatesar" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Additional Meta Tags */}
      <meta name="author" content="Taskify Team" />
      <meta name="publisher" content="Taskify" />
      <meta name="application-name" content="Taskify" />
      <meta name="apple-mobile-web-app-title" content="Taskify" />

      {/* Schema Markup */}
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
    </Head>
  )
}
