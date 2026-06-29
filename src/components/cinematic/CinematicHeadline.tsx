interface Line {
  text: string;
  accent?: boolean;
}

interface Props {
  lines: Line[];
  align?: 'left' | 'right';
  size?: 'hero' | 'section' | 'garage';
  className?: string;
}

export default function CinematicHeadline({
  lines,
  align = 'left',
  size = 'hero',
  className = '',
}: Props) {
  return (
    <div
      className={`cinematic-headline cinematic-headline-${align} cinematic-headline-${size} ${className}`}
    >
      {lines.map((line, i) => (
        <span
          key={`${line.text}-${i}`}
          className={line.accent ? 'cinematic-headline-accent' : 'cinematic-headline-plain'}
        >
          {line.text}
        </span>
      ))}
    </div>
  );
}
