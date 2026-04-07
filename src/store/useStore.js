import { create } from 'zustand';
import { formatCurrency } from '../utils/formatters';
import api from '../services/api';

const useStore = create((set, get) => ({
  // Data
  rawData: [],
  filteredData: [],
  isLoading: true,
  error: null,
  lastUpdated: null,

  // Auth State
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  authLoading: false,
  authError: null,

  // Filters
  selectedMonth: 'All',
  selectedClient: 'All',
  selectedYear: 'All',
  selectedPerson: 'All',
  searchQuery: '',

  // UI State
  sidebarOpen: true,
  activeView: 'dashboard',
  role: 'Admin',
  darkMode: true,
  showNotifications: false,
  comparisonMode: false,

  // Actions
  setRawData: (data) => {
    set({ rawData: data, isLoading: false, lastUpdated: new Date() });
    get().applyFilters();
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),

  setSelectedMonth: (month) => {
    set({ selectedMonth: month });
    get().applyFilters();
  },

  setSelectedClient: (client) => {
    set({ selectedClient: client });
    get().applyFilters();
  },

  setSelectedYear: (year) => {
    set({ selectedYear: year });
    get().applyFilters();
  },

  setSelectedPerson: (person) => {
    set({ selectedPerson: person });
    get().applyFilters();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveView: (view) => set({ activeView: view }),
  setRole: (role) => set({ role }),
  toggleDarkMode: () => {
    set((state) => {
      const isDark = !state.darkMode;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: isDark };
    });
  },
  toggleNotifications: () => set((state) => ({ showNotifications: !state.showNotifications })),
  toggleComparisonMode: () => set((state) => ({ comparisonMode: !state.comparisonMode })),

  // AUTH ACTIONS
  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const response = await api.post('/login', { email, password });
      
      const data = response.data;
      localStorage.setItem('token', data.token);
      set({ 
        user: data.user, 
        token: data.token, 
        isAuthenticated: true, 
        authLoading: false,
        role: data.user.role // Sync role
      });
      return true;
    } catch (err) {
      console.error('[Diagnostic] Login Error:', err);
      const message = err.response?.data?.message || err.message || 'Login failed';
      set({ authError: message, authLoading: false });
      return false;
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    set({ authLoading: true, authError: null });
    try {
      await api.post('/change-password', { oldPassword, newPassword });
      set({ authLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to update password';
      set({ authError: message, authLoading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    console.log('[Diagnostic] Logging out...');
    localStorage.clear(); // Clear everything
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false, 
      activeView: 'dashboard' 
    });
    // Use replace to prevent back-button navigation into the dashboard
    window.location.replace('/login');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/verify', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (response.ok) {
        set({ 
          user: data.user, 
          isAuthenticated: true, 
          role: data.user.role 
        });
      } else {
        get().logout();
      }
    } catch (err) {
      console.error('Auth verification failed', err);
      get().logout();
    }
  },

  applyFilters: () => {
    const { rawData, selectedMonth, selectedClient, selectedPerson, searchQuery } = get();
    let filtered = [...rawData];

    if (selectedMonth !== 'All') {
      filtered = filtered.filter((d) => d.month === selectedMonth);
    }
    if (selectedClient !== 'All') {
      filtered = filtered.filter((d) => d.client === selectedClient);
    }
    if (selectedPerson !== 'All') {
      filtered = filtered.filter((d) => d.clientOf === selectedPerson);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.client.toLowerCase().includes(q) ||
          d.clientOf.toLowerCase().includes(q) ||
          d.month.toLowerCase().includes(q)
      );
    }

    set({ filteredData: filtered });
  },

  // Computed values
  getKPIs: () => {
    const { filteredData } = get();
    if (!filteredData.length) {
      return { totalRevenue: 0, totalCost: 0, profit: 0, growthPercent: 0, clientCount: 0, avgProfit: 0 };
    }

    const totalRevenue = filteredData.reduce((sum, d) => sum + (d.revInINR || 0), 0);
    const totalCost = filteredData.reduce((sum, d) => sum + (d.costWithAdmin || 0), 0);
    const profit = totalRevenue - totalCost;

    const profitableClients = filteredData.filter((d) => d.difference > 0).length;
    const totalClients = filteredData.length;
    const growthPercent = totalClients > 0
      ? filteredData.reduce((sum, d) => sum + (d.percent || 0), 0) / totalClients
      : 0;

    const uniqueClients = new Set(filteredData.map((d) => d.client)).size;

    return {
      totalRevenue,
      totalCost,
      profit,
      growthPercent,
      clientCount: uniqueClients,
      avgProfit: uniqueClients > 0 ? profit / uniqueClients : 0,
      profitableClients,
      totalClients,
    };
  },

  getMonths: () => {
    const { rawData } = get();
    return ['All', ...new Set(rawData.map((d) => d.month))];
  },

  getClients: () => {
    const { rawData } = get();
    return ['All', ...new Set(rawData.map((d) => d.client))].sort();
  },

  getPersons: () => {
    const { rawData } = get();
    return ['All', ...new Set(rawData.map((d) => d.clientOf))].sort();
  },

  getChartData: () => {
    const { filteredData } = get();
    const monthMap = {};

    filteredData.forEach((d) => {
      if (!monthMap[d.month]) {
        monthMap[d.month] = { month: d.month, revenue: 0, cost: 0, profit: 0, clients: 0 };
      }
      const rev = d.revInINR || 0;
      const cost = d.costWithAdmin || 0;
      monthMap[d.month].revenue += rev;
      monthMap[d.month].cost += cost;
      monthMap[d.month].profit += (rev - cost);
      monthMap[d.month].clients += 1;
    });

    return Object.values(monthMap);
  },


  getClientChartData: () => {
    const { filteredData } = get();
    const clientMap = {};

    filteredData.forEach((d) => {
      if (!clientMap[d.client]) {
        clientMap[d.client] = { client: d.client, revenue: 0, cost: 0, profit: 0 };
      }
      const rev = d.revInINR || 0;
      const cost = d.costWithAdmin || 0;
      clientMap[d.client].revenue += rev;
      clientMap[d.client].cost += cost;
      clientMap[d.client].profit += (rev - cost);
    });

    return Object.values(clientMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 15);
  },


  getAIInsights: () => {
    const { filteredData } = get();
    if (!filteredData.length) return [];

    const insights = [];

    // Most profitable client
    const sorted = [...filteredData].sort((a, b) => (b.difference || 0) - (a.difference || 0));
    if (sorted[0] && sorted[0].difference > 0) {
      insights.push({
        type: 'success',
        icon: '🏆',
        text: `${sorted[0].client} is the most profitable client with ${formatCurrency(sorted[0].difference)} net difference`,
      });
    }

    // Highest loss
    const worstClient = [...filteredData].sort((a, b) => (a.difference || 0) - (b.difference || 0))[0];
    if (worstClient && worstClient.difference < 0) {
      insights.push({
        type: 'danger',
        icon: '⚠️',
        text: `${worstClient.client} is underperforming with ${formatCurrency(Math.abs(worstClient.difference))} in losses`,
      });
    }


    // Profitable vs unprofitable
    const profitable = filteredData.filter((d) => d.difference > 0).length;
    const unprofitable = filteredData.filter((d) => d.difference < 0).length;
    const profitRatio = ((profitable / filteredData.length) * 100).toFixed(0);
    insights.push({
      type: profitable > unprofitable ? 'success' : 'warning',
      icon: '📊',
      text: `${profitRatio}% of clients are profitable (${profitable} of ${filteredData.length})`,
    });

    // Top growth
    const topGrowth = [...filteredData].filter(d => d.percent > 0).sort((a, b) => b.percent - a.percent)[0];
    if (topGrowth) {
      insights.push({
        type: 'success',
        icon: '📈',
        text: `${topGrowth.client} shows highest growth at ${topGrowth.percent.toFixed(1)}%`,
      });
    }

    // Person utilization
    const totalUtilization = filteredData.reduce((sum, d) => sum + (d.personUtilized || 0), 0);
    insights.push({
      type: 'info',
      icon: '👥',
      text: `Total resource utilization: ${totalUtilization.toFixed(1)} persons across ${filteredData.length} clients`,
    });

    return insights;
  },
}));

export default useStore;
