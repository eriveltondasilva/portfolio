import clsx from 'clsx'
import Image, { type ImageProps } from 'next/image'
import Link, { LinkProps } from 'next/link'

interface ImageGridProps {
  images: {
    src: string
    alt: string
    href?: string
  }[]
  columns?: 2 | 3 | 4 | 5
}

export function CustomLink({
  href,
  children,
  ...props
}: {
  href: string
  children: React.ReactNode
} & LinkProps) {
  const isInternalLink = href.startsWith('/')
  const isAnchorLink = href.startsWith('#')

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

export function RoundedImage(props: ImageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image className='rounded-lg' {...props} />
}

export function ImageGrid({ images, columns = 3 }: ImageGridProps) {
  const gridClass = {
    2: 'grid-cols-2 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-5',
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
                  alt={alt}
                  src={src}
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

type TableProps = {
  data: {
    headers: string[]
    rows: string[][]
  }
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
