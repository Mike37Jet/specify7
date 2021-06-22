"use strict";

const router = require('./router.js');


function appResources(type, id) {
    require.ensure(['./appresources.js'], require => {
        const appResourcesModule = require('./appresources.js');
        const idInt = parseInt(id);
        appResourcesModule[type](isNaN(idInt) ? null : idInt);
    }, 'appresources');
}

module.exports = function() {
    router.route('appresources/', 'appresources', () => appResources('appResources'));
    router.route('appresources/:id/', 'appresource', id => appResources('appResources', id));
    router.route('viewsets/', 'viewsets', () => appResources('viewSets'));
    router.route('viewsets/:id/', 'viewset', id => appResources('viewSets', id));
};
