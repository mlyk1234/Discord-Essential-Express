
![Logo](https://gateway.pinata.cloud/ipfs/Qmc9iApVWmhLxmHaRpB6L85XY67JGiACML2h12EZgWuMU2)

![Backend](https://gateway.pinata.cloud/ipfs/QmPwrKWRSKEDSeEEnTQbugHdrXKyAQiPYWM4G4JDJT9zrm)

Securo Faucet Backend developed on top of Express.Js,  is a back end web application framework for building RESTful APIs.
## Acknowledgement

### Customization made:
- TypeScript based
- Allow class-validators and class-transformers
- Folder organization
- Using Infura to support on communicating with Goerli and Arbitrium @ [Reference](https://www.infura.io/faq/general)

### Feature
- GoerliETH Faucet transfer [Ready]
## Tech Stack

**WebServer:** Express.js®

**Database:** MongoDB 

**Node.js®:** Version 14 and above required* - available @ [Link to download](https://nodejs.org/en/blog/release/v14.17.3/)


## Installation

```bash
  git clone https://github.com/daoventures/securo-faucet-backend.git
  cd securo-faucet-backend
  npm i
  npm run build
  npm run dev:start || npm start
```
    
## API Reference

#### Get all available networks chain and its relative tokens

```http
  GET localhost:8080/api/v1/network-info
```
#### Claim or Mint Faucet

```http
  GET /api/v1/claim-faucet-v2
```

| Body |Payload|
| :-------- |:----|
| Object|{ wallet: string, network: string: token: string }|


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Set to production when deploying to production
`NODE_ENV=`

### Node.js server configuration
`SERVER_PORT=`

### Database URL
`DB_URL=mongodb://localhost:27017`

`DB_NAME=faucet`

### Infura as Providers
`INFURA_API_KEY=`

### Wallet Address for Signer
`GOERLI_WALLET=`

`...ETC`
