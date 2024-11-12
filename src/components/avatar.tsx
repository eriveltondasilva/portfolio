import clsx from 'clsx'
import Image from 'next/image'

import { url } from '@/config'

function AvatarClipPath() {
  return (
    <svg width='0' height='0' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <clipPath id='avatar-shape'>
          <path
            // className='duration-800 transition ease-out'
            fill='currentColor'
            d='M20,-31.1C26.6,-26.9,33.2,-22.5,35.3,-16.5C37.3,-10.5,35,-2.9,32.8,3.9C30.6,10.8,28.6,16.9,25,22.4C21.4,28,16.3,33,9.6,36.7C3,40.4,-5.2,42.9,-12.1,40.9C-19,39,-24.7,32.6,-28.7,26C-32.7,19.3,-35.2,12.4,-37.4,4.6C-39.7,-3.1,-41.8,-11.6,-39.7,-19C-37.7,-26.5,-31.5,-32.9,-24.2,-36.8C-16.9,-40.7,-8.4,-42.1,-0.9,-40.8C6.7,-39.4,13.4,-35.3,20,-31.1Z'
            transform='translate(100, 100), scale(2.4)'
          />
        </clipPath>
      </defs>
    </svg>
  )
}

export function Avatar() {
  const className = clsx(
    'sm:float-right',
    'mx-auto my-4',
    'transition-[filter] duration-300 ease-out',
    'bg-gray-100 grayscale hover:grayscale-0',
  )
  const style = {
    clipPath: 'url(#avatar-shape)',
  }
  const AVATAR_SIZE = 200

  return (
    <div>
      <Image
        src={url.githubAvatar || '/profile.png'}
        alt='Profile photo'
        className={className}
        style={style}
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
        priority
        // unoptimized
      />
      <AvatarClipPath />
    </div>
  )
}
