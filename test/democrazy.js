

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
    var commitment = "0xf25fe1d943db0d3853b6931c487128a31c8adb972e15da792f090739ba3f1e06" //sha256 of "1foo"

    democrazy.add_player(accounts[0]).
      then(function() { return democrazy.commit(commitment) }).
      then(function() { return democrazy.commitments.call(accounts[0]) }).
      then(function(result) {
        assert.equal(result, commitment);
        done();
    }).catch(done);
  });

  it("should let commitments become votes", function(done) {
    var democrazy = Democrazy.at(Democrazy.deployed_address);
    var commitment = "0xf25fe1d943db0d3853b6931c487128a31c8adb972e15da792f090739ba3f1e06" //sha256 of "1foo"

    democrazy.add_player(accounts[0]).
      then(function() { return democrazy.commit(commitment) }).
      then(function() { return democrazy.advance_phase() }).
      then(function() { return democrazy.reveal(1, "foo") }).
      then(function() { return democrazy.votes.call(accounts[0]) }).
      then(function(result) {
        assert.equal(result, 1);
        done();
    }).catch(done);
  });

  it("should reward according to the round", function(done) {
    var commitment_1 = "0xf25fe1d943db0d3853b6931c487128a31c8adb972e15da792f090739ba3f1e06"; //sha256 of "1foo"
    var commitment_2 = "0x377195904c99497c2cdb7aaecaf541ca717f34e5357dace55ebb1711d54190c2"; //sha256 of "2foo"

    Democrazy.new().
    then(function(democrazy) {
      democrazy.add_player(accounts[0]).
        then(function() { return democrazy.commit(commitment_1) }).
        then(function() { return democrazy.add_player(accounts[1]) }).
        then(function() { return democrazy.commit(commitment_1, {from: accounts[1]}) }).
        then(function() { return democrazy.add_player(accounts[2]) }).
        then(function() { return democrazy.commit(commitment_2, {from: accounts[2]}) }).
        then(function() { return democrazy.advance_phase() }).
        then(function() { return democrazy.reveal(1, "foo") }).
        then(function() { return democrazy.reveal(1, "foo", {from: accounts[1]}) }).
        then(function() { return democrazy.reveal(2, "foo", {from: accounts[2]}) }).
        then(function() { return democrazy.advance_phase() }).
        then(function() { return democrazy.balances.call(accounts[0]) }).
        then(function(result) { assert.equal(result, 10050) }).
        then(function() { return democrazy.balances.call(accounts[1]) }).
        then(function(result) { assert.equal(result, 10050) }).
        then(function() { return democrazy.balances.call(accounts[2]) }).
        then(function(result) {
          assert.equal(result, 9900)
          done();
      }).catch(done)
    }).catch(done)
  });
});
