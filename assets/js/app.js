// ------------------------- GLOBAL VARIABLES -------------------------

var trainName;
var destination;
var frequency;
var firstTrain;
var next;
var minAway;

// ------------------------ Initialize FIREBASE -------------------------
var config = {
    apiKey: "AIzaSyBtARBJwXMvm2qHWDD-AApkznEXAxpkezs",
    authDomain: "train-scheduler-3ebdf.firebaseapp.com",
    databaseURL: "https://train-scheduler-3ebdf.firebaseio.com",
    projectId: "train-scheduler-3ebdf",
    storageBucket: "train-scheduler-3ebdf.appspot.com",
    messagingSenderId: "481033013195"
};

firebase.initializeApp(config);

var database = firebase.database();

// ------------------------- FUNCTIONS -------------------------

$("#add-train").on("click", function (event) {
    event.preventDefault();
    trainName = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    frequency = $("#freq-input").val().trim();
    firstTrain = $("#first-train-time").val().trim();
    // console.log(firstTrain);
    
    
    //Convert the first train time for calculation
    var convertedFirstTrain = moment(firstTrain,"hh:mm")
    
    // console.log("Converted: " + convertedFirstTrain);
     
    // Push the results to firebase
    database.ref().push({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        trainName: trainName,
        destination: destination,
        frequency: frequency,
        first_Train: firstTrain,
    });
});

//When Child is added to the database update the table
database.ref().on("child_added", function (snapshot) {
    var snapshotVal = snapshot.val();
    

    var tRow = $("<tr>");
    var tdTrainName = $("<td>");
    var tdDestination = $("<td>");
    var tdFreq = $("<td>");
    var tdNext = $("<td>");
    var tdMinAway = $("<td>");

    tdTrainName.text(snapshotVal.trainName);
    tdDestination.text(snapshotVal.destination);
    tdFreq.text(snapshotVal.frequency);

    // Calculating the next train time and the minutes til next train

    var tFrequency = snapshotVal.frequency;
    var tfirstTrain = snapshotVal.first_Train;
    console.log(tfirstTrain);

    var firstTimeConverted = moment(tfirstTrain, "HH:mm").subtract(1, "years");
    console.log("first time conv: " + firstTimeConverted)
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);
    var tMinutesTillTrain = tFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    

    tdNext.text(moment(nextTrain).format("hh:mm"));
    tdMinAway.text(tMinutesTillTrain);

    
    

    tRow.append(tdTrainName, tdDestination,tdFreq, tdNext, tdMinAway)
    $(".table").append(tRow);
});





// First Time (pushed back 1 year to make sure it comes before current time)


// Current Time


// Difference between the times





