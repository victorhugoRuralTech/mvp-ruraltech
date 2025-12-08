"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Circle, 
  Users, 
  Package, 
  UserCheck, 
  ShoppingCart, 
  FileText, 
  Plus,
  Trash2,
  TrendingUp,
  DollarSign,
  Calendar,
  LogOut,
  Filter,
  Printer
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Types
interface Cattle {
  id: string;
  number: string;
  sex: "female" | "male";
  lot: string;
  createdAt: string;
}

interface Buyer {
  id: string;
  name: string;
  contact: string;
  createdAt: string;
}

interface Supply {
  id: string;
  name: string;
  type: "feed" | "medicine";
  quantity: number;
  unit: string;
  cost: number;
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
  createdAt: string;
}

interface Sale {
  id: string;
  lot: string;
  sex: "female" | "male";
  quantity: number;
  buyerId: string;
  employeeId: string;
  date: string;
  isFed: boolean;
  isVaccinated: boolean;
  totalValue: number;
  createdAt: string;
}

interface Lot {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export default function RuralTech() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  // State Management
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);

  // Form States
  const [cattleForm, setCattleForm] = useState({ number: "", sex: "" as "" | "female" | "male", lot: "" });
  const [buyerForm, setBuyerForm] = useState({ name: "", contact: "" });
  const [supplyForm, setSupplyForm] = useState({ name: "", type: "feed" as "feed" | "medicine", quantity: "", unit: "Kg", cost: "" });
  const [employeeForm, setEmployeeForm] = useState({ name: "" });
  const [saleForm, setSaleForm] = useState({
    lot: "",
    sex: "" as "" | "female" | "male",
    quantity: "",
    buyerId: "",
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    isFed: false,
    isVaccinated: false,
    totalValue: ""
  });

  // Validation errors for sale form
  const [saleFormErrors, setSaleFormErrors] = useState({
    lot: false,
    sex: false,
    quantity: false,
    buyerId: false,
    employeeId: false,
    totalValue: false
  });

  // Novo: Estado para criar lote
  const [lotForm, setLotForm] = useState({ name: "", color: "#10b981" });
  const [isLotDialogOpen, setIsLotDialogOpen] = useState(false);

  // Novo: Estado para gerenciar lotes (dialog de gerenciamento)
  const [isManageLotsDialogOpen, setIsManageLotsDialogOpen] = useState(false);

  // Novo: Estado para filtro de data
  const [dateFilter, setDateFilter] = useState({ day: "", month: "", year: "" });
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Novo: Estado para filtro de data de vendas
  const [salesDateFilter, setSalesDateFilter] = useState({ day: "", month: "", year: "" });
  const [isSalesFilterActive, setIsSalesFilterActive] = useState(false);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const storedUserId = localStorage.getItem("userId");
      
      if (!isLoggedIn || !storedUserId) {
        router.push("/login");
      } else {
        setUserId(storedUserId);
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Carregar dados do Supabase quando autenticado
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const loadUserData = async () => {
      try {
        // Carregar todos os dados do usuário
        const { data, error } = await supabase
          .from('user_data')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          console.error('Erro ao carregar dados:', error);
          return;
        }

        if (data) {
          // Organizar dados por tipo
          data.forEach((item) => {
            switch (item.data_type) {
              case 'cattle':
                setCattle(item.data);
                break;
              case 'buyers':
                setBuyers(item.data);
                break;
              case 'supplies':
                setSupplies(item.data);
                break;
              case 'employees':
                setEmployees(item.data);
                break;
              case 'sales':
                setSales(item.data);
                break;
              case 'lots':
                setLots(item.data);
                break;
            }
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
  }, [isAuthenticated, userId]);

  // Função para salvar dados no Supabase
  const saveToSupabase = async (dataType: string, data: any) => {
    if (!userId) return;

    try {
      // Verificar se já existe um registro para este tipo de dado
      const { data: existing } = await supabase
        .from('user_data')
        .select('id')
        .eq('user_id', userId)
        .eq('data_type', dataType)
        .single();

      if (existing) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('user_data')
          .update({ data, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        if (error) console.error('Erro ao atualizar dados:', error);
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('user_data')
          .insert([{ user_id: userId, data_type: dataType, data }]);

        if (error) console.error('Erro ao criar dados:', error);
      }
    } catch (error) {
      console.error('Erro ao salvar no Supabase:', error);
    }
  };

  // Salvar dados automaticamente quando mudarem
  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    saveToSupabase('cattle', cattle);
  }, [cattle, isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    saveToSupabase('buyers', buyers);
  }, [buyers, isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    saveToSupabase('supplies', supplies);
  }, [supplies, isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    saveToSupabase('employees', employees);
  }, [employees, isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    saveToSupabase('sales', sales);
  }, [sales, isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    saveToSupabase('lots', lots);
  }, [lots, isAuthenticated, userId]);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("usuarioAtual");
    localStorage.removeItem("userId");
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  // Novo: Adicionar lote
  const addLot = () => {
    if (!lotForm.name) {
      toast.error("Preencha o nome do lote");
      return;
    }
    const newLot: Lot = {
      id: Date.now().toString(),
      name: lotForm.name,
      color: lotForm.color,
      createdAt: new Date().toISOString()
    };
    setLots([...lots, newLot]);
    setLotForm({ name: "", color: "#10b981" });
    setIsLotDialogOpen(false);
    toast.success("Lote criado com sucesso!");
  };

  // Novo: Excluir lote com confirmação
  const deleteLot = (lotId: string, lotName: string) => {
    // Verificar se há gado neste lote
    const cattleInLot = cattle.filter(c => c.lot === lotName);
    if (cattleInLot.length > 0) {
      toast.error(`Não é possível excluir. Há ${cattleInLot.length} cabeça(s) de gado neste lote.`);
      return;
    }

    // Confirmar exclusão
    const confirmed = window.confirm(`Tem certeza que deseja excluir o lote "${lotName}"?`);
    if (confirmed) {
      setLots(lots.filter(l => l.id !== lotId));
      toast.success("Lote excluído com sucesso!");
    }
  };

  // CRUD Operations
  const addCattle = () => {
    if (!cattleForm.number || !cattleForm.sex || !cattleForm.lot) {
      toast.error("Preencha todos os campos");
      return;
    }
    const newCattle: Cattle = {
      id: Date.now().toString(),
      number: cattleForm.number,
      sex: cattleForm.sex,
      lot: cattleForm.lot,
      createdAt: new Date().toISOString()
    };
    setCattle([...cattle, newCattle]);
    setCattleForm({ number: "", sex: "", lot: "" });
    toast.success("Gado cadastrado com sucesso!");
  };

  const deleteCattle = (id: string) => {
    setCattle(cattle.filter(c => c.id !== id));
    toast.success("Gado removido");
  };

  const addBuyer = () => {
    if (!buyerForm.name || !buyerForm.contact) {
      toast.error("Preencha todos os campos");
      return;
    }
    const newBuyer: Buyer = {
      id: Date.now().toString(),
      name: buyerForm.name,
      contact: buyerForm.contact,
      createdAt: new Date().toISOString()
    };
    setBuyers([...buyers, newBuyer]);
    setBuyerForm({ name: "", contact: "" });
    toast.success("Comprador cadastrado com sucesso!");
  };

  const deleteBuyer = (id: string) => {
    setBuyers(buyers.filter(b => b.id !== id));
    toast.success("Comprador removido");
  };

  const addSupply = () => {
    if (!supplyForm.name || !supplyForm.quantity || !supplyForm.unit || !supplyForm.cost) {
      toast.error("Preencha todos os campos");
      return;
    }
    const newSupply: Supply = {
      id: Date.now().toString(),
      name: supplyForm.name,
      type: supplyForm.type,
      quantity: parseFloat(supplyForm.quantity),
      unit: supplyForm.unit,
      cost: parseFloat(supplyForm.cost),
      createdAt: new Date().toISOString()
    };
    setSupplies([...supplies, newSupply]);
    setSupplyForm({ name: "", type: "feed", quantity: "", unit: "Kg", cost: "" });
    toast.success("Insumo cadastrado com sucesso!");
  };

  const deleteSupply = (id: string) => {
    setSupplies(supplies.filter(s => s.id !== id));
    toast.success("Insumo removido");
  };

  const addEmployee = () => {
    if (!employeeForm.name) {
      toast.error("Preencha o nome do funcionário");
      return;
    }
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: employeeForm.name,
      createdAt: new Date().toISOString()
    };
    setEmployees([...employees, newEmployee]);
    setEmployeeForm({ name: "" });
    toast.success("Funcionário cadastrado com sucesso!");
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
    toast.success("Funcionário removido");
  };

  const addSale = () => {
    // Reset errors
    const errors = {
      lot: !saleForm.lot,
      sex: !saleForm.sex,
      quantity: !saleForm.quantity,
      buyerId: !saleForm.buyerId,
      employeeId: !saleForm.employeeId,
      totalValue: !saleForm.totalValue
    };

    setSaleFormErrors(errors);

    // Check if any field is empty
    if (Object.values(errors).some(error => error)) {
      toast.error("Campos obrigatórios não preenchidos");
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      lot: saleForm.lot,
      sex: saleForm.sex,
      quantity: parseInt(saleForm.quantity),
      buyerId: saleForm.buyerId,
      employeeId: saleForm.employeeId,
      date: saleForm.date,
      isFed: saleForm.isFed,
      isVaccinated: saleForm.isVaccinated,
      totalValue: parseFloat(saleForm.totalValue),
      createdAt: new Date().toISOString()
    };
    setSales([...sales, newSale]);
    setSaleForm({
      lot: "",
      sex: "",
      quantity: "",
      buyerId: "",
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      isFed: false,
      isVaccinated: false,
      totalValue: ""
    });
    setSaleFormErrors({
      lot: false,
      sex: false,
      quantity: false,
      buyerId: false,
      employeeId: false,
      totalValue: false
    });
    toast.success("Venda registrada com sucesso!");
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
    toast.success("Venda removida");
  };

  // Novo: Filtrar gado por data
  const filteredCattle = cattle.filter((c) => {
    if (!isFilterActive) return true;
    
    const cattleDate = new Date(c.createdAt);
    const cattleDay = cattleDate.getDate().toString();
    const cattleMonth = (cattleDate.getMonth() + 1).toString();
    const cattleYear = cattleDate.getFullYear().toString();

    const dayMatch = !dateFilter.day || cattleDay === dateFilter.day;
    const monthMatch = !dateFilter.month || cattleMonth === dateFilter.month;
    const yearMatch = !dateFilter.year || cattleYear === dateFilter.year;

    return dayMatch && monthMatch && yearMatch;
  });

  // Novo: Filtrar vendas por data
  const filteredSales = sales.filter((s) => {
    if (!isSalesFilterActive) return true;
    
    const saleDate = new Date(s.date);
    const saleDay = saleDate.getDate().toString();
    const saleMonth = (saleDate.getMonth() + 1).toString();
    const saleYear = saleDate.getFullYear().toString();

    const dayMatch = !salesDateFilter.day || saleDay === salesDateFilter.day;
    const monthMatch = !salesDateFilter.month || saleMonth === salesDateFilter.month;
    const yearMatch = !salesDateFilter.year || saleYear === salesDateFilter.year;

    return dayMatch && monthMatch && yearMatch;
  });

  const applyFilter = () => {
    if (!dateFilter.day && !dateFilter.month && !dateFilter.year) {
      toast.error("Preencha pelo menos um campo de filtro");
      return;
    }
    setIsFilterActive(true);
    toast.success("Filtro aplicado!");
  };

  const clearFilter = () => {
    setDateFilter({ day: "", month: "", year: "" });
    setIsFilterActive(false);
    toast.success("Filtro removido!");
  };

  const applySalesFilter = () => {
    if (!salesDateFilter.day && !salesDateFilter.month && !salesDateFilter.year) {
      toast.error("Preencha pelo menos um campo de filtro");
      return;
    }
    setIsSalesFilterActive(true);
    toast.success("Filtro aplicado!");
  };

  const clearSalesFilter = () => {
    setSalesDateFilter({ day: "", month: "", year: "" });
    setIsSalesFilterActive(false);
    toast.success("Filtro removido!");
  };

  // Função para imprimir relatórios
  const printReport = (type: 'cattle' | 'supplies' | 'sales') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Não foi possível abrir a janela de impressão");
      return;
    }

    let content = '';
    const currentDate = new Date().toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (type === 'cattle') {
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Gado - RuralTech</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #10b981; text-align: center; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #10b981; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .summary { background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🐄 RuralTech - Sistema de Gestão de Fazenda</h1>
            <h2>Relatório de Gado Registrado</h2>
            <p>Gerado em: ${currentDate}</p>
          </div>
          
          <div class="summary">
            <h3>Resumo</h3>
            <p><strong>Total de Cabeças:</strong> ${cattle.length}</p>
            <p><strong>Fêmeas:</strong> ${cattle.filter(c => c.sex === 'female').length}</p>
            <p><strong>Machos:</strong> ${cattle.filter(c => c.sex === 'male').length}</p>
            <p><strong>Lotes Ativos:</strong> ${new Set(cattle.map(c => c.lot)).size}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Numeração</th>
                <th>Sexo</th>
                <th>Lote</th>
                <th>Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              ${cattle.map(c => `
                <tr>
                  <td>${c.number}</td>
                  <td>${c.sex === 'female' ? 'Fêmea' : 'Macho'}</td>
                  <td>${c.lot}</td>
                  <td>${new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>RuralTech © ${new Date().getFullYear()} - Sistema de Gestão de Fazenda</p>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'supplies') {
      const totalCost = supplies.reduce((sum, s) => sum + (s.cost * s.quantity), 0);
      const feedCost = supplies.filter(s => s.type === 'feed').reduce((sum, s) => sum + (s.cost * s.quantity), 0);
      const medicineCost = supplies.filter(s => s.type === 'medicine').reduce((sum, s) => sum + (s.cost * s.quantity), 0);

      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Insumos - RuralTech</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #a855f7; text-align: center; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #a855f7; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .summary { background-color: #faf5ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .cost-highlight { font-weight: bold; color: #a855f7; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📦 RuralTech - Sistema de Gestão de Fazenda</h1>
            <h2>Relatório de Insumos Registrados</h2>
            <p>Gerado em: ${currentDate}</p>
          </div>
          
          <div class="summary">
            <h3>Resumo Financeiro</h3>
            <p><strong>Total de Insumos:</strong> ${supplies.length} itens</p>
            <p><strong>Custo Total:</strong> <span class="cost-highlight">${totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
            <p><strong>Rações:</strong> ${feedCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <p><strong>Medicamentos:</strong> ${medicineCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Unidade</th>
                <th>Custo Unitário</th>
                <th>Custo Total</th>
                <th>Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              ${supplies.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.type === 'feed' ? 'Ração' : 'Medicamento'}</td>
                  <td>${s.quantity}</td>
                  <td>${s.unit}</td>
                  <td>${s.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td class="cost-highlight">${(s.cost * s.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>${new Date(s.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>RuralTech © ${new Date().getFullYear()} - Sistema de Gestão de Fazenda</p>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'sales') {
      const totalRevenue = sales.reduce((sum, s) => sum + s.totalValue, 0);
      const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0);

      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Relatório de Vendas - RuralTech</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #22c55e; text-align: center; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #22c55e; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            .summary { background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .revenue-highlight { font-weight: bold; color: #22c55e; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💰 RuralTech - Sistema de Gestão de Fazenda</h1>
            <h2>Relatório de Vendas Registradas</h2>
            <p>Gerado em: ${currentDate}</p>
          </div>
          
          <div class="summary">
            <h3>Resumo de Vendas</h3>
            <p><strong>Total de Vendas:</strong> ${sales.length} transações</p>
            <p><strong>Quantidade Total Vendida:</strong> ${totalQuantity} cabeças</p>
            <p><strong>Receita Total:</strong> <span class="revenue-highlight">${totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Lote</th>
                <th>Sexo</th>
                <th>Quantidade</th>
                <th>Comprador</th>
                <th>Responsável</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              ${sales.map(s => {
                const buyer = buyers.find(b => b.id === s.buyerId);
                const employee = employees.find(e => e.id === s.employeeId);
                const status = [];
                if (s.isFed) status.push('Alimentado');
                if (s.isVaccinated) status.push('Vacinado');
                
                return `
                  <tr>
                    <td>${new Date(s.date).toLocaleDateString('pt-BR')}</td>
                    <td>${s.lot}</td>
                    <td>${s.sex === 'female' ? 'Fêmea' : 'Macho'}</td>
                    <td>${s.quantity}</td>
                    <td>${buyer?.name || 'N/A'}</td>
                    <td>${employee?.name || 'N/A'}</td>
                    <td>${status.join(', ') || '-'}</td>
                    <td class="revenue-highlight">${s.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>RuralTech © ${new Date().getFullYear()} - Sistema de Gestão de Fazenda</p>
          </div>
        </body>
        </html>
      `;
    }

    printWindow.document.write(content);
    printWindow.document.close();
    
    // Aguardar o carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print();
    };

    toast.success("Relatório aberto para impressão!");
  };

  // Reports
  const monthlyReport = {
    totalSales: sales.filter(s => {
      const saleDate = new Date(s.date);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }).length,
    totalQuantity: sales.filter(s => {
      const saleDate = new Date(s.date);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }).reduce((sum, s) => sum + s.quantity, 0),
    totalRevenue: sales.filter(s => {
      const saleDate = new Date(s.date);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }).reduce((sum, s) => sum + s.totalValue, 0)
  };

  const costsReport = {
    totalCosts: supplies.reduce((sum, s) => sum + (s.cost * s.quantity), 0),
    feedCosts: supplies.filter(s => s.type === "feed").reduce((sum, s) => sum + (s.cost * s.quantity), 0),
    medicineCosts: supplies.filter(s => s.type === "medicine").reduce((sum, s) => sum + (s.cost * s.quantity), 0)
  };

  const cattleByLot = cattle.reduce((acc, c) => {
    acc[c.lot] = (acc[c.lot] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Circle className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (redirecionamento já foi feito)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-emerald-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 sm:p-3 rounded-xl shadow-lg">
                <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">RuralTech</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sistema de Gestão de Fazenda</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-300 dark:border-red-700 border-2 font-bold px-6 py-3 text-base shadow-lg hover:shadow-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-md">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs sm:text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="cattle" className="flex items-center gap-2 text-xs sm:text-sm">
              <Circle className="w-4 h-4" />
              <span className="hidden sm:inline">Gado</span>
            </TabsTrigger>
            <TabsTrigger value="buyers" className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Compradores</span>
            </TabsTrigger>
            <TabsTrigger value="supplies" className="flex items-center gap-2 text-xs sm:text-sm">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Insumos</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2 text-xs sm:text-sm">
              <UserCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Funcionários</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2 text-xs sm:text-sm">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Vendas</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Circle className="w-5 h-5" />
                    Total de Gado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{cattle.length}</div>
                  <p className="text-xs text-emerald-100 mt-1">cabeças cadastradas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Vendas do Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyReport.totalQuantity}</div>
                  <p className="text-xs text-blue-100 mt-1">cabeças vendidas</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Receita Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {monthlyReport.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <p className="text-xs text-purple-100 mt-1">faturamento</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Custos Totais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {costsReport.totalCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <p className="text-xs text-orange-100 mt-1">em insumos</p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Resumo Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compradores Cadastrados</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{buyers.length}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Funcionários Ativos</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{employees.length}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Insumos em Estoque</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{supplies.length}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Vendas</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{sales.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cattle Tab */}
          <TabsContent value="cattle" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Circle className="w-5 h-5 text-emerald-600" />
                  Cadastrar Gado
                </CardTitle>
                <CardDescription>Adicione novos animais ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cattle-number">Numeração</Label>
                    <Input
                      id="cattle-number"
                      placeholder="Ex: 001"
                      value={cattleForm.number}
                      onChange={(e) => setCattleForm({ ...cattleForm, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cattle-sex">Sexo</Label>
                    <Select value={cattleForm.sex} onValueChange={(value: "female" | "male") => setCattleForm({ ...cattleForm, sex: value })}>
                      <SelectTrigger id="cattle-sex">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Fêmea</SelectItem>
                        <SelectItem value="male">Macho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cattle-lot">Lote</Label>
                    <div className="flex gap-2">
                      <Select value={cattleForm.lot} onValueChange={(value) => setCattleForm({ ...cattleForm, lot: value })}>
                        <SelectTrigger id="cattle-lot" className="flex-1">
                          <SelectValue placeholder="Selecione o lote" />
                        </SelectTrigger>
                        <SelectContent>
                          {lots.map((lot) => (
                            <SelectItem key={lot.id} value={lot.name}>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lot.color }} />
                                {lot.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={isLotDialogOpen} onOpenChange={setIsLotDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Criar Novo Lote</DialogTitle>
                            <DialogDescription>Adicione um novo lote para organizar seu gado</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="lot-name">Nome do Lote</Label>
                              <Input
                                id="lot-name"
                                placeholder="Ex: Lote A"
                                value={lotForm.name}
                                onChange={(e) => setLotForm({ ...lotForm, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lot-color">Cor do Lote</Label>
                              <Input
                                id="lot-color"
                                type="color"
                                value={lotForm.color}
                                onChange={(e) => setLotForm({ ...lotForm, color: e.target.value })}
                              />
                            </div>
                            <Button onClick={addLot} className="w-full">
                              <Plus className="w-4 h-4 mr-2" />
                              Criar Lote
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={isManageLotsDialogOpen} onOpenChange={setIsManageLotsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Gerenciar Lotes</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Gerenciar Lotes</DialogTitle>
                            <DialogDescription>Visualize e exclua lotes cadastrados</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            {lots.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">Nenhum lote cadastrado</p>
                            ) : (
                              <div className="space-y-2">
                                {lots.map((lot) => {
                                  const cattleCount = cattle.filter(c => c.lot === lot.name).length;
                                  return (
                                    <div key={lot.id} className="flex items-center justify-between p-3 border rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: lot.color }} />
                                        <div>
                                          <p className="font-medium">{lot.name}</p>
                                          <p className="text-sm text-gray-500">{cattleCount} cabeça(s) de gado</p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteLot(lot.id, lot.name)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                <Button onClick={addCattle} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Gado
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <Circle className="w-5 h-5 text-emerald-600" />
                    Gado Cadastrado
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar por Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filtrar Gado por Data de Cadastro</DialogTitle>
                        <DialogDescription>Preencha os campos desejados para filtrar</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="filter-day">Dia</Label>
                            <Input
                              id="filter-day"
                              type="number"
                              min="1"
                              max="31"
                              placeholder="DD"
                              value={dateFilter.day}
                              onChange={(e) => setDateFilter({ ...dateFilter, day: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="filter-month">Mês</Label>
                            <Input
                              id="filter-month"
                              type="number"
                              min="1"
                              max="12"
                              placeholder="MM"
                              value={dateFilter.month}
                              onChange={(e) => setDateFilter({ ...dateFilter, month: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="filter-year">Ano</Label>
                            <Input
                              id="filter-year"
                              type="number"
                              placeholder="AAAA"
                              value={dateFilter.year}
                              onChange={(e) => setDateFilter({ ...dateFilter, year: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={applyFilter} className="flex-1">
                            <Filter className="w-4 h-4 mr-2" />
                            Aplicar Filtro
                          </Button>
                          {isFilterActive && (
                            <Button onClick={clearFilter} variant="outline">
                              Limpar
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {isFilterActive && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      Filtro ativo: {dateFilter.day && `${dateFilter.day}/`}{dateFilter.month && `${dateFilter.month}/`}{dateFilter.year}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numeração</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCattle.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            Nenhum gado cadastrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCattle.map((c) => {
                          const lot = lots.find(l => l.name === c.lot);
                          return (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.number}</TableCell>
                              <TableCell>
                                <Badge variant={c.sex === "female" ? "default" : "secondary"}>
                                  {c.sex === "female" ? "Fêmea" : "Macho"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {lot && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lot.color }} />}
                                  {c.lot}
                                </div>
                              </TableCell>
                              <TableCell>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteCattle(c.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyers Tab */}
          <TabsContent value="buyers" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Users className="w-5 h-5 text-blue-600" />
                  Cadastrar Comprador
                </CardTitle>
                <CardDescription>Adicione novos compradores ao sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer-name">Nome</Label>
                    <Input
                      id="buyer-name"
                      placeholder="Nome do comprador"
                      value={buyerForm.name}
                      onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyer-contact">Contato</Label>
                    <Input
                      id="buyer-contact"
                      placeholder="Telefone ou email"
                      value={buyerForm.contact}
                      onChange={(e) => setBuyerForm({ ...buyerForm, contact: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addBuyer} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Comprador
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Users className="w-5 h-5 text-blue-600" />
                  Compradores Cadastrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {buyers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                            Nenhum comprador cadastrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        buyers.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell>{b.contact}</TableCell>
                            <TableCell>{new Date(b.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteBuyer(b.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplies Tab */}
          <TabsContent value="supplies" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Package className="w-5 h-5 text-purple-600" />
                  Cadastrar Insumo
                </CardTitle>
                <CardDescription>Adicione rações e medicamentos ao estoque</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supply-name">Nome</Label>
                    <Input
                      id="supply-name"
                      placeholder="Nome do insumo"
                      value={supplyForm.name}
                      onChange={(e) => setSupplyForm({ ...supplyForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supply-type">Tipo</Label>
                    <Select value={supplyForm.type} onValueChange={(value: "feed" | "medicine") => setSupplyForm({ ...supplyForm, type: value })}>
                      <SelectTrigger id="supply-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feed">Ração</SelectItem>
                        <SelectItem value="medicine">Medicamento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supply-quantity">Quantidade</Label>
                    <Input
                      id="supply-quantity"
                      type="number"
                      placeholder="0"
                      value={supplyForm.quantity}
                      onChange={(e) => setSupplyForm({ ...supplyForm, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supply-unit">Unidade</Label>
                    <Select value={supplyForm.unit} onValueChange={(value) => setSupplyForm({ ...supplyForm, unit: value })}>
                      <SelectTrigger id="supply-unit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="Un">Un</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supply-cost">Custo (R$)</Label>
                    <Input
                      id="supply-cost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={supplyForm.cost}
                      onChange={(e) => setSupplyForm({ ...supplyForm, cost: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addSupply} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Insumo
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Package className="w-5 h-5 text-purple-600" />
                  Insumos em Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Custo Unitário</TableHead>
                        <TableHead>Custo Total</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            Nenhum insumo cadastrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        supplies.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>
                              <Badge variant={s.type === "feed" ? "default" : "secondary"}>
                                {s.type === "feed" ? "Ração" : "Medicamento"}
                              </Badge>
                            </TableCell>
                            <TableCell>{s.quantity} {s.unit}</TableCell>
                            <TableCell>{s.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell className="font-bold">{(s.cost * s.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell>{new Date(s.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteSupply(s.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                  Cadastrar Funcionário
                </CardTitle>
                <CardDescription>Adicione funcionários responsáveis pelas vendas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employee-name">Nome do Funcionário</Label>
                  <Input
                    id="employee-name"
                    placeholder="Nome completo"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ name: e.target.value })}
                  />
                </div>
                <Button onClick={addEmployee} className="w-full bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Funcionário
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <UserCheck className="w-5 h-5 text-orange-600" />
                  Funcionários Cadastrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                            Nenhum funcionário cadastrado
                          </TableCell>
                        </TableRow>
                      ) : (
                        employees.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell className="font-medium">{e.name}</TableCell>
                            <TableCell>{new Date(e.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteEmployee(e.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  Registrar Venda
                </CardTitle>
                <CardDescription>Registre vendas de gado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-lot">Lote *</Label>
                    <Select 
                      value={saleForm.lot} 
                      onValueChange={(value) => {
                        setSaleForm({ ...saleForm, lot: value });
                        setSaleFormErrors({ ...saleFormErrors, lot: false });
                      }}
                    >
                      <SelectTrigger id="sale-lot" className={saleFormErrors.lot ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione o lote" />
                      </SelectTrigger>
                      <SelectContent>
                        {lots.map((lot) => (
                          <SelectItem key={lot.id} value={lot.name}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lot.color }} />
                              {lot.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-sex">Sexo *</Label>
                    <Select 
                      value={saleForm.sex} 
                      onValueChange={(value: "female" | "male") => {
                        setSaleForm({ ...saleForm, sex: value });
                        setSaleFormErrors({ ...saleFormErrors, sex: false });
                      }}
                    >
                      <SelectTrigger id="sale-sex" className={saleFormErrors.sex ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Fêmea</SelectItem>
                        <SelectItem value="male">Macho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-quantity">Quantidade *</Label>
                    <Input
                      id="sale-quantity"
                      type="number"
                      placeholder="0"
                      value={saleForm.quantity}
                      onChange={(e) => {
                        setSaleForm({ ...saleForm, quantity: e.target.value });
                        setSaleFormErrors({ ...saleFormErrors, quantity: false });
                      }}
                      className={saleFormErrors.quantity ? "border-red-500" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-buyer">Comprador *</Label>
                    <Select 
                      value={saleForm.buyerId} 
                      onValueChange={(value) => {
                        setSaleForm({ ...saleForm, buyerId: value });
                        setSaleFormErrors({ ...saleFormErrors, buyerId: false });
                      }}
                    >
                      <SelectTrigger id="sale-buyer" className={saleFormErrors.buyerId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {buyers.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-employee">Responsável *</Label>
                    <Select 
                      value={saleForm.employeeId} 
                      onValueChange={(value) => {
                        setSaleForm({ ...saleForm, employeeId: value });
                        setSaleFormErrors({ ...saleFormErrors, employeeId: false });
                      }}
                    >
                      <SelectTrigger id="sale-employee" className={saleFormErrors.employeeId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-date">Data da Venda</Label>
                    <Input
                      id="sale-date"
                      type="date"
                      value={saleForm.date}
                      onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-value">Valor Total (R$) *</Label>
                    <Input
                      id="sale-value"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={saleForm.totalValue}
                      onChange={(e) => {
                        setSaleForm({ ...saleForm, totalValue: e.target.value });
                        setSaleFormErrors({ ...saleFormErrors, totalValue: false });
                      }}
                      className={saleFormErrors.totalValue ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sale-fed"
                      checked={saleForm.isFed}
                      onCheckedChange={(checked) => setSaleForm({ ...saleForm, isFed: checked as boolean })}
                    />
                    <Label htmlFor="sale-fed" className="cursor-pointer">Alimentado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sale-vaccinated"
                      checked={saleForm.isVaccinated}
                      onCheckedChange={(checked) => setSaleForm({ ...saleForm, isVaccinated: checked as boolean })}
                    />
                    <Label htmlFor="sale-vaccinated" className="cursor-pointer">Vacinado</Label>
                  </div>
                </div>
                <Button onClick={addSale} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Venda
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    Vendas Registradas
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar por Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filtrar Vendas por Data</DialogTitle>
                        <DialogDescription>Preencha os campos desejados para filtrar</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="sales-filter-day">Dia</Label>
                            <Input
                              id="sales-filter-day"
                              type="number"
                              min="1"
                              max="31"
                              placeholder="DD"
                              value={salesDateFilter.day}
                              onChange={(e) => setSalesDateFilter({ ...salesDateFilter, day: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sales-filter-month">Mês</Label>
                            <Input
                              id="sales-filter-month"
                              type="number"
                              min="1"
                              max="12"
                              placeholder="MM"
                              value={salesDateFilter.month}
                              onChange={(e) => setSalesDateFilter({ ...salesDateFilter, month: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sales-filter-year">Ano</Label>
                            <Input
                              id="sales-filter-year"
                              type="number"
                              placeholder="AAAA"
                              value={salesDateFilter.year}
                              onChange={(e) => setSalesDateFilter({ ...salesDateFilter, year: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={applySalesFilter} className="flex-1">
                            <Filter className="w-4 h-4 mr-2" />
                            Aplicar Filtro
                          </Button>
                          {isSalesFilterActive && (
                            <Button onClick={clearSalesFilter} variant="outline">
                              Limpar
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {isSalesFilterActive && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">
                      Filtro ativo: {salesDateFilter.day && `${salesDateFilter.day}/`}{salesDateFilter.month && `${salesDateFilter.month}/`}{salesDateFilter.year}
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                            Nenhuma venda registrada
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSales.map((s) => {
                          const buyer = buyers.find(b => b.id === s.buyerId);
                          const employee = employees.find(e => e.id === s.employeeId);
                          const lot = lots.find(l => l.name === s.lot);
                          return (
                            <TableRow key={s.id}>
                              <TableCell>{new Date(s.date).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {lot && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lot.color }} />}
                                  {s.lot}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={s.sex === "female" ? "default" : "secondary"}>
                                  {s.sex === "female" ? "Fêmea" : "Macho"}
                                </Badge>
                              </TableCell>
                              <TableCell>{s.quantity}</TableCell>
                              <TableCell>{buyer?.name || "N/A"}</TableCell>
                              <TableCell>{employee?.name || "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {s.isFed && <Badge variant="outline" className="text-xs">Alimentado</Badge>}
                                  {s.isVaccinated && <Badge variant="outline" className="text-xs">Vacinado</Badge>}
                                  {!s.isFed && !s.isVaccinated && "-"}
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-green-600">
                                {s.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteSale(s.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Relatório de Gado
                  </CardTitle>
                  <CardDescription>Visualize estatísticas do rebanho</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total de Cabeças</span>
                      <span className="font-bold">{cattle.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fêmeas</span>
                      <span className="font-bold">{cattle.filter(c => c.sex === "female").length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Machos</span>
                      <span className="font-bold">{cattle.filter(c => c.sex === "male").length}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2 mt-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Distribuição por Lote</p>
                      {Object.entries(cattleByLot).map(([lot, count]) => {
                        const lotData = lots.find(l => l.name === lot);
                        return (
                          <div key={lot} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {lotData && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: lotData.color }} />}
                              <span className="text-sm text-gray-600 dark:text-gray-400">{lot}</span>
                            </div>
                            <span className="font-bold">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <Button onClick={() => printReport('cattle')} className="w-full" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Relatório de Custos
                  </CardTitle>
                  <CardDescription>Análise de gastos com insumos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Custo Total</span>
                      <span className="font-bold text-purple-600">
                        {costsReport.totalCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rações</span>
                      <span className="font-bold">
                        {costsReport.feedCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Medicamentos</span>
                      <span className="font-bold">
                        {costsReport.medicineCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total de Itens</span>
                      <span className="font-bold">{supplies.length}</span>
                    </div>
                  </div>
                  <Button onClick={() => printReport('supplies')} className="w-full" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Relatório Mensal
                  </CardTitle>
                  <CardDescription>Vendas do mês atual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total de Vendas</span>
                      <span className="font-bold">{monthlyReport.totalSales}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Quantidade Vendida</span>
                      <span className="font-bold">{monthlyReport.totalQuantity} cabeças</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Receita Total</span>
                      <span className="font-bold text-green-600">
                        {monthlyReport.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Ticket Médio</span>
                      <span className="font-bold">
                        {monthlyReport.totalSales > 0
                          ? (monthlyReport.totalRevenue / monthlyReport.totalSales).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : "R$ 0,00"}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => printReport('sales')} className="w-full" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Relatório
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Análise Geral
                  </CardTitle>
                  <CardDescription>Visão geral do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Compradores Ativos</span>
                      <span className="font-bold">{buyers.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Funcionários</span>
                      <span className="font-bold">{employees.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Lotes Cadastrados</span>
                      <span className="font-bold">{lots.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total de Vendas</span>
                      <span className="font-bold">{sales.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
