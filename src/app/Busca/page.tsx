import { Suspense } from "react";
import BuscaClient from "./buscaClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <BuscaClient />
    </Suspense>
  );
}
