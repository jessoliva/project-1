//VARIABLES
//workout tab variables
const workoutTabEl = document.getElementById("workout-tab");

// reference main container for workout tab
const archiveWrapperEl = document.getElementById("archive-wrapper");

// reference muscle group container
const muscleGroupWrapperEl = document.getElementById("muscle-group-wrapper");

// reference individual muscle list container
const individualMusclesWrapperEl = document.getElementById("individual-muscle-wrapper");
// reference addntl buttons section for individual muscles container
var indContainerBtns = document.getElementById('individual-btns');

// reference exercises container
const exerciseListWrapperEl = document.getElementById("exercise-wrapper");

// reference generate workout container
const generateWorkoutWrapperEl = document.getElementById("generate-workout-wrapper");
// reference generate workout btn
const generateWorkoutBtn = document.getElementById("generate-workout-btn");
// reference addntl buttons section for generate workout container
var genContainerBtns = document.getElementById('generate-btns');

// reference workout list container
const workoutDropdownEl = document.getElementById("workout-list");

// arrays
const muscleGroup = ["Arms", "Legs", "Chest", "Back", "Core"];
var muscleGroupArray = [];
var muscleGroupCardArray = [];
var randomWorkoutArray = [];
var finalRandomArray = [];
var chosenDay = [];


//FUNCTIONS
var reset = function () {
  muscleGroupArray = [];
};

//load workout tab
var loadArchive = function () {
  //clear values
  // generateWorkoutWrapperEl.removeAttribute("style");

  reset();

  var muscleApi = "https://wger.de/api/v2/muscle/?format=json";

  //gets muscle data from api
  fetch(muscleApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //saves initial muscle data as a global variable
          muscleGroupCardArray.push(data);
          muscleGroupCards(data);
        });
      } else {
        alert("Error: Something Went Wrong");
      }
    })
    .catch(function (error) {
      alert("Unable to Connect to WGER");
    });
};

//generate muscle group cards
function muscleGroupCards() {
  //clear values
  muscleGroupWrapperEl.innerHTML = "";
  exerciseListWrapperEl.innerHTML = "";
  individualMusclesWrapperEl.innerHTML = "";
  // generateWorkoutWrapperEl.removeAttribute("style");

  reset();

  //loop through array to generate muscle group cards
  for (i = 0; i < muscleGroup.length; i++) {
    // create muscle group card for each muscle group
    var muscleGroupCard = document.createElement("div");
    muscleGroupCard.classList = "w-11/12 h-[15%] py-2 flex justify-center items-center bg-primary rounded-[26px]";
    muscleGroupCard.id = muscleGroup[i] + "-group";

    // create image element
    var muscleGroupImageContainer = document.createElement("img");
    muscleGroupImageContainer.id = muscleGroup[i] + "-image";
    muscleGroupImageContainer.src = './assets/images/' + muscleGroup[i] + '.svg';
    muscleGroupImageContainer.setAttribute('width', '18%');
    muscleGroupImageContainer.setAttribute('style', 'transform: scale(-1,1)');
    muscleGroupImageContainer.classList = 'muscle-img no-pointer';

    // create h2 element
    var muscleGroupCardName = document.createElement("h2");
    muscleGroupCardName.classList = "card-title px-3 font-semibold text-xl no-pointer";
    muscleGroupCardName.textContent = muscleGroup[i] + ' Day';

    // create info element
    var moreInfoBtn = document.createElement("i");
    moreInfoBtn.id = muscleGroup[i] + "-info";
    moreInfoBtn.classList = 'fas fa-info-circle no-pointer';

    muscleGroupCard.append(muscleGroupImageContainer, muscleGroupCardName, moreInfoBtn);
    muscleGroupWrapperEl.appendChild(muscleGroupCard);
    archiveWrapperEl.appendChild(muscleGroupWrapperEl);
  };
};

//load individual muscles from muscle group info btn
var loadIndMuscles = function () {

  // display additional buttons for individual muscles section
  indContainerBtns.classList.remove('hidden');
  
  //clear values
  muscleGroupWrapperEl.innerHTML = "";
  exerciseListWrapperEl.innerHTML = "";
  individualMusclesWrapperEl.innerHTML = "";
  // generateWorkoutWrapperEl.setAttribute("style", "display: none");

  var muscleList = document.createElement("div");
  muscleList.id = "muscles";
  muscleList.classList = "scroll";

  //loop through array to generate individual muscle cards
  for (var i = 0; i < muscleGroupArray.length; i++) {
    // muscle card container that hold image and heading
    var indMuscleCard = document.createElement("div");
    indMuscleCard.id = muscleGroupArray[i].name;
    indMuscleCard.classList = "ind-muscle-card p-3 m-3 flex flex-wrap justify-center  bg-primary rounded-[26px]";
    //assigns muscle id to be the same as the muscle id in the api
    indMuscleCard.setAttribute("data-muscleID", muscleGroupArray[i].id);

    // heading of container
    var muscleName = document.createElement("h2");
    muscleName.classList = 'muscle-h2 p-2 px-8 mb-3 bg-secondary rounded-[26px] text-lg text-center';
    muscleName.textContent = muscleGroupArray[i].name;

    // image of container
    //checks if the background body should be front or back view
    if (muscleGroupArray[i].is_front === true) {
      var bodyImage =
        "https://wger.de/static/images/muscles/muscular_system_front.svg";
    } else {
      var bodyImage =
        "https://wger.de/static/images/muscles/muscular_system_back.svg";
    }
    //
    //sets image url as a variable
    var imageLocation = muscleGroupArray[i].image_url_secondary;
    // makes container that holds image
    var imageContainer = document.createElement("div");
    imageContainer.id = muscleGroupArray[i].id;
    imageContainer.classList = "muscle-image";
    imageContainer.setAttribute(
      "style",
      "background-image: url(https://wger.de" +
        imageLocation +
        "), url(" +
        bodyImage +
        "); width: 150px; height: 276px; background-size: 150px"
    );

    indMuscleCard.appendChild(muscleName);
    indMuscleCard.appendChild(imageContainer);
    muscleList.appendChild(indMuscleCard);
    individualMusclesWrapperEl.appendChild(muscleList);
  };
};

//fetch exercise list from clicking on individual muscle image
var loadExerciseList = function (muscleID) {
  //clear values
  muscleGroupWrapperEl.innerHTML = "";
  exerciseListWrapperEl.innerHTML = "";
  individualMusclesWrapperEl.innerHTML = "";

  var apiUrl =
    "https://wger.de/api/v2/exercise/?muscles=" +
    muscleID +
    "&language=2&format=json";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayExerciseList(data);
      });
    }
  });
};

//display exercise list from clicking on individual muscle image
var displayExerciseList = function (data) {
  //clear values
  muscleGroupWrapperEl.innerHTML = "";
  exerciseListWrapperEl.innerHTML = "";
  individualMusclesWrapperEl.innerHTML = "";

  // generate back button
  var returnBtn = document.createElement("button");
  returnBtn.setAttribute("type", "button");
  returnBtn.setAttribute("name", "returnbtn");
  returnBtn.id = "returnbtn-exercise";
  returnBtn.classList = 'btn-hover2 p-3 px-8 self-center btn bg-secondary rounded-[26px] font-semibold';
  returnBtn.textContent = "Back";
  exerciseListWrapperEl.appendChild(returnBtn);

  // loop through array to generate individual exercise cards
  for (var i = 0; i < data.results.length; i++) {
    // container holding individual exercise
    var indExerciseWrapper = document.createElement("div");
    indExerciseWrapper.id = data.results[i].id;
    indExerciseWrapper.classList = "individual-exercise w-11/12";

    // title for individual exercise
    var exerciseTitle = document.createElement("button");
    exerciseTitle.id = "exercise-title";
    exerciseTitle.classList = "collapsible btn-hover2 my-2 bg-primary rounded-[26px] font-semibold";
    exerciseTitle.textContent = data.results[i].name;
    // append to individual exercise container
    indExerciseWrapper.appendChild(exerciseTitle);

    // container for exercise description
    var exerciseDescription = document.createElement("div");    
    exerciseDescription.classList = "content bg-tertiary rounded-[26px] font-semibold";
    //
    // create p for each description
    var exerciseP = document.createElement('p');
    exerciseP.classList = 'p-2 text-primary text-semibold';
    exerciseP.innerHTML = data.results[i].description;
    // append description paragraph to div
    exerciseDescription.appendChild(exerciseP);
    // 
    // append description container to individual exercise container
    indExerciseWrapper.appendChild(exerciseDescription);

    // append to container holding all exercises
    exerciseListWrapperEl.appendChild(indExerciseWrapper);
  };

  //function to make exercise collapsibles work
  var collapseList = document.getElementsByClassName("collapsible");

  for (var i = 0; i < collapseList.length; i++) {
    collapseList[i].addEventListener("click", function () {
      console.log(this);
      this.classList.toggle("active");
      var content = this.nextElementSibling;

      if (
        content.innerHTML == "" ||
        content.innerHTML == null ||
        content.innerHTML == undefined
      ) {
        content.innerHTML = "<p>No Details Provided</p>";
      }

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  };
};

//send user input from dropdown to fetch muscle group
var randomizeWorkout = function () {
  // remove previous divs to prevent displaying multiple workouts!
  $('div').remove('#exercise-card');

  // display container for generated workout
  generateWorkoutWrapperEl.classList.remove('hidden');

  // reset chosen day
  chosenDay = [];
  // reset day title
  $('#workout-day').text('');

  // get information from dropdown and save as global variable
  chosenDay = workoutDropdownEl.options[workoutDropdownEl.selectedIndex].value;

  if (chosenDay === "arms") {
    fetchArms();
  } else if (chosenDay === "legs") {
    fetchLegs();
  } else if (chosenDay === "chest") {
    fetchChest();
  } else if (chosenDay === "back") {
    fetchBack();
  } else if (chosenDay === "core") {
    fetchCore();
  } else {
    //TO DO: NEEDS TO BE A MODAL
    alert("Please Select Muscle Group");
  }
};

// THE ISSUE IS WITH DISPLAYING THE ARRAY AGAIN!!! HAVE TO REMOVE THE FIRST ONE
// display generated workout
var displayRandomWorkout = function (data) {
  // display workout day title
  $('#day-title').removeClass('hidden');

  // set text content of workout day selected
  var workoutDay = workoutDropdownEl.options[workoutDropdownEl.selectedIndex].textContent;
  // set workout day title
  $('#workout-day').text(workoutDay);

  // reset the form 
  workoutDropdownEl.selectedIndex = 0;

  // display additional buttons for generate workout section
  genContainerBtns.classList.remove('hidden');

  //clear values
  muscleGroupWrapperEl.innerHTML = "";
  exerciseListWrapperEl.innerHTML = "";
  individualMusclesWrapperEl.innerHTML = "";
  // generateWorkoutWrapperEl.setAttribute("style", "display: none");
  
  randomWorkoutArray = [];
  finalRandomArray = [];

  var muscleGroupImageContainer = document.createElement("div");
  muscleGroupImageContainer.id = muscleGroup[i] + "-image";
  if (chosenDay === "Arms") {
    muscleGroupImageContainer.setAttribute(
      "style",
      "background-image: url(./assets/images/arms.svg); background-repeat: no-repeat; width: 150px; height: 100px; background-size: 110px"
    );
  } else if (chosenDay === "Legs") {
     muscleGroupImageContainer.setAttribute(
       "style",
       "background-image: url(./assets/images/legs.svg); background-repeat: no-repeat; width: 150px; height: 100px; background-size: 110px"
     );
  } else if (chosenDay === "Chest") {
     muscleGroupImageContainer.setAttribute(
       "style",
       "background-image: url(./assets/images/chest.svg); background-repeat: no-repeat; width: 150px; height: 100px; background-size: 110px"
     );
  } else if (chosenDay === "Back") {
     muscleGroupImageContainer.setAttribute(
       "style",
       "background-image: url(./assets/images/back.svg); background-repeat: no-repeat; width: 150px; height: 100px; background-size: 110px"
     );
  } else if (chosenDay === "Core") {
     muscleGroupImageContainer.setAttribute(
       "style",
       "background-image: url(./assets/images/core.svg); background-repeat: no-repeat; width: 150px; height: 100px; background-size: 110px"
     );
  }
  generateWorkoutWrapperEl.appendChild(muscleGroupImageContainer);

  //pushes each array of workout results into one array
  for (var i = 0; i < data.length; i++) {
    var exercises = data[i].results;
    randomWorkoutArray.push(exercises);
  };

  //simplifies array so that it contains only the objects of the multiple arrays
  const simpleArray = (randomWorkoutArray = []) => {
    const result = [];
    randomWorkoutArray.forEach((element) => {
      element.forEach((el) => {
        result.push(el);
      });
    });
    
    //loops through simpleArray to randomize the list without duplicates
    for (var i = 0; i < result.length; i++) {
      var randomExercise = result[Math.floor(Math.random() * result.length)];
      //variable to check if items are already in the array before pushing
      var check = finalRandomArray.includes(randomExercise);

      if (check === false) {
        finalRandomArray.push(randomExercise);
      } else {
        while (check === true) {
          randomExercise = result[Math.floor(Math.random() * result.length)];
          check = finalRandomArray.includes(randomExercise);
          if (check === false) {
            finalRandomArray.push(randomExercise);
          }
        }
      }
    };
  };
  simpleArray(randomWorkoutArray);

  //cut finalRandomArray to only first 6 exercises 
  finalRandomArray = finalRandomArray.splice(0, 6);

  //loop through randomized array to generate exercise list
  for (var i = 0; i < finalRandomArray.length; i++) {
    var exerciseCard = document.createElement("div");
    exerciseCard.id = "exercise-card";
    //sets exerciseID to be the same as in the api
    exerciseCard.setAttribute("data-exerciseID", finalRandomArray[i].id);
    exerciseCard.classList = 'w-full p-1';

    var exerciseName = document.createElement("h2");
    exerciseName.id = "exercise-name";
    exerciseName.innerHTML = finalRandomArray[i].name;
    exerciseName.classList = "collapsible btn-hover2 bg-primary rounded-[26px] font-semibold";

    // container for exercise description
    var exerciseDescription = document.createElement("div");
    exerciseDescription.classList = "content bg-tertiary rounded-[26px]";
    //
    // create p for each description
    var exerciseP = document.createElement('p');
    exerciseP.classList = 'p-2 text-primary text-semibold';
    exerciseP.innerHTML = finalRandomArray[i].description;
    exerciseDescription.appendChild(exerciseP);

    exerciseCard.appendChild(exerciseName);
    exerciseCard.appendChild(exerciseDescription);
    generateWorkoutWrapperEl.appendChild(exerciseCard);
  };

  //function to make exercise collapsibles work
  var collapseList = document.getElementsByClassName("collapsible");

  for (var i = 0; i < collapseList.length; i++) {
    collapseList[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var content = this.nextElementSibling;

      if (
        content.innerHTML == "" ||
        content.innerHTML == null ||
        content.innerHTML == undefined
      ) {
        content.innerHTML = "<p>No Details Provided</p>";
      }
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  };
};

// reference save button
let saveBtn = document.getElementById('saveBtn-random');

// add event listener to call function with an argument!
saveBtn.addEventListener('click', function() {
  saveWorkout(finalRandomArray);
}, false);

let userWorkouts = [];

// save workout to local storage
function saveWorkout(finalArray) {

  // push saved workout into array
  userWorkouts.push(finalArray);

  // save array holding workout into local storage
  localStorage.setItem('Workouts', JSON.stringify(userWorkouts));

  console.log('array is ', finalArray);
};

// load scores from local storage, if any, to save into savedWorkouts array
function loadWorkout() {

  // load saved workouts
  let savedWorkout = localStorage.getItem('Workouts');
  // convert it to array
  savedWorkout = JSON.parse(savedWorkout);

  // if there are no saved workouts, do nothing
  if (savedWorkout === null) {
    return;
  }
  // else there are saved workouts, add them to the userWorkouts = []; empty array
  else {
    userWorkouts = savedWorkout;
  }
  console.log(userWorkouts);
}
loadWorkout();

// // DYNAMICALLY CREATED BUTTON
// let tryBtn = document.createElement('button');
// tryBtn.setAttribute('type', 'button');
// tryBtn.classList = 'btn-hover2 mt-3 p-3 px-6 self-center btn bg-secondary rounded-[26px] font-semibold';
// tryBtn.textContent = 'Tri It!'
// genContainerBtns.append(tryBtn);

// tryBtn.addEventListener('click', function () {
//   tryIt(finalRandomArray)
// }, false)
// // if creating button within the 

// function tryIt(finalArray) {
//   console.log('this array is ', finalArray);

//   // get container from index.html document with getElementById and display array
// };



//ASYNC FETCH FUNCTIONS IN ORDER TO GET RANDOMIZED WORKOUTS FOR MUSCLE GROUPS
async function fetchArms() {
  var data = await Promise.all([
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=2&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=1&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=13&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=5&language=2&format=json"
    ).then((response) => response.json()),
  ]);
  displayRandomWorkout(data);
};

async function fetchLegs() {
  var data = await Promise.all([
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=11&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=7&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=8&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=10&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=15&language=2&format=json"
    ).then((response) => response.json()),
  ]);
  displayRandomWorkout(data);
};

async function fetchChest() {
  var data = await Promise.all([
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=4&language=2&format=json"
    ).then((response) => response.json()),
  ]);
  displayRandomWorkout(data);
};

async function fetchBack() {
  var data = await Promise.all([
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=12&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=9&language=2&format=json"
    ).then((response) => response.json()),
  ]);
  displayRandomWorkout(data);
};

async function fetchCore() {
  var data = await Promise.all([
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=14&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=6&language=2&format=json"
    ).then((response) => response.json()),
    fetch(
      "https://wger.de/api/v2/exercise/?muscles=3&language=2&format=json"
    ).then((response) => response.json()),
  ]);
  displayRandomWorkout(data);
};


//EVENT LISTENERS
//TO DO: need to add listener for when workout tab is clicked to call loadArchive. add listener for when favoriteBtn is pressed (also function to save to localStorage). add listener for when makeCurrentWorkoutBtn is pressed (also function to push to home page)

// generate workout function
generateWorkoutBtn.addEventListener("click", randomizeWorkout);

//DYNAMIC EVENT LISTENERS
//listener for muscle group to load individual muscles
document.querySelector("#archive-wrapper").addEventListener("click", function (event) {
  if (event.target.id === "Arms-group") {
    for (var i = 0; i < muscleGroupCardArray[0].results.length; i++) {
      var muscle = muscleGroupCardArray[0].results[i];

      if (
        muscle.id == 2 ||
        muscle.id == 1 ||
        muscle.id == 13 ||
        muscle.id == 5
      ) {
        muscleGroupArray.push(muscle);
      }
      loadIndMuscles(muscleGroupArray);
    }
  } 
  else if (event.target.id === "Legs-group") {
    for (var i = 0; i < muscleGroupCardArray[0].results.length; i++) {
      var muscle = muscleGroupCardArray[0].results[i];

      if (
        muscle.id == 11 ||
        muscle.id == 7 ||
        muscle.id == 8 ||
        muscle.id == 10 ||
        muscle.id == 15
      ) {
        muscleGroupArray.push(muscle);
      }
      loadIndMuscles(muscleGroupArray);
    }
  } 
  else if (event.target.id === "Chest-group") {
    for (var i = 0; i < muscleGroupCardArray[0].results.length; i++) {
      var muscle = muscleGroupCardArray[0].results[i];

      if (muscle.id == 4) {
        muscleGroupArray.push(muscle);
      }
      loadIndMuscles(muscleGroupArray);
    }
  } 
  else if (event.target.id === "Back-group") {
    for (var i = 0; i < muscleGroupCardArray[0].results.length; i++) {
      var muscle = muscleGroupCardArray[0].results[i];

      if (muscle.id == 12 || muscle.id == 9) {
        muscleGroupArray.push(muscle);
      }
      loadIndMuscles(muscleGroupArray);
    }
  } 
  else if (event.target.id === "Core-group") {
    for (var i = 0; i < muscleGroupCardArray[0].results.length; i++) {
      var muscle = muscleGroupCardArray[0].results[i];

      if (muscle.id == 14 || muscle.id == 6 || muscle.id == 3) {
        muscleGroupArray.push(muscle);
      }
      loadIndMuscles(muscleGroupArray);
    }
  }
});

//listener for individual muscle images to load exercises for individual muscles
document.querySelector("#archive-wrapper").addEventListener("click", function (event) {
  if (event.target.matches(".muscle-image") || event.target.matches(".muscle-h2")) {
    var muscleID = event.target.id;
    loadExerciseList(muscleID);
  }
});

//listener for back button on individual muscle exercise list
document.querySelector("#archive-wrapper").addEventListener("click", function (event) {
  if (event.target.matches("#returnbtn-exercise")) {
    loadIndMuscles();
  }
});

// return btn for individual muscles section
document.getElementById('returnbtn-ind-muscles').addEventListener('click', function() {
  muscleGroupCards(muscleGroupCardArray);
  // generateWorkoutWrapperEl.classList.add('hidden');
  indContainerBtns.classList.add('hidden');

});

// return btn for generate workout section
document.getElementById('returnbtn-random').addEventListener('click', function() {
  muscleGroupCards(muscleGroupCardArray);
  generateWorkoutWrapperEl.classList.add('hidden');
  genContainerBtns.classList.add('hidden');

});

loadArchive();