import { formatarValor } from "../../utils/utils";

interface PropsCardsTotais {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export function CardsTotais({ totalReceitas, totalDespesas, saldo }: PropsCardsTotais) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total de Receitas</h5>
            <p className="card-text display-6 text-success">
              {formatarValor(totalReceitas)}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total de Despesas</h5>
            <p className="card-text display-6 text-danger">
              {formatarValor(totalDespesas)}
            </p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Balanço Geral</h5>
            <p
              className={`card-text display-6 ${
                saldo >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {formatarValor(saldo)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

