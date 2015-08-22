contract('Democrazy', function(accounts) {
  it("should let you add a player", function(done) {
    var democrazy = Democrazy.at(Democrazy.deployed_address);

    democrazy.add_player(accounts[0]).
      then(function() { return democrazy.num_players.call() }).
      then(function(result) { assert.equal(result, 1) }).
      then(function() { return democrazy.players.call(0) }).
      then(function(result) {
        assert.equal(result, accounts[0]);
        done();
    }).catch(done);
  });
});
