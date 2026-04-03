import { YouTubeEmbed } from '@next/third-parties/google'

interface Props {
  id: string
  params?: string
}

export function Youtube({ id, params = 'controls=0' }: Props) {
  return <YouTubeEmbed videoid={id} params={params} />
}
