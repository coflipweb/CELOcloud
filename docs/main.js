  import Web3 from "web3"
  import { newKitFromWeb3 } from "@celo/contractkit"
  import fileStorageABI from "../contract/fileStorage.abi.json"
  const crypto = require('crypto');

// Constants declaration
  const ERC20_DECIMALS = 18
  const MPContractAddress = "0x21690CB1CCF0C1A13178d3ac6C0DEd5353AD7B5E"


// Global variables
let kit; // celo kit instance
let contract; // contract instance

// Function to connect to the Celo wallet
  const connectCeloWallet = async function () {
    if (window.celo) {
      notification("⚠️ Please approve this DApp to use it.")
      try {
        await window.celo.enable()
        notificationOff()

        const web3 = new Web3(window.celo)
        kit = newKitFromWeb3(web3)

        const accounts = await kit.web3.eth.getAccounts()
        kit.defaultAccount = accounts[0]

        contract = new kit.web3.eth.Contract(fileStorageABI, MPContractAddress)
      } catch (error) {
        notification(`⚠️ ${error}.`)
      }
    } else {
      notification("⚠️ Please install the CeloExtensionWallet.")
    }
  }

  function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
  }


  // Function to display notifications to the user
  function notificationOff() {
  document.querySelector(".alert").style.display = "none"
  }

  window.addEventListener("load", async () => {
    notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  notificationOff()
  });


  // Function to get the cUSD balance of the user's account and display it
   const getBalance = async function () {
   const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
   const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
   document.querySelector("#balance").textContent = cUSDBalance
   }


   // When the user clicks the submit button, upload the file to the contract
  document.querySelector("#submit").addEventListener('click', async () => {

    const accounts = await kit.web3.eth.getAccounts()
    kit.defaultAccount = accounts[0]

     // Get the file hash, name, description and location from the input fields
    const hash = document.getElementById('hash').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const location = document.getElementById('location').value;

    // Check if all input fields are filled
  if (!hash || !name || !description || !location) {
    notification('Please fill out all input fields');
    return;
  }

    await contract.methods.uploadFile(hash, name, image, description, location)
    .send({ from: kit.defaultAccount });
    notification("Uploaded succesfully");

    await fetchFiles();

  })

  // Define a function to fetch the list of files from the contract
async function fetchFiles() {
  // Fetch the list of files from the contract
  const uploadedFiles = document.getElementById('files-owner').value;
  const fileCount = await contract.methods.getFileCount(uploadedFiles).call();
  const files = [];
  for (let i = 0; i < fileCount; i++) {
    const file = await contract.methods.getFiles(uploadedFiles).call();
    files.push(file);
  }

  // Update the UI with the list of files
  const filesList = document.getElementById('files-list');
  filesList.innerHTML = '';
  files.forEach(file => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>File hash: ${file}</div>
      <div>File name: ${files[0][0].name}</div>
      <div>File description: ${files[0][0].description}</div>
      <div>File location: ${files[0][0].location}</div>
    `;
    filesList.appendChild(li);
  });
}

    // Listen for changes to the file input field
  const fileInput = document.getElementById('file-input');
  const hashContainer = document.getElementById('hash-container');


  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    // Generate a hash of the file contents
    const fileHash = await generateFileHash(file);
    console.log(`Hash of file ${file.name}: ${fileHash}`);
    hashContainer.textContent = `Hash of file ${file.name}: ${fileHash}`;

  });

  // Define a function to generate a hash of file contents
  async function generateFileHash(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

     reader.onload = () => { // When file reading is complete
      const hash = crypto.createHash('sha256'); // Create a new SHA-256 hash object
      const data = new Uint8Array(reader.result); // Convert the file contents into a Uint8Array
      hash.update(data); // Update the hash with the file contents
      resolve(hash.digest('hex')); // Resolve the promise with the final hash value in hexadecimal
    };

    reader.onerror = (error) => { // When file reading encounters an error
      reject(error); // Reject the promise with the error message
    };

    reader.readAsArrayBuffer(file); // Start reading the file as an ArrayBuffer

    });
  }
  // Add event listener to the "search-files" button
  document.querySelector("#search-files").addEventListener('click', async () => {
      const uploadedFiles = document.getElementById('files-owner').value;
    // get the user address input value
    const fileCount = await contract.methods.getFileCount(uploadedFiles).call();
     // get the number of files uploaded by the user
    const files = [];
    for (let i = 0; i < fileCount; i++) {
      const file = await contract.methods.getFiles(uploadedFiles).call();
      // get the details of each file uploaded by the user
      files.push(file);

    }
    // Get the element with ID 'files-list'
    const filesList = document.getElementById('files-list');
    filesList.innerHTML = ''; // Clear the previous contents of the list
    // Loop through the files array and create a new <li> element for each file
    files.forEach(file => {
    const li = document.createElement('li');

  // Add the file's information to the <li> element using a template literal
      li.innerHTML = `
      <div>File hash: ${file}</div>
      <div>File name: ${files[0][0].name}</div>
      <div>File description: ${files[0][0].description}</div>
      <div>File location: ${files[0][0].location}</div>
      `;
      filesList.appendChild(li);

    });  
  })
// Add a click event listener to the element with ID 'delete-file-button'
document.getElementById("delete-file-button").addEventListener("click", async () => {

  // Get the index of the file to delete
  const index = parseInt(document.getElementById("delete-index").value);

  // Call the deleteFile function with the index as the argument
  await deleteFile(index);
});

// Define an async function to delete a file
async function deleteFile(index) {

  // Get the accounts associated with the kit
  const accounts = await kit.web3.eth.getAccounts();

  // Get the user's address from the accounts array
  const userAddress = accounts[0];

  // Call the deleteFile method of the contract with the index to delete and the user's address
  await contract.methods.deleteFile(index).send({ from: userAddress })
  .then(() => {
    // Display a notification that the file was deleted successfully
    notification("File deleted successfully");
    
    // Reload the file list
    fetchFiles();
  });

  }
  
 
   
   
  
