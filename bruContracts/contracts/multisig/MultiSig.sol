//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "../core/BruPool.sol";
import "../core/BruOracle.sol";
import "../core/BruRewards.sol";
import "../core/BruFactory.sol";
import "../core/BruPrice.sol";
import "../tokens/PoolToken.sol";
import "../vesting/VestingBurn.sol";
import "../vesting/Token.sol";
import "../wallets/ReserveWallet.sol";
import "../wallets/NIIMargin.sol";
import "../wallets/UnclaimedCashflowWallet.sol";
import "../BruRouter.sol";
import "../core/AssetTreasury.sol";

contract MultiSig is Initializable, UUPSUpgradeable {
    uint256 public quorum; // the number of votes required for approval
    address internal factoryAddress; // address of BruFactory contract
    address internal routerAddress; // address of BruRouter contract
    address internal reserveWalletAddress; // address of ReserveWallet contract
    address internal NIIWalletAddress; // address of NIIMargin contract
    address internal burnVestingAddress; // address of VestingBurn contract
    address internal rewardsAddress; // address of BruFactory contract
    address internal oracleAddress; // address of BruRewards contract
    address internal tokenAddress; // address of Bru token contract
    address internal treasuryAddress; // address of AssetTreasury contract
    address internal unClaimedWalletAddress; // address of UnclaimedCashflowWallet contract
    address internal bruPriceAddress; // address of BruPrice contract
    /**
     * @notice List of approvers address
     */
    address[] public approvers;
    /**
     * @notice The index of the approver address in the approvers array
     */
    mapping(address => uint256) internal approverIndex;
    /**
     * @notice List of proposals created
     */
    Proposal[] public proposals;

    //stuct to store the Proposal details
    struct Proposal {
        uint256 id;
        uint256 functionId;
        uint256[] value;
        address[] addr;
        string[] str;
        uint256 approvals;
        bool sent;
    }

    // struct which is used to initialize multisig contract
    struct MultiSigParams {
        address factoryAddress;
        address[] approvers;
        uint256 quorum;
        address routerAddress;
        address reserveWalletAddress;
        address NIIWalletAddress;
        address burnVestingAddress;
        address rewardsAddress;
        address oracleAddress;
        address tokenAddress;
        address treasuryAddress;
        address unClaimedWalletAddress;
        address bruPriceAddress;
    }

    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public approvals; // check approver already vote for a proposal
    mapping(address => bool) public isApprover; // check if user address is approver or not

    /**
     * @notice Emitted when number of quorum update
     * @param _value The number of quorum
     */
    event QuorumUpdated(uint256 _value);

    /**
     * @notice Emitted when new approver is added
     * @param _approverAddress The address of the newly added approver
     */
    event ApproverAdded(address _approverAddress);
    /**
     * @notice Emitted when approver removed
     * @param _approverAddress The address of the removed approver
     */
    event ApproverRemoved(address _approverAddress);

    /**
     * @dev Used to check the accessibility and only allows the approvers to access the functions.
     */
    modifier onlyApprover() {
        require(isApprover[msg.sender], "only approver allowed");
        _;
    }

    /**
     * @notice Initializes the necessary contract addresses in the contract
     * @param _params Is type of multiSigParams
     */
    function initialize(MultiSigParams memory _params) external virtual initializer {
        approvers = _params.approvers;
        factoryAddress = _params.factoryAddress;
        quorum = _params.quorum;
        routerAddress = _params.routerAddress;
        reserveWalletAddress = _params.reserveWalletAddress;
        NIIWalletAddress = _params.NIIWalletAddress;
        burnVestingAddress = _params.burnVestingAddress;
        rewardsAddress = _params.rewardsAddress;
        oracleAddress = _params.oracleAddress;
        tokenAddress = _params.tokenAddress;
        treasuryAddress = _params.treasuryAddress;
        unClaimedWalletAddress = _params.unClaimedWalletAddress;
        bruPriceAddress = _params.bruPriceAddress;
        for (uint8 i = 0; i < approvers.length; i++) {
            isApprover[approvers[i]] = true;
            approverIndex[approvers[i]] = i + 1;
        }
    }

    /**
     * @notice Creates a proposal that is going to approved by approvers
     * @param _value array of integer values
     * @param _functionId Id of the function we wanted to execute
     * @param _addr array of the addresses
     * @param _str array of the string inputs
     */
    function createProposal(
        uint256[] memory _value,
        uint256 _functionId,
        address[] memory _addr,
        string[] memory _str
    ) external virtual onlyApprover {
        proposals.push(Proposal(proposals.length, _functionId, _value, _addr, _str, 0, false));
    }

    /**
     * @notice Used to get all available proposals
     * @return The list of all proposal available
     */
    function getAllProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    /**
     * @notice Used to get the address of approvers
     * @return The list of all approvers address
     */
    function getAllApprovers() external view returns (address[] memory) {
        return approvers;
    }

    /**
     * @notice This function executes the proposal incase approved by members more than quorum.
     * @param _functionId Id of the function which is executed
     * @param _id Id of the proposal to approve
     */
    function approveTransfer(uint256 _functionId, uint256 _id) external virtual onlyApprover {
        require(!proposals[_id].sent, "Proposal already executed");
        require(!approvals[msg.sender][_functionId][_id], "cannot approve proposal twice");
        address poolAddress;
        approvals[msg.sender][_functionId][_id] = true;
        proposals[_id].approvals++;

        if (proposals[_id].approvals >= quorum) {
            proposals[_id].sent = true;
            if (_functionId == 0) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeLockPeriod(proposals[_id].value[1]);
            } else if (_functionId == 1) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeSpread(proposals[_id].value[1]);
            } else if (_functionId == 3) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeBorrowInterestRate(proposals[_id].value[1]);
            } else if (_functionId == 4) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeBorrowPlatformFee(proposals[_id].value[1]);
            } else if (_functionId == 5) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeLendPlatformFee(proposals[_id].value[1]);
            } else if (_functionId == 6) {
                updateQuorum(proposals[_id].value[0]);
            } else if (_functionId == 7) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).allowTokenAddress(proposals[_id].addr[0]);
            } else if (_functionId == 8) {
                addApprover(proposals[_id].addr[0]);
            } else if (_functionId == 9) {
                removeApprover(proposals[_id].addr[0]);
            } else if (_functionId == 10) {
                address interestTokenAddress = BruFactory(factoryAddress)
                    .getPoolDetails(proposals[_id].value[0])
                    .interestTokenAddress;
                PoolToken(interestTokenAddress).changeName(proposals[_id].str[0]);
            } else if (_functionId == 11) {
                address poolTokenAddress = BruFactory(factoryAddress)
                    .getPoolDetails(proposals[_id].value[0])
                    .poolTokenAddress;
                PoolToken(poolTokenAddress).changeName(proposals[_id].str[0]);
            } else if (_functionId == 12) {
                BruRouter(routerAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 13) {
                BruFactory(factoryAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 14) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 15) {
                this.upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 16) {
                VestingBurn(burnVestingAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 18) {
                NIIMargin(NIIWalletAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 19) {
                ReserveWallet(reserveWalletAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 20) {
                BruRewards(rewardsAddress).changeEmission(proposals[_id].value[0]);
            } else if (_functionId == 21) {
                BruRewards(rewardsAddress).startRewardsForPool(proposals[_id].value[0], proposals[_id].value[1]);
            } else if (_functionId == 22) {
                BruRewards(rewardsAddress).stopRewardsForPool(proposals[_id].value[0]);
            } else if (_functionId == 23) {
                address interestTokenAddress = BruFactory(factoryAddress)
                    .getPoolDetails(proposals[_id].value[0])
                    .interestTokenAddress;
                PoolToken(interestTokenAddress).setPoolAddress(proposals[_id].addr[0]);
            } else if (_functionId == 24) {
                address poolTokenAddress = BruFactory(factoryAddress)
                    .getPoolDetails(proposals[_id].value[0])
                    .poolTokenAddress;
                PoolToken(poolTokenAddress).setPoolAddress(proposals[_id].addr[0]);
            } else if (_functionId == 25) {
                BruOracle(oracleAddress).setBruTokenPrice(proposals[_id].value[0]);
            } else if (_functionId == 26) {
                Token(tokenAddress).enableMinting(proposals[_id].addr[0]);
            } else if (_functionId == 28) {
                VestingBurn(burnVestingAddress).addTokenDistribution(proposals[_id].value[0], proposals[_id].value[1]);
            } else if (_functionId == 29) {
                VestingBurn(burnVestingAddress).startExchange(
                    proposals[_id].value[0],
                    proposals[_id].addr[0],
                    proposals[_id].value[1],
                    proposals[_id].value[2],
                    proposals[_id].value[3]
                );
            }
            // have skipped one Id as we removed the functionality and wanted to keep rest as it is
            else if (_functionId == 32) {
                BruFactory(factoryAddress).addPoolDetails(
                    proposals[_id].str[0],
                    proposals[_id].addr[0],
                    proposals[_id].addr[1],
                    proposals[_id].addr[2],
                    proposals[_id].addr[3],
                    proposals[_id].addr[4]
                );
            } else if (_functionId == 33) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeCoreFunctionalityStatus();
            } else if (_functionId == 34) {
                VestingBurn(burnVestingAddress).changePauseStatus();
            } else if (_functionId == 35) {
                BruRewards(rewardsAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 36) {
                BruOracle(oracleAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 37) {
                AssetTreasury(treasuryAddress).changeMintWalletAddress(proposals[_id].addr[0]);
            } else if (_functionId == 38) {
                NIIMargin(NIIWalletAddress).startClaimPeriod(proposals[_id].addr[0]);
            } else if (_functionId == 39) {
                NIIMargin(NIIWalletAddress).stopClaimPeriod();
            } else if (_functionId == 40) {
                ReserveWallet(reserveWalletAddress).transferTo(
                    proposals[_id].addr[0],
                    proposals[_id].value[0],
                    proposals[_id].addr[1]
                );
            } else if (_functionId == 41) {
                UnClaimedCashFlowWallet(unClaimedWalletAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 42) {
                UnClaimedCashFlowWallet(unClaimedWalletAddress).transferTo(
                    proposals[_id].addr[0],
                    proposals[_id].value[0],
                    proposals[_id].addr[1]
                );
            } else if (_functionId == 43) {
                NIIMargin(NIIWalletAddress).sendAmount(
                    proposals[_id].value[0],
                    proposals[_id].addr[0],
                    proposals[_id].addr[1]
                );
            } else if (_functionId == 44) {
                BruPrice(bruPriceAddress).upgradeTo(proposals[_id].addr[0]);
            } else if (_functionId == 45) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).removeTokenAddress(proposals[_id].addr[0]);
            } else if (_functionId == 46) {
                VestingBurn(burnVestingAddress).changeMaxVestingSchedules(proposals[_id].value[0]);
            } else if (_functionId == 47) {
                VestingBurn(burnVestingAddress).changeMaxCategories(proposals[_id].value[0]);
            } else if (_functionId == 48) {
                UnClaimedCashFlowWallet(unClaimedWalletAddress).changeMaxAllowedUnClaimed(proposals[_id].value[0]);
            } else if (_functionId == 49) {
                Token(tokenAddress).disableMinting(proposals[_id].addr[0]);
            } else if (_functionId == 50) {
                Token(tokenAddress).createSnapshot();
            } else if (_functionId == 51) {
                BruFactory(factoryAddress).changeMaxPool(proposals[_id].value[0]);
            } else if (_functionId == 52) {
                poolAddress = BruFactory(factoryAddress).getPoolDetails(proposals[_id].value[0]).proxyPoolAddress;
                BruPool(poolAddress).changeMaxAddresses(proposals[_id].value[1]);
            } else if (_functionId == 53) {
                BruOracle(oracleAddress).setPriceFeedForToken(proposals[_id].addr[0], proposals[_id].addr[1]);
            } else {
                revert("Invalid Function ID");
            }
        }
    }

    /**
     * @notice function to change the value of quorum
     * @param _value latest value of quorum
     */
    function updateQuorum(uint256 _value) internal {
        require(approvers.length >= _value, "quorum greater than number of approvers");
        quorum = _value;
        emit QuorumUpdated(_value);
    }

    /**
     * @dev Checks if the wallet initiating the upgrade transaction for a pool is the admin or not
     * @param _newImplementation Address of the new implementation contract for upgradation.
     */
    function _authorizeUpgrade(address _newImplementation) internal view override {
        require(msg.sender == address(this), "Not authenticated");
    }

    /**
     * @notice Add Approver to apporvers list
     * @param _approverAddress The new approver address
     */
    function addApprover(address _approverAddress) internal {
        require(_approverAddress != address(0), "Invalid address");
        approvers.push(_approverAddress);
        isApprover[_approverAddress] = true;
        approverIndex[_approverAddress] = approvers.length;
        emit ApproverAdded(_approverAddress);
    }

    /**
     * @notice Removes Approver from approvers list
     * @param  _approverAddress The address of the approver going to be removed
     */
    function removeApprover(address _approverAddress) internal {
        require(isApprover[_approverAddress], "Not approver");
        isApprover[_approverAddress] = false;
        uint256 index = approverIndex[_approverAddress];
        approvers[index - 1] = approvers[approvers.length - 1];
        approverIndex[approvers[approvers.length - 1]] = index;
        delete approverIndex[_approverAddress];
        approvers.pop();
        emit ApproverRemoved(_approverAddress);
    }
}
