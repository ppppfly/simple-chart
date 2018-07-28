import React, {Component} from 'react';
import {container, title} from './HomePage.less';
import ReactEcharts from 'echarts-for-react';
import {Button, Collapse, Form, Icon, Input, Col, List, Row} from 'antd';
import DataEditForm from './DataEditForm';
import 'antd/dist/antd.css';
import asyncComponent from './AsyncComponent'
const RadarReact = asyncComponent(() => import('../../components/RadarReact.js'));
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class HomePage extends Component {

  constructor(props) {
    super(props);
    this.state.isMobile = window.innerWidth <= 500;
    this.state.current = this.state.data[0];
  }

  state = {
    title: {
      text: '我的六力分析',
      subtext: '多维度展现我的状态'
    },
    attrs: [
      {text: '精力', max: 100},
      {text: '专注力', max: 100},
      {text: '执行力', max: 100},
      {text: '习惯力', max: 100},
      {text: '取舍力', max: 100},
      {text: '梦想力', max: 100}
    ],
    data: [
      {
        value: [90, 99, 93, 94, 95, 97],
        name: '神之业'
      }
    ],
    visible: false,
    current: {
      name: '舍普琴科',
      value: [97, 42, 88, 94, 90, 86],
    },
    isMobile: false,
  };

  handleTitleChange = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        let {text, subtext} = values;
        this.setState({title: {text, subtext}})
      } else {
        console.log('error', error, values);
      }
    });
  };

  handleChartConfig = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {

        let attr = [];
        let max = {};
        for (let [key, value] of Object.entries(values)) {
          if (key.startsWith('attr')) {
            attr.push([key, value])
          }

          if (key.startsWith('max_')) {
            max[key] = value;
          }
        }

        let attrs = [];
        for (let [key, value] of attr) {
          let i = key.replace('attr_', '');
          let max_value = parseInt(max[`max_${i}`] || 100, 10);
          attrs.push({text: value, max: max_value});
        }
        this.setState({attrs})
      } else {
        console.log('error', error, values);
      }
    });
  };

  deleteAttr = (group_id) => {
    // 获取当前 option
    let attrs = this.state.attrs;
    let data = this.state.data;

    // 处理数据
    // --> 处理指标
    attrs.splice(group_id, 1);
    // --> 处理数值
    data.forEach((obj) => {
      obj.value.splice(group_id, 1);
    });

    // 更新 option
    this.setState({attrs, data});
  };

  getAttrsItems = () => {
    const indicators = this.state.attrs;
    const {getFieldDecorator} = this.props.form;
    let items = [];
    for (let i=0; i<indicators.length;i++) {
      let attr = indicators[i];
      items.push(
        <InputGroup key={"group_" + i}>
          <Col xs={10} sm={11}>
            <FormItem>
              {getFieldDecorator('attr_' + i, {
                initialValue: attr.text,
                rules: [{required: true}],
              })(
                <Input addonBefore="属性名" placeholder="属性"/>
              )}
            </FormItem>
          </Col>
          <Col xs={10} sm={11}>
            <FormItem>
              {getFieldDecorator('max_' + i, {
                initialValue: attr.max,
                rules: [{required: true}],
              })(
                <Input addonBefore="最大值" placeholder="最大值"/>
              )}
            </FormItem>
          </Col>
          <Col xs={4} sm={2}>
            <Button type="danger" style={{marginTop: '4px'}} icon="delete"
                    onClick={() => {this.deleteAttr(i)}}>
              {this.state.isMobile ? '' : '删除'}
            </Button>
          </Col>
        </InputGroup>
      )
    }

    return items
  };

  showModal = (data) => {
    this.setState({ visible: true, current:data});
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = (_data) => {
    this.setState({data: [_data], visible: false})
  };

  add = () => {
    let attrs = this.state.attrs;
    let data = this.state.data;

    attrs.push({
      text: '新属性',
      max: 100
    });

    for (let _data of data) {
      _data['value'].push(50)
    }

    this.setState({attrs, data});
  };

  getOption = () => {

    let data_names = [];

    for (let data of this.state.data) {
      data_names.push(data['name'])
    }

    const option = {
      title: this.state.title,
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        x: 'center',
        data: data_names
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          restore: {show: true},
          saveAsImage: {show: true}
        }
      },
      calculable: true,
      polar: [
        {
          indicator: this.state.attrs,
          radius: 130
        }
      ],
      series: [
        {
          name: this.state.title.text,
          type: 'radar',
          itemStyle: {
            normal: {
              areaStyle: {
                type: 'default'
              }
            }
          },
          data: this.state.data
        }
      ]
    };
    return option;
  };

  renderItem = (item, ...args) => {
    const {name, value} = item;
    let descriptions = [(
      <Row style={{fontSize: 'border'}} key={0}>
        <Col span={8}/>
        <Col span={8}>当前值</Col>
        <Col span={8}>最大值</Col>
      </Row>
    )];
    let i = 0;
    for (let {text, max} of this.state.attrs) {
      descriptions.push(
        <Row key={i+1}>
          <Col span={8}>{text}</Col>
          <Col span={8}>{value[i]}</Col>
          <Col span={8}>{max}</Col>
        </Row>
      );
      i++;
    }

    return (
      <List.Item actions={[<Button type="primary" onClick={()=>{this.showModal(item)}}>编辑</Button>]}>
        <List.Item.Meta
          title={name}
          description={<div style={{textAlign: 'center'}}>{descriptions}</div>}
        />
      </List.Item>
    )
  };

  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div className={container}>
        <div className={title}>漫步人生小工具 * 雷达图</div>

        <Collapse onChange={this.callback} defaultActiveKey="3">
          <Panel header="配置：标题" key="1">
            <Form onSubmit={this.handleTitleChange}>
              <FormItem>
                {getFieldDecorator('text', {
                  initialValue: this.state.title.text,
                  rules: [{ required: false }],
                })(
                  <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="主标题"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('subtext', {
                  initialValue: this.state.title.subtext,
                  rules: [{ required: false }],
                })(
                  <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="副标题"/>
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit">更新</Button>
              </FormItem>
            </Form>
          </Panel>
          <Panel header="配置：图表" key="2">
            <Form onSubmit={this.handleChartConfig}>
              {this.getAttrsItems()}
              <InputGroup key="group_0">
                <Col span={12}>
                  <FormItem>
                    <Button type="dashed" onClick={this.add} style={{width: '100%'}}>
                    <Icon type="plus" /> 添加属性
                  </Button>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>更新</Button>
                  </FormItem>
                </Col>
              </InputGroup>
              <br />
            </Form>
            <br />
          </Panel>
          <Panel header="配置：数据" key="3">
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={this.state.data}
              renderItem={this.renderItem}
            />
          </Panel>
        </Collapse>

        <DataEditForm
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate.bind(this)}
          current={this.state.current}
          attrs={this.state.attrs}
        />
        <br />
        <br />
        <RadarReact option={this.getOption()} />
      </div>
    );
  }
}

const HomePageWrappedForm = Form.create()(HomePage);

export default HomePageWrappedForm;
