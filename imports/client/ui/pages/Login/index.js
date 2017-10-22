import { Meteor } from 'meteor/meteor'

import withStyles from 'material-ui/styles/withStyles'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import TextFiled from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import LightbulbOutlineIcon from 'material-ui-icons/LightbulbOutline'
import WhatshotIcon from 'material-ui-icons/Whatshot'
import { observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'
import isAlpha from 'validator/lib/isAlpha'
import isEmail from 'validator/lib/isEmail'

import FlexGrow from '/imports/client/ui/components/FlexGrow'
import Layout from '/imports/client/ui/components/Layout'
import SheetContent from '/imports/client/ui/components/SheetContent'
import Block from '/imports/client/ui/components/Block'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withMethod from '/imports/client/ui/hocs/withMethod'
import withLoginWithPassword from '/imports/client/ui/hocs/withLoginWithPassword'

import styles from './index.style'

class Login extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        <Grid container>
          <Grid item xs={12}>
            <Block align='center'>
              <img className={classes.appLogoImage} src='/images/logo.png' />
              <Typography className={classes.appVersion} align='center'>
                {Meteor.settings.public.version}
                </Typography>
            </Block>
          </Grid>
          <Grid item xs={12}>
            <Block width={400} align='center'>
              <Grid container>
                <Grid item xs={12}>
                  <TextFiled
                    fullWidth
                    name='username'
                    label={this.state.error === 'username' ? this.state.errorMessage : 'username'}
                    onChange={this.onInputUsername}
                    onKeyDown={this.onPressEnter}
                    value={this.state.username}
                    helperText='ローマ字のみ'
                    margin='normal'
                    error={this.state.error === 'username'}
                    maxLength='40' />
                </Grid>
                <Grid item xs={12}>
                  <TextFiled
                    fullWidth
                    type='password'
                    name='password'
                    label={this.state.error === 'password' ? this.state.errorMessage : 'password'}
                    onChange={this.onInputPassword}
                    onKeyDown={this.onPressEnter}
                    value={this.state.password}
                    helperText='4文字以上20文字以内'
                    margin='normal'
                    error={this.state.error === 'password'}
                    maxLength='20' />
                </Grid>
              </Grid>
            </Block>
          </Grid>
          <Grid item xs={12}>
            <Block width={400} align='center'>
              <Grid container>
                <FlexGrow />
                <Button raised onClick={this.onRegister}>
                  新規登録
                </Button>
                <Button raised color='primary' onClick={this.onLogin}>
                  ログイン
                </Button>
              </Grid>
            </Block>
          </Grid>
          <Grid item xs={12}>
            <Block width={500} align='center'>
              <SheetContent>
                <LightbulbOutlineIcon {...this.iconStyle} />
                <Typography className={classes.AppPointTitle}>シンプル</Typography>
              </SheetContent>
              <SheetContent>
                <Typography>
                  とてもシンプルな完全匿名のチャットです。<br />
                  ログインしてもユーザ名を伏せて書き込みできます。
                </Typography>
              </SheetContent>
            </Block>
          </Grid>
          <Grid item xs={12}>
            <Block width={500} align='center'>
              <SheetContent>
                <WhatshotIcon {...this.iconStyle} />
                <Typography className={classes.AppPointTitle}>Meteor</Typography>
              </SheetContent>
              <SheetContent>
                <Typography>
                  Meteorで開発しているオープンソースのプロジェクトです。
                </Typography>
              </SheetContent>
            </Block>
          </Grid>
        </Grid>
      </Layout>
    )
  }

  get iconStyle () {
    return {
      style: {
        width: '35px',
        height: '35px',
        paddingRight: '10px'
      },
      color: Meteor.settings.public.color.primary
    }
  }

  state = {
    username: '',
    displayName: '',
    channel: 'tokyo',
    password: '',
    error: null,
    errorMessage: ''
  }

  process = false

  // ユーザネームを入力する
  onInputUsername = (event) => {
    event.preventDefault()
    event.persist()
    const value = event.target.value
    if (this.state.error) {
      this.setState({username: value, error: null})
    } else {
      this.setState({username: value})
    }
  }

  // パスワードを入力する
  onInputPassword = (event) => {
    event.preventDefault()
    event.persist()
    const value = event.target.value
    if (this.state.error) {
      this.setState({password: value, error: null})
    } else {
      this.setState({password: value})
    }
  }

  // ログインする
  onLogin = (event) => {
    if (event) event.preventDefault()
    if (this.process) return
    this.process = true
    const username = this.state.username
    if (username.length === 0) {
      this.setState({error: 'username', errorMessage: 'ユーザネームを入力してください'})
      this.process = false
      return
    }
    const isNotUsername = username.indexOf('@') !== -1
    if (isNotUsername) {
      if (!isEmail(username)) {
        this.setState({error: 'email', errorMessage: 'メールアドレスの形式がちがいます'})
        this.process = false
        return
      }
    } else {
      if (username.match(new RegExp('[^A-Za-z0-9]+'))) {
        this.setState({error: 'email', errorMessage: 'ユーザネームは英数字のみです'})
        this.process = false
        return
      }
    }
    const password = this.state.password
    if (password.length === 0) {
      this.setState({error: 'password', errorMessage: 'パスワードを入力してください'})
      this.process = false
      return
    }
    if (isAlpha(password)) {
      this.setState({error: 'password', errorMessage: 'パスワードは数字を含みます'})
      this.process = false
      return
    }
    this.props.loginWithPassword(username, password)
    .catch(error => {
      if (error) {
        this.setState({error: 'password', errorMessage: 'ログインに失敗しました'})
      }
      this.process = false
    })
  }

  // 新規登録する
  onRegister = (event) => {
    if (event) event.preventDefault()
    if (this.process) return
    this.process = true
    this.props.createUser({
      username: this.state.username,
      password: this.state.password
    })
    .then(() => {
      this.props.loginWithPassword(this.state.username, this.state.password)
    })
    .catch(err => {
      this.setState({error: err.error, errorMessage: err.reason})
      this.process = false
    })
  }

  // エンターキーを入力する
  onPressEnter = (event) => {
    const ENTER = 13
    if (event.which === ENTER) {
      event.preventDefault()
      this.onLogin()
    }
  }
}

export default compose(
  withStyles(styles),
  withLoginWithPassword,
  withMethod('createUser'),
  withCurrentUser,
  observer
)(Login)
