import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Plus, Trash2 } from 'lucide-react';

const Races = () => {
    const { getToken } = useAuth();
    const [races, setRaces] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        app: 'Uber',
        earnings: '',
        distance: '',
        duration: ''
    });

    const fetchRaces = async () => {
        try {
            const token = getToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${API_URL}/api/races`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRaces(data);
        } catch (error) {
            console.error('Error fetching races', error);
        }
    };

    useEffect(() => {
        fetchRaces();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = getToken();
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/api/races`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowForm(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                app: 'Uber',
                earnings: '',
                distance: '',
                duration: ''
            });
            fetchRaces();
        } catch (error) {
            console.error('Error adding race', error);
        }
    };

    return (
        <Layout>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Minhas Corridas</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Histórico e registro de viagens</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Nova Corrida
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Registrar Corrida</h2>
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
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Aplicativo</label>
                            <select
                                className="input"
                                value={formData.app}
                                onChange={(e) => setFormData({ ...formData, app: e.target.value })}
                            >
                                <option value="Uber">Uber</option>
                                <option value="99">99</option>
                                <option value="Indriver">Indriver</option>
                                <option value="Particular">Particular</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Ganho (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                value={formData.earnings}
                                onChange={(e) => setFormData({ ...formData, earnings: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Distância (km)</label>
                            <input
                                type="number"
                                step="0.1"
                                className="input"
                                value={formData.distance}
                                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                placeholder="0.0"
                                required
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Duração (min)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="0"
                                required
                            />
                        </div>
                        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Salvar Corrida</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card" style={{ overflowX: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>App</th>
                            <th>Ganho</th>
                            <th>Distância</th>
                            <th>$/km</th>
                            {/* <th>Ações</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {races.map((race) => (
                            <tr key={race._id}>
                                <td>{new Date(race.date).toLocaleDateString()}</td>
                                <td>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.875rem',
                                        backgroundColor: race.app === 'Uber' ? '#000' : '#dcb900', // Uber black, 99 yellowish
                                        color: race.app === 'Uber' ? '#fff' : '#000'
                                    }}>
                                        {race.app}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--primary)', fontWeight: 'bold' }}>R$ {race.earnings.toFixed(2)}</td>
                                <td>{race.distance} km</td>
                                <td>R$ {(race.earnings / race.distance).toFixed(2)}</td>
                                {/* <td><button className="btn-outline" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button></td> */}
                            </tr>
                        ))}
                        {races.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                    Nenhuma corrida registrada. Adicione a primeira acima!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default Races;
