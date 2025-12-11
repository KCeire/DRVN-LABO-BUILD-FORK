// SPDX-License-Identifier: MIT

//   ____       ____       ____        _____       ____
// /\  _`\    /\  _`\    /\  _`\     /\  __`\    /\  _`\
// \ \ \/\ \  \ \ \L\ \  \ \ \L\ \   \ \ \/\ \   \ \,\L\_\
//  \ \ \ \ \  \ \  _ <'  \ \ ,  /    \ \ \ \ \   \/_\__ \
//   \ \ \_\ \  \ \ \L\ \  \ \ \\ \    \ \ \_\ \    /\ \L\ \
//    \ \____/   \ \____/   \ \_\ \_\   \ \_____\   \ `\____\
//     \/___/     \/___/     \/_/\/ /    \/_____/    \/_____/

// 01000100 01000010 01010010 01001111 01010011
// Built by: Decentral Bro's: https://www.decentralbros.io

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title RS1Token
 * @notice Governance-enabled RWA token for a single vehicle (RS1).
 *         - ERC20Votes for DAO / iVotes compatibility
 *         - Adjustable trading tax (default 0%)
 *         - Trading pause, controlled via DAO/roles
 */
contract RS1Token is ERC20, ERC20Permit, ERC20Votes, AccessControl {
    bytes32 public constant MINTER_ROLE       = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE       = keccak256("PAUSER_ROLE");
    bytes32 public constant TAX_MANAGER_ROLE  = keccak256("TAX_MANAGER_ROLE");
    bytes32 public constant DAO_ROLE          = keccak256("DAO_ROLE");

    /// @notice Global trading pause (used during auctions / ownership transfer)
    bool public tradingPaused;

    /// @notice Trading tax in basis points (1% = 100 bps). Default 0.
    uint16 public tradingTaxBps; // 0–1000 (max 10% by default guard)

    /// @notice Recipient for collected trading tax
    address public taxRecipient;

    event TradingPaused(bool paused);
    event TradingTaxUpdated(uint16 newBps, address indexed by);
    event TaxRecipientUpdated(address indexed newRecipient, address indexed by);

    constructor(
        string memory _name,
        string memory _symbol,
        address _admin,
        address _taxRecipient
    )
        ERC20(_name, _symbol)
        ERC20Permit(_name)
    {
        require(_admin != address(0), "admin zero");
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(DAO_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(PAUSER_ROLE, _admin);
        _grantRole(TAX_MANAGER_ROLE, _admin);

        taxRecipient = _taxRecipient;
    }

    // ---------- Admin / DAO Controls ----------

    function setTradingPaused(bool _paused) external onlyRole(PAUSER_ROLE) {
        tradingPaused = _paused;
        emit TradingPaused(_paused);
    }

    /**
     * @notice Set trading tax in basis points (0 = 0%, 100 = 1%, etc.)
     * @dev Intended to be controlled by DAO (via timelock / governor).
     */
    function setTradingTaxBps(uint16 _bps) external onlyRole(TAX_MANAGER_ROLE) {
        require(_bps <= 1000, "tax too high"); // e.g. max 10%
        tradingTaxBps = _bps;
        emit TradingTaxUpdated(_bps, msg.sender);
    }

    function setTaxRecipient(address _recipient) external onlyRole(TAX_MANAGER_ROLE) {
        require(_recipient != address(0), "recipient zero");
        taxRecipient = _recipient;
        emit TaxRecipientUpdated(_recipient, msg.sender);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // ---------- Core transfer + tax / pause logic ----------

    /**
     * @dev Override _transfer to inject trading pause and tax.
     *      This pattern works with OZ 4.9.x + ERC20Votes (tax logic in _transfer).
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    )
        internal
        override(ERC20)
    {
        // Allow minting/burning even when paused, but block user transfers.
        if (tradingPaused) {
            bool isMint = from == address(0);
            bool isBurn = to == address(0);
            if (!isMint && !isBurn) {
                // Optionally allow DAO to move tokens even when paused:
                if (!hasRole(DAO_ROLE, msg.sender)) {
                    revert("RS1: transfers paused");
                }
            }
        }

        uint256 sendAmount = amount;

        // Apply trading tax on normal transfers (not mint/burn) if enabled
        if (
            tradingTaxBps > 0 &&
            taxRecipient != address(0) &&
            from != address(0) &&
            to != address(0)
        ) {
            uint256 fee = (amount * tradingTaxBps) / 10_000;
            if (fee > 0) {
                sendAmount = amount - fee;
                // Transfer fee to taxRecipient
                super._transfer(from, taxRecipient, fee);
            }
        }

        super._transfer(from, to, sendAmount);
    }

    // ---------- ERC20Votes glue ----------

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    )
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}