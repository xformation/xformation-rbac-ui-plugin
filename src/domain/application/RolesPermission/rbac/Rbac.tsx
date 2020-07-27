import * as React from 'react';

export default class Rbac extends React.Component<any,any>{
    constructor(props: any) {
        super(props);
        this.state = {
          activeTab: 0,
          permissions: [],
          childName:null,
          isExternalSecurityEnabled: localStorage.getItem('external_security_enable') === "true" ? true : false,
        };
        this.getExternaSecurityStatus = this.getExternaSecurityStatus.bind(this);
    }
    
    async componentDidMount() {
        await this.getExternaSecurityStatus();
    }
    
    async getExternaSecurityStatus() {
      await console.log("external security flag : ", this.state.isExternalSecurityEnabled);
      if(this.state.isExternalSecurityEnabled){
        let uInfo = (localStorage.getItem('userInfo') === null || localStorage.getItem('userInfo') === undefined || localStorage.getItem('userInfo') === '') ? '' : localStorage.getItem('userInfo');
        let userInfo = (uInfo !== '' && uInfo !== null && uInfo !== undefined && uInfo !== "undefined") ? JSON.parse(uInfo) : '';        
        this.setState({
          permissions: userInfo !== '' ? userInfo.authz.permissions : [],
          childName: this.props.childName
        })
      }
      await console.log("permissions : ", this.state.permissions);
    }

    include(arr:any,obj:any) {
        return (arr.indexOf(obj) != -1);
    }

    render(){
      const {childName, permissions, isExternalSecurityEnabled}=this.state
      if(!isExternalSecurityEnabled){
        console.log("1. External security disabled. Running with default authentication");
        return this.props.children;
      }
      if(!this.include(permissions,childName)){
        console.log("2. permission not granted. returning null");
        return null;
      }
      console.log("3. permission granted. returning children");
      return this.props.children;
    }

}