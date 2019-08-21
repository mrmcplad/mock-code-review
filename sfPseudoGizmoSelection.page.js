(function(){
   "use strict";

   /** Definition **/
   var gizmoDefinition = {
      templateUrl: "src/pseudo/gizmo/sfPseudoGizmoSelection.page.html",
      controller: Gizmo,
      bindings: {}
   };

   /** Angular 1 Boilerplate **/

   angular.module("pseudo").component("sfPseudoGizmoSelection", gizmoDefinition);

   sf.addState("pseudo.gizmo", {
     url: "/gizmo",
     template: "<sf-pseudo-gizmo-selection></sf-pseudo-gizmo-selection>",
     doNotTrack: true,
     params: {
       "newPackage": {}
     }
   });

   /** Imports **/
   Gizmo.$inject = ["$state", "sfPseudoNewPackageService", "sfPseudoPackagesService", "sfOpenDocumentService"];

   /** Class / Controller **/
   function Gizmo ($state, sfPseudoNewPackageService, sfPseudoPackagesService, sfOpenDocumentService) {
      var $ctrl = this;

      /** Private Variables **/

      /** Public Variables **/
      $ctrl.newPackage = [];

      /**  Lifecycle Hooks  **/
      $ctrl.$onInit = $onInit;
      $ctrl.$onDestroy = $onDestroy;

      /** Public Methods **/
      $ctrl.handleSelectedGizmo = handleSelectedGizmo;
      $ctrl.addGizmo = addGizmo;
      $ctrl.cancel = cancel;

      /**  Private Methods  **/

      /**  Implementation **/

      function $onInit() {
        $ctrl.newPackage = sfPseudoNewPackageService.getNewPackage();
      }

      function $onDestroy() {
        sfPseudoNewPackageService.clearNewPackage();
      }

      function handleSelectedGizmo(selectedGizmo) {
        if (!_.isUndefined(selectedGizmo)) {
            $ctrl.newPackage.gizmo = selectedGizmo.name;
        }
      }

      function addGizmo() {
        return sfPseudoPackagesService.addGizmo(
          $ctrl.newPackage.packageID,
          $ctrl.newPackage.gizmo,
          $ctrl.newPackage.pseudoID)
          .then(function (response) {
              sfOpenDocumentService.openDocument(response.newDocumentID, $ctrl.newPackage.isAwesome);
          });
      }

      function cancel() {
        $state.go('pseudo.package-list');
      }
   }
})();
