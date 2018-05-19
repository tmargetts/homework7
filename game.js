
// Initialize firebase
var config = {
    
    apiKey: "AIzaSyB5-p4d9_umYRL6IqHIPTx_Z16eoSA32mk",
    authDomain: "train-schedule-b996c.firebaseapp.com",
    databaseURL: "https://train-schedule-b996c.firebaseio.com",
    projectId: "train-schedule-b996c",
    storageBucket: "",
    messagingSenderId: "989271863116"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#dest-input").val().trim();
    var firstTrainTime = $("#first-train-time-input").val().trim();
    var frequency = $("#freq-input").val().trim();
    var nextArrival = moment(firstTrainTime, 'HH:mm').add(frequency, 'minutes').format("HH:mm")
  
    // Creates local temporary object for holding train data
    var newTrain = {
      name: trainName,
      dest: trainDest,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      nextArrival: nextArrival
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);

  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#dest-input").val("");
    $("#first-train-time-input").val("");
    $("#freq-input").val("");
  });
  
  // Firebase event for adding train times to the database and a row in the html when a user adds an entry

  
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  
    // Storing into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var firstTrainTime = moment(childSnapshot.val().firstTrainTime, 'HH:mm');
    var frequency = childSnapshot.val().frequency;
    var nextArrival = childSnapshot.val().nextTrain;

    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var minsNextTrain = frequency - tRemainder;
    var nextTrain = moment().add(minsNextTrain, "minutes");
    var nextTrainConverted = moment(nextTrain).format("HH:mm");
  
    // append each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
    frequency + "</td><td>" + nextTrainConverted + "</td><td>" + minsNextTrain + "</td></tr>");

  });
