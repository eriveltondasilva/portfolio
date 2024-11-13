import clsx from 'clsx'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'

type ImageGridProps = {
  images: ({ href?: string } & ImageProps)[]
  columns?: 2 | 3 | 4 | 5
}

type TableProps = {
  data: {
    headers: string[]
    rows: string[][]
  }
}

type CustomLinkProps = {
  href?: string
  children?: React.ReactNode
}
export function CustomLink({ href = '', children, ...props }: CustomLinkProps) {
  const isAnchorLink = href?.startsWith('#')
  const isInternalLink = href?.startsWith('/')

  if (isInternalLink) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      target={!isAnchorLink ? '_blank' : undefined}
      rel={!isAnchorLink ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

export function RoundedImage({ src, alt, width, height, ...props }: ImageProps) {
  return (
    <Image className='rounded-lg' src={src} alt={alt} width={width} height={height} {...props} />
  )
}

export function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-5',
  }[columns]

  return (
    <section>
      <div className={clsx('my-8 grid gap-4', gridClass)}>
        {images.map(({ src, alt, href }, index) => (
          <div key={index} className='relative aspect-square'>
            {href ?
              <a
                target='_blank'
                rel='noopener noreferrer'
                href={href}
                className='block h-full w-full'
              >
                <Image
                  src={src}
                  alt={alt}
                  className='rounded-lg object-cover'
                  sizes='(max-width: 768px) 50vw, 33vw'
                  fill
                  priority
                />
              </a>
            : <Image
                alt={alt}
                src={src}
                sizes='(max-width: 768px) 50vw, 33vw'
                className='rounded-lg object-cover'
                fill
                priority
              />
            }
          </div>
        ))}
      </div>
    </section>
  )
}

export function TableComponent({ data }: TableProps) {
  const { headers, rows } = data

  return (
    <table>
      <thead>
        <tr className='text-left'>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
