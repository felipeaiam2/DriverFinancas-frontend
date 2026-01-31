import Layout from '../components/Layout';
import { Save } from 'lucide-react';

const Settings = () => {
    return (
        <Layout>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Configurações</h1>
                <p style={{ color: 'var(--text-muted)' }}>Gerencie seu perfil e preferências</p>
            </div>

            <div className="card" style={{ maxWidth: '600px' }}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Perfil do Motorista</h2>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Veículo</label>
                        <input type="text" className="input" defaultValue="Chevrolet Onix 2020" />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Consumo Médio (km/L)</label>
                        <input type="number" className="input" defaultValue="10.5" />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Meta de Renda Mensal (R$)</label>
                        <input type="number" className="input" defaultValue="4000.00" />
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                            <Save size={18} />
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </div>

            <div className="card" style={{ maxWidth: '600px', marginTop: '2rem', border: '1px solid var(--danger)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--danger)' }}>Zona de Perigo</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Ações irreversíveis para sua conta.</p>
                <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Excluir Conta</button>
            </div>
        </Layout>
    );
};

export default Settings;
