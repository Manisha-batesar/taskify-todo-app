import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Taskify - From Plan To Done'
    const description = searchParams.get('description') || 'Professional Task Management Application'

    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              maxWidth: '800px',
              padding: '40px',
            }}
          >
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                marginBottom: '20px',
                lineHeight: '1.1',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '28px',
                opacity: 0.9,
                lineHeight: '1.4',
              }}
            >
              {description}
            </p>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              opacity: 0.8,
            }}
          >
            📋 taskifyes.vercel.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
