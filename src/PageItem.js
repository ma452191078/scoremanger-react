import React, { Component } from 'react';
import { NavBar, Button, Modal} from 'antd-mobile';
import store from 'storejs';
import UserCard from './UserCard.js';
import Common from './Common.js';
import './PageItem.css';

const request = require('superagent');

class PageItem extends Component {
    constructor(props){
        super(props);
        this.state={
            userInfoArray:[],
            gameInfo:{},
            modal1: false,
            judgeInfo: {},
        };
    }

    initLocalStorage(){
        const judgeId = store('judgeId');
        var gameId = Common.localQuery(this, 'gameId');
        if (gameId === undefined || gameId === null || gameId === 'undefined'){
            gameId = store('gameId');
        }else{
            store("gameId", gameId);
        }
        if (judgeId === null || judgeId === undefined || judgeId === 'undefined' || judgeId === ''){
            this.createJudge(gameId);
        }else{
            this.getPlayerList(gameId, judgeId)
        }
    }

    getPlayerList(gameId, judgeId){
        const parameter = {
            gameId: gameId,
            judgeId: judgeId
        };
        console.log(parameter);
        const url = Common.base_url + '/player/getPlayerListByGameReact';
        request.post(url)
            .send(parameter)
            .end((err, res) => {
                // Calling the end function will send the request
                const userList = res.body.playerList;
                const gameInfo = res.body.gameInfo;
                this.setState({
                    userInfoArray : userList,
                    gameInfo: gameInfo
                });
            });
    }

    createJudge(gameId){
        const code = Common.localQuery(this,'code');
        const parameter = {
            gameId : gameId,
            code : code
        };
        const url = Common.base_url + '/judge/cerateJudgeReact';
        request.post(url)
            .send(parameter)
            .end((err,res) => {
                if (res !== undefined ){
                    if (res.body.errFlag === 0){
                        alert(res.body.errMsg);
                    }else{
                        this.setState({
                            judgeInfo:res.body.judgeInfo
                        });
                        store("judgeName", this.state.judgeInfo.judgeName);
                        store("judgeId", this.state.judgeInfo.judgeId);

                        this.getPlayerList(gameId, this.state.judgeInfo.judgeId)
                    }
                }
            });
    }


    // 评分规则相关方法
    showRole(){
        return {__html: this.state.gameInfo.gameRole};
    }

    showModal = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    };
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    };
    // 评分规则方法结束

    componentDidMount(){
        this.initLocalStorage();
    }



    render() {
        const gameInfo = this.state.gameInfo;
        const judgeInfo = this.state.judgeInfo;
        return (
            <div style={{width: '100%'}}>
                <NavBar style={{boxShadow:'2px 2px 8px rgb(208, 208, 208)'}}> 选手列表 </NavBar>
                {this.state.userInfoArray.map(function (user) {
                        return(<UserCard key={user.playerId}
                                         userInfo = {user}
                                         gameInfo = {gameInfo}
                                         judgeInfo = {judgeInfo}
                        />);
                    })
                }
                <Button type="primary" className="role-button" style={{position:'fixed', bottom:'20px',right:'20px',
                    width: '50px',height:'50px',borderRadius:'50px', fontSize:'30px', lineHeight:'50px', boxShadow:'2px 2px 8px #888888'}}
                        onClick={this.showModal('modal1')}>?</Button>
                <Modal
                    popup
                    visible={this.state.modal1}
                    maskClosable={false}
                    animationType="slide-up"
                    onClose={this.onClose('modal1')}
                    title={<div style={{marginTop:'5px',marginBottom:'5px'}}>评分规则</div>}
                    footer={[{ text: '确定', onPress: () => { this.onClose('modal1')(); } }]}
                    // wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div className='game-role' dangerouslySetInnerHTML={this.showRole()} style={{ height: 300, overflow: 'scroll' }} >

                    </div>
                </Modal>
            </div>
        );
    }
}

export default PageItem