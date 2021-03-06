/**
 * A simple way to open and close a popup menu.
 * @author Steven Lambert <steven.lambert@familysearch.com>
 * @team tesseract
 */
angular.module('ngSharedComponents').directive('ngPopup', ['$document', function($document) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var $popupElem = $(element).find('[data-close]'),
          events = 'mousedown keydown touchstart',
          popupCloseEvent;

      // determines when the popup menu is shown
      scope.isOpen = false;

      // add the close event to the list of events
      if ($popupElem[0]) {
        popupCloseEvent = $popupElem.attr('data-close');
      }

      /**
       * Show or hide the popup menu.
       */
      scope.togglePopup = function() {
        scope.isOpen = !scope.isOpen;

        if (scope.isOpen) {
          addEventListeners();
        }
        else {
          removeEventListener();
        }
      }

      /**
       * Close the popup menu when any listed events are fired outside of the menu.
       * @param {Event} event
       */
      function popupClickHandler(event) {
        var shouldClose = false;
        switch (event.type) {
          case 'touchstart':
          case 'mousedown':
            if ($(event.target).closest(element).length === 0) {
              shouldClose = true;
            }
            break;
          case 'keydown':
            if (event.which === 27) {
              shouldClose = true;
            }
            break;
        }

        // close the popup menu if the event matches the data-close event
        if (event.type === popupCloseEvent && $(event.target).closest($popupElem).length) {
          shouldClose = true;
        }

        if (shouldClose) {
          scope.$apply(closePopup);
        }
      }

      /**
       * Close the popup menu.
       */
      function closePopup() {
        scope.isOpen = false;
        removeEventListener();
      }

      /**
       * Add event listeners.
       */
      function addEventListeners() {
        $document.on(events, popupClickHandler);
        $popupElem.on(popupCloseEvent, popupClickHandler);
      }

      /**
       * Remove event listeners.
       */
      function removeEventListener() {
        $document.off(events, popupClickHandler);
        $popupElem.off(popupCloseEvent, popupClickHandler);
      }
    }
  };
}]);