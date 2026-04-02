export function ReadingProgress() {
  return (
      <div
        className='fixed top-0 left-0 z-50 h-0.5 w-full origin-left bg-orange-500'
        style={{
          animationName: 'reading-progress',
          animationTimeline: 'scroll()',
          animationTimingFunction: 'linear',
          animationDuration: 'auto',
        }}
        role='progressbar'
        aria-label='Progresso de leitura'
      />
  )
}
