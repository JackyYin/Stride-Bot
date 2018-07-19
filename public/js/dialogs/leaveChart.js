$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDmmMqnwGE-NrhKbiW9XX_XvfppWpDUX70",
    authDomain: "stride-bot-a9c85.firebaseapp.com",
    databaseURL: "https://stride-bot-a9c85.firebaseio.com",
    projectId: "stride-bot-a9c85",
    storageBucket: "stride-bot-a9c85.appspot.com",
    messagingSenderId: "151580747908"
  };
  firebase.initializeApp(config);
  const db = firebase.database();
  
  $( "#start_date" ).datepicker();
  $( "#end_date" ).datepicker();
  $( "#start_date" ).datepicker( "option", {"dateFormat": "yy-mm-dd"});
  $( "#end_date" ).datepicker( "option", {"dateFormat": "yy-mm-dd"});
  
  async function getToken () {
    return db.ref('users/' + window.userId).once('value')
    .then(function(snapshot) {
      return snapshot.val().access_token;
    },function(error) {
      console.log(error);
    });
  }
  
  AP.register({
    /**
     * Anytime an actionTarget is called, your app can register to it client-site
     * using this approach
     * Source is the key of the component the actionTarget was triggered from
     * Target is the actionTarget key
     * Context is all contextual informatin about the action
     * Parameters are all custom parameters passed to the actionTarget
     */
    'actionTarget-sendToDialog-leaveChart': function({ source, target, context, parameters }) {
      console.log("actionTarget-sendToDialog-leaveChart");
      console.log(source, target);
      console.log(context);
      $('#cloudId').val(context.cloudId);
      $('#conversationId').val(context.conversationId);
      $('#userId').val(context.userId);
      window.userId = context.userId;
      window.cloudId = context.cloudId;
      window.conversationId = context.conversationId;
      if (parameters) $('#parameters').val(JSON.stringify(parameters));
      if (context.message) $('#message').val(JSON.stringify(context.message));
      
      AP.auth.withToken(async function(err, token) {
        var access_token = await getToken();        
        console.log("access_token", access_token);
        
        $.ajax({
          type: 'POST',
          url: '/checkin/leave/types',
          headers: { Authorization: 'Bearer ' + token },
          data: {
            'access_token': access_token,
          },
          dataType: 'json',
          success: function(data) {
            console.log('response from service: ' + JSON.stringify(data));
            var optionsAsString = "";
            $.each(data, function(key, object) {
                optionsAsString += "<option value='" + object.id + "'>" + object.name + "</option>";
            });
            $("select#types option").remove();
            $('select#types').append(optionsAsString);
            $('select#types').multiselect({
              buttonClass: 'btn btn-outline-secondary',
              includeSelectAllOption: true,
              selectAllText: '全選',
              maxHeight: 400,
              buttonText: function(options, select) {
                if (options.length === 0) {
                  return '請選擇類別';
                }
                else if (options.length > 5) {
                  return '已選擇超過五類';
                }
                else {
                  var labels = [];
                  options.each(function() {
                    if ($(this).attr('label') !== undefined) {
                      labels.push($(this).attr('label'));
                    }
                    else {
                      labels.push($(this).html());
                    }
                  });
                  return labels.join(', ') + '';
                }
              },
            });
           
          },
          error: function(data) {
            //do something with errors
            console.log('Error calling service: ' + data);
          },
        });
      });
     
      
    },
    
    'dialogAction-sendForm': function() {
      console.log("dialogAction-snedForm");
      //First, disable the buttons in the dialog
      AP.dialog.disableActions();
      AP.dialog.close();
      
      var start_date = $('#start_date').val();
      var end_date = $('#end_date').val();
      var types = $('select#types').val();
      
      AP.auth.withToken(async function(err, token) {
        var access_token = await getToken();
        console.log("access_token", access_token);
        $.ajax({
          type: 'POST',
          url: '/dialogs/dialog/leaveChart',
          headers: { Authorization: 'Bearer ' + token },
          data: {
            'access_token': access_token,
            'start_date': start_date,
            'end_date': end_date,
            'types': JSON.stringify(types),
            'cloudId': window.cloudId,
            'conversationId': window.conversationId,
          },
          dataType: 'text',
          success: function(data) {
            console.log('response from service: ' + JSON.stringify(data));
          },
          error: function(data) {
            //do something with errors
            console.log('Error calling service: ' + data);
          },
        });
      });
    },
    
    /** This is how you handle dialog buttons
     */
    'dialogAction-openSidebar': function() {
      console.log("dialogAction-openSidebar");
      //First, disable the buttons in the dialog
      AP.dialog.disableActions();

      //Then, do whatever you need to
      AP.auth.withToken(function(err, token) {
        $.ajax({
          type: 'POST',
          url: '/dialogs/dialog/handleButtonClickServerSide',
          headers: { Authorization: 'Bearer ' + token },
          dataType: 'json',
          success: function(data) {
            console.log('response from service: ' + JSON.stringify(data));
            AP.sidebar.open({ key: 'sidebar-showcase' });

            // finally, close the dialog
            AP.dialog.close();
          },
          error: function(data) {
            //do something with errors
            console.log('Error calling service: ',JSON.stringify(data));
          },
        });
      });
    },

    'dialogAction-closeDialog': function() {
      console.log("dialogAction-closeDialog");
      AP.dialog.close();
    },
  });
});