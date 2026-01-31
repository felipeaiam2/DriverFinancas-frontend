import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Plus, Trash2 } from 'lucide-react';

const Expenses = () => {
    const { getToken } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: 'Combustível',
        amount: '',
        description: ''
    });

    const fetchExpenses = async () => {
        try {
            const token = getToken();
            const { data } = await axios.get('http://192.168.10.106:5000/api/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses', error);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            await axios.post('http://192.168.10.106:5000/api/expenses', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                category: 'Combustível',
                amount: '',
                description: ''
            });
            fetchExpenses();
        } catch (error) {
            console.error('Error adding expense', error);
        }
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Despesas</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gerencie seus gastos e custos</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Nova Despesa
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Registrar Despesa</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Data</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Categoria</label>
                            <select
                                className="input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Combustível">Combustível</option>
                                <option value="Manutenção">Manutenção</option>
                                <option value="Impostos">Impostos</option>
                                <option value="Alimentação">Alimentação</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Valor (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Descrição (Opcional)</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Ex: Abastecimento Posto X"
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Salvar Despesa</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Categoria</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense._id}>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td>{expense.description || '-'}</td>
                                <td style={{ color: 'var(--danger)', fontWeight: 'bold' }}>R$ {expense.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                        {expenses.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    Nenhuma despesa registrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Expenses;
