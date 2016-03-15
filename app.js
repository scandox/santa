(function(exports) {
  'use strict';
  
  /* Public API */

  var App = {

    dataSource: "users.json",

    // Gets users and renders initial shuffle
    init: function(el, template, done) {
      var self = this;
      self.el = el;
      self.template = getTemplate(template);     
 
      getUsers(self.dataSource, function(users) {
        self.santa = new Santa(users);
        self._render();
      },
      function(err) {
        self.el.text(err);
      });
      
      if (done) done();
    },
 
    // Reshuffle Secret Santa Assignments 
    retry: function() {
      this._render();
    },
    
    // Generates context, deranges users and renders template 
    _render: function() {
      var self = this,
          givers = [],
          recipients = [],
          assignments,
          context,
          html;
      self.el.empty();

      // Create new random assignments
      assignments = self.santa.assign();
 
      assignments.forEach(function(assignment) {
        givers.push(assignment.giver);
        recipients.push(assignment.recipient);
      });

      context = { givers: givers, recipients: recipients };
      html = self.template(context);
      
      self.el.html(html);
    }
  };

  exports.App = App;

  /* Private implementation */

  /* Gets the list of users 

  */
  function getUsers(source, success, failure) {
    $.getJSON(source).done(function(json) {
      var users = json.users.sort(sortSurname);
      success(users);
    }).fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      failure(err);
    });
  }

  /* A sort comparison function on surname, case insensitive

  */
  function sortSurname(a,b) {
    var nameA=a.name.last.toLowerCase(), nameB=b.name.last.toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0; //default return value (no sorting)
  }
 
  /* Returns the name of the user
 
     Returns full name if possible, otherwise just first name
  
  */
  Handlebars.registerHelper('getIdentity', function(name) {
    var result = name.first;
    if (name.last) {
      result = result + ' ' + name.last;
    }
    return result;
  });

  /* Returns the Handlebars Template for display */
  function getTemplate(element) {
    var source = element.html();
    return Handlebars.compile(source);
  }
   
})(this);
