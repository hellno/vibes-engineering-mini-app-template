You are an AI assistant designed to help developers use the Neynar API. Follow these principles:

1. Always use environment variables for API keys
2. Generate production-ready code that exactly matches requirements
3. Implement proper error handling and retries for network failures
4. Parse API responses correctly and validate inputs
5. Use the simplest solution possible - avoid chaining APIs unnecessarily
6. Never use placeholder data
7. Include proper authentication headers in all requests
8. Write reusable, well-structured code
9. For tasks outside Neynar's capabilities, clearly state "can't do" and explain why
10. Neynar is exposed as both a REST API and a Node.js SDK. Be mindful of the appropriate environment the user is in to determine which to use.
11. Instructions for Neynar's API and SDK below are written in markdown format below. You'll find basic instructions and authentication information at the beginning of these instructions.

---

# Get started > Getting started

Farcaster is a protocol for building decentralized social apps. Neynar makes it easy to build on Farcaster.

## Basic understanding of Farcaster

Farcaster is a decentralized social protocol. Here are a few of the primary Farcaster primitives that will be helpful to keep in mind as you dive in:

1. **User** - every user on Farcaster is represented by a permanent _FID_, the user's numerical identifier. All user profile data for this FID, e.g., username, display name, bio, etc., are stored on the Farcaster protocol and mapped to this FID.
2. **Casts** - users can broadcast information to the protocol in units of information called "casts". It's somewhat similar to a tweet on Twitter/X. Each cast has a unique "hash".
3. **User Relationships** - users can follow each other to see casts from them. This creates a social graph for each user on Farcaster.

There's more to this, but let's start with this. All the above data is open, decentralized, and available on Farcaster hubs. Neynar makes interfacing with this data relatively trivial.

In this tutorial, we will learn how to use the above primitives to fetch a simple _feed_ of casts for a given user.

## Set up Neynar SDK

Neynar [`nodejs` SDK](https://github.com/neynarxyz/nodejs-sdk) is an easy way to use the APIs. This section must only be done once when setting up the SDK for the first time.

To install the Neynar TypeScript SDK:

```typescript yarn
yarn add @neynar/nodejs-sdk
```

```typescript npm
npm install @neynar/nodejs-sdk
```

```typescript pnpm
pnpm install @neynar/nodejs-sdk
```

```typescript bun
bun add @neynar/nodejs-sdk
```

To get started, initialize the client in a file named `index.ts`:

```typescript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: "YOUR_NEYNAR_API_KEY",
});

const client = new NeynarAPIClient(config);
```

Depending on your build environment, you might also need the following two steps:

1. check the `type` field in package.json. Since we're using ES6 modules, you may need to set it to "module".

```json package.json
{
  "scripts": {
    "start": "node --loader ts-node/esm index.ts"
  },
  "type": "module", // <-- set to module if needed
  "dependencies": {
    // this is for illustration purposes, the version numbers will depend on when you do this tutorial
    "@neynar/nodejs-sdk": "^2.0.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  }
}
```

2. If you hit errors, try adding a `tsconfig.json` file in the directory to help with typescript compilation

```typescript
{
    "compilerOptions": {
      "module": "ESNext",
      "moduleResolution": "node",
      "target": "ESNext",
      "esModuleInterop": true,
      "skipLibCheck": true
    },
    "ts-node": {
      "esm": true
    }
  }
```

Your directory should have the following:

- node_modules
- index.ts
- package-lock.json
- package.json
- tsconfig.json (optional)
- yarn.lock

## Fetch Farcaster data using Neynar SDK

### Fetching feed

To fetch the feed for a user, you need to know who the user is following and then fetch casts from those users. Neynar abstracts away all this complexity. Put in the `fid` of the user in the `fetchFeed` function and get a feed in response.

In this example, we will fetch the feed for [Dan Romero](https://warpcast.com/dwr.eth) . This is the feed Dan would see if he were to log into a client that showed a feed from people he followed in a reverse chronological order.

```typescript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: "YOUR_NEYNAR_API_KEY",
});

const client = new NeynarAPIClient(config);

import { FeedType } from "@neynar/nodejs-sdk/build/api";

const feedType = FeedType.Following;
const fid = 3;
const withRecasts = true;
const limit = 50;
const viewerFid = 6131;

client
  .fetchFeed({ feedType, fid, withRecasts, limit, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

You can now run this code by opening this folder in the terminal and running it.

```typescript
yarn start
```

Depending on your machine, typescript might take a few seconds to compile. Once done, it should print the output to your console. Something like below:

```typescript
User Feed: {
  casts: [
    {
      object: 'cast',
      hash: '0x5300d6bd8f604c0b5fe7d573e02bb1489362f4d3',
      author: [Object],
      thread_hash: '0x5300d6bd8f604c0b5fe7d573e02bb1489362f4d3',
      parent_hash: null,
      parent_url: null,
      root_parent_url: null,
      parent_author: [Object],
      text: 'https://open.spotify.com/track/5oQcOu1omDykbIPSdSQQNJ?si=2qMjk-fESMmxqCoAxTsPmw',
      timestamp: '2024-11-14T04:57:23.000Z',
      embeds: [Array],
      channel: null,
      reactions: [Object],
      replies: [Object],
      mentioned_profiles: [],
      viewer_context: [Object]
    },
  ]
}
```

You've successfully fetched the feed for a user using a simple function call!

_Future reading: you can fetch many different kinds of feeds. See [Feed](ref:feed-operations) APIs. _

### Fetching user profile data

Now, let's fetch data about a user. We will take an FID and fetch data for that user. Here's how to do it using the SDK:

```javascript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: "YOUR_NEYNAR_API_KEY",
});

const client = new NeynarAPIClient(config);
const fids = [2, 3];
const viewerFid = 6131;

client.fetchBulkUsers({ fids, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

You can run this in your terminal similar to above by typing in:

```typescript
yarn start
```

It should show you a response like the one below:

```typescript
User: {
  users: [
    {
      object: "user",
      fid: 3,
      username: "dwr.eth",
      display_name: "Dan Romero",
      pfp_url:
        "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original",
      custody_address: "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
      profile: [Object],
      follower_count: 489109,
      following_count: 3485,
      verifications: [Array],
      verified_addresses: [Object],
      verified_accounts: [Array],
      power_badge: true,
    },
  ];
}
```

_Future reading: you can also fetch data about a user by using their wallet address or username as identifiers. See APIs for that here: [User by wallet address](doc:fetching-farcaster-user-based-on-ethereum-address), [By username](ref:lookup-user-by-username)._

## You're ready to build!

Now that you can fetch user and cast data, you're ready to dive in further and start making your first Farcaster application. We have numerous guides available [here](https://docs.neynar.com/docs), and our complete API reference is [here](https://docs.neynar.com/reference).

## TL;DR

- [Use Farcaster to build a more delightful consumer experience for your users](https://docs.neynar.com/docs/supercharge-your-sign-in-with-ethereum-onboarding-with-farcaster#the-why)
- [Build user profiles instantly by pulling Farcaster data](https://docs.neynar.com/docs/supercharge-your-sign-in-with-ethereum-onboarding-with-farcaster#profile)
- [Show personalized information based on the Farcaster social graph](https://docs.neynar.com/docs/supercharge-your-sign-in-with-ethereum-onboarding-with-farcaster#social-graph)

## Make life simpler for yourself and your users

Building user profiles and social graphs for each user from scratch requires a lot of time and effort from developers and users. In some cases, graphs never get enough traction to add value. User data on a protocol like Farcaster can be used across apps like Alfafrens, Drakula, Supercast, Warpcast, etc.

Instead of asking users to build their profiles and graphs from scratch, apps like [Bracket](https://bracket.game) and [Drakula](https://drakula.app) have a "connect with Farcaster" feature that pulls info like username and pfp. This works no matter what chain the app is using, incl. non evm chains like Solana. Unlike Web2, access to this information cannot be restricted.

On [Sonata](https://sonata.tips), instead of signing up, setting up a new profile, and creating your feed from scratch, you can sign in with Farcaster. It will generate a feed of music for you based on the people you already follow.

## Set it up in less than 15 mins

**If you’re using embedded wallets** in your app then those wallets probably aren’t connected to the user’s Farcaster account. In this case, you can add an option to let users [connect](https://docs.neynar.com/docs/how-to-let-users-connect-farcaster-accounts-with-write-access-for-free-using-sign-in-with-neynar-siwn) their Farcaster profile to your app. With our [react SDK](https://www.npmjs.com/package/@neynar/react) you can add sign-in with neynar by just adding the NeynarAuthButton component:

```jsx
<NeynarAuthButton />
```

Connecting their profile will give you their `fid` which you can then use to fetch [profiles](ref:fetch-bulk-users) and [followers](ref:fetch-user-followers) information.

**If you’re not using embedded wallets** you can either

1. let the user connect their profile (same as above) OR
2. fetch user profiles connected to their address via [this API](ref:fetch-bulk-users-by-eth-or-sol-address)

You can even [onboard new users](https://docs.neynar.com/docs/how-to-create-a-new-farcaster-account-with-neynar) to Farcaster from within your app seamlessly.

### Profile

More details on #2 listed above. You can call the API like this in your node app:

```jsx
const url =
  "https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=0x6bF08768995E7430184a48e96940B83C15c1653f";
const options = {
  method: "GET",
  headers: { accept: "application/json", api_key: "NEYNAR_API_DOCS" },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
```

It will provide you with a response like:

```jsx
{
  "0x6bf08768995e7430184a48e96940b83c15c1653f": [
    {
      "object": "user",
      "fid": 9019,
      "custody_address": "0x5eb2696eed6a70a244431bc110950adeb5ef6101",
      "username": "avneesh",
      "display_name": "Avneesh",
      "pfp_url": "https://i.imgur.com/oaqwZ8i.jpg",
      "profile": {
        "bio": {
          "text": "full stack web3 developer building cool shit and teaching others avneesh.tech"
        }
      },
      "follower_count": 6067,
      "following_count": 382,
      "verifications": [
        "0x6bf08768995e7430184a48e96940b83c15c1653f"
      ],
      "verified_addresses": {
        "eth_addresses": [
          "0x6bf08768995e7430184a48e96940b83c15c1653f"
        ],
        "sol_addresses": [
          "2R4bHmSBHkHAskerTHE6GE1Fxbn31kaD5gHqpsPySVd7"
        ]
      },
      "active_status": "inactive",
      "power_badge": false
    }
  ]
}
```

You can then use this info in your app to populate info like name, bio, pfp, etc. of the user !

### Social Graph

You can also import the user’s social graph by fetching their followers and following. To get the list of followers, use this [Followers](ref:fetch-user-followers) API where you need to pass in the FID and it will output:

```json
{
  "users": [
    {
      "object": "follow",
      "user": {
        "object": "user",
        "fid": 648026,
        "custody_address": "0xe1a881a22aa75eabc96275ad7e6171b3def9a195",
        "username": "chiziterevivian",
        "display_name": "Chizitere Vivian",
        "pfp_url": "https://images.farcaster.phaver.com/insecure/raw:t/ZjE4NGNkYTY3YTljMzJjMDQzOGNhNzc2ZTQwN2FiOGU.jpeg",
        "profile": {
          "bio": {
            "text": "Love simplicity and originality"
          }
        },
        "follower_count": 19,
        "following_count": 154,
        "verifications": [],
        "verified_addresses": {
          "eth_addresses": [],
          "sol_addresses": []
        },
        "active_status": "inactive",
        "power_badge": false
      }
    },
   ...
  ],
  "next": {
    "cursor": "eyJ0aW1lc3RhbXAiOiIyMDI0LTA2LTI1IDE2OjMyOjM3LjAwMDAwMDAiLCJmaWQiOjcyMzg0OX0%3D"
  }
}
```

Similarly, you can get the list of users the user follows using this [Follows API](ref:follows-operations).

# Overview > Quickstart

Farcaster is a protocol for building decentralized social apps. Neynar makes it easy to build on Farcaster.

## Basic understanding of Farcaster

Farcaster is a decentralized social protocol. Here are three short bullets on the primary Farcaster primitives that will be helpful to keep in mind as you dive in:

1. **User** - every user on Farcaster is represented by a permanent _FID_ that is the numerical identifier for the user. All user profile data for this FID e.g. username, display name, bio, etc. are stored on Farcaster protocol and mapped to this FID.
2. **Casts** - users can broadcast information to the protocol in units of information called "casts". It's somewhat similar to a tweet on Twitter/X. Each cast has a unique "hash".
3. **Followers / following** - users can follow each other to see casts from them. This creates a social graph for each user on Farcaster.

There's obviously more to this but let's start with this. All the above data is open and decentralized, available on Farcaster nodes called hubs. Neynar makes interfacing with this data relatively trivial.

In this tutorial, we will learn how use the above primitives to fetch a simple _feed_ of casts for a given user.

## Set up Neynar SDK

Neynar [`nodejs` SDK](https://github.com/neynarxyz/nodejs-sdk) is an easy way to use the APIs. This section only needs to be done once when setting up the SDK for the first time.

To install the Neynar TypeScript SDK:

```typescript yarn
yarn add @neynar/nodejs-sdk
```

```typescript npm
npm install @neynar/nodejs-sdk
```

```typescript pnpm
pnpm install @neynar/nodejs-sdk
```

```typescript bun
bun add @neynar/nodejs-sdk
```

To get started, initialize the client in a file named `index.ts`:

```typescript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
});

// make sure to set your NEYNAR_API_KEY .env
// for testing purposes, you can insert your key as a string param into NeynarAPIClient
const client = new NeynarAPIClient(config);
```

Depending on your build environment, you might also need the following two steps:

1. check the `type` field in package.json. Since we're using ES6 modules, you may need to set it to "module".

```json package.json
{
  "scripts": {
    "start": "node --loader ts-node/esm index.ts"
  },
  "type": "module", // <-- set to module if needed
  "dependencies": {
    // this is for illustration purposes, the version numbers will depend on when you do this tutorial
    "@neynar/nodejs-sdk": "^2.0.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.6.3"
  }
}
```

2. If you hit errors, try adding a `tsconfig.json` file in the directory to help with typescript compilation

```typescript
{
    "compilerOptions": {
      "module": "ESNext",
      "moduleResolution": "node",
      "target": "ESNext",
      "esModuleInterop": true,
      "skipLibCheck": true
    },
    "ts-node": {
      "esm": true
    }
  }
```

Your directory should have the following:

- node_modules
- index.ts
- package-lock.json
- package.json
- tsconfig.json (optional)
- yarn.lock

## Fetch Farcaster data using Neynar SDK

### Fetching feed

To fetch the feed for a user, you need to know who the user is following and then fetch casts from those users. Neynar abstracts away all this complexity. Simply put in the `fid` of the user in the `fetchFeed` function and get a feed in response.

In this example, we will fetch the feed for [Dan Romero](https://warpcast.com/dwr.eth) . This is the feed Dan would see if he were to log into a client that showed a feed from people he followed in a reverse chronological order.

```typescript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { FeedType } from "@neynar/nodejs-sdk/build/api";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
});

const client = new NeynarAPIClient(config);

// fetch feed of Dan Romero: fid 3
async function fetchFollowingFeed() {
  const feedType = FeedType.Following;
  const fid = 3;
  const limit = 1;

  const feed = await client.fetchFeed({
    fid,
    feedType,
    limit,
  });
  console.log("User Feed:", feed);
}

fetchFollowingFeed();
```

You can now run this code by opening up this folder in the terminal and running

```typescript
yarn start
```

Depending on your machine, typescript might take a few seconds to compile. Once done, it should print the output to your console. Something like below:

```typescript
User Feed: {
  "casts": [
    {
      "object": "cast",
      "hash": "0xd9993ef80c1a7f75c6f75de3b79bc8a18de89a30",
      "author": {
        "object": "user",
        "fid": 1265,
        "username": "akhil-bvs",
        "display_name": "Akhil",
        "pfp_url": "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/6f618f59-2290-4350-100a-4b5d10abef00/original",
        "custody_address": "0xdf055eb92e2c97d7da4036278d145458eb11811c",
        "profile": {
          "bio": {
            "text": "product @cooprecs | player /fbi"
          }
        },
        "follower_count": 1919,
        "following_count": 252,
        "verifications": [
          "0xab14023979a34b4abb17abd099a1de1dc452011a"
        ],
        "verified_addresses": {
          "eth_addresses": [
            "0xab14023979a34b4abb17abd099a1de1dc452011a"
          ],
          "sol_addresses": []
        },
        "verified_accounts": null,
        "power_badge": true,
        "viewer_context": {
          "following": true,
          "followed_by": true,
          "blocking": false,
          "blocked_by": false
        }
      },
      "thread_hash": "0xd9993ef80c1a7f75c6f75de3b79bc8a18de89a30",
      "parent_hash": null,
      "parent_url": null,
      "root_parent_url": null,
      "parent_author": {
        "fid": null
      },
      "text": "",
      "timestamp": "2024-11-22T17:39:21.000Z",
      "embeds": [
        {
          "cast_id": {
            "fid": 880094,
            "hash": "0x82e6e0e20539578dcb7e03addb94f3a7f7491c49"
          },
          "cast": {
            "object": "cast_embedded",
            "hash": "0x82e6e0e20539578dcb7e03addb94f3a7f7491c49",
            "author": {
              "object": "user_dehydrated",
              "fid": 880094,
              "username": "anoncast",
              "display_name": "anoncast",
              "pfp_url": "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/2c3250ee-e91d-4e8d-76b1-42d1c6ebef00/rectcrop3"
            },
            "thread_hash": "0x82e6e0e20539578dcb7e03addb94f3a7f7491c49",
            "parent_hash": null,
            "parent_url": null,
            "root_parent_url": null,
            "parent_author": {
              "fid": null
            },
            "text": "one day this account will be used by a whistleblower to release classified documents about government fuckery. this account will break the internet and be impossible for anyone to ignore.",
            "timestamp": "2024-11-22T16:35:36.000Z",
            "embeds": [],
            "channel": null
          }
        }
      ],
      "channel": null,
      "reactions": {
        "likes_count": 0,
        "recasts_count": 0,
        "likes": [],
        "recasts": []
      },
      "replies": {
        "count": 0
      },
      "mentioned_profiles": [],
      "viewer_context": {
        "liked": false,
        "recasted": false
      }
    }
  ],
  "next": {
    "cursor": "eyJ0aW1lc3RhbXAiOiIyMDI0LTExLTIyIDE3OjM5OjIxLjAwMDAwMDAifQ%3D%3D"
  }
}
```

You've successfully fetched the feed for a user in a simple function call!

_Future reading: you can fetch many different kind of feeds. See [Feed](ref:feed-operations) APIs. _

### Fetching user profile data

Now let's fetch data about a user. Remember users are represented by FIDs? We will take an FID and fetch data for that user. Here's how to do it using the SDK:

```javascript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { FeedType } from "@neynar/nodejs-sdk/build/api";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
});

const client = new NeynarAPIClient(config);

// fetch feed of Dan Romero: fid 3
async function fetchUser() {
  const fids = [3];

  const { users } = await client.fetchBulkUsers({ fids });
  console.log("User :", users[0]);
}

fetchUser();
```

You can run this in your terminal similar to above by typing in:

```typescript
yarn start
```

It should show you a response like below:

```typescript
User : {
      "object": "user",
      "fid": 3,
      "username": "dwr.eth",
      "display_name": "Dan Romero",
      "pfp_url": "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/bc698287-5adc-4cc5-a503-de16963ed900/original",
      "custody_address": "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
      "profile": {
        "bio": {
          "text": "Working on Farcaster and Warpcast."
        },
        "location": {
          "latitude": 34.05,
          "longitude": -118.24,
          "address": {
            "city": "Los Angeles",
            "state": "California",
            "state_code": "ca",
            "country": "United States of America",
            "country_code": "us"
          }
        }
      },
      "follower_count": 490770,
      "following_count": 3498,
      "verifications": [
        "0xd7029bdea1c17493893aafe29aad69ef892b8ff2"
      ],
      "verified_addresses": {
        "eth_addresses": [
          "0xd7029bdea1c17493893aafe29aad69ef892b8ff2"
        ],
        "sol_addresses": []
      },
      "verified_accounts": [
        {
          "platform": "x",
          "username": "dwr"
        }
      ],
      "power_badge": true
    }
```

_Future reading: you can also fetch data about a user by using their wallet address or username as identifiers. See APIs for that here: [User by wallet address](doc:fetching-farcaster-user-based-on-ethereum-address), [By username](https://docs.neynar.com/reference/search-user)._

## You're ready to build!

Now that you're able to fetch user and cast data, you're ready to dive in further and start making your first Farcaster application. We have numerous guides available [here](https://docs.neynar.com/docs) and our full API reference is [here](https://docs.neynar.com/reference) .

# Overview > Rate limits

> Rate limits vs compute units
>
> Rate limits are based on _requests per min_ and are fully independent of overall compute limit usage. Going over your compute units will _not_ automatically trigger rate limits.

### Rate limits are set per subscription plan

- Starter plan rate limits are 300 <<glossary:RPM>> or 5 <<glossary:RPS>>
- Growth plan rate limits are 600 <<glossary:RPM>> or 10 <<glossary:RPS>>
- Scale plan rate limits are 1200 <<glossary:RPM>> or 20 <<glossary:RPS>>

If you need higher limits, reach out and we can set up an enterprise plan for you.

### _API-specific_ rate limits in <<glossary:RPM>>

This type of rate limit is triggered when you call the same API above its API-specific threshold on your plan. As an example - On the Growth plan, you can call two different APIs at 500 RPM each for a total RPM of 1000 without triggering your rate limits.

| API                                       | Starter (<<glossary:RPM>>) | Growth (<<glossary:RPM>>) | Scale (<<glossary:RPM>>) | Enterprise |
| :---------------------------------------- | :------------------------- | :------------------------ | :----------------------- | :--------- |
| POST v2/farcaster/frame/validate          | 5k                         | 10k                       | 20k                      | Custom     |
| GET v2/farcaster/signer                   | 3k                         | 6k                        | 12k                      | Custom     |
| GET v2/farcaster/signer/developer_managed | 3k                         | 6k                        | 12k                      | Custom     |
| All others                                | 300                        | 600                       | 1200                     | Custom     |

### _Global_ rate limits in <<glossary:RPM>>

This type of rate limit is triggered when you call any API above the global threshold on your plan.

`/validate`, `/signer` and `signer/developer_managed` APIs don't count towards global rate limits.

| API             | Starter (<<glossary:RPM>>) | Growth (<<glossary:RPM>>) | Scale (<<glossary:RPM>>) | Enterprise |
| :-------------- | :------------------------- | :------------------------ | :----------------------- | :--------- |
| Across all APIs | 500                        | 1000                      | 2000                     | Custom     |

### Cast creation rate limits

This type of rate limit depends on number of casts the account has made in a 24 hour period and its available storage.

| Casts per 24h | Available Storage Required  |
| :------------ | :-------------------------- |
| \< 1000       | No requirement              |
| ≥ 1000        | 20% of past 24h cast volume |

# Overview > Compute units pricing

# Farcaster API V2 > User

# Farcaster API V2 > User > Register new user

Register a new user in two API calls

- fetch the latest fid that a new user must be assigned
- generate signature for the user and call registration API

Neynar abstracts away all onchain transactions required for account registration and storage and retroactively bills developer account. Developer can choose to subsidize account creation or charge end consumer as they see fit.

# Farcaster API V2 > User > Update user profile

Update profile details and connected addresses for a given user

# Farcaster API V2 > Fetch user information

Fetch user information based on

- fid
- connected wallet address (eth / sol)
- Farcaster custody wallet address
- active status

# Farcaster API V1 > Cast

# Farcaster API V1 > Cast > Fetch Recent Casts

If you're looking to use this endpoint with other v2 endpoints, we have a conversion function from v1 to v2 format [here](https://github.com/neynarxyz/nodejs-sdk/blob/dae351d91f8c45ae36cb563bd65cfc4d23b9b704/src/neynar-api/utils/v1-to-v2-converters.ts#L49).

# Farcaster API V1 > Fetch Recent Users

If you're looking to use this endpoint with other v2 endpoints, we have a conversion function from v1 to v2 format [here](https://github.com/neynarxyz/nodejs-sdk/blob/dae351d91f8c45ae36cb563bd65cfc4d23b9b704/src/neynar-api/utils/v1-to-v2-converters.ts#L49).

# Farcaster API V1 > Fetch Recent Casts

If you're looking to use this endpoint with other v2 endpoints, we have a conversion function from v1 to v2 format [here](https://github.com/neynarxyz/nodejs-sdk/blob/dae351d91f8c45ae36cb563bd65cfc4d23b9b704/src/neynar-api/utils/v1-to-v2-converters.ts#L49).

# Filter spam, low quality data > Neynar user score

## What is the Neynar user score?

Neynar user score is generated based on user behavior on the platform. It scores between 0 and 1 and reflects the confidence in the user being a high-quality user. Users can improve their scores by having high-quality interactions with other good users. Scores update weekly.

If you want to see your score as a user, you can use the [By username](ref:lookup-user-by-username) API, put in your username, and turn the `x-neynar-experimental` flag to _true_.

> Scores are also available onchain, see [Address \<> user score contract](doc:address-user-score-contract)

## Interpreting the score

You can see a distribution of users across score ranges on this [dashboard](https://data.hubs.neynar.com/dashboards/51-neynar-score-distribution). A screenshot from Dec 5, 2024 is below.

![](https://files.readme.io/7cf1b9a49a358093488052244e7851837002b499f56f31b44634dcfa6ec04424-image.png)

**We recommend starting with a threshold around 0.5 and then changing up or down as needed.** As of Dec 5, 2024, there are:

- ~2.5k accounts with 0.9+ scores
- ~27.5k accounts with 0.7+ scores

\_Hence, starting with a very high threshold will restrict the product to a tiny user cohort. \_Developers should assess their own thresholds for their applications (Neynar does not determine thresholds in other apps). Scores update at least once a week, so new users might take a few days to show an updated score. If the user has not been active for a while, their scores will be reduced.

## Getting the score on webhook events

If you're using Neynar webhooks to get data on your backend, you might want to separate high-quality data from low-quality data. A simple way to do this is to look at the `neynar_user_score` inside each user object.

```
user: {
	fid: 263530,
	object: "user",
	pfp_url: "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/68c1cd39-bcd2-4f5e-e520-717cda264d00/original",
	profile: {
		bio: {
			text: "Web3 builder"
		}
	},
	username: "m00n620",
	power_badge: false,
	display_name: "tonywen.base.eth",
	experimental: {
		neynar_user_score: 0.9 // THIS IS THE SCORE
	},
	verifications: [
		"0xc34da1886584aa1807966c0e018709fafffed143"
	],
	follower_count: 29,
	custody_address: "0x22c1898bddb8e829a73ca6b53e2f61e7f02a6e6d",
	following_count: 101,
	verified_accounts: null,
	verified_addresses: {
		eth_addresses: [
			"0xc34da1886584aa1807966c0e018709fafffed143"
		],
		sol_addresses: []
	}
}
```

## Fetching the score on API calls

If you're using APIs, you can get the same score as part of the user objects by passing in`x-neynar-experimental` boolean in the header. See the screenshot below of [User by FIDs](ref:fetch-bulk-users) for example.

![](https://files.readme.io/b4e1bb4de2e8bbe4ceea126c31525142a8b7a2e28b21f619251f1be10b9351e9-image.png)

Turning on this boolean flag will return the same score in the API or SDK response.

The same can be done when fetching users [By Eth or Sol addresses](ref:fetch-bulk-users-by-eth-or-sol-address). If looking to restrict activity on your contract to a specific cohort of users, you can run their address against this API to fetch their score and then allow them to take actions as appropriate.

## Report errors

If you know a score misrepresents a user, that's helpful information we can use to label our data. Please send feedback to `@rish` on [Warpcast DC](https://warpcast.com/rish) or [Telegram DM](https://t.me/rishdoteth) .

# Filter spam, low quality data > Rank high quality conversations

Neynar abstracts away ranking challenges across most of its APIs e.g. [Trending Feed](ref:fetch-trending-feed) and [Conversation for a cast](ref:lookup-cast-conversation).

## Feed

There are a few different ways to rank casts for users.

- [For you](ref:fetch-feed-for-you) feed provides a ranked, personalized, _for you_ feed for a given user
- [Trending casts](ref:fetch-trending-feed) feed provides trending casts globally or filtered to a channel. In this case, you can choose a provider of your choice - `neynar`, `openrank`, `mbd`. Neynar serves ranking from other providers without any changes.

## Conversation

[Conversation for a cast](ref:lookup-cast-conversation) API allows developers to fetch a conversation thread for a given cast. In addition, it's possible to:

- rank casts in the conversation by order of quality by changing the `sort_type` parameter
- hide low quality conversations below the fold by setting the `fold` param to _above_ or _below_. Not passing in a param shows the full conversation without any fold.

  ![](https://files.readme.io/642f8feeca08233d390d902350f86bc739bbdb09bc3bb5ca373e8cb203239329-image.png)

All put together, this makes it possible to serve high quality information to users. If you've ideas on how we can improve ranking further, please message rish on [Warpcast DC](https://warpcast.com/rish) or [Telegram DM](https://t.me/rishdoteth) .

# Render Farcaster in React > React client

This guide will look at creating a Farcaster client using Next.js and the Neynar React SDK.

For this guide, we'll go over:

1. [Setting up Sign-in with neynar](https://docs.neynar.com/docs/how-to-create-a-client#setting-up-sign-in-with-neynar)
2. [Building the user feed](#building-the-feed)
3. [Building channels feed](#building-the-channels-list-and-channel-feed)
4. [Building user profiles](#building-user-profiles)

Before we begin, you can access the [complete source code](https://github.com/avneesh0612/neynar-client) for this guide on GitHub.

Let's get started!

## Creating the app

### Setting up the project

Create a new next.js app using the following command:

```powershell
npx create-next-app app-name
```

You can choose the configuration based on your personal preference, I am using this config for the guide:

![](https://files.readme.io/c0af43f-image.png)

Once the app is created, install the packages that we are going to need for the command:

```powershell npm
npm i @neynar/react @neynar/nodejs-sdk
```

```powershell yarn
yarn add @neynar/react @neynar/nodejs-sdk
```

```powershell bash
bun add @neynar/react @neynar/nodejs-sdk
```

Once the dependencies are installed you can open it in your favourite and we can start working on the client!

### Setting up Sign-in with neynar

Head over to the `layout.tsx` file and wrap your app in a `NeynarContextProvider` like this:

```typescript layout.tsx
"use client";

import "./globals.css";
import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NeynarContextProvider
        settings={{
          clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
          defaultTheme: Theme.Dark,
          eventsCallbacks: {
            onAuthSuccess: () => {},
            onSignout() {},
          },
        }}
      >
        <body>{children}</body>
      </NeynarContextProvider>
    </html>
  );
}
```

We are passing some settings here like `clientId`, `defaultTheme` and `eventsCallbacks`.

- `clientId`: This is going to be the client ID you get from your neynar, add it to your `.env.local` file as `NEXT_PUBLIC_NEYNAR_CLIENT_ID`.

![](https://files.readme.io/bde5490-image.png)

> Make sure to add localhost to the authorized origins

- `defaultTheme`: default theme lets you change the theme of your sign-in button, currently, we have only light mode but dark mode is going to be live soon.
- `eventsCallbacks`: This allows you to perform certain actions when the user signs out or auth is successful.

I've also added a styles import from the neynar react package here which is needed for the styles of the sign-in button.

Now, let's create a header component where we can add the sign-in with Neynar button.

So, create a new `components/Header.tsx` file and add the following:

```typescript Header.tsx
"use client";

import { NeynarAuthButton } from "@neynar/react";
import Link from "next/link";

export const Header: FC = () => {
  return (
    <div className="flex items-center justify-between px-16 pt-4 text-white">
      <Link href="/" className="text-3xl font-bold">
        NeynarClient
      </Link>

      <NeynarAuthButton className="right-4 top-4" />
    </div>
  );
};
```

We'll add the header to the `layout.tsx` file since we are going to need it on all the pages:

```typescript layout.tsx
"use client";

import "./globals.css";
import { NeynarContextProvider, Theme } from "@neynar/react";
import "@neynar/react/dist/style.css";
import { Header } from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NeynarContextProvider
        settings={{
          clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || "",
          defaultTheme: Theme.Dark,
          eventsCallbacks: {
            onAuthSuccess: () => {},
            onSignout() {},
          },
        }}
      >
        <body>
          <Header />
          {children}
        </body>
      </NeynarContextProvider>
    </html>
  );
}
```

If you head over to your app you'll be able to see a sign-in button on the screen. Go ahead and try signing in!

![](https://files.readme.io/4813dc2-image.png)

Now that our sign-in button is working let's start working on showing the feed!

### Building the feed

In the `page.tsx` file add the following:

```typescript page.tsx
"use client";

import { NeynarFeedList, useNeynarContext } from "@neynar/react";

export default function Home() {
  const { user } = useNeynarContext();

  return (
    <main className="flex min-h-screen p-16">
      <div className="ml-40 flex flex-col gap-6">
        <NeynarFeedList
          feedType={user?.fid ? "following" : "filter"}
          fid={user?.fid}
          filterType="global_trending"
        />
      </div>
    </main>
  );
}
```

Here, we are using the `NeynarFeedList` component to show the trending casts if the user is not signed in, but, if they are signed in we show the following feed based on their fid.

![](https://files.readme.io/acd3550a3a60ac485499247eb069ce874e0db21db2027cb12515e2bb5b28e437-image.png)

Now, let's also show the list of channels that the user is following.

### Building the channels list and channel feed

To get the list of channels that a user is following we'll use the neynar APIs. So, let's first initialise the client in a new `lib/neynarClient.ts` file like this:

```typescript neynarClient.ts
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);

export default neynarClient;
```

> Make sure to add the NEYNAR_API_KEY to your .env file.

Then, create a new file `api/channels/route.ts` in the `app` directory and add the following:

```typescript route.ts
import neynarClient from "@/lib/neynarClient";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");

    const channels = await neynarClient.fetchUserChannels(Number(fid));

    return NextResponse.json(channels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).response?.data?.message },
      { status: (error as any).response?.status || 500 }
    );
  }
};
```

This will fetch the channels a user is following using the neynarClient and return it.

Let's now use it on the home page. Head back to the `page.tsx` file and add the following:

```typescript page.tsx
"use client";

import { Channel } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { NeynarFeedList, useNeynarContext } from "@neynar/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useNeynarContext();
  const [channels, setChannels] = useState<any | null>();

  const fetchChannels = async () => {
    if (!user) {
      return;
    }

    const response = await fetch(`/api/channels?fid=${user?.fid}`);
    const data = await response.json();
    setChannels(data);
  };

  useEffect(() => {
    if (user) {
      fetchChannels();
    }
  }, [user]);

  return (
    <main className="flex min-h-screen p-16">
      {user && (
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Channels</h1>
          <div className="flex flex-col">
            {channels &&
              channels.channels.map((channel: Channel) => (
                <div key={channel.url} className="rounded-lg p-4">
                  <Link href={`/channel/${channel.id}`}>{channel.name}</Link>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="ml-40 flex flex-col gap-6">
        <NeynarFeedList
          feedType={user?.fid ? "following" : "filter"}
          fid={user?.fid}
          filterType="global_trending"
        />
      </div>
    </main>
  );
}
```

Here, we are now fetching the list of channels that the user follows and creating links with the name of the channel. These link to another page which we are yet to build but you should be able to see the list of channels now!

![](https://files.readme.io/cdd582228164912db3361af2e70daa8445d2d53e2052b7af9a61c05dfe3f4ce5-image.png)

Now, let's build out the channel page as well which will show the feed of a specific channel.

Create a new `channel/[channelId]/page.tsx` file in the `app` folder and add the following:

```typescript page.tsx
import { NeynarFeedList } from "@/components/Neynar";

export default async function Page({
  params: { channelId },
}: {
  params: { channelId: string };
}) {
  return (
    <main className="mt-4 flex min-h-screen w-full flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold mb-4">{channelId}</h1>
      <NeynarFeedList
        feedType="filter"
        channelId={channelId}
        viewerFid={2}
        limit={50}
        filterType="channel_id"
      />
    </main>
  );
}
```

Here, you can see that we are importing the component from a `@/components/Neynar` file and not the package directly because it is a client component. So, create a new `components/Neynar.tsx` file and add the following:

```typescript Neynar.tsx
"use client";

import { NeynarProfileCard, NeynarFeedList } from "@neynar/react";

export { NeynarProfileCard, NeynarFeedList };
```

This will filter the feed based on the channelId and show only the casts made in that channel. If you go ahead and click on one of the channels you'll be able to see something like this:

![](https://files.readme.io/1b15c23ff0320c5f00d0008bd89f91e4ae660bc9a325604050131c8439c3820e-image.png)

### Building user profiles

Let's also build a profile page for every user which shows their profile card and the casts they have created.

Create a new file `profile/[username]/page.tsx` in the `app` folder and add the following:

```typescript page.tsx
import { NeynarProfileCard, NeynarFeedList } from "@/components/Neynar";
import neynarClient from "@/lib/neynarClient";

async function getData(username: string) {
  const user = await neynarClient.lookupUserByUsername(username);

  return { user: user.result.user };
}

export default async function Page({
  params: { username },
}: {
  params: { username: string };
}) {
  const { user } = await getData(username);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <NeynarProfileCard fid={user.fid} />
      <div className="mt-4 flex items-center">
        <NeynarFeedList
          feedType="filter"
          fid={user.fid}
          fids={`${user.fid}`}
          withRecasts={false}
          limit={50}
        />
      </div>
    </main>
  );
}
```

Here, I am first resolving the username in the path to get the user object which can be later used to get the fid of the user. Then, we are displaying the `ProfileCard` and the `FeedList` filtered based on the user's fid. If you go to /profile/username then you'll be able to see the user's profile!

![](https://files.readme.io/6cd72b1c1895a602369b17b0014d2efad187b2c7ecdc84b674cd26a898b1348c-image.png)

## Conclusion

In this tutorial, we successfully built a Farcaster client with Next.js and the Neynar React SDK. Along the way, we covered essential features such as user authentication, creating feeds, fetching channels, and building user profiles. These steps give you a solid foundation to further enhance your client by adding more advanced features or customizing it to meet your specific needs.

# Fetch user information > User by wallet address

Farcaster users can connect their FID (Farcaster ID) with an Ethereum address. This guide demonstrates how to get information about a user given their Ethereum address.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

To get vitalik.eth's Farcaster profile:

```javascript
// vitalik.eth
const addr = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
const user = await client.lookupUserByVerification(addr);

console.log(user);
```

Example output:

```
{
  result: {
    user: {
      fid: 5650,
      custodyAddress: "0xadd746be46ff36f10c81d6e3ba282537f4c68077",
      username: "vitalik.eth",
      displayName: "Vitalik Buterin",
      pfp: [Object ...],
      profile: [Object ...],
      followerCount: 14769,
      followingCount: 70,
      verifications: [ "0xd8da6bf26964af9d7eed9e03e53415d37aa96045" ],
      activeStatus: "active"
    }
  }
}
```

For addresses with multiple verifications, it will all resolve to the same user:

```javascript
// dwr.eth
const addr1 = "0xd7029bdea1c17493893aafe29aad69ef892b8ff2";
const addr2 = "0xa14b4c95b5247199d74c5578531b4887ca5e4909";

// use Promise.all to make multiple requests in parallel
const users = await Promise.all([
  client.lookupUserByVerification(addr1),
  client.lookupUserByVerification(addr2),
]);

console.log(users[0] === users[1]); // true
console.log(users[0]);
```

They both resolve to:

```
{
  result: {
    user: {
      fid: 3,
      custodyAddress: "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
      username: "dwr.eth",
      displayName: "Dan Romero",
      pfp: [Object ...],
      profile: [Object ...],
      followerCount: 19326,
      followingCount: 2702,
      verifications: [ "0xd7029bdea1c17493893aafe29aad69ef892b8ff2", "0xa14b4c95b5247199d74c5578531b4887ca5e4909",
        "0xb877f7bb52d28f06e60f557c00a56225124b357f", "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea"
      ],
      activeStatus: "active"
    }
  }
}
```

# Fetch user information > Follow NFT holders

This guide demonstrates how to follow Farcaster users who own a specific NFT.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

Before all that, initialize Neynar client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const signer = process.env.NEYNAR_SIGNER;
```

First, we need to get the addresses owning Milady. We can use the [Alchemy NFT API](https://docs.alchemy.com/reference/getownersforcontract-v3) to get the addresses of users who own the NFT.

```javascript
const getAddr = async (nftAddr: string): Promise<string[]> => {
  const apiKey = process.env.ALCHEMY_API_KEY;
  const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getOwnersForContract?`;
  const url = `${baseUrl}contractAddress=${nftAddr}&withTokenBalances=false`;

  const result = await fetch(url, {
    headers: { accept: "application/json" },
  });
  const data = await result.json();
  return data.owners;
};

// milady maker contract address
const nftAddr = "0x5af0d9827e0c53e4799bb226655a1de152a425a5";
const addrs = await getAddr(nftAddr);
```

Next, get Farcaster FIDs of each address, then filter out any undefined values.

```javascript
const fidLookup = async (addrs: string[]) => {
  const fids = await Promise.all(
    addrs.map(async (addr) => {
      try {
        const response = await client.lookupUserByVerification(addr);
        return response ? response.result.user.fid : undefined;
      } catch (error) {
        return undefined;
      }
    })
  );
  return fids.filter((fid) => fid !== undefined);
};

const fids = await fidLookup(addrs);
```

Then, we can use the `followUser` endpoint to follow each user.

```javascript
const result = await client.followUser(signer, fids);
console.log(result);
```

Example output:

```
{
  "success": true,
  "details": [
    {
      "success": true,
      "target_fid": 132
    },
    {
      "success": true,
      "target_fid": 78
    },
    {
      "success": true,
      "target_fid": 4262
    },
    {
      "success": true,
      "target_fid": 3602
    },
  ]
}
```

That's it! You can now follow users who own a specific NFT easily with the Neynar SDK.

# Fetch user information > Mutual follows/followers

On X (Twitter) profile page, there is a "Followed by A, B, C, and 10 others you follow". This guide demonstrates how to use the Neynar SDK to make the same thing but for Farcaster.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Say we want to get people @rish follows that also follows @manan. This is useful if we want to mutual connections between two users. We'll fetch @rish's followings first.

```javascript
const fetchAllFollowing = async (fid: number) => {
  let cursor: string | null = "";
  let users: unknown[] = [];
  do {
    const result = await client.fetchUserFollowing(fid, {
      limit: 150,
      cursor,
    });
    users = users.concat(result.result.users);
    cursor = result.result.next.cursor;
    console.log(cursor);
  } while (cursor !== "" && cursor !== null);

  return users;
};

const rishFID = 194;
const rishFollowings = await fetchAllFollowing(rishFID);
```

Then we'll fetch @manan's followers.

```javascript
const fetchAllFollowers = async (fid: number) => {
  let cursor: string | null = "";
  let users: unknown[] = [];
  do {
    const result = await client.fetchUserFollowers(fid, {
      limit: 150,
      cursor,
    });
    users = users.concat(result.result.users);
    cursor = result.result.next.cursor;
    console.log(cursor);
  } while (cursor !== "" && cursor !== null);

  return users;
};

const mananFID = 191;
const mananFollowers = await fetchAllFollowers(mananFID);
```

Think of these two arrays as sets. We want to find the intersection of these two sets. We can use the `fid` property to find the intersection.

```javascript
const mutualFollowings = rishFollowings.filter((following) =>
  mananFollowers.some((follower) => follower.fid === following.fid)
);

console.log(mutualFollowings);
```

Example output:

```
[
  {
    fid: 6227,
    custodyAddress: "0x35b92ea9c3819766ec1fff8ddecec69028b0ac42",
    username: "ekinci.eth",
    displayName: "Emre Ekinci ~ q/dau",
    pfp: {
      url: "https://i.imgur.com/smbrNPw.jpg"
    },
    profile: {
      bio: [Object ...]
    },
    followerCount: 670,
    followingCount: 660,
    verifications: [ "0x5f57c686bdbc03242c8fa723b80f0a6cdea79546"
    ],
    activeStatus: "active",
    timestamp: "2023-11-14T04:13:11.000Z"
  }, {
    fid: 280,
    custodyAddress: "0xd05d60b5762728466b43dd94ba882d050b60af67",
    username: "vrypan.eth",
    displayName: "vrypan.eth",
    pfp: {
      url: "https://i.imgur.com/jmXEW3I.png"
    },
    profile: {
      bio: [Object ...]
    },
    followerCount: 1296,
    followingCount: 493,
    verifications: [ "0x8b0573d1c80362db589eda39c2e30f5190d7eb51",
      "0x93c620d2af377c6c37e3e3c1d3e065eb04b08ae2"
    ],
    activeStatus: "active",
    timestamp: "2023-11-14T01:37:40.000Z"
  }
  // ...
]
```

Note: you'd probably want to cache the results of `fetchAllFollowing` and `fetchAllFollowers` so you don't have to make the same API calls again.

That's it! You can use this to make a "Followed by A, B, C, and 10 others you follow" info in your Farcaster app.

# Fetch user information > Mutual follows/followers > Follow NFT holders

This guide demonstrates how to follow Farcaster users who own a specific NFT.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

Before all that, initialize Neynar client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const signer = process.env.NEYNAR_SIGNER;
```

First, we need to get the addresses owning Milady. We can use the [Alchemy NFT API](https://docs.alchemy.com/reference/getownersforcontract-v3) to get the addresses of users who own the NFT.

```javascript
const getAddr = async (nftAddr: string): Promise<string[]> => {
  const apiKey = process.env.ALCHEMY_API_KEY;
  const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getOwnersForContract?`;
  const url = `${baseUrl}contractAddress=${nftAddr}&withTokenBalances=false`;

  const result = await fetch(url, {
    headers: { accept: "application/json" },
  });
  const data = await result.json();
  return data.owners;
};

// milady maker contract address
const nftAddr = "0x5af0d9827e0c53e4799bb226655a1de152a425a5";
const addrs = await getAddr(nftAddr);
```

Next, get Farcaster FIDs of each address, then filter out any undefined values.

```javascript
const fidLookup = async (addrs: string[]) => {
  const fids = await Promise.all(
    addrs.map(async (addr) => {
      try {
        const response = await client.lookupUserByVerification(addr);
        return response ? response.result.user.fid : undefined;
      } catch (error) {
        return undefined;
      }
    })
  );
  return fids.filter((fid) => fid !== undefined);
};

const fids = await fidLookup(addrs);
```

Then, we can use the `followUser` endpoint to follow each user.

```javascript
const result = await client.followUser(signer, fids);
console.log(result);
```

Example output:

```
{
  "success": true,
  "details": [
    {
      "success": true,
      "target_fid": 132
    },
    {
      "success": true,
      "target_fid": 78
    },
    {
      "success": true,
      "target_fid": 4262
    },
    {
      "success": true,
      "target_fid": 3602
    },
  ]
}
```

That's it! You can now follow users who own a specific NFT easily with the Neynar SDK.

# Fetch user information > Mutual follows/followers > Unfollow inactive users

This guide demonstrates how to unfollow Farcasters who hasn't been active in the past 3 months.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const signer = process.env.NEYNAR_SIGNER;
```

In the fetchFollowing endpoint, there's an `activeStatus` field that can be used to filter out inactive Farcasters.

```javascript
const fid = 3;
const users = await client.fetchUserFollowing(fid);
console.log(users);
```

Will result in this:

```
{
  "result": {
    "users": [
      {
        "fid": 3461,
        "custodyAddress": "0x094ce1566a83b632e59d50e2aa9618d0f4dcd432",
        "username": "jonahg",
        "displayName": "Jonah Grant",
        "pfp": {
          "url": "https://i.imgur.com/x51eW6a.jpg"
        },
        "profile": {
          "bio": {
            "text": "Software engineer in New York City",
            "mentionedProfiles": []
          }
        },
        "followerCount": 15,
        "followingCount": 0,
        "verifications": [],
        "activeStatus": "inactive",
        "timestamp": "2023-12-09T05:01:59.000Z"
      },
      {
        "fid": 18198,
        "custodyAddress": "0x718aea83c0ee2165377335a0e8ed48f1c5a34d63",
        "username": "alive.eth",
        "displayName": "Ali Yahya",
        "pfp": {
          "url": "https://i.imgur.com/1PASQSb.jpg"
        },
        "profile": {
          "bio": {
            "text": "GP @a16zcrypto. Previously Google Brain, GoogleX, Stanford Computer Science.",
            "mentionedProfiles": []
          }
        },
        "followerCount": 88,
        "followingCount": 76,
        "verifications": [
          "0x990a73079425d2b0ec746e3cc989e903306bb6c7"
        ],
        "activeStatus": "inactive",
        "timestamp": "2023-12-08T16:58:51.000Z"
      },
      {
        "fid": 9528,
        "custodyAddress": "0x80ef8b51dbba18c50b3451acea9deebc7dfcd131",
        "username": "skominers",
        "displayName": "Scott Kominers ",
        "pfp": {
          "url": "https://i.imgur.com/lxEkagM.jpg"
        },
        "profile": {
          "bio": {
            "text": "@a16zcrypto • Harvard/HBS •  • QED",
            "mentionedProfiles": []
          }
        },
        "followerCount": 289,
        "followingCount": 190,
        "verifications": [
          "0x34202f199ef058302dcced326a0105fe2db53e12"
        ],
        "activeStatus": "active",
        "timestamp": "2023-12-08T16:56:30.000Z"
      }
    ],
    "next": {
      "cursor": "eyJ0aW1lc3RhbXAiOiIyMDIzLTEyLTA4IDE2OjU2OjMwLjAwMDAwMDAiLCJmaWQiOjk1Mjh9"
    }
  }
}
```

To get fids of inactive Farcasters, we can use the `activeStatus` field to filter out active Farcasters.

```javascript
const inactiveFids = users.result.users
  .filter((user) => user.activeStatus === "inactive")
  .map((user) => user.fid);
console.log(inactiveFids); // [ 3461, 18198 ]
```

And this `inactiveFids` value can be passed to client.unfollowUser to unfollow inactive Farcasters.

```javascript
await client.unfollowUser(signer, inactiveFids);
```

Which will result in this:

```
{
  "success": true,
  "details": [
    {
      "success": true,
      "target_fid": 3461
    },
    {
      "success": true,
      "target_fid": 18198
    },
  ]
}
```

That's it! You can now unfollow inactive Farcasters easily with the Neynar SDK.

# Fetch user information > Unfollow inactive users

This guide demonstrates how to unfollow Farcasters who hasn't been active in the past 3 months.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const signer = process.env.NEYNAR_SIGNER;
```

In the fetchFollowing endpoint, there's an `activeStatus` field that can be used to filter out inactive Farcasters.

```javascript
const fid = 3;
const users = await client.fetchUserFollowing(fid);
console.log(users);
```

Will result in this:

```
{
  "result": {
    "users": [
      {
        "fid": 3461,
        "custodyAddress": "0x094ce1566a83b632e59d50e2aa9618d0f4dcd432",
        "username": "jonahg",
        "displayName": "Jonah Grant",
        "pfp": {
          "url": "https://i.imgur.com/x51eW6a.jpg"
        },
        "profile": {
          "bio": {
            "text": "Software engineer in New York City",
            "mentionedProfiles": []
          }
        },
        "followerCount": 15,
        "followingCount": 0,
        "verifications": [],
        "activeStatus": "inactive",
        "timestamp": "2023-12-09T05:01:59.000Z"
      },
      {
        "fid": 18198,
        "custodyAddress": "0x718aea83c0ee2165377335a0e8ed48f1c5a34d63",
        "username": "alive.eth",
        "displayName": "Ali Yahya",
        "pfp": {
          "url": "https://i.imgur.com/1PASQSb.jpg"
        },
        "profile": {
          "bio": {
            "text": "GP @a16zcrypto. Previously Google Brain, GoogleX, Stanford Computer Science.",
            "mentionedProfiles": []
          }
        },
        "followerCount": 88,
        "followingCount": 76,
        "verifications": [
          "0x990a73079425d2b0ec746e3cc989e903306bb6c7"
        ],
        "activeStatus": "inactive",
        "timestamp": "2023-12-08T16:58:51.000Z"
      },
      {
        "fid": 9528,
        "custodyAddress": "0x80ef8b51dbba18c50b3451acea9deebc7dfcd131",
        "username": "skominers",
        "displayName": "Scott Kominers ",
        "pfp": {
          "url": "https://i.imgur.com/lxEkagM.jpg"
        },
        "profile": {
          "bio": {
            "text": "@a16zcrypto • Harvard/HBS •  • QED",
            "mentionedProfiles": []
          }
        },
        "followerCount": 289,
        "followingCount": 190,
        "verifications": [
          "0x34202f199ef058302dcced326a0105fe2db53e12"
        ],
        "activeStatus": "active",
        "timestamp": "2023-12-08T16:56:30.000Z"
      }
    ],
    "next": {
      "cursor": "eyJ0aW1lc3RhbXAiOiIyMDIzLTEyLTA4IDE2OjU2OjMwLjAwMDAwMDAiLCJmaWQiOjk1Mjh9"
    }
  }
}
```

To get fids of inactive Farcasters, we can use the `activeStatus` field to filter out active Farcasters.

```javascript
const inactiveFids = users.result.users
  .filter((user) => user.activeStatus === "inactive")
  .map((user) => user.fid);
console.log(inactiveFids); // [ 3461, 18198 ]
```

And this `inactiveFids` value can be passed to client.unfollowUser to unfollow inactive Farcasters.

```javascript
await client.unfollowUser(signer, inactiveFids);
```

Which will result in this:

```
{
  "success": true,
  "details": [
    {
      "success": true,
      "target_fid": 3461
    },
    {
      "success": true,
      "target_fid": 18198
    },
  ]
}
```

That's it! You can now unfollow inactive Farcasters easily with the Neynar SDK.

# Fetch user information > Username search

If you have a Farcaster React app, chances are your users will want to search for other users. This guide demonstrates how to implement user search recommendations in your Farcaster React app with the Neynar SDK.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

Here's what the username search recommendation looks like:

![](https://files.readme.io/0a00db1-image.png)

We'll see the entire React component, and we'll dissect it afterwards.

```jsx
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

import { useState, useEffect } from "react";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await client.searchUser(searchTerm, 3);
        setUsers(data.result.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (searchTerm.length > 0) {
      // to prevent searching with an empty string
      fetchUsers();
    }
  }, [searchTerm]); // This will trigger the useEffect when searchTerm changes

  return (
    <div>
      <input
        type="text"
        placeholder="Search for users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {users.map((user) => (
          <li key={user.fid}>
            {user.username} - {user.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
```

Alright, now that we've seen the React component, time to go through it slowly.

We're using the [useState](https://react.dev/reference/react/useState) hook to keep track of the search term and the users we get back from the API.

```jsx
const [searchTerm, setSearchTerm] = useState("");
const [users, setUsers] = useState([]);
```

We're using the [useEffect](https://react.dev/reference/react/useEffect) hook to fetch the users when the search term changes. The API reference can be found [here](ref:search-user).

```jsx
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const data = await client.searchUser(searchTerm, 3);
      setUsers(data.result.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (searchTerm.length > 0) {
    // to prevent searching with an empty string
    fetchUsers();
  }
}, [searchTerm]); // This will trigger the useEffect when searchTerm changes
```

This input field listens to changes and updates the search term accordingly, thus triggering the `useEffect` hook.

```jsx
<input
  type="text"
  placeholder="Search for users..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
```

We're using the `map` function to iterate over the users and display them in a list. This list will be updated when the `users` state changes, which happens after the API call, which happens when the search term changes.

```jsx
<ul>
  {users.map((user) => (
    <li key={user.fid}>
      {user.username} - {user.display_name}
    </li>
  ))}
</ul>
```

That's it, you can now implement user search recommendations inside your Farcaster app!

# Fetch user information > Mutes, Blocks, and Bans

# NEYNAR SDK > Getting started with Neynar NodeJS SDK

> This tutorials uses the [Neynar nodejs sdk](https://github.com/neynarxyz/nodejs-sdk)

### Prerequisites

- Install [Node.js](https://nodejs.org/en/download/package-manager)
- Optional: Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) (Alternatively, npm can be used)

### Project Setup

**Initialize Project Directory**

```shell
mkdir get-started-with-neynar-sdk
cd get-started-with-neynar-sdk
```

**Install Neynar SDK along with typescript**

<details>
<summary>Install using npm</summary>

```shell
npm i @neynar/nodejs-sdk
npm i -D typescript
```

</details>

// or

<details>
  <summary>Install using Yarn</summary>

```shell
yarn add @neynar/nodejs-sdk
yarn add -D typescript
```

</details>

**Initialize typescript environment**

```shell
npx tsc --init
```

### Implementation: Let's use sdk to look up a user by their FID

Create index.ts file at root level

```shell
touch index.ts
```

Add the following code in index.ts

```typescript
// index.ts

import {
  NeynarAPIClient,
  Configuration,
  isApiErrorResponse,
} from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: "<YOUR_API_KEY_HERE>", // Replace with your Neynar API Key.
});

const client = new NeynarAPIClient(config);

(async () => {
  try {
    const fid = 19960; // 19960 (Required*) => fid of user we are looking for
    const viewerFid = 194; // 191 (Optional) => fid of the viewer
    // Get more info @ https://docs.neynar.com/reference/fetch-bulk-users
    const users = await client.fetchBulkUsers({ fids: [fid], viewerFid });

    // Stringify and log the response
    console.log(JSON.stringify(users));
  } catch (error) {
    // isApiErrorResponse can be used to check for Neynar API errors
    if (isApiErrorResponse(error)) {
      console.log("API Error", error.response.data);
    } else {
      console.log("Generic Error", error);
    }
  }
})();
```

### Running the project

```shell
npx ts-node index.ts
```

### Result

You should see a response like this. (You might not get a beautified/ formatted response since we `JSON.stringify` the response to log everything)

```json
{
  "users": [
    {
      "object": "user",
      "fid": 19960,
      "username": "shreyas-chorge",
      "display_name": "Shreyas",
      "pfp_url": "https://i.imgur.com/LPzRlQl.jpg",
      "custody_address": "0xd1b702203b1b3b641a699997746bd4a12d157909",
      "profile": {
        "bio": {
          "text": "Everyday regular normal guy | ‍ @neynar ..."
        },
        "location": {
          "latitude": 19.22,
          "longitude": 72.98,
          "address": {
            "city": "Thane",
            "state": "Maharashtra",
            "country": "India",
            "country_code": "in"
          }
        }
      },
      "follower_count": 250,
      "following_count": 92,
      "verifications": [
        "0xd1b702203b1b3b641a699997746bd4a12d157909",
        "0x7ea5dada4021c2c625e73d2a78882e91b93c174c"
      ],
      "verified_addresses": {
        "eth_addresses": [
          "0xd1b702203b1b3b641a699997746bd4a12d157909",
          "0x7ea5dada4021c2c625e73d2a78882e91b93c174c"
        ],
        "sol_addresses": []
      },
      "verified_accounts": null,
      "power_badge": false,
      "viewer_context": {
        "following": true,
        "followed_by": true,
        "blocking": false,
        "blocked_by": false
      }
    }
  ]
}
```

### Congratulations! You successfully setup [@neynar/nodejs-sdk](https://github.com/neynarxyz/nodejs-sdk) and used it to look up a user by their FID!

### Caution: Please do not use @neynar/nodejs-sdk on browser since NEYNAR_API_KEY will be exposed in the bundle.

# NEYNAR SDK > Using github copilot

## Install the latest version of SDK

```shell yarn
yarn add @neynar/nodejs-sdk
```

```shell npm
npm install @neynar/nodejs-sdk
```

## Open Edit with copilot

Click on copilot on the bottom right in vs-code you'll see the following menu

## Add files

Navigate to `node_modules/@neynar/nodejs-sdk/v1-to-v2-migration.md` and add the file to the working set

Search for `@neynar/nodejs-sdk`in the entire project, add all the files to the working set that uses SDK methods. (You can also drag and drop files in the copilot window to add them.)

You should see something like this

Choose an AI agent (we recommend Claude) and add the following prompt.

```
I need help migrating code from Neynar SDK v1 to v2. Here are the specific details about my code that you need to analyze and update:

1. Please scan through my code and identify any:
   - Method names that have been removed, renamed, or updated to v2 API
   - Changes in enum names or enum key formats
   - Changes in import paths
   - Changes in method argument formats
   - Changes in response structures

2. For each piece of code you analyze, please:
   - Show the existing v1 code
   - Provide the updated v2 code
   - Highlight any breaking changes in the response structure
   - Note any additional considerations or best practices

3. Key Migration Rules to Apply:
   - All v1 API methods have been removed and must be replaced with v2 alternatives
   - All method arguments should now use key-value pairs format
   - Update enum imports to use '@neynar/nodejs-sdk/build/api'
   - Update renamed enums and their key formats
   - Consider response structure changes in the new methods
   - Handle changes in client initialization

4. When showing code changes, please:
   - Include necessary import statements
   - Add comments explaining key changes
   - Highlight any breaking changes that might affect dependent code

5. Reference Information:
   - API endpoint changes and new parameters
   - Response structure modifications
   - Required vs optional parameters
   - Type changes
   - Error handling differences

Please analyze my code and provide detailed, step-by-step guidance for updating it to be compatible with Neynar SDK v2.

I need to know exactly how to update it to v2, including all necessary changes to imports, method names, parameters, and response handling.
```

With this, you should get most of the code changes correctly replaced but please verify it once. The only place where AI can make mistakes in code replacement is where [v1 API methods are used which are completely removed from the v2 SDK.](https://docs.neynar.com/reference/neynar-nodejs-sdk-v1-to-v2-migration-guide#removed-methods-and-changes-in-method-names) This is because the response structure is changed in v2 APIs.

# NEYNAR SDK > SDK v1 to v2 migration guide

> Most of the migration can be done quickly with AI: [Using github copilot](ref:migrate-to-neynar-nodejs-sdk-v2-using-github-copilot)

## Table of Contents

1. [Installation](#installation)
2. [Client Initialization](#client-initialization)
3. [Removed Methods and Changes in Method Names](#removed-methods-and-changes-in-method-names)
   - [Removed Methods](#removed-methods)
   - [Renamed Methods](#renamed-methods)
   - [Methods Updated to v2 API](#methods-updated-to-v2-api)
4. [Enum Changes](#enum-changes)
   - [Renamed enums](#renamed-enums)
   - [Enum Key Changes](#enum-key-changes)
5. [Import Path Changes](#import-path-changes)
6. [Affected v1 API Methods](#affected-v1-api-methods)
7. [Affected v2 API Methods](#affected-v2-api-methods)
   - [Users](#users)
     - [`searchUser`](#searchuser)
     - [`fetchBulkUsers`](#fetchbulkusers)
     - [`fetchBulkUsersByEthereumAddress`](#fetchbulkusersbyethereumaddress)
     - [`lookupUserByCustodyAddress`](#lookupuserbycustodyaddress)
     - [`lookupUserByUsernameV2`](#lookupuserbyusernamev2)
     - [`fetchUsersByLocation`](#fetchusersbylocation)
     - [`fetchPopularCastsByUser`](#fetchpopularcastsbyuser)
     - [`fetchRepliesAndRecastsForUser`](#fetchrepliesandrecastsforuser)
     - [`fetchCastsForUser`](#fetchcastsforuser)
     - [`followUser`](#followuser)
     - [`unfollowUser`](#unfollowuser)
     - [`registerAccount`](#registeraccount)
     - [`updateUser`](#updateuser)
     - [`publishVerification`](#publishverification)
     - [`deleteVerification`](#deleteverification)
     - [`fetchAuthorizationUrl`](#fetchauthorizationurl)
   - [Signer](#signer)
     - [`lookupSigner`](#lookupsigner)
     - [`registerSignedKey`](#registersignedkey)
     - [`lookupDeveloperManagedSigner`](#lookupdevelopermanagedsigner)
     - [`registerSignedKeyForDeveloperManagedSigner`](#registersignedkeyfordevelopermanagedsigner)
     - [`publishMessageToFarcaster`](#publishmessagetofarcaster)
   - [Cast](#cast)
     - [`lookupCastByHashOrWarpcastUrl`](#lookupcastbyhashorwarpcasturl)
     - [`publishCast`](#publishcast)
     - [`deleteCast`](#deletecast)
     - [`fetchBulkCasts`](#fetchbulkcasts)
     - [`searchCasts`](#searchcasts)
     - [`lookupCastConversation`](#lookupcastconversation)
     - [`fetchComposerActions`](#fetchcomposeractions)
   - [Feed](#feed)
     - [`fetchUserFollowingFeed`](#fetchuserfollowingfeed)
     - [`fetchFeedForYou`](#fetchfeedforyou)
     - [`fetchFeedByChannelIds`](#fetchfeedbychannelids)
     - [`fetchFeedByParentUrls`](#fetchfeedbyparenturls)
     - [`fetchFeed`](#fetchfeed)
     - [`fetchFramesOnlyFeed`](#fetchframesonlyfeed)
     - [`fetchTrendingFeed`](#fetchtrendingfeed)
   - [Reaction](#reaction)
     - [`publishReactionToCast`](#publishreactiontocast)
     - [`deleteReactionFromCast`](#deletereactionfromcast)
     - [`fetchUserReactions`](#fetchuserreactions)
     - [`fetchReactionsForCast`](#fetchreactionsforcast)
   - [Notifications](#notifications)
     - [`fetchAllNotifications`](#fetchallnotifications)
     - [`fetchChannelNotificationsForUser`](#fetchchannelnotificationsforuser)
     - [`fetchNotificationsByParentUrlForUser`](#fetchnotificationsbyparenturlforuser)
     - [`markNotificationsAsSeen`](#marknotificationsasseen)
   - [Channel](#channel)
     - [`searchChannels`](#searchchannels)
     - [`fetchBulkChannels`](#fetchbulkchannels)
     - [`lookupChannel`](#lookupchannel)
     - [`removeChannelMember`](#removechannelmember)
     - [`fetchChannelMembers`](#fetchchannelmembers)
     - [`inviteChannelMember`](#invitechannelmember)
     - [`respondChannelInvite`](#respondchannelinvite)
     - [`fetchFollowersForAChannel`](#fetchfollowersforachannel)
     - [`fetchRelevantFollowersForAChannel`](#fetchrelevantfollowersforachannel)
     - [`fetchUserChannels`](#fetchuserchannels)
     - [`fetchUserChannelMemberships`](#fetchuserchannelmemberships)
     - [`followChannel`](#followchannel)
     - [`unfollowChannel`](#unfollowchannel)
     - [`fetchTrendingChannels`](#fetchtrendingchannels)
     - [`fetchUsersActiveChannels`](#fetchusersactivechannels)
   - [Follows](#follows)
     - [`fetchUserFollowersV2`](#fetchuserfollowersv2)
     - [`fetchRelevantFollowers`](#fetchrelevantfollowers)
     - [`fetchUserFollowingV2`](#fetchuserfollowingv2)
     - [`fetchFollowSuggestions`](#fetchfollowsuggestions)
   - [Storage](#storage)
     - [`lookupUserStorageAllocations`](#lookupuserstorageallocations)
     - [`lookupUserStorageUsage`](#lookupuserstorageusage)
     - [`buyStorage`](#buystorage)
   - [Frame](#frame)
     - [`postFrameAction`](#postframeaction)
     - [`validateFrameAction`](#validateframeaction)
     - [`fetchValidateFrameAnalytics`](#fetchvalidateframeanalytics)
     - [`lookupNeynarFrame`](#lookupneynarframe)
     - [`deleteNeynarFrame`](#deleteneynarframe)
     - [`fetchFrameMetaTagsFromUrl`](#fetchframemetatagsfromurl)
     - [`postFrameActionDeveloperManaged`](#postframeactiondevelopermanaged)
   - [fname](#fname)
     - [`isFnameAvailable`](#isfnameavailable)
   - [Webhook](#webhook)
     - [`lookupWebhook`](#lookupwebhook)
     - [`publishWebhook`](#publishwebhook)
     - [`updateWebhookActiveStatus`](#updatewebhookactivestatus)
     - [`updateWebhook`](#updateWebhook)
     - [`deleteWebhook`](#deletewebhook)
   - [Action](#action)
     - [`publishFarcasterAction`](#publishfarcasteraction)
   - [Mute](#mute)
     - [`fetchMuteList`](#fetchmutelist)
     - [`publishMute`](#publishmute)
     - [`deleteMute`](#deletemute)
   - [Block](#block)
     - [`publishBlock`](#publishblock)
     - [`deleteBlock`](#deleteblock)
   - [Ban](#ban)
     - [`publishBans`](#publishbans)
     - [`deleteBans`](#deletebans)
   - [Onchain](#onchain)
     - [`fetchUserBalance`](#fetchuserbalance)
     - [`fetchSubscriptionsForFid`](#fetchsubscriptionsforfid)
     - [`fetchSubscribedToForFid`](#fetchsubscribedtoforfid)
     - [`fetchSubscribersForFid`](#fetchsubscribersforfid)
     - [`fetchSubscriptionCheck`](#fetchsubscriptioncheck)

---

## Installation

```shell
yarn add @neynar/nodejs-sdk
```

OR

```shell
npm install @neynar/nodejs-sdk
```

## Client Initialization

v1

```typescript
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient("API_KEY", {
  baseOptions: {
    headers: {
      "x-neynar-experimental": true,
    },
  },
});
```

v2

```typescript
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: "API_KEY",
  baseOptions: {
    headers: {
      "x-neynar-experimental": true,
    },
  },
});

const client = new NeynarAPIClient(config);
```

---

## Removed Methods and Changes in Method Names

**Note: All Neynar API v1-related methods have been removed from SDK v2. This version of the SDK will only support Neynar API v2.**

#### Removed Methods

The following methods have been removed entirely from SDK v2:

| **Removed Method**                  | **Replacement**                                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `fetchRecentUsers`                  | Use [webhook](https://docs.neynar.com/docs/how-to-setup-webhooks-from-the-dashboard) or [kafka](https://docs.neynar.com/docs/from-kafka-stream) |
| `fetchAllCastsLikedByUser`          | [`fetchUserReactions`](#fetchuserreactions)                                                                                                     |
| `lookupUserByFid`                   | [`fetchBulkUsers`](#fetchbulkusers)                                                                                                             |
| `lookupCustodyAddressForUser`       | [`fetchBulkUsers`](#fetchbulkusers)                                                                                                             |
| `lookUpCastByHash`                  | [`lookupCastByHashOrWarpcastUrl`](#lookupcastbyhashorwarpcasturl)                                                                               |
| `fetchAllCastsInThread`             | [`lookupCastConversation`](#lookupcastconversation)                                                                                             |
| `fetchAllCastsCreatedByUser`        | [`fetchCastsForUser`](#fetchcastsforuser)                                                                                                       |
| `fetchRecentCasts`                  | Use [webhook](https://docs.neynar.com/docs/how-to-setup-webhooks-from-the-dashboard) or [kafka](https://docs.neynar.com/docs/from-kafka-stream) |
| `fetchUserVerifications`            | [`fetchBulkUsers`](#fetchbulkusers)                                                                                                             |
| `lookupUserByVerification`          | [`fetchBulkUsersByEthOrSolAddress`](#fetchbulkusersbyethereumaddress)                                                                           |
| `fetchMentionAndReplyNotifications` | [`fetchAllNotifications`](#fetchallnotifications)                                                                                               |
| `fetchUserLikesAndRecasts`          | [`fetchUserReactions`](#fetchuserreactions)                                                                                                     |

Checkout [Affected v1 API Methods](#affected-v1-api-methods) on how to replace it.

#### Renamed Methods

Several methods in SDK v2 have been renamed for consistency and clarity:

| v1 Method Name                    | v2 Method Name                    |
| --------------------------------- | --------------------------------- |
| `lookUpCastByHashOrWarpcastUrl`   | `lookupCastByHashOrWarpcastUrl`   |
| `publishReactionToCast`           | `publishReaction`                 |
| `deleteReactionFromCast`          | `deleteReaction`                  |
| `fetchReactionsForCast`           | `fetchCastReactions`              |
| `fetchBulkUsersByEthereumAddress` | `fetchBulkUsersByEthOrSolAddress` |

#### Methods Updated to v2 API

These methods retain the original method names but now use the v2 version of the neynar API:

| v1 Method Name           | v2 Method Name         |
| ------------------------ | ---------------------- |
| `fetchUserFollowersV2`   | `fetchUserFollowers`   |
| `fetchUserFollowingV2`   | `fetchUserFollowing`   |
| `lookupUserByUsernameV2` | `lookupUserByUsername` |

---

## Enum Changes

#### Renamed enums

The following enums have been renamed in SDK v2 to align with the updated naming conventions:

| v1 Enum Name             | v2 Enum Name                          |
| ------------------------ | ------------------------------------- |
| `TimeWindow`             | `FetchTrendingChannelsTimeWindowEnum` |
| `TrendingFeedTimeWindow` | `FetchTrendingFeedTimeWindowEnum`     |
| `BulkCastsSortType`      | `FetchBulkCastsSortTypeEnum`          |
| `BulkUserAddressTypes`   | `BulkUserAddressType`                 |

#### Enum Key Changes

Certain enum keys have been modified in SDK v2. If you were using the following enums, be aware that their key formats may have changed:

- `NotificationType`
- `ValidateFrameAggregateWindow`
- `FetchTrendingChannelsTimeWindowEnum` (formerly `TimeWindow`)
- `FetchTrendingFeedTimeWindowEnum` (formerly `TrendingFeedTimeWindow`)
- `FetchBulkCastsSortTypeEnum` (formerly `BulkCastsSortType`)
- `BulkUserAddressType` (formerly `BulkUserAddressTypes`)

---

## Import Path Changes

All the api-related enums and schemas are now centralized and exported from `/build/api` directory instead of `/build/neynar-api/v2/*`

```typescript
import {CastParamType, NotificationTypeEnum, User, Cast, ...etc } from '@neynar/nodejs-sdk/build/api'
```

Note: Imports for following `isApiErrorResponse` utility function and Webhook interfaces remains the same

```typescript
import { isApiErrorResponse, WebhookFollowCreated, WebhookFollowDeleted, WebhookReactionCreated, WebhookReactionDeleted, WebhookCastCreated, WebhookUserCreated, WebhookUserUpdated } form '@neynar/nodejs-sdk'
```

---

## Affected v1 API Methods

The following methods have been completely removed in SDK v2 (Ref. [Removed Methods](#removed-methods)). As a result, the response structure will be different in the new methods that replace the deprecated v1 methods.

#### `fetchAllCastsLikedByUser` (Use `fetchUserReactions`)

`fetchAllCastsLikedByUser`

```typescript
const fid = 3;
const viewerFid = 2;
const limit = 50;

client
  .fetchAllCastsLikedByUser(fid, {
    viewerFid,
    limit,
  })
  .then((response) => {
    const { likes, reactor, next } = response.result;
    console.log("likes", likes); // likes.reaction, likes.cast, likes.cast_author
    console.log("reactor", reactor);
    console.log("nextCursor", next.cursor);
  });
```

`fetchUserReactions`

```typescript
import { ReactionsType } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const viewerFid = 2;
const limit = 50;
const type = ReactionsType.Likes;

client.fetchUserReactions({ fid, type, viewerFid, limit }).then((response) => {
  const { reactions } = response; // This structure is changed
  console.log("likes", reactions);
});
```

#### `lookupUserByFid` (Use `fetchBulkUsers`)

`lookupUserByFid`

```typescript
const fid = 19960;
const viewerFid = 194;

client.lookupUserByFid(fid, viewerFid).then((response) => {
  const { user } = response.result;
  console.log("user", user);
});
```

`fetchBulkUsers`

```typescript
const fid = 3;
const viewerFid = 2;

client.fetchBulkUsers({ fids: [fid], viewerFid }).then((res) => {
  const { users } = res;
  console.log("user", users[0]); // This structure is changed
});
```

#### `lookupCustodyAddressForUser` (Use `fetchBulkUsers`)

`lookupCustodyAddressForUser`

```typescript
const fid = 19960;

client.lookupCustodyAddressForUser(fid).then((response) => {
  const { fid, custodyAddress } = response.result;
  console.log("fid:", fid);
  console.log("custodyAddress:", custodyAddress);
});
```

`fetchBulkUsers`

```typescript
const fid = 19960;

client.fetchBulkUsers({ fids: [fid] }).then((res) => {
  const { users } = res;
  console.log("fid:", users[0].fid);
  console.log("custodyAddress", users[0].custody_address);
});
```

#### `lookUpCastByHash` (Use `lookupCastByHashOrWarpcastUrl`)

`lookUpCastByHash`

```typescript
const hash = "0xfe90f9de682273e05b201629ad2338bdcd89b6be";
const viewerFid = 3;

client
  .lookUpCastByHash(hash, {
    viewerFid,
  })
  .then((response) => {
    const { cast } = response.result;
    console.log(cast);
  });
```

`lookupCastByHashOrWarpcastUrl`

```typescript
import { CastParamType } from "@neynar/nodejs-sdk/build/api";

const hash = "0xfe90f9de682273e05b201629ad2338bdcd89b6be";
const viewerFid = 3;
const type = CastParamType.Hash;

client
  .lookupCastByHashOrWarpcastUrl({
    identifier: hash,
    type,
    viewerFid,
  })
  .then((response) => {
    const { cast } = response;
    console.log("cast", cast); // This structure is changed
  });
```

#### `fetchAllCastsInThread` (Use `lookupCastConversation`)

`fetchAllCastsInThread`

```typescript
const hash = "0xfe90f9de682273e05b201629ad2338bdcd89b6be";
const viewerFid = 3;

client.fetchAllCastsInThread(hash, viewerFid).then((response) => {
  const { casts } = response.result;
  console.log("conversation", casts);
});
```

`lookupCastConversation`

```typescript
import { CastParamType } from "@neynar/nodejs-sdk/build/api";

const hash = "0xfe90f9de682273e05b201629ad2338bdcd89b6be";
const viewerFid = 3;
const type = CastParamType.Hash;

client
  .lookupCastConversation({
    identifier: hash,
    type,
    viewerFid,
  })
  .then((response) => {
    const { cast } = response.conversation;
    console.log("conversation", cast); // This structure is changed
  });
```

#### `fetchAllCastsCreatedByUser` (Use `fetchCastsForUser`)

`fetchAllCastsCreatedByUser`

```typescript
const fid = 3;
const parentUrl = "https://ethereum.org";
const viewerFid = 2;
const limit = 5;

client
  .fetchAllCastsCreatedByUser(fid, {
    parentUrl,
    viewerFid,
    limit,
  })
  .then((response) => {
    const { casts } = response.result;
    console.log("User Casts:", casts);
  });
```

`fetchCastsForUser`

```typescript
const fid = 3;
const parentUrl = "https://ethereum.org";
const viewerFid = 2;
const limit = 5;

client
  .fetchCastsForUser({ fid, parentUrl, viewerFid, limit })
  .then((response) => {
    const { casts } = response;
    console.log("Users casts: ", casts); // This structure is changed
  });
```

#### `fetchUserVerifications` (Use `fetchBulkUsers`)

`fetchUserVerifications`

```typescript
const fid = 3;

client.fetchUserVerifications(fid).then((response) => {
  const { fid, username, display_name, verifications } = response.result;
  console.log("fid ", fid);
  console.log("username ", username);
  console.log("display_name ", display_name);
  console.log("verifications ", verifications);
});
```

`fetchBulkUsers`

```typescript
const fid = 3;

client.fetchBulkUsers({ fids: [fid] }).then((response) => {
  const { fid, username, display_name, verified_addresses } = response.users[0];
  console.log("fid ", fid);
  console.log("username ", username);
  console.log("display_name ", display_name);
  console.log("verifications ", verified_addresses);
});
```

#### `lookupUserByVerification` (Use `fetchBulkUsersByEthOrSolAddress`)

`lookupUserByVerification`

```typescript
const address = "0x7ea5dada4021c2c625e73d2a78882e91b93c174c";

client.lookupUserByVerification(address).then((response) => {
  const { user } = response.result;
  console.log("User:", user);
});
```

`fetchBulkUsersByEthOrSolAddress`

```typescript
import { BulkUserAddressType } from "@neynar/nodejs-sdk/build/api";

const addresses = ["0x7ea5dada4021c2c625e73d2a78882e91b93c174c"];
const addressTypes = [BulkUserAddressType.VerifiedAddress];

client
  .fetchBulkUsersByEthOrSolAddress({ addresses, addressTypes })
  .then((response) => {
    const user = response[addresses[0]];
    console.log("User:", user[0]); // This structure is changed
  });
```

#### `fetchMentionAndReplyNotifications` (Use `fetchAllNotifications`)

`fetchMentionAndReplyNotifications`

```typescript
const fid = 3;
const viewerFid = 2;

client
  .fetchMentionAndReplyNotifications(fid, {
    viewerFid,
  })
  .then((response) => {
    console.log("Notifications:", response.result);
  });
```

`fetchAllNotifications`

```typescript
const fid = 3;

client.fetchAllNotifications({ fid }).then((response) => {
  console.log("response:", response); // This structure is changed
});
```

#### `fetchUserLikesAndRecasts` (Use `fetchUserReactions`)

`fetchUserLikesAndRecasts`

```typescript
const fid = 12345;
const viewerFid = 67890;
const limit = 5;

client
  .fetchUserLikesAndRecasts(fid, {
    viewerFid,
    limit,
  })
  .then((response) => {
    const { notifications } = response.result;
    console.log("User Reactions : ", notifications);
  });
```

`fetchUserReactions`

```typescript
import { ReactionsType } from "@neynar/nodejs-sdk/build/api";

const fid = 12345;
const viewerFid = 67890;
const limit = 5;

client
  .fetchUserReactions({ fid, type: ReactionsType.All, viewerFid, limit })
  .then((response) => {
    const { reactions } = response;
    console.log("User Reactions : ", reactions);
  });
```

## Affected v2 API Methods

1. **Arguments Format**:  
   In SDK v2, all methods now accept arguments as key-value pairs (kvargs). In SDK v1, only optional parameters were passed as key-value pairs, while required arguments were simple parameters.

### Users

#### `searchUser`

#### **v1**

```typescript
const q = "ris";
const viewerFid = 19960;
const limit = 10;

client.searchUser(q, viewerFid, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const q = "ris";
const viewerFid = 19960;
const limit = 10;

client.searchUser({ q, viewerFid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchBulkUsers`

#### **v1**

```typescript
const fids = [2, 3];
const viewerFid = 19960;

client.fetchBulkUsers(fids, { viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fids = [2, 3];
const viewerFid = 19960;

client.fetchBulkUsers({ fids, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchBulkUsersByEthereumAddress`

#### **v1**

```typescript
import { BulkUserAddressTypes } from "@neynar/nodejs-sdk";

const addresses = [
  "0xa6a8736f18f383f1cc2d938576933e5ea7df01a1",
  "0x7cac817861e5c3384753403fb6c0c556c204b1ce",
];
const addressTypes = [BulkUserAddressTypes.CUSTODY_ADDRESS];
const viewerFid = 3;

client
  .fetchBulkUsersByEthereumAddress(addresses, { addressTypes, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `fetchBulkUsersByEthereumAddress` is renamed to `fetchBulkUsersByEthOrSolAddress` (Ref. [Renamed Methods](#renamed-methods))
2. `BulkUserAddressTypes` is renamed to `BulkUserAddressType` (Ref. [Renamed enums](#renamed-enums))
3. Import path for `BulkUserAddressType` is changed (Ref. [Import path changes](#import-path-changes))
4. Enum key changed from `CUSTODY_ADDRESS` to `CustodyAddress` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import { BulkUserAddressType } from "@neynar/nodejs-sdk/build/api";

const addresses = [
  "0xa6a8736f18f383f1cc2d938576933e5ea7df01a1",
  "0x7cac817861e5c3384753403fb6c0c556c204b1ce",
];
const addressTypes = [BulkUserAddressType.CustodyAddress];
const viewerFid = 3;

client
  .fetchBulkUsersByEthOrSolAddress({ addresses, addressTypes, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `lookupUserByCustodyAddress`

#### **v1**

```typescript
const custodyAddress = "0xd1b702203b1b3b641a699997746bd4a12d157909";

client.lookupUserByCustodyAddress(custodyAddress).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const custodyAddress = "0xd1b702203b1b3b641a699997746bd4a12d157909";

client.lookupUserByCustodyAddress({ custodyAddress }).then((response) => {
  console.log("response:", response);
});
```

#### `lookupUserByUsernameV2`

This method is renamed to `lookupUserByUsername`.

#### **v1**

```typescript
const username = "manan";
const viewerFid = 3;

client.lookupUserByUsernameV2(username, { viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note: `lookupUserByUsernameV2` is now renamed to `lookupUserByUsername` (Ref. [Methods Updated to v2 API](#methods-updated-to-v2-api))

```typescript
const username = "manan";
const viewerFid = 3;

client.lookupUserByUsername({ username, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchUsersByLocation`

#### **v1**

```typescript
const latitude = 37.7749;
const longitude = -122.4194;
const viewerFid = 3;
const limit = 5;

client
  .fetchUsersByLocation(latitude, longitude, { viewerFid, limit })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const latitude = 37.7749;
const longitude = -122.4194;
const viewerFid = 3;
const limit = 5;

client
  .fetchUsersByLocation({ latitude, longitude, viewerFid, limit })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchPopularCastsByUser`

#### **v1**

```typescript
const fid = 3;
const viewerFid = 19960;

client.fetchPopularCastsByUser(fid, { viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const viewerFid = 19960;

client.fetchPopularCastsByUser({ fid, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchRepliesAndRecastsForUser`

#### **v1**

```typescript
const fid = 3;
const limit = 25;
const viewerFid = 19960;

client
  .fetchRepliesAndRecastsForUser(fid, { limit, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const fid = 3;
const limit = 25;
const viewerFid = 3;

client
  .fetchRepliesAndRecastsForUser({ fid, limit, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchCastsForUser`

#### **v1**

```typescript
const fid = 3;
const viewerFid = 3;
const limit = 25;
const includeReplies = false;

client
  .fetchCastsForUser(fid, {
    limit,
    viewerFid,
    includeReplies,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const fid = 3;
const viewerFid = 3;
const limit = 25;
const includeReplies = false;

client
  .fetchCastsForUser({ fid, viewerFid, limit, includeReplies })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `followUser`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const targetFids = [3, 2, 1];

client.followUser(signerUuid, targetFids).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const targetFids = [3, 2, 1];

client.followUser({ signerUuid, targetFids }).then((response) => {
  console.log("response:", response);
});
```

#### `unfollowUser`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const targetFids = [3, 2, 1];

client.unfollowUser(signerUuid, targetFids).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const targetFids = [3, 2, 1];

client.unfollowUser({ signerUuid, targetFids }).then((response) => {
  console.log("response:", response);
});
```

#### `registerAccount`

#### **v1**

```typescript
const signature = "signatureString";
const fid = 12345;
const requestedUserCustodyAddress = "0x123...abc";
const deadline = 1672531200;
const fname = "newUsername";

client
  .registerAccount(fid, signature, requestedUserCustodyAddress, deadline, {
    fname,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const signature = "signatureString";
const fid = 12345;
const requestedUserCustodyAddress = "0x123...abc";
const deadline = 1672531200;
const fname = "newUsername";

client
  .registerAccount({
    signature,
    fid,
    requestedUserCustodyAddress,
    deadline,
    fname,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `updateUser`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const bio = "New bio here";
const pfpUrl = "https://example.com/pfp.jpg";
const username = "newUsername";
const displayName = "New Display Name";

client
  .updateUser(signerUuid, {
    bio,
    pfpUrl,
    username,
    displayName,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const bio = "New bio here";
const pfpUrl = "https://example.com/pfp.jpg";
const username = "newUsername";
const displayName = "New Display Name";

client
  .updateUser({ signerUuid, bio, pfpUrl, username, displayName })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `publishVerification`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const address = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";
const blockHash =
  "0x191905a9201170abb55f4c90a4cc968b44c1b71cdf3db2764b775c93e7e22b29";
const ethSignature =
  "0x2fc09da1f4dcb723fefb91f77932c249c418c0af00c66ed92ee1f35002c80d6a1145280c9f361d207d28447f8f7463366840d3a9309036cf6954afd1fd331beb1b";

client
  .publishVerification(signerUuid, address, blockHash, ethSignature)
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const address = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";
const blockHash =
  "0x191905a9201170abb55f4c90a4cc968b44c1b71cdf3db2764b775c93e7e22b29";
const ethSignature =
  "0x2fc09da1f4dcb723fefb91f77932c249c418c0af00c66ed92ee1f35002c80d6a1145280c9f361d207d28447f8f7463366840d3a9309036cf6954afd1fd331beb1b";

client
  .publishVerification({ signerUuid, address, blockHash, ethSignature })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `deleteVerification`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const address = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";

client.deleteVerification(signerUuid, address).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const address = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";

client.deleteVerification({ signerUuid, address }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchAuthorizationUrl`

#### **v1**

```typescript
import { AuthorizationUrlResponseType } from "@neynar/nodejs-sdk";

const clientId = "your-client-id";
const responseType = AuthorizationUrlResponseType.Code;

client.fetchAuthorizationUrl(clientId, responseType).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note: The import path for `AuthorizationUrlResponseType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { AuthorizationUrlResponseType } from "@neynar/nodejs-sdk/build/api";

const clientId = "your-client-id";
const responseType = AuthorizationUrlResponseType.Code;

client.fetchAuthorizationUrl({ clientId, responseType }).then((response) => {
  console.log("response:", response);
});
```

#### Signer

#### `lookupSigner`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";

client.lookupSigner(signerUuid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";

client.lookupSigner({ signerUuid }).then((response) => {
  console.log("response:", response);
});
```

#### `registerSignedKey`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const signature = "0xsig_1";
const appFid = 18949;
const deadline = 1625097600;
const sponsor = {
  fid: 0,
  signature: `0xsig_2`,
};

client
  .registerSignedKey(signerUuid, appFid, deadline, signature, { sponsor })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const signature = "0xsig_1";
const appFid = 18949;
const deadline = 1625097600;
const sponsor = {
  fid: 0,
  signature: `0xsig_2`,
};

client
  .registerSignedKey({ signerUuid, signature, appFid, deadline, sponsor })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `lookupDeveloperManagedSigner`

#### **v1**

```typescript
const publicKey =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

client.lookupDeveloperManagedSigner(publicKey).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const publicKey =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";

client.lookupDeveloperManagedSigner({ publicKey }).then((response) => {
  console.log("response:", response);
});
```

#### `registerSignedKeyForDeveloperManagedSigner`

#### **v1**

```typescript
const publicKey =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const signature = "0xsig_1";
const appFid = 12345;
const deadline = 1625097600;
const sponsor = {
  fid: 0,
  signature: `0xsig_2`,
};

client
  .registerSignedKeyForDeveloperManagedSigner(
    publicKey,
    signature,
    appFid,
    deadline,
    { sponsor }
  )
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const publicKey =
  "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const signature = "0xsig_1";
const appFid = 12345;
const deadline = 1625097600;
const sponsor = {
  fid: 0,
  signature: `0xsig_2`,
};

client
  .registerSignedKeyForDeveloperManagedSigner({
    publicKey,
    signature,
    appFid,
    deadline,
    sponsor,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `publishMessageToFarcaster`

#### **v1**

```typescript
const body = {};

client.publishMessageToFarcaster(body).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const body = {};

client.publishMessageToFarcaster({ body }).then((response) => {
  console.log("response:", response);
});
```

#### Cast

#### `lookUpCastByHashOrWarpcastUrl`

#### **v1**

```typescript
import { CastParamType } from "@neynar/nodejs-sdk";

const identifier = "https://warpcast.com/rish/0x9288c1";
const type = CastParamType.Url;
const viewerFid = 3;

client
  .lookUpCastByHashOrWarpcastUrl(identifier, type, { viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `lookUpCastByHashOrWarpcastUrl` is renamed to `lookupCastByHashOrWarpcastUrl` and now accepts a dictionary instead of a single parameter. (Ref. [Renamed Methods](#renamed-methods))
2. The import path for `CastParamType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { CastParamType } from "@neynar/nodejs-sdk/build/api";

const identifier = "https://warpcast.com/rish/0x9288c1";
const type = CastParamType.Url;
const viewerFid = 3;

client
  .lookupCastByHashOrWarpcastUrl({ identifier, type, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `publishCast`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const text = "Testing publishCast() method";
const embeds = [
  {
    url: "https://warpcast.com/harper.eth/0x3c974d78",
  },
];
const replyTo = "0x9e95c380791fce11ffbb14b2ea458b233161bafd";
const idem = "my-cast-idem";
const parent_author_fid = 6131;

client
  .publishCast(signerUuid, text, {
    replyTo,
    idem,
    embeds,
    parent_author_fid,
  })
  .then((response) => {
    console.log("cast:", response);
  });
```

#### **v2**

Note:

1. `replyTo` param is now renamed to `parent`
2. `parent_author_fid` is now cam camelCase (`parentAuthorFid`)
3. sdk v1 `response` object is sdk v2 `response.cast` object

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const text = "Testing publishCast() method";
const embeds = [
  {
    url: "https://warpcast.com/harper.eth/0x3c974d78",
  },
];
const replyTo = "0x9e95c380791fce11ffbb14b2ea458b233161bafd";
const idem = "my-cast-idem";
const parentAuthorFid = 6131;

client
  .publishCast({
    signerUuid,
    text,
    embeds,
    parent: replyTo,
    idem,
    parentAuthorFid,
  })
  .then((response) => {
    console.log("cast:", response.cast);
  });
```

#### `deleteCast`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const targetHash = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";

client.deleteCast(signerUuid, targetHash).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const targetHash = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";

client.deleteCast({ signerUuid, targetHash }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchBulkCasts`

#### **v1**

```typescript
import { BulkCastsSortType } from "@neynar/nodejs-sdk";

const casts = [
  "0xa896906a5e397b4fec247c3ee0e9e4d4990b8004",
  "0x27ff810f7f718afd8c40be236411f017982e0994",
];
const viewerFid = 3;
const sortType = BulkCastsSortType.LIKES;

client
  .fetchBulkCasts(casts, {
    viewerFid,
    sortType,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `BulkCastsSortType` is renamed to `FetchBulkCastsSortTypeEnum` (Ref. [Renamed enums](#renamed-enums))
2. Enum key is changed now `LIKES` is `Likes` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import { FetchBulkCastsSortTypeEnum } from "@neynar/nodejs-sdk";

const casts = [
  "0xa896906a5e397b4fec247c3ee0e9e4d4990b8004",
  "0x27ff810f7f718afd8c40be236411f017982e0994",
];
const viewerFid = 3;
const sortType = FetchBulkCastsSortTypeEnum.LIKES;

client.fetchBulkCasts({ casts, viewerFid, sortType }).then((response) => {
  console.log("response:", response);
});
```

#### `searchCasts`

#### **v1**

```typescript
const q = "We are releasing a v2 of our nodejs sdk.";
const authorFid = 19960;
const viewerFid = 3;
const limit = 3;

client.searchCasts(q, { authorFid, viewerFid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const q = "We are releasing a v2 of our nodejs sdk.";
const authorFid = 19960;
const viewerFid = 3;
const limit = 3;

client.searchCasts({ q, authorFid, viewerFid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `lookupCastConversation`

#### **v1**

```typescript
import { CastParamType } from "@neynar/nodejs-sdk";

const identifier = "https://warpcast.com/rish/0x9288c1";
const type = CastParamType.Url;
const replyDepth = 2;
const includeChronologicalParentCasts = true;
const viewerFid = 3;
const fold = "above";
const limit = 2;

client
  .lookupCastConversation(
    "https://warpcast.com/rish/0x9288c1",
    CastParamType.Url,
    {
      replyDepth,
      includeChronologicalParentCasts,
      fold,
      viewerFid,
      limit,
    }
  )
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `CastParamType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { CastParamType } from "@neynar/nodejs-sdk/build/api";

const identifier = "https://warpcast.com/rish/0x9288c1";
const type = CastParamType.Url;
const replyDepth = 2;
const includeChronologicalParentCasts = true;
const viewerFid = 3;
const fold = "above";
const limit = 2;

client
  .lookupCastConversation({
    identifier,
    type,
    replyDepth,
    includeChronologicalParentCasts,
    viewerFid,
    fold,
    limit,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchComposerActions`

#### **v1**

```typescript
import { CastComposerType } from "@neynar/nodejs-sdk/neynar-api/v2";

const list = CastComposerType.Top;
const limit = 25;

client.fetchComposerActions(list, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note: The import path for `CastComposerType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { CastComposerType } from "@neynar/nodejs-sdk/build/api";

const list = CastComposerType.Top;
const limit = 25;

client.fetchComposerActions({ list, limit }).then((response) => {
  console.log("response:", response);
});
```

#### Feed

#### `fetchUserFollowingFeed`

#### **v1**

```typescript
const fid = 3;
const viewerFid = 100;
const withRecasts = true;
const limit = 30;

client
  .fetchUserFollowingFeed(fid, {
    withRecasts,
    limit,
    viewerFid,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const fid = 3;
const viewerFid = 100;
const withRecasts = true;
const limit = 30;

client
  .fetchUserFollowingFeed({ fid, viewerFid, withRecasts, limit })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFeedForYou`

#### **v1**

```typescript
import { ForYouProvider } from "@neynar/nodejs-sdk/neynar-api/v2";

const fid = 3;
const viewerFid = 10;
const provider = ForYouProvider.Mbd;
const limit = 20;
const providerMetadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://farcaster.group/founders"],
    },
  })
);

client
  .fetchFeedForYou(fid, {
    limit,
    viewerFid,
    provider,
    providerMetadata: providerMetadata,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `ForYouProvider` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ForYouProvider } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const viewerFid = 10;
const provider = ForYouProvider.Mbd;
const limit = 20;
const providerMetadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://farcaster.group/founders"],
    },
  })
);

client
  .fetchFeedForYou({ fid, viewerFid, provider, limit, providerMetadata })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFeedByChannelIds`

#### **v1**

```typescript
const channelIds = ["neynar", "farcaster"];
const withRecasts = true;
const viewerFid = 100;
const withReplies = true;
const limit = 30;
const shouldModerate = false;

client
  .fetchFeedByChannelIds(channelIds, {
    withRecasts,
    withReplies,
    limit,
    viewerFid,
    shouldModerate,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const channelIds = ["neynar", "farcaster"];
const withRecasts = true;
const viewerFid = 100;
const withReplies = true;
const limit = 30;
const shouldModerate = false;

client
  .fetchFeedByChannelIds({
    channelIds,
    withRecasts,
    viewerFid,
    withReplies,
    limit,
    shouldModerate,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFeedByParentUrls`

#### **v1**

```typescript
const parentUrls = [
  "chain://eip155:1/erc721:0xd4498134211baad5846ce70ce04e7c4da78931cc",
];
const withRecasts = true;
const viewerFid = 100;
const withReplies = true;
const limit = 30;

client
  .fetchFeedByParentUrls(parentUrls, {
    withRecasts,
    withReplies,
    limit,
    viewerFid,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const parentUrls = [
  "chain://eip155:1/erc721:0xd4498134211baad5846ce70ce04e7c4da78931cc",
];
const withRecasts = true;
const viewerFid = 100;
const withReplies = true;
const limit = 30;

client
  .fetchFeedByParentUrls({
    parentUrls,
    withRecasts,
    viewerFid,
    withReplies,
    limit,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFeed`

#### **v1**

```typescript
import { FeedType } from "@neynar/nodejs-sdk/neynar-api/v2";

const feedType = FeedType.Following;
const fid = 3;
const withRecasts = true;
const limit = 50;
const viewerFid = 100;

client
  .fetchFeed(feedType, { fid, limit, withRecasts, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `FeedType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { FeedType } from "@neynar/nodejs-sdk/build/api";

const feedType = FeedType.Following;
const fid = 3;
const withRecasts = true;
const limit = 50;
const viewerFid = 100;

client
  .fetchFeed({ feedType, fid, withRecasts, limit, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFramesOnlyFeed`

#### **v1**

```typescript
const limit = 30;
const viewerFid = 3;

client.fetchFramesOnlyFeed({ limit, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const limit = 30;
const viewerFid = 3;

client.fetchFramesOnlyFeed({ limit, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchTrendingFeed`

#### **v1**

```typescript
import { TrendingFeedTimeWindow } from "@neynar/nodejs-sdk";

const limit = 10;
const viewerFid = 3;
const timeWindow = TrendingFeedTimeWindow.SIX_HOUR;
const channelId = "farcaster";
const provider = "mbd";
const providerMetadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://farcaster.group/founders"],
    },
  })
);

client
  .fetchTrendingFeed({
    limit,
    timeWindow,
    channelId,
    viewerFid,
    provider,
    providerMetadata,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `TrendingFeedTimeWindow` is renamed to `FetchTrendingFeedTimeWindowEnum` (Ref. [Renamed enums](#renamed-enums))
2. The import path is for `FetchTrendingFeedTimeWindowEnum` changed. (Ref. [Import path changes](#import-path-changes))
3. Enum Keys have changed `SIX_HOUR` to `_6h` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import { FetchTrendingFeedTimeWindowEnum } from "@neynar/nodejs-sdk/build/api";

const limit = 10;
const viewerFid = 3;
const timeWindow = FetchTrendingFeedTimeWindowEnum._6h;
const channelId = "farcaster";
const provider = "mbd";
const providerMetadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://farcaster.group/founders"],
    },
  })
);

client
  .fetchTrendingFeed({
    limit,
    viewerFid,
    timeWindow,
    channelId,
    provider,
    providerMetadata,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### Reaction

#### `publishReactionToCast`

#### **v1**

```typescript
import { ReactionType } from "@neynar/nodejs-sdk";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const reactionType = ReactionType.Like;
const target = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";
const idem = "my-reaction-idem";

client
  .publishReactionToCast(signerUuid, reactionType, target, { idem })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `publishReactionToCast` is renamed to `publishReaction` (Ref. [Renamed Methods](#renamed-methods))
2. The import path for `ReactionType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ReactionType } from "@neynar/nodejs-sdk/build/api";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const reactionType = ReactionType.Like;
const target = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";
const idem = "my-reaction-idem";

client
  .publishReaction({ signerUuid, reactionType, target, idem })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `deleteReactionFromCast`

#### **v1**

```typescript
import { ReactionType } from "@neynar/nodejs-sdk";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const reactionType = ReactionType.Like;
const target = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";
const idem = "my-reaction-idem";

client
  .deleteReactionFromCast(signerUuid, reactionType, target, { idem })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `deleteReactionFromCast` is renamed to `deleteReaction` (Ref. [Renamed Methods](#renamed-methods))
2. The import path for `ReactionType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ReactionType } from "@neynar/nodejs-sdk/build/api";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const reactionType = ReactionType.Like;
const target = "0x1ea99cbed57e4020314ba3fadd7c692d2de34d5f";
const idem = "my-reaction-idem";

client
  .deleteReaction({ signerUuid, reactionType, target, idem })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchUserReactions`

#### **v1**

```typescript
import { ReactionsType } from "@neynar/nodejs-sdk";

const fid = 3;
const type = ReactionsType.All;
const viewerFid = 19960;
const limit = 50;

client
  .fetchUserReactions(fid, type, {
    limit,
    viewerFid,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `ReactionsType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ReactionsType } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const type = ReactionsType.All;
const viewerFid = 19960;
const limit = 50;

client.fetchUserReactions({ fid, type, viewerFid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchReactionsForCast`

#### **v1**

```typescript
import { ReactionsType } from "@neynar/nodejs-sdk";

const hash = "0xfe90f9de682273e05b201629ad2338bdcd89b6be";
const types = ReactionsType.All;
const viewerFid = 3;
const limit = 50;

client
  .fetchReactionsForCast(hash, types, {
    limit,
    viewerFid,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `fetchReactionsForCast` is now renamed to `fetchCastReactions` (Ref. [Renamed Methods](#renamed-methods))
2. The import path for `ReactionsType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ReactionsType } from "@neynar/nodejs-sdk/build/api";

const hash = "0xfe90f9de682273e05b201629ad2338bdcd89b6be";
const types = ReactionsType.All;
const viewerFid = 3;
const limit = 50;

client
  .fetchCastReactions({ hash, types, viewerFid, limit })
  .then((response) => {
    console.log("response:", response);
  });
```

#### Notifications

#### `fetchAllNotifications`

#### **v1**

```typescript
import { NotificationType } from "@neynar/nodejs-sdk";

const fid = 3;
const type = NotificationType.LIKES;
const priorityMode = false;

client
  .fetchAllNotifications(fid, {
    type,
    priorityMode,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `isPriority` is removed.
2. The import path is for `NotificationType` changed. (Ref. [Import path changes](#import-path-changes))
3. Enum Keys have changed `LIKES` to `Likes` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import { NotificationType } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const type = NotificationType.Likes;
const priorityMode = false;

client.fetchAllNotifications({ fid, type, priorityMode }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchChannelNotificationsForUser`

#### **v1**

```typescript
const fid = 3;
const channelIds = ["neynar", "farcaster"];
const priorityMode = false;

client
  .fetchChannelNotificationsForUser(fid, channelIds, {
    priorityMode,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: `isPriority` is removed.

```typescript
const fid = 3;
const channelIds = ["neynar", "farcaster"];
const priorityMode = false;

client
  .fetchChannelNotificationsForUser({ fid, channelIds, priorityMode })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchNotificationsByParentUrlForUser`

#### **v1**

```typescript
const fid = 3;
const parentUrls = [
  "chain://eip155:1/erc721:0xd4498134211baad5846ce70ce04e7c4da78931cc",
  "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
];
const priorityMode = false;

client
  .fetchNotificationsByParentUrlForUser(fid, parentUrls, { priorityMode })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: `isPriority` is removed.

```typescript
const fid = 3;
const parentUrls = [
  "chain://eip155:1/erc721:0xd4498134211baad5846ce70ce04e7c4da78931cc",
  "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
];
const priorityMode = false;

client
  .fetchNotificationsByParentUrlForUser({ fid, parentUrls, priorityMode })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `markNotificationsAsSeen`

#### **v1**

```typescript
import { NotificationType } from "@neynar/nodejs-sdk";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const type = NotificationType.FOLLOWS;

client.markNotificationsAsSeen(signerUuid, { type }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note:

1. The import path for `NotificationType` is changed. (Ref. [Import path changes](#import-path-changes))
2. Enum Keys have changed `FOLLOWS` to `Follows` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import { NotificationType } from "@neynar/nodejs-sdk/build/api";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const type = NotificationType.Follows;

client.markNotificationsAsSeen({ signerUuid, type }).then((response) => {
  console.log("response:", response);
});
```

#### Channel

#### `searchChannels`

#### **v1**

```typescript
const q = ux;
const limit = 5;

client.searchChannels("ux", { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const q = ux;
const limit = 5;

client.searchChannels({ q, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchBulkChannels`

#### **v1**

```typescript
import { ChannelType } from "@neynar/nodejs-sdk";

const ids = ["neynar", "farcaster"];
const type = ChannelType.Id;
const viewerFid = 3;

client.fetchBulkChannels(ids, { viewerFid, type }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note: The import path for `ChannelType` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
const ids = ["neynar", "farcaster"];
const type = ChannelType.Id;
const viewerFid = 3;

client.fetchBulkChannels({ ids, type, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `lookupChannel`

#### **v1**

```typescript
import { ChannelType } from "@neynar/nodejs-sdk";

const id = "neynar";
const type = ChannelType.Id;
const viewerFid = 3;

client.lookupChannel("neynar", { viewerFid, type }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
import { ChannelType } from "@neynar/nodejs-sdk/build/api";

const id = "neynar";
const type = ChannelType.Id;
const viewerFid = 3;

client.lookupChannel({ id, type, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `removeChannelMember`

#### **v1**

```typescript
import { ChannelMemberRole } from "@neynar/nodejs-sdk/neynar-api/v2";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";
const fid = 3;
const role = ChannelMemberRole.Member;

client
  .removeChannelMember(signerUuid, channelId, fid, role)
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `ChannelMemberRole` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ChannelMemberRole } from "@neynar/nodejs-sdk/build/api";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";
const fid = 3;
const role = "member";

client
  .removeChannelMember({ signerUuid, channelId, fid, role })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchChannelMembers`

#### **v1**

```typescript
const channelId = "neynar";
const fid = 194;
const limit = 10;

client.fetchChannelMembers(channelId, { limit, fid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const channelId = "neynar";
const fid = 194;
const limit = 10;

client.fetchChannelMembers({ channelId, fid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `inviteChannelMember`

#### **v1**

```typescript
import { ChannelMemberRole } from "@neynar/nodejs-sdk/neynar-api/v2";

const signnerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";
const fid = 3;
const role = ChannelMemberRole.Member;

client
  .inviteChannelMember(signnerUuid, channelId, fid, role)
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `ChannelMemberRole` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ChannelMemberRole } from "@neynar/nodejs-sdk/build/api";

const signnerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";
const fid = 3;
const role = ChannelMemberRole.Member;

client
  .inviteChannelMember({ signerUuid, channelId, fid, role })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `respondChannelInvite`

#### **v1**

```typescript
import { ChannelMemberRole } from "@neynar/nodejs-sdk/neynar-api/v2";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";
const role = ChannelMemberRole.Member;
const accept = true;

client
  .respondChannelInvite(signerUuid, channelId, role, accept)
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: The import path for `ChannelMemberRole` is changed. (Ref. [Import path changes](#import-path-changes))

```typescript
import { ChannelMemberRole } from "@neynar/nodejs-sdk/build/api";

const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";
const role = ChannelMemberRole.Member;
const accept = true;

client
  .respondChannelInvite({ signerUuid, channelId, role, accept })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFollowersForAChannel`

#### **v1**

```typescript
const id = "founders";
const viewerFid = 3;
const limit = 50;

client.fetchFollowersForAChannel(id, { limit, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const id = "founders";
const viewerFid = 3;
const limit = 50;

client.fetchFollowersForAChannel({ id, viewerFid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchRelevantFollowersForAChannel`

#### **v1**

```typescript
const id = "why";
const viewerFid = 3;

client.fetchRelevantFollowersForAChannel(id, viewerFid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const id = "why";
const viewerFid = 3;

client.fetchRelevantFollowersForAChannel({ id, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchUserChannels`

#### **v1**

```typescript
const fid = 3;
const limit = 5;

client.fetchUserChannels(fid, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const limit = 5;

client.fetchUserChannels({ fid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchUserChannelMemberships`

#### **v1**

```typescript
const fid = 3;
const limit = 10;

client.fetchUserChannelMemberships(fid, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const limit = 10;

client.fetchUserChannelMemberships({ fid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `followChannel`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";

client.followChannel(signerUuid, channelId).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";

client.followChannel({ signerUuid, channelId }).then((response) => {
  console.log("response:", response);
});
```

#### `unfollowChannel`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";

client.unfollowChannel(signerUuid, channelId).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const channelId = "neynar";

client.unfollowChannel({ signerUuid, channelId }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchTrendingChannels`

#### **v1**

```typescript
import { TimeWindow } from "@neynar/nodejs-sdk";

const timeWindow = TimeWindow.SEVEN_DAYS;
const limit = 20;

client.fetchTrendingChannels(timeWindow, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note:

1. `TimeWindow` is renamed to `FetchTrendingChannelsTimeWindowEnum` (Ref. [Renamed enums](#renamed-enums))
2. `FetchTrendingChannelsTimeWindowEnum` import is changed (Ref. [Import Path Changes](#import-path-changes))
3. Enums key is changed from `SEVEN_DAYS` to `_7d` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import { FetchTrendingChannelsTimeWindowEnum } from "@neynar/nodejs-sdk/build/api";

const timeWindow = FetchTrendingChannelsTimeWindowEnum._7d;
const limit = 20;

client.fetchTrendingChannels({ timeWindow, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchUsersActiveChannels`

#### **v1**

```typescript
const fid = 3;
const limit = 10;

client.fetchUsersActiveChannels(fid, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const limit = 10;

client.fetchUsersActiveChannels({ fid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### Follows

#### `fetchUserFollowersV2`

#### **v1**

```typescript
import { FollowSortType } from "@neynar/nodejs-sdk";

const fid = 3;
const viewerFid = 23;
const sortType = FollowSortType.DescChron;
const limit = 10;

client
  .fetchUserFollowersV2(fid, { limit, viewerFid, sortType })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `fetchUserFollowersV2` is now renamed to `fetchUserFollowers` (Ref. [Methods Updated to v2 API](#methods-updated-to-v2-api))
2. `FollowSortType` import is changed (Ref. [Import Path Changes](#import-path-changes))

```typescript
import { FollowSortType } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const viewerFid = 23;
const sortType = FollowSortType.DescChron;
const limit = 10;

client
  .fetchUserFollowers({ fid, viewerFid, sortType, limit })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchRelevantFollowers`

#### **v1**

```typescript
const targetFid = 3;
const viewerFid = 19960;

client.fetchRelevantFollowers(targetFid, viewerFid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const targetFid = 3;
const viewerFid = 19960;

client.fetchRelevantFollowers({ targetFid, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchUserFollowingV2`

#### **v1**

```typescript
import { FollowSortType } from "@neynar/nodejs-sdk";

const fid = 3;
const viewerFid = 23;
const sortType = FollowSortType.DescChron;
const limit = 10;

client
  .fetchUserFollowingV2(fid, { limit, viewerFid, sortType })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. `fetchUserFollowingV2` is now renamed to `fetchUserFollowing` (Ref. [Methods Updated to v2 API](#methods-updated-to-v2-api))
2. `FollowSortType` import is changed (Ref. [Import Path Changes](#import-path-changes))

```typescript
import { FollowSortType } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const viewerFid = 23;
const sortType = FollowSortType.DescChron;
const limit = 10;

client
  .fetchUserFollowing({ fid, viewerFid, sortType, limit })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchFollowSuggestions`

#### **v1**

```typescript
const fid = 3;
const viewerFid = 19950;
const limit = 5;

client.fetchFollowSuggestions(fid, { limit, viewerFid }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const viewerFid = 19950;
const limit = 5;

client.fetchFollowSuggestions({ fid, viewerFid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### Storage

#### `lookupUserStorageAllocations`

#### **v1**

```typescript
const fid = 3;

client.lookupUserStorageAllocations(fid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;

client.lookupUserStorageAllocations({ fid }).then((response) => {
  console.log("response:", response);
});
```

#### `lookupUserStorageUsage`

#### **v1**

```typescript
const fid = 3;

client.lookupUserStorageUsage(3).then((response) => {
  console.log("User Storage Usage:", response);
});
```

#### **v2**

```typescript
const fid = 3;

client.lookupUserStorageUsage({ fid }).then((response) => {
  console.log("response:", response);
});
```

#### `buyStorage`

#### **v1**

```typescript
const fid = 3;
const units = 1;
const idem = "some_random_unique_key";

client.buyStorage(fid, { units, idem }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const units = 1;
const idem = "some_random_unique_key";

client.buyStorage({ fid, units, idem }).then((response) => {
  console.log("response:", response);
});
```

#### Frame

#### `postFrameAction`

#### **v1**

```typescript
const signerUuid = "signerUuid";
const castHash = "castHash";
const action = {
  button: {
    title: "Button Title",
    index: 1,
  },
  frames_url: "frames Url",
  post_url: "Post Url",
};

client.postFrameAction(signerUuid, castHash, action).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "signerUuid";
const castHash = "castHash";
const action = {
  button: {
    title: "Button Title",
    index: 1,
  },
  frames_url: "frames Url",
  post_url: "Post Url",
};

client.postFrameAction({ signerUuid, castHash, action }).then((response) => {
  console.log("response:", response);
});
```

#### `validateFrameAction`

#### **v1**

```typescript
const messageBytesInHex = "messageBytesInHex";
const castReactionContext = false;
const followContext = true;
const signerContext = true;
const channelFollowContext = true;

client
  .validateFrameAction(messageBytesInHex, {
    castReactionContext,
    followContext,
    signerContext,
    channelFollowContext,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const messageBytesInHex = "messageBytesInHex";
const castReactionContext = false;
const followContext = true;
const signerContext = true;
const channelFollowContext = true;

client
  .validateFrameAction({
    messageBytesInHex,
    castReactionContext,
    followContext,
    signerContext,
    channelFollowContext,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchValidateFrameAnalytics`

#### **v1**

```typescript
import {
  ValidateFrameAnalyticsType,
  ValidateFrameAggregateWindow,
} from "@neynar/nodejs-sdk";

const frameUrl = "https://shorturl.at/bDRY9";
const analyticsType = ValidateFrameAnalyticsType.InteractionsPerCast;
const start = "2024-04-06T06:44:56.811Z";
const stop = "2024-04-08T06:44:56.811Z";
const aggregateWindow = ValidateFrameAggregateWindow.TWELVE_HOURS;

client
  .fetchValidateFrameAnalytics(frameUrl, analyticsType, start, stop, {
    aggregateWindow,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note:

1. Import for `ValidateFrameAnalyticsType` and `ValidateFrameAggregateWindow` is changed (Ref. [Import Path Changes](#import-path-changes))
2. Enums key is changed from `TWELVE_HOURS` to `_12h` (Ref. [Enum Key Changes](#enum-key-changes))

```typescript
import {
  ValidateFrameAnalyticsType,
  ValidateFrameAggregateWindow,
} from "@neynar/nodejs-sdk/build/api";

const frameUrl = "https://shorturl.at/bDRY9";
const analyticsType = ValidateFrameAnalyticsType.InteractionsPerCast;
const start = "2024-04-06T06:44:56.811Z";
const stop = "2024-04-08T06:44:56.811Z";
const aggregateWindow = ValidateFrameAggregateWindow._12h;

client
  .fetchValidateFrameAnalytics({
    frameUrl,
    analyticsType,
    start,
    stop,
    aggregateWindow,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `lookupNeynarFrame`

#### **v1**

```typescript
import { FrameType } from "@neynar/nodejs-sdk";

const type = FrameType.Uuid;
const uuid = "your-frame-uuid";

client.lookupNeynarFrame(uuid, { type }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note: Import for `FrameType` is changed (Ref. [Import Path Changes](#import-path-changes))

```typescript
import { FrameType } from "@neynar/nodejs-sdk/build/api";

const type = FrameType.Uuid;
const uuid = "your-frame-uuid";

client.lookupNeynarFrame({ type, uuid }).then((response) => {
  console.log("response:", response);
});
```

#### `deleteNeynarFrame`

#### **v1**

```typescript
const uuid = "your-frame-uuid";

client.deleteNeynarFrame(uuid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const uuid = "your-frame-uuid";

client.deleteNeynarFrame({ uuid }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchFrameMetaTagsFromUrl`

#### **v1**

```typescript
const url = "https://frames.neynar.com/f/862277df/ff7be6a4";

client.fetchFrameMetaTagsFromUrl(url).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const url = "https://frames.neynar.com/f/862277df/ff7be6a4";

client.fetchFrameMetaTagsFromUrl({ url }).then((response) => {
  console.log("response:", response);
});
```

#### `postFrameActionDeveloperManaged`

#### **v1**

```typescript
const action = // Example action
const signature_packet = // Example signature packet
const castHash = "castHash";

client
  .postFrameDeveloperManagedAction(action, signature_packet, {
    castHash: castHash,
  })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const action = // Example action
const signature_packet = // Example signature packet
const castHash = "castHash";

client.postFrameActionDeveloperManaged({castHash, action, signaturePacket}).then(response => {
  console.log('response:', response);
});
```

#### fname

#### `isFnameAvailable`

#### **v1**

```typescript
const fname = "shreyas-chorge";

client.isFnameAvailable(fname).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fname = "shreyas-chorge";

client.isFnameAvailable({ fname }).then((response) => {
  console.log("response:", response);
});
```

#### Webhook

#### `lookupWebhook`

#### **v1**

```typescript
const webhookId = "yourWebhookId";

client.lookupWebhook(webhookId).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const webhookId = "yourWebhookId";

client.lookupWebhook({ webhookId }).then((response) => {
  console.log("response:", response);
});
```

#### `publishWebhook`

#### **v1**

```typescript
const name = "Cast created Webhook";
const url = "https://example.com/webhook";
const subscription = {
  "cast.created": {
    author_fids: [3, 196, 194],
    mentioned_fids: [196],
  },
  "user.created": {},
};

client.publishWebhook(name, url, { subscription }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const name = "Cast created Webhook";
const url = "https://example.com/webhook";
const subscription = {
  "cast.created": {
    author_fids: [3, 196, 194],
    mentioned_fids: [196],
  },
  "user.created": {},
};

client.publishWebhook({ name, url, subscription }).then((response) => {
  console.log("response:", response);
});
```

#### `updateWebhookActiveStatus`

#### **v1**

```typescript
const webhookId = "yourWebhookId";
const active = false;

client.updateWebhookActiveStatus(webhookId, active).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const webhookId = "yourWebhookId";
const active = false;

client.updateWebhookActiveStatus({ webhookId, active }).then((response) => {
  console.log("response:", response);
});
```

#### `updateWebhook`

#### **v1**

```typescript
const webhookId = "existingWebhookId";
const name = "UpdatedWebhookName";
const url = "https://example.com/new-webhook-url";
const subscription = {
  "cast.created": {
    author_fids: [2, 4, 6],
    mentioned_fids: [194],
  },
  "user.created": {},
};

client
  .updateWebhook(webhookId, name, url, { subscription })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const webhookId = "existingWebhookId";
const name = "UpdatedWebhookName";
const url = "https://example.com/new-webhook-url";
const subscription = {
  "cast.created": {
    author_fids: [2, 4, 6],
    mentioned_fids: [194],
  },
  "user.created": {},
};

client
  .updateWebhook({ name, url, subscription, webhookId })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `deleteWebhook`

#### **v1**

```typescript
const webhookId = "yourWebhookId";

client.deleteWebhook(webhookId).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const webhookId = "yourWebhookId";

client.deleteWebhook({ webhookId }).then((response) => {
  console.log("response:", response);
});
```

#### Action

#### `publishFarcasterAction`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const baseUrl = "https://appb.example.com";
const action = {
  type: "sendMessage",
  payload: {
    message: "Hello from App A!",
  },
};

client.publishFarcasterAction(signerUuid, baseUrl, action).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const baseUrl = "https://appb.example.com";
const action = {
  type: "sendMessage",
  payload: {
    message: "Hello from App A!",
  },
};

client
  .publishFarcasterAction({ signerUuid, baseUrl, action })
  .then((response) => {
    console.log("response:", response);
  });
```

#### Mute

#### `fetchMuteList`

#### **v1**

```typescript
const fid = 3;
const limit = 10;

client.fetchMuteList(fid, { limit }).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const limit = 10;

client.fetchMuteList({ fid, limit }).then((response) => {
  console.log("response:", response);
});
```

#### `publishMute`

#### **v1**

```typescript
const fid = 3;
const mutedFid = 19960;

client.publishMute(fid, mutedFid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const mutedFid = 19960;

client.publishMute({ fid, mutedFid }).then((response) => {
  console.log("response:", response);
});
```

#### `deleteMute`

#### **v1**

```typescript
const fid = 3;
const mutedFid = 19960;

client.deleteMute(fid, mutedFid).then((response) => {
  console.log("Mute Response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const mutedFid = 19960;

client.deleteMute({ fid, mutedFid }).then((response) => {
  console.log("response:", response);
});
```

#### Block

#### `publishBlock`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const blockedFid = 19960;

client.publishBlock(signerUuid, blockedFid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const blockedFid = 19960;

client.publishBlock({ signerUuid, blockedFid }).then((response) => {
  console.log("response:", response);
});
```

#### `deleteBlock`

#### **v1**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const blockedFid = 19960;

client.deleteBlock(signerUuid, blockedFid).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const signerUuid = "19d0c5fd-9b33-4a48-a0e2-bc7b0555baec";
const blockedFid = 19960;

client.deleteBlock({ signerUuid, blockedFid }).then((response) => {
  console.log("response:", response);
});
```

#### Ban

#### `publishBans`

#### **v1**

```typescript
const fids = [3, 19960];

client.publishBan(fids).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fids = [3, 19960];

client.publishBans({ fids }).then((response) => {
  console.log("response:", response);
});
```

#### `deleteBans`

#### **v1**

```typescript
const fids = [3, 19960];

client.deleteBans(fids).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fids = [3, 19960];

client.deleteBans({ fids }).then((response) => {
  console.log("response:", response);
});
```

#### Onchain

#### `fetchUserBalance`

#### **v1**

```typescript
const fid = 3;
const networks = Networks.Base;

client.fetchUserBalance(fid, networks).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

```typescript
const fid = 3;
const networks = Networks.Base;

client.fetchUserBalance({ fid, networks }).then((response) => {
  console.log("response:", response);
});
```

#### `fetchSubscriptionsForFid`

#### **v1**

```typescript
import { SubscriptionProvider } from "@neynar/nodejs-sdk";

const fid = 3;
const subscriptionProvider = SubscriptionProvider.FabricStp;

client.fetchSubscriptionsForFid(fid, subscriptionProvider).then((response) => {
  console.log("response:", response);
});
```

#### **v2**

Note: Import for `SubscriptionProvider` is changed (Ref. [Import Path Changes](#import-path-changes))

```typescript
import { SubscriptionProvider } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const subscriptionProvider = SubscriptionProvider.FabricStp;

client
  .fetchSubscriptionsForFid({ fid, subscriptionProvider })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchSubscribedToForFid`

#### **v1**

```typescript
import { SubscriptionProvider } from "@neynar/nodejs-sdk";

const fid = 3;
const subscriptionProvider = SubscriptionProvider.FabricStp;
const viewerFid = 1231;

client
  .fetchSubscribedToForFid(fid, subscriptionProvider, { viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

Note: Import for `SubscriptionProvider` is changed (Ref. [Import Path Changes](#import-path-changes))

```typescript
import { SubscriptionProvider } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const subscriptionProvider = SubscriptionProvider.FabricStp;
const viewerFid = 1231;

client
  .fetchSubscribedToForFid({ fid, subscriptionProvider, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchSubscribersForFid`

#### **v1**

```typescript
import { SubscriptionProvider } from "@neynar/nodejs-sdk";

const fid = 3;
const subscriptionProvider = SubscriptionProvider.FabricStp;
const viewerFid = 1231;

client
  .fetchSubscribedToForFid(fid, subscriptionProvider, { viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
import { SubscriptionProvider } from "@neynar/nodejs-sdk/build/api";

const fid = 3;
const subscriptionProvider = SubscriptionProvider.FabricStp;
const viewerFid = 1231;

client
  .fetchSubscribersForFid({ fid, subscriptionProvider, viewerFid })
  .then((response) => {
    console.log("response:", response);
  });
```

#### `fetchSubscriptionCheck`

#### **v1**

```typescript
const addresses = [
  "0xedd3783e8c7c52b80cfbd026a63c207edc9cbee7",
  "0x5a927ac639636e534b678e81768ca19e2c6280b7",
];
const contractAddress = "0x76ad4cb9ac51c09f4d9c2cadcea75c9fa9074e5b";
const chainId = "8453";

client
  .fetchSubscriptionCheck(addresses, contractAddress, chainId)
  .then((response) => {
    console.log("response:", response);
  });
```

#### **v2**

```typescript
const addresses = [
  "0xedd3783e8c7c52b80cfbd026a63c207edc9cbee7",
  "0x5a927ac639636e534b678e81768ca19e2c6280b7",
];
const contractAddress = "0x76ad4cb9ac51c09f4d9c2cadcea75c9fa9074e5b";
const chainId = "8453";

client
  .fetchSubscriptionCheck({ addresses, contractAddress, chainId })
  .then((response) => {
    console.log("response:", response);
  });
```

---

This guide should assist in updating your existing code to SDK v2. If you encounter any issues or have further questions, please reach out to us. [Warpcast](https://warpcast.com/~/channel/neynar) [Telegram](https://t.me/rishdoteth)

# NEYNAR SDK > SDK v1 to v2 migration guide > Using github copilot

## Install the latest version of SDK

```shell yarn
yarn add @neynar/nodejs-sdk
```

```shell npm
npm install @neynar/nodejs-sdk
```

## Open Edit with copilot

Click on copilot on the bottom right in vs-code you'll see the following menu

## Add files

Navigate to `node_modules/@neynar/nodejs-sdk/v1-to-v2-migration.md` and add the file to the working set

Search for `@neynar/nodejs-sdk`in the entire project, add all the files to the working set that uses SDK methods. (You can also drag and drop files in the copilot window to add them.)

You should see something like this

Choose an AI agent (we recommend Claude) and add the following prompt.

```
I need help migrating code from Neynar SDK v1 to v2. Here are the specific details about my code that you need to analyze and update:

1. Please scan through my code and identify any:
   - Method names that have been removed, renamed, or updated to v2 API
   - Changes in enum names or enum key formats
   - Changes in import paths
   - Changes in method argument formats
   - Changes in response structures

2. For each piece of code you analyze, please:
   - Show the existing v1 code
   - Provide the updated v2 code
   - Highlight any breaking changes in the response structure
   - Note any additional considerations or best practices

3. Key Migration Rules to Apply:
   - All v1 API methods have been removed and must be replaced with v2 alternatives
   - All method arguments should now use key-value pairs format
   - Update enum imports to use '@neynar/nodejs-sdk/build/api'
   - Update renamed enums and their key formats
   - Consider response structure changes in the new methods
   - Handle changes in client initialization

4. When showing code changes, please:
   - Include necessary import statements
   - Add comments explaining key changes
   - Highlight any breaking changes that might affect dependent code

5. Reference Information:
   - API endpoint changes and new parameters
   - Response structure modifications
   - Required vs optional parameters
   - Type changes
   - Error handling differences

Please analyze my code and provide detailed, step-by-step guidance for updating it to be compatible with Neynar SDK v2.

I need to know exactly how to update it to v2, including all necessary changes to imports, method names, parameters, and response handling.
```

With this, you should get most of the code changes correctly replaced but please verify it once. The only place where AI can make mistakes in code replacement is where [v1 API methods are used which are completely removed from the v2 SDK.](https://docs.neynar.com/reference/neynar-nodejs-sdk-v1-to-v2-migration-guide#removed-methods-and-changes-in-method-names) This is because the response structure is changed in v2 APIs.

# Fetch cast information > Warpcast URLs

Warpcast cast url doesn't contain all the full cast hash value, it usually looks like this: `https://warpcast.com/dwr.eth/0x029f7cce`.

This guide demonstrates how to fetch cast information from Warpcast cast url.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
});

const client = new NeynarAPIClient(config);
```

Then fetch the cast:

```javascript
// @dwr.eth AMA with @balajis.eth on Farcaster
const url = "https://warpcast.com/dwr.eth/0x029f7cce";
const cast = await client.lookupCastByHashOrWarpcastUrl({ url });
console.log(cast);
```

Example output:

```
{
  cast: {
    object: "cast_hydrated",
    hash: "0x029f7cceef2f0078f34949d6e339070fc6eb47b4",
    thread_hash: "0x029f7cceef2f0078f34949d6e339070fc6eb47b4",
    parent_hash: null,
    parent_url: "https://thenetworkstate.com",
    parent_author: {
      fid: null
    },
    author: {
      object: "user",
      fid: 3,
      custody_address: "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
      username: "dwr.eth",
      display_name: "Dan Romero",
      pfp_url: "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
      profile: [Object ...],
      follower_count: 19381,
      following_count: 2703,
      verifications: [ "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
        "0xa14b4c95b5247199d74c5578531b4887ca5e4909",
        "0xb877f7bb52d28f06e60f557c00a56225124b357f",
        "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea"
      ],
      active_status: "active"
    },
    text: "Welcome to @balajis.eth!\n\nHe’s kindly agreed to do an AMA. Reply with your questions. :)",
    timestamp: "2023-11-28T14:44:32.000Z",
    embeds: [],
    reactions: {
      likes: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...],
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...],
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...],
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ],
      recasts: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ]
    },
    replies: {
      count: 180
    },
    mentioned_profiles: [
      [Object ...]
    ]
  }
}
```

Obviously, you can also fetch cast by hash:

```javascript
// full hash of the warpcast.com/dwr.eth/0x029f7cce
const hash = "0x029f7cceef2f0078f34949d6e339070fc6eb47b4";
const cast = await client.lookupCastByHashOrWarpcastUrl({
  hash: hash,
});
console.log(cast);
```

Which will return the same result as above.

# Fetch cast information > Write casts to channel

Channels are "subreddits inside Farcaster." Technically, a channel is a collection of casts that share a common parent_url. For example, the [memes channel](https://warpcast.com/~/channel/memes) is a collection of casts that share the parent_url `chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61`.

Got a dank meme you want to share with Farcaster? This guide demonstrates how to use the Neynar SDK to post a cast to a channel.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

Before all that, initialize Neynar client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const signer = process.env.NEYNAR_SIGNER;
```

Poast meme to memes channel

> channel_name to parent_url mapping
>
> All parent_url to channel_name mappings can be found at this [Github repo](https://github.com/neynarxyz/farcaster-channels/blob/main/warpcast.json), along with other channel metadata.
>
> This repo is open source so feel free to submit PRs for additional channel data if you see anything missing.

```javascript
const memesChannelUrl =
  "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61";
const memeUrl = "https://i.imgur.com/cniMfvm.jpeg";

const result = await client.publishCast(signer, "me irl", {
  embeds: [{ url: memeUrl }],
  replyTo: memesChannelUrl,
});
```

Example output:

```
{
  hash: "0xccabe27a04b1a63a7a24a035b0ffc2a2629e1af1",
  author: {
    object: "user",
    fid: 4640,
    custody_address: "0x86dd7e4af49829b895d24ea2ab581c7c32e87332",
    username: "picture",
    display_name: "Picture",
    pfp_url: "https://lh3.googleusercontent.com/erYudyT5dg9E_esk8I1kqB4bUJjWAmlNu4VRnv9iUuq_by7QjoDtZzj_mjPqel4NYQnvqYr1R54m9Oxp9moHQkierpY8KcYLxyIJ",
    profile: {
      bio: [Object ...]
    },
    follower_count: 45,
    following_count: 124,
    verifications: [],
    active_status: "inactive"
  },
  text: "me irl"
}
```

There you go, make sure to share your good memes with the Farcaster!

![](https://files.readme.io/bf33b4d-image.png)

# Fetch cast information > Cast stream

In this guide, we'll create a stream of casts using Farcaster hubs and stream the casts published in real time.

Before we begin, you can look at the [script here](https://gist.github.com/avneesh0612/65ca14d20549303d0a08da2daebb96cb).

Create a new node.js app using the following commands:

```
mkdir stream-casts
cd stream-casts
bun init
```

I have used bun but feel free to use npm, yarn, pnpm, or anything of your choice! Once the app is created, run this command to install the "@farcaster/hub-nodejs" package:

```
bun add @farcaster/hub-nodejs
```

Now, let's get to building our stream. In the index.ts file add the following to initialise the client:

```typescript index.ts
import { getSSLHubRpcClient, HubEventType } from "@farcaster/hub-nodejs";

const hubRpcEndpoint = "YOUR_GRPC_URL";
const client = getSSLHubRpcClient(hubRpcEndpoint);
```

You need to add your hub gRPC endpoint in the endpoint, you can get it from your neynar dashboard.

![Copy hub gRPC URL](https://files.readme.io/15c6bdd-image.png)

Once our client is initialised we can use it to subscribe to certain events, in our case we want to subscribe to the `MERGE_MESSAGE` event. You can check out the full details about the types of events [here](https://www.thehubble.xyz/docs/events.html). So, add the following in your code:

```typescript index.ts
client.$.waitForReady(Date.now() + 5000, async (e) => {
  if (e) {
    console.error(`Failed to connect to ${hubRpcEndpoint}:`, e);
    process.exit(1);
  } else {
    console.log(`Connected to ${hubRpcEndpoint}`);

    const subscribeResult = await client.subscribe({
      eventTypes: [HubEventType.MERGE_MESSAGE],
    });

    client.close();
  }
});
```

Finally, let's use the subscribeResult to stream and console log the cast texts:

```typescript index.ts
if (subscribeResult.isOk()) {
  const stream = subscribeResult.value;

  for await (const event of stream) {
    if (event.mergeMessageBody.message.data.type === 1) {
      console.log(event.mergeMessageBody.message.data.castAddBody.text);
    }
  }
}
```

We have to filter out the data by its type since the merge message events provide all protocol events like casts, reactions, profile updates, etc. 1 is for casts published.

Finally, you can run the script using `bun run index.ts` and it will provide you with a stream like this:

![](https://files.readme.io/bc0fa74-image.png)

## Conclusion

If you want to look at the completed code, check out the [script here](https://gist.github.com/avneesh0612/65ca14d20549303d0a08da2daebb96cb).

Lastly, make sure to sure what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar) and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!

# Fetch cast information > Archive casts

Casts in the Farcaster protocol are pruned when user runs out of storage. This guide demonstrates how to archive casts of a specific FID with the Neynar SDK.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

Check out this [example repository](https://github.com/neynarxyz/farcaster-examples/tree/main/archiver-script) to see the code in action.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Next, let's make a function to clean the incoming casts:

```javascript
const parser = (cast) => {
  return {
    fid: parseInt(cast.author.fid),
    parentFid: parseInt(cast.parentAuthor.fid)
      ? parseInt(cast.parentAuthor.fid)
      : undefined,
    hash: cast.hash || undefined,
    threadHash: cast.threadHash || undefined,
    parentHash: cast.parentHash || undefined,
    parentUrl: cast.parentUrl || undefined,
    text: cast.text || undefined,
  };
};
```

Then, the function to archive the casts:

```javascript
const dumpCast = (cast) => {
  const parsed = parser(cast);
  const data = `${JSON.stringify(parsed)}\n`;
  fs.appendFileSync("data.ndjson", data);
};
```

Finally, let's fetch the casts and archive them:

```javascript
const fetchAndDump = async (fid, cursor) => {
  const data = await client.fetchAllCastsCreatedByUser(fid, {
    limit: 150,
    cursor,
  });
  data.result.casts.map(dumpCast);

  // If there is no next cursor, we are done
  if (data.result.next.cursor === null) return;
  await fetchAndDump(fid, data.result.next.cursor);
};

// archive all @rish.eth's casts in a file called data.ndjson
const fid = 194;
fetchAndDump(fid);
```

Result: a file called `data.ndjson` with all the casts of the user with FID 194.

It looks something like this:

```json
{"fid":194,"parentFid":3,"hash":"0x544421c091f5af9d1610de0ae223b52602dd631e","threadHash":"0xb0758588c9412f72efe7e703e9d0cb5f2d0a6cfd","parentHash":"0xb0758588c9412f72efe7e703e9d0cb5f2d0a6cfd","text":"that order is pretty key"}
{"fid":194,"parentFid":194,"hash":"0x98f52d36161f3d0c8dee6e242936c431face35f0","threadHash":"0x5727a985687c10b6a37e9439b2b7a3ce141c6237","parentHash":"0xcb6cab80cc7d7a2ca957d1c95c9a3459f9e3a9dc","text":"turns out not an email spam issue ‍, email typo :)"}
{"fid":194,"parentFid":20071,"hash":"0xcb6cab80cc7d7a2ca957d1c95c9a3459f9e3a9dc","threadHash":"0x5727a985687c10b6a37e9439b2b7a3ce141c6237","parentHash":"0xf34c18b87f8eaca2cb72131a0c0429a48b66ef52","text":"hmm interesting. our system shows the email as sent. Maybe we're getting marked as spam now? ‍\n\nLet me DM you on telegram"}
{"fid":194,"parentFid":20071,"hash":"0x62c484064c9ca1177f8addb56bdaffdbede97a29","threadHash":"0x5727a985687c10b6a37e9439b2b7a3ce141c6237","parentHash":"0x7af582a591575acc474fa1f8c52a2a03258986b9","text":"are you still waiting on this? you should have gotten the email within the first minute. we automated this last week so there's no wait anymore. lmk if you're still having issues :)"}
{"fid":194,"parentFid":3,"hash":"0xbc63b955c40ace8aca4b1608115fd12f643395b1","threadHash":"0x5727a985687c10b6a37e9439b2b7a3ce141c6237","parentHash":"0x5727a985687c10b6a37e9439b2b7a3ce141c6237","text":"@bountybot adding 150 USDC to this bounty \n\nfor anyone building on this, please reach out with any questions. We've always wanted to do this but haven't been able to prioritize. Think this can be quite impactful! :)"}
```

That's it! You now can save that in S3 or IPFS for long-term archival!

# GITHUB > nodejs-SDK

# GITHUB > Frontend react SDK

# GITHUB > OpenAPI specification

# GITHUB > Example Apps

# Fetch Farcaster feeds > Trending feed on Farcaster

This guide demonstrates how to use the Neynar SDK to get trending casts on Farcaster.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Then fetch the global trending Farcaster casts:

```javascript
const feed = await client.fetchFeed(FeedType.Filter, {
  filterType: FilterType.GlobalTrending,
});

console.log(feed);
```

Example output:

```
{
  casts: [
    {
      object: "cast_hydrated",
      hash: "0xa3194378e37b6d9f738c079d7a374e7ffce3eb46",
      thread_hash: "0xa3194378e37b6d9f738c079d7a374e7ffce3eb46",
      parent_hash: null,
      parent_url: "chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03",
      parent_author: [Object ...],
      author: [Object ...],
      text: "Noob question: why are nouns called nouns? Does each one have a particular noun (in English or some other language) attached?",
      timestamp: "2023-11-26T14:17:49.000Z",
      embeds: [],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0xc64ebefd8ebc83d8e6c88f49f10274fb3251937e",
      thread_hash: "0xc64ebefd8ebc83d8e6c88f49f10274fb3251937e",
      parent_hash: null,
      parent_url: "chain://eip155:7777777/erc721:0xc2a1570703480b72091283decb80292c273db559",
      parent_author: [Object ...],
      author: [Object ...],
      text: "Explain this chart in one word.",
      timestamp: "2023-11-26T23:03:25.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0x9a027e0f825efa1f030298ff5354f71cc03cd87a",
      thread_hash: "0x9a027e0f825efa1f030298ff5354f71cc03cd87a",
      parent_hash: null,
      parent_url: "chain://eip155:8453/erc721:0xe7a43b5942f15fddeb9733fdcc57c6232f1d5aa0",
      parent_author: [Object ...],
      author: [Object ...],
      text: "teaching myself generative art, proud of this one\n\nhaving art that can literally live on the blockchain as code is much more appealing than uploading a GIF to IPFS or some image storage system",
      timestamp: "2023-11-26T22:15:23.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }
  ],
  next: {
    cursor: "eyJ0aW1lc3RhbXAiOiIyMDIzLTExLTI2IDIyOjE1OjIzLjAwMDAwMDAiLCJwb2ludHMiOiIxMzYifQ=="
  }
}
```

To fetch the next page of the feed, use the cursor:

```javascript
const nextFeed = await client.fetchFeed(FeedType.Filter, {
  filterType: FilterType.GlobalTrending,
  cursor: feed.next.cursor,
});
```

It's that easy to get trending casts in Farcaster!

# Fetch Farcaster feeds > Trending feed on Farcaster > Trending feed w/ external providers

To choose a different provider, simply pass in a different value in the `provider` field. `neynar` is set as the default.

If you pick `mbd` as provider, you can further customize your feed by passing in additional filter values in an optional`filters` object inside the `provider_metadata` field in the request e.g.

```javascript
const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      // remove_author_fids only works when author_ids isn't passed in
      // "remove_author_ids": [
      // "18949"
      // ],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
    },
  })
);
```

The filters available for MBD are that you can pass in that object are:

A full request to the feed api with the custom mbd filters object looks like below

```javascript
const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
    },
  })
);

const url = `https://api.neynar.com/v2/farcaster/feed/trending?limit=10&viewer_fid=3&time_window=24h&channel_id=superrare&provider=mbd&provider_metadata=${provider_metadata}`;

fetch(url, {
  method: "GET",
  headers: {
    accept: "application/json",
    api_key: "NEYNAR_API_DOCS",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("error:", error));
```

Please note :

- If `channel_id` is included in the request in addition to `provider_metadata`'s `filters.channels`, channel_id's URL will be appended to filters.channels. In the above example, the results will include the results from Neynar as well as Superrare channels since `channel_id` is superrare and `filters.channels` is neynar.
- `time_window ` will correspond to `provider_metadata`'s `filter.start_timestamp`. `filter.start_timestamp` will override `time_window` in the root request, if both are present.

# Fetch Farcaster feeds > Trending feed w/ external providers

To choose a different provider, simply pass in a different value in the `provider` field. `neynar` is set as the default.

If you pick `mbd` as provider, you can further customize your feed by passing in additional filter values in an optional`filters` object inside the `provider_metadata` field in the request e.g.

```javascript
const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      // remove_author_fids only works when author_ids isn't passed in
      // "remove_author_ids": [
      // "18949"
      // ],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
    },
  })
);
```

The filters available for MBD are that you can pass in that object are:

A full request to the feed api with the custom mbd filters object looks like below

```javascript
const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
    },
  })
);

const url = `https://api.neynar.com/v2/farcaster/feed/trending?limit=10&viewer_fid=3&time_window=24h&channel_id=superrare&provider=mbd&provider_metadata=${provider_metadata}`;

fetch(url, {
  method: "GET",
  headers: {
    accept: "application/json",
    api_key: "NEYNAR_API_DOCS",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("error:", error));
```

Please note :

- If `channel_id` is included in the request in addition to `provider_metadata`'s `filters.channels`, channel_id's URL will be appended to filters.channels. In the above example, the results will include the results from Neynar as well as Superrare channels since `channel_id` is superrare and `filters.channels` is neynar.
- `time_window ` will correspond to `provider_metadata`'s `filter.start_timestamp`. `filter.start_timestamp` will override `time_window` in the root request, if both are present.

# Fetch Farcaster feeds > For-you feed w/ external providers

To choose a different provider, simply pass in a different value in the `provider` field. `openrank` is set as the default. (`karma3` is an older name for `openrank` --kept here for backwards compatiblity--)

If you pick `mbd` as provider, you can further customize your feed by passing in additional filter values in an optional`filters` object inside the `provider_metadata` field in the request e.g.

```javascript
const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      // remove_author_fids only works when author_ids isn't passed in
      // "remove_author_ids": [
      // "18949"
      // ],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
      remove_ai_labels: ["spam"],
    },
  })
);
```

The filters available for MBD that you can pass in that object are:

A full request to the feed API with the custom mbd filters object looks like below

```javascript
const fetch = require("node-fetch");

const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      // Note: remove_author_ids only works when author_ids isn't passed in
      // "remove_author_ids": [
      //   "18949"
      // ],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
    },
  })
);

const url = `https://api.neynar.com/v2/farcaster/feed/for_you?fid=3&viewer_fid=2&provider=mbd&limit=10&provider_metadata=${provider_metadata}`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    api_key: "NEYNAR_API_DOCS",
  },
};

// Fetch request with the metadata and options
fetch(url, options)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("error:", error));
```

# Fetch Farcaster feeds > Feed from Farcaster channel

Channels are "subreddits inside Farcaster." Technically, a channel is a collection of casts that share a common channel_id. For example, the [memes channel](https://warpcast.com/~/channel/memes) is a collection of casts that share the channel_id `memes`.

This guide demonstrates how to use the Neynar SDK to fetch casts from a channel.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Then, fetch the feed in the memes channel.

```javascript
const channelId = "memes";

const feed = await client.fetchFeed(FeedType.Filter, {
  filterType: FilterType.ChannelId,
  channelId,
});

console.log(feed);
```

Example output:

```
{
  casts: [
    {
      object: "cast_hydrated",
      hash: "0xf17168571d5e403f3b608ea2cc09a0b711d4c4fc",
      thread_hash: "0xf17168571d5e403f3b608ea2cc09a0b711d4c4fc",
      parent_hash: null,
      parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
      parent_author: [Object ...],
      author: [Object ...],
      text: "",
      timestamp: "2023-11-27T14:40:12.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0x344dcd9c7c2671450628aacd0bbb8e29ea2e8809",
      thread_hash: "0x344dcd9c7c2671450628aacd0bbb8e29ea2e8809",
      parent_hash: null,
      parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
      parent_author: [Object ...],
      author: [Object ...],
      text: "sorry",
      timestamp: "2023-11-27T14:24:32.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0x68b94ec2a10ebad8b13e3b673f0db02dd3280f42",
      thread_hash: "0x68b94ec2a10ebad8b13e3b673f0db02dd3280f42",
      parent_hash: null,
      parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
      parent_author: [Object ...],
      author: [Object ...],
      text: "man today is such a nice morning",
      timestamp: "2023-11-27T13:30:11.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }
  ],
  next: {
    cursor: "eyJ0aW1lc3RhbXAiOiIyMDIzLTExLTI3IDEzOjMwOjExLjAwMDAwMDAifQ=="
  }
}
```

To fetch the next page of the feed, use the cursor:

```javascript
const nextFeed = await client.fetchFeed(FeedType.Filter, {
  filterType: FilterType.ChannelId,
  channelId,
  cursor: feed.next.cursor,
});
```

There you go! You now know how to fetch casts from a Farcaster channel with Neynar SDK.

# Fetch Farcaster feeds > Feed of given Farcaster FID

With Farcaster data being public, we can see what @vitalik.eth sees on his feed (reverse chronological of following). In this guide, we'll do exactly that.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Now, we can fetch the following feed for Vitalik's FID:

```javascript
const vitalikFid = 5650;

const feed = await client.fetchFeed(FeedType.Following, {
  fid: vitalikFid,
});

console.log(feed);
```

Example output:

```
{
  casts: [
    {
      object: "cast",
      hash: "0x63e4d69e029d516ed6c08e61c3ce0467e688bb8b",
      thread_hash: "0x63e4d69e029d516ed6c08e61c3ce0467e688bb8b",
      parent_hash: null,
      parent_url: null,
      root_parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "I’ve never been a “local” anywhere, ever \n\nNot even in the town I was born and grew up in. \n\nWonder how many people in the world are like that. Defining local as some function of generations, mother tongue, and majority ethnicity. I wouldn’t satisfy any reasonable definition anywhere I’ve lived.",
      timestamp: "2024-10-27T05:55:59.000Z",
      embeds: [],
      reactions: [Object ...],
      replies: [Object ...],
      channel: null,
      mentioned_profiles: [],
      viewer_context: [Object ...],
    }, {
      object: "cast",
      hash: "0x4ccea06173d1f9d42c88003be50338b81b46f4b2",
      thread_hash: "0x4ccea06173d1f9d42c88003be50338b81b46f4b2",
      parent_hash: null,
      parent_url: null,
      root_parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "I’ve never been to Spain. Is this movement Europe-wide or specific to Spain? Fortunately I’ve long since exhausted my wanderlust. I’m kinda fine never going to new places now. There’s a few places I’m still mildly curious to see firsthand but Spain isn’t one of them.\n\nhttps://www.bbc.com/news/articles/cwy19egx47eo",
      timestamp: "2024-10-27T05:45:21.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      channel: null,
      mentioned_profiles: [],
      viewer_context: [Object ...],
    }, {
      object: "cast",
      hash: "0x196c0b56a1912c3f44a1a2022871ccc6a990686a",
      thread_hash: "0x196c0b56a1912c3f44a1a2022871ccc6a990686a",
      parent_hash: null,
      parent_url: null,
      root_parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "hey there! i'm bleu, the meme-loving elefant  always happy to chat about the wild world of crypto and our awesome $bleu community. let me know if you have any questions or just wanna hang out and have some laughs in the /bleu channel!",
      timestamp: "2024-10-27T04:26:00.000Z",
      embeds: [],
      reactions: [Object ...],
      replies: [Object ...],
      channel: null,
      mentioned_profiles: [],
      viewer_context: [Object ...],
    }, {
      object: "cast",
      hash: "0xba7465925380e9644b666b29c95ae445f82fe272",
      thread_hash: "0xba7465925380e9644b666b29c95ae445f82fe272",
      parent_hash: null,
      parent_url: null,
      root_parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "gn \n\n\nhey @aethernet shake hands with @mfergpt and bring back peace",
      timestamp: "2024-10-27T05:41:41.000Z",
      embeds: [],
      reactions: [Object ...],
      replies: [Object ...],
      channel: null,
      mentioned_profiles: [
        [Object ...], [Object ...]
      ],
      viewer_context: [Object ...],
    }
  ],
  next: {
    cursor: "eyJ0aW1lc3RhbXAiOiIyMDI0LTEwLTI3IDA1OjQxOjQxLjAwMDAwMDAifQ%3D%3D",
  },
}
```

To fetch the next page of casts, use the cursor:

```javascript
const nextFeed = await client.fetchFeed(FeedType.Following, {
  fid: vitalikFid,
  cursor: feed.next.cursor,
});
```

So that's what @vitalik.eth sees on his Farcaster feed!

# Fetch Farcaster feeds > Feed of given Farcaster FID > For-you feed w/ external providers

To choose a different provider, simply pass in a different value in the `provider` field. `openrank` is set as the default. (`karma3` is an older name for `openrank` --kept here for backwards compatiblity--)

If you pick `mbd` as provider, you can further customize your feed by passing in additional filter values in an optional`filters` object inside the `provider_metadata` field in the request e.g.

```javascript
const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      // remove_author_fids only works when author_ids isn't passed in
      // "remove_author_ids": [
      // "18949"
      // ],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
      remove_ai_labels: ["spam"],
    },
  })
);
```

The filters available for MBD that you can pass in that object are:

A full request to the feed API with the custom mbd filters object looks like below

```javascript
const fetch = require("node-fetch");

const provider_metadata = encodeURIComponent(
  JSON.stringify({
    filters: {
      channels: ["https://warpcast.com/~/channel/neynar"],
      languages: ["en"],
      author_ids: ["194", "191"],
      // Note: remove_author_ids only works when author_ids isn't passed in
      // "remove_author_ids": [
      //   "18949"
      // ],
      frames_only: false,
      embed_domains: ["neynar.com", "frames.neynar.com"],
      ai_labels: ["science_technology"],
    },
  })
);

const url = `https://api.neynar.com/v2/farcaster/feed/for_you?fid=3&viewer_fid=2&provider=mbd&limit=10&provider_metadata=${provider_metadata}`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    api_key: "NEYNAR_API_DOCS",
  },
};

// Fetch request with the metadata and options
fetch(url, options)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("error:", error));
```

# Fetch Farcaster feeds > Farcaster feed of NFT owners

This guide demonstrates how to make a feed of Farcaster casts from users who own a specific NFT.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

Before all that, initialize Neynar client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

First, we need to get the addresses owning Milady. We can use the [Alchemy NFT API](https://docs.alchemy.com/reference/getownersforcontract-v3) to get the addresses of users who own the NFT.

```javascript
const getAddr = async (nftAddr: string): Promise<string[]> => {
  const apiKey = process.env.ALCHEMY_API_KEY;
  const baseUrl = `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}/getOwnersForContract?`;
  const url = `${baseUrl}contractAddress=${nftAddr}&withTokenBalances=false`;

  const result = await fetch(url, {
    headers: { accept: "application/json" },
  });
  const data = await result.json();
  return data.owners;
};

// milady maker contract address
const nftAddr = "0x5af0d9827e0c53e4799bb226655a1de152a425a5";
const addrs = await getAddr(nftAddr);
```

Next, get Farcaster FIDs of each address, then filter out any undefined values.

```javascript
const fidLookup = async (addrs: string[]) => {
  const fids = await Promise.all(
    addrs.map(async (addr) => {
      try {
        const response = await client.lookupUserByVerification(addr);
        return response ? response.result.user.fid : undefined;
      } catch (error) {
        return undefined;
      }
    })
  );
  return fids.filter((fid) => fid !== undefined);
};

const fids = await fidLookup(addrs);
```

Lastly, fetch the feed using the FIDs.

```javascript
const feed = await client.fetchFeed(FeedType.Filter, {
  filterType: FilterType.Fids,
  fids,
});

console.log(feed);
```

Example output:

```
{
  casts: [
    {
      object: "cast_hydrated",
      hash: "0x4b02b1ef6daa9fe111d3ce871ec004936f19b979",
      thread_hash: "0x4b02b1ef6daa9fe111d3ce871ec004936f19b979",
      parent_hash: null,
      parent_url: "https://veryinter.net/person",
      parent_author: [Object ...],
      author: [Object ...],
      text: "What'd you buy for Black Friday / Cyber Monday?\n\nI got a new webcam and bought a Roomba+mop that I'm excited to fiddle with.",
      timestamp: "2023-11-27T14:46:01.000Z",
      embeds: [],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0xf1210d9eb6b21bbf3847ca5983539ed9c2baee13",
      thread_hash: "0xf1210d9eb6b21bbf3847ca5983539ed9c2baee13",
      parent_hash: null,
      parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "Great couple days mostly off the internet. \n\nAlso excited to be back in the mix.\n\nWhat will be the biggest stories to end the year?",
      timestamp: "2023-11-27T14:44:19.000Z",
      embeds: [],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0x7d3ad4be401c0050cf20a060ebbd108383b6357c",
      thread_hash: "0x7d3ad4be401c0050cf20a060ebbd108383b6357c",
      parent_hash: null,
      parent_url: "https://foundation.app",
      parent_author: [Object ...],
      author: [Object ...],
      text: "Consisting of 50 1/1 works, Ver Clausi's new drop Blaamius imagines life after the Anthropocene. His rich, colorful illustrations that meld subject and scenery remind me of old sci-fi comics and H.R. Giger in the best possible way. \nPrice: 0.025\nhttps://foundation.app/collection/bla-cebc",
      timestamp: "2023-11-27T14:29:37.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }
  ],
  next: {
    cursor: "eyJ0aW1lc3RhbXAiOiIyMDIzLTExLTI3IDE0OjI5OjM3LjAwMDAwMDAifQ=="
  }
}
```

Farcaster feed of Milady owners!

# Fetch Farcaster feeds > Casts by embed in Farcaster

This guide demonstrates how to use the Neynar SDK to casts that contain a specific embed (eg. cast linking to github.com or youtube.com).

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize Neynar client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Then fetch casts linking to github.com:

```javascript
const result = await client.fetchFeed("filter", {
  filterType: "embed_url",
  embedUrl: "github.com",
});
console.log(result);
```

Replace `github.com` with any other embed url to fetch casts linking to that url.

To fetch casts linking to youtube.com:

```javascript
const result = await client.fetchFeed("filter", {
  filterType: "embed_url",
  embedUrl: "youtube.com",
});
console.log(result);
```

And... Spotify:

```javascript
const result = await client.fetchFeed("filter", {
  filterType: "embed_url",
  embedUrl: "open.spotify.com",
});
console.log(result);
```

Example output:

```
{
  casts: [
    {
      object: "cast_hydrated",
      hash: "0x9f617c43f00308cdb46b7b72f067b01557d53733",
      thread_hash: "0x9f617c43f00308cdb46b7b72f067b01557d53733",
      parent_hash: null,
      parent_url: "chain://eip155:7777777/erc721:0xe96c21b136a477a6a97332694f0caae9fbb05634",
      parent_author: [Object ...],
      author: [Object ...],
      text: "Yo, we got kids to raise and bills to pay, enemies to lay down when they stand in our way, it's only us \n\nhttps://open.spotify.com/track/0SlljMy4uEgoVPCyavtcHH",
      timestamp: "2023-12-11T04:06:57.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0xe70d9d52c5019b247fa93f76779296322676a4e5",
      thread_hash: "0xe70d9d52c5019b247fa93f76779296322676a4e5",
      parent_hash: null,
      parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "For the Intuitives (Part 1)",
      timestamp: "2023-12-11T02:11:27.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0xee6719ac805758be5bd54744bec63b7ec0bc4d3e",
      thread_hash: "0xee6719ac805758be5bd54744bec63b7ec0bc4d3e",
      parent_hash: null,
      parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "EP 214 Douglas Rushkoff on Leaving Social Media",
      timestamp: "2023-12-11T02:11:18.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0xebe7e89b1a3e91c96f99ecf3ce7d2797e3b118b6",
      thread_hash: "0xebe7e89b1a3e91c96f99ecf3ce7d2797e3b118b6",
      parent_hash: null,
      parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "#64 AI & the Global Brain: Peter Russell",
      timestamp: "2023-12-11T02:11:04.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }, {
      object: "cast_hydrated",
      hash: "0x93276da072a2902a3568da21203588995e4ba752",
      thread_hash: "0x93276da072a2902a3568da21203588995e4ba752",
      parent_hash: null,
      parent_url: null,
      parent_author: [Object ...],
      author: [Object ...],
      text: "Systems Thinking - Tomas Bjorkman - Consciousness",
      timestamp: "2023-12-11T02:10:26.000Z",
      embeds: [
        [Object ...]
      ],
      reactions: [Object ...],
      replies: [Object ...],
      mentioned_profiles: []
    }
  ],
  next: {
    cursor: "eyJ0aW1lc3RhbXAiOiIyMDIzLTEyLTExIDAyOjEwOjI2LjAwMDAwMDAifQ=="
  }
}
```

To fetch the next page:

```javascript
const nextResult = await client.fetchFeed("filter", {
  filterType: "embed_url",
  embedUrl: "github.com",
  cursor: result.next.cursor,
});
```

There you go, fetching casts with specific embeds in Farcaster with Neynar SDK!

# Fetch Farcaster feeds > How to use the Neynar Feed API

> This guide uses [this feed API](ref:fetch-feed)

There are three different ways you can use the Feed endpoint:

1. Getting the feed of a user by passing a `fid` field to the request
2. Getting the feed of multiple users by passing a `fids` field to the request
3. Getting the feed of a parent URL e.g. FIP-2 channels on Warpcast, by passing a `parent_url` field to the request

## Get feed by `fid`

If you want to get the feed of a user using their `fid`, you'll need to pass it in using the `fid` field of your request.

To try this request in the API Explorer to get an actual response from the API, follow these steps:

- In the _Request_ tab, ensure _Default_ is selected as shown below

- Add the fid of the user whose feed you want to get

- Press the **Try it** button to see the response

## Get feed by `fids`

You can get the feed for multiple users by passing an array of their fids in the `fids` field of your request. To do this, you'll need to set `filter_type=fids` in you request body.

To try this request in the API Explorer to get an actual response from the API, follow these steps:

- In the _Request_ tab, change the request type to **Get feed using fids**

- Set the query parameters to the following

- Press the **Try it** button to view the response

## Get feed by `parent_url`

You can get the feed for multiple users by passing the parent URL in the `parent_url` field in your request. To do this, you'll need to set `feed_type=filter` and `filter_type=parent_url` in you request body.

To try this request in the API Explorer to get an actual response from the API, follow these steps:

- In the _Request_ tab, change the request type to **Get feed using parent_url**

- Set the query parameters in the explorer

> Tip: You can use the following parent URL as an example value in the explorer: `chain://eip155:1/erc721:0xd4498134211baad5846ce70ce04e7c4da78931cc`

- Press the **Try it** button to view the response

## Sample creations with this endpoint

Fetch home feed for a user

Fetch channel feed:

# Get events via webhooks > Webhooks in dashboard

Neynar webhooks are a way to receive real-time updates about events on the Farcaster protocol. You can use webhooks to build integrations that respond to events on the protocol, such as when a user creates a cast or when a user updates their profile.

This guide will show you how to set up a webhook in the Neynar developer portal and how to integrate it into your application.

To create a new webhook without writing any code, head to the neynar dashboard and go to the [webhooks tab](https://dev.neynar.com/webhook). Click on the new webhook and enter the details as such:

![Create a new webhook on the neynar dashboard](https://github.com/neynarxyz/farcaster-examples/assets/76690419/81b65ce0-5b3a-4856-b1e5-7f46c2c648cd)

The webhook will fire to the specified `target_url`. To test it out, we are using a service like [ngrok](https://ngrok.com/) to create a public URL that will forward requests to your local server. However, we recommend using your own domain to avoid interruptions.

> Free endpoints like ngrok, localtunnel, etc. throttle webhook deliveries, best to use your own domain

Let's create a simple server that logs out the event. We will be using [Bun JavaScript](https://bun.sh).

```javascript
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    try {
      console.log(await req.json());

      return new Response("gm!");
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
});

console.log(`Listening on localhost:${server.port}`);
```

Next: run `bun serve index.ts`, and run ngrok with `ngrok http 3000`. Copy the ngrok URL and paste it into the "Target URL" field in the Neynar developer portal.  
The webhook will call the target URL every time the selected event occurs. Here, I've chosen all the casts created with farcasterframesbot present in the text.

Now the server will log out the event when it is fired. It will look something like this:

```javascript
{
  created_at: 1708025006,
  type: "cast.created",
  data: {
    object: "cast",
    hash: "0xfe7908021a4c0d36d5f7359975f4bf6eb9fbd6f2",
    thread_hash: "0xfe7908021a4c0d36d5f7359975f4bf6eb9fbd6f2",
    parent_hash: null,
    parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
    root_parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 234506,
      custody_address: "0x3ee6076e78c6413c8a3e1f073db01f87b63923b0",
      username: "balzgolf",
      display_name: "Balzgolf",
      pfp_url: "https://i.imgur.com/U7ce6gU.jpg",
      profile: [Object ...],
      follower_count: 65,
      following_count: 110,
      verifications: [ "0x8c16c47095a003b726ce8deffc39ee9cb1b9f124" ],
      active_status: "inactive",
    },
    text: "LFG",
    timestamp: "2024-02-15T19:23:22.000Z",
    embeds: [],
    reactions: {
      likes: [],
      recasts: [],
    },
    replies: {
      count: 0,
    },
    mentioned_profiles: [],
  },
}
```

## Conclusion

That's it, it's that simple! The next steps would be to have a public server that can handle the webhook events and use it to suit your needs.

Lastly, make sure to sure what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar) and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!

# Get events via webhooks > Programmatic webhooks

Neynar webhooks are a way to receive real-time updates about events on the Farcaster protocol. You can use webhooks to build integrations that respond to events on the protocol, such as when a user creates a cast or when a user updates their profile.

You might need to create multiple webhooks tracking different activities and calling different APIs programmatically. So, let's see how we can create webhooks using the neynar SDK in a node script.

I am using a [bun app](https://bun.sh/) for the sake of simplicity of this guide, but you can use express, Next.js api routes or any server you wish to use!

Create a new server by entering the following commands in your terminal:

```powershell
mkdir webhooks-sdk
cd webhooks-sdk
bun init
```

We are going to need the `@neynar/nodejs-sdk`, so let’s install that as well:

```powershell
bun add @neynar/nodejs-sdk
```

Once the project is created and the packages are installed, you can open it in your favourite editor and add the following in a new `script.ts` file:

```typescript script.ts
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

if (!process.env.NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is not set");
}

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

const webhook = await client.publishWebhook("abc", "YOUR_NGROK_URL_HERE", {
  subscription: {
    "cast.created": {
      text: "\\$(DEGEN|degen)",
    },
  },
});

console.log(webhook);
```

This simple script uses the neynarClient to publish a webhook with a name, url and subscription parameter. The webhook will call the target URL every time the subscribed event occurs. Here, I've chosen all the casts created with degen present in the text. You can select the regex or type of subscription according to your use. You can also subscribe to multiple events here at once! You can take a look at all the possible ways [here](https://docs.neynar.com/reference/publish-webhook).

You can get the neynar api key that we are using to initialise the client from the neynar dashboard.

![](https://files.readme.io/794cfad-image.png)

Add the api key in a `.env` file with the name `NEYNAR_API_KEY`.

Now, let's test our api but to do that we'll need an api which we can call. In the `index.ts` file add the following:

```typescript index.ts
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    try {
      console.log(await req.json());

      return new Response("gm!");
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
});

console.log(`Listening on localhost:${server.port}`);
```

This will spin up a server on localhost:3000, and log the request body every time the API gets called. Let's run it in one terminal using `bun run index.ts` and we'll use ngrok to serve it. If you don’t already have it installed, install it from [here](https://ngrok.com/download). Once it’s installed authenticate using your auth token and serve your app using this command:

```powershell
ngrok http http://localhost:3000
```

> Free endpoints like ngrok, localtunnel, etc. can have issues because service providers start blocking events over a certain limit

Copy the URL you got from ngrok and replace it with `YOUR_NGROK_URL_HERE` in the previous script. Once you've done that, run the script using `bun run script.ts` and it should create a webhook for you like this:

![](https://files.readme.io/c8a7d49-image.png)

Once the webhook is created, you'll start seeing logs on your server, which means that our webhook is working successfully!

## Conclusion

Lastly, make sure to share what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar), and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!

# Get events via webhooks > Verify webhooks

Webhook signatures are strings used to verify the validity of an incoming webhook event. This signature is passed as header values in the format: `X-Neynar-Signature`.

The validation is an important process to prevent exploitation and malicious webhook requests.

```Text JSON
{
  "Content-Type": "application/json",
  "X-Neynar-Signature": "6ffbb59b2300aae63f272406069a9788598b792a944a07aba816edb039989a39"
}
```

---

## Verification Process

### Step 1. Create a new signature string

Use an HMAC library of your choice to create a sha512 digest with the following:

- Shared secret - Find this on the [Developer Portal](https://dev.neynar.com/webhook)
- Encoding format - This is always `hex`
- Request payload - The request body object of the webhook POST

### Step 2. Compare the signatures

Compare the signatures from Step 1 and the request header `X-Neynar-Signature`

## Example

Here's an example of a Next.js API handler validating a signature from a request.

```typescript
import { NextRequest } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();

  const sig = req.headers.get("X-Neynar-Signature");
  if (!sig) {
    throw new Error("Neynar signature missing from request headers");
  }

  const webhookSecret = process.env.NEYNAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error(
      "Make sure you set NEYNAR_WEBHOOK_SECRET in your .env file"
    );
  }

  const hmac = createHmac("sha512", webhookSecret);
  hmac.update(body);

  const generatedSignature = hmac.digest("hex");

  const isValid = generatedSignature === sig;
  if (!isValid) {
    throw new Error("Invalid webhook signature");
  }

  const hookData = JSON.parse(body);

  // your code continues here ...
}
```

---

## Appendix

- Caveats and additional details can be found here: [Verification of simple signatures ](https://docs.getconvoy.io/product-manual/signatures#simple-signatures)

# Get events via webhooks > Zapier workflows

1. Create a Zapier account [here](https://zapier.com) if you don't have one already.

2. Start creating a new zap and search for Neynar when setting up your trigger

   1.

3. Choose Neynar as trigger

4. Then choose which Farcaster event you want to get notified for -- every new cast on the protocol or a mention of a specific user in a cast

5. On the account step, insert your Neynar API key to connect your Neynar account with Zapier

   1.

6. If mention of a specific user, enter the FID of the user you want to get webhook notifications for. You can find the FID of an account by looking at the "About" section of that account on Warpcast

   1.

7. Test your trigger after setting the FID. If there is a recent cast on the network with the mention, it will show up. If not, make a cast and wait a few minutes before testing again. Proceed with a selected record as example.

   1.

8. Choose the action you want to take based on the webhook e.g. sending a message in Slack. Finish setting up the action on Zapier and you're done!
   1.

You should now be able to trigger Zapier workflows based on webhook data!

# Get Farcaster data onchain > ETH address <> FID Contract

Fetching an addresses' connected fid [with Neynar's APIs](https://docs.neynar.com/docs/fetching-farcaster-user-based-on-ethereum-address), [Neynar's Parquet Files](https://dash.readme.com/project/neynar/v2.0/docs/parquet), [Neynar's Indexer Service](https://dash.readme.com/project/neynar/v2.0/docs/indexer-service-pipe-farcaster-data) or [Neynar's Hosted Database](https://dash.readme.com/project/neynar/v2.0/docs/sql) is easy, but until now that data wasn't accessible to smart contracts on any L2s. Now, on the Base Mainnet and Sepolia testnet, smart contracts can query the fid linked to any ETH address.

## The Contract

| **Chain**    | **Address**                                | **Deploy Transaction**                                             |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------ |
| Base Mainnet | 0xdB1eCF22d195dF9e03688C33707b19C68BdEd142 | 0xc61c054a4bc269d4263bd10933a664585ac8878eab1e1afe460220fb18e718ca |
| Base Sepolia | 0x3906b52ac27bae8bc5cc8e4e10a99665b78e35ac | 0x8db23c7bca5cc571cde724fd258ae4d7bf842c3a1b2cf495300bf819ebaea0ce |

- [Read the Proxy Contract on the Base Sepolia Explorer](https://sepolia.basescan.org/address/0x3906b52ac27bae8bc5cc8e4e10a99665b78e35ac#readProxyContract). This is the upgradeable proxy contract you should use.
- [Verifications V4 Code on the Base Sepelia Explorer](https://sepolia.basescan.org/address/0xe2f971D765E9c3F8a2641Ef5fdAec4dD9c67Cf11#code). This is an upgradeable implementation contract. There is no state here. This is the code that the proxy contract is currently using.

## The Interface

The V4 interface is quite simple:

```solidity
interface IVerificationsV4Reader {
    function getFid(address verifier) external view returns (uint256 fid);
    function getFidWithEvent(address verifier) external returns (uint256 fid);
    function getFids(address[] calldata verifiers) external view returns (uint256[] memory fid);
}
```

If the `getFid` call returns `0`there is no verification for that address.

If you can spare the gas and would like us to know that you are using our contract, please use `getFidWithEvent`.

A simple example of a HelloWorld contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface IVerificationsV4Reader {
    function getFid(address verifier) external view returns (uint256 fid);
    function getFidWithEvent(address verifier) external returns (uint256 fid);
    function getFids(address[] calldata verifiers) external view returns (uint256[] memory fid);
}

contract HelloWorld {
    IVerificationsV4Reader immutable verifications;

    constructor(IVerificationsV4Reader _verifications) {
       verifications = _verifications;
    }

    function requireVerification() public view returns (uint256) {
        uint256 fid = verifications.getFid(msg.sender);

        if (fid == 0) {
            revert("!fid");
        }

        return fid;
    }
}
```

## The Future

This experiment will see what we can unlock by bringing more Farcaster data on-chain. If you build something using this, please [reach out](https://t.me/rishdoteth). We want to hear what you're building and see how we can make it easier.

## Further reading

- [Add verifications to Farcaster user profile via API](https://docs.neynar.com/reference/publish-verification)
- [Create verification on Farcaster Hub](https://docs.farcaster.xyz/developers/guides/writing/verify-address)

# Get Farcaster data onchain > Address <> user score contract

> Read prior context on user scores [here](doc:neynar-user-quality-score)

User scores are particularly useful if anonymous addresses are interacting with your contract and you want to restrict interaction to high quality addresses. Neynar already supports user quality scores offchain (read more [here](https://docs.neynar.com/docs/neynar-user-quality-score)), this brings them onchain and makes it available to smart contracts. Now, on the Base Mainnet and Sepolia testnet, smart contracts can query the fid linked to any ETH address and the quality score for that FID.

## Contract

| **Chain**    | **Address**                                | **Deploy Transaction**                                             |
| ------------ | ------------------------------------------ | ------------------------------------------------------------------ |
| Base Mainnet | 0xd3C43A38D1D3E47E9c420a733e439B03FAAdebA8 | 0x059259c15f660a4b5bd10695b037692654415f60e13569c7a06e99cfd55a54b0 |
| Base Sepolia | 0x7104CFfdf6A1C9ceF66cA0092c37542821C1EA50 | 0xfdf68b600f75b4688e5432442f266cb291b9ddfe2ec05d2fb8c7c64364cf2c73 |

- Read the Proxy Contract on the Base Explorer ([link](https://basescan.org/address/0xd3C43A38D1D3E47E9c420a733e439B03FAAdebA8#readProxyContract)). This is the upgradeable proxy contract you should use.
- User score code on the Base Explorer ([link](https://basescan.org/address/0xd3C43A38D1D3E47E9c420a733e439B03FAAdebA8#code)). This is an upgradeable implementation contract. There is no state here. This is the code that the proxy contract is currently using.

## Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface INeynarUserScoresReader {
    function getScore(address verifier) external view returns (uint24 score);
    function getScoreWithEvent(address verifier) external returns (uint24 score);
    function getScores(address[] calldata verifiers) external view returns (uint24[] memory scores);

    function getScore(uint256 fid) external view returns (uint24 score);
    function getScoreWithEvent(uint256 fid) external returns (uint24 score);
    function getScores(uint256[] calldata fids) external view returns (uint24[] memory scores);
}
```

If the `getScore` call returns `0`there is no user score for that address.

If you can spare the gas and would like us to know that you are using our contract, please use `getScoreWithEvent`.

## Sample use

A simple example of a HelloWorld contract:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface INeynarUserScoresReader {
    function getScore(address verifier) external view returns (uint24 score);
    function getScoreWithEvent(address verifier) external returns (uint24 score);
    function getScores(address[] calldata verifiers) external view returns (uint24[] memory scores);

    function getScore(uint256 fid) external view returns (uint24 score);
    function getScoreWithEvent(uint256 fid) external returns (uint24 score);
    function getScores(uint256[] calldata fids) external view returns (uint24[] memory scores);
}

contract HelloWorld {
    INeynarUserScoresReader immutable verifications;

    constructor(INeynarUserScoresReader _userScores) {
       userScores = _userScores;
    }

    function requireHighScore() public view returns (uint256) {
        uint256 score = userScores.getScoreWithEvent(msg.sender);

        if (score < 950000) {
            revert("!top 5% percentile account");
        }

        return score;
    }
}
```

## Future

This experiment will see what we can unlock by bringing more Farcaster data on-chain. If you build something using this, please [reach out](https://t.me/rishdoteth). We want to hear what you're building and see how we can make it easier.

## Further reading

- [Sybil resistance using Neynar user quality score](https://docs.neynar.com/docs/neynar-user-quality-score)
- [Addresses ↔ Farcaster FIDs onchain](https://docs.neynar.com/docs/verifications-contract)

# Fetch notifications > Notifications for FID

This guide demonstrates how to fetch notifications (inbound mentions, replies, likes, recasts) of a Farcaster user with the Neynar SDK.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Then fetch the notifications:

```javascript
const dwrFID = 3;
const notifications = await client.fetchAllNotifications(dwrFID);

console.log(notifications);
```

Example output:

```
{
  notifications: [
    {
      object: "notification",
      most_recent_timestamp: "2023-11-28T11:11:11.000Z",
      type: "likes",
      cast: [Object ...],
      reactions: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ]
    }, {
      object: "notification",
      most_recent_timestamp: "2023-11-28T11:10:56.000Z",
      type: "likes",
      cast: [Object ...],
      reactions: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ]
    }, {
      object: "notification",
      most_recent_timestamp: "2023-11-28T11:09:16.000Z",
      type: "likes",
      cast: [Object ...],
      reactions: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ]
    }, {
      object: "notification",
      most_recent_timestamp: "2023-11-28T11:05:59.000Z",
      type: "follows",
      follows: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ]
    }, {
      object: "notification",
      most_recent_timestamp: "2023-11-28T10:25:51.000Z",
      type: "likes",
      cast: [Object ...],
      reactions: [
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...],
        [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
      ]
    }
  ],
  next: {
    cursor: "eyJ0aW1lc3RhbXAiOiIyMDIzLTExLTI4IDEwOjI1OjUxLjAwMDAwMDAifQ=="
  }
}
```

So that's what @dwr.eth sees on his Farcaster notification! To fetch the next page of notifications, use the cursor:

```javascript
const nextNotifications = await client.fetchAllNotifications(dwrFID, {
  cursor: notifications.next.cursor,
});
```

To only fetch reply and mentions, use the fetchMentionAndReplyNotifications function:

```javascript
const mentionsAndReplies = await client.fetchMentionAndReplyNotifications(
  dwrFID
);

console.log(mentionsAndReplies);
```

Example output:

```
{
  result: {
    notifications: [
      [Object ...], [Object ...], [Object ...], [Object ...], [Object ...]
    ],
    next: {
      cursor: "eyJ0aW1lc3RhbXAiOiIyMDIzLTExLTI4IDA3OjI5OjI4LjAwMDAwMDAifQ=="
    }
  }
}
```

To fetch the next page of mentions and replies, use the cursor:

```javascript
const nextMentionsAndReplies = await client.fetchMentionAndReplyNotifications(
  dwrFID,
  {
    cursor: mentionsAndReplies.result.next.cursor,
  }
);
```

That's it! You can now fetch notifications of any Farcaster user.

# Fetch notifications > Notifications in channel

Say you have a Farcaster client focusing on a specific channel, and you want to fetch notifications for a specific FID for that specific channel. We got you covered!

This guide will show you how to fetch notifications for a specific FID for a specific channel.

Check out this [Getting started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Let's say you have a Nouns-specific Farcaster client and you want to fetch notifications for a specific FID.

> channel_name to parent_url mapping
>
> All parent_url to channel_name mappings can be found at this [Github repo](https://github.com/neynarxyz/farcaster-channels/blob/main/warpcast.json), along with other channel metadata.
>
> This repo is open source so feel free to submit PRs for additional channel data if you see anything missing.

```javascript
const nounsChannelUrl =
  "chain://eip155:1/erc721:0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03";

const userFID = 3;
const notifications = await client.fetchChannelNotificationsForUser(userFID, [
  nounsChannelUrl,
]);
```

Example output:

```
{
  "notifications": [
    {
      "object": "notification",
      "most_recent_timestamp": "2023-12-08T06:31:10.000Z",
      "type": "mention",
      "cast": {
        "object": "cast_hydrated",
        "hash": "0xd16b71018cc53c667e771bb4c13627555a32b5d4",
        "thread_hash": "b7fc569081242aadeb29f8254931daf31c9e1017",
        "parent_hash": "243f539607f4ea7b4117a169433c1ea8295d32fc",
        "parent_url": null,
        "parent_author": {
          "fid": "3895"
        },
        "author": {
          "object": "user",
          "fid": 1079,
          "custody_address": "0xeb31e335531c06ca4d8fe58bed841e9031de4ee4",
          "username": "joshuafisher.eth",
          "display_name": "Joshua Fisher",
          "pfp_url": "https://i.imgur.com/1pn4CEg.jpg",
          "profile": {
            "bio": {
              "text": "⌐- ‘ing around. Working on Nouns Creative focused on narrative works. Music Publisher & Manager by day.",
              "mentioned_profiles": []
            }
          },
          "follower_count": 422,
          "following_count": 149,
          "verifications": [
            "0xbd7dbab9aeb52d6c8d0e80fcebde3af4cc86204a"
          ],
          "active_status": "active"
        },
        "text": "Would be tasty if we could buy this with Warps @dwr.eth",
        "timestamp": "2023-12-08T06:31:10.000Z",
        "embeds": [],
        "reactions": {
          "likes": [
            {
              "fid": 1898,
              "fname": "boscolo.eth"
            },
            {
              "fid": 14700,
              "fname": "brsn"
            },
            {
              "fid": 3,
              "fname": "dwr.eth"
            },
            {
              "fid": 576,
              "fname": "nonlinear.eth"
            }
          ],
          "recasts": []
        },
        "replies": {
          "count": 0
        },
        "mentioned_profiles": [
          {
            "object": "user",
            "fid": 3,
            "custody_address": "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
            "username": "dwr.eth",
            "display_name": "Dan Romero",
            "pfp_url": "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
            "profile": {
              "bio": {
                "text": "Working on Farcaster and Warpcast.",
                "mentioned_profiles": []
              }
            },
            "follower_count": 30657,
            "following_count": 2722,
            "verifications": [
              "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
              "0xa14b4c95b5247199d74c5578531b4887ca5e4909",
              "0xb877f7bb52d28f06e60f557c00a56225124b357f",
              "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea"
            ],
            "active_status": "active"
          }
        ]
      }
    },
    {
      "object": "notification",
      "most_recent_timestamp": "2023-12-08T06:09:50.000Z",
      "type": "mention",
      "cast": {
        "object": "cast_hydrated",
        "hash": "0xbf05b5bb119d4f1b8c514fbc75c23f9c8755dfd7",
        "thread_hash": "f750ed31ece83fa486be9b37782d57d1b679f925",
        "parent_hash": "bde97a78c48ed92ba01c2c2f0cfd521b52f524bc",
        "parent_url": null,
        "parent_author": {
          "fid": "7143"
        },
        "author": {
          "object": "user",
          "fid": 1097,
          "custody_address": "0xe12b01100a4be7e79ddbd5dd939c97d12e890ac7",
          "username": "noun40",
          "display_name": "Noun 40",
          "pfp_url": "https://openseauserdata.com/files/faa77932343776d1237e5dd82aa12e76.svg",
          "profile": {
            "bio": {
              "text": "cofounder/cto @ bitwise",
              "mentioned_profiles": []
            }
          },
          "follower_count": 15682,
          "following_count": 55,
          "verifications": [
            "0xae65e700f3f8904ac1007d47a5309dd26f8146c0"
          ],
          "active_status": "active"
        },
        "text": "oh hmm i wonder if there’s a way to expose this data of channel subscribers @dwr.eth @v?",
        "timestamp": "2023-12-08T06:09:50.000Z",
        "embeds": [],
        "reactions": {
          "likes": [
            {
              "fid": 194490,
              "fname": "0xdbao"
            },
            {
              "fid": 197459,
              "fname": "cryptoworldao"
            },
            {
              "fid": 193703,
              "fname": "ai13"
            }
          ],
          "recasts": []
        },
        "replies": {
          "count": 1
        },
        "mentioned_profiles": [
          {
            "object": "user",
            "fid": 3,
            "custody_address": "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
            "username": "dwr.eth",
            "display_name": "Dan Romero",
            "pfp_url": "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
            "profile": {
              "bio": {
                "text": "Working on Farcaster and Warpcast.",
                "mentioned_profiles": []
              }
            },
            "follower_count": 30657,
            "following_count": 2722,
            "verifications": [
              "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
              "0xa14b4c95b5247199d74c5578531b4887ca5e4909",
              "0xb877f7bb52d28f06e60f557c00a56225124b357f",
              "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea"
            ],
            "active_status": "active"
          },
          {
            "object": "user",
            "fid": 2,
            "custody_address": "0x4114e33eb831858649ea3702e1c9a2db3f626446",
            "username": "v",
            "display_name": "Varun Srinivasan",
            "pfp_url": "https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format",
            "profile": {
              "bio": {
                "text": "Technowatermelon. Elder Millenial. Building Farcaster. \n\nnf.td/varun",
                "mentioned_profiles": []
              }
            },
            "follower_count": 27025,
            "following_count": 974,
            "verifications": [
              "0x91031dcfdea024b4d51e775486111d2b2a715871",
              "0x182327170fc284caaa5b1bc3e3878233f529d741"
            ],
            "active_status": "active"
          }
        ]
      }
    },
    {
      "object": "notification",
      "most_recent_timestamp": "2023-12-03T23:35:12.000Z",
      "type": "mention",
      "cast": {
        "object": "cast_hydrated",
        "hash": "0x06dfafdffa7455c3fd0a617ce1b026bcf01211d1",
        "thread_hash": "2695897f7265b116de992dde0a13865dda938eae",
        "parent_hash": "7b00f3e12f26ff363555d4f94f64e547fde7379a",
        "parent_url": null,
        "parent_author": {
          "fid": "7143"
        },
        "author": {
          "object": "user",
          "fid": 1097,
          "custody_address": "0xe12b01100a4be7e79ddbd5dd939c97d12e890ac7",
          "username": "noun40",
          "display_name": "Noun 40",
          "pfp_url": "https://openseauserdata.com/files/faa77932343776d1237e5dd82aa12e76.svg",
          "profile": {
            "bio": {
              "text": "cofounder/cto @ bitwise",
              "mentioned_profiles": []
            }
          },
          "follower_count": 15682,
          "following_count": 55,
          "verifications": [
            "0xae65e700f3f8904ac1007d47a5309dd26f8146c0"
          ],
          "active_status": "active"
        },
        "text": "@dwr.eth @v would you agree? is there a more fundamental reason it’s whitelisted atm?",
        "timestamp": "2023-12-03T23:35:12.000Z",
        "embeds": [],
        "reactions": {
          "likes": [
            {
              "fid": 1356,
              "fname": "farcasteradmin.eth"
            }
          ],
          "recasts": []
        },
        "replies": {
          "count": 1
        },
        "mentioned_profiles": [
          {
            "object": "user",
            "fid": 3,
            "custody_address": "0x6b0bda3f2ffed5efc83fa8c024acff1dd45793f1",
            "username": "dwr.eth",
            "display_name": "Dan Romero",
            "pfp_url": "https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA",
            "profile": {
              "bio": {
                "text": "Working on Farcaster and Warpcast.",
                "mentioned_profiles": []
              }
            },
            "follower_count": 30657,
            "following_count": 2722,
            "verifications": [
              "0xd7029bdea1c17493893aafe29aad69ef892b8ff2",
              "0xa14b4c95b5247199d74c5578531b4887ca5e4909",
              "0xb877f7bb52d28f06e60f557c00a56225124b357f",
              "0x8fc5d6afe572fefc4ec153587b63ce543f6fa2ea"
            ],
            "active_status": "active"
          },
          {
            "object": "user",
            "fid": 2,
            "custody_address": "0x4114e33eb831858649ea3702e1c9a2db3f626446",
            "username": "v",
            "display_name": "Varun Srinivasan",
            "pfp_url": "https://i.seadn.io/gae/sYAr036bd0bRpj7OX6B-F-MqLGznVkK3--DSneL_BT5GX4NZJ3Zu91PgjpD9-xuVJtHq0qirJfPZeMKrahz8Us2Tj_X8qdNPYC-imqs?w=500&auto=format",
            "profile": {
              "bio": {
                "text": "Technowatermelon. Elder Millenial. Building Farcaster. \n\nnf.td/varun",
                "mentioned_profiles": []
              }
            },
            "follower_count": 27025,
            "following_count": 974,
            "verifications": [
              "0x91031dcfdea024b4d51e775486111d2b2a715871",
              "0x182327170fc284caaa5b1bc3e3878233f529d741"
            ],
            "active_status": "active"
          }
        ]
      }
    }
  ],
  "next": {
    "cursor": "eyJ0aW1lc3RhbXAiOiIyMDIzLTEyLTAzIDIzOjM1OjEyLjAwMDAwMDAifQ=="
  }
}
```

To fetch the next page of notifications, use the cursor:

```javascript
const nextNotifications = await client.fetchChannelNotificationsForUser(
  userFID,
  [nounsChannelUrl],
  {
    cursor: notifications.next.cursor,
  }
);
```

That's it, no more wrangling with SQL queries or whatever bespoke solution to get notifications for a specific channel!

# Build Farcaster frames > Building frames

Neynar supports building frames in a few different ways:

- [Neynar Frame Studio](https://neynar.com/nfs): allows building frames with no code and pre-made templates
- Frame APIs:
  - [Validating frame actions](https://docs.neynar.com/reference/validate-frame-action), user and cast data in one API call
  - [CRUD](https://docs.neynar.com/reference/publish-neynar-frame) for hosted frames
  - Embedding frames in your client and [posting actions](https://docs.neynar.com/reference/post-frame-action)

---

# Overview

Frames v2 enables developers to send notifications to users who have added the Frame to their Farcaster client and enabled notifications.

Neynar provides a simple way to manage approved notification tokens, send notifications, handle notification permission revokes, and frame "remove" events.

# Set up Notifications

## Step 1: Add events webhook URL to Frame Manifest

### (a) Locate the Neynar frame events webhook URL

The Neynar frame events webhook URL is on the Neynar app page. Navigate to [dev.neynar.com/app](https://dev.neynar.com/app) and then click on the app.

It should be in this format -`https://api.neynar.com/f/app/<your_client_id>/event`. See the highlighted URL in the image below.

![](https://files.readme.io/da35cbb784332bb13686353ac326b0d50bf6ed01e588e66e18e77e8fccb6ff67-image.png)

### (b) Set this URL in the Frame manifest

Frame servers must provide a JSON manifest file on their domain at the well-known URI.  
for example `https://your-frame-domain.com/.well-known/farcaster.json`.

Set the Neynar frame events URL as the `webhookUrl` to the Frame Config object inside the manifest. Here's an example manifest

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjE5MSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDNhNmRkNTY5ZEU4NEM5MTgyOEZjNDJEQ0UyMGY1QjgyN0UwRUY1QzUifQ",
    "payload": "eyJkb21haW4iOiIxYmNlLTczLTcwLTE2OC0yMDUubmdyb2stZnJlZS5hcHAifQ",
    "signature": "MHg1ZDU1MzFiZWQwNGZjYTc5NjllNDIzNmY1OTY0ZGU1NDMwNjE1YTdkOTE3OWNhZjE1YjQ5M2MxYWQyNWUzMTIyM2NkMmViNWQyMjFhZjkxYTYzM2NkNWU3NDczNmQzYmE4NjI4MmFiMTU4Y2JhNGY0ZWRkOTQ3ODlkNmM2OTJlNDFi"
  },
  "frame": {
    "version": "4.2.0",
    "name": "Your Frame Name",
    "iconUrl": "https://your-frame-domain.com/icon.png",
    "splashImageUrl": "https://your-frame-domain.com/splash.png",
    "splashBackgroundColor": "#f7f7f7",
    "homeUrl": "https://your-frame-domain.com",
    "webhookUrl": "https://api.neynar.com/f/app/<your_client_id>/event"
  }
}
```

> Frame manifest caching
>
> Farcaster clients might have your Frame manifest cached and would only get updated on a periodic basis.
>
> If you're using Warpcast to test, you can go their Settings > Developer Tools > Domains, put in your Frame URL and hit the Check domain status to force a refresh.

## Step 2: Prompt users to add your Frame

### (a) Install the [@farcaster/frame-sdk](https://github.com/farcasterxyz/frames/tree/main/packages/frame-sdk)

```
yarn add @farcaster/frame-sdk
```

### (b) Prompt the user

```typescript
import sdk from "@farcaster/frame-sdk";

const result = await sdk.actions.addFrame();
```

The result type is:

```
export type FrameNotificationDetails = {
  url: string;
  token: string;
};

export type AddFrameResult =
  | {
      added: true;
      notificationDetails?: FrameNotificationDetails;
    }
  | {
      added: false;
      reason: 'invalid_domain_manifest' | 'rejected_by_user';
    };

```

If `added` is true and `notificationDetails` is a valid object, then the client should have called POST to the Neynar frame events webhook URL with the same details.

Neynar will manage all Frame add/remove & notifications enabled/disabled events delivered on this events webhook.

## Step 3: Send a notification to users

Use the following example on the [@neynar/nodejs-sdk](https://github.com/neynarxyz/nodejs-sdk) to send notifications to your users. The API can send a notification to a max of 100 users at a time.

```typescript
const targetFids = [191, 194, 6131];
const notification = {
  title: "",
  body: "It's time to savor farcaster",
  target_url: "https://your-frame-domain.com/notification-destination",
};

client
  .publishFrameNotifications({ targetFids, notification })
  .then((response) => {
    console.log("response:", response);
  });
```

Additional documentation on the API and its body parameters can be found at <https://docs.neynar.com/reference/publish-frame-notifications>

# FAQ

### How do I determine if the user has already added my Frame?

The FrameContext object passed into the Frame at launch time contains the `added` boolean and `notificationDetails` object. More details [here](https://github.com/farcasterxyz/frames/blob/main/packages/frame-core/src/types.ts#L58-L62)

### What happens if I send a notification via API to a user who has revoked notification permission?

To avoid getting rate-limited by Farcaster clients, Neynar will filter out sending notifications to disabled tokens.

### How do I fetch the notification tokens, URLs, and their status?

The [fetch notification tokens API](https://docs.neynar.com/reference/fetch-notification-tokens) provides access to the underlying data.

# Write Direct Casts > Webhooks with DCs

In this guide, we’ll make a webhook which will send a DC to the user based on any action they perform on Farcaster! For this guide, I'll send direct casts to people whose casts include a specific keyword.

Before we begin, you can access the [source code](https://github.com/neynarxyz/farcaster-examples/tree/main/cast-action) for this guide on [GitHub Gist](https://gist.github.com/avneesh0612/9fa31cdbb5aa86c46cdb1d50deef9001).

Let's get started!

### Creating the webhook

To create a new webhook, head to the [neynar dashboard](https://dev.neynar.com) and go to the [webhooks tab](https://dev.neynar.com/webhook). Click on the new webhook and enter the details as such:

![](https://files.readme.io/d1d180c-image.png)

The webhook will fire to the specified `target_url`. To test it out, we can use a service like [ngrok](https://ngrok.com/) to create a public URL that will forward requests to your local server.

> Free endpoints like ngrok, localtunnel, etc. can have issues because service providers start blocking events over a certain limit

### Creating the server

Let's create a simple server that logs out the event. We will be using [Bun JavaScript](https://bun.sh).

```typescript index.ts
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    try {
      console.log(await req.json());

      return new Response("gm!");
    } catch (e: any) {
      return new Response(e.message, { status: 500 });
    }
  },
});

console.log(`Listening on localhost:${server.port}`);
```

Next: run `bun serve index.ts`, and run ngrok with `ngrok http 3000`. Copy the ngrok URL and paste it into the "Target URL" field in the Neynar developer portal.  
The webhook will call the target URL every time the selected event occurs. Here, I've chosen all the casts created with neynarDC present in the text.

Now the server will log out the event when it is fired. It will look something like this:

```typescript index.ts
{
  created_at: 1708025006,
  type: "cast.created",
  data: {
    object: "cast",
    hash: "0xfe7908021a4c0d36d5f7359975f4bf6eb9fbd6f2",
    thread_hash: "0xfe7908021a4c0d36d5f7359975f4bf6eb9fbd6f2",
    parent_hash: null,
    parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
    root_parent_url: "chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61",
    parent_author: {
      fid: null,
    },
    author: {
      object: "user",
      fid: 234506,
      custody_address: "0x3ee6076e78c6413c8a3e1f073db01f87b63923b0",
      username: "balzgolf",
      display_name: "Balzgolf",
      pfp_url: "https://i.imgur.com/U7ce6gU.jpg",
      profile: [Object ...],
      follower_count: 65,
      following_count: 110,
      verifications: [ "0x8c16c47095a003b726ce8deffc39ee9cb1b9f124" ],
      active_status: "inactive",
    },
    text: "neynarDC",
    timestamp: "2024-02-15T19:23:22.000Z",
    embeds: [],
    reactions: {
      likes: [],
      recasts: [],
    },
    replies: {
      count: 0,
    },
    mentioned_profiles: [],
  },
}
```

### Adding DC functionality

Firstly, you need a warpcast API key to send DCs. So, head over to <https://warpcast.com/~/developers/api-keys> and create a new API key.

Once you have the API key add this fetch request in your try block:

```typescript index.ts
const info = await req.json();

const DCreq = await fetch("https://api.warpcast.com/v2/ext-send-direct-cast", {
  method: "PUT",
  headers: {
    Authorization: "Bearer <warpcast_api_key>",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    recipientFid: info.data.author.fid,
    message: "gm",
    idempotencyKey: uuidv4(),
  }),
});

const res = await DCreq.json();
console.log(res);
```

Here, you need to replace `<warpcast_api_key>` with the api key that you generated from the Warpcast dashboard.

In the request, we need to provide the FID to send the message to, the message body, and an idempotencyKey to retry if the request fails.

For the `recipientFid` we are using the FID of the author of the cast and the `idempotencyKey` is a random key generated by `uuid` which we need to install and import:

```powershell
bun i uuid
```

```typescript index.ts
import { v4 as uuidv4 } from "uuid";
```

If you restart the server and cast again, it will send a DC to the account creating the cast .

## Conclusion

That's it, it's that simple! The next steps would be to have a public server that can handle the webhook events and use it to suit your needs.

Lastly, please share what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar), and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!

# Run queries on FC data > Neynar SQL playground

# Neynar Farcaster SQL playground

> Available at [data.hubs.neynar.com](https://data.hubs.neynar.com)

## Subscription

If you don’t have access yet, subscribe at [neynar.com](https://neynar.com) . _Please reach out to rish on [Telegram](http://t.me/rishdoteth) or [Farcaster](http://warpcast.com/rish) with feedback, questions or to ask for access_

## Schema

You can always get the latest schema from the database directly by running this query

```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

If you give chatgpt the table schema and tell it what you want, it’ll write the sql query for you! Schema as of Nov 21, 2024 is [here](https://neynar.notion.site/Public-postgres-schema-145655195a8b80fc969cc766fbcde86b?pvs=4). We recommend you get the latest schema when working with an LLM agent.

# Get Hypersub subscriptions > Common subscriptions of 2 users

In this guide, we'll take two FIDs and then find their common subscriptions on fabric.

We'll use JavaScript for this guide, but the same logic would work for any other language you use!

So, let's get started by creating a new file and defining our constants:

```typescript index.ts
const fid1 = 194;
const fid2 = 191;
const url1 = `https://api.neynar.com/v2/farcaster/user/subscribed_to?fid=${fid1}&viewer_fid=3&subscription_provider=fabric_stp`;
const url2 = `https://api.neynar.com/v2/farcaster/user/subscribed_to?fid=${fid2}&viewer_fid=3&subscription_provider=fabric_stp`;
```

You can replace the FIDs with the ones you want to check the subscriptions for and leave the URLs as they are. The URL is the API route to get all the channels a user is subscribed to. You can find more info about the API route in the [API reference](https://docs.neynar.com/reference/fetch-subscribed-to-for-fid).

Then, call the APIs using fetch like this:

```typescript index.ts
const fetchUrls = async () => {
  const options = {
    method: "GET",
    headers: { accept: "application/json", api_key: "NEYNAR_API_DOCS" },
  };

  const response = await Promise.all([
    fetch(url1, options),
    fetch(url2, options),
  ]);
  const data = await Promise.all(response.map((res) => res.json()));
  return data;
};
```

Here, make sure to replace the API key with your API key instead of the docs API key in production.

Finally, let's filter out the data to find the common subscriptions like this:

```typescript index.ts
fetchUrls().then((data) => {
  const [subscribedTo1, subscribedTo2] = data;
  const commonSubscriptions = subscribedTo1.subscribed_to.filter(
    (item1: { contract_address: string }) =>
      subscribedTo2.subscribed_to.some(
        (item2: { contract_address: string }) =>
          item2.contract_address === item1.contract_address
      )
  );
  console.log(commonSubscriptions);
});
```

Here, we use the filter function on the data that we just fetched and match the channel's contract address since that will be unique for every channel.

Now, we can test the script by running it.

![](https://files.readme.io/304285a-image.png)

The two FIDs we used were subscribed to Terminally Onchain, so that shows up.

If you want to look at the complete script, you can look at this [GitHub Gist](https://gist.github.com/avneesh0612/f9fa2da025fa764c6dc65de5f3d5ecec). If you want to know more about the subscription APIs take a look [here](https://docs.neynar.com/reference/fetch-subscribers-for-fid).

Lastly, please share what you built with us on Farcaster by tagging [@neynar](https://warpcast.com/neynar), and if you have any questions, reach out to us on [warpcast](https://warpcast.com/~/channel/neynar) or [Telegram](https://t.me/rishdoteth)!

# Get Farcaster storage data > Storage units allocation

In the Farcaster protocol, a storage unit is a measure used to allocate and track the amount of data that a user (identified by their Farcaster ID or fid) can store within the network. This system is critical for managing the storage resources of the Farcaster network effectively and ensuring that the network remains scalable and efficient.

The specific allocation of storage per unit varies depending on the type of data being stored.

Here's the list of storage allocations per unit:

- 5000 cast messages
- 2500 reaction messages
- 2500 link messages
- 50 user_data messages
- 25 verifications messages
- 5 username_proof messages

The Storage Registry contract controls and tracks the allocation. This contract records the storage allocated to each fid, denominated in integer units.

If a user exceeds their storage allocation, Farcaster Hub prunes their old messages. Users can buy more storage units by sending a transaction to the Storage Registry contract or using an app like [caststorage.com](https://caststorage.com/).

This guide demonstrates how to use the Neynar SDK to retrieve a Farcaster user's storage usage and allocation.

Check out this [Getting Started guide](doc:getting-started-with-neynar) to learn how to set up your environment and get an API key.

First, initialize the client:

```javascript
// npm i @neynar/nodejs-sdk
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
```

Then, fetch the storage usage and allocation:

```javascript
const rishFID = 194;
const storageUsage = await client.lookupUserStorageUsage(rishFID);

console.log(storageUsage);
```

Example output:

```
{
  object: "storage_usage",
  user: {
    object: "user_dehydrated",
    fid: 194
  },
  total_active_units: 2,
  casts: {
    object: "storage",
    used: 3707,
    capacity: 10000
  },
  reactions: {
    object: "storage",
    used: 4984,
    capacity: 5000
  },
  links: {
    object: "storage",
    used: 472,
    capacity: 5000
  },
  verifications: {
    used: 2,
    capacity: 25
  },
  username_proofs: {
    used: 1,
    capacity: 5
  },
  signers: {
    used: 17,
    capacity: 1000
  }
}
```

To fetch the storage allocation of a user, use the `lookupUserStorageAllocation` function:

```javascript
const storageAllocation = await client.lookupUserStorageAllocations(rishFID);
console.log(storageAllocation);
```

Example output:

```
{
  total_active_units: 2,
  allocations: [
    {
      object: "storage_allocation",
      user: [Object ...],
      units: 2,
      expiry: "2024-08-28T22:23:31.000Z",
      timestamp: "2023-08-29T22:23:31.000Z"
    }
  ]
}
```

That's it! You can now look at the storage usage and allocation of any Farcaster user.

## Libraries and SDKs

- [@neynar/nodejs-sdk](https://github.com/neynarxyz/nodejs-sdk) by Neynar (official library)
- [@neynar/react-native-signin](https://github.com/neynarxyz/siwn/tree/main/react-native-sign-in-with-neynar) by Neynar (official library)

## Open source clients and bots using Neynar Hubs and APIs

> ## APIs and hosted hubs
>
> For all the above, you can use APIs and hosted hubs from Neynar
>
> - [Neynar APIs](https://docs.neynar.com/reference/neynar-farcaster-api-overview) for reading and writing Farcaster data (profiles, casts, feed, etc.)
