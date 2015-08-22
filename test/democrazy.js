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

  it("should let players add their commitments", function(done) {
    var democrazy = Democrazy.at(Democrazy.deployed_address);
    var commitment = 0xf25fe1d943db0d3853b6931c487128a31c8adb972e15da792f090739ba3f1e06 //sha256 of "1foo"

    democrazy.add_player(accounts[0]).
      then(function() { return democrazy.commit(commitment) }).
      then(function() { return democrazy.commitments.call(accounts[0]) }).
      then(function(result) {
        assert.equal(result, commitment);
        done();
    }).catch(done);
  });
});
