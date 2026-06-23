import { notFound } from 'next/navigation';
import GiroPubblicoClient from '@/components/GiroPubblicoClient';
import { getGiroPubblico } from '@/lib/giri-public';

export const metadata = {
  title: 'Giro — Community',
  description: 'Giro moto condiviso dalla community MotoGarage.',
};

export default async function PaginaGiroPubblico({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const giro = await getGiroPubblico(id);
  if (!giro) notFound();
  return <GiroPubblicoClient giro={giro} />;
}
