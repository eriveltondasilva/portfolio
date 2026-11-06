import { YouTubeEmbed } from '@next/third-parties/google';

interface Props {
  id: string;
  title?: string;
  params?: string;
}

export function Youtube({ id, title, params = '' }: Props) {
  return (
    <div className='my-6'>
      <YouTubeEmbed
        videoid={id}
        params={params}
        playlabel={`Reproduzir vídeo: ${title}`}
      />
    </div>
  );
}
