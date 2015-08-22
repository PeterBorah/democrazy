contract Democrazy {
  address[] public players;
  mapping(address => bytes32) public commitments;

  function add_player(address _player) {
    players[players.length++] = _player;
  }

  function num_players() returns(uint) {
    return players.length;
  }

  function commit(bytes32 commitment) {
    commitments[msg.sender] = commitment;
  }
}
