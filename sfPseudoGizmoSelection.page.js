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
   Gizmo.$inject = ["$state", "sfPseudoNewPackageService", "sfPseudoPackagesService", "sfPseudoGizmoService", "sfOpenDocumentService"];

   /** Class / Controller **/
   function Gizmo ($state, sfPseudoNewPackageService, sfPseudoPackagesService, sfOpenDocumentService, sfPseudoGizmoService) {
      var $ctrl = this;

      /** Private Variables **/
      // Randomized List (the list has been randomized)
      this._RL = false;

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
      $ctrl.randomizeGizmos = randomizeGizmos;
      $ctrl._verifyPseudoID = _verifyPseudoID;

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

      function randomizeGizmos(pseudoID) {
        // if pseudoID is verified:
        if ($ctrl._verifyPseudoID(pseudoID)) {
          // call randomizeGizmos on the service
          sfPseudoGizmoService.randomizeGizmos(pseudoID).then(
            // after it's done, then set _RL to true
            $ctrl._RL = true;
          );
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

      function _verifyPseudoID(pseudoID) {
        sfPseudoGizmoService.isValid(pseudoID);
      }
   }
})();
