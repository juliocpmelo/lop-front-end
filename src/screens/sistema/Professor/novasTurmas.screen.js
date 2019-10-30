import React, { Component } from "react";
import api from "../../../services/api";
import Swal from "sweetalert2";
import { Redirect } from 'react-router-dom';
import Select from 'react-select';

import TemplateSistema from "components/templates/sistema.template";

const botao = {
    marginTop: '10px',
    float: 'right'
};
const titulo = {
    aligntodosProfessores: 'center'
};
const botao2 = {
    float: 'right',
    backgroundColor: "red",
    borderColor: 'red',
    color: 'white'
};

export default class NovasTurmasScreen extends Component {
    state = {
        redirect: false,
        name: "",
        year: new Date().getFullYear().toString(),
        semester: new Date().getMonth()<6?"1":"2",
        description: "",
        state: "ATIVA",
        prof: "",
        todosProfessores: [],
        professoresSelecionados: [],
        loadingProfessores:true,
        language: ""
    };
    componentDidMount() {
        this.getProfessores();
        document.title = "Cadastro de turmas - Plataforma LOP";
    }
    async cadastro(event){
        event.preventDefault();
        console.log(" nome: "+this.state.name+"\n ano: "+this.state.year+"\n semestre: "+this.state.semester+"\n descriçao: "+this.state.description+"\n Status: "+this.state.state+"\n professores: "+this.state.professoresSelecionados)
        if (this.state.name === "") {
            this.setState({ msg: "Informe o nome da turma" });
        } 
        else if (this.state.year === "" || this.state.year > 2020 || this.state.year < 2010 ) {
            this.setState({ msg: "Informe o ano" });
        } 
        else if (this.state.professoresSelecionados.length === 0) {
            this.setState({ msg: "Selecione os professores" });
        }
        else
        {
            const requestInfo = {
                name: this.state.name,
                year: this.state.year,
                semester: this.state.semester,
                description: this.state.description,
                state: this.state.state,
                professores: this.state.professoresSelecionados.map(p=>p.id)
            };
            Swal.fire({
                title:'Criando turma',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
            Swal.showLoading()
            try{
                const response = await api.post("/class/store", requestInfo)
                Swal.hideLoading()
                Swal.fire({
                    type: 'success',
                    title: 'Turma criada com sucesso!',
                })
                this.setState({redirect:true});
            }
            catch(err){
                Swal.hideLoading()
                Swal.fire({
                    type: 'error',
                    title: 'Erro: Não foi possivel cadastrar a Turma',
                })
                this.setState({ msg: "Erro: Não foi possivel cadastrar a Turma" });
            };
        }
    };


    async getProfessores(){
        try{
            const response = await api.get('/user/get/professores')
            await this.setState({
                professoresSelecionados:[{
                    value:sessionStorage.getItem('user.id'),
                    id:sessionStorage.getItem('user.id'),
                    label:sessionStorage.getItem('user.email'),
                }],
                todosProfessores:response.data.map(p=>{
                    return {
                        value :p.id,
                        id:p.id,
                        label:p.email, 
                    }
                }), 
            })
            this.setState({loadingProfessores:false})
            console.log('todos professores');
            console.log(this.state.todosProfessores)
            console.log('professores selecionados');
            console.log(this.state.professoresSelecionados)

        }catch(err){
            console.log(err)
        }
    };

    handleNameChange = e => {
        this.setState({ name: e.target.value });
    };
    handleYearChange = e => {
        this.setState({ year: e.target.value });
    };
    handleSemesterChange = e => {
        this.setState({ semester: e.target.value });
    };
    handleLanguageChange = e => {
        this.setState({ language: e.target.value });
    };
    handleDescriptionChange = e => {
        this.setState({ description: e.target.value });
    };
    handleStateChange = e => {
        this.setState({ state: e.target.value });
    };
    handleProfessorsChange = professores => {
        console.log(professores);
        const {professoresSelecionados} = this.state
        this.setState({
            professoresSelecionados:professores || []
        })
    };
    render() {
        if (this.state.redirect) {
          return <Redirect to='/professor' />
        }
        return (
        <TemplateSistema active='home'>
                <form onSubmit={(e)=>this.cadastro(e)}>
                    <div className="row">
                        <div className="form-group form-control col-12">
                            <div className="align-self-center">
                                 <h1 styler={titulo}>Cadastro de Turmas:</h1><br></br>
                            </div>    

                            <span className="alert-danger">{this.state.msg}</span>
                            <br></br>

                            <label htmlFor="">Nome: </label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Nome de turma"
                                value={this.state.name}
                                onChange={this.handleNameChange}
                            />
                            
                            

                            <div className="row">
                                <div className="col-4">
                                    <label htmlFor="exampleFormControlSelect1">Linguagem: </label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect1" 
                                        defaultValue={this.state.language} 
                                        onChange={this.handleLanguageChange}
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="c++">C++</option>
                                    </select>
                                </div>

                                <div className="col-4">
                                    <label  htmlFor="exampleFormControlSelect0">Ano: </label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect0" 
                                        defaultValue={this.state.year} 
                                        onChange={this.handleYearChange}
                                    >

                                    {
                                        
                                        [new Date().getFullYear()-1,new Date().getFullYear(),new Date().getFullYear()+1].map((ano,index)=>(
                                            <option key={ano} value={ano}>{ano}</option>
                                        ))
                                    }
                                        
                                    </select>
                                </div>

                                <div className="col-4">
                                    <label htmlFor="exampleFormControlSelect1">semestre: </label>
                                    <select 
                                        className="form-control" 
                                        id="exampleFormControlSelect1" 
                                        defaultValue={this.state.semester} 
                                        onChange={this.handleSemesterChange}
                                    >
                                        <option value="1">1ºSemestre</option>
                                        <option value="2">2ºSemestre</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label  htmlFor="">Descrição</label>
                                <textarea 
                                    className="form-control" 
                                    id="" 
                                    rows="5"
                                    value={this.state.description}
                                    onChange={this.handleDescriptionChange}
                                >
                                </textarea>
                            </div>

                            <label htmlFor="exampleFormControlSelect1">Status</label>
                            <select 
                                className="form-control" 
                                id="exampleFormControlSelect1" 
                                defaultValue={this.state.state} 
                                onChange={this.handleStateChange}
                            >
                                <option value={"ATIVA"}>ATIVA</option>
                                <option value={"INATIVA"}>INATIVA</option>
                            </select>
                            
                            <br></br>
                            <hr></hr>
                            <h3>Professores:</h3>

                            {!this.state.loadingProfessores && <Select
                                {...this.props}
                                style={{boxShadow: "white"}}
                                isMulti
                                defaultValue={[{
                                    value:sessionStorage.getItem('user.id'),
                                    id:sessionStorage.getItem('user.id'),
                                    label:sessionStorage.getItem('user.email'),
                                }]}
                                options={this.state.todosProfessores} 
                                closeMenuOnSelect={false}
                                onChange={this.handleProfessorsChange.bind(this)}                                
                            />}
                            <br/><br/>
                            <div>
                                <button style={botao} type="submit" className="btn btn-primary">Cadastrar</button>
                            </div>
                        </div>
                    </div>
                </form>
        </TemplateSistema>
        )
    }
}