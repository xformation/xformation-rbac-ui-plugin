const IP = '100.64.108.25';
// const IP = 'localhost';
const secSrvUrl = 'http://' + IP + ':8094';
// const preferenceRestUrl = 'http://' + IP + ':9091/api';
// const backendRestUrl = 'http://' + IP + ':8080/api';
// const jcrRestUrl = 'http://' + IP + ':8093/oakRepo';

// const graphqlUrl = 'http://' + IP + ':9091';
// const loggedInUserUrl = 'http://' + IP + ':3000';
// const webSockWithCmsBackendUrl = 'ws://' + IP + ':4000/websocket/tracker/websocket';

export const config = {
  // GRAPHQL_URL: graphqlUrl + '/graphql',
  // LOGGED_IN_USER_URL: loggedInUserUrl + '/api/user',
  // WEB_SOCKET_URL_WITH_CMS_BACKEND: webSockWithCmsBackendUrl,
  // PAYMENT_GATEWAY_URL: 'https://uat.billdesk.com/pgidsk/PGIMerchantPayment',
  // COLLEGE_URL: preferenceRestUrl + '/cmscollege',
  // STATES_URL: preferenceRestUrl + '/states',
  // CITIES_URL: preferenceRestUrl + '/cities',
  // LECTURES_URL: preferenceRestUrl + '/cmslectures',
  // CMS_TERM_BY_ACYEAR_URL: preferenceRestUrl + '/cmsterms-by_academicyearid',
  // CMS_BATCH_BY_DEPARTMENT_URL: preferenceRestUrl + '/cmsbatches-departmentid/',
  // CMS_ACADEMICYEAR_URL: preferenceRestUrl + '/cmsacademic-years/',
  // CMS_SECTION_BY_BATCH_URL: preferenceRestUrl + '/cmssections-batchid/',
  // CMS_SUBJECT_BY_DEPARTMENT_URL: preferenceRestUrl + '/cmssubjects-bydepartmentid',
  // CMS_TEACHER_BY_FILTER_PARAM_URL: preferenceRestUrl + '/cmsteachers-qryprms',
  // CMS_AM_BY_DEPARTMENT_URL: preferenceRestUrl + '/cmsattendance-masters-bydepartmentid',
  // CMS_UPLOAD_MASTER_DATA_URL: preferenceRestUrl + '/cmsdataimport',
  // MS_ACCESS_TOKEN_URL: preferenceRestUrl + '/cms-ms-authenticate',
  // EXPORT_USER: preferenceRestUrl + '/cmsuserexport',
  // PAYMENT_MSG_URL: preferenceRestUrl + '/cmspayment',
  // CMS_SAVE_CLOUD_CONTEXT_PATH: jcrRestUrl + '/saveCloudContext',
  // CMS_GET_CLOUD_CONTEXT_PATH: jcrRestUrl + '/listCloudContext',
  // CMS_SAVE_CLOUD_PROVIDER_CONFIG: jcrRestUrl + '/saveCloudProviderConfig',
  // CMS_GET_CLOUD_PROVIDER_CONFIG: jcrRestUrl + '/listCloudProviderConfig',

  // CMS_GLOBAL_CONFIG_URL: backendRestUrl + '/cmssettings',
  // CMS_LECTURE_URL: backendRestUrl + '/cmslectures',
  // CMS_UI_MODULES_GET: backendRestUrl + '/cmsmodules',

  PERMS_LIST_ALL: secSrvUrl + '/security/permissions/listAll',
  PERMS_CREATE: secSrvUrl + '/security/permissions/create',
  ROLES_LIST_ALL: secSrvUrl + '/security/roles/listAll',
  ROLES_CREATE: secSrvUrl + '/security/roles/create',
  USERS_LIST_ALL: secSrvUrl + '/security/users/listAll',
  USERS_CREATE: secSrvUrl + '/security/users/create',
  USERS_UPDATE: secSrvUrl + '/security/users/update',
  USERS_GET: secSrvUrl + '/security/users/',
  PARENT_NAME: 'xformation-rbac-ui-plugin',

  // LABEL_COLLEGE_SETTINGS: 'College Settings',
  // LABEL_ACADEMIC_SETTINGS: 'Academic Settings',
  LABEL_ROLES_AND_PERMISSIONS: 'Roles & Permissions',
};
