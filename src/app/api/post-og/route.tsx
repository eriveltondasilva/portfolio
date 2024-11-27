import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title')
  const description = searchParams.get('description')
  const author = searchParams.get('author')
  const createdAt = searchParams.get('created-at')
  const readingTime = searchParams.get('reading-time')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#000000',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #ffffff 2%, transparent 0%)',
          backgroundSize: '50px 50px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
            padding: '40px 50px',
            backgroundImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8) 50%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ff4500',
              color: 'white',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              padding: '8px 16px',
              borderRadius: '20px',
              marginBottom: '20px',
            }}
          >
            {readingTime} MIN DE LEITURA
          </div>
          <div
            style={{
              fontSize: 60,
              fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '20px',
              maxWidth: '800px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 24,
              fontFamily: 'Arial, sans-serif',
              color: '#cccccc',
              lineHeight: 1.4,
              marginBottom: '30px',
              maxWidth: '700px',
            }}
          >
            {description}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 20,
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: '#ff4500',
                  marginRight: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                }}
              >
                {author?.charAt(0)?.toUpperCase()}
              </div>
              {author}
            </div>
            <div
              style={{
                fontSize: 20,
                fontFamily: 'Arial, sans-serif',
                color: '#ffffff',
              }}
            >
              {createdAt}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 800,
      height: 400,
    },
  )
}
