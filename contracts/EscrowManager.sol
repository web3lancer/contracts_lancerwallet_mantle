// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EscrowManager {
    enum State { AWAITING_FUND, FUNDED, RELEASED, REFUNDED }

    struct Escrow {
        address payer;
        address payee;
        uint256 amount;
        State state;
    }

    Escrow[] public escrows;

    event EscrowCreated(uint indexed id, address indexed payer, address indexed payee, uint256 amount);
    event EscrowFunded(uint indexed id);
    event EscrowReleased(uint indexed id);
    event EscrowRefunded(uint indexed id);

    function createEscrow(address payee) external payable returns (uint) {
        require(payee != address(0), "invalid payee");
        require(msg.value > 0, "amount must be > 0");

        Escrow memory e = Escrow({payer: msg.sender, payee: payee, amount: msg.value, state: State.FUNDED});
        escrows.push(e);
        uint id = escrows.length - 1;
        emit EscrowCreated(id, msg.sender, payee, msg.value);
        emit EscrowFunded(id);
        return id;
    }

    function release(uint id) external {
        Escrow storage e = escrows[id];
        require(e.state == State.FUNDED, "not funded");
        require(msg.sender == e.payer || msg.sender == e.payee, "only parties can release");
        e.state = State.RELEASED;
        payable(e.payee).transfer(e.amount);
        emit EscrowReleased(id);
    }

    function refund(uint id) external {
        Escrow storage e = escrows[id];
        require(e.state == State.FUNDED, "not funded");
        require(msg.sender == e.payer || msg.sender == e.payee, "only parties can refund");
        e.state = State.REFUNDED;
        payable(e.payer).transfer(e.amount);
        emit EscrowRefunded(id);
    }

    function getEscrow(uint id) external view returns (Escrow memory) {
        return escrows[id];
    }
}
