const Handlebars = require('handlebars');

function hbsHelpers(hbs) {
    return hbs.create({
      helpers: { // This was missing
        // bold: function(options) {
        //   return new Handlebars.SafeString('<div class="mybold" style="color:red;">' + options.fn(this) + "</div>");
        // },
        checked: function(value, test) {
            return value === test ? 'checked' : '';
        },
        selected: function (selected, option) {
          if (selected == undefined) {
              return '';
          }
          return selected.indexOf(option) !== -1 ? 'selected' : '';
        },
        exists: function(variable, options) {
          if (typeof variable !== 'undefined' && variable !== null) {
              return options.fn(this);
          } else {
              return options.inverse(this);
          }
        }
      }
  
    });
  }
  
  module.exports = hbsHelpers;