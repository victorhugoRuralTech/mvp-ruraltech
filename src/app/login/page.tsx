"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    
    try {
      if (!usuario || !senha) {
        setErro("Por favor, preencha todos os campos");
        setLoading(false);
        return;
      }

      // Buscar usuário no Supabase usando os nomes corretos das colunas
      const { data: usuarioEncontrado, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', usuario)
        .eq('password', senha)
        .single();

      if (error || !usuarioEncontrado) {
        console.error('Erro ao buscar usuário:', error);
        setErro("Usuário inválido, tente novamente");
        setLoading(false);
        return;
      }

      // Login bem-sucedido
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("usuarioAtual", usuario);
      localStorage.setItem("userId", usuarioEncontrado.id);
      
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (error) {
      console.error('Erro no login:', error);
      setErro("Erro ao processar login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Seção Esquerda - Formulário de Login */}
      <div className="w-full lg:w-1/2 bg-black flex flex-col justify-center items-center px-8 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-white text-4xl lg:text-5xl font-bold mb-2">
              Faça seu Login.
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <a
                href="/reset-password"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                Esqueceu sua senha?
              </a>
              <a
                href="/cadastro"
                className="text-gray-400 hover:text-green-500 transition-colors"
              >
                Ainda não tenho uma conta?
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
