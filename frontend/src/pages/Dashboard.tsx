import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

export function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Controle de Gastos</h1>
      </div>

      <div className="dashboard-grid">
        <Link to="/pessoas" className="dashboard-card">
          <div className="card-icon">👥</div>
          <h2>Pessoas</h2>
          <p>Administre as pessoas cadastradas no sistema</p>
        </Link>

        <Link to="/categorias" className="dashboard-card">
          <div className="card-icon">📁</div>
          <h2>Categorias</h2>
          <p>Gerencie as categorias de gastos e receitas</p>
        </Link>

        <Link to="/transacoes" className="dashboard-card">
          <div className="card-icon">💰</div>
          <h2>Transações</h2>
          <p>Visualize e administre todas as transações</p>
        </Link>
      </div>
    </div>
  );
}

