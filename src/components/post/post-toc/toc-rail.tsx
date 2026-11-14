import type { RailGeometry, Segment } from './use-rail-geometry';

const TRACK_STROKE_PX = 1;
const THUMB_STROKE_PX = 2;
const INDENT_PX = 12;

export function getRailX(level: number): number {
  return THUMB_STROKE_PX / 2 + level * INDENT_PX;
}

function getRailPath(levels: number[], segments: Segment[]): string {
  let path = '';
  let previousX = 0;
  let previousBottom = 0;

  segments.forEach(({ top, bottom }, index) => {
    const x = getRailX(levels[index] ?? 0);

    if (index === 0) {
      path += `M${x} ${top}`;
    } else {
      const middle = (previousBottom + top) / 2;
      path += ` C${previousX} ${middle} ${x} ${middle} ${x} ${top}`;
    }

    path += ` L${x} ${bottom}`;
    previousX = x;
    previousBottom = bottom;
  });

  return path;
}

interface Props {
  levels: number[];
  geometry: RailGeometry;
  activeIndex: number;
}

export function TocRail({ levels, geometry, activeIndex }: Props) {
  const { segments, height } = geometry;

  const path = getRailPath(levels, segments);
  const width = getRailX(Math.max(...levels)) + THUMB_STROKE_PX / 2;

  const firstTop = segments[0]?.top ?? 0;
  const thumb = segments[activeIndex] ?? { top: firstTop, bottom: firstTop };
  const clipPath = `inset(${thumb.top}px 0 ${height - thumb.bottom}px 0)`;

  return (
    <>
      <svg
        aria-hidden='true'
        width={width}
        height={height}
        className='pointer-events-none absolute top-0 left-0 fill-none stroke-border'
      >
        <path d={path} strokeWidth={TRACK_STROKE_PX} />
      </svg>

      {/* Same path in the accent color, revealed only over the active item */}
      <svg
        aria-hidden='true'
        width={width}
        height={height}
        style={{ clipPath }}
        className='pointer-events-none absolute top-0 left-0 fill-none stroke-orange-500 transition-[clip-path] duration-300 ease-out motion-reduce:transition-none dark:stroke-orange-400'
      >
        <path d={path} strokeWidth={THUMB_STROKE_PX} />
      </svg>
    </>
  );
}
