import ClassificaKm from '@/components/ClassificaKm';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'Classifica km — MotoGarage',
  description: 'I rider con più chilometri registrati su MotoGarage.',
};

export default function PaginaClassifica() {
  return (
    <Reveal>
      <p className="mb-4 text-sm text-asfalto/65">
        Totale km da giri GPS registrati. Tocca un rider per aprire il profilo.
      </p>
      <ClassificaKm />
    </Reveal>
  );
}
