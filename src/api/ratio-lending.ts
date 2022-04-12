export type StablePool = {
    "version": "0.1.0",
    "name": "stable_pool",
    "instructions": [
      {
        "name": "createGlobalState",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintUsdr",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "globalStateBump",
            "type": "u8"
          },
          {
            "name": "mintUsdrBump",
            "type": "u8"
          },
          {
            "name": "tvlLimit",
            "type": "u64"
          },
          {
            "name": "globalDebtCeiling",
            "type": "u64"
          },
          {
            "name": "userDebtCeiling",
            "type": "u64"
          },
          {
            "name": "oracleReporter",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "createPool",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintCollat",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "poolBump",
            "type": "u8"
          },
          {
            "name": "riskLevel",
            "type": "u8"
          },
          {
            "name": "debtCeiling",
            "type": "u64"
          },
          {
            "name": "platformType",
            "type": "u8"
          },
          {
            "name": "mintTokenA",
            "type": "publicKey"
          },
          {
            "name": "mintTokenB",
            "type": "publicKey"
          },
          {
            "name": "mintReward",
            "type": "publicKey"
          },
          {
            "name": "tokenADecimals",
            "type": "u8"
          },
          {
            "name": "tokenBDecimals",
            "type": "u8"
          }
        ]
      },
      {
        "name": "createUserState",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "userState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "ataCollatVaultBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "depositCollateral",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatMiner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataCollatUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintCollat",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawCollateral",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatMiner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataCollatUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "oracleA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintMktA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintMktB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintCollat",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "withdrawAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "borrowUsdr",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "oracleA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintColl",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintUsdr",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUsdr",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "borrowAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "repayUsdr",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintUsdr",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataUsdr",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "repayAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createOracle",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "price",
            "type": "u64"
          }
        ]
      },
      {
        "name": "reportPriceToOracle",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "price",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setGlobalTvlLimit",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "limit",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setGlobalDebtCeiling",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "ceiling",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setUserDebtCeiling",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "ceiling",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setPoolDebtCeiling",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "ceiling",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setHarvestFee",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "feeNum",
            "type": "u64"
          }
        ]
      },
      {
        "name": "toggleEmerState",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newState",
            "type": "u8"
          }
        ]
      },
      {
        "name": "changeTreasuryWallet",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasury",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newTreasury",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "changeAuthority",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newAuthority",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "createRewardVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataRewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReward",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createSaberQuarryMiner",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "minerBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "stakeCollateralToSaber",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "unstakeCollateralFromSaber",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "harvestRewardsFromSaber",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataRewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUserReward",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataRatioTreasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintWrapper",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintWrapperProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "minter",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReward",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "claimFeeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "globalState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "treasury",
              "type": "publicKey"
            },
            {
              "name": "mintUsdr",
              "type": "publicKey"
            },
            {
              "name": "mintUsdrBump",
              "type": "u8"
            },
            {
              "name": "tvlLimit",
              "type": "u64"
            },
            {
              "name": "tvlUsd",
              "type": "u64"
            },
            {
              "name": "paused",
              "type": "u8"
            },
            {
              "name": "totalDebt",
              "type": "u64"
            },
            {
              "name": "globalDebtCeiling",
              "type": "u64"
            },
            {
              "name": "userDebtCeiling",
              "type": "u64"
            },
            {
              "name": "feeNum",
              "type": "u64"
            },
            {
              "name": "feeDeno",
              "type": "u64"
            },
            {
              "name": "collPerRisklv",
              "type": {
                "array": [
                  "u64",
                  10
                ]
              }
            },
            {
              "name": "oracleReporter",
              "type": "publicKey"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "oracle",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "price",
              "type": "u64"
            },
            {
              "name": "decimals",
              "type": "u8"
            },
            {
              "name": "lastUpdatedTime",
              "type": "u64"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  8
                ]
              }
            },
            {
              "name": "data",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "pool",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "mintCollat",
              "type": "publicKey"
            },
            {
              "name": "mintReward",
              "type": "publicKey"
            },
            {
              "name": "tokenADecimals",
              "type": "u8"
            },
            {
              "name": "tokenBDecimals",
              "type": "u8"
            },
            {
              "name": "tvlUsd",
              "type": "u64"
            },
            {
              "name": "totalColl",
              "type": "u64"
            },
            {
              "name": "totalDebt",
              "type": "u64"
            },
            {
              "name": "debtCeiling",
              "type": "u64"
            },
            {
              "name": "riskLevel",
              "type": "u8"
            },
            {
              "name": "platformType",
              "type": "u8"
            },
            {
              "name": "farmInfo",
              "type": "publicKey"
            },
            {
              "name": "mintTokenA",
              "type": "publicKey"
            },
            {
              "name": "mintTokenB",
              "type": "publicKey"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  4
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  4
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  4
                ]
              }
            }
          ]
        }
      },
      {
        "name": "userState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "debt",
              "type": "u64"
            },
            {
              "name": "depositedCollatUsd",
              "type": "u64"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "pool",
              "type": "publicKey"
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "mintReward",
              "type": "publicKey"
            },
            {
              "name": "ataCollatVault",
              "type": "publicKey"
            },
            {
              "name": "ataCollatVaultBump",
              "type": "u8"
            },
            {
              "name": "ataCollatMiner",
              "type": "publicKey"
            },
            {
              "name": "debt",
              "type": "u64"
            },
            {
              "name": "vaultRewardTokenANonce",
              "type": "u8"
            },
            {
              "name": "vaultRewardTokenBNonce",
              "type": "u8"
            },
            {
              "name": "depositedCollatUsd",
              "type": "u64"
            },
            {
              "name": "lastMintTime",
              "type": "u64"
            },
            {
              "name": "walletNonce",
              "type": "u8"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  8
                ]
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "PlatformType",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Saber"
            },
            {
              "name": "Unknown"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "You are not authorized to perform this action."
      },
      {
        "code": 6001,
        "name": "AlreadyInUse",
        "msg": "AlreadyInUse"
      },
      {
        "code": 6002,
        "name": "InvalidProgramAddress",
        "msg": "InvalidProgramAddress"
      },
      {
        "code": 6003,
        "name": "InvalidState",
        "msg": "InvalidState"
      },
      {
        "code": 6004,
        "name": "InvalidOwner",
        "msg": "InvalidOwner"
      },
      {
        "code": 6005,
        "name": "NotAllowed",
        "msg": "NotAllowed"
      },
      {
        "code": 6006,
        "name": "MathOverflow",
        "msg": "Math operation overflow"
      },
      {
        "code": 6007,
        "name": "InvalidOracleConfig",
        "msg": "InvalidOracleConfig"
      },
      {
        "code": 6008,
        "name": "InvalidAccountInput",
        "msg": "InvalidAccountInput"
      },
      {
        "code": 6009,
        "name": "InvalidCluster",
        "msg": "This function works on devnet only"
      },
      {
        "code": 6010,
        "name": "GlobalTVLExceeded",
        "msg": "Global TVL Exceeded"
      },
      {
        "code": 6011,
        "name": "LTVExceeded",
        "msg": "LTV Exceeded"
      },
      {
        "code": 6012,
        "name": "GlobalDebtCeilingExceeded",
        "msg": "Global Debt Ceiling Exceeded"
      },
      {
        "code": 6013,
        "name": "PoolDebtCeilingExceeded",
        "msg": "Pool Debt Ceiling Exceeded"
      },
      {
        "code": 6014,
        "name": "UserDebtCeilingExceeded",
        "msg": "User Debt Ceiling Exceeded"
      },
      {
        "code": 6015,
        "name": "WithdrawNotAllowedWithDebt",
        "msg": "Can't withdraw due to debt"
      },
      {
        "code": 6016,
        "name": "InvalidTransferAmount",
        "msg": "Transfer amount is invalid"
      },
      {
        "code": 6017,
        "name": "InvalidPlatformType",
        "msg": "Invalid platform type"
      },
      {
        "code": 6018,
        "name": "InvalidSaberPlatform",
        "msg": "Invalid saber platform"
      },
      {
        "code": 6019,
        "name": "RepayingMoreThanBorrowed",
        "msg": "Attempting to repay more than the amount originally borrowed"
      },
      {
        "code": 6020,
        "name": "RewardMintMismatch",
        "msg": "Reward mint account mismatch"
      }
    ]
  };
  
  export const IDL: StablePool = {
    "version": "0.1.0",
    "name": "stable_pool",
    "instructions": [
      {
        "name": "createGlobalState",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintUsdr",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "globalStateBump",
            "type": "u8"
          },
          {
            "name": "mintUsdrBump",
            "type": "u8"
          },
          {
            "name": "tvlLimit",
            "type": "u64"
          },
          {
            "name": "globalDebtCeiling",
            "type": "u64"
          },
          {
            "name": "userDebtCeiling",
            "type": "u64"
          },
          {
            "name": "oracleReporter",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "createPool",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintCollat",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "poolBump",
            "type": "u8"
          },
          {
            "name": "riskLevel",
            "type": "u8"
          },
          {
            "name": "debtCeiling",
            "type": "u64"
          },
          {
            "name": "platformType",
            "type": "u8"
          },
          {
            "name": "mintTokenA",
            "type": "publicKey"
          },
          {
            "name": "mintTokenB",
            "type": "publicKey"
          },
          {
            "name": "mintReward",
            "type": "publicKey"
          },
          {
            "name": "tokenADecimals",
            "type": "u8"
          },
          {
            "name": "tokenBDecimals",
            "type": "u8"
          }
        ]
      },
      {
        "name": "createUserState",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "userState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "ataCollatVaultBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "depositCollateral",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatMiner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataCollatUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintCollat",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawCollateral",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatMiner",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataCollatUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "oracleA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintMktA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintMktB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintCollat",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "withdrawAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "borrowUsdr",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "oracleA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracleB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketA",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataMarketB",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintColl",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintUsdr",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUsdr",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "borrowAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "repayUsdr",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintUsdr",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "ataUsdr",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "repayAmount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "createOracle",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "price",
            "type": "u64"
          }
        ]
      },
      {
        "name": "reportPriceToOracle",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "oracle",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "clock",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "price",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setGlobalTvlLimit",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "limit",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setGlobalDebtCeiling",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "ceiling",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setUserDebtCeiling",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "ceiling",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setPoolDebtCeiling",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "ceiling",
            "type": "u64"
          }
        ]
      },
      {
        "name": "setHarvestFee",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "feeNum",
            "type": "u64"
          }
        ]
      },
      {
        "name": "toggleEmerState",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newState",
            "type": "u8"
          }
        ]
      },
      {
        "name": "changeTreasuryWallet",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasury",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newTreasury",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "changeAuthority",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "newAuthority",
            "type": "publicKey"
          }
        ]
      },
      {
        "name": "createRewardVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataRewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReward",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "createSaberQuarryMiner",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "minerBump",
            "type": "u8"
          }
        ]
      },
      {
        "name": "stakeCollateralToSaber",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "unstakeCollateralFromSaber",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUser",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "harvestRewardsFromSaber",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "globalState",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "pool",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataRewardVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataUserReward",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataRatioTreasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "treasury",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "quarry",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "miner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "minerVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "ataCollatVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewarder",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "mintWrapper",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintWrapperProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "minter",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "mintReward",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "claimFeeTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "quarryProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "associatedTokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "globalState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "treasury",
              "type": "publicKey"
            },
            {
              "name": "mintUsdr",
              "type": "publicKey"
            },
            {
              "name": "mintUsdrBump",
              "type": "u8"
            },
            {
              "name": "tvlLimit",
              "type": "u64"
            },
            {
              "name": "tvlUsd",
              "type": "u64"
            },
            {
              "name": "paused",
              "type": "u8"
            },
            {
              "name": "totalDebt",
              "type": "u64"
            },
            {
              "name": "globalDebtCeiling",
              "type": "u64"
            },
            {
              "name": "userDebtCeiling",
              "type": "u64"
            },
            {
              "name": "feeNum",
              "type": "u64"
            },
            {
              "name": "feeDeno",
              "type": "u64"
            },
            {
              "name": "collPerRisklv",
              "type": {
                "array": [
                  "u64",
                  10
                ]
              }
            },
            {
              "name": "oracleReporter",
              "type": "publicKey"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "oracle",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "price",
              "type": "u64"
            },
            {
              "name": "decimals",
              "type": "u8"
            },
            {
              "name": "lastUpdatedTime",
              "type": "u64"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  8
                ]
              }
            },
            {
              "name": "data",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "pool",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "mintCollat",
              "type": "publicKey"
            },
            {
              "name": "mintReward",
              "type": "publicKey"
            },
            {
              "name": "tokenADecimals",
              "type": "u8"
            },
            {
              "name": "tokenBDecimals",
              "type": "u8"
            },
            {
              "name": "tvlUsd",
              "type": "u64"
            },
            {
              "name": "totalColl",
              "type": "u64"
            },
            {
              "name": "totalDebt",
              "type": "u64"
            },
            {
              "name": "debtCeiling",
              "type": "u64"
            },
            {
              "name": "riskLevel",
              "type": "u8"
            },
            {
              "name": "platformType",
              "type": "u8"
            },
            {
              "name": "farmInfo",
              "type": "publicKey"
            },
            {
              "name": "mintTokenA",
              "type": "publicKey"
            },
            {
              "name": "mintTokenB",
              "type": "publicKey"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  4
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  4
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  4
                ]
              }
            }
          ]
        }
      },
      {
        "name": "userState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "debt",
              "type": "u64"
            },
            {
              "name": "depositedCollatUsd",
              "type": "u64"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  8
                ]
              }
            }
          ]
        }
      },
      {
        "name": "vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "bump",
              "type": "u8"
            },
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "pool",
              "type": "publicKey"
            },
            {
              "name": "mint",
              "type": "publicKey"
            },
            {
              "name": "mintReward",
              "type": "publicKey"
            },
            {
              "name": "ataCollatVault",
              "type": "publicKey"
            },
            {
              "name": "ataCollatVaultBump",
              "type": "u8"
            },
            {
              "name": "ataCollatMiner",
              "type": "publicKey"
            },
            {
              "name": "debt",
              "type": "u64"
            },
            {
              "name": "vaultRewardTokenANonce",
              "type": "u8"
            },
            {
              "name": "vaultRewardTokenBNonce",
              "type": "u8"
            },
            {
              "name": "depositedCollatUsd",
              "type": "u64"
            },
            {
              "name": "lastMintTime",
              "type": "u64"
            },
            {
              "name": "walletNonce",
              "type": "u8"
            },
            {
              "name": "pubkeys",
              "type": {
                "array": [
                  "publicKey",
                  16
                ]
              }
            },
            {
              "name": "data128",
              "type": {
                "array": [
                  "u128",
                  8
                ]
              }
            },
            {
              "name": "data64",
              "type": {
                "array": [
                  "u64",
                  8
                ]
              }
            },
            {
              "name": "data32",
              "type": {
                "array": [
                  "u32",
                  8
                ]
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "PlatformType",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Saber"
            },
            {
              "name": "Unknown"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "Unauthorized",
        "msg": "You are not authorized to perform this action."
      },
      {
        "code": 6001,
        "name": "AlreadyInUse",
        "msg": "AlreadyInUse"
      },
      {
        "code": 6002,
        "name": "InvalidProgramAddress",
        "msg": "InvalidProgramAddress"
      },
      {
        "code": 6003,
        "name": "InvalidState",
        "msg": "InvalidState"
      },
      {
        "code": 6004,
        "name": "InvalidOwner",
        "msg": "InvalidOwner"
      },
      {
        "code": 6005,
        "name": "NotAllowed",
        "msg": "NotAllowed"
      },
      {
        "code": 6006,
        "name": "MathOverflow",
        "msg": "Math operation overflow"
      },
      {
        "code": 6007,
        "name": "InvalidOracleConfig",
        "msg": "InvalidOracleConfig"
      },
      {
        "code": 6008,
        "name": "InvalidAccountInput",
        "msg": "InvalidAccountInput"
      },
      {
        "code": 6009,
        "name": "InvalidCluster",
        "msg": "This function works on devnet only"
      },
      {
        "code": 6010,
        "name": "GlobalTVLExceeded",
        "msg": "Global TVL Exceeded"
      },
      {
        "code": 6011,
        "name": "LTVExceeded",
        "msg": "LTV Exceeded"
      },
      {
        "code": 6012,
        "name": "GlobalDebtCeilingExceeded",
        "msg": "Global Debt Ceiling Exceeded"
      },
      {
        "code": 6013,
        "name": "PoolDebtCeilingExceeded",
        "msg": "Pool Debt Ceiling Exceeded"
      },
      {
        "code": 6014,
        "name": "UserDebtCeilingExceeded",
        "msg": "User Debt Ceiling Exceeded"
      },
      {
        "code": 6015,
        "name": "WithdrawNotAllowedWithDebt",
        "msg": "Can't withdraw due to debt"
      },
      {
        "code": 6016,
        "name": "InvalidTransferAmount",
        "msg": "Transfer amount is invalid"
      },
      {
        "code": 6017,
        "name": "InvalidPlatformType",
        "msg": "Invalid platform type"
      },
      {
        "code": 6018,
        "name": "InvalidSaberPlatform",
        "msg": "Invalid saber platform"
      },
      {
        "code": 6019,
        "name": "RepayingMoreThanBorrowed",
        "msg": "Attempting to repay more than the amount originally borrowed"
      },
      {
        "code": 6020,
        "name": "RewardMintMismatch",
        "msg": "Reward mint account mismatch"
      }
    ]
  };
  