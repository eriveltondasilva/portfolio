import { meta } from '@/config'
import { Post } from '@/types'
import { formatDate } from '@/utils/date-format'
import { getReadingTime } from '@/utils/reading-time'

export function Modelo1({ post }: { post: Post | null }) {
  if (!post) return null

  const date = formatDate(post.createdAt)
  const readingTime = getReadingTime(post.readingTime)
  const author = post.author || meta.author

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: '#f8fafc',
        backgroundImage:
          'radial-gradient(circle at 25px 25px, #e2e8f0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e2e8f0 2%, transparent 0%)',
        backgroundSize: '100px 100px',
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
            'linear-gradient(to bottom, rgba(248, 250, 252, 0), rgba(248, 250, 252, 1) 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            letterSpacing: '0.1em',
            padding: '8px 16px',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          {readingTime} MIN DE LEITURA
        </div>
        <div
          style={{
            fontSize: 48,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#1e293b',
            lineHeight: 1.2,
            marginBottom: '20px',
            maxWidth: '700px',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: 'Inter, sans-serif',
            color: '#64748b',
            lineHeight: 1.4,
            marginBottom: '30px',
            maxWidth: '600px',
          }}
        >
          {post.description}
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
              fontSize: 18,
              fontFamily: 'Inter, sans-serif',
              color: '#475569',
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
              fontSize: 18,
              fontFamily: 'Inter, sans-serif',
              color: '#475569',
            }}
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Modelo2({ post }: { post: Post | null }) {
  if (!post) return null

  const date = formatDate(post.createdAt)
  const readingTime = getReadingTime(post.readingTime)
  const author = post.author || meta.author

  return (
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
          {post.title}
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
          {post.description}
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
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Modelo3({ post }: { post: Post | null }) {
  if (!post) return null

  const date = formatDate(post.createdAt)
  const readingTime = getReadingTime(post.readingTime)
  const author = post.author || meta.author

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        backgroundImage:
          'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          height: '90%',
          padding: '40px',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(45deg, #d4af37, #f9f095, #d4af37)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 20,
            fontFamily: 'Didot, serif',
            fontWeight: 'bold',
            letterSpacing: '0.2em',
            marginBottom: '30px',
            padding: '10px 20px',
          }}
        >
          {readingTime} MIN DE LEITURA
        </div>
        <div
          style={{
            fontSize: 38,
            fontFamily: 'Didot, serif',
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'linear-gradient(45deg, #ffffff, #e0e0e0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1.2,
            marginBottom: '4px',
            maxWidth: '900px',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            fontSize: 24,
            fontFamily: 'Helvetica, sans-serif',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            lineHeight: 1.4,
            marginBottom: '40px',
            maxWidth: '800px',
          }}
        >
          {post.description}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              fontFamily: 'Helvetica, sans-serif',
              color: 'rgba(255, 255, 255, 0.9)',
              marginRight: '30px',
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #d4af37, #f9f095)',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 'bold',
                color: '#000000',
              }}
            >
              {author?.charAt(0)?.toUpperCase()}
            </div>
            {author}
          </div>
          <div
            style={{
              fontSize: 20,
              fontFamily: 'Helvetica, sans-serif',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {date}
          </div>
        </div>
      </div>
    </div>
  )
}
