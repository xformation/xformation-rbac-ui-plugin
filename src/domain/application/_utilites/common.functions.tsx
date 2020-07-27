import * as React from 'react';

export const commonFunctions: any = {
  getRequestOptions,
  validateEmail,
  changeTextBoxBorderToError,
  restoreTextBoxBorderToNormal,
  createSelectbox,
  changeComponentBorderToError
};

function createSelectbox(data: any, value: any, key: any, label: any) {
  let retData = [];
  if (data && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      retData.push(
        <option value={item[value]} key={item[key]}>{item[label]}</option>
      );
    }
  }
  return retData;
}

function getRequestOptions(type: any, extraHeaders: any, body?: any): any {
  let requestOptions: any = {};
  requestOptions = {
    method: type,
    headers: {
      ...extraHeaders,
    },
  };
  if (body) {
    requestOptions['body'] = body;
  }
  return requestOptions;
}

function validateEmail(emailId: any) {
  const regx = /^[A-Z0-9_'%=+!`#~$*?^{}&|-]+([\.][A-Z0-9_'%=+!`#~$*?^{}&|-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)+$/i;
  return regx.test(emailId);
}

function changeTextBoxBorderToError(textBoxValue: any, objName: any) {
  if (textBoxValue.trim() === '') {
    const obj: any = document.querySelector('#' + objName);
    obj.className = 'gf-form-input input-textbox-error';
  }
  if (objName === 'emailId') {
    const obj: any = document.querySelector('#' + objName);
    obj.className = 'gf-form-input input-textbox-error';
  }
}

function changeComponentBorderToError(objName: any) {
  const obj: any = document.querySelector('#' + objName);
  obj.className = 'gf-form-input input-textbox-error';
}

function restoreTextBoxBorderToNormal(objName: any) {
  const obj: any = document.querySelector('#' + objName);
  obj.className = 'gf-form-input';
}
