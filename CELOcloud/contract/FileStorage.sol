
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileUpload {

    // Define a struct for a File
    struct File {
        address owner;
        string hash;
        string name;
        string description;
        string location;
    }

    // Create a mapping from an address to a list of Files
    mapping(address => File[]) public files;

     // Define an event to emit when a file is uploaded
    event FileUploaded(address indexed owner, string hash, string name, string description, string location);

      // Define an event to emit when a file is deleted
    event FileDeleted(address indexed owner, string hash, string name, string description, string location);    


    // Define a function to upload a new file to the mapping
    function uploadFile(
        string memory _hash, // IPFS hash of the file
        string memory _name, // Name of the file
        string memory _description, // Description of the file
        string memory _location // Location of the file
    ) public {
        // Ensure that all input parameters are not empty strings
            require(bytes(_hash).length > 0, "IPFS hash is required");
            require(bytes(_name).length > 0, "File name is required");
            require(bytes(_description).length > 0, "File description is required");
            require(bytes(_location).length > 0, "File location is required");
        File memory newFile = File(msg.sender, _hash, _name, _description, _location);
        // Add the new File to the mapping under the sender's address
        files[msg.sender].push(newFile);

    emit FileUploaded(msg.sender, _hash, _name, _description, _location);

    }

    // Define a function to retrieve a list of Files for a given address
    function getFiles(address user) public view returns (File[] memory) {
        return files[user];
    }

    // Define a function to retrieve the number of Files for a given address
    function getFileCount(address user) public view returns (uint256) {
        return files[user].length;
    }
        function deleteFile(uint256 index) public {
            // Ensure the index is within range
            require(index < files[msg.sender].length, "Invalid index");
            
            // Swap the file to be deleted with the last file in the list
            uint256 lastIdx = files[msg.sender].length - 1;
            File memory fileToDelete = files[msg.sender][index];
            files[msg.sender][index] = files[msg.sender][lastIdx];
            files[msg.sender][lastIdx] = fileToDelete;
            
            // Remove the last file from the list
            files[msg.sender].pop();

        emit FileDeleted(fileToDelete.owner, fileToDelete.hash, fileToDelete.name, fileToDelete.description, fileToDelete.location);
        }

       
}
