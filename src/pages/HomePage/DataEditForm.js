import {Form, InputNumber, Input, Modal} from 'antd';
import React from 'react';

const FormItem = Form.Item;


class DataEdit extends React.Component {

  constructor(props) {
    super(props);
    const {current} = props;
    this.state.current = current;
  }

  state = {
    current: {
      name: '',
      value: []
    }
  };

  handleItemChange = (index, value) => {
    let current = {...this.state.current};
    current.value[index] = value;
    this.setState({current});
  };

  formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 18 },
      sm: { span: 24 },
    },
  };

  getItems = (datas) => {
    let items = [];

    const {getFieldDecorator} = this.props.form;
    let i = 0;
    for (let [text, max, value] of datas) {
      let index = i;
      items.push(
        <div key={i} style={{marginTop: '10px'}}>

          <FormItem
            {...this.formItemLayout}
            label={`${text}(1 ~ ${max})`}
          >
            {getFieldDecorator(`val_${i}`, {
              initialValue: value,
              rules: [{type: 'number', required: true}],
            })(
              <InputNumber max={max} style={{width: '100%'}} onChange={(val) => {this.handleItemChange(index, val)}}/>
            )}
          </FormItem>
        </div>
      );
      i++;
    }
    return items;
  };

  result = () => {

    let current = {...this.state.current};

    const {getFieldValue} = this.props.form;
    current.name = getFieldValue('name');

    return current
  };

  render() {
    const {visible, onCancel, onCreate, attrs} = this.props;
    const {getFieldDecorator} = this.props.form;

    let datas = [];
    for (let i=0; i<attrs.length; i++) {
      let data = [
        attrs[i].text,
        attrs[i].max,
        this.state.current.value[i]
      ];
      datas.push(data);
    }

    return (
      <Modal
        visible={visible}
        title="修改数据"
        okText="更新"
        cancelText="取消"
        onCancel={onCancel}
        onOk={()=> {onCreate(this.result());}}
      >
        <Form layout="vertical">
          <FormItem
            {...this.formItemLayout}
            label='数据名称'
          >
            {getFieldDecorator('name', {
              initialValue: this.state.current.name,
              rules: [{required: true, message: '内容不可为空!'}],
            })(
              <Input style={{width: '100%'}} onChange={this.handleNameChange}/>
            )}
          </FormItem>
          {this.getItems(datas)}
        </Form>
      </Modal>
    );
  }
}

const DataEditForm = Form.create()(DataEdit);
export default DataEditForm;
