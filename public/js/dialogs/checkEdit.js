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
  
  $('input[name="start_time"]').daterangepicker({
    singleDatePicker: true,
    timePicker: true,
    locale: {
      format: 'YYYY-MM-DD HH:mm'
    }
  });
  
  $('input[name="end_time"]').daterangepicker({
    singleDatePicker: true,
    timePicker: true,
    locale: {
      format: 'YYYY-MM-DD HH:mm'
    }
  });
  
  async function getToken () {
    return db.ref('users/' + window.callerId).once('value')
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
    'actionTarget-sendToDialog-checkEdit': function({ source, target, context, parameters }) {
      console.log("actionTarget-sendToDialog-checkEdit");
      console.log(source, target);
      console.log(context);
      console.log(parameters);
      window.userId = context.userId;
      window.cloudId = context.cloudId;
      window.conversationId = context.conversationId;
      window.callerId = parameters.callerId;
      $('#check_id').val(parameters.checkId);
      
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
            //console.log('response from service: ' + JSON.stringify(data));
            var optionsAsString = "";
            $.each(data, function(key, object) {
                optionsAsString += "<option value='" + object.id + "'>" + object.name + "</option>";
            });
            $("select#leave_type option").remove();
            $('select#leave_type').append(optionsAsString);
          },
          error: function(data) {
            //do something with errors
            console.log('Error calling service: ' + data);
          },
        });  
        
        $.ajax({
          type: 'POST',
          url: '/checkin/leave/show',
          headers: { Authorization: 'Bearer ' + token },
          data: {
            'access_token': access_token,
            'checkId': parameters.checkId,
          },
          dataType: 'json',
          success: function(data) {
            console.log('response from service: ' + JSON.stringify(data));
            $('#start_time').val(moment(data.start_time).format('YYYY-MM-DD HH:mm'));
            $('#end_time').val(moment(data.end_time).format('YYYY-MM-DD HH:mm'));
            $('#leave_reason').val(data.leave_reason);
            $('select#leave_type').val(data.leave_type);
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
      
      //disable the buttons in the dialog
      AP.dialog.disableActions();
      AP.dialog.close();
      
      var check_id = $('#check_id').val();
      var start_time = $('#start_time').val();
      var end_time = $('#end_time').val();
      var leave_type = $('select#leave_type').val();
      var leave_reason = $('#leave_reason').val();
      
      AP.auth.withToken(async function(err, token) {
        var access_token = await getToken();
        console.log("access_token", access_token);
        $.ajax({
          type: 'POST',
          url: '/dialogs/dialog/checkEdit',
          headers: { Authorization: 'Bearer ' + token },
          data: {
            'cloudId': window.cloudId,
            'conversationId': window.conversationId,
            'callerId': window.callerId,
            'clickerId': window.userId,
            'access_token': access_token,
            'check_id': check_id,
            'start_time': start_time,
            'end_time': end_time,
            'leave_type': leave_type,
            'leave_reason': leave_reason,
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