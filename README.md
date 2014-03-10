ng-shared-components
=====================

A shared set of components that help with popup menus and modals.

Setup
======

Add the assets you want to use to your ejs file that will display the popup menu or modal:

    // required app file
    assets.js.push('ngSharedComponents.js');
    
    // popup menu
    assets.js.push('directives/ngPopup.js');
    
    // modal
    assets.js.push('directives/ngModal.js');
    assets.css.push('ngModal.css');

In your app, require the ngSharedComponents app:

    angular.module('app', ['ngSharedComponents'])

Modal Directive
===============================

A customizable modal template.

Example Usage:
--------------

Inside template:

    <ng-modal data-show="showModal" data-title="Modal Title" data-work-callback="process(buttonName, cb)" ...>
        <!-- modal contents -->
        <textarea ng-model="someVariable.text" ...></textarea>
    </ng-modal>

    <a ng-click="showModal = true" ...>Open Modal</a>

Inside controller:

    $scope.showModal = false;
    $scope.someVariable = {};  // see NOTE section for details on why you need to do this

    $scope.process = function(buttonName, cb) {
        // process the work
        console.log($scope.someVariable.text);  // outputs the contents of the textarea

        // call the callback when finished
        cb(true);
    }

Required Parameters
-------------------

**show** attribute bound to a parent scope variable (when true will show the modal)

Parameters
----------

**show** - Parent scope variable to hide and show the modal

**title** - Title of modal

**ok-button-text** - Enables the OK button and sets the OK button text

**ok-button-href** - Change href from default (javascript:void(0))

**ok-button-target** - Set the target attribute

**no-button-text** - Enables the NO button and sets the NO button text

**no-button-href** - Change the href from default (javascript:void(0))

**no-button-target** - Set the target attribute

**cancel-button-text** - Enables the CANCEL button and set the CANCEL button text

**cancel-button-href** - Change the href from default (javascript:void(0))

**cancel-button-target** - Set the target attribute

**close-button-text** - Sets the CLOSE button text

**hide-close-button** - Hides the close button (only if there is at least 1 button defined)

**hide-button-bar** - Removes the button bar (keeps close button enabled even if hide-close-button is set)

**work-callback** - Parent scope function to call when the OK and NO buttons are clicked (takes 2 params: buttonName, cb). Callback function must pass true if the modal should close after the operation, false if the modal should remain open, or an error message String to display an error.

**close-callback** - Parent scope function to call when the modal is closed

Notes
-----
This modal does not support the check box "Don't show me again" option

If you wish to use ng-model inside of the ng-modal, you **MUST** create an object variable and use a member of that variable as the ng-model value. See http://stackoverflow.com/questions/12629151/angulajs-directive-transclude-scope-false/12629786#12629786.

Popup Directive
===============================

A simple way to open and close a popup menu.

Example Usage:
--------------
    <div ng-popup ...>
        <a ng-click="togglePopup()" ...>Open Popup</a>
        <ul ng-show="isOpen" data-close="click" ...>
            <!-- menu contents -->
        </ul>
    </div>

Required Parameters
-------------------

**ng-click="togglePopup()"** on a child element that will open the popup menu

**ng-show="isOpen"** attribute on the child popup menu

Parameters
----------

**data-close** - set on the popup menu, tells the menu on what event it should close on.

Notes
-----

Any event handlers inside the popup menu cannot call stopPropagation() otherwise the data-close event will not work.
