import React,{useState} from 'react';
import {Button, Collapse} from 'react-bootstrap'

export default (props) =>{
    const listas=props.listas
    const chave = props.chave
    const [open, setOpen] = useState(false);
    return (
        <div>            
                <div>
                <table className='table table-hover' style={{borderTopRightRadius:"10%", marginBottom:"0px"}}>
                    <tbody >
                        <tr>
                            <td>{listas.title}</td>
                            <td>
                                <div className="btn-group float-right" role="group" aria-label="Exemplo básico" >
                                    <button type="button" className="btn btn-primary">Adicionar lista</button>
                                    <button
                                    className ="btn btn btn-primary"
                                    onClick={() => setOpen(!open)}
                                    aria-controls="example-collapse-text"
                                    aria-expanded={open}
                                    style={{position: "relative"}}
                                    >
                                    ver
                                    </button>
                                </div>
                            </td>
                            
                        </tr>
                   
                    </tbody>
                </table>       

                {listas.questions.map((questions, index) => (
                 <div key={index}>
                    <Collapse className="col-12" in={open}
                    style={{backgroundColor:"white", marginTop:"0px"}}
                    >
                    <div id="example-collapse-text">
                    <p>{index+1+". "+questions.title}</p>
                    </div>
                    </Collapse>
                </div>
                ))}
            </div>
        </div>
    );
  }