import React, {Component} from 'react'
import { Calendar, Badge, Alert, Layout, Modal, Form, Input, TimePicker, Row, Col} from 'antd'
import moment from 'moment'

const { Header, Footer, Content } = Layout

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      nameQuote : '',
      startQuote : '',
      endQuote : '',
      isModalVisible : false,
      isClickInPanel : false,
      value: moment('2017-01-25'),
      selectedValue: moment()
    }

    this.setNameQuote = this.setNameQuote.bind(this)
    this.setStartQuote = this.setStartQuote.bind(this)
    this.setEndQuote = this.setEndQuote.bind(this)
    this.getListQuotes = this.getListQuotes.bind(this)
    this.dateCellRender = this.dateCellRender.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  //Setea los valores ingresador: nombre de la cita, hora inicio y hora fin
  setNameQuote(e){
    this.setState({
      nameQuote : e.target.value
    })
  }
  setStartQuote(value){
    const timeString = moment(value).format("HH:mm")
    this.setState({
      startQuote : timeString
    })
  }
  setEndQuote(value){
    const timeString = moment(value).format("HH:mm")
    this.setState({
      endQuote : timeString
    })
  }

  //Retorna todas las citas registradas en una dia especifico (datos de prueba)
  getListQuotes(value) {
    let listQuotes
    let [year, month] = value.format('YYYY-MM-DD').split('-')
    let dataQuotes = JSON.parse(localStorage.getItem('quotes'))

    if (dataQuotes) {
      if (dataQuotes.hasOwnProperty(year) && dataQuotes[year].hasOwnProperty(month)) {
        listQuotes = dataQuotes[year][month][value.date()]
      }
    }
    return listQuotes || []
  }

  //Renderiza en una celda(dia) todas las citas ragregadas
  dateCellRender(value) {
    const listQuotes = this.getListQuotes(value)
    return (
      <ul className="events">
        {listQuotes.map(item => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    )
  }

  //Detecta la seleccion del una celda(dia), cambia el estado a la fecha segun la celda seleccionada
  onSelect(value) {
    this.setState({
      value,
      selectedValue: value,
    })
  }

  //Permite abrir el modal si se a realizado click sobre el panel de celdas(dias)
  showModal() {
    document.querySelector('.ant-picker-panel tbody').addEventListener('click', () => this.setState({isClickInPanel : true}))

    if (this.state.isClickInPanel) {
      this.setState({
        isModalVisible : true,
        isClickInPanel : false
      })
    }
  }

  //Funcion del boton "Ok" del modal. Oculta el modal y agrega una cita
  handleOk() {
    this.addQuote()
    this.setState({
      isModalVisible : false
    })
  }

  //Funcion del boton "Cancel" del modal. Oculta el modal
  handleCancel() {
    this.setState({
      isModalVisible : false
    })
  }

  //Agrega las nuevas citas al localStorage
  addQuote() {
    let currentDay = this.state.selectedValue.date()
    let [year, month] = this.state.selectedValue.format('YYYY-MM-DD').split('-')
    let dataQuotes = JSON.parse(localStorage.getItem('quotes'))
    let dataQuote = {
      type: 'warning', 
      content: `${this.state.startQuote} - ${this.state.endQuote} - ${this.state.nameQuote}`
    }

    if (dataQuotes.hasOwnProperty(year)) {
      if (dataQuotes[year].hasOwnProperty(month)) {
        if (dataQuotes[year][month].hasOwnProperty(currentDay)) {
          //Si existe una cita registrada en el dia que se eligió, agrega una nueva cita
          dataQuotes[year][month][currentDay].push(dataQuote)
        } else {
          //Si no se registro el dia de la fecha de que se eligió crea el dia con la respectiva cita
          dataQuotes[year][month][currentDay] = [dataQuote]
        }
      } else {
        //Si no se registro el mes de la fecha de que se eligió crea el mes con la respectiva cita
        dataQuotes[year][month] = {
          [`${currentDay}`] : [dataQuote]
        }
      }
    }else {
      //Si no se registro el año de la fecha de que se eligió crea el año con la respectiva cita
      dataQuotes = {
        [`${year}`] : {
          [`${month}`] : {
            [`${currentDay}`] : [dataQuote]
          }
        }
      }
    }
    localStorage.setItem('quotes', JSON.stringify(dataQuotes))
  }

  //Al finalizar el montaje del componente setea el campo evento el el local Storage
  componentDidMount() {
    if (!localStorage.getItem('quotes')) {
      localStorage.setItem('quotes', '{}')
    }
  }

  render() { 
    return (
      <Layout className="layout">
        <Header>
        </Header>
        <Content style={{ padding: '0 40px' }}>
          <Alert  style={{ marginTop: '10px' }} message={`You selected date: ${this.state.selectedValue && this.state.selectedValue.format('YYYY-MM-DD')}`} />
          <div onClick={this.showModal}>
            <Calendar onClick={this.showModal} dateCellRender={this.dateCellRender} value={this.value} onSelect={this.onSelect}/>
          </div> 
          <Modal title="Add Quote" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form name="form" onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
              <Row>
                <Col span={24}>
                  <Form.Item name="name" label="Name">
                    <Input onChange={(e) => this.setNameQuote(e)}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="start" label="Start">
                    <TimePicker format="HH:mm" showNow={false} onSelect={(value) => this.setStartQuote(value)}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="end" label="End">
                    <TimePicker format="HH:mm" showNow={false} onSelect={(value) => this.setEndQuote(value)}/>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Desafio SocialWoW - <a href="https://socialwow.club/">socialwow.club</a></Footer>
      </Layout>
    )
  }
}
   
export default App
