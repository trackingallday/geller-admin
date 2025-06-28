import React, { Component } from 'react';
import { message, Form, Icon, Input, Button, Row, Col, Card } from 'antd';
import { postLogin, getUserDetails } from '../../util/DjangoApi';
import { formItemLayout, tailFormItemLayout } from '../../constants/tableLayout';


const FormItem = Form.Item;


class LoginForm extends Component {

  onFail = (message) => {
    message.success('Please check your details', 3);
    this.props.stopLoading();
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    if(this.state.submitting) {
      return;
    }
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ submitting: true })
        this.props.startLoading();
        await postLogin(values.username, values.password);
        await new Promise(resolve => setTimeout(resolve(), 1000));
        const userDetails = await getUserDetails((b) => {console.log(b)}, this.onFail);
        console.log('userDetails', userDetails);
        this.stopLoading();
        console.log('onLogin', userDetails);
        message.success('Great Welcome back', 3);
        console.log('onLogin', this.props.onLogin);
        await this.props.onLogin(userDetails);
      } else {
        this.stopLoading();
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{paddingTop: 200, paddingBottom: 200  }}>
          <Row type="flex" justify="end">
            <Col span={6}></Col>
            <Col span={12}>
              <Card title="Please Sign In">
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <Row>
                    <Col>
                      <FormItem { ...formItemLayout }>
                        {getFieldDecorator('userName', {
                          rules: [{ required: true, message: 'input your username!' }],
                        })(
                          <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                        )}
                      </FormItem>
                      <FormItem { ...formItemLayout }>
                        {getFieldDecorator('password', {
                          rules: [{ required: true, message: 'input your Password!' }],
                        })(
                          <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col>
                      <FormItem { ...tailFormItemLayout }>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          Log in
                        </Button>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col span={6}></Col>
          </Row>
      </div>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm
