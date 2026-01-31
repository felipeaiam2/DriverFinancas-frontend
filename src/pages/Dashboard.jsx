import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Layout from '../components/Layout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { getToken } = useAuth();
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = getToken();
                // Mock data for initial view if backend is empty or failing
                const { data } = await axios.get('http://192.168.10.106:5000/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, []);

    const chartData = {
        labels: ['Atual'],
        datasets: [
            {
                label: 'Ganhos (Mês)',
                data: [stats?.monthlyEarnings || 0],
                backgroundColor: '#10b981',
            },
            {
                label: 'Despesas (Mês)',
                data: [stats?.monthlyExpenses || 0],
                backgroundColor: '#ef4444',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: '#9ca3af' } },
            title: { display: false },
        },
        scales: {
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
        }
    };

    return (
        <Layout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Visão geral do seu desempenho financeiro</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Lucro Líquido (Total)</div>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>
                        R$ {stats?.netProfit?.toFixed(2) || '0.00'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Ganhos Totais</div>
                    <div className="stat-value">
                        R$ {stats?.totalEarnings?.toFixed(2) || '0.00'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Despesas Totais</div>
                    <div className="stat-value" style={{ color: 'var(--danger)' }}>
                        R$ {stats?.totalExpenses?.toFixed(2) || '0.00'}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Km Rodados</div>
                    <div className="stat-value">
                        {stats?.totalDistance?.toFixed(1) || '0.0'} km
                    </div>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Desempenho no Mês</h2>
                <div className="chart-container">
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
