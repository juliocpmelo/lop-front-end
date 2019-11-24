import React, { Component,Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import {ProgressBar} from 'react-bootstrap'

export default class Exercicios extends Component {

    constructor(props){
        super(props)
        this.state = {
            redirect: false,
            lista:null,
            loandingLista:true,
            loadingInfoTurma:true,
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            todasListas: [],
        };
    }

    async componentDidMount() {
        await this.getInfoTurma()
        await this.getLista()
        
        document.title = `${this.state.turma.name} - ${this.state.lista.title}`;
    }
     async getInfoTurma(){
        const id = this.props.match.params.id
        const {turma} = this.state
        if(!turma || (turma && turma.id!==id)){
            console.log('dentro do if');
            try{
                const response = await api.get(`/class/${id}`)
                const turmaData = {
                    id:response.data.id,
                    name:response.data.name,
                    year:response.data.year,
                    semester:response.data.semester,
                    languages:response.data.languages
                }
                this.setState({
                    turma:turmaData,
                    loadingInfoTurma:false,
                })
                sessionStorage.setItem('turma',JSON.stringify(turmaData))
            }
            catch(err){
                this.setState({loadingInfoTurma:false})
                console.log(err);
            }
        }
        else{
            this.setState({loadingInfoTurma:false})
        }
    }
    async getLista(){
        try{
            const idClass = this.props.match.params.id
            const idLista = this.props.match.params.idLista
            const response = await api.get(`/listQuestion/${idLista}/class/${idClass}`)
            console.log('listas');
            console.log(response.data);
            this.setState({
                lista:response.data,
                loandingLista:false
            })

        }catch(err){
            console.log(err)
        
        }
    };
    render() {
        
        const {loadingInfoTurma,turma,loandingLista,lista} = this.state
        const questionsCompleted = lista && lista.questions.filter(q=>q.completed)
        const completed = lista && (questionsCompleted.length/lista.questions.length*100).toFixed(2)
        return (
        <TemplateSistema {...this.props} active={'listas'} submenu={'telaTurmas'}>
                    <Row mb={15}>
                        <Col xs={12}>
                            {loadingInfoTurma?
                                <div className="loader"  style={{margin:'0px auto'}}></div>
                                :
                                <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                            }
                        </Col>
                    </Row>
                    {loandingLista
                    ?
                        <div className="loader"  style={{margin:'0px auto'}}></div>
                    :
                    <Fragment>
                        <Row mb={15}>
                            <Col xs={12}>
                                <Link to={`/aluno/turma/${this.props.match.params.id}/listas`} >
                                    <button className="btn btn-success mr-2">
                                        <i className="fa fa-arrow-left" /> Voltar para listas <i className="fa fa-file-text" />
                                    </button>
                                </Link>
                            </Col>
                        </Row>
                        <Row mb={15}>
                            <Col xs={12}>
                                <Card>
                                    <CardHead>
                                        <Col xs={4} pl={0}>
                                            <h4 style={{margin:'0px'}}><b>{lista && lista.title}</b></h4>
                                        </Col>
                                        
                                        <ProgressBar now={completed} label={`${completed}%`} style={{width:'100%'}} />
   
                                    </CardHead>
                                    <CardBody>
                                        <Row>
                                        {lista && lista.questions.map((question,j)=>
                                        <Fragment key={j}>
                                            <Col xs={12} md={6}>
                                                <Card >
                                                    <CardHead>
                                                        <CardTitle>
                                                            <b>
                                                            {question.title}&nbsp;
                                                            {question.completed?
                                                                <i className="fa fa-check" style={{color:'#0f0'}}/>
                                                            :null}
                                                            </b>
                                                        </CardTitle>
                                                        <CardOptions>
                                                            <i
                                                            title='Ver descrição'
                                                            style={{color:'blue',cursor:'pointer',fontSize:'25px'}}
                                                            className={`fe fe-chevron-down`} 
                                                            data-toggle="collapse" data-target={'#collapse2'+j+(lista && lista.id)} 
                                                            aria-expanded={false}
                                                            />
                                                        </CardOptions>
                                                    </CardHead>
                                                        <div className="collapse" id={'collapse2'+j+(lista && lista.id)}>
                                                            <CardBody>
                                                                {question.description}
                                                           </CardBody>
                                                        </div>
                                                        <CardFooter>
                                                            Suas submissões: {question.submissions.length}

                                                            <Link to={`/aluno/turma/${this.props.match.params.id}/lista/${lista.id}/exercicio/${question.id}`} >
                                                                <button className="btn btn-success mr-2" style={{float:"right"}}>
                                                                Acessar <i className="fa fa-wpexplorer" />
                                                                </button>
                                                            </Link>
                                                        </CardFooter>
                                                </Card>
                                            </Col>
                                        </Fragment>
                                        )}
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Fragment>
                    }
                    
                
        </TemplateSistema>
        )
    }
}