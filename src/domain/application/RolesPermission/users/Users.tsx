import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {MessageBox} from '../../Message/MessageBox'
import { rbacSettingsServices } from '../../_services/rbacSettings.service';
import { commonFunctions } from '../../_utilites/common.functions';
import * as _ from "lodash";
// import wsCmsBackendServiceSingletonClient from '../../../../wsCmsBackendServiceClient';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Operation failed. May have some issues in services";
const SUCCESS_MESSAGE_ADDED = "New user added successfully";
const SUCCESS_MESSAGE_GROUPROLES_ASSIGNED_TO_USER = "Groups assigned successfully to the selected user";
const SUCCESS_MESSAGE_UPDATED = "User updated successfully";
const SUCCESS_MESSAGE_USER_EXPORT = "Users imported successfully";

interface RbacProps extends React.HTMLAttributes<HTMLElement> {
  isPageLoaded?: string | any;
  // user?: any;
}
export class Users extends React.Component<RbacProps, any> {
  constructor(props: RbacProps) {
    super(props);
    this.state = {
      user: new URLSearchParams(location.search).get("signedInUser"),
      branchId: null,
      academicYearId: null,
      departmentId: null,
      isPageLoaded: this.props.isPageLoaded,
      isImport: false,
      isModalOpen: false,
      isEditModalOpen: false,
      isAssignRole: false,
      users: [],
      orgUsers: [],
      assignUsers: [],
      groups: [],
      assignGroups:[],
      orgGroups: [],

      searchUser: "",
      searchGroups: "",
      email: "", 
      userName: "", 
      userPassword: "",
      errorMessage: "", 
      successMessage: "",
      selectedUser: null,
      editEmail: "",
      editUserName: "",
      editUserPassword: "",
      chkTeacher: false,
      chkStudent: false,
      chkEmployee: false,
      searchAssignUser: "",
      searchAssignGroup: "",
      selectedAssignUser: null,
      organization: "",
      editOrganization: "",
    };
    this.showImport = this.showImport.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showAssign = this.showAssign.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getAllGroups = this.getAllGroups.bind(this);
    this.createRows = this.createRows.bind(this);
    this.isMandatoryField = this.isMandatoryField.bind(this);
    this.validate = this.validate.bind(this);
    this.saveUser = this.saveUser.bind(this);
    this.onSelectUser = this.onSelectUser.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.validateEdit = this.validateEdit.bind(this);
    this.selectImportUser = this.selectImportUser.bind(this)
    // this.importUser = this.importUser.bind(this);
    this.onSearchAssignUser = this.onSearchAssignUser.bind(this);
    this.createUsersListWithRadio = this.createUsersListWithRadio.bind(this);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.createGroupsListWithCheckbox = this.createGroupsListWithCheckbox.bind(this);
    this.onChangeGroup = this.onChangeGroup.bind(this);
    this.resetGroup = this.resetGroup.bind(this);
    this.updateGroupsOfSelectedUser = this.updateGroupsOfSelectedUser.bind(this);
    this.onSearchUser = this.onSearchUser.bind(this);
    this.onSearchAssignGroup = this.onSearchAssignGroup.bind(this);
    this.assignSelectedGroupRolesToSelectedUser = this.assignSelectedGroupRolesToSelectedUser.bind(this);
    // this.registerSocket = this.registerSocket.bind(this);
  }

  async componentDidMount(){
    if(this.state.isPageLoaded === "YES"){
      await this.getAllUsers();
      await this.getAllGroups();
    }
    // this.registerSocket();
  }

  // registerSocket() {
  //   const socket = wsCmsBackendServiceSingletonClient.getInstance();

  //   socket.onmessage = (response: any) => {
  //       let message = JSON.parse(response.data);
  //       console.log("Users. message received from server ::: ", message);
  //       this.setState({
  //           branchId: message.selectedBranchId,
  //           academicYearId: message.selectedAcademicYearId,
  //           departmentId: message.selectedDepartmentId,
  //       });
  //       console.log("Users. branchId: ",this.state.branchId);
  //       console.log("Users. departmentId: ",this.state.departmentId);  
  //       console.log("Users. ayId: ",this.state.academicYearId);  
  //   }

  //   socket.onopen = () => {
  //       console.log("Users. Opening websocekt connection to cmsbackend. User : ",new URLSearchParams(location.search).get("signedInUser"));
  //       socket.send(new URLSearchParams(location.search).get("signedInUser"));
  //   }

  //   window.onbeforeunload = () => {
  //       console.log("Users. Closing websocket connection with cms backend service");
  //   }
  // }

  async getAllGroups(){
    await rbacSettingsServices.getAllRoles().then(
      response => {
        const groups: any = [];
        const orgGroups: any = [];
        const assignGroups: any = [];
        response.map( (item: any) => {
          if(item.grp ){
             groups.push(item);
             orgGroups.push(item);
             assignGroups.push(item);
          }
        });
        this.setState({
          groups: _.sortBy(groups, 'name'),
          orgGroups: _.sortBy(orgGroups, 'name'),
          assignGroups: _.sortBy(assignGroups, 'name'),
        });
      }
    );
  }

  async getAllUsers(){
    await rbacSettingsServices.getAllUsers().then(
      response => {
        let sortedArr = _.sortBy(response, 'username');
        this.setState({
          users: sortedArr,
          orgUsers: sortedArr,
          assignUsers: sortedArr,
        });
      }
    );
  }

  showAssign(e: any, aShow: boolean) {
    e && e.preventDefault();
    const {groups, assignGroups, orgUsers, orgGroups} = this.state;
    for (const i in assignGroups) {
      assignGroups[i].checked = false;
    }
    for (const i in orgGroups) {
      orgGroups[i].checked = false;
    }
    this.setState(() => ({
      isAssignRole: aShow,
      assignUsers: orgUsers,
      assignGroups: orgGroups,
      errorMessage: "",
      successMessage: "",
      selectedAssignUser: null,
      searchAssignUser: "",
      searchAssignGroup: "",
    }));
  }

  showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      isModalOpen: bShow,
      errorMessage: "",
      successMessage: "",
      email: "",
      userName: "",
      userPassword: "",
      organization: "",
    }));
  }

  showEditModal(e: any, eShow: boolean, user: any) {
    e && e.preventDefault();
    this.setState(() => ({
      isEditModalOpen: eShow,
      errorMessage: "",
      successMessage: "",
      editEmail: user !== null ? user.email : "",
      editUserName: user !== null ? user.username: "",
      editUserPassword: "",
      editOrganization: user !== null ? (user.organization !== null ? user.organization.name : null) : "",
    }));
  }

  showImport(e: any, iShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      isImport: iShow,
      errorMessage: "",
      successMessage: ""
    }));
  }

  handleStateChange(e: any) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  onSelectUser(user: any){
    this.setState({
      selectedUser: user
    });
  }

  createRows(objAry: any) {
    // console.log("createRows() Users list on user page: ", objAry);
    if(objAry === undefined || objAry === null) {
        return;
    }
    const arrLength = objAry.length;
    const retVal = [];
    
    for (let i = 0; i < arrLength; i++) {
        const obj = objAry[i];
        console.log("rback : users : ",obj);
        const roles = obj.roles;
        const roleName = [];
        let str = '';
        for(let k=0; k<roles.length; k++){
          if(roles[k].grp){
            str = str+roles[k].name+', ';
          }
        }
        roleName.push(str.substring(0, str.lastIndexOf(",")));
        retVal.push(
          <tr >
            <td>
              <input name="usreadio" type="radio" onClick={e => this.onSelectUser(obj)} id={`${obj.id}`} />&nbsp;
              {obj.username}
            </td>
            <td>
                {obj.email}
            </td>
            <td>
                {obj.organization !== null ? obj.organization.name : null}
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

  validateEdit(){
    const {editEmail, editUserName, editUserPassword, editOrganization} = this.state;
    let errorMessage = this.isMandatoryField(editEmail, "editEmail");
    // errorMessage = this.isMandatoryField(editUserName, "editUserName");
    // errorMessage = this.isMandatoryField(editUserPassword, "editUserPassword");
    errorMessage = this.isMandatoryField(editOrganization, "editOrganization");
    this.setState({
        errorMessage: errorMessage
    });
    if(errorMessage !== "") {
      return false;
    }
    return true;
  }

  validate(){
    const {email, userName, userPassword, organization} = this.state;
    let errorMessage = this.isMandatoryField(email, "email");
    errorMessage = this.isMandatoryField(userName, "userName");
    errorMessage = this.isMandatoryField(userPassword, "userPassword");
    errorMessage = this.isMandatoryField(organization, "organization");
    
    this.setState({
        errorMessage: errorMessage
    });
    if(errorMessage !== "") {
      return false;
    }
    return true;
  }

  async saveUser() {
    const {email, userName, userPassword,errorMessage, organization} = this.state;
    if(!this.validate()){
      console.log("Save user validation error : ",errorMessage);
      return;
    }
    let obj = {
      email: email,
      username: userName,
      password: userPassword,
      active: true,
      createdBy: 'APPLICATION',
      organization: organization
    }
    console.log('Save user: ', obj);
    await rbacSettingsServices.saveUser(obj)
      .then(response => {
      console.log('Save user response: ', response);
      if(response.code){
        this.setState({
          errorMessage: response.message,
        });  
      }else{
        this.setState({
          successMessage: SUCCESS_MESSAGE_ADDED,
        });
      }
      
    });
    await this.getAllUsers();
    await this.getAllGroups();
  };

  async updateUser() {
    const {editEmail, editUserName, editUserPassword,errorMessage, selectedUser, editOrganization} = this.state;
    if(!this.validateEdit()){
      console.log("User validation error : ",errorMessage);
      return;
    }
    let obj = {
      id: selectedUser.id,
      email: editEmail,
      username: editUserName,
      password: editUserPassword,
      organization: editOrganization,
    }
    console.log('Update user: ', obj);
    await rbacSettingsServices.updateUser(obj).then(response => {
      console.log('Update user response: ', response);
      if(response.code){
        this.setState({
          errorMessage: response.message,
        });  
      }else{
        this.setState({
          successMessage: SUCCESS_MESSAGE_UPDATED,
        });
      }
      
    });
    await this.getAllUsers();
    await this.getAllGroups();
  };

  selectImportUser(e: any){
    const {name, checked} = e.target;
    console.log("name : "+name+", value :"+checked);
    this.setState({
      [name]: checked,
    });
  }

  // async importUser () {
  //   const {branchId, chkStudent, chkTeacher, chkEmployee} = this.state;
  //   this.setState({
  //     errorMessage: ""
  //   });
  //   if (chkTeacher === false && chkStudent === false && chkEmployee === false) {
  //     this.setState({
  //       errorMessage: "Please select at least one checkbox"
  //     });
  //     return;
  //   }
  //   await rbacSettingsServices.importUser(chkTeacher, chkStudent, chkEmployee, branchId)
  //   .then(response => {
  //     console.log('User import response: ', response);
  //     if(response === 200 || response === 201){
  //       this.setState({
  //         successMessage: SUCCESS_MESSAGE_USER_EXPORT,
  //       });
  //     }else{ 
  //       this.setState({
  //         errorMessage: ERROR_MESSAGE_SERVER_SIDE_ERROR,
  //       });
  //     }
  //   });
  // }

  onSearchAssignUser(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    if (name === "searchAssignUser") {
        let result = [];
        const { assignUsers, orgUsers } = this.state; 
        if (value !== "") {
            if (assignUsers && assignUsers.length > 0) {
                for (let i = 0; i < assignUsers.length; i++) {
                    let prm = assignUsers[i];
                    if(prm !== null && prm !== undefined && prm !== "" && prm.username !== null && 
                        prm.username !== undefined ){
                      let name = prm.username.toLowerCase();
                      if (name.indexOf(value.toLowerCase()) !== -1) {
                          result.push(prm);
                      }
                    }
                    
                }
                this.setState({
                  assignUsers: result
                }); 
            }
        } else {
            this.setState({
              assignUsers: orgUsers
            });        
        }
    }
  }

  createUsersListWithRadio(){
    const {assignUsers} = this.state;
    const arrLength = assignUsers.length;
    const retVal = [];
    
      for (let i = 0; i < arrLength; i++) {
        const obj = assignUsers[i];
        retVal.push(
            <div>
              <input type="radio" onClick={e => this.onChangeUser(obj)} name="userradio" id={`${obj.id}assign`} className="m-l-1" />&nbsp;
              {obj.username}
            </div>
        );
      }
    return retVal;
  }

  onChangeUser(user: any){
    this.setState({
      selectedAssignUser: user
    });
    const {groups} = this.state;
    for (const i in groups) {
      groups[i].checked = false;
    }
    for (const i in user.roles) {
      const role = user.roles[i];
      for (const j in groups) {
        // const scopeGroup = groups[j];
        if (groups[j].id === role.id) {
          groups[j].checked = true;
          break;
        }
      }
    }
    this.setState({
      groups: groups,
      // selectedGroup: group,
    });
  }

  async onChangeGroup(e: any, selectedGroupRole: any){
    await this.resetGroup(selectedGroupRole);
    await this.updateGroupsOfSelectedUser(selectedGroupRole);
  }

  async updateGroupsOfSelectedUser(selectedGroupRole: any){
    const {selectedAssignUser, assignGroups} = this.state;
    if(selectedAssignUser){
      let selectedRoleindex: any = -1;
      selectedAssignUser.roles.map( (userRole: any, index: any) => {
        if(userRole.id === selectedGroupRole.id){
          selectedRoleindex = index;
        }
      });

      if (selectedGroupRole.checked) {
        selectedAssignUser.roles.push(selectedGroupRole);
      } else {
        selectedAssignUser.roles.splice(selectedRoleindex, 1);
      }
      this.setState({
        selectedAssignUser: selectedAssignUser
      });
    }
  }

  async resetGroup(groupRole: any){
    const {assignGroups} = this.state;
     for (const i in assignGroups) {
      if (assignGroups[i].id === groupRole.id) {
        assignGroups[i].checked = !groupRole.checked;
        break;
      }
    }
    this.setState({
      assignGroups: assignGroups
    });
  }

  createGroupsListWithCheckbox(){
    const {assignGroups} = this.state;
    const arrLength = assignGroups.length;
    const retVal = [];
    
      for (let i = 0; i < arrLength; i++) {
        const obj = assignGroups[i];
        retVal.push(
            <div>
              <input type="checkbox" id={`${obj.id}`}  onChange={e => this.onChangeGroup(e, obj)} checked={obj.checked} className="m-l-1"/>&nbsp;
              {obj.name}
            </div>
        );
      }
    return retVal;
  }

  onSearchUser(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    if (name === "searchUser") {
        let result = [];
        const { users, orgUsers } = this.state;
        if (value !== "") {
            if (users && users.length > 0) {
                for (let i = 0; i < users.length; i++) {
                    const roles = users[i].roles;
                    let str = '';
                    for(let k=0; k<roles.length; k++){
                      if(roles[k].grp){
                        str = str+roles[k].name+', ';
                      }
                    }
                    let prm = users[i];
                    let name = prm.username+ " " + prm.email + " " + str; ;
                    name = name.toLowerCase();
                    if (name.indexOf(value.toLowerCase()) !== -1) {
                        result.push(prm);
                    }
                }
                this.setState({
                    users: result
                });
            }
        } else {
          this.setState({
              users: orgUsers
          });
        }
    }
  }

  onSearchAssignGroup(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    // if (name === "searchAssignGroup") {
        let result = [];
        const { assignGroups, orgGroups } = this.state;
        if (value !== "") {
            if (assignGroups && assignGroups.length > 0) {
                for (let i = 0; i < assignGroups.length; i++) {
                    let prm = assignGroups[i];
                    let name = prm.name ;
                    name = name.toLowerCase();
                    if (name.indexOf(value.toLowerCase()) !== -1) {
                        result.push(prm);
                    }
                }
                this.setState({
                  assignGroups: result
                });
                
            }
        } else {
            this.setState({
              assignGroups: orgGroups
            });
        }
    // }
  }

  async assignSelectedGroupRolesToSelectedUser(){
    const {selectedAssignUser, assignGroups} = this.state;
    
    // let obj = {
    //   id: selectedUser.id,
    //   email: editEmail,
    //   username: editUserName,
    //   password: editUserPassword,
    // }
    console.log('Rbac AssignedGroups-> ', assignGroups);
    // await rbacSettingsServices.updateUser(selectedAssignUser).then(response => {
    //   console.log('Update user roles response: ', response);
    //   this.setState({
    //     successMessage: SUCCESS_MESSAGE_GROUPROLES_ASSIGNED_TO_USER,
    //   });
    // });
    
    // await this.getAllUsers();
    // await this.getAllGroups();
  }

  render() {
    const {errorMessage, successMessage, isModalOpen, isAssignRole, isImport, users, orgUsers, assignUsers, groups, email, userName, userPassword,
      selectedUser, isEditModalOpen, editEmail, editUserName, editUserPassword, searchAssignUser, assignGroups, 
      searchUser, searchAssignGroup, selectedAssignUser, organization, editOrganization} = this.state;
    return (
      <div className="info-container">
        <div className="border p-1 pb-2">
          <div className="m-b-1" style={{float: 'right'}}>
            {/* <button className="btn btn-primary mr-1 import-user-btn" onClick={e => this.showImport(e, true)}  >
              <i className="fa fa-plus-circle" /> Import User
            </button> */}
            <button className="btn btn-primary mr-1 add-user-btn" onClick={e => this.showModal(e, true)}  >
              <i className="fa fa-plus-circle" /> Add User
            </button>
            <button className="btn btn-primary mr-1 edit-user-btn" onClick={e => this.showEditModal(e, true, selectedUser)} disabled={selectedUser === null ? true : false } >
              Edit User
            </button>
            <button className="btn btn-primary mr-1 assign-group-btn" onClick={e => this.showAssign(e, true)} >
              <i className="fa fa-plus-circle" /> Assign Group
            </button>
            <input type="text" className="searchInput" placeholder="search user" name="searchUser" onChange={this.onSearchUser} value={searchUser}/>
          </div>
          {/* <Modal isOpen={isImport} className="react-strap-modal-container">
            <ModalHeader className="add-new-permission-header">Import User</ModalHeader>
            <ModalBody className="modal-content">
              <form className="">
                <div className="fwidth-modal-text fwidth m-r-1">
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
                  <div className="fwidth-modal-text">
                    <label  className="add-permission-label">Import from CMS</label>
                    <input type="checkbox" id="chkTeacher" name="chkTeacher" onChange={this.selectImportUser} />&nbsp;&nbsp;Teacher&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" id="chkStudent" name="chkStudent" onChange={this.selectImportUser} />Student&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="checkbox" id="chkEmployee" name="chkEmployee" onChange={this.selectImportUser} />Employee&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
				
                  <div className="m-t-1 text-center">
                    <button type="button" onClick={this.importUser} className="btn btn-primary border-bottom mr-1 save-btn" > Import </button>
                    <button className="btn btn-danger border-bottom mr-1 save-btn" onClick={e => this.showImport(e, false)} > Cancel </button>
                  </div>

                </div>
              </form>
            </ModalBody> 
          </Modal>*/}

          <Modal isOpen={isModalOpen} className="react-strap-modal-container">
            <ModalHeader className="add-new-permission-header">Add New User</ModalHeader>
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
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Login Id </label>
                      <input type="text" name="userName" id="userName" value={userName} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter Your Username" />
                    </div>
                  </div>
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Email</label>
                      <input type="text" name="email" id="email" value={email} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter Your Email" />
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Password</label>
                      <input type="password" name="userPassword" id="userPassword" value={userPassword} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter Your Password" />
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Organization</label>
                      <input type="text" name="organization" id="organization" value={organization} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter Your Organization" />
                    </div>
                  </div>
                  <div className="m-t-1 text-center">
                    <button type="button" className="btn btn-primary border-bottom mr-1border-bottom mr-1 save-btn" onClick={this.saveUser}> Save </button>
                    <button className="btn btn-danger border-bottom mr-1 save-btn" onClick={e => this.showModal(e, false)} > Cancel </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
          
          <Modal isOpen={isEditModalOpen} className="react-strap-modal-container">
            <ModalHeader className="add-new-permission-header">Edit User</ModalHeader>
            <ModalBody className="modal-content">
              <form>
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
                    <div  className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Login Id </label>
                      <input type="text" disabled={true} name="editUserName" id="editUserName" value={editUserName} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter your user name" />
                    </div>
                  </div>
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Email</label>
                      <input type="text" name="editEmail" id="editEmail" value={editEmail} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter your email" />
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Password</label>
                      <input type="password" name="editUserPassword" id="editUserPassword" value={editUserPassword} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter your password" />
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Organization</label>
                      <input type="text" name="editOrganization" id="editOrganization" value={editOrganization} onChange={this.handleStateChange} maxLength={255} className="gf-form-input " placeholder="Enter your organization" />
                    </div>
                  </div>

                  <div className="m-t-1 text-center">
                    <button type="button" className="btn btn-primary border-bottom mr-1 save-btn" onClick={this.updateUser}> Save </button>
                    <button className="btn btn-danger border-bottom mr-1 save-btn" onClick={e => this.showEditModal(e, false, null)} > Cancel </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>

          <Modal isOpen={isAssignRole} className="react-strap-modal-container">
            <ModalHeader  className="add-new-permission-header">Assign Groups To Selected User</ModalHeader>
            <ModalBody className="modal-content">
            <form >
                <div className="modal-fwidth">
                  {
                      errorMessage !== ""  ?  <MessageBox id="mbox" message={errorMessage} activeTab={2}/> : null
                  }
                  {
                      successMessage !== ""  ? <MessageBox id="mbox" message={successMessage} activeTab={1}/> : null
                  }
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text fwidth m-r-1"  >
                      <label className="add-permission-label">Select User</label>
                      <input type="text" className="gf-form-input " placeholder="search user" name="searchAssignUser" onChange={this.onSearchAssignUser} value={searchAssignUser}/>
                      <div className="m-t-1" style={{height:'100px', overflowY:'auto', border:'1px solid'}}>
                          {
                            assignUsers !== null && assignUsers !== undefined && assignUsers.length > 0 ?
                            this.createUsersListWithRadio()    
                            : null
                          }
                      </div>
                      
                    </div>
                    <div className="fwidth-modal-text fwidth m-r-1">
                      <label className="add-permission-label">Select Group To Assign</label>
                      <input type="text" className="gf-form-input " placeholder="search group" name="searchAssignGroup" onChange={this.onSearchAssignGroup} value={searchAssignGroup}/>
                      <div className="m-t-1" style={{height:'100px', overflowY:'auto', border:'1px solid'}}>
                        {
                            assignGroups !== null && assignGroups !== undefined && assignGroups.length > 0 ?
                            this.createGroupsListWithCheckbox()    
                            : null
                        }
                      
                      </div>
                      
                    </div>
                  </div>
                  <div className="m-t-1 text-center">
                    {/* <button type="button" onClick={this.assignUsersToGroups} disabled={selectedAssignUser === null ? true : false } className="btn btn-primary border-bottom mr-1"> Save </button> */}
                    <button type="button" onClick={this.assignSelectedGroupRolesToSelectedUser} disabled={selectedAssignUser === null ? true : false } className="btn btn-primary border-bottom mr-1 save-btn"> Save </button>
                    <button className="btn btn-danger border-bottom" onClick={e => this.showAssign(e, false)} > Cancel </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
          <div style={{height:'350px', width:'100%', boxSizing:'border-box', display:'inline-block', verticalAlign:'middle', overflowY:'auto'}}>
            <table className="rollPermissionTable table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Organization</th>
                  <th>Role Groups Assigned To Users</th>
                </tr>
              </thead>
              {
                users !== undefined && users !== null && users.length > 0 ?
                <tbody>{this.createRows(users)}</tbody>
                : null
              }
            </table>
          </div>
        </div>
      </div>
    );
  }
}
