import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {MessageBox} from '../../Message/MessageBox'
import { rbacSettingsServices } from '../../_services/rbacSettings.service';
import { commonFunctions } from '../../_utilites/common.functions';
import * as _ from "lodash";
import Tree from '../../Tree/tree';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Roles/Permissions could not be saved. Please check security service logs";
const SUCCESS_MESSAGE_ADDED = "New role saved successfully";
const SUCCESS_MESSAGE_UPDATED = "Role and its permissions updated successfully";

interface RolesProps extends React.HTMLAttributes<HTMLElement> {
  isLoaded?: string | any; 
}

export class Roles extends React.Component<RolesProps, any> {
  constructor(props: RolesProps) {
    super(props);
    this.state = {
      isModalOpen: false,
      roles: [],
      permissions: [],
      permittedPermissions: [],
      prohibitedPermissions: [],
      preferences: [],
      preferenceId: '',
      checked: [],
      expanded: [],
      isLoaded: this.props.isLoaded,
      isSuccess: "",
      selectedRole: "",
      isUpdating: false,
      errorMessage: "", 
      successMessage: "",
      modelErrorMessage: "", 
      modelSuccessMessage:"",
      roleName: "", 
      roleDescription:"",
    };
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.createPermissions = this.createPermissions.bind(this);
    this.createPreference = this.createPreference.bind(this);
    this.setPreference = this.setPreference.bind(this);
    this.onRoleClicked = this.onRoleClicked.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.isMandatoryField = this.isMandatoryField.bind(this);
    this.validate = this.validate.bind(this);
    this.saveRole = this.saveRole.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
    this.getAllPermissions = this.getAllPermissions.bind(this);
  }

  async componentDidMount(){
    await this.getAllRoles();
    await this.getAllPermissions();
    await this.createPermissions(this.state.permissions); 
    await this.createPreference();
    
    console.log("isLoaded :------------------>>>>>> ", this.state.isLoaded);
  }

  async getAllRoles(){
    await rbacSettingsServices.getAllRoles().then(
      response => {
        const arr: any = [];
        response.map( (item: any) => {
          if(!item.grp ){
              arr.push(item);
          }
        });
        this.setState({
          roles: arr,
        });
      }
    )
  }

  async getAllPermissions(){
    await rbacSettingsServices.getSecurityPermissions().then(
      response => {
        this.setState({
          permissions: response,
        });
      }
    )
  }

  async createPreference(){
    let pref: any = [];
    let obj1 =  {
        id: 'permitted',
        title: 'Permitted',
    };
    let obj2 =  {
        id: 'prohibited',
        title: 'Prohibited',
    };
    await pref.push(obj1);
    await pref.push(obj2);
    this.setState({
      preferences: pref,
      preferenceId: 'permitted',
    });
  }

  setPreference(id: any) {
    console.log(id);
    this.setState({
      preferenceId: id,
    });
  }

  async createPermissions(response: any) {
    const permissions:any = {};
    const permittedPermissions: any = [];
    const prohibitedPermissions: any = [];

    await response.map( (i: any) => {
      
    // });
    // for (const i in response) {
      const permission = i;
      if (!permissions[permission.name]) {
        permissions[permission.name] = {
          name: permission.name,
          collapse: true,
          children: [{
            ...permission,
            dupName: permission.name,
            name: permission.permission
          }]
        };
      } else {
        const children = permissions[permission.name].children;
        children.push({
          ...permission,
          dupName: permission.name,
          name: permission.permission
        });
      }
    // }
    });
    for (const j in permissions) {
      const permission = permissions[j];
      permittedPermissions.push(permission);
      prohibitedPermissions.push(JSON.parse(JSON.stringify(permission)));
    }
    console.log("permittedPermissions ::::: ",permittedPermissions);
    this.setState({
      permittedPermissions: permittedPermissions,
      prohibitedPermissions: prohibitedPermissions
    });
  }

  showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      isModalOpen: bShow,
      errorMessage: "", 
      successMessage: "",
      modelErrorMessage: "", 
      modelSuccessMessage: "",
    }));
  }

  handleStateChange(e: any) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  onRoleClicked(selectedRole: any){
    const {permittedPermissions, prohibitedPermissions} = this.state;
    this.setState({
      selectedRole: selectedRole
    });
    const selectedPermissions = selectedRole.permissions;
    for (const k in permittedPermissions) {
      permittedPermissions[k].checked = false;
      permittedPermissions[k].collapse = false;
      prohibitedPermissions[k].checked = false;
      prohibitedPermissions[k].collapse = false;
      const children = permittedPermissions[k].children;
      const prohibitedChildren = prohibitedPermissions[k].children;
      if (children.length > 0) {
        for (const j in children) {
          children[j].checked = false;
          prohibitedChildren[j].checked = true;
        }
      }
    }

    for (const i in selectedPermissions) {
      const selectedPermission = selectedPermissions[i];
      for (const j in permittedPermissions) {
        const children = permittedPermissions[j].children;
        const prohibitedChildren = prohibitedPermissions[j].children;
        for (const k in children) {
          if (children[k].id === selectedPermission.id) {
            children[k].checked = true;
            prohibitedChildren[k].checked = false;
          }
        }
      }
    }
    this.setState({
      permittedPermissions: permittedPermissions,
      prohibitedPermissions: prohibitedPermissions
    });
  }

  async updateRole(){
    const {selectedRole, permittedPermissions} = this.state;
    if (selectedRole) {
      let selectedPermissions = [];
      selectedPermissions = [];
      for (const i in permittedPermissions) {
        const children = permittedPermissions[i].children;
        for (const j in children) {
          const child = children[j];
          if (child.checked) {
            child.permit = true;
            selectedPermissions.push({
              ...child,
              name: child.dupName
            });
          }
        }
      }
      selectedRole["permissions"] = selectedPermissions;
      this.setState({
        selectedRole: selectedRole,
        isUpdating: true
      })
      await rbacSettingsServices.createRole(selectedRole).then(response => {
        console.log('Update roles/permissions response: ', response);
        this.setState({
          successMessage: SUCCESS_MESSAGE_UPDATED,
        });
      });
      
    }
  }

  
  isMandatoryField(objValue: any, obj: any){
    let modelErrorMessage = "";
    if(objValue === undefined || objValue === null || objValue.trim() === ""){
      let tempVal = "";
      commonFunctions.changeTextBoxBorderToError(tempVal, obj);
      modelErrorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
    }
    return modelErrorMessage;
  }

  validate(){
    const {roleName, roleDescription} = this.state;
    let modelErrorMessage = this.isMandatoryField(roleName, "roleName");
    modelErrorMessage = this.isMandatoryField(roleDescription, "roleDescription");
    this.setState({
      modelErrorMessage: modelErrorMessage
    });
    if(modelErrorMessage !== "") {
      return false;
    }
    return true;
  }

  async saveRole() {
    const {roleName, roleDescription, modelErrorMessage} = this.state;
    if(!this.validate()){
      console.log("Validation error : ",modelErrorMessage);
      return;
    }
    let obj = {
      version: 1,
      name: roleName,
      description: roleDescription,
      grp: false
    }
    console.log('Save role: ', obj);
    await rbacSettingsServices.createRole(obj).then(response => {
      console.log('Api response create new role: ', response);
      this.setState({
        modelSuccessMessage: SUCCESS_MESSAGE_ADDED,
      });
    });
    await this.getAllRoles();
    await this.getAllPermissions();
  }

  render() {
    const {isModalOpen, roles, preferences, permittedPermissions, prohibitedPermissions, errorMessage, successMessage, modelErrorMessage, modelSuccessMessage, roleName, roleDescription} = this.state;
    let a : any = ["a","b"];
    return (
      <div className="info-container roles-main-container">
        {
            errorMessage !== ""  ? <MessageBox id="mbox" message={errorMessage} activeTab={2}/> : null
        }
        {
            successMessage !== ""  ? <MessageBox id="mbox" message={successMessage} activeTab={1}/> : null
        }
        
        <div  className="roles-container roles-container2 p-1 p-t-0 border-container" style={{border:'1px solid'}}>
        <div className="view-role-div">
          {
           
            roles !== undefined && roles !== null && roles.length > 0 ? 
                roles.map((item: any) => (
                    <div className="radio-button-container" >
                      <input onClick={e =>this.onRoleClicked(item)} name="roles" type="radio" id={item.id + 'role'} />&nbsp;<label className="d-inline-block" id={item.id + 'role'}>{item.name}</label>
                    </div>
                ))
               : null
               
          }
          </div>
          
          {/* </div> */}
          <div className="m-b-1 create-role-btn" >
            <button className="btn btn-primary pull-right create-new-role-button" onClick={e => this.showModal(e, true)}  >
                <i className="fa fa-plus-circle" /> Create New Role
            </button>
          </div>
          
          <div className="border FirstRow p-1">
            
            <Modal isOpen={isModalOpen} className="react-strap-modal-container">
              <ModalHeader className="add-new-permission-header">Add New Role</ModalHeader>
              <ModalBody className="modal-content">
                <form className="">
                  <div className="modal-fwidth">
                  {
                      modelErrorMessage !== ""  ? <MessageBox id="mbox" message={modelErrorMessage} activeTab={2}/> : null
                  }
                  {
                      modelSuccessMessage !== ""  ? <MessageBox id="mbox" message={modelSuccessMessage} activeTab={1}/> : null
                  }
                    <div className="mdflex modal-fwidth">
                      <div className="fwidth-modal-text m-r-1 fwidth">
                        <label className="add-permission-label">Role Name</label>
                        <input type="text" name="roleName" id="roleName" value={roleName} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " />
                      </div>
                    </div>
                    <div className="fwidth-modal-text modal-fwidth">
                      <div className="fwidth-modal-text m-r-1 fwidth">
                        <label className="add-permission-label"> Role Description </label>
                        <input type="text" name="roleDescription" id="roleDescription" value={roleDescription} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " />
                      </div>
                    </div>

                    <div className="m-t-1 text-center">
                      <button type="button" onClick={this.saveRole} className="btn btn-primary border-bottom mr-1 save-btn"> Save </button>
                      <button className="btn btn-danger border-bottom save-btn" onClick={e => this.showModal(e, false)} > Cancel </button>
                    </div>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>
        </div>
        <div className="transition-preference">
          <hr />
          <div className="transition-preference-label" style={{fontWeight:'bold'}}>Set transition preferences</div>
          <div className="tab-header">
            <ul className="gf-tabs">
              {
                  preferences !== undefined && preferences !== null &&  preferences.length > 0 ?
                  preferences.map((item: any) => (
                    <li className="gf-tabs-item" onClick={e => this.setPreference(item.id)} >
                        <a className={this.state.preferenceId === item.id ? 'gf-tabs-link active': 'gf-tabs-link'  }>
                            {item.title}
                        </a>
                    </li>
                  )) : null
              }
                
            </ul>
            <div className="clearfix"></div>
          </div>
          <div className="border-container p-1" style={{height:'200px', overflowY:'auto', border:'1px solid'}}>
            <div className={this.state.preferenceId !== 'permitted' ? "hide" : "tab-content" } >
                {
                  permittedPermissions !== undefined && permittedPermissions !== null
                   &&  permittedPermissions.length > 0 && (
                      <Tree data={permittedPermissions}/>
                    )  
                }
            </div>
            <div className={this.state.preferenceId !== 'prohibited' ? "hide" : "tab-content" } >
                {
                  prohibitedPermissions !== undefined && prohibitedPermissions !== null
                   &&  prohibitedPermissions.length > 0 && (
                        <Tree data={prohibitedPermissions}/> 
                    )  
                }
            </div>
            <div className="m-t-1 pull-right">
              <button type="button" onClick={this.updateRole} className="btn btn-primary border-bottom mr-1 apply-role-button"> APPLY </button>
              {/* <button className="btn btn-danger border-bottom">Cancel</button> */}
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}
