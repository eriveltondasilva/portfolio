import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || 'Next.js Portfolio Starter'

  return new ImageResponse(
    (
      <div className='flex h-full w-full flex-col items-center justify-center bg-white'>
        <div className='flex w-full flex-col justify-between p-8 px-4 py-12 md:flex-row md:items-center'>
          <h2 className='flex flex-col text-left text-4xl font-bold tracking-tight'>{title}</h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}

// export const runtime = 'edge'

// export const alt = 'Blog Post Preview'
// export const contentType = 'image/png'
// export const size = {
//   width: 1200,
//   height: 630,
// }

// export async function Image({ params }: { params: { slug: string } }) {
//   const post = await fetchPostData(params.slug)

//   return new ImageResponse(
//     (
//       <>
//         <div className="w-full h-full flex flex-col justify-between p-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
//           <div className="flex justify-between items-start">
//             <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
//               Acme Blog
//             </div>
//             <div className="flex space-x-2">
//               {post.tags.map((tag, index) => (
//                 <div key={index} className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-full text-sm">
//                   {tag}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-6">
//             <h1 className="text-5xl font-extrabold leading-tight">{post.title}</h1>
//             <p className="text-xl text-gray-300 line-clamp-2">{post.description}</p>
//           </div>

//           <div className="flex justify-between items-end">
//             <div className="flex items-center space-x-4">
//               <img src={post.authorAvatar} alt={post.author} className="w-12 h-12 rounded-full" />
//               <div>
//                 <div className="font-semibold">{post.author}</div>
//                 <div className="text-gray-400 text-sm">{post.date}</div>
//               </div>
//             </div>
//             <div className="text-gray-400 text-sm">
//               {post.readingTime} min read
//             </div>
//           </div>
//         </div>
//       </>
//     ),
//     {
//       ...size,
//     }
//   )
// }

// async function fetchPostData(slug: string) {
//   await new Promise((resolve) => setTimeout(resolve, 100))

//   return {
//     title: 'Mastering Dynamic OG Images with Next.js and Tailwind CSS',
//     description:
//       'Learn how to create stunning, dynamic Open Graph images for your Next.js blog using the power of Tailwind CSS and the ImageResponse API.',
//     author: 'Jane Doe',
//     authorAvatar: 'https://i.pravatar.cc/300',
//     date: 'June 12, 2023',
//     readingTime: 5,
//     tags: ['Next.js', 'Tailwind CSS', 'SEO'],
//   }
// }
