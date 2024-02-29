const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  it("constructor sets position and default values for mode and generatorWatts", function(){
    let rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
    expect(rover.mode).toEqual('NORMAL');
    expect(rover.generatorWatts).toEqual(110);
  });
  it("response returned by receiveMessage contains the name of the message", function(){
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Testing', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.message).toEqual('Testing')
  });
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
    let commands = [new Command('STATUS_CHECK'), new Command('MODE_CHANGE','LOW_POWER')];
    let message = new Message("testing Two Commands", commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results.length).toEqual(2);
  });
  it("responds correctly to the status check command", function(){
    let commands = [new Command('STATUS_CHECK')];
    let message = new Message('Status check', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(response.results[0].roverStatus).toEqual({mode:'NORMAL', generatorWatts: 110, position: 98382})
  });
  it("resonds correctly to the mode change command", function(){
    let commands = [new Command("MODE_CHANGE", "LOW_POWER")];
    let message = new Message('Test', commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.mode).toEqual("LOW_POWER");
  });
  it("resonds with a false completed value when attempting to move in LOW_POWER mode", function(){
    let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE"), 400];
    let message = new Message("test low power mode move", commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[1].completed).toEqual(false);
    expect(rover.mode).toEqual("LOW_POWER");
    expect(rover.position).toEqual(98382);
  });
  it("resonds with the position for the move command", function(){
    let commands = [new Command("MOVE", 400)];
    let message = new Message("test move", commands);
    let rover = new Rover(98382);
    let response = rover.receiveMessage(message);
    expect(response.results[0].completed).toEqual(true);
    expect(rover.position).toEqual(400);
  });
});