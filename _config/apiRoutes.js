const moduleName = 'notification';
const moduleVersion = 'v1';
//const baseApiUrl = `${env('BASE_URL', 'http://localhost:8000')}/api`;
//const urlBase = `${baseApiUrl}/${moduleName}/${moduleVersion}`
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
  urlBase : urlBase,
  version: moduleVersion,
  notifications : `${urlBase}/notifications`,
}
