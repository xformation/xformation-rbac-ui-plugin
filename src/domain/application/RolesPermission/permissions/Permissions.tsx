import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {MessageBox} from '../../Message/MessageBox'
import { rbacSettingsServices } from '../../_services/rbacSettings.service';
import { commonFunctions } from '../../_utilites/common.functions';
import * as _ from "lodash";

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in security service, permission could not be saved. Please check security service logs";
const SUCCESS_MESSAGE_ADDED = "New permission saved successfully";
const SUCCESS_MESSAGE_UPDATED = "Permission updated successfully";

interface RbacProps extends React.HTMLAttributes<HTMLElement> {
  isPageLoaded?: string | any;
}
export class Permissions extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isPageLoaded: this.props.isPageLoaded,
      isModalOpen: false,
      isLoading: false,
      uiModules: [],
      permissionName: null,
      allUiModules: [],
      selectedUiModules: [],
      permissions: [],
      orgPermissions: [],
      permission: null,
      description: null,
      searchPermission: "",
      errorMessage: "",
      successMessage: "",
    };
    this.getAllPermissions = this.getAllPermissions.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.createSelectbox = this.createSelectbox.bind(this);
    // this.onChangePluginName = this.onChangePluginName.bind(this);
    this.createRows = this.createRows.bind(this);
    this.onSearchPermission = this.onSearchPermission.bind(this);
    this.isMandatoryField = this.isMandatoryField.bind(this);
    // this.validate = this.validate.bind(this);
    this.savePermission = this.savePermission.bind(this);
  }

  async componentDidMount(){
    await this.getAllPermissions();
  }

  async getAllPermissions(){
    await rbacSettingsServices.getSecurityPermissions().then(
      response => {
        let sortedArr = _.sortBy(response, 'name');
        this.setState({
          permissions: sortedArr,
          orgPermissions: sortedArr
        });
      }
    );
  }

  async showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    // if(bShow){
    //   await rbacSettingsServices.getUiModules().then(
    //       response => {
    //             this.setState({
    //               allUiModules: response
    //             });
    //             let mn : any = {};
    //             let selMd : any = [];
    //             response.map( (item: any) => {
    //               if(item.moduleName !== mn.moduleName ){
    //                   mn = item;
    //                   selMd.push(item);
    //               }
    //             });
    //             selMd = _.sortBy(selMd, 'moduleName');
    //             this.setState({
    //               uiModules: selMd
    //             });
    //       }
    //   );
      
    // }
    this.setState(() => ({
      isModalOpen: bShow,
      errorMessage: "",
      successMessage: "",
      permissionName: null,
      permission: null,
      description: null,
    }));
  }

  handleStateChange(e: any) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
    // if (name === "permissionName") {
    //   this.setState({
    //     selectedUiModules: []
    //   });
    //   this.onChangePluginName(value);
    // }

    commonFunctions.restoreTextBoxBorderToNormal(name);
    this.setState({
      errorMessage: ""
    });
  }

  createSelectbox(data: any, value: any, label: any, uniqueKey: any) {
    const retData = [];
    for (let i = 0; i < data.length; i++) {
        let option = data[i];
        retData.push(
            <option key={option[value] + "-" + uniqueKey} value={option[value]}>{option[label]}</option>
        );
    }
    return retData;
  }

  // onChangePluginName(permissionName: any) {
  //   const { allUiModules } = this.state;
  //   console.log("permissionName : ",permissionName);
  //   let selSubModules: any = [];
  //   allUiModules.map( (item: any) => {
  //     if(item.moduleName === permissionName ){
  //         selSubModules.push(item);
  //     }
  //   });
  //   selSubModules = _.sortBy(selSubModules, 'subModuleName');
  //   this.setState({
  //     selectedUiModules: selSubModules
  //   });
  // };

  createRows(objAry: any) {
    console.log("createRows() - permission page ##################################### ", objAry);
    if(objAry === undefined || objAry === null) {
        return;
    }
    const arrLength = objAry.length;
    const retVal = [];
      for (let i = 0; i < arrLength; i++) {
        const obj = objAry[i];
        retVal.push(
          <tr >
            <td>{obj.name}</td>
            <td>{obj.permission}</td>
            <td>{obj.description}</td>
          </tr>
        );
      }
    return retVal;
  }

  onSearchPermission(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    if (name === "searchPermission") {
        let result = [];
        const { permissions, orgPermissions } = this.state;
        if (value !== "") {
            if (permissions && permissions.length > 0) {
                for (let i = 0; i < permissions.length; i++) {
                    let prm = permissions[i];
                    let name = prm.name + " " + prm.permission + " " + prm.description;
                    name = name.toLowerCase();
                    if (name.indexOf(value.toLowerCase()) !== -1) {
                        result.push(prm);
                    }
                }
                this.setState({
                    permissions: result
                });
                
            }
        } else {
            this.setState({
                permissions: orgPermissions
            });
            
        }
    }
  }

  isMandatoryField(objValue: any, obj: any){
    let errorMessage = "";
    if(objValue === undefined || objValue === null || objValue.trim() === ""){
      let tempVal = "";
      commonFunctions.changeTextBoxBorderToError(tempVal, obj);
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
    }
    return errorMessage;
  }

  // validate(){
  //   const {permissionName, permission, description} = this.state;
  //   // let errorMessage = this.isMandatoryField(permissionName, "permissionName");
  //   // errorMessage = this.isMandatoryField(permission, "permission");
  //   // this.setState({
  //   //     errorMessage: errorMessage
  //   // });
  //   // if(errorMessage !== "") {
  //   //   return false;
  //   // }
  //   return true;
  // }
  
  async savePermission() {
    const {permissionName, permission, description, errorMessage} = this.state;
    // if(!this.validate()){
    //   console.log("Validation error : ",errorMessage);
    //   return;
    // }
    let perm = {
      version: 1,
      name:permissionName,
      permission: permission,
      description: description
    }
    
    console.log('Save it: ', perm);
    await rbacSettingsServices.savePermission(perm).then(response => {
      console.log('Api response: ', response);
      
      this.setState({
        successMessage: SUCCESS_MESSAGE_ADDED,
      });

      rbacSettingsServices.getSecurityPermissions().then(
        response => {
          let sortedArr = _.sortBy(response, 'name');
          this.setState({
            permissions: sortedArr,
            orgPermissions: sortedArr
          });
        }
      );

    });
  };

  render() {
    const {isModalOpen, uiModules, permissionName, selectedUiModules, permissions, permission, description, searchPermission, errorMessage, successMessage} = this.state;
    return (
      <div className="info-container">
        <div className="border p-1 pb-2">
          

          <div className="m-b-1" style={{float: 'right'}}>
            <button   className="btn btn-primary m-1 width-14 m-r-1" onClick={e => this.showModal(e, true)} >
              <i className="fa fa-plus-circle mr-1" /> Create New Permission
            </button>
            <input type="text" className="searchInput" placeholder="search permission" name="searchPermission" onChange={this.onSearchPermission} value={searchPermission} />
          </div>

          
          <Modal isOpen={isModalOpen} className="react-strap-modal-container">
            <ModalHeader className="add-new-permission-header">Add New Permission</ModalHeader>
            <ModalBody className="modal-content">
              <form className="">
                <div className="modal-fwidth">
                {
                    errorMessage !== ""  ? 
                        <MessageBox id="mbox" message={errorMessage} activeTab={2}/>        
                        : null
                }
                {
                    successMessage !== ""  ? 
                        <MessageBox id="mbox" message={successMessage} activeTab={1}/>        
                        : null
                }
                    <div className="mdflex modal-fwidth"> 
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="add-permission-label">Parent</label>
                      {/* <select className="gf-form-input" name="permissionName" id="permissionName" value={permissionName} onChange={this.handleStateChange}>
                        <option value="">Select</option>
                        {this.createSelectbox(uiModules, "moduleName", "moduleName", "moduleName")}
                      </select> */}
                      <input type="text" className="gf-form-input" name="permissionName" id="permissionName" value={permissionName} onChange={this.handleStateChange}/>
                    </div>
                  </div>  
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="add-permission-label">Permissions </label>
                      <input type="text" className="gf-form-input" name="permission" id="permission" value={permission} onChange={this.handleStateChange} maxLength={255}/>
                      
                      {/* <select className="gf-form-input" name="permission" id="permission" value={permission} onChange={this.handleStateChange}>
                        <option value="">Select</option>
                        {this.createSelectbox(selectedUiModules, "subModuleName", "subModuleName", "subModuleName")}
                      </select> */}
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="add-permission-label"> Description </label>
                      <textarea className="gf-form-input" placeholder="description" rows={2} maxLength={255}  name="description" id="description"  onChange={this.handleStateChange} value={description} />
                    </div>
                  </div>

                  <div className="m-t-1 text-center">
                    <button type="button" className="btn btn-primary border-bottom mr-1 save-btn" onClick={this.savePermission}> Save </button>
                    <button className="btn btn-danger border-bottom mr-1 save-btn" onClick={e => this.showModal(e, false)} > Cancel </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
          <div style={{height:'350px', width:'100%', boxSizing:'border-box', display:'inline-block', verticalAlign:'middle', overflowY:'auto'}}>
            <table  className="rollPermissionTable table" id="permissionTable" >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Permission</th>
                  <th>Description</th>
                </tr>
              </thead>
              {
                permissions !== undefined && permissions !== null && permissions.length > 0 ?
                <tbody>{this.createRows(permissions)}</tbody>
                : null
              }
            </table>
          </div>
          
        </div>
      </div>
    );
  }
}
