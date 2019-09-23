/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component } from "react";
import api from '../../../services/api'
import Swal from 'sweetalert2'

import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardBody from "components/ui/card/cardBody.component";
import NavPagination from "components/ui/navs/navPagination";
import socket from 'socket.io-client'

export default class HomeAlunoScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      minhasTurmas:[],
      numPageTurmasAbertas:1,
      turmasAbertas:[],
      totalPages:0,
      turmasSolicitadas:[],
      loadingMinhasTurmas:false,

    }
    this.handlePage=this.handlePage.bind(this)
  }
  componentDidMount() {
    this.getInfoUser()
    this.getTurmasAbertas()
    this.getTurmasAbertasRealTime()
    document.title = "Sistema Aluno - Plataforma LOP";
  }
  async getInfoUser(){
    try{
      //this.setState({loadingMinhasTurmas:true})
      const response = await api.get('/user/info/profile')
      //console.log('user:');
      //console.log(response.data)
      this.setState({
        minhasTurmas:response.data.classes,
        turmasSolicitadas:response.data.requestedClasses,
        //loadingMinhasTurmas:false
      })
    }
    catch(err){
      this.setState({loadingMinhasTurmas:false})
      console.log(err);
    }
  }
  async getTurmasAbertas(){
    try{
      //this.setState({loadingTurmas:true})
      const response = await api.get(`/class/open/page/${this.state.numPageTurmasAbertas}`)
      console.log('turmas abertas:');
      console.log(response.data.docs);
      this.setState({
        turmasAbertas : response.data.docs,
        totalTumasAbertas : response.data.total,
        totalPages : response.data.totalPages
        //loadingTurmas:false
      })
    }
    catch(err){
      this.setState({loadingTurmas:false})
      console.log(err);
    }
  }
  async getTurmasAbertasRealTime(){
    const io = socket("http://localhost:3001")
    console.log('id do usuario');
    console.log(sessionStorage.getItem('user.id'));
    io.emit('connectRoonMyRequestsClass',sessionStorage.getItem('user.id'))
    io.on('MyRequestsClass',response=>{
      this.getInfoUser()
      this.getTurmasAbertas()
    })
  }
  async handlePage(e,numPage){
    e.preventDefault()
    console.log(numPage);
    await this.setState({numPageTurmasAbertas:numPage})
    this.getTurmasAbertas()
  }
  async solicitarAcesso(id){
    console.log('evento');

    try{
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title:'Processando solicitação',
        allowOutsideClick:false,
        allowEscapeKey:false,
        allowEnterKey:false
      })
      Swal.showLoading()
      const response = await api.put(`/user/request/class/${id}`)
      //console.log(response);
      this.getTurmasAbertas()
      this.getInfoUser()
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Solicitação feita com sucesso!',
      })
      //this.setState({solicitando:''})
    }
    catch(err){
      Swal.hideLoading()

      Swal.fire({
          type: 'error',
          title: 'ops... Falha ao tentar fazer solicitação',
      })
      //this.setState({solicitando:''})
    }
  }
  async cancelarSolicitacao(id){
    console.log(id);
    try{
      //this.setState({solicitando:'disabled'})
      Swal.fire({
        title:'Cancelando Solicitação',
        allowOutsideClick:false,
        allowEscapeKey:false,
        allowEnterKey:false
      })
      Swal.showLoading()
      const response = await api.put(`/user/removeRequest/class/${id}`)
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Solicitação cancelada!',
      })
      //console.log(response);
      this.getInfoUser()
      this.getTurmasAbertas()
      await this.setState({solicitando:''})
    }
    catch(err){
      Swal.hideLoading()
      Swal.fire({
          type: 'error',
          title: 'ops... Erro ao cancelar solicitação',
      })
      //this.setState({solicitando:''})

    } 
  }

  render() {
    const {totalPages,numPageTurmasAbertas,turmasSolicitadas,minhasTurmas,turmasAbertas} = this.state
    return (
      <TemplateSistema>
        <div className='row'>
          {turmasAbertas.map((turmaAberta, index) => {
            let jaSolicitou = false
            for(let turmaSolicitada of turmasSolicitadas){
              if(turmaSolicitada._id===turmaAberta._id){
                jaSolicitou = true
                break;
              }
            }
              return(
                <div key={index} className="col-6">
                    <Card>
                        <CardHead>Nome: {turmaAberta.name}</CardHead>
                        <CardBody>
                            <h5 className="">Ano: {turmaAberta.year}.2{turmaAberta.semester}</h5>
                             <hr></hr>
                             <p className="card-text">Descrição: {turmaAberta.description}</p>
                            {
                             jaSolicitou
                            ?
                             <button onClick={()=>this.cancelarSolicitacao(turmaAberta._id)} className="btn btn-danger" >Cancelar solicitação</button>
                             :
                             <button onClick={()=>this.solicitarAcesso(turmaAberta._id)} className="btn btn-primary">Solicitar Acesso</button>
                            }
                        </CardBody>
                     </Card>
                 </div>
              )
             })}

        </div>
        <div className='row'>
          <div className='col-12 text-center'>
            <NavPagination
              totalPages={totalPages}
              pageAtual={numPageTurmasAbertas}
              handlePage={this.handlePage}
            />
          </div>
        </div>
      </TemplateSistema>
    );
  }
}
