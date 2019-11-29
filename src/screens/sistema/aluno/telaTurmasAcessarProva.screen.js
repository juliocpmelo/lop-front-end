import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import TemplateSistema from "components/templates/sistema.template";
import api from "../../../services/api";
import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardOptions from "components/ui/card/cardOptions.component";
import CardTitle from "components/ui/card/cardTitle.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import Row from "components/ui/grid/row.component";
import Col from "components/ui/grid/col.component";
import { ProgressBar } from "react-bootstrap";

export default class Exercicios extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      prova: null,
      loandingLista: true,
      loadingInfoTurma: true,
      turma: JSON.parse(sessionStorage.getItem("turma")) || "",
      todasListas: []
    };
  }

  async componentDidMount() {
    await this.getInfoTurma();
    await this.getLista();

    //document.title = `${this.state.turma.name} - ${this.state.prova.title}`;
  }
  async getInfoTurma() {
    const id = this.props.match.params.id;
    const { turma } = this.state;
    if (!turma || (turma && turma.id !== id)) {
      console.log("dentro do if");
      try {
        const response = await api.get(`/class/${id}`);
        const turmaData = {
          id: response.data.id,
          name: response.data.name,
          year: response.data.year,
          semester: response.data.semester,
          languages: response.data.languages
        };
        this.setState({
          turma: turmaData,
          loadingInfoTurma: false
        });
        sessionStorage.setItem("turma", JSON.stringify(turmaData));
      } catch (err) {
        this.setState({ loadingInfoTurma: false });
        console.log(err);
      }
    } else {
      this.setState({ loadingInfoTurma: false });
    }
  }
  async getLista() {
    try {
      console.log("akii");
      console.log(this.props.match.params);
      const idClass = this.props.match.params.id;
      const idTest = this.props.match.params.idTest;
      const response = await api.get(`/test/${idTest}/class/${idClass}`);
      console.log("listas");
      console.log(response.data);
      this.setState({
        prova: response.data,
        loandingLista: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  RecolherProva = e => {};

  render() {
    const { loadingInfoTurma, turma, loandingLista, prova } = this.state;
    const questionsCompleted =
      prova && prova.questions.filter(q => q.completed);
    const completed =
      prova &&
      ((questionsCompleted.length / prova.questions.length) * 100).toFixed(2);
    return (
      <TemplateSistema {...this.props} active={"provas"} submenu={"telaTurmas"}>
        <Row mb={15}>
          <Col xs={12}>
            {loadingInfoTurma ? (
              <div className="loader" style={{ margin: "0px auto" }}></div>
            ) : (
              <h3 style={{ margin: "0px" }}>
                <i className="fa fa-users mr-2" aria-hidden="true" />{" "}
                {turma.name} - {turma.year}.{turma.semester || 1}
              </h3>
            )}
          </Col>
        </Row>
        {loandingLista ? (
          <div className="loader" style={{ margin: "0px auto" }}></div>
        ) : (
          <Fragment>
            <Row mb={15}>
              <Col xs={12}>
                <Link
                  to={`/professor/turma/${this.props.match.params.id}/provas`}
                >
                  <button className="btn btn-success mr-2">
                    <i className="fa fa-arrow-left" /> Voltar para as Provas{" "}
                    <i className="fa fa-file-text" />
                  </button>
                </Link>
                <button
                  className="btn btn-danger mr-2"
                  style={{ float: "right" }}
                  data-toggle="modal"
                  data-target="#ModalEntregarProva"
                >
                  Entregar Prova <i className="fa fa-file-text" />
                </button>

                <div
                  class="modal fade"
                  id="ModalEntregarProva"
                  tabindex="-1"
                  role="dialog"
                  aria-hidden="true"
                >
                  <div
                    class="modal-dialog modal-dialog-centered"
                    role="document"
                  >
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Entregar prova</h5>
                        <button
                          type="button"
                          class="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label htmlFor="inputSenha">
                          <b>Tem certeza que deseja entregar a prova?</b>
                        </label>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-danger">
                          Não
                        </button>
                        <button type="button" class="btn btn-success">
                          Sim
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row mb={15}>
              <Col xs={12}>
                <Card>
                  <CardHead>
                    <Col xs={4} pl={0}>
                      <h4 style={{ margin: "0px" }}>
                        <b>{prova && prova.title}</b>
                      </h4>
                    </Col>

                    <ProgressBar
                      now={completed}
                      label={`${completed}%`}
                      style={{ width: "100%" }}
                    />
                  </CardHead>
                  <CardBody>
                    <Row>
                      {prova &&
                        prova.questions.map((question, j) => (
                          <Fragment key={j}>
                            <Col xs={12} md={6}>
                              <Card>
                                <CardHead>
                                  <CardTitle>
                                    <b>
                                      {question.title}&nbsp;
                                      {question.completed ? (
                                        <i
                                          className="fa fa-check"
                                          style={{ color: "#0f0" }}
                                        />
                                      ) : null}
                                    </b>
                                  </CardTitle>
                                  <CardOptions>
                                    <i
                                      title="Ver descrição"
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                        fontSize: "25px"
                                      }}
                                      className={`fe fe-chevron-down`}
                                      data-toggle="collapse"
                                      data-target={
                                        "#collapse2" + j + (prova && prova.id)
                                      }
                                      aria-expanded={false}
                                    />
                                  </CardOptions>
                                </CardHead>
                                <div
                                  className="collapse"
                                  id={"collapse2" + j + (prova && prova.id)}
                                >
                                  <CardBody>{question.description}</CardBody>
                                </div>
                                <CardFooter>
                                  Suas submissões: {question.submissions.length}
                                  <Link
                                    to={`/professor/turma/${this.props.match.params.id}/prova/${prova.id}/questao/${question.id}`}
                                  >
                                    <button
                                      className="btn btn-success mr-2"
                                      style={{ float: "right" }}
                                    >
                                      Acessar <i className="fa fa-wpexplorer" />
                                    </button>
                                  </Link>
                                </CardFooter>
                              </Card>
                            </Col>
                          </Fragment>
                        ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Fragment>
        )}
      </TemplateSistema>
    );
  }
}
