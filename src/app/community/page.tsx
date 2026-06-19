import Feed from '@/components/Feed';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Community — MotoGarage',
  description: 'Foto, giri e attività della community di MotoGarage.',
};

export default function PaginaCommunity() {
  return (
    <Reveal>
      <Feed />
    </Reveal>
  );
}
