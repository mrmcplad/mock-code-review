describe("sfPseudoGizmoSelectionPage", function () {

    var $stateMock,
        sfPseudoNewPackageServiceMock,
        sfPseudoPackagesServiceMock,
        sfOpenDocumentServiceMock,
        sfPseudoGizmoServiceMock;

    var $componentController,
        $rootScope,
        $q;

    beforeEach(module("pseudo"));

    beforeEach(function () {
        $stateMock = jasmine.createSpyObj("$stateMock", ["go"]);
        sfPseudoNewPackageServiceMock = jasmine.createSpyObj("sfPseudoNewPackageService", ["getNewPackage", "clearNewPackage"]);
        sfPseudoPackagesServiceMock = jasmine.createSpyObj("sfPseudoPackagesService", ["addGizmo"]);
        sfOpenDocumentServiceMock = jasmine.createSpyObj("sfOpenDocumentService", ["openDocument"]);
        sfPseudoGizmoServiceMock = jasmine.createSpyObj("sfPseudoGizmoService", ["randomizeGizmos", "isValid"]);
    });

    beforeEach(inject(function($injector) {
        $componentController = $injector.get("$componentController");
        $q = $injector.get("$q");
        $rootScope = $injector.get("$rootScope");
    }));

    function createComponent(bindings) {
        return $componentController("sfPseudoGizmoSelection", {
            $state: $stateMock,
            sfPseudoNewPackageService: sfPseudoNewPackageServiceMock,
            sfPseudoPackagesService: sfPseudoPackagesServiceMock,
            sfOpenDocumentService: sfOpenDocumentServiceMock,
            sfPseudoGizmoService: sfPseudoGizmoServiceMock
        }, bindings || {});
    }

    describe("function: $onInit", function () {
        var component;

        beforeEach(function () {
            component = createComponent();
        });

        it("should call getNewPackage", function () {
            component.$onInit();

            expect(sfPseudoNewPackageServiceMock.getNewPackage).toHaveBeenCalled();
        });
    });

    describe("function: $onDestroy", function () {
        var component;

        beforeEach(function () {
            component = createComponent();
        });

        it("should call clearNewPackage", function () {
            component.$onDestroy();

            expect(sfPseudoNewPackageServiceMock.clearNewPackage).toHaveBeenCalled();
        });
    });

    describe("function: handleSelectedGizmo", function () {
        var component,
            selection;

        beforeEach(function() {
            component = createComponent();

            component.newPackage = {
                gizmo: ""
            };
            selection = { name: "Fidget Spinner" };
        });

        it("should assign the name to gizmo", function () {
            component.handleSelectedGizmo(selection);

            expect(component.newPackage.gizmo).toEqual("Fidget Spinner");
        });

        it("should leave the gizmo unchanged if the selection is undefined", function () {
            selection = undefined;

            component.handleSelectedGizmo(selection);

            expect(component.newPackage.gizmo).toEqual("");
        });
    });

    describe("function: randomizeGizmos", function () {
        var component, pseudoID, randomizeGizmosDeferred;

        beforeEach(function() {
            component = createComponent();

            randomizeGizmosDeferred = $q.defer();
            sfPseudoGizmoServiceMock.randomizeGizmos.and.returnValue(randomizeGizmosDeferred.promise);
            pseudoID = "0987";
            spyOn(component, "_verifyPseudoID").and.returnValue(true);
        });

        it("should call _verifyPseudoID", function () {
            component.randomizeGizmos(pseudoID);

            expect(component._verifyPseudoID).toHaveBeenCalledWith("0978");
        });

        it("should call randomizeGizmos", function () {
            component.randomizeGizmos(pseudoID);

            expect(sfPseudoGizmoServiceMock.randomizeGizmos).toHaveBeenCalledWith(pseudoID);
        });

        it("should set _RL to true after the service call finishes", function () {
            component._RL = false;
            component.randomizeGizmos(pseudoID);

            $rootScope.$digest();

            expect(component._RL).toBe(true);
        });

    });

    describe("function: addGizmo", function () {
        var component, openDocumentDeferred, mockOpenDocumentResponse;

        beforeEach(function () {
            component = createComponent();
            openDocumentDeferred = $q.defer();
            mockOpenDocumentResponse = {
                newDocumentID: "06E612C0-2B33-89C6-FC52-696B05C1B442"
            };
            component.newPackage = {
                isAwesome: true,
                packageID: "1AE1CD70-023A-D883-F172-919D56B51094",
                gizmo: "Fidget Spinner",
                pseudoID: "0987"
            };
            sfPseudoPackagesServiceMock.addGizmo.and.returnValue(openDocumentDeferred.promise);
        });

        it("should call addGizmo", function () {
            component.addGizmo();

            expect(sfPseudoPackagesServiceMock.addGizmo).toHaveBeenCalledWith(
                    "1AE1CD70-023A-D883-F172-919D56B51094",
                    "Fidget Spinner",
                    "0987");
        });

        it("should call openDocument", function () {

            component.addGizmo();
            openDocumentDeferred.resolve(mockOpenDocumentResponse);
            $rootScope.$digest();

            expect(sfOpenDocumentServiceMock.openDocument).toHaveBeenCalledWith("06E612C0-2B33-89C6-FC52-696B05C1B442", true);
        });
    });

    describe("function: cancel", function () {
        var component;

        beforeEach(function () {
            component = createComponent();
        });

        it("should call go", function () {
            component.cancel();

            expect($stateMock.go).toHaveBeenCalledWith("pseudo.package-list");
        });
    });

    describe('function: _verifyPseudoID', function () {
        var component;

        beforeEach(function () {
            component = createComponent();
        });

        it('should call isValid on the service', function () {
            component._verifyPseudoID(pseudoID);

            expect(sfPseudoGizmoServiceMock.isValid).toHaveBeenCalled();
        })
    })
});
