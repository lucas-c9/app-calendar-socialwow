import React, {Component} from 'react'
import { Calendar, Badge, Alert, Layout, Modal, Form, Input, TimePicker, Row, Col} from 'antd'
import moment from 'moment'

const { Header, Footer, Content } = Layout

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isModalVisible : false,
      value: moment('2017-01-25'),
      selectedValue: moment(''),
      isClickInPanel : true
    }

    this.getListData = this.getListData.bind(this)
    this.dateCellRender = this.dateCellRender.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.showModal = this.showModal.bind(this)
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  //Retorna todas las citas registradas en una dia especifico (datos de prueba)
  getListData(value) {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: 'This is warning event' },
          { type: 'success', content: 'This is very long usual event....' },
          { type: 'error', content: 'This is error event 1.' },
          { type: 'error', content: 'This is error event 2.' },
          { type: 'error', content: 'This is error event 3.' },
          { type: 'error', content: 'This is error event 4.' },
        ];
        break;
      default:
    }
    return listData || []
  }

  //Renderiza en una celda(dia) todas las citas ragregadas
  dateCellRender(value) {
    const listData = this.getListData(value)
    return (
      <ul className="events">
        {listData.map(item => (
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

  //Funcion del boton "Ok" del modal. Oculta el modal
  handleOk() {
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
          <Modal title="Add Event" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
            <Form name="basic" initialValues={{ remember: true }} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
              <Row>
                <Col span={24}>
                  <Form.Item name="name" label="Name">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="start" label="Start">
                    <TimePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="end" label="End">
                    <TimePicker />
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
