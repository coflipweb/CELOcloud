
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}


contract FileUpload {
    
    //address of  the owner
    address internal contractOwner;

    //amount someone should pay to store files
    uint internal storageFee = 10**18;

     //address of the token contract
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;


    // Define a struct for a File
    struct File {
        address owner;
        string hash;
        string name;
        string description;
        string location;
    }


    //initialize the contract owner
    constructor(){
        contractOwner = msg.sender;
    }


    // Create a mapping from an address to a list of Files
    mapping(address => File[]) public files;


    // Define a function to upload a new file to the mapping
    function uploadFile(
        string calldata _hash, // IPFS hash of the file
        string calldata _name, // Name of the file
        string calldata _description, // Description of the file
        string calldata _location // Location of the file
    ) public payable{

        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                contractOwner,
                 storageFee
            ),
            "fee payment failed"
        );
        

        // Create a new File instance with the provided data and the sender's address as the owner
        File memory newFile = File(msg.sender, _hash, _name, _description, _location);
        // Add the new File to the mapping under the sender's address
        files[msg.sender].push(newFile);
    }


    // Define a function to retrieve a list of Files for a given address
    function getFiles() public view returns (File[] memory) {
        return files[msg.sender];
    }


    // Define a function to retrieve the number of Files for a given address
    function getFileCount(address user) public view returns (uint256) {
        return files[user].length;
    }


    // Define a function to delete a file at a given index for the sender's address
    function deleteFile(uint256 index) public {
        // Ensure the index is within range
        require(index < files[msg.sender].length, "Invalid index");
        // Shift all files after the specified index down by one to remove the file at the given index
        for (uint256 i = index; i < files[msg.sender].length-1; i++) {
            files[msg.sender][i] = files[msg.sender][i+1];
        }
        // Remove the last file from the list (which is now a duplicate of the second-to-last file)
        files[msg.sender].pop();
    }
}
