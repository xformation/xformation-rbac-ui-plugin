import * as React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import {FaCog} from 'react-icons/fa';
import RolesPermission from './RolesPermission';
import Rbac from '../application/RolesPermission/rbac/Rbac';

export default class TabPage extends React.Component<any, any> {
  LOGGED_IN_USER = new URLSearchParams(location.search).get('signedInUser');
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
      permissions: [],
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const {activeTab} = this.state;
    return (
      <section className="tab-container">
        <div className="pref p-1 m-l-1 m-t-1">
          <h5> RBAC - Role Based Access Control </h5>
        </div>
        {/* <Rbac childName={'Roles & Permissions'}> */}
          <Nav tabs className="pl-3 pl-3 mb-4 mt-4 bottom-box-shadow">
            <NavItem className="cursor-pointer">
              <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                {'Roles & Permissions'}
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab} className="border-right">
            <TabPane tabId={0}>
                {
                  activeTab === 0 && <RolesPermission  />
                }
              </TabPane>
          </TabContent>
        {/* </Rbac> */}

        
      </section>
    );
  }
}
