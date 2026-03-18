"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { authService } from "@/lib/api";

export default function GoogleLoginButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  return (
    <div>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          const idToken = credentialResponse.credential;

          if (!idToken) {
            setErro("Google não retornou credential");
            return;
          }

          setLoading(true);

          try {
            await authService.loginGoogle(idToken);
            setSucesso(true);
            setTimeout(() => {
              router.push("/");
            }, 1000);
          } catch (err: any) {
            console.error("Erro detalhado:", err);
            setErro(err.response?.data?.message || "Erro ao autenticar com Google");
          } finally {
            setLoading(false);
          }
        }}
        onError={() => {
          setErro("Falha na comunicação com o Google");
          setLoading(false);
        }}
      />

      {loading && <p>Entrando...</p>}
      {erro && <p>{erro}</p>}
      {sucesso && <p>Login feito com sucesso</p>}
    </div>
  );
}