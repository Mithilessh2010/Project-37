//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogImg, happyDogImg;
var fedTime, lastFed, foodObj;
var feedDog, addFood;
var bedroom, garden, washroom;
var gameState;

function preload() {
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/Happy.png");
  bedroom = loadImage("images/BedRoom.png")
  garden = loadImage("images/Garden.png")
  washroom = loadImage("images/Wash Room.png")
  sadDog = loadImage("images/Dog.png")

}

function setup() {
  createCanvas(900, 500);

  database = firebase.database();

  dog = createSprite(600, 250, 50, 50);
  dog.addImage(dogImg);
  dog.scale = 0.4;

  feedButton = createButton("Feed Dog");
  feedButton.mousePressed(feedDog);
  feedButton.position(400, 180);

  addButton = createButton("Add Food");
  addButton.position(500, 180);
  addButton.mousePressed(addFood);

  foodObj = new Food();

  readState = database.ref('gameState');
  readState.on("value", function (data) {
    gameState = data.val();
  });


  foodStock = database.ref("Food")
  foodStock.on("value", readStock);



}


function draw() {
  background(46, 139, 87)


  foodObj.display();
  drawSprites();
  //add styles here
  textSize(20);
  fill("black");
  text("Food Left : " + foodS, 190, 100);


  fill(255, 255, 254);
  textSize(15)
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  })

  currentTime = hour();
  if (currentTime == (lastFed + 1)) {
    update("Playing");
    foodObj.garden();
  }
  else if (currentTime == (lastFed + 2)) {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    update("Bathing");
    foodObj.washroom();
  }
  else {
    update("Hungry");
    foodObj.display();
  }



  if (lastFed >= 12) {
    text("Last Fed: " + lastFed % 12 + " PM", 50, 50);
  } else if (lastFed === 0) {
    text("Last Fed: 12AM", 50, 50);
  } else {
    text("Last Fed: " + lastFed + "AM", 50, 50);
  }
  if (gameState != "Hungry") {
    feedButton.hide();
    addButton.hide();
    dog.remove();
  } else {
    feedButton.show();
    addButton.show();
    dog.addImage(sadDog);
  }
}
function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if (x <= 0) {
    x = 0;
  } else {
    x = x - 1;
  }
  database.ref('/').update({
    Food: x
  })
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog() {
  var getFoodStock = foodObj.getFoodStock(); // get from database

  // So we don't display negitave values
  if (getFoodStock > 0) {
    dog.addImage(happyDogImg);
    foodObj.updateFoodStock(getFoodStock - 1); // updating the counter display 
    // udpate the database
    database.ref('/').update({
      Food: getFoodStock - 1,
      FeedTime: hour(),
      gameState: "Hungry"
    })
  }

}

//function to add food in stock
function addFood() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

//update gameState
function update(state) {
  database.ref('/').update({
    gameState: state
  })
}
