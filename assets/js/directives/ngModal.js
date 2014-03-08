/**
 * A customizable modal template.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tesseract
 */
angular.module('ngSharedComponents').directive('ngModal', ['$document', function($document) {
    return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      workCallback: '&',
      closeCallback: '&',
      show: '='
    },
    link: function(scope, element, attrs) {
      var events = 'keydown',
          toString = Object.prototype.toString,
          $container = element.find('.ng-modal-container'),
          $header = $container.find('.ng-modal-header'),
          $closeButton = $container.find('.ng-close-button'),
          $errorMsg = $container.find('.ng-modal-error'),
          $buttonBar = $container.find('.ng-modal-button-bar'),
          $okButton = $buttonBar.find('.ng-ok-button'),
          $noButton = $buttonBar.find('.ng-no-button'),
          $cancelButton = $buttonBar.find('.ng-cancel-button');

      // display an error message when set to true
      scope.hasError = false;

      // set title
      $header.html(attrs.title);

      // remove the button bar if no buttons are defined
      if (attrs.okButtonText === undefined && attrs.noButtonText === undefined &&
          attrs.cancelButtonText === undefined || attrs.hideButtonBar !== undefined) {
        $buttonBar.remove();
        $closeButton.html(attrs.closeButtonText);
      }
      else {
        // only remove the close button if we didn't remove the button bar
        if (attrs.hideCloseButton !== undefined) {
          $closeButton.remove();
        }
        else {
          $closeButton.html(attrs.closeButtonText);
        }

        // set up ok button
        if (attrs.okButtonText === undefined) {
          $okButton.remove();
        }
        else {
          buildButton($okButton, attrs.okButtonText, attrs.okButtonHref, attrs.okButtonTarget);
        }

        // set up no button
        if (attrs.noButtonText === undefined) {
          $noButton.remove();
        }
        else {
          buildButton($noButton, attrs.noButtonText, attrs.noButtonHref, attrs.noButtonTarget);
        }

        // set up cancel button
        if (attrs.cancelButtonText === undefined) {
          $cancelButton.remove();
        }
        else {
          buildButton($cancelButton, attrs.cancelButtonText, attrs.cancelButtonHref, attrs.cancelButtonTarget);
        }
      }

      /*
       * Angularjs automatically makes workCallback and closeCallback functions even if no
       * functions were passed as data attributes. To know if we need to call a work or close
       * callback, we need to check for the existence of the data attributes.
       */
      scope.workCallbackFunc = attrs.workCallback;
      scope.closeCallbackFunc = attrs.closeCallback;

      /**
       * Set up a button's text and attributes.
       * @param {jQuery DOM} $button
       * @param {string} text
       * @param {string} [href]
       * @param {string} [target]
       */
      function buildButton($button, text, href, target) {
        $button.html(text);
        $button.attr('href', href);
        $button.attr('target', target);
      }

      /**
       * Open and close the modal when the show variable changes.
       */
      scope.$watch('show', function(newValue) {
        if (newValue) {
          scope.openModal();
        } else {
          scope.closeModal();
        }
      });

      /**
       * Open the modal.
       */
      scope.openModal = function() {
        scope.show = true;
        addEventListeners();
      };

      /**
       * Close the modal and call the close callback if it was set.
       * @param {string} butonName - The name of the button that was clicked.
       */
      scope.closeModal = function(buttonName) {
        scope.show = false;
        removeEventListeners();

        if (scope.closeCallbackFunc) {
          try { scope.closeCallback({buttonName: buttonName}); }
          catch (ex) {
            FS.error((ex instanceof Error)?ex.message:ex);
          }
        }
      };

      /**
       * Call the work callback if it was set when the OK and NO buttons are clicked.
       * @param {string} butonName - The name of the button that was clicked.
       */
      scope.buttonClickHandler = function(buttonName) {
        if (scope.workCallbackFunc) {
          // show the working spinner
          $okButton.attr('disabled', 'disabled');
          $noButton.attr('disabled', 'disabled');
          $buttonBar.addClass('working');

          try {
            scope.workCallback({
              buttonName: buttonName,
              cb: function(result) {
                finishWorkCallback(result, buttonName);
              }});
          }
          catch (ex) {
            FS.error((ex instanceof Error) ? ex.message : ex);
          }
        }
        else {
          scope.closeModal(buttonName);
        }
      };

      /**
       * Close the modal or display any errors.
       * @param {(boolean|string)} result - True if the modal should close, false if it should stay open, or an error string to be displayed.
       * @param {string}           butonName - The name of the button that was clicked.
       */
      function finishWorkCallback(result, buttonName) {
        // hide the working spinner
        $okButton.removeAttr('disabled');
        $noButton.removeAttr('disabled');
        $buttonBar.removeClass('working');

        if (result === true) {
          scope.closeModal(buttonName);
        }
        else if (toString.call(result) === '[object String]'){
          showError(result);
        }
      }

      /**
       * Close the modal with the esc key.
       * @param {Event} event
       */
      function modalEventHandler(event) {
        var buttonName = false;
        switch (event.type) {
          case 'keydown':
            if (event.which === 27) {
              buttonName = 'cancel';
            }
            break;
        }

        if (buttonName) {
          scope.$apply(function() {
            scope.closeModal(buttonName);
          });
        }
      }

      /**
       * Display an error message.
       * @param {string} errorMsg - The error to be displayed.
       */
      function showError(errorMsg) {
        $errorMsg.html(errorMsg);
        scope.hasError = !!errorMsg;
      }

      /**
       * Add event listeners.
       */
      function addEventListeners() {
        $document.on(events, modalEventHandler);
      }

      /**
       * Remove event listeners.
       */
      function removeEventListeners() {
        $document.off(events, modalEventHandler);
      }
    },
    template: '<div class="ng-modal" ng-show="show">' +
                '<div class="ng-modal-overlay"></div>' +
                '<div class="ng-modal-container">' +
                  '<h2 class="ng-modal-header"></h2>' +
                  '<a class="ng-close-button fs-icon-after-close" href="javascript:void(0);" ng-click="closeModal(\'close\')"></a>' +
                  '<div class="ng-modal-body">' +
                    '<div ng-transclude></div>' +
                    '<p class="ng-modal-error" ng-show="hasError"></p>' +
                  '</div>' +
                  '<div class="ng-modal-button-bar">' +
                    '<div class="ng-modal-buttons">' +
                      '<a href="javascript:void(0);" class="ng-ok-button button" ng-click="buttonClickHandler(\'ok\')"></a>' +
                      '<a href="javascript:void(0);" class="ng-no-button button" ng-click="buttonClickHandler(\'no\')"></a>' +
                      '<a href="javascript:void(0);" class="ng-cancel-button" ng-click="closeModal(\'cancel\')"></a>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>'
  };
}]);