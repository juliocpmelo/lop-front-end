import React, { Component } from "react";
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import Swal from 'sweetalert2'
import NavPagination from "components/ui/navs/navPagination";

export default class Pagina extends Component {
    constructor(props){
        super(props)
        this.state = {
            participantes: [],
            showModal:false,
            loadingParticipantes:false,
            turma:JSON.parse(sessionStorage.getItem('turma')) || '',
            loadingInfoTurma:true,
            numPageAtual:1,
            totalItens:0,
            totalPages:0,
        }
        this.handlePage = this.handlePage.bind(this)
    }

    async componentDidMount() {
        this.getParticipantes()
        await this.getInfoTurma()
        document.title = `${this.state.turma.name} - listas`;
        
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

    async getParticipantes(loading=true){
        const id = this.props.match.params.id
        const {numPageAtual} = this.state

        try{
            if(loading) this.setState({loadingParticipantes:true})
            const response = await api.get(`/class/${id}/participants/page/${numPageAtual}`)
            console.log('participantes');
            console.log(response.data);
            this.setState({
                participantes:[...response.data.docs],
                totalItens : response.data.total,
                totalPages : response.data.totalPages,
                numPageAtual : response.data.currentPage,
                loadingParticipantes:false,
            })
        }
        catch(err){
            this.setState({loadingParticipantes:false,})
            console.log(err);
        }
    }
    async removerParticipante(user){
        const idUser = user.id
        const idTurma = this.props.match.params.id
        try{
            const {value} = await Swal.fire({
                title: `Tem certeza que quer remover "${user.email}" da turma?`,
                //text: "You won't be able to revert this!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim, remover usuário!',
                cancelButtonText:'Não, cancelar!'
            })
            if(!value) return null
            Swal.fire({
                title:'Removendo usuário',
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
            Swal.showLoading()
            const response = await api.delete(`/class/${idTurma}/remove/user/${idUser}`)
            console.log(response.data);
            this.getParticipantes(false)
            Swal.hideLoading()
            Swal.fire({
                type: 'success',
                title: 'Usuário removido com sucesso!',
            })
        }
        catch(err){
          Swal.hideLoading()
          Swal.fire({
              type: 'error',
              title: 'ops... Usuário não pôde ser removido',
          })
        }
    }
    handleShowModal(){
        this.setState({showModal:true})
    }
    handleCloseModal(){
        this.setState({showModal:false})
    }
    handlePage(e,numPage){
        e.preventDefault()
        //console.log(numPage);
        this.setState({
            numPageAtual:numPage
        },()=>this.getParticipantes())
    }
    handleSelectfildFilter(e){
        console.log(e.target.value);
        this.setState({
            fildFilter:e.target.value
        },()=>this.getParticipantes())
    }

    handleContentInputSeach(e){
        this.setState({
            contentInputSeach:e.target.value
        },()=>this.getParticipantes())
        
    }
    clearContentInputSeach(){
        this.setState({
            contentInputSeach:''
        },()=>this.getParticipantes())
    }
    render() {
        const {turma,participantes,loadingInfoTurma,loadingParticipantes,numPageAtual,totalPages} = this.state
        return (
        <TemplateSistema {...this.props} active={'participantes'} submenu={'telaTurmas'}>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                        {loadingInfoTurma?
                            <div className="loader"  style={{margin:'0px auto'}}></div>
                            :
                            <h3 style={{margin:'0px'}}><i className="fa fa-users mr-2" aria-hidden="true"/> {turma.name} - {turma.year}.{turma.semester || 1}</h3>
                        }
                    </div>
                </div>
                <div className="row" style={{marginBottom:'15px'}}>
                    <div className="col-12">
                     <table style={{backgroundColor:"white"}} className="table table-hover">
                        <thead> 
                            <tr>
                                <th></th>
                                <th>Nome</th>
                                <th>Email</th>
                                <th>Mátricula</th>
                                <th>Função</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingParticipantes
                            ?
                                <tr>
                                    <td>
                                        <div className="loader" />
                                    </td>
                                    <td>                                        
                                        <div className="loader" />
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>                                        
                                    <td>
                                        <div className="loader"/>
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>
                                    <td>
                                        <div className="loader"/>
                                    </td>
                                </tr>           
                            :
                                participantes.map((user, index) => (
                                    <tr key={index}>
                                        <td className='text-center'>
                                            <div 
                                                className="avatar d-block" 
                                                style={
                                                    {backgroundImage: `url(${user.urlImage || 'https://1.bp.blogspot.com/-xhJ5r3S5o18/WqGhLpgUzJI/AAAAAAAAJtA/KO7TYCxUQdwSt4aNDjozeSMDC5Dh-BDhQCLcBGAs/s1600/goku-instinto-superior-completo-torneio-do-poder-ep-129.jpg'})`}
                                                }
                                            />
                                        </td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.enrollment}</td>
                                        <td>{user.profile}</td>
                                        <td>
                                            <button className="btn btn-primary mr-2">
                                                <i className="fa fa-info"/>
                                            </button>

                                            {user.profile!=="PROFESSOR" && 
                                            <button className="btn btn-danger" onClick={()=>this.removerParticipante(user)}>
                                                <i className="fa fa-trash "/>
                                            </button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-12 text-center'>
                        <NavPagination
                          totalPages={totalPages}
                          pageAtual={numPageAtual}
                          handlePage={this.handlePage}
                        />
                    </div>
                </div>
        </TemplateSistema>
        )
    }
}