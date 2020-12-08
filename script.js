
let game;

let formElement = document.getElementById("inputForm");
let inputElement = document.getElementById("userInput");
let outputElement = document.getElementById("mainDisplay");

inputElement.addEventListener("change", function(e) {
  var submittedInput = e.currentTarget.value;
  game.processCommand(submittedInput);
  inputElement.value = "";


});

window.addEventListener("DOMContentLoaded", function(e) {
  console.log("DOMContentLoaded...");
  startUpGame();
  scrollToBottom();
});

class Room {

  constructor(name, description, items, secondDescription) {
    this.name = name;
    this.description = description;
    this.secondDescription = secondDescription;
    this.exits = [null, null, null, null];
    this.items = items;
    this.blocked = false;
    this.locked = false;
  }

  getDirection(dirName) {
    var dirName = dirName.toLowerCase();
    if (dirName == 'n' || dirName == 'north') {
      return 0;
    } else if (dirName == 's' || dirName == 'south') {
      return 1;
    } else if (dirName == 'e' || dirName == 'east') {
      return 2;
    } else if (dirName == 'w' || dirName == 'west') {
      return 3;
    } else {
      var prompt_one = "Sorry, I do not recognize the direction: " + dirName;
      printToDisplay(prompt_one);
      return null;
    }
  }

  setExit(dirName, room) {
    var direction = this.getDirection(dirName);
    this.exits[direction] = room;
  }

  getExit(dirName) {
    console.log("Getting an exit in:" + dirName);
    var direction = this.getDirection(dirName);
    console.log("The direction index is: " + direction);
    if (direction == null) {
      console.log("No direction, returning null...")
      return null;
    } else {
      console.log("Returning a room in direction " + dirName + ":");
      console.log(this.exits[direction]);
      return this.exits[direction];
    }
  }
  setBlocked(block) {
    this.blocked = block;
  }
  setLocked(lock) {
    this.locked = lock;
  }
  doUnlockRoom() {
    this.locked = false;
    printToDisplay("You have unlocked the room.");
  }
}

class Item {
  constructor(name, shortName) {
    this.name = name;
    this.shortName = shortName;
    this.broken = false;
    this.melt = 0;
  }
}

class Game {
  constructor(startingRoom, startingInventory) {
    this.room = startingRoom;
    this.inventory = startingInventory;
    this.gameOver = false;
    this.targetRoom = null;
    this.ad = null;
    this.turnCount = 0;
  }

  processCommand(userInput) {

      var processedInput = this.getCommand(userInput.toLowerCase());
      console.log("processedInput is: ");
      console.log(processedInput);
      var command = processedInput[0];
      var target = processedInput[1];


      console.log("Executing command with: " + command + "," + target + "...");
      if (this.gameOver == false) {
      this.turnCount += 1;
      console.log("turnCount is: " + this.turnCount);
      for (var i = 0; i < this.inventory.length; i++) {
      if (this.inventory[i].shortName == 'ice') {
        console.log("Ice is in inventory.");
        ice.melt += 1;
        console.log("ice melt counter is " + ice.melt);
        }
      }
      if  (ice.melt == 10) {
        console.log("The ice has melted.");
        ice.melt += 1;
        printToDisplay("* The ice cube has melted from your inventory. *");
        var ice1 = this.findItem("ice", this.inventory);
        for (var i = 0; i < this.inventory.length; i++) {
          if (this.inventory[i] === ice1) {
            this.inventory.splice(i, 1);
            printToDisplay("You notice that your pocket is now wet.");
          }
        }
      }
      if (command == 'help') {
        this.doHelp();
      } else if (command == 'inventory' || command == 'inv') {
        this.doInventory();
      } else if (command == 'go') {
        this.doGo(target);
      } else if (command == 'get' || command == 'take' || command == 'grab') {
        this.doGet(target);
      } else if (command == 'drop') {
        this.doDrop(target);
      } else if (command == 'restart') {
        this.doRestart();
      } else if (command == 'pee') {
        this.doPee();
      } else if (command == 'inspect' || command == 'look' || command == 'examine') {
        this.doInspect();
      } else if (command == 'click') {
        this.doClick();
      } else if (command == 'drink' || command == 'chug' || command == 'sip') {
        this.doDrink();
      } else if (command == 'save') {
        this.doSave(target);
      } else if(command == 'unlock') {
        if (this.targetRoom != null){
        this.targetRoom.doUnlockRoom();
      }
        else {
          printToDisplay("Unlock what?");
        }
      } else {
        printToDisplay("Unknown command: " + command);
      }
    }
    else {
      if (command == 'y' || command == 'yes' || command == 'Y') {
        this.doRestart();
      }
      else if (command == 'n' || command == 'no' || command == 'N') {
        printToDisplay("Well... that's lame.")
      }
      else {
        printToDisplay("Sorry, what?");
      }
    }
    if (this.turnCount == 4) {
      console.log("First sequential ad triggered.");
      printToDisplay("Would you like to save the princes? Click here!");
      this.ad = "So you wanna save the princes? It won't be free.";
    }
    if (this.turnCount == 10) {
      console.log("Second sequential ad triggered.");
      printToDisplay("Your search history suggests that you would like\nto save the princes from the castle.\n\nThere is an easy way to save them, all you have\nto do is click here!");
      this.ad = "Saving the princes is easy! All you have to do is save the princes!";
    }
    if (this.turnCount == 15) {
      console.log("Third sequential ad triggered.");
      printToDisplay("Your every movement is being monitored, tracked, and stored.\n\nThis information is valuable to us.");
      this.ad = "Your location is known. You are in the " + this.room.name;
    }
    if (this.turnCount == 24) {
      console.log("Fourth sequential ad triggered.");
      printToDisplay("You recently went north. Would you like to go north again?\n\nClick here!");
      this.ad = "If you would like to go north, simply type: 'go north'";
    }
    if (this.turnCount == 35) {
      console.log("Fifth sequential ad triggered.");
      if (this.inventory.length > 0) {
      printToDisplay("Your recent actions suggest that you are interested in " + this.inventory[this.inventory.length - 1].name);
      }
    }
    if (this.turnCount == 53) {
    console.log("Sixth sequential ad triggered.");
    printToDisplay("Based on our algorithm, it seems you may want to go west.");
    }
    if (this.turnCount == 65) {
    console.log("Seventh sequential ad triggered.");
    printToDisplay("Do you still want to save the princes? Click here.");
    this.ad = "To save the princes, save princes.";
    }
  }

  getCommand(response) {
    console.log("Running getCommand...");
    // response = document.getElementById('userInput').value;
    var responseParts = response.split(" ");
    var command = responseParts[0];
    var target;
    if (responseParts.length == 1) {
      target = '';
    } else {
      target = responseParts[1];
    }
    console.log("Returning: " + command + ", " + target);
    return [command, target];
  }

  enterRoom() {
    printToDisplay("== " + this.room.name + " ==");
    printToDisplay(this.room.description);
  }

  findItem(targetItemName, itemList) {
    console.log("Looking for item named " + targetItemName + " in:");
    console.log(itemList);

    for (var i = 0; i < itemList.length; i++) {
      console.log("Checking item: " + itemList[i].name + ": " + itemList[i].shortName + "...");
      console.log(itemList[i]);
      if (itemList[i].shortName == targetItemName) {
        return itemList[i];
      }
    }
    return null;
  }

  doSave(target) {
    if (target == 'princes') {
      this.doWinGame();
    }
    else {
      printToDisplay("You're supposed to save the princes!");
    }
  }
  doPee() {
    if (this.room == room11) {
      printToDisplay("Ahh. What a Relief. \nWait a second... Is that a camera in the toilet?");
    }
    else {
      printToDisplay("You can't pee here!");
    }
  }
  doClick() {
    if (this.ad != null) {
    printToDisplay(this.ad);
  }
  else {
    printToDisplay("There is nothing to click on.");
  }
  }
  doDrink() {
    if (this.room == room10) {
      printToDisplay("You take a swig of beer.\n\nAre you an alcoholic? Do you need help? Click here!");
      this.ad = "It seems you may have a drinking problem. We are here to help you.\nWe know what you do. We know what you need."
    }
    else {
      printToDisplay("Drink what?");
    }
  }
  doGo(dirName) {
    let newRoom = this.room.getExit(dirName);
    if (newRoom == null) {
      printToDisplay("Sorry, I can not go in that direction.");
      // document.getElementById('prompt1').innerHTML = prompt_one;
    } else if (newRoom.blocked) {
      printToDisplay("The dragon woke up and kicked your butt.")
      this.gameOver = true;
      this.doLose();
    } else if (newRoom.locked) {
      this.doLocked();
      this.targetRoom = newRoom;
      console.log("Target room is now: " + newRoom);
    } else {
      this.room = newRoom;
      this.enterRoom();
      // if (this.room == room23) {
      //   this.doWinGame();
      // }
      // if the above three lines are commented out, the only way to win the game is to input "save princes" and this can be done at any point during the game.
    }
  }
  doInspect() {
    printToDisplay(this.room.secondDescription);
  }
  doRestart() {
    window.location.reload();
  }
  doLocked() {
    printToDisplay("This room is locked.");
  }
  doUnlock(room) {
    room.doUnlockRoom();
  }
  doWinGame() {
    printToDisplay("\n\nYou have successfully saved the princes! \nCongratulations, you have won the game.\n\nWould you like to restart the game? (Y/N)");
    this.gameOver = true
  }

  doLose() {
    printToDisplay("\n\nGAME OVER\n\nWould you like to restart the game? (Y/N)");
  }

  doInventory() {
    printToDisplay("You are carrying the following:");
    for (var i = 0; i < this.inventory.length; i++) {
      printToDisplay("- " + this.inventory[i].name);
    }

  }

  doHelp() {
    printToDisplay("Oh, you need help?\n\nYou can travel North, South, East, and West by typing 'go (direction)'\nYou can pick up an item by typing 'take (item)'\nYou can drop an item by typing 'drop (item)'\nYou can check your inventory by typing 'inventory'\nYou can restart the game by typing 'restart'\nYou can further inspect your surroundings by typing 'look'\nIf prompted to click, type 'click'");
  }

  doDrop(itenName) {
    var item = this.findItem(itenName, this.inventory);
    if (item == null) {
      printToDisplay("Sorry, but I do not seem to be carrying that.");
      // document.getElementById('prompt1').innerHTML = prompt_one;
    } else if (item.shortName == 'perfume') {
      printToDisplay("You dropped the bottle of perfume and it shattered on the floor.");
      item.broken = true;
      if (this.room == room19) {
        printToDisplay("The dragon had an allergic reaction to the perfume.\nYou have accidentally slayed the dragon!");
        room20.setBlocked(false);
      }
      for (var i = 0; i < this.inventory.length; i++) {
        if (this.inventory[i] === item) {
          this.inventory.splice(i, 1);
        }
      }
          this.room.items.push(item);
    } else if (item.shortName == 'turkey') {
      if (this.room == room19) {
        printToDisplay("The dragon wakes up to the smell of Turkey Leg\n\nThe dragon eats the Turkey Leg, but craves more.\n\nThe dragon swallows you in one bite!");
        this.gameOver = true;
        this.doLose();
      }
    } else if (item.shortName == 'candle') {
      console.log("the user has dropped the candle");
      printToDisplay("You drop the lit candle and it immediately ignites the room you are in.\n\nYou are burnt to a crisp.");
      this.gameOver = true;
      this.doLose();
    } else {

      for (var i = 0; i < this.inventory.length; i++) {
        if (this.inventory[i] === item) {
          this.inventory.splice(i, 1);
          printToDisplay("* You drop the " + item.name + " *");
        }
      }

      // this.inventory.remove(item);
      this.room.items.push(item);
    }
  }

  doGet(itemName) {
    console.log("Attempting to doGet an item...");
    console.log("Room items: ");
    console.log(this.room.items);
    var item = this.findItem(itemName, this.room.items);
    if (item == null) {
      printToDisplay("Sorry, but I do not see that here.")
      // document.getElementById('prompt1').innerHTML = prompt_one;
    } else if (this.inventory.length == 4) {
      printToDisplay("You can not carry any more items.");
      // document.getElementById('prompt1').innerHTML = prompt_one;
    } else if (item.broken) {
      printToDisplay("I'm sorry, but this item is broken.");
    } else {

      for (var i = 0; i < this.room.items.length; i++) {
        if (this.room.items[i] === item) {
          this.room.items.splice(i, 1);
          printToDisplay("* You pick up the " + item.name + " *");
        }
      }

      // this.room.items.remove(item);
      this.inventory.push(item);
    }
  }
}

function startUpGame() {
  console.log("Generating Rooms...");
  room1 = new Room('Starting Location', "You see the castle to the North.", [], "It is said that one must give up their privacy and sell their identity\nupon entering this castle.");
  room2 = new Room('Stables', "You find the stables. There are a lot of horses here.", [new Item("Pocket-Sized Horse", "horse")], "You see a Pocket-Sized Horse among the regular-sized horses.\n\nUpon further inpsection, you notice that\nthe horses have cameras for eyes.");
  room3 = new Room('Dovecote', "Wow! There is an absurd amount of doves inside\na large stone dome. Must be the dovecote.", [], "You notice that the doves are singing the same song\nyour mother used to sing to you in your childhood.\n\nHow do they know this song?");
  room4 = new Room('Ice House', "You enter the icehouse. It's freezing in here!\nA perfect cube of ice sits among several chunks.", [ice = new Item("Ice Cube", "ice")], "There is a sign that reads: \nSmile! You're on camera.");
  room5 = new Room('Bridge', "You are halfway across the bridge that leads to \nthe entrance of the castle.", [], "You hear a troll under the bridge. They yell:\nYou there! I know your name. I know your address.");
  room6 = new Room('Gate House', "You gently push the gate open and enter the castle. \nSo much for fortification!", [], "The castle is expansive... and brilliant!\nYou notice a security camera hanging in the corner of the ceiling.\nA guestbook sits on a pedestal to your right.");
  room7 = new Room('Hallway', "You enter an empty hallway.", [], "The hallway is almost as wide as it is long.\n\nA blue wire runs along the floor, disappearing into the wall.");
  room8 = new Room('Armory', "You find yourself in the armory. It is completely \nempty except for a super shiny sword and a really rusty shield.", [new Item("Super Shiny Sword", "sword"), new Item("Really Rusty Shield", "shield")],"Not much to see. Just a room with a sword and a shield.");
  room9 = new Room('Larder', "Here you are in the larder; many shelves hold food \nand meat hangs from hooks in the ceiling.", [new Item("Turkey Leg", "turkey")],"That Turkey Leg looks delicious, doesn't it?");
  room10 = new Room('Buttery', "Many tapped barrels of beer lay sideways on a table. \nPerhaps you should reward yourself for making it this far.", [], "If you wanted to, you could drink your body weight in beer.");
  room11 = new Room('Bathroom', "You're now in the garderobe. The latrine is located here; \nI would use it now before you go any further.", [], "You notice a blue wire that runs from the wall into the toilet.");
  room12 = new Room('Pantry', "You're now in the pantry. Food lines the shelves. \nYou notice a loaf of bread on the ground in the middle of the room.", [new Item("Loaf of Bread", "bread"), new Item("Better-Looking Bread", "sourdough")], "You notice a better looking loaf of sourdough on one of the shelves.");
  room13 = new Room('Great Hall South', "You are now in the south end of the great hall. \nThe ceiling is taller than the hall is wide. \nThe room stretches to the north.", [], "You notice a mirror on the wall, but you \ndo not see yourself in the relfection.\n\nIt is as if it was taken from you.");
  room14 = new Room('Kitchen', "You enter the kitchen. It is completely empty except for one big spoon.", [new Item("Big Spoon", "spoon")], "You notice a red wire running along the edge between\nthe wall and the ceiling.");
  room15 = new Room('Hallway', "You enter an empty hallway.", [], "This hall is completely empty.");
  room16 = new Room('Great Hall North', "You are now in the north end of the great hall. \nThe ceiling is taller than the hall is wide. \nThe room stretches to the south.", [], "A large painting sits on the north wall. It is a portrait of you.");
  room17 = new Room('Hallway', "You are in an empty hallway.", [], "You notice a security camera in the corner of the room.");
  room18 = new Room('Hallway', "You find yourself in a hallway. It is empty.", [],"You look out the window; on the other side is\nyourself walking in a hallway.");
  room19 = new Room('Dragon Room', "You enter a room where a dragon is sleeping.", [],"On the other side of the dragon is a door;\nabove the door, a security camera.");
  room20 = new Room('Hallway', "You are in an empty hallway.", [], "You hear giggling behind the door to the west.\nYou swear that you heard your name amongst the giggles.");
  room21 = new Room('Solar', "You find yourself in the solar. \nThere are a lot of comfy chairs; \nbeautiful works of art hang on the walls.", [], "You notice that one of the paintings on the walls is a \npainting of your dog. You use your dog's name as a\npassword for most of your accounts.");
  room22 = new Room('Bed Chamber', "You are in the bed chamber. Obviously, there is a bed in here.", [], "Wait a second! This bed has the same sheets as \nmy bed back at home!");
  room23 = new Room('Princes Room', "You enter a room with several princes. \nThey are all talking to you at once, \nand you can not make out what any of them are saying, \nbut they seem grateful.", [], "One of the princes looks at you differently than the others do.");
  room24 = new Room('Chapel', "You are now in the chapel. There are hundreds of lit candles. \nAn organ plays a familiar tune.", [new Item("Lit Candle", "candle")], "Upon further inspectoin, you conclude that this\nmany unnatended candles is a fire hazard.");
  room25 = new Room('Boudoir', "You are in the boudoir. You notice a bottle of perfume; \nthe label reads, 'Dragon's Breath.'", [new Item("Dragon's Breath Perfume", "perfume")], "You read the fine print on the bottle. It says:\n\nBy handling this perfume you are automatically accepting\nthe terms of our user agreement. Your information belongs\nto us, and we are allowed to do whatever we would like with it.");


  console.log("Setting Exits...");
  room1.setExit('North', room5);
  room1.setExit('West', room2);
  room1.setExit('South', room3);
  room1.setExit('East', room4);
  room2.setExit('East', room1);
  room3.setExit('North', room1);
  room4.setExit('West', room1);
  room5.setExit('South', room1);
  room5.setExit('North', room6);
  room6.setExit('South', room5);
  room6.setExit('West', room7);
  room6.setExit('North', room13);
  room6.setExit('East', room11);
  room7.setExit('East', room6);
  room7.setExit('West', room8);
  room8.setExit('East', room7);
  room8.setLocked(true);
  room9.setExit('West', room10);
  room10.setExit('East', room9);
  room10.setExit('North', room12);
  room10.setExit('West', room11);
  room11.setExit('East', room10);
  room11.setExit('West', room6);
  room11.setLocked(true);
  room12.setExit('South', room10);
  room12.setExit('North', room14);
  room13.setExit('South', room6);
  room13.setExit('North', room16);
  room14.setExit('South', room12);
  room14.setExit('West', room15);
  room15.setExit('East', room14);
  room15.setExit('North', room17);
  room15.setExit('West', room16);
  room15.setLocked(true);
  room16.setExit('East', room15);
  room16.setExit('South', room13);
  room16.setExit('West', room24);
  room17.setExit('South', room15);
  room17.setExit('North', room18);
  room18.setExit('South', room17);
  room18.setExit('East', room25);
  room18.setExit('West', room19);
  room18.setExit('North', room21);
  room19.setExit('East', room18);
  room19.setExit('West', room20);
  room20.setBlocked(true);
  room20.setExit('East', room19);
  room20.setExit('North', room22);
  room20.setExit('West', room23);
  room21.setExit('South', room18);
  room22.setExit('South', room20);
  room22.setLocked(true);
  room23.setExit('East', room20);
  room23.setLocked(true);
  room24.setExit('East', room16);
  room25.setExit('West', room18);
  room25.setLocked(true);

  console.log("Constructing Game...");
  game = new Game(room1, []);

  console.log("Playing Game...");
  // game.play();
}

function printToDisplay(outputString) {
  console.log("Printing: " + outputString);
  var outputFormatted = "\n\n";
  outputFormatted += outputString;
  outputElement.innerHTML += outputFormatted;
  scrollToBottom();
}

function scrollToBottom() {
  outputElement.scrollTop = outputElement.scrollHeight;
}
