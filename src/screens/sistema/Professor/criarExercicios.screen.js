/*import React, { Component,Fragment} from "react";
import {Redirect} from 'react-router-dom'
import TemplateSistema from "components/templates/sistema.template";
import api from '../../../services/api'
import apiCompiler from '../../../services/apiCompiler'
import Swal from 'sweetalert2'

import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/c_cpp';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

import Card from "components/ui/card/card.component";
import CardHead from "components/ui/card/cardHead.component";
import CardBody from "components/ui/card/cardBody.component";
import CardFooter from "components/ui/card/cardFooter.component";
import TableResults from '../../../components/ui/tables/tableResults.component'
import FormExercicio from '../../../components/ui/forms/formExercicio.component'
import FormSelect from '../../../components/ui/forms/formSelect.component'
import styleEditor from '../../../'
import imgLoading from '../../../assets/loading.gif'
import imgLoading1 from '../../../assets/loading1.gif'
import imgLoading2 from '../../../assets/loading2.gif'

export default class Editor extends Component {
  constructor(props){
    super(props)
    this.state = {
      editor:'',
      editorRes:'',
      contentRes:"",
      language:'javascript',
      theme:'monokai',
      response:[],
      loadingReponse:false,
      savingQuestion:false,
      loadingEditor:false,
      title:'',
      contentEditor:'',
      description:'',
      inputs:'',
      outputs:'',
      percentualAcerto:'',
      redirect:'',
    }
  }

  async handleTitleChange(e){
      this.setState({
        title:e.target.value
      })
  }
  async handleDescriptionChange(e){
      this.setState({
        description:e.target.value
      })
  }
  async handleInputsChange(e){
      this.setState({
        inputs:e.target.value
      })
  }
  async handleOutputsChange(e){
      this.setState({
        outputs:e.target.value
      })
  }
  async changeLanguage(e){
    await this.setState({language:e.target.value})
  }
  async changeTheme(e){
    await this.setState({theme:e.target.value})

  }
  changeContentEditor(newValue){
    this.setState({contentEditor:newValue})
  }
  async executar(e){
    e.preventDefault()
    const {contentEditor,language} = this.state
    const request = {
      codigo : contentEditor,
      linguagem :language==='c_cpp'?'cpp':language,
      results : this.getResults()
    }
    this.setState({loadingReponse:true})
    try{
      const response = await apiCompiler.post('/submission/exec',request)
      this.setState({ loadingReponse:false})
      console.log(response.data);
      if(response.status===200){
        this.setState({
          response:response.data.results,
          percentualAcerto:response.data.percentualAcerto,
          contentRes:response.data.info,
        })
      }
    }
    catch(err){
      Object.getOwnPropertyDescriptors(err)
      this.setState({loadingReponse:false})
      alert('erro na conexão com o servidor')
    }
    
  }
  getResults(){
    const {inputs,outputs} = this.state
    const entradas = inputs.split('\n')
    const saidas = outputs.split('\n')
    console.log('saidas: '+saidas);
    const resultados = []
    for(let i=0 ; i<entradas.length ; i++ ){
      resultados.push({
        inputs: (entradas[i].split(',').map(inp => inp+'\n')).join(''),
        output: saidas[i].split('|').join('\n')
      })
    }
    return resultados
  }
  async saveQuestion(e){
    Swal.fire({
      title:'Salvando questão',
      allowOutsideClick:false,
      allowEscapeKey:false,
      allowEnterKey:false
    })
    Swal.showLoading()
    const request = {
      title : this.state.title,
      description : this.state.description,
      results : this.getResults()
    }
    try{
      this.setState({savingQuestion:true})
      const response = await api.post('/question/store',request)
      Swal.hideLoading()
      Swal.fire({
          type: 'success',
          title: 'Questão salva com sucesso!',
      })
      this.setState({savingQuestion:false})
      console.log(response.data)
    }
    catch(err){
      Swal.hideLoading()
      Swal.fire({
          type: 'error',
          title: 'ops... Questão não pôde ser salva',
      })
      this.setState({savingQuestion:false})
      console.log(Object.getOwnPropertyDescriptors(err));

    }
  }

  render() {
    const {percentualAcerto,response,redirect,savingQuestion ,loadingEditor,loadingReponse,title,description,inputs,outputs} = this.state
    const { language,theme,contentRes,contentEditor } = this.state;

    if(redirect){
      return <Redirect to={'/'} exact={true} />
    }
    
    if(loadingEditor){
      return(
        <div className="container text-center">
          <br/><br/><br/><img src={imgLoading} width="300px" />
        </div>
      )
    }
    else
    return (

    <TemplateSistema active='criarExercicio'>
    <Card>
      <CardHead center>
          <h2><i className="fa fa-pencil"></i> Nova questão</h2>
      </CardHead>
      <CardBody>
      <FormExercicio
        title={title}
        description={description}
        inputs={inputs}
        outputs={outputs}
        loadingReponse={loadingReponse}
        handleTitleChange={this.handleTitleChange.bind(this)}
        handleDescriptionChange={this.handleDescriptionChange.bind(this)}
        handleInputsChange={this.handleInputsChange.bind(this)}
        handleOutputsChange={this.handleOutputsChange.bind(this)}
      />
      <FormSelect
        loadingReponse={loadingReponse}
        changeLanguage={this.changeLanguage.bind(this)}
        changeTheme={this.changeTheme.bind(this)}
        executar={this.executar.bind(this)}
      />
          <div className='row'>
            <div className='col-6'>
              <AceEditor
                mode={language}
                theme={theme}
                focus={false}
                onChange={this.changeContentEditor.bind(this)}
                value={contentEditor}
                fontSize={14}
                width='100%'
                name="ACE_EDITOR"
                showPrintMargin={true}
                showGutter={true}
                enableLiveAutocompletion={true}
                enableBasicAutocompletion={true}
                highlightActiveLine={true}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                  showLineNumbers: true,
                  tabSize: 2,
                }}
              />
            </div>
           {loadingReponse?
           <div className="card" className ="col-6 text-center">
              <img src={imgLoading2} width="300px" />           
           </div>:
           <div className="col-6">
                <AceEditor
                  mode='javascript'
                  readOnly={true}
                  width={'100%'}
                  showGutter={false}
                  focus={false}
                  theme={theme}
                  onChange={this.changeContentEditor.bind(this)}
                  value={contentRes}
                  fontSize={14}
                  name="ACE_EDITOR_RES"
                  editorProps={{$blockScrolling: true}}
                />
           </div>
           }
          </div>
        
        <div className='row'>
            <div className="card" className ="col-12">
              <TableResults 
                response={response}
                percentualAcerto={percentualAcerto}
              />
            </div>
        </div>
        </CardBody>
        <CardFooter>
          <button onClick={e => this.saveQuestion(e)} className={`btn btn-primary btn-lg btn-block ${savingQuestion && 'btn-loading'}`}>
            <i class="fa fa-save"></i> Salvar
          </button>         
        </CardFooter>
      </Card>
    </TemplateSistema>
    );
  }
}*/