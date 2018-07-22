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
    option: {
      title: {
        text: '我的六力分析',
        subtext: '多维度展现我的状态'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        x: 'center',
        data: ['罗纳尔多', '舍普琴科']
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
          indicator: [
            {text: '精力', max: 100},
            {text: '专注力', max: 100},
            {text: '执行力', max: 100},
            {text: '习惯力', max: 100},
            {text: '取舍力', max: 100},
            {text: '梦想力', max: 100}
          ],
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
        }
      ]
    },
    attrs: [
      {text: '精力', max: 100},
      {text: '专注力', max: 100},
      {text: '执行力', max: 100},
      {text: '习惯力', max: 100},
      {text: '取舍力', max: 100},
      {text: '梦想力', max: 100}
    ]
  };

  callback = () => {

  };

  handleTitleChange = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        let new_option = {...this.state.option};
        let {text, subtext} = values;
        new_option.title = {text, subtext};
        this.setState({option: new_option})
      } else {
        console.log('error', error, values);
      }
    });
  };

  handleChartConfig = (e) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        let new_option = {...this.state.option};
        this.setState({option: new_option})
      } else {
        console.log('error', error, values);
      }
    });
  };

  deleteAttr = (group_id) => {
    // 获取当前 option
    let new_option = {...this.state.option};
    let indicators = this.state.option.polar[0].indicator.slice();
    let data = this.state.option.series[0].data.slice();

    // 处理数据
    // --> 处理指标
    indicators.splice(group_id, 1);
    // --> 处理数值
    data.forEach((obj) => {
      obj.value.splice(group_id, 1);
    });

    // 更新 option
    new_option.polar[0].indicator = indicators;
    new_option.series[0].data = data;
    this.setState({option: new_option});
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


  render() {

    const { getFieldDecorator } = this.props.form;

    console.log(this.state.option);

    return (
      <div className={container}>
        <div className={title}>漫步人生小工具 * 雷达图</div>

        <Collapse onChange={this.callback}>
          <Panel header="配置：标题" key="1">
            <Form onSubmit={this.handleTitleChange}>
              <FormItem>
                {getFieldDecorator('text', {
                  initialValue: this.state.option.title.text,
                  rules: [{ required: false }],
                })(
                  <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>} placeholder="主标题"/>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('subtext', {
                  initialValue: this.state.option.title.subtext,
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
          option={this.state.option}
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
