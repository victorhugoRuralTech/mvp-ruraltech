"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CadastroPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!usuario || !senha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    // Buscar usuários existentes
    const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    // Verificar se o usuário já existe
    const usuarioExiste = usuariosExistentes.find(
      (u: any) => u.usuario === usuario
    );

    if (usuarioExiste) {
      setErro("Usuário já cadastrado");
      return;
    }

    // Adicionar novo usuário
    const novoUsuario = { usuario, senha };
    usuariosExistentes.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosExistentes));

    // Redirecionar para login
    router.push("/login");
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

      {/* Seção Direita - Formulário de Cadastro */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col justify-center items-center px-8 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo e Título */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/639ff8d3-c93d-4574-9985-ad1cb5d185d4.png" 
              alt="Logo RuralTech" 
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
            />
            <h1 className="text-white text-3xl lg:text-4xl font-bold">
              RuralTech
            </h1>
          </div>

          <div>
            <h2 className="text-white text-4xl lg:text-5xl font-bold mb-2">
              Cadastro.
            </h2>
          </div>

          <form onSubmit={handleCadastro} className="space-y-6">
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
              <Label htmlFor="senha" className="text-gray-400 text-sm">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="text-gray-400 text-sm">
                Confirmar Senha
              </Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Confirme sua senha"
              />
            </div>

            {erro && (
              <div className="text-red-500 text-sm font-medium">
                {erro}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 text-lg rounded-lg transition-all"
            >
              Cadastrar
            </Button>

            <div className="flex justify-center items-center gap-2">
              <span className="text-gray-400 text-sm">
                Já tem uma conta?
              </span>
              <a
                href="/login"
                className="text-green-500 hover:text-green-400 transition-colors text-sm font-semibold"
              >
                Faça login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
