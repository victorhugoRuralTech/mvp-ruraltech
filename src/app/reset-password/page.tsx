"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setLoading(true);

    try {
      if (!usuario || !novaSenha || !confirmarSenha) {
        setErro("Por favor, preencha todos os campos");
        setLoading(false);
        return;
      }

      // Verificar se as senhas coincidem
      if (novaSenha !== confirmarSenha) {
        setErro("As senhas não coincidem");
        setLoading(false);
        return;
      }

      // Verificar se o usuário existe no Supabase
      const { data: usuarioExistente, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('usuario', usuario)
        .single();

      if (checkError || !usuarioExistente) {
        setErro("Usuário não encontrado. Verifique o nome de usuário e tente novamente.");
        setLoading(false);
        return;
      }

      // Atualizar a senha do usuário no Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({ senha: novaSenha })
        .eq('usuario', usuario);

      if (updateError) {
        console.error('Erro ao atualizar senha:', updateError);
        setErro("Erro ao redefinir senha. Tente novamente.");
        setLoading(false);
        return;
      }

      setSucesso("Senha alterada com sucesso!");
      toast.success("Senha redefinida com sucesso!");
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setErro("Erro ao processar redefinição. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
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
