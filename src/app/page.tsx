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
  Filter
} from "lucide-react";
import { toast } from "sonner";

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
      if (!isLoggedIn) {
        router.push("/login");
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Load data from localStorage
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadedCattle = localStorage.getItem("cattle");
    const loadedBuyers = localStorage.getItem("buyers");
    const loadedSupplies = localStorage.getItem("supplies");
    const loadedEmployees = localStorage.getItem("employees");
    const loadedSales = localStorage.getItem("sales");
    const loadedLots = localStorage.getItem("lots");

    if (loadedCattle) setCattle(JSON.parse(loadedCattle));
    if (loadedBuyers) setBuyers(JSON.parse(loadedBuyers));
    if (loadedSupplies) setSupplies(JSON.parse(loadedSupplies));
    if (loadedEmployees) setEmployees(JSON.parse(loadedEmployees));
    if (loadedSales) setSales(JSON.parse(loadedSales));
    if (loadedLots) setLots(JSON.parse(loadedLots));
  }, [isAuthenticated]);

  // Save to localStorage
  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("cattle", JSON.stringify(cattle));
  }, [cattle, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("buyers", JSON.stringify(buyers));
  }, [buyers, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("supplies", JSON.stringify(supplies));
  }, [supplies, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    localStorage.setItem("lots", JSON.stringify(lots));
  }, [lots, isAuthenticated]);

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
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
              style={{ display: 'flex !important', visibility: 'visible !important', opacity: '1 !important' }}
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

          {/* Cattle Management */}
          <TabsContent value="cattle" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  Cadastrar Gado
                </CardTitle>
                <CardDescription>Adicione novos animais ao rebanho</CardDescription>
              </CardHeader>
              <CardContent>
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
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">
                          <span className="text-pink-600 font-medium">Fêmea</span>
                        </SelectItem>
                        <SelectItem value="male">
                          <span className="text-blue-600 font-medium">Macho</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cattle-lot">Lote</Label>
                    <div className="flex gap-2">
                      <Select value={cattleForm.lot} onValueChange={(value) => setCattleForm({ ...cattleForm, lot: value })}>
                        <SelectTrigger id="cattle-lot" className="flex-1">
                          <SelectValue placeholder="Selecione um lote" />
                        </SelectTrigger>
                        <SelectContent>
                          {lots.map((lot) => (
                            <SelectItem key={lot.id} value={lot.name}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: lot.color }}
                                />
                                {lot.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={isLotDialogOpen} onOpenChange={setIsLotDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="shrink-0">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Criar Novo Lote</DialogTitle>
                            <DialogDescription>
                              Defina o nome e a cor do novo lote
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
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
                              <div className="flex gap-2 items-center">
                                <Input
                                  id="lot-color"
                                  type="color"
                                  value={lotForm.color}
                                  onChange={(e) => setLotForm({ ...lotForm, color: e.target.value })}
                                  className="w-20 h-10 cursor-pointer"
                                />
                                <span className="text-sm text-gray-600">{lotForm.color}</span>
                              </div>
                            </div>
                          </div>
                          <Button onClick={addLot} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Criar Lote
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Dialog open={isManageLotsDialogOpen} onOpenChange={setIsManageLotsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="shrink-0" title="Gerenciar Lotes">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Gerenciar Lotes</DialogTitle>
                            <DialogDescription>
                              Visualize e exclua lotes cadastrados
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            {lots.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">Nenhum lote cadastrado ainda</p>
                            ) : (
                              <div className="space-y-2 max-h-96 overflow-y-auto">
                                {lots.map((lot) => {
                                  const cattleCount = cattle.filter(c => c.lot === lot.name).length;
                                  return (
                                    <div 
                                      key={lot.id} 
                                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div 
                                          className="w-4 h-4 rounded-full shrink-0" 
                                          style={{ backgroundColor: lot.color }}
                                        />
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-800 dark:text-gray-100">{lot.name}</p>
                                          <p className="text-xs text-gray-500">
                                            {cattleCount} cabeça{cattleCount !== 1 ? 's' : ''} de gado
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          const cattleInLot = cattle.filter(c => c.lot === lot.name).length;
                                          if (cattleInLot > 0) {
                                            toast.error(`Não é possível excluir. Há ${cattleInLot} cabeça(s) de gado neste lote.`);
                                            return;
                                          }
                                          setLots(lots.filter(l => l.id !== lot.id));
                                          toast.success("Lote excluído com sucesso!");
                                        }}
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
                <Button onClick={addCattle} className="mt-4 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Gado
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-100">Gado Cadastrado</CardTitle>
                    <CardDescription>
                      {isFilterActive ? `${filteredCattle.length} de ${cattle.length}` : cattle.length} cabeças no rebanho
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrar por Data
                        {isFilterActive && <Badge variant="secondary" className="ml-1">Ativo</Badge>}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filtrar Gado por Data de Registro</DialogTitle>
                        <DialogDescription>
                          Preencha os campos desejados para filtrar
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
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
                              min="2000"
                              max="2100"
                              placeholder="AAAA"
                              value={dateFilter.year}
                              onChange={(e) => setDateFilter({ ...dateFilter, year: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={applyFilter} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Aplicar Filtro
                          </Button>
                          {isFilterActive && (
                            <Button onClick={clearFilter} variant="outline" className="flex-1">
                              Limpar Filtro
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                      {filteredCattle.map((c) => {
                        const lot = lots.find(l => l.name === c.lot);
                        return (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.number}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={c.sex === "female" ? "text-pink-600 border-pink-600" : "text-blue-600 border-blue-600"}
                              >
                                {c.sex === "female" ? "Fêmea" : "Macho"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className="border-2"
                                style={{ 
                                  borderColor: lot?.color || '#10b981',
                                  color: lot?.color || '#10b981'
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-2 h-2 rounded-full" 
                                    style={{ backgroundColor: lot?.color || '#10b981' }}
                                  />
                                  {c.lot}
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteCattle(c.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buyers Management */}
          <TabsContent value="buyers" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Cadastrar Comprador
                </CardTitle>
                <CardDescription>Adicione novos compradores</CardDescription>
              </CardHeader>
              <CardContent>
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
                <Button onClick={addBuyer} className="mt-4 w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Comprador
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-100">Compradores Cadastrados</CardTitle>
                <CardDescription>{buyers.length} compradores ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                      {buyers.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-medium">{b.name}</TableCell>
                          <TableCell>{b.contact}</TableCell>
                          <TableCell>{new Date(b.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBuyer(b.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplies Management */}
          <TabsContent value="supplies" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Plus className="w-5 h-5 text-purple-600" />
                  Cadastrar Insumo
                </CardTitle>
                <CardDescription>Adicione rações e medicamentos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kg">Kg</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="Unid">Unid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supply-cost">Custo Unitário (R$)</Label>
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
                <Button onClick={addSupply} className="mt-4 w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Insumo
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-100">Insumos em Estoque</CardTitle>
                <CardDescription>{supplies.length} itens cadastrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Unidade</TableHead>
                        <TableHead>Custo Unit.</TableHead>
                        <TableHead>Custo Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplies.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell>
                            <Badge variant={s.type === "feed" ? "default" : "secondary"}>
                              {s.type === "feed" ? "Ração" : "Medicamento"}
                            </Badge>
                          </TableCell>
                          <TableCell>{s.quantity}</TableCell>
                          <TableCell>{s.unit}</TableCell>
                          <TableCell>{s.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                          <TableCell className="font-semibold">
                            {(s.cost * s.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSupply(s.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Employees Management */}
          <TabsContent value="employees" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Plus className="w-5 h-5 text-orange-600" />
                  Cadastrar Funcionário
                </CardTitle>
                <CardDescription>Adicione membros da equipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="employee-name">Nome</Label>
                  <Input
                    id="employee-name"
                    placeholder="Nome do funcionário"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ name: e.target.value })}
                  />
                </div>
                <Button onClick={addEmployee} className="mt-4 w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Funcionário
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-100">Funcionários Cadastrados</CardTitle>
                <CardDescription>{employees.length} funcionários ativos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium">{e.name}</TableCell>
                          <TableCell>{new Date(e.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteEmployee(e.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Management */}
          <TabsContent value="sales" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Plus className="w-5 h-5 text-green-600" />
                  Registrar Venda
                </CardTitle>
                <CardDescription>Registre vendas de gado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-lot" className={saleFormErrors.lot ? "text-red-600" : ""}>
                      Lote {saleFormErrors.lot && <span className="text-red-600">*</span>}
                    </Label>
                    <Input
                      id="sale-lot"
                      placeholder="Ex: Lote A"
                      value={saleForm.lot}
                      onChange={(e) => {
                        setSaleForm({ ...saleForm, lot: e.target.value });
                        setSaleFormErrors({ ...saleFormErrors, lot: false });
                      }}
                      className={saleFormErrors.lot ? "border-red-600 focus-visible:ring-red-600" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-sex" className={saleFormErrors.sex ? "text-red-600" : ""}>
                      Sexo {saleFormErrors.sex && <span className="text-red-600">*</span>}
                    </Label>
                    <Select 
                      value={saleForm.sex} 
                      onValueChange={(value: "female" | "male") => {
                        setSaleForm({ ...saleForm, sex: value });
                        setSaleFormErrors({ ...saleFormErrors, sex: false });
                      }}
                    >
                      <SelectTrigger 
                        id="sale-sex"
                        className={saleFormErrors.sex ? "border-red-600 focus:ring-red-600" : ""}
                      >
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">
                          <span className="text-pink-600 font-medium">Fêmea</span>
                        </SelectItem>
                        <SelectItem value="male">
                          <span className="text-blue-600 font-medium">Macho</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-quantity" className={saleFormErrors.quantity ? "text-red-600" : ""}>
                      Quantidade {saleFormErrors.quantity && <span className="text-red-600">*</span>}
                    </Label>
                    <Input
                      id="sale-quantity"
                      type="number"
                      placeholder="0"
                      value={saleForm.quantity}
                      onChange={(e) => {
                        setSaleForm({ ...saleForm, quantity: e.target.value });
                        setSaleFormErrors({ ...saleFormErrors, quantity: false });
                      }}
                      className={saleFormErrors.quantity ? "border-red-600 focus-visible:ring-red-600" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-buyer" className={saleFormErrors.buyerId ? "text-red-600" : ""}>
                      Comprador {saleFormErrors.buyerId && <span className="text-red-600">*</span>}
                    </Label>
                    <Select 
                      value={saleForm.buyerId} 
                      onValueChange={(value) => {
                        setSaleForm({ ...saleForm, buyerId: value });
                        setSaleFormErrors({ ...saleFormErrors, buyerId: false });
                      }}
                    >
                      <SelectTrigger 
                        id="sale-buyer"
                        className={saleFormErrors.buyerId ? "border-red-600 focus:ring-red-600" : ""}
                      >
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
                    <Label htmlFor="sale-employee" className={saleFormErrors.employeeId ? "text-red-600" : ""}>
                      Responsável {saleFormErrors.employeeId && <span className="text-red-600">*</span>}
                    </Label>
                    <Select 
                      value={saleForm.employeeId} 
                      onValueChange={(value) => {
                        setSaleForm({ ...saleForm, employeeId: value });
                        setSaleFormErrors({ ...saleFormErrors, employeeId: false });
                      }}
                    >
                      <SelectTrigger 
                        id="sale-employee"
                        className={saleFormErrors.employeeId ? "border-red-600 focus:ring-red-600" : ""}
                      >
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
                    <Label htmlFor="sale-date">Data</Label>
                    <Input
                      id="sale-date"
                      type="date"
                      value={saleForm.date}
                      onChange={(e) => setSaleForm({ ...saleForm, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-value" className={saleFormErrors.totalValue ? "text-red-600" : ""}>
                      Valor Total (R$) {saleFormErrors.totalValue && <span className="text-red-600">*</span>}
                    </Label>
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
                      className={saleFormErrors.totalValue ? "border-red-600 focus-visible:ring-red-600" : ""}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saleForm.isFed}
                      onChange={(e) => setSaleForm({ ...saleForm, isFed: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Alimentado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saleForm.isVaccinated}
                      onChange={(e) => setSaleForm({ ...saleForm, isVaccinated: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Vacinado</span>
                  </label>
                </div>
                {Object.values(saleFormErrors).some(error => error) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">Campos obrigatórios não preenchidos</p>
                  </div>
                )}
                <Button onClick={addSale} className="mt-4 w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Venda
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-gray-800 dark:text-gray-100">Vendas Registradas</CardTitle>
                    <CardDescription>
                      {isSalesFilterActive ? `${filteredSales.length} de ${sales.length}` : sales.length} vendas realizadas
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filtrar por Data
                        {isSalesFilterActive && <Badge variant="secondary" className="ml-1">Ativo</Badge>}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Filtrar Vendas por Data</DialogTitle>
                        <DialogDescription>
                          Preencha os campos desejados para filtrar
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
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
                              min="2000"
                              max="2100"
                              placeholder="AAAA"
                              value={salesDateFilter.year}
                              onChange={(e) => setSalesDateFilter({ ...salesDateFilter, year: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={applySalesFilter} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                            <Filter className="w-4 h-4 mr-2" />
                            Aplicar Filtro
                          </Button>
                          {isSalesFilterActive && (
                            <Button onClick={clearSalesFilter} variant="outline" className="flex-1">
                              Limpar Filtro
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Sexo</TableHead>
                        <TableHead>Qtd</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((s) => {
                        const buyer = buyers.find(b => b.id === s.buyerId);
                        const employee = employees.find(e => e.id === s.employeeId);
                        return (
                          <TableRow key={s.id}>
                            <TableCell>{new Date(s.date).toLocaleDateString('pt-BR')}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {s.lot}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={s.sex === "female" ? "text-pink-600 border-pink-600" : "text-blue-600 border-blue-600"}
                              >
                                {s.sex === "female" ? "Fêmea" : "Macho"}
                              </Badge>
                            </TableCell>
                            <TableCell>{s.quantity}</TableCell>
                            <TableCell>{buyer?.name || "N/A"}</TableCell>
                            <TableCell>{employee?.name || "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                {s.isFed && <Badge variant="secondary" className="text-xs">Alimentado</Badge>}
                                {s.isVaccinated && <Badge variant="secondary" className="text-xs">Vacinado</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {s.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSale(s.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Relatório Mensal de Vendas
                  </CardTitle>
                  <CardDescription>Resumo do mês atual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Total de Vendas</span>
                    <span className="text-2xl font-bold text-blue-600">{monthlyReport.totalSales}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Quantidade Vendida</span>
                    <span className="text-2xl font-bold text-emerald-600">{monthlyReport.totalQuantity}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Receita Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {monthlyReport.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <Package className="w-5 h-5 text-orange-600" />
                    Relatório de Custos
                  </CardTitle>
                  <CardDescription>Custos com insumos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Custos Totais</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {costsReport.totalCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Rações</span>
                    <span className="text-2xl font-bold text-green-600">
                      {costsReport.feedCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Medicamentos</span>
                    <span className="text-2xl font-bold text-red-600">
                      {costsReport.medicineCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                  <Circle className="w-5 h-5 text-emerald-600" />
                  Controle de Rebanho por Lote
                </CardTitle>
                <CardDescription>Distribuição do gado por lote</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(cattleByLot).map(([lot, count]) => {
                    const lotInfo = lots.find(l => l.name === lot);
                    return (
                      <div 
                        key={lot} 
                        className="p-4 rounded-lg border-2"
                        style={{
                          backgroundColor: lotInfo?.color ? `${lotInfo.color}10` : '#10b98110',
                          borderColor: lotInfo?.color || '#10b981'
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: lotInfo?.color || '#10b981' }}
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{lot}</span>
                          </div>
                          <Badge 
                            className="text-white"
                            style={{ backgroundColor: lotInfo?.color || '#10b981' }}
                          >
                            {count} cabeças
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {Object.keys(cattleByLot).length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">Nenhum gado cadastrado ainda</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
