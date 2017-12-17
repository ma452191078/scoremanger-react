import React, { Component } from 'react';
import { Tabs } from 'antd-mobile';
import PageItem from "./PageItem";
import Common from './Common.js';

const request = require('superagent');

class PageTab extends Component {
    constructor(props){
        super(props);
        this.state={
            tabs:[],
            gameRole:[],
            view:"type_a"
        };
    }
    componentDidMount(){
        const parameter = {gameId:'d0422e00-f3f3-417b-8fb5-3b84ab9aa4d2'};

        const url = Common.base_url + '/qualityprize/group/getGroupInfoListReact';
        request.post(url)
            .send(parameter)
            .end((err, res) => {
                // Calling the end function will send the request
                const groupInfoArray = res.body.result;
                const groupNameArray = [];
                for (var i = 0; i < 1; i++){
                    const groupInfo = {};
                    groupInfo['title'] = groupInfoArray[i].groupName;
                    groupInfo['groupId'] = groupInfoArray[i].groupId;
                    groupNameArray.push(groupInfo);
                }
                this.setState({
                    tabs : groupNameArray
                });
            });
    }

    renderContent = tab =>
        (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'auto', backgroundColor: '#fff' }}>
            <PageItem groupName={tab.title} groupId={tab.groupId}/>
        </div>);

    render(){
        return (
            <div style={{position: 'fixed', height: '100%', width: '100%', top: 0}}>
                <Tabs tabs={this.state.tabs} animated={false} useOnPan={false}>
                    {this.renderContent}
                </Tabs>
            </div>
        );
    }
}

export default PageTab