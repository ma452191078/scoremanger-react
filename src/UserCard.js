import React, { Component } from 'react';
import { Card, WingBlank, WhiteSpace, Badge, Toast} from 'antd-mobile';
import { Link } from "react-router-dom";
import Common from './Common.js';
import store from 'storejs';
import request from 'superagent';
import "./UserCard.css"

class UserCard extends Component {
    constructor(props){
        super(props);
        this.state={
            userInfo:{},
            gameInfo:{}
        };
    }
    componentDidMount(){

        this.setState({
            userInfo: this.props.userInfo,
            gameInfo: this.props.gameInfo,
        });
    }

    checkUser(){
        let parameter = {};
        parameter["playerId"]= this.state.userInfo.playerId;
        parameter["gameId"]= store('gameId');
        parameter['judgeId'] = store('judgeId');

        let jsonOb = eval(parameter);
        let url = Common.base_url + "/score/checkScoreByJudgeIdReact";

        request.post(url)
            .send(jsonOb)
            .end((err, res) => {
                if (res.body.flag === 'success'){
                    let message = '选手'+this.state.userInfo.playerName+'您已提交评分，不能再次评分。';
                    window.history.go(-1);
                    Toast.fail(message, 3,()=>{  });
                }
            });
    }
    render() {
        const data = { userInfo: this.props.userInfo, gameInfo: this.props.gameInfo};
        const path = {  pathname:'/ScoreList', data:data};
        return (
            <WingBlank size="lg">
                <WhiteSpace size="lg"/>
                <Link to={path} className='mine-user-card' onClick={this.checkUser.bind(this)}>
                    <Card>
                        <Card.Header
                            title={<div className="user-name-div">
                                        <p className={"user-name"}><img alt='姓名' className='info-img' src={require('./imgs/user-name.svg')}/>{this.state.userInfo.playerName}</p>
                                        <p className="user-department"><img alt='单位' className='info-img' src={require('./imgs/user-dept.svg')}/> {this.props.userInfo.playerDepartment}</p>
                                        <p className="user-department"><img alt='顺序' className='info-img' src={require('./imgs/user-index.svg')}/> {this.props.userInfo.playerNum}号</p>
                                   </div>}
                            thumb={Common.img_url +this.props.userInfo.playerImg}
                            thumbStyle={{width:'100px',height:'100px'}}
                            extra={<Badge text={this.props.userInfo.playerIsScore > 0 ?'已评分':''} style={{ marginLeft: 12, padding: '0 3px', borderRadius: 2 }}/>}
                        />
                    </Card>
                </Link>

                <WhiteSpace size="lg"/>
            </WingBlank>

        );
    }
}
export default UserCard