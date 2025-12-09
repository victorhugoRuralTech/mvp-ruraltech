"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!usuario || !novaSenha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos");
      return;
    }

    // Verificar se as senhas coincidem
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    // Buscar usuários cadastrados
    const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    // Verificar se o usuário existe
    const usuarioIndex = usuariosExistentes.findIndex(
      (u: any) => u.usuario === usuario
    );

    if (usuarioIndex === -1) {
      setErro("Usuário não cadastrado");
      return;
    }

    // Atualizar a senha do usuário
    usuariosExistentes[usuarioIndex].senha = novaSenha;
    localStorage.setItem("usuarios", JSON.stringify(usuariosExistentes));

    setSucesso("Senha alterada com sucesso!");
    
    // Redirecionar para login após 2 segundos
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Seção Esquerda - Imagem */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/edd1e00e-bd04-4750-a395-29046b4119a0.jpg)",
        }}
      />

      {/* Seção Direita - Formulário de Redefinição de Senha */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col justify-center items-center px-8 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-2">
              Redefinir Senha.
            </h1>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-gray-400 text-sm">
                Usuário
              </Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Digite seu usuário"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="novaSenha" className="text-gray-400 text-sm">
                Nova Senha
              </Label>
              <Input
                id="novaSenha"
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Digite sua nova senha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="text-gray-400 text-sm">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Confirme sua nova senha"
              />
            </div>

            {erro && (
              <div className="text-red-500 text-sm font-medium">
                {erro}
              </div>
            )}

            {sucesso && (
              <div className="text-green-500 text-sm font-medium">
                {sucesso}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 text-lg rounded-lg transition-all"
            >
              Salvar
            </Button>

            <div className="flex justify-center">
              <a
                href="/login"
                className="text-gray-400 hover:text-green-500 transition-colors text-sm"
              >
                Voltar para o login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
