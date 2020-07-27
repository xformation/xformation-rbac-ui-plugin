import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {MessageBox} from '../../Message/MessageBox'
import { rbacSettingsServices } from '../../_services/rbacSettings.service';
import { commonFunctions } from '../../_utilites/common.functions';
import * as _ from "lodash";

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in security service, operation could not be performed. Please check security service logs";
const SUCCESS_MESSAGE_ADDED = "New group saved successfully";
const SUCCESS_MESSAGE_ROLES_ASSIGNED = "Roles assigned successfully";
const SUCCESS_MESSAGE_UPDATED = "Group updated successfully";

interface RbacProps extends React.HTMLAttributes<HTMLElement> {
  isPageLoaded?: string | any;
}
export class Groups extends React.Component<RbacProps, any> {
  constructor(props: RbacProps) {
    super(props);
    this.state = {
      isPageLoaded: this.props.isPageLoaded,
      errorMessage: "",
      successMessage: "",
      isModalOpen: false,
      isAssignRole: false,
      groups: [],
      assignRoleGroups: [],
      orgGroups: [],
      roles: [],
      orgRoles: [],
      assignRoles: [],
      groupName: "", 
      groupDescription: "",
      selectedGroup: null,
      selectedRoles:[],
      searchGroup: "",
      searchAssignRoleGroup: "",
      searchAssignRole: "",
    };
    this.showModal = this.showModal.bind(this);
    this.showAssign = this.showAssign.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.createRows = this.createRows.bind(this);
    this.getAllRoles = this.getAllRoles.bind(this);
    this.saveGroup = this.saveGroup.bind(this);
    this.createGroupListWithRadio = this.createGroupListWithRadio.bind(this);
    this.createRoleListWithCheckbox = this.createRoleListWithCheckbox.bind(this);
    this.onChangeGroup = this.onChangeGroup.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.assignRoles = this.assignRoles.bind(this);
    this.resetRole = this.resetRole.bind(this);
    this.updateRolesOfSelectedGroup = this.updateRolesOfSelectedGroup.bind(this);
    this.onSearchGroup = this.onSearchGroup.bind(this);
    this.onSearchAssignRoleGroup = this.onSearchAssignRoleGroup.bind(this);
    this.onSearchAssignRole = this.onSearchAssignRole.bind(this);
  }

  showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      isModalOpen: bShow,
      errorMessage: "",
      successMessage: "",
      groupName: "",
      groupDescription: "",
    }));
  }

  showAssign(e: any, aShow: boolean) {
    e && e.preventDefault();
    const {roles, orgGroups} = this.state;
    for (const i in roles) {
      roles[i].checked = false;
    }
    
    this.setState(() => ({
      isAssignRole: aShow,
      selectedGroup: null,
      roles: roles,
      assignRoles: roles,
      assignRoleGroups: orgGroups,
      errorMessage: "",
      successMessage: "",
      searchAssignRoleGroup: "",
      searchAssignRole: "",
    }));
    if(!aShow){
      this.getAllRoles();
    }
  }

  handleStateChange(e: any) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  async componentDidMount(){
    if(this.state.isPageLoaded === "YES"){
      await this.getAllRoles();
    }
  }

  async getAllRoles(){
    await rbacSettingsServices.getAllRoles().then(
      response => {
        const groups: any = [];
        const roles:any = [];
        const orgGroups: any = [];
        const assignRoleGroups: any = [];
        const orgRoles: any = [];
        const assignRoles: any = [];
        response.map( (item: any) => {
          if(item.grp ){
             groups.push(item);
             orgGroups.push(item);
             assignRoleGroups.push(item);
          }else{
            roles.push(item);
            orgRoles.push(item);
            assignRoles.push(item);
          }
        });
        this.setState({
          groups: _.sortBy(groups, 'name'),
          orgGroups: _.sortBy(orgGroups, 'name'),
          assignRoleGroups: _.sortBy(assignRoleGroups, 'name'),
          roles: _.sortBy(roles, 'name'),
          orgRoles: _.sortBy(orgRoles, 'name'),
          assignRoles: _.sortBy(assignRoles, 'name'),
        });
      }
    );
  }
  
  async onChangeRole(e: any, role: any){
    await this.resetRole(role);
    await this.updateRolesOfSelectedGroup(role);
  }

  async updateRolesOfSelectedGroup(selectedRole: any){
    const {selectedGroup, roles} = this.state;
    if(selectedGroup){
      let selectedRoleindex: any = -1;
      selectedGroup.roles.map( (groupRole: any, groupRoleIndex: any) => {
        if(groupRole.id === selectedRole.id){
          selectedRoleindex = groupRoleIndex;
        }
      });

      if (selectedRole.checked) {
        selectedGroup.roles.push(selectedRole);
      } else {
        selectedGroup.roles.splice(selectedRoleindex, 1);
      }
      this.setState({
        selectedGroup: selectedGroup
      });
    }
  }

  async resetRole(role: any){
    const {roles} = this.state;
     for (const i in roles) {
      if (roles[i].id === role.id) {
        roles[i].checked = !roles[i].checked;
        break;
      }
    }
    this.setState({
      roles: roles
    });
  }

  onChangeGroup(group: any){
    console.log("fire onChangeGroup");
    const {roles} = this.state;
    for (const i in roles) {
      roles[i].checked = false;
    }
    for (const i in group.roles) {
      const role = group.roles[i];
      for (const j in roles) {
        const scopeRole = roles[j];
        if (roles[j].id === role.id) {
          roles[j].checked = true;
          break;
        }
      }
    }
    this.setState({
      roles: roles,
      selectedGroup: group,
    });
  }

  createGroupListWithRadio(){
    const {assignRoleGroups} = this.state;
    const arrLength = assignRoleGroups.length;
    const retVal = [];
    
      for (let i = 0; i < arrLength; i++) {
        const obj = assignRoleGroups[i];
        retVal.push(
            <div>
              <input type="radio" onClick={e => this.onChangeGroup(obj)} name="group" id={`${obj.id}`} className="m-l-1" />&nbsp;
              {obj.name}
            </div>
        );
      }
    return retVal;
  }

  createRoleListWithCheckbox(){
    const {assignRoles} = this.state;
    const arrLength = assignRoles.length;
    const retVal = [];
    
      for (let i = 0; i < arrLength; i++) {
        const obj = assignRoles[i];
        retVal.push(
            <div>
              <input type="checkbox" id={`${obj.id}`}  onChange={e => this.onChangeRole(e, obj)} checked={obj.checked} className="m-l-1"/>&nbsp;
              {obj.name}
            </div>
        );
      }
    return retVal;
  }

  createRows(groupsAry: any) {
    console.log("createRows() Groups list on groups page: ", groupsAry);
    if(groupsAry === undefined || groupsAry === null) {
        return;
    }
    const arrLength = groupsAry.length;
    const retVal = [];
    
      for (let i = 0; i < arrLength; i++) {
        const obj = groupsAry[i];
        const roles = obj.roles;
        const roleName = [];
        let str = '';
        for(let k=0; k<roles.length; k++){
          str = str+roles[k].name+', ';
        }
        roleName.push(str.substring(0, str.lastIndexOf(",")));
        retVal.push(
          <tr >
            <td>
              {/* <input type="checkbox" id={`${i}`} />&nbsp; */}
              {obj.name}
            </td>
            <td>
                {roleName}
            </td>
          </tr>
        );
      }
    return retVal;
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

  validate(){
    const {groupName} = this.state;
    let errorMessage = this.isMandatoryField(groupName, "groupName");
    this.setState({
        errorMessage: errorMessage
    });
    if(errorMessage !== "") {
      return false;
    }
    return true;
  }

  async saveGroup() {
    const {groupName, groupDescription, errorMessage} = this.state;
    if(!this.validate()){
      console.log("Validation error : ",errorMessage);
      return;
    }
    let obj = {
      version: 1,
      name: groupName,
      description: groupDescription,
      grp: true
    }
    console.log('Save group: ', obj);
    await rbacSettingsServices.saveGroup(obj).then(response => {
      console.log('Api response: ', response);
      this.setState({
        successMessage: SUCCESS_MESSAGE_ADDED,
      });
    });
    await this.getAllRoles();
  }

  async assignRoles() {
    const {selectedGroup, roles} = this.state;
    console.log('Assign roles to group: ', selectedGroup);
    await rbacSettingsServices.saveGroup(selectedGroup).then(response => {
      console.log('Api response: ', response);
      this.setState({
        successMessage: SUCCESS_MESSAGE_ROLES_ASSIGNED,
      });
    });
  }

  onSearchGroup(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    if (name === "searchGroup") {
        let result = [];
        const { groups, orgGroups } = this.state;
        if (value !== "") {
            if (groups && groups.length > 0) {
                for (let i = 0; i < groups.length; i++) {
                    let prm = groups[i];
                    let name = prm.name ;
                    name = name.toLowerCase();
                    if (name.indexOf(value.toLowerCase()) !== -1) {
                        result.push(prm);
                    }
                }
                this.setState({
                    groups: result
                });
                
            }
        } else {
            this.setState({
                groups: orgGroups
            });
            
        }
    }
  }

  onSearchAssignRoleGroup(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    if (name === "searchAssignRoleGroup") {
        let result = [];
        const { assignRoleGroups, orgGroups } = this.state;
        if (value !== "") {
            if (assignRoleGroups && assignRoleGroups.length > 0) {
                for (let i = 0; i < assignRoleGroups.length; i++) {
                    let prm = assignRoleGroups[i];
                    let name = prm.name ;
                    name = name.toLowerCase();
                    if (name.indexOf(value.toLowerCase()) !== -1) {
                        result.push(prm);
                    }
                }
                this.setState({
                  assignRoleGroups: result
                });
                
            }
        } else {
            this.setState({
              assignRoleGroups: orgGroups
            });
            
        }
    }
  }

  onSearchAssignRole(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    if (name === "searchAssignRole") {
        let result = [];
        const { assignRoles, orgRoles } = this.state;
        if (value !== "") {
            if (assignRoles && assignRoles.length > 0) {
                for (let i = 0; i < assignRoles.length; i++) {
                    let prm = assignRoles[i];
                    let name = prm.name ;
                    name = name.toLowerCase();
                    if (name.indexOf(value.toLowerCase()) !== -1) {
                        result.push(prm);
                    }
                }
                this.setState({
                  assignRoles: result
                });
                
            }
        } else {
            this.setState({
              assignRoles: orgRoles
            });
            
        }
    }
  }

  render() {
    const {isModalOpen, isAssignRole, groups, roles, errorMessage, successMessage, groupName, groupDescription, selectedGroup
      , searchGroup, assignRoleGroups, searchAssignRoleGroup, assignRoles, searchAssignRole} = this.state;
    return (
      <div className="info-container">
        <div className="border p-1 pb-2">
          <div className="m-b-1" style={{float: 'right'}}>
            <button className="btn btn-primary mr-1 create-new-role-button2" onClick={e => this.showModal(e, true)}  >
              <i className="fa fa-plus-circle" /> Create New Group
            </button>
            <button className="btn btn-primary mr-1 assign-role-btn" onClick={e => this.showAssign(e, true)}  >
              <i className="fa fa-plus-circle" /> Assign Role
            </button>
            <input type="text" className="searchInput" placeholder="search group" name="searchGroup" onChange={this.onSearchGroup} value={searchGroup}/>
          </div>

          <Modal isOpen={isModalOpen} className="react-strap-modal-container">
            <ModalHeader className="add-new-permission-header" >Create New Group</ModalHeader>
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
                    {/* <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">VERSION</label>
                      <input type="text" required className="gf-form-input " placeholder="version" />
                    </div> */}
                  </div>
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label"> Group Name </label>
                      <input type="text" name="groupName" id="groupName" value={groupName} onChange={this.handleStateChange} className="gf-form-input " maxLength={255} placeholder="group name" />
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="add-permission-label"> Group Description </label>
                      <textarea required className="gf-form-input " name="groupDescription" value={groupDescription} onChange={this.handleStateChange} id="groupDescription" maxLength={255} placeholder="description" />
                    </div>
                  </div>

                  <div className="m-t-1 text-center">
                    <button type="button" className="btn btn-primary border-bottom mr-1 save-btn" onClick={this.saveGroup}> Save </button>
                    <button className="btn btn-danger border-bottom mr-1 save-btn" onClick={e => this.showModal(e, false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>

          <Modal isOpen={isAssignRole} className="react-strap-modal-container">
            <ModalHeader className="add-new-permission-header">Assign Roles To Group</ModalHeader>
            <ModalBody className="modal-content">
              <form >
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
                    <div className="fwidth-modal-text fwidth m-r-1"  >
                      <label className="add-permission-label">Select Group</label>
                      <input type="text" className="gf-form-input " placeholder="search group" name="searchAssignRoleGroup" onChange={this.onSearchAssignRoleGroup} value={searchAssignRoleGroup}/>
                      <div className="m-t-1" style={{height:'100px', overflowY:'auto', border:'1px solid'}}>
                          {
                            assignRoleGroups !== null && assignRoleGroups !== undefined && assignRoleGroups.length > 0 ?
                            this.createGroupListWithRadio()    
                            : null
                          }
                      </div>
                      
                    </div>
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Select Role To Assign</label>
                      <input type="text" className="gf-form-input " placeholder="search role" name="searchAssignRole" onChange={this.onSearchAssignRole} value={searchAssignRole}/>
                      <div className="m-t-1" style={{height:'100px', overflowY:'auto', border:'1px solid'}}>
                        {
                            assignRoles !== null && assignRoles !== undefined && assignRoles.length > 0 ?
                            this.createRoleListWithCheckbox()    
                            : null
                        }
                      
                      </div>
                      
                    </div>
                  </div>
                  <div className="m-t-1 text-center">
                    <button type="button" onClick={this.assignRoles} disabled={selectedGroup === null ? true : false } className="btn btn-primary border-bottom mr-1 save-btn"> Save </button>
                    <button className="btn btn-danger border-bottom save-btn" onClick={e => this.showAssign(e, false)} > Cancel </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
          <div style={{height:'350px', width:'100%', boxSizing:'border-box', display:'inline-block', verticalAlign:'middle', overflowY:'auto'}}>
            <table className="rollPermissionTable table" >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roles Assigned</th>
                  </tr>
                </thead>
                  {
                    groups !== undefined && groups !== null && groups.length > 0 ?
                    <tbody>{this.createRows(groups)}</tbody>
                    : null
                  }
            </table>
          </div>  
            
          
          
        </div>
      </div>
    );
  }
}
