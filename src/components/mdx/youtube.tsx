import { YouTubeEmbed } from '@next/third-parties/google'

interface Props {
  videoId: string
  params?: string
}

export function Youtube({ videoId, params }: Props) {
  return <YouTubeEmbed videoid={videoId} params={params} />
}
