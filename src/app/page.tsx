"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Cow, 
  Users, 
  Package, 
  UserCheck, 
  ShoppingCart, 
  FileText, 
  Plus,
  Trash2,
  TrendingUp,
  DollarSign,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

// Types
interface Cattle {
  id: string;
  number: string;
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
  type: "ração" | "medicamento";
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
  quantity: number;
  buyerId: string;
  employeeId: string;
  date: string;
  isFed: boolean;
  isVaccinated: boolean;
  totalValue: number;
  createdAt: string;
}

export default function RuralTech() {
  // States
  const [cattle, setCattle] = useState<Cattle[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // Form states
  const [cattleForm, setCattleForm] = useState({ number: "", lot: "" });
  const [buyerForm, setBuyerForm] = useState({ name: "", contact: "" });
  const [supplyForm, setSupplyForm] = useState({ name: "", type: "ração", quantity: "", unit: "kg", cost: "" });
  const [employeeForm, setEmployeeForm] = useState({ name: "" });
  const [saleForm, setSaleForm] = useState({
    lot: "",
    quantity: "",
    buyerId: "",
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    isFed: false,
    isVaccinated: false,
    totalValue: ""
  });

  // Load data from localStorage
  useEffect(() => {
    const loadedCattle = localStorage.getItem("ruraltech_cattle");
    const loadedBuyers = localStorage.getItem("ruraltech_buyers");
    const loadedSupplies = localStorage.getItem("ruraltech_supplies");
    const loadedEmployees = localStorage.getItem("ruraltech_employees");
    const loadedSales = localStorage.getItem("ruraltech_sales");

    if (loadedCattle) setCattle(JSON.parse(loadedCattle));
    if (loadedBuyers) setBuyers(JSON.parse(loadedBuyers));
    if (loadedSupplies) setSupplies(JSON.parse(loadedSupplies));
    if (loadedEmployees) setEmployees(JSON.parse(loadedEmployees));
    if (loadedSales) setSales(JSON.parse(loadedSales));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("ruraltech_cattle", JSON.stringify(cattle));
  }, [cattle]);

  useEffect(() => {
    localStorage.setItem("ruraltech_buyers", JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem("ruraltech_supplies", JSON.stringify(supplies));
  }, [supplies]);

  useEffect(() => {
    localStorage.setItem("ruraltech_employees", JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem("ruraltech_sales", JSON.stringify(sales));
  }, [sales]);

  // CRUD Functions
  const addCattle = () => {
    if (!cattleForm.number || !cattleForm.lot) {
      toast.error("Preencha todos os campos");
      return;
    }
    const newCattle: Cattle = {
      id: Date.now().toString(),
      number: cattleForm.number,
      lot: cattleForm.lot,
      createdAt: new Date().toISOString()
    };
    setCattle([...cattle, newCattle]);
    setCattleForm({ number: "", lot: "" });
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
    if (!supplyForm.name || !supplyForm.quantity || !supplyForm.cost) {
      toast.error("Preencha todos os campos");
      return;
    }
    const newSupply: Supply = {
      id: Date.now().toString(),
      name: supplyForm.name,
      type: supplyForm.type as "ração" | "medicamento",
      quantity: parseFloat(supplyForm.quantity),
      unit: supplyForm.unit,
      cost: parseFloat(supplyForm.cost),
      createdAt: new Date().toISOString()
    };
    setSupplies([...supplies, newSupply]);
    setSupplyForm({ name: "", type: "ração", quantity: "", unit: "kg", cost: "" });
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
    if (!saleForm.lot || !saleForm.quantity || !saleForm.buyerId || !saleForm.employeeId || !saleForm.totalValue) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const newSale: Sale = {
      id: Date.now().toString(),
      lot: saleForm.lot,
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
      quantity: "",
      buyerId: "",
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      isFed: false,
      isVaccinated: false,
      totalValue: ""
    });
    toast.success("Venda registrada com sucesso!");
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
    toast.success("Venda removida");
  };

  // Reports
  const getMonthlySalesReport = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    const totalQuantity = monthlySales.reduce((sum, sale) => sum + sale.quantity, 0);
    const totalRevenue = monthlySales.reduce((sum, sale) => sum + sale.totalValue, 0);

    return { sales: monthlySales, totalQuantity, totalRevenue };
  };

  const getCostsReport = () => {
    const totalCosts = supplies.reduce((sum, supply) => sum + (supply.cost * supply.quantity), 0);
    const supplyByType = supplies.reduce((acc, supply) => {
      if (!acc[supply.type]) acc[supply.type] = { quantity: 0, cost: 0 };
      acc[supply.type].quantity += supply.quantity;
      acc[supply.type].cost += supply.cost * supply.quantity;
      return acc;
    }, {} as Record<string, { quantity: number; cost: number }>);

    return { totalCosts, supplyByType };
  };

  const getHerdReport = () => {
    const cattleByLot = cattle.reduce((acc, c) => {
      if (!acc[c.lot]) acc[c.lot] = 0;
      acc[c.lot]++;
      return acc;
    }, {} as Record<string, number>);

    return { total: cattle.length, byLot: cattleByLot };
  };

  const monthlyReport = getMonthlySalesReport();
  const costsReport = getCostsReport();
  const herdReport = getHerdReport();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-emerald-100 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 sm:p-3 rounded-xl shadow-lg">
              <Cow className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">RuralTech</h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sistema de Gestão de Fazenda</p>
            </div>
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
              <Cow className="w-4 h-4" />
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
                    <Cow className="w-5 h-5" />
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cow className="w-5 h-5 text-emerald-600" />
                    Rebanho por Lote
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.keys(herdReport.byLot).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(herdReport.byLot).map(([lot, count]) => (
                        <div key={lot} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium text-gray-700 dark:text-gray-200">Lote {lot}</span>
                          <Badge className="bg-emerald-600">{count} cabeças</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum gado cadastrado</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Vendas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sales.length > 0 ? (
                    <div className="space-y-3">
                      {sales.slice(-5).reverse().map((sale) => {
                        const buyer = buyers.find(b => b.id === sale.buyerId);
                        return (
                          <div key={sale.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-700 dark:text-gray-200">Lote {sale.lot}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{buyer?.name || "N/A"}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">{sale.quantity} cab.</p>
                              <p className="text-xs text-gray-500">{new Date(sale.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma venda registrada</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cattle Tab */}
          <TabsContent value="cattle" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Cadastrar Gado
                </CardTitle>
                <CardDescription>Adicione novos animais ao rebanho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cattle-number">Número do Animal</Label>
                    <Input
                      id="cattle-number"
                      placeholder="Ex: 001"
                      value={cattleForm.number}
                      onChange={(e) => setCattleForm({ ...cattleForm, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cattle-lot">Lote</Label>
                    <Input
                      id="cattle-lot"
                      placeholder="Ex: A1"
                      value={cattleForm.lot}
                      onChange={(e) => setCattleForm({ ...cattleForm, lot: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={addCattle} className="w-full sm:w-auto mt-4 bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Gado
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Rebanho Cadastrado</CardTitle>
                <CardDescription>{cattle.length} animais registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Data de Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cattle.length > 0 ? (
                        cattle.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="font-medium">{c.number}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{c.lot}</Badge>
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                            Nenhum gado cadastrado
                          </TableCell>
                        </TableRow>
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
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
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
                <Button onClick={addBuyer} className="w-full sm:w-auto mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Comprador
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Compradores Cadastrados</CardTitle>
                <CardDescription>{buyers.length} compradores registrados</CardDescription>
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
                      {buyers.length > 0 ? (
                        buyers.map((b) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                            Nenhum comprador cadastrado
                          </TableCell>
                        </TableRow>
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
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
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
                    <Select value={supplyForm.type} onValueChange={(value) => setSupplyForm({ ...supplyForm, type: value })}>
                      <SelectTrigger id="supply-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ração">Ração</SelectItem>
                        <SelectItem value="medicamento">Medicamento</SelectItem>
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
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="litros">Litros</SelectItem>
                        <SelectItem value="unidades">Unidades</SelectItem>
                        <SelectItem value="sacas">Sacas</SelectItem>
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
                <Button onClick={addSupply} className="w-full sm:w-auto mt-4 bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Insumo
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Insumos Cadastrados</CardTitle>
                <CardDescription>{supplies.length} insumos registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Custo Unit.</TableHead>
                        <TableHead>Custo Total</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplies.length > 0 ? (
                        supplies.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>
                              <Badge variant={s.type === "ração" ? "default" : "secondary"}>
                                {s.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{s.quantity} {s.unit}</TableCell>
                            <TableCell>{s.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                            <TableCell className="font-bold">
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            Nenhum insumo cadastrado
                          </TableCell>
                        </TableRow>
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
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Cadastrar Funcionário
                </CardTitle>
                <CardDescription>Adicione novos funcionários</CardDescription>
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
                <Button onClick={addEmployee} className="w-full sm:w-auto mt-4 bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Funcionário
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Funcionários Cadastrados</CardTitle>
                <CardDescription>{employees.length} funcionários registrados</CardDescription>
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
                      {employees.length > 0 ? (
                        employees.map((e) => (
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
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                            Nenhum funcionário cadastrado
                          </TableCell>
                        </TableRow>
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
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Registrar Venda
                </CardTitle>
                <CardDescription>Registre vendas de gado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sale-lot">Lote</Label>
                    <Input
                      id="sale-lot"
                      placeholder="Ex: A1"
                      value={saleForm.lot}
                      onChange={(e) => setSaleForm({ ...saleForm, lot: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-quantity">Quantidade</Label>
                    <Input
                      id="sale-quantity"
                      type="number"
                      placeholder="0"
                      value={saleForm.quantity}
                      onChange={(e) => setSaleForm({ ...saleForm, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sale-buyer">Comprador</Label>
                    <Select value={saleForm.buyerId} onValueChange={(value) => setSaleForm({ ...saleForm, buyerId: value })}>
                      <SelectTrigger id="sale-buyer">
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
                    <Label htmlFor="sale-employee">Responsável</Label>
                    <Select value={saleForm.employeeId} onValueChange={(value) => setSaleForm({ ...saleForm, employeeId: value })}>
                      <SelectTrigger id="sale-employee">
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
                    <Label htmlFor="sale-value">Valor Total (R$)</Label>
                    <Input
                      id="sale-value"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={saleForm.totalValue}
                      onChange={(e) => setSaleForm({ ...saleForm, totalValue: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saleForm.isFed}
                      onChange={(e) => setSaleForm({ ...saleForm, isFed: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Alimentado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saleForm.isVaccinated}
                      onChange={(e) => setSaleForm({ ...saleForm, isVaccinated: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Vacinado</span>
                  </label>
                </div>
                <Button onClick={addSale} className="w-full sm:w-auto mt-4 bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Venda
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Vendas Registradas</CardTitle>
                <CardDescription>{sales.length} vendas registradas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Lote</TableHead>
                        <TableHead>Qtd.</TableHead>
                        <TableHead>Comprador</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.length > 0 ? (
                        sales.map((s) => {
                          const buyer = buyers.find(b => b.id === s.buyerId);
                          const employee = employees.find(e => e.id === s.employeeId);
                          return (
                            <TableRow key={s.id}>
                              <TableCell>{new Date(s.date).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{s.lot}</Badge>
                              </TableCell>
                              <TableCell>{s.quantity}</TableCell>
                              <TableCell>{buyer?.name || "N/A"}</TableCell>
                              <TableCell>{employee?.name || "N/A"}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {s.isFed && <Badge className="bg-green-600 text-xs">Alimentado</Badge>}
                                  {s.isVaccinated && <Badge className="bg-blue-600 text-xs">Vacinado</Badge>}
                                </div>
                              </TableCell>
                              <TableCell className="font-bold">
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
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                            Nenhuma venda registrada
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Relatório Mensal de Vendas
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-emerald-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Vendas</p>
                    <p className="text-3xl font-bold text-emerald-600">{monthlyReport.totalQuantity} cabeças</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receita Total</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {monthlyReport.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Vendas do Mês</h4>
                    {monthlyReport.sales.length > 0 ? (
                      <div className="space-y-2">
                        {monthlyReport.sales.map((sale) => {
                          const buyer = buyers.find(b => b.id === sale.buyerId);
                          return (
                            <div key={sale.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <span className="text-sm">{buyer?.name || "N/A"} - Lote {sale.lot}</span>
                              <span className="text-sm font-bold">{sale.quantity} cab.</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhuma venda neste mês</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Relatório de Custos e Insumos
                  </CardTitle>
                  <CardDescription>Custos totais com insumos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Custo Total</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {costsReport.totalCosts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Custos por Tipo</h4>
                    {Object.keys(costsReport.supplyByType).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(costsReport.supplyByType).map(([type, data]) => (
                          <div key={type} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <div>
                              <p className="font-medium capitalize">{type}</p>
                              <p className="text-xs text-gray-500">{data.quantity} unidades</p>
                            </div>
                            <p className="font-bold text-purple-600">
                              {data.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum insumo cadastrado</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cow className="w-5 h-5 text-orange-600" />
                    Relatório de Controle de Rebanho
                  </CardTitle>
                  <CardDescription>Quantidade total por lote</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total de Animais</p>
                    <p className="text-3xl font-bold text-orange-600">{herdReport.total} cabeças</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Distribuição por Lote</h4>
                    {Object.keys(herdReport.byLot).length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(herdReport.byLot).map(([lot, count]) => (
                          <div key={lot} className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-orange-200 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Lote {lot}</p>
                            <p className="text-2xl font-bold text-orange-600">{count} cabeças</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {((count / herdReport.total) * 100).toFixed(1)}% do rebanho
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Nenhum gado cadastrado</p>
                    )}
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
