# Splitmap
This project is a challenge to create an NFT on the Ethereum blockchain. My goal is to create a smart contract that interfaces with an existing NFT, Blitmap, created by Dom Hofmann. Blitmap is a token that has all of its data stored on chain, readable as a combination of 268 bytes. Splitmap is a Blitmap derivative that can read the data from four different Blitmaps, mesh them together, and form something new. See below for reference.

![Splitmap minting image](./combination.png?raw=true)

In addition to a smart contract, I will need an interface that can read and write data to the blockchain and allow users with an Ethereum address and wallet to mint a Splitmap by inputting four Blitmaps.