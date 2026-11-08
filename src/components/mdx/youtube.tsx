import { YouTubeEmbed } from '@next/third-parties/google';

import { Figure } from './figure';

interface Props {
  id: string;
  title?: string;
  caption?: string;
  params?: string;
}

const DEFAULT_PLAY_LABEL = 'Reproduzir vídeo';

export function Youtube({ id, title, caption, params = '' }: Props) {
  return (
    <Figure caption={caption}>
      <YouTubeEmbed
        videoid={id}
        params={params}
        playlabel={
          title ? `${DEFAULT_PLAY_LABEL} ${title}` : DEFAULT_PLAY_LABEL
        }
      />
    </Figure>
  );
}
