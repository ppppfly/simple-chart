import React, {Component} from 'react';
import {container, title} from './HomePage.less';
import ReactEcharts from 'echarts-for-react';
import {Button, Collapse, Form, Icon, Input, Col} from 'antd';
import 'antd/dist/antd.css';


const Panel = Collapse.Panel;
const FormItem = Form.Item;
const InputGroup = Input.Group;

class HomePage extends Component {

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
        value: [97, 42, 88, 94, 90, 86],
        name: '舍普琴科'
      },
      {
        value: [97, 32, 74, 95, 88, 92],
        name: '罗纳尔多'
      }
    ]
  };

  callback = () => {

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
        console.log('values', values);
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
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('attr_' + i, {
                initialValue: attr.text,
                rules: [{required: true}],
              })(
                <Input addonBefore="属性名" prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="属性"/>
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem>
              {getFieldDecorator('max_' + i, {
                initialValue: attr.max,
                rules: [{required: true}],
              })(
                <Input addonBefore="最大值" prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="最大值"/>
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <Button type="danger" style={{marginTop: '4px'}}
                    onClick={() => {this.deleteAttr(i)}}>删除</Button>
          </Col>
        </InputGroup>
      )
    }

    return items
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
          name: '完全实况球员数据',
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
    }
    console.log('option', option);
    return option;
  };


  render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <div className={container}>
        <div className={title}>漫步人生小工具 * 雷达图</div>

        <Collapse onChange={this.callback}>
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
              <FormItem>
                <Button type="primary" htmlType="submit">更新</Button>
              </FormItem>
            </Form>
          </Panel>

        </Collapse>

        <br />
        <br />

        <ReactEcharts
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={false}
          style={{
            width: '600px',
            height: '400px',
            margin: 'auto',
          }}
        />
      </div>
    );
  }
}

const HomePageWrappedForm = Form.create()(HomePage);

export default HomePageWrappedForm;
