"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    
    if (!nome || !email || !usuario || !senha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Buscar usuários existentes
    const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios") || "[]");
    
    // Verificar se usuário ou email já existe
    const usuarioExiste = usuariosExistentes.find(
      (u: any) => u.usuario === usuario || u.email === email
    );

    if (usuarioExiste) {
      setErro("Usuário ou e-mail já cadastrado");
      return;
    }

    // Adicionar novo usuário
    const novoUsuario = {
      nome,
      email,
      usuario,
      senha
    };

    usuariosExistentes.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosExistentes));
    
    // Redirecionar para tela de login após cadastro
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Seção Esquerda - Formulário de Cadastro */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col justify-center items-center px-8 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-2">
              Crie sua Conta.
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Preencha os dados abaixo para começar
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-gray-400 text-sm">
                Nome Completo
              </Label>
              <Input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-400 text-sm">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-gray-700 text-white focus:border-green-500 focus:ring-green-500"
                placeholder="Digite seu e-mail"
              />
            </div>

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
                placeholder="Escolha um nome de usuário"
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
                placeholder="Crie uma senha (mín. 6 caracteres)"
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
                placeholder="Digite a senha novamente"
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
              Criar Conta
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-400">Já tem uma conta? </span>
              <a
                href="/login"
                className="text-green-500 hover:text-green-400 transition-colors font-semibold"
              >
                Faça login
              </a>
            </div>
          </form>
        </div>
      </div>

      {/* Seção Direita - Imagem do Boi */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url(https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/edd1e00e-bd04-4750-a395-29046b4119a0.jpg)",
        }}
      />
    </div>
  );
}
