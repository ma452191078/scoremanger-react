import React, { Component } from 'react';
import { List, InputItem, Button, Icon, NavBar, Toast} from 'antd-mobile';
import store from 'storejs';
import request from 'superagent';
import Common from './Common.js';
import './ScoreList.css';

const defaultImg = './imgs/user_default.png';
class ScoreList extends Component {
    constructor(props){
        super(props);
        const data = this.props.location.data;
        if (data === undefined){
            window.location.href='/';
        }else{
            this.state={
                userInfo: data.userInfo,
                gameInfo: data.gameInfo
            };
        }

    }

    submitScore(){

        const parameter = {};
        parameter["scoreValue"] = 0.00;
        parameter["playerId"]= this.state.userInfo.playerId;
        parameter["gameId"]= this.state.gameInfo.gameId;
        parameter['judgeId'] = store('judgeId');

        let errFlag = 0;
        let errMsg;
        let scoreList = [];
        let roleList = this.state.gameInfo.gameRoleInfoList;
        for (let i = 0; i < roleList.length; i++){
            let roleScoreDetail = {};
            let scoreInfo = document.getElementById(roleList[i].roleId);
            let scoreValue = scoreInfo.value;
            let maxValue = roleList[i].roleScore;

            if (parseInt(maxValue,10) < parseInt(scoreValue,10)){
                errMsg = roleList[i].roleName + '分数不能高于' + maxValue + '分！';
                scoreInfo.select();
                errFlag = 1;
            }
            // 检查分值是否有效
            if (parseInt(scoreValue,10) < 0 || scoreValue === ""){
                errMsg = roleList[i].roleName + '请输入有效分数！';
                scoreInfo.select();
                errFlag = 1;
            }
            if (errFlag === 0){
                roleScoreDetail["scoreValue"] = scoreValue;
                roleScoreDetail["roleId"] = roleList[i].roleId;
                scoreList.push(roleScoreDetail);
            }
        }

        if (errFlag === 1){
            Toast.fail(errMsg,3,()=>{});
            return
        }

        parameter['scoreRoleInfoList'] = scoreList;
        let jsonOb = eval(parameter);
        let url = Common.base_url + "/score/addScore";

        Toast.loading('正在提交得分', 0, () => { });
        request.post(url)
            .send(jsonOb)
            .end((err, res) => {
                if (res.body.flag === 'success'){
                    Toast.success('得分已提交', 2, () => {
                        this.cancelScore();
                    });
                }else {
                    Toast.fail('提交失败，请重试', 2,()=>{

                    });
                }
            });
    }

    cancelScore(){
        window.history.go(-1);
    }

    render(){
        const roleList = this.state.gameInfo.gameRoleInfoList;
        return(
            <div>
                <NavBar
                    mode="dark"
                    icon={<Icon type="left" />}
                    rightContent={
                        <div onClick={this.submitScore.bind(this)}>提交</div>
                    }
                    onLeftClick={this.cancelScore.bind()}
                >{this.state.userInfo.playerName}</NavBar>
                <div className="user-info">
                    <img className='user-head' style={{float:'left'}} alt='头像'
                        src={Common.img_url +this.state.userInfo.playerImg}
                    />
                    <div className="user-info-list" style={{float:'right'}}>
                        <p><img alt='姓名' className='info-img' src={require('./imgs/user-name.svg')}/> {this.state.userInfo.playerName}</p>
                        <p><img alt='单位' className='info-img' src={require('./imgs/user-dept.svg')}/> {this.state.userInfo.playerDepartment}</p>
                        <p><img alt='顺序' className='info-img' src={require('./imgs/user-index.svg')}/> {this.state.userInfo.playerNum}号</p>
                    </div>
                </div>
                <List>
                    {roleList.map(function (roleInfo, ) {
                        return(<InputItem id={roleInfo.roleId} placeholder ={'得分请≤'+roleInfo.roleScore+'分'} key={roleInfo.roleId}> {roleInfo.roleName}</InputItem>);
                    })
                    }

                </List>

                {/*<div className='button-group' style={{textAlign:'center', bottom:'0px'}}>*/}
                    {/*<WhiteSpace />*/}
                    {/*<Button type="primary" inline style={{width:'40%', marginRight: '15px'}} onClick={this.submitScore.bind(this)}>提交</Button>*/}
                    {/*/!* use `am-button-borderfix`. because Multiple buttons inline arranged, the last one border-right may not display *!/*/}
                    {/*<Button type="ghost" inline className="am-button-borderfix" style={{width:'40%',marginRight: '5px'}} onClick={this.cancelScore.bind()} >取消</Button>*/}
                    {/*<WhiteSpace/>*/}
                {/*</div>*/}

            </div>
        );
    }
}

export default ScoreList