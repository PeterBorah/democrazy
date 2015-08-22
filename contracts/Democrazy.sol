contract Democrazy {
  address[] public players;

  function add_player(address _player) {
    players[players.length++] = _player;
  }

  function num_players() returns(uint) {
    return players.length;
  }
}
