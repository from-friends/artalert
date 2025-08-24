![artalert-logo](public/artalert-logo.png)

# 🟡 ArtAlert: Your AI Agent for NFT Notifications
> Built by FromFriends™ in 36 hours for the Shapecraft² hackathon.

- Live Demo: https://artalert.vercel.app
- GitHub Repo: https://github.com/from-friends/artalert
- Demo Video: https://vimeo.com/1112688820

--- 

## 📋 Submission for the Shape Shapecraft² Hackathon

This project is a submission for the Shape Shapecraft² Hackathon. ArtAlert uses the Shape MCP server to power an intelligent, user-friendly AI agent for NFT monitoring and notifications.

## 🟡 What is ArtAlert?

ArtAlert is an AI agent that monitors digital art marketplaces and delivers instant notifications based on your personalized alerts.

## ✨ Story

I’m a developer and digital art collector who was often missing out on new drops from my favorite artists, offers, and great NFT deals.  
To solve this, I built **ArtAlert**, your personal AI agent that continuously monitors digital art marketplaces and instantly sends notifications based on personalized alert lists.

## 🔔 Use Cases / Example Prompts

<details>
<summary><strong>Price</strong></summary>

- Floor drops 10%  
- Price below target  
- Floor up 20% in a week  
- Price crosses avg  

</details>

<details>
<summary><strong>Artist</strong></summary>

- New drop  
- Artwork burned/delisted  
- New series  

</details>

<details>
<summary><strong>Artwork</strong></summary>

- New offer  
- Listed for sale  
- Sold to top collector  
- Transferred  

</details>

<details>
<summary><strong>Collection</strong></summary>

- Volume spike  
- Holder change  
- Royalty change  
- Whale buying  

</details>

<details>
<summary><strong>Offers & Bids</strong></summary>

- Offer near/above ask  
- You got outbid  
- Bidding war  

</details>

<details>
<summary><strong>Wallets</strong></summary>

- Whale buys/sells  
- New listings  
- Floor sweep  

</details>

<details>
<summary><strong>Market</strong></summary>

- Metadata reveal  
- New marketplace support  
- Verified collection  
- Airdrop/reward  

</details>

## 💡 Next Steps & Future Vision

ArtAlert is a prototype built for the Shapecraft² hackathon, but its potential extends far beyond. Here are some envisioned next steps:

- **User Authentication**: Add user accounts to personalize alerts and manage alert prompts.
- **Notification Channels**: Expand notification options to include custom webhooks, Push Notifications, Telegram, Discord, etc.
- **AI Agent Actions**: Enable the AI agent to act on behalf of the user. Purchase NFTs, accept offers, list artworks for sale, and more.

### 🛠️ Features

- **AI-Powered Alert Prompts**: Define custom alerts using natural language for specific NFTs or collections.
- **Persistent Storage**: All alerts are securely stored using Vercel Blob, ensuring data permanence.
- **User-Friendly Interface**: Intuitive design for adding, managing, enabling, and disabling alerts.
- **Batch Actions**: Efficiently manage multiple alerts with batch enable, disable, and delete functionalities.
- **Mobile-First Responsive Design**: Optimized for a seamless experience across various devices.
- **Toast Notifications**: Provides clear and non-intrusive feedback for user actions.

  
## 🚀 How I Built It

### Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)
![Vercel Blob](https://img.shields.io/badge/Vercel%20Blob-000000?style=for-the-badge&logo=vercel)
![Serverless](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Shape L2](https://img.shields.io/badge/Shape%20L2-black?style=for-the-badge)
![MCP](https://img.shields.io/badge/MCP-Server-8A2BE2?style=for-the-badge)
![Alchemy](https://img.shields.io/badge/Alchemy.com-3C3CFF?style=for-the-badge&logo=alchemy&logoColor=white)


- **Frontend**: Next.js, React, Vanilla CSS
- **Backend**: Next.js API Routes (Serverless Functions)
- **Storage**: Vercel Blob Storage
- **Deployment**: Vercel

### 🔗 Key Technologies & Integration: How ArtAlert Works

ArtAlert is built on a robust and scalable architecture, leveraging the power of Next.js and Vercel's ecosystem. Here's how we're using these technologies:

- **Next.js App Router**: The entire application is built using Next.js 14's App Router, providing a modern, performant, and scalable foundation for both frontend and backend logic. This allows for efficient server-side rendering (SSR) and static site generation (SSG) where appropriate, ensuring a fast user experience.
- **Vercel Blob Storage**: All user-defined NFT alerts and their associated data are stored persistently using **Vercel Blob Storage**. This ensures that your alerts are saved securely and are always available, providing a reliable backend for our application without the need for complex database management.
- **Serverless API Routes**: CRUD operations for alerts (Create, Read, Update, Delete) are handled via Next.js API routes (`/api/alerts`). These routes are deployed as **serverless functions** on Vercel, offering automatic scaling, cost-efficiency, and high availability.
- **Client-Side React**: The interactive user interface, including dynamic search, alert management, and real-time feedback (toast notifications), is powered by React hooks, providing a smooth and responsive user experience.



+-----------+          +-------------------------+          +-----------+
|           |          |                         |          |           |
| ArtAlert  +---------> Store Alert Prompts on   +--------->|  Vercel   |
|   User    |          |         Vercel          |          |  Server   |
|           |          |                         |          |           |
+-----------+          +-----------+-------------+          +-----+-----+
                                    |                          |
                                    | Query every minute       |
                                    v                          |
                          +--------------------+               |
                          | Shape MCP Server   |<--------------+
                          +--------------------+
                                    |
                                    v
                        +----------------------------+
                        |  Vercel checks MCP response|
                        |  If criteria met → Send    |
                        |  email to user             |
                        +----------------------------+


## Current Status of this Prototype

It turned out that the scope of this hackathon project was too ambitious for 36 hours.
I ran out of time implementing Alchemy for searching NFTs on Shape (currently using mock data instead) and connecting the Shape MCP server to the Vercel serverless function with scheduled invocations for querying.

I’m eager to bring these features to life and evolve this prototype into a full-fledged product!

## Developer

- **[FromFriends™](https://from-friends.github.io/)**: Creative developer focused on building innovative platforms that empower users in the Web3 ecosystem through thoughtful design and technology.
  - Twitter/X: https://x.com/FromFriends__/
  - Discord: https://discord.com/users/fromfriends
  - Website: https://from-friends.github.io/
