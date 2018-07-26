import {Form, Input, Modal, Radio, InputNumber} from 'antd';
import React from 'react';
const FormItem = Form.Item;


class DataEdit extends React.Component {

  state = {
    current: {}
  };

  handleItemChange = () => {

  };

  getItems = (datas) => {
    let items = [];
    for (let data of datas) {
      const [text, max, value] = data;
      items.push(
        <FormItem label={text}>
          <InputNumber min={1} max={max} defaultValue={value} onChange={this.handleItemChange}/>
        </FormItem>
      )
    }
  };

  render() {
    const {visible, onCancel, onCreate, form, current, attrs} = this.props;
    const {getFieldDecorator} = form;

    let datas = [];
    for (let i; i<attrs.length; i++) {
      datas.push([
        attrs[i].text,
        attrs[i].max,
        current.value[i]
      ])
    }

    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="Title">
            {getFieldDecorator('title', {
              rules: [{required: true, message: 'Please input the title of collection!'}],
            })(
              <Input/>
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description')(<Input type="textarea"/>)}
          </FormItem>
          <FormItem className="collection-create-form_last-form-item">
            {getFieldDecorator('modifier', {
              initialValue: 'public',
            })(
              <Radio.Group>
                <Radio value="public">Public</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const DataEditForm = Form.create()(DataEdit);
export default DataEditForm;
