module.exports = {
    apps: [
        {
            name: "rf-engine",
            script: "./target/index.js",
            watch: false,
            env: {
                "PORT": 3000,
                "DBHOSTNAME": "localhost",
                "DBUSERNAME": "backuser",
                "DBPASSWORD": "Ax%wLpTYdxX6300",
                "DATABASE": "RFDATA",
                "NODE_ENV": "production",
                "TOKEN_KEY": "Random_token_key",
                "API_CORS_ALLOWED_ORIGINS": "https://demo.ratio.finance,https://app.ratio.finance,http://localhost:3000",
		"WHITELIST_MODE": "DISABLED",
		"COINGECKOINTERVAL": 5,
		"SOLANACLUSTER": "mainnet-beta",
		"RATIO_NFT_NAME":"Ratio NFT",
                "RATIO_NFT_CREATOR_ADDRESS":"C7ZQw9FKzEdXF21Ka7nMVEJdYswm4cdzugUzfMkAeNBD",
		"GENESYS_ISSUER":"https://auth.genesysgo.net/auth/realms/RPCs/protocol/openid-connect",
		"GENESYS_CLIENT_ID":"ratiofinance",
		"GENESYS_CLIENT_SECRET":"e0xusCw8rNpcACkKAJk2XhNA4KsUrND5"
            }
        }
    ]
}
