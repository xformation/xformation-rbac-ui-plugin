import * as React from 'react';
import './tree.css';


class Tree<T = {[data: string]: any}> extends React.Component<any, any> {
  
  constructor(props: any) {
    super(props);
    this.state = {
      checked: [],
      expanded: [],
      nodes: props.data
    };
  }

  onChangeChildCheckbox(parentIndex: any, childIndex: any, e: any) {
    const { checked } = e.target;
    const { nodes } = this.state;
    const parent = nodes[parentIndex];
    const child = parent.children[childIndex];
    child.checked = checked;
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i].checked && checked) {
        parent.checked = checked;
      } else {
        parent.checked = false;
      }
    }
    this.setState({
      nodes
    });
  }

  onChangeParentCheckbox(parentId: any, e: any) {
    const { checked } = e.target;
    const { nodes } = this.state;
    const parent = nodes[parentId];
    for (let i = 0; i < parent.children.length; i++) {
      parent.children[i].checked = checked;
    }
    parent.checked = checked;
    this.setState({
      nodes
    });
  }
  onClickCollapseExpand(parentIndex: any, e: any){
    const { nodes } = this.state;
    nodes[parentIndex].collpsed = !nodes[parentIndex].collpsed;
    this.setState({
      nodes
    });
  }

  createNodes(nodes: any) {
    const length = nodes.length;
    const retData = [];
    for (let i = 0; i < length; i++) {
      let parent = nodes[i];
      let child = [];
      for (let j = 0; j < parent.children.length; j++) {
        child.push(<li style={{listStyleType:'none', paddingLeft:'40px'}}><input type="checkbox" checked={parent.children[j].checked} onChange={e => this.onChangeChildCheckbox(i, j, e)} />{parent.children[j].name}</li>);
      }
      retData.push(
        <div className="parent-node">
          <button className="collapse-expand-btn" onClick={e=>this.onClickCollapseExpand(i, e)}>{parent.collpsed ? '+' : '-'}</button><input type="checkbox" checked={parent.checked} onChange={e => this.onChangeParentCheckbox(i, e)} />
          {parent.name}
          {!parent.collpsed &&
            <ul>
              {child}
            </ul>
          }
        </div>

      );
    }
    return retData;
  }

  render() {
    const { nodes } = this.state;
    return (
      <div>
        {this.createNodes(nodes)}
      </div>

    );
  }
}

export default Tree;
