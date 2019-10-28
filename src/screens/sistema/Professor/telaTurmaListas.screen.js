import React, { Component,Fragment } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Swal from 'sweetalert2'
import {Modal} from 'react-bootstrap'
import 'katex/dist/katex.min.css';
import {BlockMath } from 'react-katex';
import NavPagination from "components/ui/navs/navPagination";
import InputGroup from "components/ui/inputGroup/inputGroupo.component";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
export default class Pagina extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            listas: [],
            loadingInfoTurma:true,
            turma:'',
            loandingTodasListas:true,
            loandingListas:false,
            showModalListas:false,
            showModalInfo:false,
            todasListas: [],
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
            contentInputSeach:'',
            fieldFilter:'title',
            questions:[]
        };
    }

    async componentDidMount() {

        this.getListas()
        this.getTodasListas()

        await this.getInfoTurma()
        document.title = `${this.state.turma.name} - listas`;
        //this.getTodasListas()
    }
    async getInfoTurma(){
        const id = this.props.match.params.id
        try{
            const response = await api.get(`/class/${id}`)
            this.setState({
                turma:response.data,
                loadingInfoTurma:false,
            })
        }
        catch(err){
            this.setState({loadingInfoTurma:false})
            console.log(err);
        }
    }

    async inserirLista(idLista){
        const idTurma = this.props.match.params.id
        try{
              Swal.fire({
                title:'Adicionando lista',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
              })
              Swal.showLoading()
              
              const response = await api.post(`/class/${idTurma}/addList/list/${idLista}`)
              await this.getTodasListas()
              Swal.hideLoading()
              Swal.fire({
                  type: 'success',
                  title: 'Lista Adicionada com Sucesso!',
              })
              this.getListas()
            
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Lista não pôde ser adicionado',
          })
        } 
    }

    async getListas(){
        const id = this.props.match.params.id
        try{
            
            this.setState({loandingListas:true})
            const response = await api.get(`/class/${id}/lists`)
            console.log('listas');
            console.log(response.data);
            this.setState({
                listas:[...response.data],
                loandingListas:false,
            })

        }catch(err){
            this.setState({loandingListas:false})
            console.log(err)
        
        }
    };

    async getTodasListas(){
        const {numPageAtual,contentInputSeach,fieldFilter} = this.state
        let query = `include=${contentInputSeach.trim()}`
        query += `&field=${fieldFilter}`
        try{
            this.setState({loandingTodasListas:true})
            const id = this.props.match.params.id
            const response = await api.get(`/listQuestion/class/${id}/page/${numPageAtual}?${query}`)
            console.log('todasListas');
            console.log(response.data.docs);
            this.setState({
                todasListas:[...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                loandingTodasListas:false
            })
        }catch(err){
            this.setState({loandingTodasListas:false})
            console.log(err)
        
        }
    };
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getTodasListas())
    }
    handleShowModalInfo(questions){
        this.setState({
            showModalInfo:true,
            questions:[...questions]
        })
    }
    handleCloseshowModalInfo(e){
        this.setState({showModalInfo:false})
    }
    handleShowModalListas(e){
        this.setState({showModalListas:true})
    }
    handleCloseshowModalListas(e){
        this.setState({showModalListas:false})
    }

    handleSelectFieldFilter(e){
        console.log(e.target.value);
        this.setState({
            fieldFilter:e.target.value
        }/*,()=>this.getTodasListas()*/)
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        }/*,()=>this.getTodasListas()*/)
    }
    filterSeash(){
        this.getTodasListas()
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getTodasListas()) 
    }
    
    render() {
        const {loadingInfoTurma,turma,todasListas,loandingTodasListas,totalPages,numPageAtual} = this.state
        const {contentInputSeach,fieldFilter,showModalListas,questions,showModalInfo,loandingListas} = this.state
        return (
        <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
            <div>
            
               {loadingInfoTurma?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <h3><i className="fa fa-users mr-2" aria-hidden="true"/>  {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                }
                <br/>
                <div className="col-3">
                    <button className="btn btn-primary" onClick={()=>this.handleShowModalListas()}>
                        Adicionar novas listas
                    </button>
                </div>
                <br/>

                
                {loandingListas
                ?
                    <div className="loader"  style={{margin:'0px auto'}}></div>
                :
                <div className="col-12">
                    <table  style={{backgroundColor:"white"}} className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nome: </th>
                                <th>Codigo: </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listas.map((lista, index)=>(
                                <tr key={index}>
                                   <td>{lista.title}</td>
                                   <td>{lista.code}</td>
                                   <td className="float-right">
                                       <button className="btn btn-primary float-right" onClick={()=>this.handleShowModalInfo(lista.questions)}>
                                            <i className="fa fa-info"/>
                                       </button>
                                   </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                }
            </div>

                <Modal
                  show={showModalListas} onHide={this.handleCloseshowModalListas.bind(this)}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                    <Modal.Header>
                      <Modal.Title id="contained-modal-title-vcenter">
                        Listas
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Fragment>
                    <div className='row'>
                        <div className=" col-12">     
                            <InputGroup
                                placeholder={`Perquise pelo ${fieldFilter==='title'?'Nome':fieldFilter==='code'?'Código':'...'}`}
                                value={contentInputSeach}
                                handleContentInputSeach={this.handleContentInputSeach.bind(this)}
                                filterSeash={this.filterSeash.bind(this)}
                                handleSelect={this.handleSelectFieldFilter.bind(this)}
                                options={ [{value:'title',content:'Nome'},{value:'code',content:'Código'}] }
                                clearContentInputSeach={this.clearContentInputSeach.bind(this)}
                                loading={loandingTodasListas}                            
                            />
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        {loandingTodasListas 
                        ?        
                            <div className="loader" style={{margin:'0px auto'}}/>
                        :
                            
                            todasListas.map((lista,index)=>(
                                <div key={index} className="col-6"> 
                                    <Card>
                                        <CardHead>
                                            <CardTitle>
                                                {`${lista.title} - ${lista.code}`} 
                                            </CardTitle>
                                            <CardOptions>

                                                <div className="btn-group  float-right" role="group" aria-label="Exemplo básico">
                                                    <button className="btn-primary btn" onClick={()=>this.inserirLista(lista.id)} >Adicionar</button>
                                                        <button
                                                            className ="btn btn-primary"
                                                            data-toggle="collapse" data-target={'#collapse'+lista.id}
                                                            aria-expanded="example-collapse-text"
                                                            style={{position: "relative"}}
                                                        >
                                                        <i className="fe fe-chevron-down"/>
                                                    </button>
                                                </div>
                                            </CardOptions>
                                        </CardHead>
                                        <div className="collapse" id={'collapse'+lista.id}>
                                            <CardBody>
                                                <b>Questões: </b> <br/><br/>
                                                {lista.questions.map((questoes, index)=>(
                                                    <div key={index}>
                                                        <p>{index+1+" - "+questoes.title}</p>
                                                    </div>
                                                ))}
                                            </CardBody>
                                        </div>
                                    </Card>
                                </div>
                            ))
                            
                        }
                    </div>
                    <div className='row'>
                        <div className='col-12 text-center'>
                            <NavPagination
                              totalPages={totalPages}
                              pageAtual={numPageAtual}
                              handlePage={this.handlePage.bind(this)}
                            />
                        </div>
                    </div>
                </Fragment>
                </Modal.Body>
              <Modal.Footer>
                <button className="btn btn-primary" onClick={this.handleCloseshowModalListas.bind(this)}>Fechar</button>
              </Modal.Footer>
            </Modal>

            <Modal
                show={showModalInfo} onHide={this.handleCloseshowModalInfo.bind(this)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Questões
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">            
                {questions.map((questao, index)=>(
                    <div key={index} className="col-6"> 
                        <Card >
                            <CardHead>
                                <CardTitle>
                                    {questao.title}
                                </CardTitle>
                                <CardOptions>
                                    <button
                                        className ="btn btn-primary"
                                        data-toggle="collapse" data-target={'#collapse'+questao.id}
                                        aria-expanded="example-collapse-text"
                                        style={{position: "relative"}}
                                    >
                                        <i className="fa fa-info"/>
                                    </button>
                                </CardOptions>
                            </CardHead>
                            <div className="collapse" id={'collapse'+questao.id}>
                                <CardBody>
                                <b>Descrição: </b>
                                <p>{questao.description}</p>
                                <br/>
                                <BlockMath>{questao.katexDescription|| ''}</BlockMath>
                                <br/>
                                </CardBody>
                            </div>
                        </Card>
                    </div>
                ))}
                </div>      
                
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={this.handleCloseshowModalInfo.bind(this)}>Fechar</button>
            </Modal.Footer>
            </Modal>

        </TemplateSistema>

        )
    }
}