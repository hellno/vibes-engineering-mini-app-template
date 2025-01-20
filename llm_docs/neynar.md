Farcaster is a protocol for building decentralized social apps. Neynar makes it easy to build on Farcaster.

## Fetch Farcaster data using Neynar SDK   [Skip link to Fetch Farcaster data using Neynar SDK](https://docs.neynar.com/reference/quickstart\#fetch-farcaster-data-using-neynar-sdk)

### Fetching feed   [Skip link to Fetching feed](https://docs.neynar.com/reference/quickstart\#fetching-feed)

To fetch the feed for a user, you need to know who the user is following and then fetch casts from those users. Neynar abstracts away all this complexity. Simply put in the `fid` of the user in the `fetchFeed` function and get a feed in response.

In this example, we will fetch the feed for [Dan Romero](https://warpcast.com/dwr.eth) . This is the feed Dan would see if he were to log into a client that showed a feed from people he followed in a reverse chronological order.

TypeScript

```rdmd-code lang-typescript theme-light

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

TypeScript

```rdmd-code lang-typescript theme-light

yarn start

```

Depending on your machine, typescript might take a few seconds to compile. Once done, it should print the output to your console. Something like below:

TypeScript

```rdmd-code lang-typescript theme-light

User Feed: {
  "casts": [\
    {\
      "object": "cast",\
      "hash": "0xd9993ef80c1a7f75c6f75de3b79bc8a18de89a30",\
      "author": {\
        "object": "user",\
        "fid": 1265,\
        "username": "akhil-bvs",\
        "display_name": "Akhil",\
        "pfp_url": "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/6f618f59-2290-4350-100a-4b5d10abef00/original",\
        "custody_address": "0xdf055eb92e2c97d7da4036278d145458eb11811c",\
        "profile": {\
          "bio": {\
            "text": "product @cooprecs | player /fbi"\
          }\
        },\
        "follower_count": 1919,\
        "following_count": 252,\
        "verifications": [\
          "0xab14023979a34b4abb17abd099a1de1dc452011a"\
        ],\
        "verified_addresses": {\
          "eth_addresses": [\
            "0xab14023979a34b4abb17abd099a1de1dc452011a"\
          ],\
          "sol_addresses": []\
        },\
        "verified_accounts": null,\
        "power_badge": true,\
        "viewer_context": {\
          "following": true,\
          "followed_by": true,\
          "blocking": false,\
          "blocked_by": false\
        }\
      },\
      "thread_hash": "0xd9993ef80c1a7f75c6f75de3b79bc8a18de89a30",\
      "parent_hash": null,\
      "parent_url": null,\
      "root_parent_url": null,\
      "parent_author": {\
        "fid": null\
      },\
      "text": "👀",\
      "timestamp": "2024-11-22T17:39:21.000Z",\
      "embeds": [\
        {\
          "cast_id": {\
            "fid": 880094,\
            "hash": "0x82e6e0e20539578dcb7e03addb94f3a7f7491c49"\
          },\
          "cast": {\
            "object": "cast_embedded",\
            "hash": "0x82e6e0e20539578dcb7e03addb94f3a7f7491c49",\
            "author": {\
              "object": "user_dehydrated",\
              "fid": 880094,\
              "username": "anoncast",\
              "display_name": "anoncast",\
              "pfp_url": "https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/2c3250ee-e91d-4e8d-76b1-42d1c6ebef00/rectcrop3"\
            },\
            "thread_hash": "0x82e6e0e20539578dcb7e03addb94f3a7f7491c49",\
            "parent_hash": null,\
            "parent_url": null,\
            "root_parent_url": null,\
            "parent_author": {\
              "fid": null\
            },\
            "text": "one day this account will be used by a whistleblower to release classified documents about government fuckery. this account will break the internet and be impossible for anyone to ignore.",\
            "timestamp": "2024-11-22T16:35:36.000Z",\
            "embeds": [],\
            "channel": null\
          }\
        }\
      ],\
      "channel": null,\
      "reactions": {\
        "likes_count": 0,\
        "recasts_count": 0,\
        "likes": [],\
        "recasts": []\
      },\
      "replies": {\
        "count": 0\
      },\
      "mentioned_profiles": [],\
      "viewer_context": {\
        "liked": false,\
        "recasted": false\
      }\
    }\
  ],
  "next": {
    "cursor": "eyJ0aW1lc3RhbXAiOiIyMDI0LTExLTIyIDE3OjM5OjIxLjAwMDAwMDAifQ%3D%3D"
  }
}

```

You've successfully fetched the feed for a user in a simple function call!

_Future reading: you can fetch many different kind of feeds. See [Feed](https://docs.neynar.com/reference/feed-operations) APIs._

### Fetching user profile data   [Skip link to Fetching user profile data](https://docs.neynar.com/reference/quickstart\#fetching-user-profile-data)

Now let's fetch data about a user. Remember users are represented by FIDs? We will take an FID and fetch data for that user. Here's how to do it using the SDK:

JavaScript

```rdmd-code lang-javascript theme-light

import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";
import { FeedType } from "@neynar/nodejs-sdk/build/api";

const config = new Configuration({
  apiKey:process.env.NEYNAR_API_KEY,
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

TypeScript

```rdmd-code lang-typescript theme-light

yarn start

```

It should show you a response like below:

TypeScript

```rdmd-code lang-typescript theme-light

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
      "verifications": [\
        "0xd7029bdea1c17493893aafe29aad69ef892b8ff2"\
      ],
      "verified_addresses": {
        "eth_addresses": [\
          "0xd7029bdea1c17493893aafe29aad69ef892b8ff2"\
        ],
        "sol_addresses": []
      },
      "verified_accounts": [\
        {\
          "platform": "x",\
          "username": "dwr"\
        }\
      ],
      "power_badge": true
    }

```


### Fetch Trending Feed

Trending feeds
get
https://api.neynar.com/v2/farcaster/feed/trending
Fetch trending casts or on the global feed or channels feeds. 7d time window available for channel feeds only.

Query Params
limit
integer
1 to 10
Defaults to 10
Number of results to fetch

10
cursor
string
Pagination cursor

viewer_fid
int32
Providing this will return a feed that respects this user's mutes and blocks and includes viewer_context.

time_window
string
Defaults to 24h
Time window for trending casts (7d window for channel feeds only)


24h
channel_id
string
Channel ID to filter trending casts. Less active channels might have no casts in the time window selected.

provider
string
Defaults to neynar
The provider of the trending casts feed.


provider_metadata
string
provider_metadata is a URI-encoded stringified JSON object that can be used to pass additional metadata to the provider. Only available for mbd provider right now. See here on how to use.

const url = 'https://api.neynar.com/v2/farcaster/feed/trending?limit=10&time_window=24h&provider=neynar';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-api-key': 'NEYNAR_API_DOCS'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));


  {
  "casts": [
    {
      "hash": "string",
      "parent_hash": "string",
      "parent_url": "string",
      "root_parent_url": "string",
      "parent_author": {
        "fid": 0
      },
      "author": {
        "object": "user",
        "fid": 3,
        "username": "string",
        "display_name": "string",
        "custody_address": "string",
        "pfp_url": "string",
        "profile": {
          "bio": {
            "text": "string",
            "mentioned_profiles": [
              "string"
            ]
          },
          "location": {
            "latitude": 0,
            "longitude": 0,
            "address": {
              "city": "string",
              "state": "string",
              "state_code": "string",
              "country": "string",
              "country_code": "string"
            }
          }
        },
        "follower_count": 0,
        "following_count": 0,
        "verifications": [
          "string"
        ],
        "verified_addresses": {
          "eth_addresses": [
            "string"
          ],
          "sol_addresses": [
            "string"
          ]
        },
        "verified_accounts": [
          {
            "platform": "x",
            "username": "string"
          }
        ],
        "power_badge": true,
        "experimental": {
          "neynar_user_score": 0
        },
        "viewer_context": {
          "following": true,
          "followed_by": true,
          "blocking": true,
          "blocked_by": true
        }
      },
      "text": "string",
      "timestamp": "2025-01-20T17:04:06.342Z",
      "embeds": [
        {
          "url": "string",
          "metadata": {
            "_status": "string",
            "content_type": "string",
            "content_length": 0,
            "image": {
              "height_px": 0,
              "width_px": 0
            },
            "video": {
              "duration_s": 0,
              "stream": [
                {
                  "codec_name": "string",
                  "height_px": 0,
                  "width_px": 0
                }
              ]
            },
            "html": {
              "favicon": "string",
              "modifiedTime": "string",
              "ogArticleAuthor": "string",
              "ogArticleExpirationTime": "string",
              "ogArticleModifiedTime": "string",
              "ogArticlePublishedTime": "string",
              "ogArticlePublisher": "string",
              "ogArticleSection": "string",
              "ogArticleTag": "string",
              "ogAudio": "string",
              "ogAudioSecureURL": "string",
              "ogAudioType": "string",
              "ogAudioURL": "string",
              "ogAvailability": "string",
              "ogDate": "string",
              "ogDescription": "string",
              "ogDeterminer": "string",
              "ogEpisode": "string",
              "ogImage": [
                {
                  "height": "string",
                  "type": "string",
                  "url": "string",
                  "width": "string",
                  "alt": "string"
                }
              ],
              "ogLocale": "string",
              "ogLocaleAlternate": "string",
              "ogLogo": "string",
              "ogMovie": "string",
              "ogPriceAmount": "string",
              "ogPriceCurrency": "string",
              "ogProductAvailability": "string",
              "ogProductCondition": "string",
              "ogProductPriceAmount": "string",
              "ogProductPriceCurrency": "string",
              "ogProductRetailerItemId": "string",
              "ogSiteName": "string",
              "ogTitle": "string",
              "ogType": "string",
              "ogUrl": "string",
              "ogVideo": [
                {
                  "height": "string",
                  "type": "string",
                  "url": "string",
                  "width": "string"
                }
              ],
              "ogVideoActor": "string",
              "ogVideoActorId": "string",
              "ogVideoActorRole": "string",
              "ogVideoDirector": "string",
              "ogVideoDuration": "string",
              "ogVideoOther": "string",
              "ogVideoReleaseDate": "string",
              "ogVideoSecureURL": "string",
              "ogVideoSeries": "string",
              "ogVideoTag": "string",
              "ogVideoTvShow": "string",
              "ogVideoWriter": "string",
              "ogWebsite": "string",
              "updatedTime": "string",
              "oembed": {
                "type": "rich",
                "version": "string",
                "title": "string",
                "author_name": "string",
                "author_url": "string",
                "provider_name": "string",
                "provider_url": "string",
                "cache_age": "string",
                "thumbnail_url": "string",
                "thumbnail_width": 0,
                "thumbnail_height": 0,
                "html": "string",
                "width": 0,
                "height": 0
              }
            }
          }
        },
        {
          "cast": {
            "hash": "string",
            "parent_hash": "string",
            "parent_url": "string",
            "root_parent_url": "string",
            "parent_author": {
              "fid": 0
            },
            "author": {
              "object": "user_dehydrated",
              "fid": 3,
              "username": "string",
              "display_name": "string",
              "pfp_url": "string"
            },
            "text": "string",
            "timestamp": "2025-01-20T17:04:06.342Z",
            "type": "cast-mention",
            "embeds": [
              {
                "url": "string",
                "metadata": {
                  "_status": "string",
                  "content_type": "string",
                  "content_length": 0,
                  "image": {
                    "height_px": 0,
                    "width_px": 0
                  },
                  "video": {
                    "duration_s": 0,
                    "stream": [
                      {
                        "codec_name": "string",
                        "height_px": 0,
                        "width_px": 0
                      }
                    ]
                  },
                  "html": {
                    "favicon": "string",
                    "modifiedTime": "string",
                    "ogArticleAuthor": "string",
                    "ogArticleExpirationTime": "string",
                    "ogArticleModifiedTime": "string",
                    "ogArticlePublishedTime": "string",
                    "ogArticlePublisher": "string",
                    "ogArticleSection": "string",
                    "ogArticleTag": "string",
                    "ogAudio": "string",
                    "ogAudioSecureURL": "string",
                    "ogAudioType": "string",
                    "ogAudioURL": "string",
                    "ogAvailability": "string",
                    "ogDate": "string",
                    "ogDescription": "string",
                    "ogDeterminer": "string",
                    "ogEpisode": "string",
                    "ogImage": [
                      {
                        "height": "string",
                        "type": "string",
                        "url": "string",
                        "width": "string",
                        "alt": "string"
                      }
                    ],
                    "ogLocale": "string",
                    "ogLocaleAlternate": "string",
                    "ogLogo": "string",
                    "ogMovie": "string",
                    "ogPriceAmount": "string",
                    "ogPriceCurrency": "string",
                    "ogProductAvailability": "string",
                    "ogProductCondition": "string",
                    "ogProductPriceAmount": "string",
                    "ogProductPriceCurrency": "string",
                    "ogProductRetailerItemId": "string",
                    "ogSiteName": "string",
                    "ogTitle": "string",
                    "ogType": "string",
                    "ogUrl": "string",
                    "ogVideo": [
                      {
                        "height": "string",
                        "type": "string",
                        "url": "string",
                        "width": "string"
                      }
                    ],
                    "ogVideoActor": "string",
                    "ogVideoActorId": "string",
                    "ogVideoActorRole": "string",
                    "ogVideoDirector": "string",
                    "ogVideoDuration": "string",
                    "ogVideoOther": "string",
                    "ogVideoReleaseDate": "string",
                    "ogVideoSecureURL": "string",
                    "ogVideoSeries": "string",
                    "ogVideoTag": "string",
                    "ogVideoTvShow": "string",
                    "ogVideoWriter": "string",
                    "ogWebsite": "string",
                    "updatedTime": "string",
                    "oembed": {
                      "type": "rich",
                      "version": "string",
                      "title": "string",
                      "author_name": "string",
                      "author_url": "string",
                      "provider_name": "string",
                      "provider_url": "string",
                      "cache_age": "string",
                      "thumbnail_url": "string",
                      "thumbnail_width": 0,
                      "thumbnail_height": 0,
                      "html": "string",
                      "width": 0,
                      "height": 0
                    }
                  }
                }
              },
              {
                "cast": {
                  "object": "cast_dehydrated",
                  "hash": "string",
                  "author": {
                    "object": "user_dehydrated",
                    "fid": 3,
                    "username": "string",
                    "display_name": "string",
                    "pfp_url": "string"
                  }
                }
              }
            ],
            "channel": {
              "id": "string",
              "name": "string",
              "object": "channel_dehydrated",
              "image_url": "string",
              "viewer_context": {
                "following": true,
                "role": "member"
              }
            }
          }
        }
      ],
      "type": "cast-mention",
      "frames": [
        {
          "version": "string",
          "image": "string",
          "buttons": [
            {
              "title": "string",
              "index": 0,
              "action_type": "post",
              "target": "string",
              "post_url": "string"
            }
          ],
          "post_url": "string",
          "frames_url": "string",
          "title": "string",
          "image_aspect_ratio": "string",
          "input": {
            "text": "string"
          },
          "state": {
            "serialized": "string"
          }
        }
      ],
      "reactions": {
        "likes": [
          {
            "fid": 3
          }
        ],
        "recasts": [
          {
            "fid": 3,
            "fname": "string"
          }
        ],
        "likes_count": 0,
        "recasts_count": 0
      },
      "replies": {
        "count": 0
      },
      "thread_hash": "string",
      "mentioned_profiles": [
        {
          "object": "user",
          "fid": 3,
          "username": "string",
          "display_name": "string",
          "custody_address": "string",
          "pfp_url": "string",
          "profile": {
            "bio": {
              "text": "string",
              "mentioned_profiles": [
                "string"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {
                "city": "string",
                "state": "string",
                "state_code": "string",
                "country": "string",
                "country_code": "string"
              }
            }
          },
          "follower_count": 0,
          "following_count": 0,
          "verifications": [
            "string"
          ],
          "verified_addresses": {
            "eth_addresses": [
              "string"
            ],
            "sol_addresses": [
              "string"
            ]
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "string"
            }
          ],
          "power_badge": true,
          "experimental": {
            "neynar_user_score": 0
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          }
        }
      ],
      "channel": {
        "id": "string",
        "url": "string",
        "name": "string",
        "description": "string",
        "object": "channel",
        "created_at": 0,
        "follower_count": 0,
        "external_link": {
          "title": "string",
          "url": "string"
        },
        "image_url": "string",
        "parent_url": "string",
        "lead": {
          "object": "user",
          "fid": 3,
          "username": "string",
          "display_name": "string",
          "custody_address": "string",
          "pfp_url": "string",
          "profile": {
            "bio": {
              "text": "string",
              "mentioned_profiles": [
                "string"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {
                "city": "string",
                "state": "string",
                "state_code": "string",
                "country": "string",
                "country_code": "string"
              }
            }
          },
          "follower_count": 0,
          "following_count": 0,
          "verifications": [
            "string"
          ],
          "verified_addresses": {
            "eth_addresses": [
              "string"
            ],
            "sol_addresses": [
              "string"
            ]
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "string"
            }
          ],
          "power_badge": true,
          "experimental": {
            "neynar_user_score": 0
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          }
        },
        "moderator_fids": [
          0
        ],
        "member_count": 0,
        "pinned_cast_hash": "0xfe90f9de682273e05b201629ad2338bdcd89b6be",
        "viewer_context": {
          "following": true,
          "role": "member"
        }
      },
      "viewer_context": {
        "liked": true,
        "recasted": true
      },
      "author_channel_context": {
        "following": true,
        "role": "member"
      }
    }
  ],
  "next": {
    "cursor": "string"
  }
}

## Fetch Feed By channel IDs
get
https://api.neynar.com/v2/farcaster/feed/channels
Fetch feed based on channel IDs

Query Params
channel_ids
string
required
Comma separated list of channel IDs e.g. neynar,farcaster

with_recasts
boolean
Defaults to true
Include recasts in the response, true by default


true
viewer_fid
int32
Providing this will return a feed that respects this user's mutes and blocks and includes viewer_context.

with_replies
boolean
Defaults to false
Include replies in the response, false by default


false
members_only
boolean
Defaults to true
Only include casts from members of the channel. True by default.


true
fids
string
Comma separated list of FIDs to filter the feed by, up to 10 at a time

limit
integer
1 to 100
Defaults to 25
Number of results to fetch

25
cursor
string
Pagination cursor.

const url = 'https://api.neynar.com/v2/farcaster/feed/channels?with_recasts=true&with_replies=false&members_only=true&limit=25&should_moderate=false';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-api-key': 'NEYNAR_API_DOCS'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));


  {
  "casts": [
    {
      "hash": "string",
      "parent_hash": "string",
      "parent_url": "string",
      "root_parent_url": "string",
      "parent_author": {
        "fid": 0
      },
      "author": {
        "object": "user",
        "fid": 3,
        "username": "string",
        "display_name": "string",
        "custody_address": "string",
        "pfp_url": "string",
        "profile": {
          "bio": {
            "text": "string",
            "mentioned_profiles": [
              "string"
            ]
          },
          "location": {
            "latitude": 0,
            "longitude": 0,
            "address": {
              "city": "string",
              "state": "string",
              "state_code": "string",
              "country": "string",
              "country_code": "string"
            }
          }
        },
        "follower_count": 0,
        "following_count": 0,
        "verifications": [
          "string"
        ],
        "verified_addresses": {
          "eth_addresses": [
            "string"
          ],
          "sol_addresses": [
            "string"
          ]
        },
        "verified_accounts": [
          {
            "platform": "x",
            "username": "string"
          }
        ],
        "power_badge": true,
        "experimental": {
          "neynar_user_score": 0
        },
        "viewer_context": {
          "following": true,
          "followed_by": true,
          "blocking": true,
          "blocked_by": true
        }
      },
      "text": "string",
      "timestamp": "2025-01-20T17:04:06.342Z",
      "embeds": [
        {
          "url": "string",
          "metadata": {
            "_status": "string",
            "content_type": "string",
            "content_length": 0,
            "image": {
              "height_px": 0,
              "width_px": 0
            },
            "video": {
              "duration_s": 0,
              "stream": [
                {
                  "codec_name": "string",
                  "height_px": 0,
                  "width_px": 0
                }
              ]
            },
            "html": {
              "favicon": "string",
              "modifiedTime": "string",
              "ogArticleAuthor": "string",
              "ogArticleExpirationTime": "string",
              "ogArticleModifiedTime": "string",
              "ogArticlePublishedTime": "string",
              "ogArticlePublisher": "string",
              "ogArticleSection": "string",
              "ogArticleTag": "string",
              "ogAudio": "string",
              "ogAudioSecureURL": "string",
              "ogAudioType": "string",
              "ogAudioURL": "string",
              "ogAvailability": "string",
              "ogDate": "string",
              "ogDescription": "string",
              "ogDeterminer": "string",
              "ogEpisode": "string",
              "ogImage": [
                {
                  "height": "string",
                  "type": "string",
                  "url": "string",
                  "width": "string",
                  "alt": "string"
                }
              ],
              "ogLocale": "string",
              "ogLocaleAlternate": "string",
              "ogLogo": "string",
              "ogMovie": "string",
              "ogPriceAmount": "string",
              "ogPriceCurrency": "string",
              "ogProductAvailability": "string",
              "ogProductCondition": "string",
              "ogProductPriceAmount": "string",
              "ogProductPriceCurrency": "string",
              "ogProductRetailerItemId": "string",
              "ogSiteName": "string",
              "ogTitle": "string",
              "ogType": "string",
              "ogUrl": "string",
              "ogVideo": [
                {
                  "height": "string",
                  "type": "string",
                  "url": "string",
                  "width": "string"
                }
              ],
              "ogVideoActor": "string",
              "ogVideoActorId": "string",
              "ogVideoActorRole": "string",
              "ogVideoDirector": "string",
              "ogVideoDuration": "string",
              "ogVideoOther": "string",
              "ogVideoReleaseDate": "string",
              "ogVideoSecureURL": "string",
              "ogVideoSeries": "string",
              "ogVideoTag": "string",
              "ogVideoTvShow": "string",
              "ogVideoWriter": "string",
              "ogWebsite": "string",
              "updatedTime": "string",
              "oembed": {
                "type": "rich",
                "version": "string",
                "title": "string",
                "author_name": "string",
                "author_url": "string",
                "provider_name": "string",
                "provider_url": "string",
                "cache_age": "string",
                "thumbnail_url": "string",
                "thumbnail_width": 0,
                "thumbnail_height": 0,
                "html": "string",
                "width": 0,
                "height": 0
              }
            }
          }
        },
        {
          "cast": {
            "hash": "string",
            "parent_hash": "string",
            "parent_url": "string",
            "root_parent_url": "string",
            "parent_author": {
              "fid": 0
            },
            "author": {
              "object": "user_dehydrated",
              "fid": 3,
              "username": "string",
              "display_name": "string",
              "pfp_url": "string"
            },
            "text": "string",
            "timestamp": "2025-01-20T17:04:06.342Z",
            "type": "cast-mention",
            "embeds": [
              {
                "url": "string",
                "metadata": {
                  "_status": "string",
                  "content_type": "string",
                  "content_length": 0,
                  "image": {
                    "height_px": 0,
                    "width_px": 0
                  },
                  "video": {
                    "duration_s": 0,
                    "stream": [
                      {
                        "codec_name": "string",
                        "height_px": 0,
                        "width_px": 0
                      }
                    ]
                  },
                  "html": {
                    "favicon": "string",
                    "modifiedTime": "string",
                    "ogArticleAuthor": "string",
                    "ogArticleExpirationTime": "string",
                    "ogArticleModifiedTime": "string",
                    "ogArticlePublishedTime": "string",
                    "ogArticlePublisher": "string",
                    "ogArticleSection": "string",
                    "ogArticleTag": "string",
                    "ogAudio": "string",
                    "ogAudioSecureURL": "string",
                    "ogAudioType": "string",
                    "ogAudioURL": "string",
                    "ogAvailability": "string",
                    "ogDate": "string",
                    "ogDescription": "string",
                    "ogDeterminer": "string",
                    "ogEpisode": "string",
                    "ogImage": [
                      {
                        "height": "string",
                        "type": "string",
                        "url": "string",
                        "width": "string",
                        "alt": "string"
                      }
                    ],
                    "ogLocale": "string",
                    "ogLocaleAlternate": "string",
                    "ogLogo": "string",
                    "ogMovie": "string",
                    "ogPriceAmount": "string",
                    "ogPriceCurrency": "string",
                    "ogProductAvailability": "string",
                    "ogProductCondition": "string",
                    "ogProductPriceAmount": "string",
                    "ogProductPriceCurrency": "string",
                    "ogProductRetailerItemId": "string",
                    "ogSiteName": "string",
                    "ogTitle": "string",
                    "ogType": "string",
                    "ogUrl": "string",
                    "ogVideo": [
                      {
                        "height": "string",
                        "type": "string",
                        "url": "string",
                        "width": "string"
                      }
                    ],
                    "ogVideoActor": "string",
                    "ogVideoActorId": "string",
                    "ogVideoActorRole": "string",
                    "ogVideoDirector": "string",
                    "ogVideoDuration": "string",
                    "ogVideoOther": "string",
                    "ogVideoReleaseDate": "string",
                    "ogVideoSecureURL": "string",
                    "ogVideoSeries": "string",
                    "ogVideoTag": "string",
                    "ogVideoTvShow": "string",
                    "ogVideoWriter": "string",
                    "ogWebsite": "string",
                    "updatedTime": "string",
                    "oembed": {
                      "type": "rich",
                      "version": "string",
                      "title": "string",
                      "author_name": "string",
                      "author_url": "string",
                      "provider_name": "string",
                      "provider_url": "string",
                      "cache_age": "string",
                      "thumbnail_url": "string",
                      "thumbnail_width": 0,
                      "thumbnail_height": 0,
                      "html": "string",
                      "width": 0,
                      "height": 0
                    }
                  }
                }
              },
              {
                "cast": {
                  "object": "cast_dehydrated",
                  "hash": "string",
                  "author": {
                    "object": "user_dehydrated",
                    "fid": 3,
                    "username": "string",
                    "display_name": "string",
                    "pfp_url": "string"
                  }
                }
              }
            ],
            "channel": {
              "id": "string",
              "name": "string",
              "object": "channel_dehydrated",
              "image_url": "string",
              "viewer_context": {
                "following": true,
                "role": "member"
              }
            }
          }
        }
      ],
      "type": "cast-mention",
      "frames": [
        {
          "version": "string",
          "image": "string",
          "buttons": [
            {
              "title": "string",
              "index": 0,
              "action_type": "post",
              "target": "string",
              "post_url": "string"
            }
          ],
          "post_url": "string",
          "frames_url": "string",
          "title": "string",
          "image_aspect_ratio": "string",
          "input": {
            "text": "string"
          },
          "state": {
            "serialized": "string"
          }
        }
      ],
      "reactions": {
        "likes": [
          {
            "fid": 3
          }
        ],
        "recasts": [
          {
            "fid": 3,
            "fname": "string"
          }
        ],
        "likes_count": 0,
        "recasts_count": 0
      },
      "replies": {
        "count": 0
      },
      "thread_hash": "string",
      "mentioned_profiles": [
        {
          "object": "user",
          "fid": 3,
          "username": "string",
          "display_name": "string",
          "custody_address": "string",
          "pfp_url": "string",
          "profile": {
            "bio": {
              "text": "string",
              "mentioned_profiles": [
                "string"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {
                "city": "string",
                "state": "string",
                "state_code": "string",
                "country": "string",
                "country_code": "string"
              }
            }
          },
          "follower_count": 0,
          "following_count": 0,
          "verifications": [
            "string"
          ],
          "verified_addresses": {
            "eth_addresses": [
              "string"
            ],
            "sol_addresses": [
              "string"
            ]
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "string"
            }
          ],
          "power_badge": true,
          "experimental": {
            "neynar_user_score": 0
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          }
        }
      ],
      "channel": {
        "id": "string",
        "url": "string",
        "name": "string",
        "description": "string",
        "object": "channel",
        "created_at": 0,
        "follower_count": 0,
        "external_link": {
          "title": "string",
          "url": "string"
        },
        "image_url": "string",
        "parent_url": "string",
        "lead": {
          "object": "user",
          "fid": 3,
          "username": "string",
          "display_name": "string",
          "custody_address": "string",
          "pfp_url": "string",
          "profile": {
            "bio": {
              "text": "string",
              "mentioned_profiles": [
                "string"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {
                "city": "string",
                "state": "string",
                "state_code": "string",
                "country": "string",
                "country_code": "string"
              }
            }
          },
          "follower_count": 0,
          "following_count": 0,
          "verifications": [
            "string"
          ],
          "verified_addresses": {
            "eth_addresses": [
              "string"
            ],
            "sol_addresses": [
              "string"
            ]
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "string"
            }
          ],
          "power_badge": true,
          "experimental": {
            "neynar_user_score": 0
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          }
        },
        "moderator_fids": [
          0
        ],
        "member_count": 0,
        "pinned_cast_hash": "0xfe90f9de682273e05b201629ad2338bdcd89b6be",
        "viewer_context": {
          "following": true,
          "role": "member"
        }
      },
      "viewer_context": {
        "liked": true,
        "recasted": true
      },
      "author_channel_context": {
        "following": true,
        "role": "member"
      }
    }
  ],
  "next": {
    "cursor": "string"
  }
}


## Get Feed by Filters

By filters
get
https://api.neynar.com/v2/farcaster/feed
Fetch casts based on filters. Ensure setting the correct parameters based on the feed_type and filter_type.

Query Params
feed_type
string
required
Defaults to following (requires FID or address). If set to filter (requires filter_type)


following
filter_type
string
Used when feed_type=filter. Can be set to FIDs (requires FIDs) or parent_url (requires parent_url) or channel_id (requires channel_id)


fids
fid
int32
(Optional) FID of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type

fids
string
Used when filter_type=FIDs . Create a feed based on a list of FIDs. Max array size is 100. Requires feed_type and filter_type.

parent_url
string
Used when filter_type=parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type

channel_id
string
Used when filter_type=channel_id can be used to fetch casts under a channel. Requires feed_type and filter_type.

members_only
boolean
Defaults to true
Used when filter_type=channel_id. Only include casts from members of the channel. True by default.


true
embed_url
string
Used when filter_type=embed_url can be used to fetch all casts with an embed url that contains embed_url. Requires feed_type and filter_type

embed_types
array of strings
Used when filter_type=embed_types can be used to fetch all casts with matching content types. Requires feed_type and filter_type


ADD string
with_recasts
boolean
Defaults to true
Include recasts in the response, true by default


true
limit
integer
1 to 100
Defaults to 25
Number of results to fetch

25
cursor
string
Pagination cursor.

viewer_fid
int32
Providing this will return a feed that respects this user's mutes and blocks and includes viewer_context.

const url = 'https://api.neynar.com/v2/farcaster/feed?feed_type=following&members_only=true&with_recasts=true&limit=25';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-api-key': 'NEYNAR_API_DOCS'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));


  {
  "casts": [
    {
      "hash": "string",
      "parent_hash": "string",
      "parent_url": "string",
      "root_parent_url": "string",
      "parent_author": {
        "fid": 0
      },
      "author": {
        "object": "user",
        "fid": 3,
        "username": "string",
        "display_name": "string",
        "custody_address": "string",
        "pfp_url": "string",
        "profile": {
          "bio": {
            "text": "string",
            "mentioned_profiles": [
              "string"
            ]
          },
          "location": {
            "latitude": 0,
            "longitude": 0,
            "address": {
              "city": "string",
              "state": "string",
              "state_code": "string",
              "country": "string",
              "country_code": "string"
            }
          }
        },
        "follower_count": 0,
        "following_count": 0,
        "verifications": [
          "string"
        ],
        "verified_addresses": {
          "eth_addresses": [
            "string"
          ],
          "sol_addresses": [
            "string"
          ]
        },
        "verified_accounts": [
          {
            "platform": "x",
            "username": "string"
          }
        ],
        "power_badge": true,
        "experimental": {
          "neynar_user_score": 0
        },
        "viewer_context": {
          "following": true,
          "followed_by": true,
          "blocking": true,
          "blocked_by": true
        }
      },
      "text": "string",
      "timestamp": "2025-01-20T17:04:06.342Z",
      "embeds": [
        {
          "url": "string",
          "metadata": {
            "_status": "string",
            "content_type": "string",
            "content_length": 0,
            "image": {
              "height_px": 0,
              "width_px": 0
            },
            "video": {
              "duration_s": 0,
              "stream": [
                {
                  "codec_name": "string",
                  "height_px": 0,
                  "width_px": 0
                }
              ]
            },
            "html": {
              "favicon": "string",
              "modifiedTime": "string",
              "ogArticleAuthor": "string",
              "ogArticleExpirationTime": "string",
              "ogArticleModifiedTime": "string",
              "ogArticlePublishedTime": "string",
              "ogArticlePublisher": "string",
              "ogArticleSection": "string",
              "ogArticleTag": "string",
              "ogAudio": "string",
              "ogAudioSecureURL": "string",
              "ogAudioType": "string",
              "ogAudioURL": "string",
              "ogAvailability": "string",
              "ogDate": "string",
              "ogDescription": "string",
              "ogDeterminer": "string",
              "ogEpisode": "string",
              "ogImage": [
                {
                  "height": "string",
                  "type": "string",
                  "url": "string",
                  "width": "string",
                  "alt": "string"
                }
              ],
              "ogLocale": "string",
              "ogLocaleAlternate": "string",
              "ogLogo": "string",
              "ogMovie": "string",
              "ogPriceAmount": "string",
              "ogPriceCurrency": "string",
              "ogProductAvailability": "string",
              "ogProductCondition": "string",
              "ogProductPriceAmount": "string",
              "ogProductPriceCurrency": "string",
              "ogProductRetailerItemId": "string",
              "ogSiteName": "string",
              "ogTitle": "string",
              "ogType": "string",
              "ogUrl": "string",
              "ogVideo": [
                {
                  "height": "string",
                  "type": "string",
                  "url": "string",
                  "width": "string"
                }
              ],
              "ogVideoActor": "string",
              "ogVideoActorId": "string",
              "ogVideoActorRole": "string",
              "ogVideoDirector": "string",
              "ogVideoDuration": "string",
              "ogVideoOther": "string",
              "ogVideoReleaseDate": "string",
              "ogVideoSecureURL": "string",
              "ogVideoSeries": "string",
              "ogVideoTag": "string",
              "ogVideoTvShow": "string",
              "ogVideoWriter": "string",
              "ogWebsite": "string",
              "updatedTime": "string",
              "oembed": {
                "type": "rich",
                "version": "string",
                "title": "string",
                "author_name": "string",
                "author_url": "string",
                "provider_name": "string",
                "provider_url": "string",
                "cache_age": "string",
                "thumbnail_url": "string",
                "thumbnail_width": 0,
                "thumbnail_height": 0,
                "html": "string",
                "width": 0,
                "height": 0
              }
            }
          }
        },
        {
          "cast": {
            "hash": "string",
            "parent_hash": "string",
            "parent_url": "string",
            "root_parent_url": "string",
            "parent_author": {
              "fid": 0
            },
            "author": {
              "object": "user_dehydrated",
              "fid": 3,
              "username": "string",
              "display_name": "string",
              "pfp_url": "string"
            },
            "text": "string",
            "timestamp": "2025-01-20T17:04:06.342Z",
            "type": "cast-mention",
            "embeds": [
              {
                "url": "string",
                "metadata": {
                  "_status": "string",
                  "content_type": "string",
                  "content_length": 0,
                  "image": {
                    "height_px": 0,
                    "width_px": 0
                  },
                  "video": {
                    "duration_s": 0,
                    "stream": [
                      {
                        "codec_name": "string",
                        "height_px": 0,
                        "width_px": 0
                      }
                    ]
                  },
                  "html": {
                    "favicon": "string",
                    "modifiedTime": "string",
                    "ogArticleAuthor": "string",
                    "ogArticleExpirationTime": "string",
                    "ogArticleModifiedTime": "string",
                    "ogArticlePublishedTime": "string",
                    "ogArticlePublisher": "string",
                    "ogArticleSection": "string",
                    "ogArticleTag": "string",
                    "ogAudio": "string",
                    "ogAudioSecureURL": "string",
                    "ogAudioType": "string",
                    "ogAudioURL": "string",
                    "ogAvailability": "string",
                    "ogDate": "string",
                    "ogDescription": "string",
                    "ogDeterminer": "string",
                    "ogEpisode": "string",
                    "ogImage": [
                      {
                        "height": "string",
                        "type": "string",
                        "url": "string",
                        "width": "string",
                        "alt": "string"
                      }
                    ],
                    "ogLocale": "string",
                    "ogLocaleAlternate": "string",
                    "ogLogo": "string",
                    "ogMovie": "string",
                    "ogPriceAmount": "string",
                    "ogPriceCurrency": "string",
                    "ogProductAvailability": "string",
                    "ogProductCondition": "string",
                    "ogProductPriceAmount": "string",
                    "ogProductPriceCurrency": "string",
                    "ogProductRetailerItemId": "string",
                    "ogSiteName": "string",
                    "ogTitle": "string",
                    "ogType": "string",
                    "ogUrl": "string",
                    "ogVideo": [
                      {
                        "height": "string",
                        "type": "string",
                        "url": "string",
                        "width": "string"
                      }
                    ],
                    "ogVideoActor": "string",
                    "ogVideoActorId": "string",
                    "ogVideoActorRole": "string",
                    "ogVideoDirector": "string",
                    "ogVideoDuration": "string",
                    "ogVideoOther": "string",
                    "ogVideoReleaseDate": "string",
                    "ogVideoSecureURL": "string",
                    "ogVideoSeries": "string",
                    "ogVideoTag": "string",
                    "ogVideoTvShow": "string",
                    "ogVideoWriter": "string",
                    "ogWebsite": "string",
                    "updatedTime": "string",
                    "oembed": {
                      "type": "rich",
                      "version": "string",
                      "title": "string",
                      "author_name": "string",
                      "author_url": "string",
                      "provider_name": "string",
                      "provider_url": "string",
                      "cache_age": "string",
                      "thumbnail_url": "string",
                      "thumbnail_width": 0,
                      "thumbnail_height": 0,
                      "html": "string",
                      "width": 0,
                      "height": 0
                    }
                  }
                }
              },
              {
                "cast": {
                  "object": "cast_dehydrated",
                  "hash": "string",
                  "author": {
                    "object": "user_dehydrated",
                    "fid": 3,
                    "username": "string",
                    "display_name": "string",
                    "pfp_url": "string"
                  }
                }
              }
            ],
            "channel": {
              "id": "string",
              "name": "string",
              "object": "channel_dehydrated",
              "image_url": "string",
              "viewer_context": {
                "following": true,
                "role": "member"
              }
            }
          }
        }
      ],
      "type": "cast-mention",
      "frames": [
        {
          "version": "string",
          "image": "string",
          "buttons": [
            {
              "title": "string",
              "index": 0,
              "action_type": "post",
              "target": "string",
              "post_url": "string"
            }
          ],
          "post_url": "string",
          "frames_url": "string",
          "title": "string",
          "image_aspect_ratio": "string",
          "input": {
            "text": "string"
          },
          "state": {
            "serialized": "string"
          }
        }
      ],
      "reactions": {
        "likes": [
          {
            "fid": 3
          }
        ],
        "recasts": [
          {
            "fid": 3,
            "fname": "string"
          }
        ],
        "likes_count": 0,
        "recasts_count": 0
      },
      "replies": {
        "count": 0
      },
      "thread_hash": "string",
      "mentioned_profiles": [
        {
          "object": "user",
          "fid": 3,
          "username": "string",
          "display_name": "string",
          "custody_address": "string",
          "pfp_url": "string",
          "profile": {
            "bio": {
              "text": "string",
              "mentioned_profiles": [
                "string"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {
                "city": "string",
                "state": "string",
                "state_code": "string",
                "country": "string",
                "country_code": "string"
              }
            }
          },
          "follower_count": 0,
          "following_count": 0,
          "verifications": [
            "string"
          ],
          "verified_addresses": {
            "eth_addresses": [
              "string"
            ],
            "sol_addresses": [
              "string"
            ]
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "string"
            }
          ],
          "power_badge": true,
          "experimental": {
            "neynar_user_score": 0
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          }
        }
      ],
      "channel": {
        "id": "string",
        "url": "string",
        "name": "string",
        "description": "string",
        "object": "channel",
        "created_at": 0,
        "follower_count": 0,
        "external_link": {
          "title": "string",
          "url": "string"
        },
        "image_url": "string",
        "parent_url": "string",
        "lead": {
          "object": "user",
          "fid": 3,
          "username": "string",
          "display_name": "string",
          "custody_address": "string",
          "pfp_url": "string",
          "profile": {
            "bio": {
              "text": "string",
              "mentioned_profiles": [
                "string"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {
                "city": "string",
                "state": "string",
                "state_code": "string",
                "country": "string",
                "country_code": "string"
              }
            }
          },
          "follower_count": 0,
          "following_count": 0,
          "verifications": [
            "string"
          ],
          "verified_addresses": {
            "eth_addresses": [
              "string"
            ],
            "sol_addresses": [
              "string"
            ]
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "string"
            }
          ],
          "power_badge": true,
          "experimental": {
            "neynar_user_score": 0
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          }
        },
        "moderator_fids": [
          0
        ],
        "member_count": 0,
        "pinned_cast_hash": "0xfe90f9de682273e05b201629ad2338bdcd89b6be",
        "viewer_context": {
          "following": true,
          "role": "member"
        }
      },
      "viewer_context": {
        "liked": true,
        "recasted": true
      },
      "author_channel_context": {
        "following": true,
        "role": "member"
      }
    }
  ],
  "next": {
    "cursor": "string"
  }
}