contract Democrazy {
  address[] public players;
  mapping(address => bool) public is_player;
  mapping(address => bytes32) public commitments;
  mapping(address => uint8) public votes;
  mapping(address => uint) public balances;
  uint[3] public total_votes;
  uint public round;
  address public admin;

  modifier only_admin { if (msg.sender == admin) _ }
  modifier only_player { if (is_player[msg.sender] == true) _ }

  function Democrazy() {
    admin = msg.sender;
  }

  function set_admin(address _admin) {
    admin = _admin;
  }

  function add_player(address _player) only_admin {
    players[players.length++] = _player;
    is_player[_player] = true;
    balances[_player] = 10000;
  }

  function num_players() returns(uint) {
    return players.length;
  }

  function commit(bytes32 commitment) only_player {
    commitments[msg.sender] = commitment;
  }

  function reveal(uint8 vote, string seed) only_player {
    string memory vote_string;

    if (vote == 1) {
      vote_string = "1";
    } else {
      vote_string = "2";
    }

    if (sha256(vote_string, seed) == commitments[msg.sender]) {
      votes[msg.sender] = vote;
      total_votes[vote] += 1;
    }
  }

  function end_round() only_admin {
    uint8 majority;
    uint8 minority;
    uint8 winning_team;

    if (total_votes[1] > total_votes[2]) {
      majority = 1;
      minority = 2;
    } else {
      majority = 2;
      minority = 1;
    }
    
    if (round % 2 == 1) {
      winning_team = majority;
    } else {
      winning_team = minority;
    }

    uint prize_value = (players.length * 100) / total_votes[winning_team];
      
    for (uint i; i < players.length; i++) {
      address player = players[i];
      if (votes[player] == winning_team) {
        balances[player] += prize_value - 100;
      } else {
        balances[player] -= 100;
      }

      votes[player] = 0;
      commitments[player] = "";
    }
    
    delete total_votes;
    round++;
  }

}
