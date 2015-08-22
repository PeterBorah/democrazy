contract Democrazy {
  address[] public players;
  mapping(address => bytes32) public commitments;
  mapping(address => uint8) public votes;

  function add_player(address _player) {
    players[players.length++] = _player;
  }

  function num_players() returns(uint) {
    return players.length;
  }

  function commit(bytes32 commitment) {
    commitments[msg.sender] = commitment;
  }

  function reveal(uint8 vote, string seed) {
    string memory vote_string;

    if (vote == 1) {
      vote_string = "1";
    } else {
      vote_string = "2";
    }

    if (sha256(vote_string, seed) == commitments[msg.sender]) {
      votes[msg.sender] = vote;
    }
  }
}
