export class ConfigCtrl {
    static templateUrl = 'partials/config.html';
    /** @ngInject */
    $q: any;
    enabled: any;
    appEditCtrl: any;
    appModel?: any;
    constructor($scope:any, $injector:any, $q:any) {
        this.$q = $q;
        this.enabled = false;
        this.appEditCtrl.setPostUpdateHook(this.postUpdate.bind(this));
    }

    postUpdate() {
        if (!this.appModel.enabled) {
            return;
        }

        // TODO, whatever you want
        console.log('Post Update:', this);
    }
}