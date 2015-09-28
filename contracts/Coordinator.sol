import "Democrazy";

contract Coordinator {
  Democrazy public game;
  uint public voting_length;
  uint public reveal_length;
  uint public phase;
  uint public phase_start;
  address public admin;

  modifier only_admin { if (msg.sender == admin) _ }
  
  function Coordinator() {
    admin = msg.sender;
  }

  function set_admin(address _admin) only_admin {
    admin = _admin;
  }

  function create_game(uint _voting_length, uint _reveal_length) only_admin {
    game = new Democrazy();
    voting_length = _voting_length;
    reveal_length = _reveal_length;
  }

  function start_game() only_admin {
    phase = 1;
    phase_start = block.number;
  }

  function add_player(address _player) only_admin {
    game.add_player(_player);
  }

  function ping() {
    if (phase == 1 && block.number - phase_start > voting_length) {
      phase = 2;
      game.advance_phase();
      phase_start = block.number;
    } else if (block.number - phase_start > reveal_length) {
      phase = 1;
      game.advance_phase;
      phase_start = block.number;
    }
  }
}
