/*
 * @Author: Marcus Dantas
 * @Date: 2019-01-27 12:11:20
 * @Last Modified by: Marcus Dantas
 * @Last Modified time: 2019-02-11 02:49:17
 */

import React, { Component,Fragment } from "react";
import {Link} from 'react-router-dom';
import api from '../../../services/api'
import TemplateSistema from "components/templates/sistema.template";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import Collapse from "components/ui/collapse/collapse.component";
import ButtonToogle from "components/ui/collapse/buttonToogle.component";
export default class HomeAlunoScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
      minhasTurmas:[],
      loadingTurmas:false,

    }
    //this.handlePage=this.handlePage.bind(this)
  }
 
  componentDidMount() {
    this.getInfoUser()
    document.title = "Plataforma LOP";
  }
  async getInfoUser(){
    try{
      this.setState({loadingTurmas:true})
      const response = await api.get('/user/classes')
      console.log('minhas turmas');
      console.log(response.data)
      const minhasTurmas = [...response.data]
      sessionStorage.setItem('user.classes',JSON.stringify(minhasTurmas.map(t=>t.id)))
      this.setState({
        minhasTurmas,
        loadingTurmas:false
      })
      
    }
    catch(err){
      this.setState({loadingTurmas:false})
      console.log(err);
    }
  }
  render() {
    const {minhasTurmas,loadingTurmas} = this.state
    return (
      <TemplateSistema active='home'>
        <Row>
              {loadingTurmas?
                  <div className="loader"  style={{margin:'0px auto'}}></div>
              :
                  minhasTurmas.map((turma, index) => (
                    <Fragment key={index}>
                      <Col xs={12} md={6} >
                          <Card>
                            <CardHead>
                              <CardTitle>
                                <i className="fa fa-users" /><b> {turma.name} - {turma.year}.{turma.semester || 1}</b>
                              </CardTitle>
                              <CardOptions>
                                <ButtonToogle
                                  id={'collapse'+turma.id}
                                  title={'Ver descrição'}
                                />
                              </CardOptions>
                              </CardHead>
                                <Collapse id={'collapse'+turma.id}>
                                  <CardBody>
                                      {turma.description}
                                  </CardBody>
                                </Collapse>
                                <CardFooter>
                                    <Link to={`/aluno/turma/${turma.id}/dashboard`} style={{float: "right",}} className="btn btn-primary mr-2">
                                        <i className="fe fe-corner-down-right" /> Entrar
                                    </Link>
                                </CardFooter>
                            </Card>
                        </Col>
                      </Fragment>
                    ))
                }
        </Row>
      </TemplateSistema>
    );
  }
}
