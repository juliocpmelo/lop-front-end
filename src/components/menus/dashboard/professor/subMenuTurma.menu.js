import React  from 'react'
import { Link } from "react-router-dom";

export default props =>{
    const id = props.match.params.id
    const active = props.active
    return(
        <div className="header collapse d-lg-flex p-0" id="headerMenuCollapse">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg order-lg-first">
                    <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                       <li className="nav-item">
                        <Link to="/professor" className="nav-link">
                            <i className="fa fa-arrow-left" />
                            Voltar
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to={`/professor/turma/${id}/participantes`} className={`nav-link ${active==='participantes'?'active':''}`}>
                            <i className="fa fa-users" />
                            Participantes
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to={`/professor/turma/${id}/listas`} className={`nav-link ${active==='listas'?'active':''}`}>
                            <i className="fa fa-file-text" />
                            Listas
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to={`/professor/turma/${id}/provas`} className={`nav-link ${active==='provas'?'active':''}`}>
                            <i className="fa fa-file-text-o" />
                            Provas
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to={`/professor/turma/${id}/solicitacoes`} className={`nav-link ${active==='solicitações'?'active':''}`}>
                            <i className="fe fe-users" />
                            Solicitações
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to={`/professor/turma/${id}/submissoes`} className={`nav-link ${active==='submissoes'?'active':''}`}>
                            <i className="fa fa-code" />
                            Submissões
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to={`/professor/turma/${id}/dashboard`} className={`nav-link ${active==='dashboard'?'active':''}`}>
                            <i className="fa fa-pie-chart" />
                            DashBoard
                        </Link>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    )
    
}