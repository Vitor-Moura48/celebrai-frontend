import { Suspense } from 'react';
import BuscaClient from './buscaCliente';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BuscaClient />
    </Suspense>
  );
}