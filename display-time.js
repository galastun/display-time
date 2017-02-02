const dt = angular.module('display-time', []);

dt.directive('displayTime', function($timeout) {
  return {
        scope: {
          military: "@?",
          date: "@?",
          timezone: "@?"
        },
        restrict: 'E',
        template: "<span>{{ display.time }}</span>",
        controller: DisplayTime,
        controllerAs: 'display'
    };
  
   function DisplayTime($scope) {
      const vm = this,
            delay = 500;
      let dateString = '',
          timeOut = undefined,
          months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          settings = {
            military: (angular.isDefined($scope.military)) ? toBool($scope.military) : false,
            time: true,
            date: (angular.isDefined($scope.date)) ? toBool($scope) : true,
            timezone: (angular.isDefined($scope.timezone)) ? $scope.timezone : 'local'
          };
     
      getTime();
     
     /**
       * Main method for getting the time string and displaying it
       * constantly
       *
       * @private
       * @method getTime
       * @return string
       */
      function getTime() {
        dateString = "";
        if(settings.date) {
          dateString += getDateString();
        }

        if(settings.time) {
          dateString += " " + getTimeString();
        }

        vm.time = dateString;
        $timeout(getTime, delay);
      }

      /**
       * Gets the time in a string. (hh:mm:ss)
       *
       * @private
       * @method getTimeString
       * @return string
       */
      function getTimeString() {
        var currentTime = new _Date(),
            hours = formatHour(currentTime.getHours()),
            minutes = addZero(currentTime.getMinutes()),
            seconds = addZero(currentTime.getSeconds()),
            period = getPeriod(currentTime.getHours());

        return hours + ":" + minutes + ":" + seconds + period;
      }

      /**
       * Gets the date in a string (mm/dd/yyyy)
       *
       * @private
       * @method getDateString
       * @return string
       */
      function getDateString() {
        var currentDate = new _Date();
        return _DateString(currentDate);
      }

      /**
       * Factory for returning either a "normal" date format or
       * a military date format (dd mmm yyyy)
       *
       * @private
       * @method _DateString
       * @param	  date  a _Date object
       * @return string
       */
      function _DateString(date) {
        if(settings.military) {
          return militaryDate(date);
        }

        return normalDate(date);
      }

      /**
       * Returns a date string in the military format
       * (dd mmm yyyy)
       *
       * @private
       * @method militaryDate
       * @param	  date  a _Date object
       * @return string
       */
      function militaryDate(date) {
        var month = date.getMonth(),
            day = date.getDate(),
            year = date.getFullYear();

        return day + " " + months[month] + " " + year;
      }

      /**
       * Returns a date string in a normal format
       * (mm/dd/yyyy)
       *
       * @private
       * @method normalDate
       * @param	  date  a _Date object
       * @return string
       */
      function normalDate(date) {
        var month = date.getMonth() + 1,
            day = date.getDate(),
            year = date.getFullYear();

        return month + "/" + day + "/" + year;
      }

      /**
       * Factory for returning either a "normal" date object or
       * a modified UTC date object
       *
       * @private
       * @method _Date
       * @return utcDate or Date
       */
      function _Date() {
        if(settings.timezone === "UTC") {
          return new utcDate();
        }

        else {
          return new Date();
        }
      }

      /**
       * Returns a an object that returns UTC numbers instead
       * of regular
       *
       * @private
       * @method utcDate
       * @return utcDate
       */
      function utcDate() {
        var d = new Date();

        function getMonth() { return d.getUTCMonth(); }
        function getDate() { return d.getUTCDate(); }
        function getFullYear() { return d.getUTCFullYear(); }
        function getHours() { return d.getUTCHours(); }
        function getMinutes() { return d.getUTCMinutes(); }
        function getSeconds() { return d.getUTCSeconds(); }

        return {
          getMonth: getMonth,
          getDate: getDate,
          getFullYear: getFullYear,
          getHours: getHours,
          getMinutes: getMinutes,
          getSeconds: getSeconds
        };
      }

      /**
       * Adds a zero to the beginning of a number if it is
       * less than 10.
       *
       * @private
       * @method addZero
       * @param time   the number for the minutes or seconds
       * @return string
       */
      function addZero(time) {
        if(time < 10) {
          time = "0" + time;
        }

        return time;
      }

      /**
       * Formats the hour in either military (24 hour) or standard 
       * (12 hour) style.
       *
       * @private
       * @method formatHour
       * @param time   the number of the hour
       * @return string
       */
      function formatHour(time) {
        if(settings.military) {
          return time;
        }

        return (time > 12) ? time - 12 : time;
      }

      /**
       * Takes the hour and determines whether the period should be
       * AM or PM. Returns empty string if military time is true.
       *
       * @private
       * @method getPeriod
       * @param time   the number of the hour
       * @return string
       */
      function getPeriod(time) {
        if(settings.military) {
          return "";
        }

        return (time > 11) ? " PM" : " AM";
      }
    }
  
   function toBool(value) {
     return /true/i.test(value);
   }
});